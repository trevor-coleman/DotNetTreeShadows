using System;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

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

        [HttpGet, Route( "{id:length(24)}" )]
        public async Task<ActionResult<Invitation>> Get (string id) {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            Invitation invitation = await invitationService.GetById( id );

            if ( invitation == null ) return Status404NotFound( "Invitation" );
            if ( !invitation.Involves( user.UserId ) ) return Status403Forbidden();

            return invitation;
        }

        [HttpPost]
        [Route( "{id:length(24)}/status" )]
        public async Task<ActionResult> SetStatus (
                [FromRoute] string id,
                [FromBody] InvitationStatus invitationStatus
            ) {
            if ( invitationStatus == null ) return Status400MissingRequiredField( "invitationStatus" );

            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            Invitation invitation = await invitationService.GetById( id );

            

            if ( invitation == null ) return Status404NotFound( "Invitation" );
            if ( !invitation.Involves( user.UserId ) ) return Status403Forbidden();

            return invitation.InvitationType switch {
                InvitationType.SessionInvite => await UpdateSessionInviteStatus( user.UserId, invitation, invitationStatus ),
                InvitationType.FriendRequest => await UpdateFriendRequestStatus( user.UserId, invitation, invitationStatus ),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        private async Task<ActionResult> UpdateSessionInviteStatus (string userId, Invitation invitation, InvitationStatus status) {
            Task<Profile>? senderTask = profileService.GetByIdAsync( invitation.SenderId );
            Task<Profile>? recipientTask = profileService.GetByIdAsync( invitation.RecipientId );
            Task<Session>? sessionTask = sessionService.Get( invitation.ResourceId );

            await Task.WhenAll( senderTask, recipientTask, sessionTask );

            Profile? sender = await senderTask;
            Profile? recipient = await recipientTask;
            Session? session = await sessionTask;

            return invitation.Status switch {
                InvitationStatus.Pending => Status403Forbidden(),
                InvitationStatus.Accepted => userId == recipient.Id
                                                 ? await AcceptSessionInvite( invitation, sender, recipient, session )
                                                 : Status403Forbidden(),
                InvitationStatus.Declined => userId == recipient.Id
                                                 ? await DeclineSessionInvite( invitation, recipient )
                                                 : Status403Forbidden(),
                InvitationStatus.Cancelled => userId == sender.Id
                                                  ? await CancelSessionInvite( invitation, sender, session )
                                                  : Status403Forbidden(),
                _ => throw new ArgumentOutOfRangeException()
            };
        }

        

        private async Task<ActionResult> UpdateFriendRequestStatus (string userId, Invitation invitation, InvitationStatus status) {
            Task<Profile>? senderTask = profileService.GetByIdAsync( invitation.SenderId );
            Task<Profile>? recipientTask = profileService.GetByIdAsync( invitation.RecipientId );

            await Task.WhenAll( senderTask, recipientTask);

            Profile? sender = await senderTask;
            Profile? recipient = await recipientTask;

            return status switch {
                InvitationStatus.Pending => Status403Forbidden(),
                InvitationStatus.Accepted => (userId == recipient.Id) && invitation.Status == InvitationStatus.Pending
                                                 ? await AcceptFriendRequest( invitation, sender, recipient)
                                                 : Status403Forbidden(),
                InvitationStatus.Declined => userId == recipient.Id 
                                                 ? await DeclineFriendRequest( invitation, recipient )
                                                 : Status403Forbidden(),
                InvitationStatus.Cancelled => userId == sender.Id
                                                  ? await CancelFriendRequest( invitation, sender )
                                                  : Status403Forbidden(),
                _ => throw new ArgumentOutOfRangeException()
            };
        }


        private async Task<ActionResult> DeclineFriendRequest (
                Invitation invitation,
                Profile recipient
            ) {
            
            recipient.RemoveInvitation( invitation.Id );

            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Declined(invitation) );
            Task updateRecipient = profileService.Update( recipient.Id, recipient );

            await Task.WhenAll( updateInvitation, updateRecipient );

            return Ok();
        }
        
        private async Task<ActionResult> CancelFriendRequest (
                Invitation invitation,
                Profile sender
            ) {
            
            sender.RemoveInvitation( invitation.Id );

            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Cancelled(invitation) );
            Task updateSender = profileService.Update( sender.Id, sender );
            

            await Task.WhenAll( updateInvitation, updateSender );

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
            
            Task updateRecipientTask = profileService.Update( recipient.Id, recipient );
            Task updateSenderTask = profileService.Update( sender.Id, sender );
            Task updateInvitationTask = invitationService.Update( invitation.Id, Invitation.Accepted(invitation) );

            await Task.WhenAll( updateInvitationTask, updateRecipientTask, updateSenderTask );

            return Ok();
        }
        

        private async Task<ActionResult> DeclineSessionInvite (
                Invitation invitation,
                Profile recipient
            ) {
            
            recipient.RemoveInvitation( invitation.Id );

            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Declined(invitation) );
            Task updateRecipient = profileService.Update( recipient.Id, recipient );

            await Task.WhenAll( updateInvitation, updateRecipient );

            return Ok();
        }
        
        private async Task<ActionResult> CancelSessionInvite (
                Invitation invitation,
                Profile sender,
                Session session
            ) {
            
            sender.RemoveInvitation( invitation.Id );
            session.RemoveInvitation( invitation.Id );
            
            Task updateInvitation = invitationService.Update( invitation.Id, Invitation.Cancelled(invitation) );
            Task updateSender = profileService.Update( sender.Id, sender );
            

            await Task.WhenAll( updateInvitation, updateSender );

            return Ok();
        }

        private async Task<ActionResult> AcceptSessionInvite (
                Invitation invitation,
                Profile sender,
                Profile recipient,
                Session session
            ) {
            session.AddPlayer( recipient.Id );
            recipient.AddSession( session.Id );

            session.RemoveInvitation( invitation.Id );
            recipient.RemoveInvitation( invitation.Id );
            sender.RemoveInvitation( invitation.Id );

            Task updateSessionTask = sessionService.Update( session.Id, session );
            Task updateRecipientTask = profileService.Update( recipient.Id, recipient );
            Task updateSenderTask = profileService.Update( sender.Id, sender );

            await Task.WhenAll( updateSessionTask, updateRecipientTask, updateSenderTask );

            return Ok();
        }


    }
}
