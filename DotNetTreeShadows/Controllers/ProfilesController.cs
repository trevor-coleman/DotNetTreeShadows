using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController,
     Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public class ProfilesController : AControllerWithStatusMethods {

        private readonly ProfileService profileService;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SessionService sessionService;
        private readonly InvitationService invitationService;

        public ProfilesController (
                ProfileService profileService,
                UserManager<ApplicationUser> userManager,
                SessionService sessionService,
                InvitationService invitationService
            ) {
            this.profileService = profileService;
            this.userManager = userManager;
            this.sessionService = sessionService;
            this.invitationService = invitationService;
        }

        [HttpGet( "id:length(24)", Name = "GetProfile" )]
        public async Task<ActionResult<Profile>> Get (string id) => await profileService.GetByIdAsync( id );

        [HttpGet, Route( "me" )]
        public async Task<ActionResult<Profile>> Get () {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            if ( user == null ) return NotFound();
            return await profileService.GetByIdAsync( user.UserId );
        }

        //TODO: Normalize Invites -- put in separate collection and reference with IDs 

        [HttpPost, Route( "me/friends" )]
        public async Task<ActionResult> InviteFriend ([FromBody][EmailAddress] string recipientEmail) {
            if ( recipientEmail == null ) return Status400MissingRequiredField( "email" );
            
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            ApplicationUser recipientUser = await userManager.FindByEmailAsync( recipientEmail );
            if ( user == null ) return Status500MissingProfile();


            Profile sender = await profileService.GetByIdAsync( user.UserId );
            if ( sender == null ) return Status500MissingProfile();

            if ( sender.HasFriend( recipientUser.UserId ) ) {
                return Status409Duplicate( "Friend" );
            }

            Profile recipient = await profileService.GetByIdAsync( recipientUser.UserId );
            if ( recipient == null ) return Status404NotFound( "Recipient" );
            if ( recipient.Id == sender.Id ) return Status400Invalid( "Reciever" );

            Invitation friendRequest = Invitation.FriendRequest( sender.Id, recipient.Id );

            List<Invitation>? existingInvitations =
                await invitationService.GetMany( recipient.ReceivedInvitations );

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
