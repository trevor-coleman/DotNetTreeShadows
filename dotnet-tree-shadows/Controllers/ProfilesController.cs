using System;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController,
     Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public class ProfilesController : ControllerBase {

        private readonly ProfileService profileService;
        private UserManager<ApplicationUser> userManager;

        public ProfilesController (ProfileService profileService, UserManager<ApplicationUser> userManager) {
            this.profileService = profileService;
            this.userManager = userManager;
        }

        [HttpGet( "id:length(24)", Name = "GetProfile" )]
        public async Task<ActionResult<Profile>> Get (string id) => await profileService.GetByIdAsync( id );

        [HttpGet, Route( "me" )]
        public async Task<ActionResult<Profile>> Get () {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            if ( user == null ) return NotFound();
            return await profileService.GetByIdAsync( user.Id.ToString() );
        }

        [HttpPut, Route( "me/invitations" )]
        public async Task<ActionResult> UpdateInvitation ([FromBody] Invitation invitation) {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            if ( user == null )
                return StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new Response {
                                         Status = "Missing Account Data",
                                         Message = "Cannot find authenticated user account."
                                     }
                    );

            string userId = user.Id.ToString();

            if ( userId != invitation.SenderId && userId != invitation.ResourceId )
                return StatusCode( StatusCodes.Status403Forbidden );

            switch ( invitation.InvitationType ) {
                case InvitationType.Session: break;
                case InvitationType.FriendRequest:
                    return await HandleUpdatedFriendRequest( userId, invitation );
                default: throw new ArgumentOutOfRangeException();
            }

            return StatusCode( StatusCodes.Status500InternalServerError, new Response {
                                                                           Status = "Got to the end",
                                                                           Message = $"{invitation}"
                                                                       } );
        }

        private async Task<ActionResult> HandleUpdatedFriendRequest (string userId, Invitation invitation) {
            
            Profile sender = await profileService.GetByIdAsync( invitation.SenderId );
            Profile receiver = await profileService.GetByIdAsync( invitation.ResourceId );

            return invitation.Status switch {
                InvitationStatus.Pending => NoContent(),
                InvitationStatus.Accepted => userId == receiver.Id
                                                 ? await AcceptFriendRequest( invitation, sender, receiver )
                                                 : StatusCode( StatusCodes.Status403Forbidden ),
                InvitationStatus.Declined => NoContent(),
                InvitationStatus.Cancelled => NoContent(),
                InvitationStatus.Error => NoContent(),
                null => NoContent(),
                _ => throw new ArgumentOutOfRangeException()
            };
        }
        
        private async Task<ActionResult> AcceptFriendRequest (Invitation invitation, Profile sender, Profile receiver) {
            bool invitationExists = sender.HasSentInvitation( invitation ) && receiver.HasReceivedInvitation( invitation );
            
            if ( !invitationExists ) {
                return StatusCode( StatusCodes.Status403Forbidden );
            }
            
            sender.AddFriend( receiver );
            receiver.AddFriend( sender );
            
            sender.RemoveInvitation( invitation );
            receiver.RemoveInvitation( invitation );
            sender.RemoveInverseInvitation( invitation );
            receiver.RemoveInverseInvitation( invitation );
            
            await profileService.Update( sender.Id, sender );
            await profileService.Update( receiver.Id, receiver );

            return Ok();
        }
        

        //TODO: Normalize Invites -- put in separate collection and reference with IDs 

        [HttpPost, Route( "me/friends" )]
        public async Task<ActionResult> InviteFriend ([FromBody] Invitation invitation) {
            ApplicationUser user = await userManager.GetUserAsync( HttpContext.User );
            if ( user == null )
                return StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new Response {
                                         Status = "Missing Account Data",
                                         Message = "Cannot find authenticated user account."
                                     }
                    );

            string userId = user.Id.ToString();

            if ( userId != invitation.SenderId ) {
                return StatusCode(
                        StatusCodes.Status403Forbidden,
                        new Response {
                                         Status = "userId must match SenderId",
                                         Message = $"{userId} -- {invitation.SenderId}"
                                     }
                    );
            }

            Profile userProfile = await profileService.GetByIdAsync( userId );
            if ( userProfile == null )
                return StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new Response {
                                         Status = "Missing Profile Data",
                                         Message = "UsedId Authenticated, but user profile data is missing."
                                     }
                    );

            string friendId = invitation.ResourceId;
            if ( userProfile.Friends.Contains( friendId ) ) {
                return StatusCode(
                        StatusCodes.Status409Conflict,
                        new Response { Status = "Friend exists", Message = "Already friends with that user." }
                    );
            }

            if ( friendId == null )
                return StatusCode(
                        StatusCodes.Status500InternalServerError,
                        new Response { Status = "FriendId is null", Message = "FriendId is required" }
                    );

            Profile friendProfile = await profileService.GetByIdAsync( friendId );
            if ( friendProfile == null ) return NotFound();

            Invitation newInvitation = new Invitation( userId, friendId, InvitationType.FriendRequest );

            if ( friendProfile.ReceivedInvitations.Any( i => newInvitation.IsDuplicate( i ) ) ) {
                return StatusCode(
                        StatusCodes.Status409Conflict,
                        new Response {
                                         Status = "Duplicate Invitation",
                                         Message = "An identical invitation already exists."
                                     }
                    );
            }

            friendProfile.ReceivedInvitations.Add( newInvitation );
            userProfile.SentInvitations.Add( newInvitation );
            profileService.Update( friendId, friendProfile );
            profileService.Update( userId, userProfile );

            return Ok();
        }

    }
}
