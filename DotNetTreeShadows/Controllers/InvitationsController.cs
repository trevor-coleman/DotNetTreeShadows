using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
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
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ProfileService profileService;
        private readonly SessionService sessionService;
        private readonly InvitationService invitationService;

        public InvitationsController (
                UserManager<ApplicationUser> userManager,
                ProfileService profileService,
                SessionService sessionService,
                InvitationService invitationService,
                IConfiguration configuration
            ) {
            this.userManager = userManager;
            this.profileService = profileService;
            this.sessionService = sessionService;
            this.invitationService = invitationService;
        }

        
        
        [HttpPost]
        public async Task<ActionResult> Invite (NewInvitationDto invitationInfo) {
            return invitationInfo.InvitationType switch {
                InvitationType.SessionInvite => await SendSessionInvite( invitationInfo ),
                InvitationType.FriendRequest => await SendFriendRequest( invitationInfo ),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        [HttpGet, Route( "{id:length(24)}" )]
        public async Task<ActionResult<InvitationResponseDto>> Get (string id) {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            Invitation invitation = await invitationService.GetById( id );

            if ( invitation == null ) return Status404NotFound( "Invitation" );
            if ( !invitation.Involves( user.UserId ) ) return Status403Forbidden();
            
            InvitationResponseDto invitationResponseDto = new InvitationResponseDto( invitation );

            return invitationResponseDto;
        }

        public class InvitationUpdate {
            [JsonConverter( typeof( StringEnumConverter ) )]
            [BsonRepresentation( BsonType.String )]
            public InvitationStatus InvitationStatus { get; set; }
        }

        [HttpPost]
        [Route( "{id:length(24)}/status" )]
        public async Task<ActionResult> SetStatus (
                [FromRoute] string id,
                [FromBody] InvitationUpdate invitationUpdate
            ) {
            InvitationStatus invitationStatus = invitationUpdate.InvitationStatus;
            if ( invitationStatus == null ) return Status400MissingRequiredField( "invitationStatus" );

            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            Invitation invitation = await invitationService.GetById( id );

            if ( invitation == null ) return Status404NotFound( "Invitation" );
            if ( !invitation.Involves( user.UserId ) ) return Status403Forbidden();

            return invitation.InvitationType switch {
                InvitationType.SessionInvite => await UpdateSessionInviteStatus(
                                                        user.UserId,
                                                        invitation,
                                                        invitationStatus
                                                    ),
                InvitationType.FriendRequest => await UpdateFriendRequestStatus(
                                                        user.UserId,
                                                        invitation,
                                                        invitationStatus
                                                    ),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        private async Task<ActionResult> UpdateSessionInviteStatus (
                string userId,
                Invitation invitation,
                InvitationStatus status
            ) {
            Task<Profile> senderTask = profileService.GetByIdAsync( invitation.SenderId );
            Task<Profile> recipientTask = profileService.GetByIdAsync( invitation.RecipientId );
            Task<Session> sessionTask = sessionService.Get( invitation.ResourceId );

            await Task.WhenAll( senderTask, recipientTask, sessionTask );

            Profile sender = await senderTask;
            Profile recipient = await recipientTask;
            Session session = await sessionTask;

            return status switch {
                InvitationStatus.Pending => Status403Forbidden(),
                InvitationStatus.Accepted => userId == recipient.Id && !session.HasPlayer( recipient.Id )
                                                 ? await AcceptSessionInvite( invitation, sender, recipient, session )
                                                 : Status403Forbidden(),
                InvitationStatus.Declined => userId == recipient.Id
                                                 ? await DeclineSessionInvite( invitation, recipient )
                                                 : Status403Forbidden(),
                InvitationStatus.Cancelled => userId == sender.Id
                                                  ? await CancelSessionInvite( invitation, sender, recipient, session )
                                                  : Status403Forbidden(),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        private async Task<ActionResult> UpdateFriendRequestStatus (
                string userId,
                Invitation invitation,
                InvitationStatus status
            ) {
            Task<Profile> senderTask = profileService.GetByIdAsync( invitation.SenderId );
            Task<Profile> recipientTask = profileService.GetByIdAsync( invitation.RecipientId );

            await Task.WhenAll( senderTask, recipientTask );

            Profile sender = await senderTask;
            Profile recipient = await recipientTask;

            return status switch {
                InvitationStatus.Pending => Status403Forbidden(),
                InvitationStatus.Accepted => (userId == recipient.Id) && invitation.Status == InvitationStatus.Pending
                                                 ? await AcceptFriendRequest( invitation, sender, recipient )
                                                 : Status403Forbidden(),
                InvitationStatus.Declined => userId == recipient.Id
                                                 ? await DeclineFriendRequest( invitation, recipient )
                                                 : Status403Forbidden(),
                InvitationStatus.Cancelled => userId == sender.Id
                                                  ? await CancelFriendRequest( invitation, sender, recipient )
                                                  : Status403Forbidden(),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        private async Task<ActionResult> DeclineFriendRequest (Invitation invitation, Profile recipient) {
            recipient.RemoveInvitation( invitation.Id );

            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Declined( invitation ) );
            Task updateRecipient = profileService.Update( recipient.Id, recipient );

            await Task.WhenAll( updateInvitation, updateRecipient );

            return Ok();
        }

        private async Task<ActionResult> CancelFriendRequest (Invitation invitation, Profile sender, Profile recipient) {
            sender.RemoveInvitation( invitation.Id );
            recipient.RemoveInvitation( invitation.Id );

            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Cancelled( invitation ) );
            Task updateSender = profileService.Update( sender.Id, sender );
            Task updateRecipient = profileService.Update( recipient.Id, recipient );
            

            await Task.WhenAll( updateInvitation, updateSender, updateRecipient );

            return Ok();
        }

        private async Task<ActionResult> AcceptFriendRequest (
                Invitation invitation,
                Profile sender,
                Profile recipient
            ) {
            recipient.AddFriend( sender.Id );
            sender.AddFriend( recipient.Id );

            recipient.RemoveInvitation( invitation.Id );
            sender.RemoveInvitation( invitation.Id );

            await profileService.Update( recipient.Id, recipient );
            await profileService.Update( sender.Id, sender );
            await invitationService.Update( invitation.Id, Invitation.Accepted( invitation ) );

            return Ok();
        }

        private async Task<ActionResult> DeclineSessionInvite (Invitation invitation, Profile recipient) {
            recipient.RemoveInvitation( invitation.Id );

            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Declined( invitation ) );
            Task updateRecipient = profileService.Update( recipient.Id, recipient );

            await Task.WhenAll( updateInvitation, updateRecipient );

            return Ok();
        }

        private async Task<ActionResult> CancelSessionInvite (Invitation invitation, Profile sender, Profile recipient, Session session) {
            sender.RemoveInvitation( invitation.Id );
            recipient.RemoveInvitation( invitation.Id );
            session.RemoveInvitation( invitation.Id );

            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Cancelled( invitation ) );
            Task updateSender = profileService.Update( sender.Id, sender );
            Task updateRecipient = profileService.Update( recipient.Id, recipient );

            await Task.WhenAll( updateInvitation, updateSender, updateRecipient );

            return Ok();
        }

        private async Task<ActionResult> AcceptSessionInvite (
                Invitation invitation,
                Profile sender,
                Profile recipient,
                Session session
            ) {
            session.AddPlayer( recipient );
            recipient.AddSession( session );

            session.RemoveInvitation( invitation.Id );
            recipient.RemoveInvitation( invitation.Id );
            sender.RemoveInvitation( invitation.Id );

            await sessionService.Update( session.Id, session );
            await profileService.Update( recipient.Id, recipient );
            await profileService.Update( sender.Id, sender );

            return Ok();
        }

        

        public async Task<ActionResult> SendSessionInvite (NewInvitationDto invitationInfo) {
            string? recipientId = invitationInfo.RecipientId;
            string? sessionId = invitationInfo.SessionId;
            if ( sessionId == null ) return Status400MissingRequiredField( "sessionId" );
            Task<Session> sessionTask =  sessionService.Get( invitationInfo.SessionId );
            Task<ApplicationUser>? userTask =  userManager.GetUserAsync( HttpContext.User );
            
            Session session = await sessionTask;
            if ( session == null ) return Status404NotFound( "Session" );

            ApplicationUser user = await userTask;
            if ( session.Host != user.UserId ) return Status403Forbidden();
            if ( user.UserId == recipientId ) return Status400Invalid( "recipientID" );

            Task<Profile> senderTask = profileService.GetByIdAsync( user.UserId );
            Task<Profile> recipientTask = profileService.GetByIdAsync( recipientId );

            await Task.WhenAll( senderTask, recipientTask );

            Profile sender = await senderTask;
            Profile recipient = await recipientTask;
            
            if ( recipient == null ) return Status404NotFound( "Recipient" );
            if ( !recipient.HasFriend( sender.Id ) ) return Status403Forbidden();
            if ( session.HasInvited( recipient.Id ) ) return Status409Duplicate( "Invitation - Session" );

            Invitation sessionInvitation = Invitation.SessionInvitation( sender, recipient, session );

            List<Invitation> recipientInvitations =
                await invitationService.GetMany( recipient.ReceivedInvitations );

            if ( recipientInvitations.Any( sessionInvitation.IsDuplicate ) ) return Status409Duplicate( "Invitation - Recipient" );

            Invitation createdInvitation = await invitationService.CreateAsync( sessionInvitation );
            
            sender.AddSentInvitation( createdInvitation.Id );
            Task updateSender = profileService.Update( sender.Id, sender );
            
            recipient.AddReceivedInvitation( createdInvitation.Id );
            Task updateRecipient = profileService.Update( recipientId, recipient );
            
            session.AddInvitation( createdInvitation.Id );
            Task updateSession = sessionService.Update( session.Id, session );
            

            await Task.WhenAll( updateSession, updateSender, updateRecipient );

            return Ok();
            
        }

        public async Task<ActionResult>  SendFriendRequest (NewInvitationDto invitationInfo) {
            string? recipientEmail = invitationInfo.Email;
            if ( recipientEmail == null ) return Status400MissingRequiredField( "email" );

            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            ApplicationUser recipientUser = await userManager.FindByEmailAsync( recipientEmail );
            if ( user == null ) return Status500MissingProfile();
            if ( recipientUser == null ) return Status404NotFound( "recipient" );

            Profile sender = await profileService.GetByIdAsync( user.UserId );
            if ( sender == null ) return Status500MissingProfile();

            if ( sender.HasFriend( recipientUser.UserId ) ) {
                return Status409Duplicate( "Friend" );
            }

            Profile recipient = await profileService.GetByIdAsync( recipientUser.UserId );
            if ( recipient == null ) return Status404NotFound( "Recipient" );
            if ( recipient.Id == sender.Id ) return Status400Invalid( "Recipient" );

            Invitation friendRequest = Invitation.FriendRequest( sender, recipient );

            List<Invitation> existingInvitations = await invitationService.GetMany( recipient.ReceivedInvitations );

            if ( existingInvitations.Any( friendRequest.IsDuplicate ) ) return Status409Duplicate( "Invitation" );

            Invitation createdInvitation = await invitationService.CreateAsync( friendRequest );
            recipient.AddReceivedInvitation( createdInvitation.Id );
            sender.AddSentInvitation( createdInvitation.Id );
            Task updateRecipientTask = profileService.Update( recipient.Id, recipient );
            Task updateSenderTask = profileService.Update( sender.Id, sender );

            await Task.WhenAll( updateRecipientTask, updateSenderTask );

            return Ok();
        }

    }
}
