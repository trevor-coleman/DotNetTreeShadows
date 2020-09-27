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
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

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

        public class InvitationResponse: Invitation {
            public InvitationResponse (Invitation invitation, string senderName, string recipientName) : base(invitation) {
                SenderName = senderName;
                RecipientName = recipientName;
            }
            public string SenderName { get; set; }
            public string RecipientName { get; set; }
            
        }
        
        [HttpGet, Route( "{id:length(24)}" )]
        public async Task<ActionResult<InvitationResponse>> Get (string id) {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            Invitation invitation = await invitationService.GetById( id );

            if ( invitation == null ) return Status404NotFound( "Invitation" );
            if ( !invitation.Involves( user.UserId ) ) return Status403Forbidden();

            Profile sender = await profileService.GetByIdAsync( invitation.SenderId );
            Profile recipient = await profileService.GetByIdAsync( invitation.RecipientId );
            
            InvitationResponse invitationResponse = new InvitationResponse( invitation, sender.Name, recipient.Name );
            
            return invitationResponse;
        }

        public class InvitationUpdate {
            [JsonConverter(typeof(StringEnumConverter))]
            [BsonRepresentation(BsonType.String)]
            public InvitationStatus InvitationStatus {
                    get;
                    set;
                }
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

            return status switch {
                InvitationStatus.Pending => Status403Forbidden(),
                InvitationStatus.Accepted => userId == recipient.Id && !session.HasPlayer( recipient.Id )
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
            
            await profileService.Update( recipient.Id, recipient );
            await profileService.Update( sender.Id, sender );
            await invitationService.Update( invitation.Id, Invitation.Accepted(invitation) );

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
            session.AddPlayer( recipient );
            recipient.AddSession( session.Id );

            session.RemoveInvitation( invitation.Id );
            recipient.RemoveInvitation( invitation.Id );
            sender.RemoveInvitation( invitation.Id );

            await sessionService.Update( session.Id, session );
            await  profileService.Update( recipient.Id, recipient );
            await  profileService.Update( sender.Id, sender );

            return Ok();
        }


    }
}
