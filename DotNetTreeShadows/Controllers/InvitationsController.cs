using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.DataModels;
using dotnet_tree_shadows.Models.InvitationModel;
using dotnet_tree_shadows.Models.Session;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
  [Route( "api/[controller]" ), ApiController,
   Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class InvitationsController : AControllerWithStatusMethods {

    private readonly UserManager<UserModel> userManager;
    private readonly SessionService sessionService;
    private readonly InvitationService invitationService;

    public InvitationsController (
        UserManager<UserModel> userManager,
        SessionService sessionService,
        InvitationService invitationService,
        IConfiguration configuration
      ) {
      this.userManager = userManager;
      this.sessionService = sessionService;
      this.invitationService = invitationService;
    }
    
    [HttpGet, Route( "{id:length(24)}" )]
    public async Task<ActionResult<Invitation>> Get (string id) {
      UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
      Invitation invitation = await invitationService.GetById( id );

      if ( invitation == null ) return Status404NotFound( "Invitation" );
      if ( !invitation.Involves( userModel.UserId ) ) return Status403Forbidden();

      return invitation;
    }

    public class InvitationUpdate {

      [JsonConverter( typeof( StringEnumConverter ) )]
      [BsonRepresentation( BsonType.String )]
      public InvitationStatus InvitationStatus { get; set; }

    }

    [HttpPost]
    [Route( "{id:length(24)}/status" )]
    public async Task<ActionResult> SetStatus ([FromRoute] string id, [FromBody] InvitationUpdate invitationUpdate) {
      InvitationStatus invitationStatus = invitationUpdate.InvitationStatus;
      
      UserModel user = await userManager.GetUserAsync( HttpContext.User );
      Invitation invitation = await invitationService.GetById( id );

      if ( invitation == null ) return Status404NotFound( "Invitation" );
      if ( !invitation.Involves( user.UserId ) ) return Status403Forbidden();

      return invitation.InvitationType switch {
        InvitationType.SessionInvite => await UpdateSessionInviteStatus(
                                            user,
                                            (SessionInvite) invitation,
                                            invitationStatus
                                          ),
        InvitationType.FriendRequest => await UpdateFriendRequestStatus(
                                            user,
                                            (FriendRequest) invitation,
                                            invitationStatus
                                          ),
        _ => throw new ArgumentOutOfRangeException()
      };
    }

    private async Task<ActionResult> UpdateSessionInviteStatus (
        UserModel user,
        SessionInvite invitation,
        InvitationStatus status
      ) {
      
      Session? session = await sessionService.Get( invitation.ResourceId );
      if ( session == null ) return Status404NotFound( "Session" );

      UserModel recipient = invitation.RecipientId == user.UserId
                              ? user
                              : await userManager.FindByIdAsync( invitation.RecipientId );

      UserModel sender = invitation.SenderId == user.UserId
                              ? user
                              : await userManager.FindByIdAsync( invitation.SenderId );


      if ( sender == null ) return Status404NotFound( "Sender" );
      if ( recipient == null ) return Status404NotFound( "Recipient" );
      
      
      return status switch {
        InvitationStatus.Pending => Status403Forbidden(),
        InvitationStatus.Accepted => user.UserId == recipient.UserId && !session.HasPlayer( recipient.UserId )
                                       ? await AcceptSessionInvite( invitation, sender, recipient, session )
                                       : Status403Forbidden(),
        InvitationStatus.Declined => user.UserId == recipient.UserId
                                       ? await DeclineSessionInvite( invitation, recipient )
                                       : Status403Forbidden(),
        InvitationStatus.Cancelled => user.UserId == invitation.SenderId
                                        ? await CancelSessionInvite( invitation, sender, recipient, session )
                                        : Status403Forbidden(),
        _ => throw new ArgumentOutOfRangeException()
      };
    }
    
    private async Task<ActionResult> UpdateFriendRequestStatus (
        UserModel user,
        FriendRequest invitation,
        InvitationStatus status
      ) {
      
      UserModel recipient = invitation.RecipientId == user.UserId
                              ? user
                              : await userManager.FindByIdAsync( invitation.RecipientId );

      UserModel sender = invitation.SenderId == user.UserId
                           ? user
                           : await userManager.FindByIdAsync( invitation.SenderId );

      if ( sender == null ) return Status404NotFound( "Sender" );
      if ( recipient == null ) return Status404NotFound( "Recipient" );
      
      return status switch {
        InvitationStatus.Pending => Status403Forbidden(),
        InvitationStatus.Accepted => (user.UserId == invitation.RecipientId) && invitation.Status == InvitationStatus.Pending
                                       ? await AcceptFriendRequest( invitation, sender, recipient )
                                       : Status403Forbidden(),
        InvitationStatus.Declined => user.UserId == invitation.RecipientId
                                       ? await DeclineFriendRequest( invitation, recipient )
                                       : Status403Forbidden(),
        InvitationStatus.Cancelled => user.UserId == invitation.SenderId
                                        ? await CancelFriendRequest( invitation, sender, recipient )
                                        : Status403Forbidden(),
        _ => throw new ArgumentOutOfRangeException()
      };
    }

    private async Task<ActionResult> DeclineFriendRequest (FriendRequest invitation, UserModel recipient) {
      recipient.RemoveInvitation( invitation.Id );

      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Decline( invitation ) );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      await Task.WhenAll( updateInvitation, updateRecipient );

      return Ok();
    }

    private async Task<ActionResult> CancelFriendRequest (FriendRequest invitation, UserModel sender, UserModel recipient) {
      sender.RemoveInvitation( invitation.Id );
      recipient.RemoveInvitation( invitation.Id );

      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Cancel( invitation));
      Task updateSender = userManager.UpdateAsync( sender );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      await Task.WhenAll( updateInvitation, updateSender, updateRecipient );

      return Ok();
    }

    private async Task<ActionResult> AcceptFriendRequest (FriendRequest invitation, UserModel sender, UserModel recipient) {
      recipient.AddFriend( sender.UserId );
      sender.AddFriend( recipient.UserId );

      recipient.RemoveInvitation( invitation.Id );
      sender.RemoveInvitation( invitation.Id );

      await userManager.UpdateAsync( recipient );
      await userManager.UpdateAsync( sender );
      await invitationService.Update( invitation.Id, InvitationOperations.Accept( invitation ) );

      return Ok();
    }

    private async Task<ActionResult> DeclineSessionInvite (SessionInvite invitation, UserModel recipient) {
      recipient.RemoveInvitation( invitation.Id );

      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Decline( invitation ) );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      await Task.WhenAll( updateInvitation, updateRecipient );

      return Ok();
    }

    private async Task<ActionResult> CancelSessionInvite (
        SessionInvite invitation,
        UserModel sender,
        UserModel recipient,
        Session session
      ) {
      sender.RemoveInvitation( invitation.Id );
      recipient.RemoveInvitation( invitation.Id );
      session.Invitations = session.Invitations.Where( i=> i != invitation.Id ).ToArray();

      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Cancel( invitation ) );
      Task updateSender = userManager.UpdateAsync( sender );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      await Task.WhenAll( updateInvitation, updateSender, updateRecipient );

      return Ok();
    }

    private async Task<ActionResult> AcceptSessionInvite (
        SessionInvite invitation,
        UserModel sender,
        UserModel recipient,
        Session session
      ) {
      session.Players.Add( recipient.UserId, PlayerSummary.CreateFromUser( recipient ));
      recipient.AddSession( session );

      session.Invitations = session.Invitations.Where( i => i != invitation.Id ).ToArray();
      recipient.RemoveInvitation( invitation.Id );
      sender.RemoveInvitation( invitation.Id );

      await sessionService.Update( session.Id, session );
      await userManager.UpdateAsync( recipient );
      await userManager.UpdateAsync( sender);
      

      return Ok();
    }

    [HttpPost]
    [Route("session-invite")]
    public async Task<ActionResult> SendSessionInvite (SessionInviteRequest invitationInfo) {
      string recipientId = invitationInfo.RecipientId;
      string sessionId = invitationInfo.SessionId;
      if ( sessionId == null ) return Status400MissingRequiredField( "sessionId" );
      Task<Session?> sessionTask = sessionService.Get( sessionId );
      Task<UserModel> userTask = userManager.GetUserAsync( HttpContext.User );

      Session? session = await sessionTask;
      if ( session == null ) return Status404NotFound( "Session" );

      UserModel sender = await userTask;
      if ( session.Host != sender.UserId ) return Status403Forbidden();
      if ( sender.UserId == recipientId ) return Status400Invalid( "recipientID" );

      UserModel recipient = await userManager.FindByIdAsync( recipientId );

      if ( recipient == null ) return Status404NotFound( "Recipient" );
      if ( !recipient.HasFriend( sender.UserId ) ) return Status403Forbidden();

      if ( (await invitationService.GetMany( session.Invitations )).Any( i => i.RecipientId == recipient.UserId ) )
        return Status409Duplicate( "invitation" );

      SessionInvite sessionInvitation = new SessionInvite(){
        SenderId = sender.UserId,
        SenderName = sender.UserName,
        RecipientId = recipient.UserId,
        RecipientName = recipient.UserName,
        ResourceId = session.Id,
        ResourceName = session.Name
      };

      
      Invitation createdInvitation = await invitationService.CreateAsync( sessionInvitation );

      sender.AddSentInvitation( createdInvitation.Id );
      Task updateSender = userManager.UpdateAsync( sender );

      recipient.AddReceivedInvitation( createdInvitation.Id );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      session.Invitations = session.Invitations.Append( sessionInvitation.Id ).ToArray();
      Task updateSession = sessionService.Update( session );

      await Task.WhenAll( updateSession, updateSender, updateRecipient );

      return Ok();
    }

    [HttpPost]
    [Route("friend-request")]
    public async Task<ActionResult> SendFriendRequest (FriendRequestRequest invitationInfo) {
      string? recipientEmail = invitationInfo.Email;
      if ( recipientEmail == null ) return Status400MissingRequiredField( "email" );

      UserModel sender = await userManager.GetUserAsync( HttpContext.User );
      UserModel recipient = await userManager.FindByEmailAsync( recipientEmail );
      if ( recipient == null ) return Status404NotFound( "recipient" );
      
      if ( sender.HasFriend( recipient.UserId ) ) {
        return Status409Duplicate( "Friend" );
      }
      
      if ( recipient.Id == sender.Id ) return Status400Invalid( "Recipient" );

      string newId = ObjectId.GenerateNewId().ToString();
      
      FriendRequest friendRequest = new FriendRequest() {
        Id=newId,
        SenderId = sender.UserId,
        SenderName = sender.UserName,
        RecipientId = recipient.UserId,
        RecipientName = recipient.UserName,
        Created = DateTime.UtcNow,
        Status = InvitationStatus.Pending,
      };

      List<Invitation> existingInvitations = await invitationService.GetMany( recipient.ReceivedInvitations );

      if ( existingInvitations.Any( friendRequest.IsDuplicate ) ) return Status409Duplicate( "Invitation" );

      await invitationService.CreateAsync( friendRequest );
      recipient.AddReceivedInvitation( friendRequest.Id );
      sender.AddSentInvitation( friendRequest.Id );
      Task updateRecipientTask = userManager.UpdateAsync( recipient );
      Task updateSenderTask = userManager.UpdateAsync( sender );

      await Task.WhenAll( updateRecipientTask, updateSenderTask );

      return Ok();
    }

  }

  public class InvitationResponse {

    public InvitationStatus InvitationStatus { get; set; }

  }
}
