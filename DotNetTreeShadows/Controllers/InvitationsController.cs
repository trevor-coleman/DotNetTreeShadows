using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.InvitationModel;
using dotnet_tree_shadows.Models.ProfileModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
  [Route( "api/[controller]" ), ApiController,
   Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class InvitationsController : AControllerWithStatusMethods {

    private readonly UserManager<UserModel> userManager;
    private readonly SessionService sessionService;
    private readonly InvitationService invitationService;
    private GameService gameService;

    public InvitationsController (
        UserManager<UserModel> userManager,
        SessionService sessionService,
        InvitationService invitationService,
        IConfiguration configuration,
        GameService gameService
      ) {
      this.userManager = userManager;
      this.sessionService = sessionService;
      this.invitationService = invitationService;
      this.gameService = gameService;
    }
    
    [HttpGet, Route( "{id:length(24)}" )]
    public async Task<ActionResult<Invitation>> Get (string id) {
      UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
      Invitation invitation = await invitationService.GetById( id );

      if ( invitation == null ) return Status404NotFound( "Invitation" );
      if ( !invitation.Involves( userModel.UserId ) ) return Status403Forbidden();

      return invitation;
    }
    
    
    [HttpGet]
    public async Task<ActionResult<Invitation[]>> Get () {
      UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
      if ( userModel == null ) return Status403Forbidden();
      Task<List<Invitation>> receivedInvitations = invitationService.GetMany( userModel.ReceivedInvitations );
      Task<List<Invitation>> sentInvitations = invitationService.GetMany( userModel.SentInvitations );

      Invitation[] invitations = (await sentInvitations).Concat( await receivedInvitations ).ToArray();
      
      return invitations;
    }

    public class InvitationUpdate {
      
      [BsonRepresentation( BsonType.String )]
      public InvitationStatus InvitationStatus { get; set; }

    }

    [HttpPost]
    [Route( "{id:length(24)}/status" )]
    public async Task<ActionResult<Invitation>> SetStatus ([FromRoute] string id, [FromBody] InvitationUpdate invitationUpdate) {
      InvitationStatus invitationStatus = invitationUpdate.InvitationStatus;
      
      UserModel user = await userManager.GetUserAsync( HttpContext.User );
      Invitation invitation = await invitationService.GetById( id );

      if ( invitation == null ) return Status404NotFound( "Invitation" );
      if ( !invitation.Involves( user.UserId ) ) return Status403Forbidden();

      return invitation.InvitationType switch {
        InvitationType.SessionInvite => await UpdateSessionInviteStatus(
                                            user,
                                            invitation,
                                            invitationStatus
                                          ),
        InvitationType.FriendRequest => await UpdateFriendRequestStatus(
                                            user,
                                            invitation, 
                                            invitationStatus
                                          ),
        _ => throw new ArgumentOutOfRangeException()
      };
    }

    private async Task<ActionResult<Invitation>> UpdateSessionInviteStatus (
        UserModel user,
        Invitation invitation,
        InvitationStatus status
      ) {
      if(invitation==null) {throw new ArgumentNullException();}
      
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
                                       ? await DeclineSessionInvite( invitation, recipient, session )
                                       : Status403Forbidden(),
        InvitationStatus.Cancelled => user.UserId == invitation.SenderId
                                        ? await CancelSessionInvite( invitation, sender, recipient, session )
                                        : Status403Forbidden(),
        _ => throw new ArgumentOutOfRangeException()
      };
    }
    
    private async Task<ActionResult<Invitation>> UpdateFriendRequestStatus (
        UserModel user,
        Invitation invitation,
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

    private async Task<ActionResult<Invitation>> DeclineFriendRequest (Invitation invitation, UserModel recipient) {
      recipient.RemoveInvitation( invitation.Id );

      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Decline( invitation ) );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      await Task.WhenAll( updateInvitation, updateRecipient );

      return invitation;
    }

    private async Task<ActionResult<Invitation>> CancelFriendRequest (Invitation invitation, UserModel sender, UserModel recipient) {
      sender.RemoveInvitation( invitation.Id );
      recipient.RemoveInvitation( invitation.Id );

      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Cancel( invitation));
      Task updateSender = userManager.UpdateAsync( sender );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      await Task.WhenAll( updateInvitation, updateSender, updateRecipient );

      return invitation;
    }

    private async Task<ActionResult<Invitation>> AcceptFriendRequest (Invitation invitation, UserModel sender, UserModel recipient) {
      recipient.AddFriend( new FriendProfile(sender) );
      sender.AddFriend( new FriendProfile(recipient) );

      recipient.RemoveInvitation( invitation.Id );
      sender.RemoveInvitation( invitation.Id );

      await userManager.UpdateAsync( recipient );
      await userManager.UpdateAsync( sender );
      await invitationService.Update( invitation.Id, InvitationOperations.Accept( invitation ) );

      return invitation;
    }

    private async Task<ActionResult<Invitation>> DeclineSessionInvite (Invitation invitation, UserModel recipient, Session session) {

      recipient.RemoveInvitation( invitation.Id );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      session.Invitations = session.Invitations.Where( i=> i != invitation.Id ).ToArray();
      session.InvitedPlayers = session.InvitedPlayers.Where( i => i != recipient.UserId ).ToArray();

      Task updateSession = sessionService.Update( session );
      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Decline( invitation ) );
      await Task.WhenAll( updateInvitation, updateRecipient, updateSession );
      return invitation;
    }

    private async Task<ActionResult<Invitation>> CancelSessionInvite (
        Invitation invitation,
        UserModel sender,
        UserModel recipient,
        Session session
      ) {
      sender.RemoveInvitation( invitation.Id );
      recipient.RemoveInvitation( invitation.Id );
      session.Invitations = session.Invitations.Where( i=> i != invitation.Id ).ToArray();
      session.InvitedPlayers = session.InvitedPlayers.Where( i => i != recipient.UserId ).ToArray();

      Task updateInvitation = invitationService.Update( invitation.Id, InvitationOperations.Cancel( invitation ) );
      Task updateSender = userManager.UpdateAsync( sender );
      Task updateRecipient = userManager.UpdateAsync( recipient );
      Task updateSession = sessionService.Update( session );

      await Task.WhenAll( updateInvitation, updateSender, updateRecipient, updateSession );

      return invitation;
    }

    private async Task<ActionResult<Invitation>> AcceptSessionInvite (
        Invitation invitation,
        UserModel sender,
        UserModel recipient,
        Session session
      ) {
      recipient.AddSession( session );
      recipient.RemoveInvitation( invitation.Id );
      Task updateRecipient = userManager.UpdateAsync( recipient );

      Game game = await gameService.Get( session.Id );
      GameOperations.AddPlayer( game, recipient.UserId );
      Task updateGame = gameService.Update( game.Id, game );     
      
      sender.RemoveInvitation( invitation.Id );
      Task updateSender =  userManager.UpdateAsync( sender);

      session.Players.Add( recipient.UserId, PlayerSummary.CreateFromUser( recipient ));
      session.Invitations = session.Invitations.Where( i => i != invitation.Id ).ToArray();
      session.InvitedPlayers = session.InvitedPlayers.Where( i => i != recipient.UserId ).ToArray();
      Task updateSession = sessionService.Update( session.Id, session );

      Task.WaitAll( updateRecipient, updateSender, updateSession, updateGame );

      return invitation;
    }
    
    [HttpPost]
    [Route("session-invites")]
    public async Task<ActionResult<Invitation[]>> SendManySessionInvites (ManySessionInviteRequest invitationInfo) {
      string[] recipientIds = invitationInfo.RecipientIds;
      string sessionId = invitationInfo.SessionId;
      if ( sessionId == null ) return Status400MissingRequiredField( "sessionId" );
      Task<Session?> sessionTask = sessionService.Get( sessionId );
      Task<UserModel> userTask = userManager.GetUserAsync( HttpContext.User );

      Session? session = await sessionTask;
      if ( session == null ) return Status404NotFound( "Session" );

      UserModel sender = await userTask;
      if ( session.Host != sender.UserId ) return Status403Forbidden();
      if ( recipientIds.Contains( sender.UserId ) ) return Status400Invalid( "Cannot invite yourself" );

      List<Task> recipientUpdates = new List<Task>();
      List<Invitation> invitations = new List<Invitation>();
      foreach ( string recipientId in recipientIds ) {
        UserModel recipient = await userManager.FindByIdAsync( recipientId );
        if ( recipient == null ) return Status404NotFound( "Recipient" );
        if ( !recipient.HasFriend( sender.UserId ) ) return Status403Forbidden();
        if ( (await invitationService.GetMany( session.Invitations )).Any( i => {
          Console.WriteLine( $"{i.RecipientName} - {i.Status}" );
          return i.RecipientId == recipient.UserId && i.Status == InvitationStatus.Pending;
        }))
          return Status409Duplicate( $"invitation - {recipient.UserName}" );
        
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
        recipient.AddReceivedInvitation( createdInvitation.Id );
        session.Invitations = session.Invitations.Append( sessionInvitation.Id ).ToArray();
        session.InvitedPlayers = session.InvitedPlayers.Append( recipientId ).ToArray();
        recipientUpdates.Add(userManager.UpdateAsync( recipient ));
        invitations.Add( sessionInvitation );
      }
      Task allRecipientUpdates = Task.WhenAll( recipientUpdates );
      Task updateSender = userManager.UpdateAsync( sender );
      Task updateSession = sessionService.Update( session );
      
      await Task.WhenAll( updateSession, updateSender, allRecipientUpdates );

      return invitations.ToArray();
    }

    [HttpPost]
    [Route("friend-request")]
    public async Task<ActionResult> SendFriendRequest (FriendRequestRequest invitationInfo) {
      string? recipientEmailOrUsername = invitationInfo.Recipient;
      if ( recipientEmailOrUsername == null ) return Status400MissingRequiredField( $"email or username - ({recipientEmailOrUsername})" );
    
      UserModel sender = await userManager.GetUserAsync( HttpContext.User );
      UserModel recipient = await userManager.FindByEmailAsync( recipientEmailOrUsername );
      if ( recipient == null ) {
        recipient = await userManager.FindByNameAsync( recipientEmailOrUsername );
        if (recipient == null) return Status404NotFound( "recipient" );
      }
      
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

      if ( existingInvitations.Any(inv => friendRequest.IsDuplicate(inv) && (inv.Status == InvitationStatus.Pending) ) ) return Status409Duplicate( "Invitation" );

      await invitationService.CreateAsync( friendRequest );
      recipient.AddReceivedInvitation( friendRequest.Id );
      sender.AddSentInvitation( friendRequest.Id );
      Task updateRecipientTask = userManager.UpdateAsync( recipient );
      Task updateSenderTask = userManager.UpdateAsync( sender );

      await Task.WhenAll( updateRecipientTask, updateSenderTask );

      return Ok();
    }

  }
}
