using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.InvitationModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
    [Route( "api/[controller]" ), ApiController,
     Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public class ProfilesController : AControllerWithStatusMethods {
      private readonly UserManager<UserModel> userManager;
        private readonly InvitationService invitationService;

        public ProfilesController (
                
                UserManager<UserModel> userManager,
                InvitationService invitationService
            ) {
            this.userManager = userManager;
            this.invitationService = invitationService;
        }

        [HttpGet( "{id:length(24)}", Name = "GetProfile" )]
        public async Task<ActionResult<FriendProfile>> Get (string id) {
            UserModel userModel = await userManager.GetUserAsync( HttpContext.User );

            if ( !userModel.HasFriend( id )) return Status403Forbidden();

            UserModel friend = await userManager.FindByIdAsync( id );
            FriendProfile friendProfile = new FriendProfile(friend);

            return friendProfile;
        }

        [HttpGet, Route( "me" )]
        public async Task<ActionResult<UserProfile>> GetMe () {
            UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
            if ( userModel == null ) return NotFound();
            return userModel.UserProfile();
        }

        public class FriendEmail {
            [EmailAddress]
            public string Email { get; set; } = "";
        }

        [HttpGet, Route( "me/friends" )]
        public async Task<ActionResult<FriendProfile[]>> Get () {
            UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
            if ( userModel == null ) return Status500MissingProfile();

            Task<UserModel>[] userModeTasks = userModel.Friends.Select( id => userManager.FindByIdAsync( id ) ).ToArray();
            List<FriendProfile> friendProfiles = new List<FriendProfile>();
            foreach ( Task<UserModel> task in userModeTasks ) {
              friendProfiles.Add( new FriendProfile(await task));
            }
          
            return friendProfiles.ToArray();
        }

        [HttpGet, Route( "me/invitations/sent" )]
        public async Task<ActionResult<AInvitation[]>> GetSentInvitations () {
            UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
            if ( userModel == null ) return Status500MissingProfile();
            List<AInvitation> sentInvitations = await invitationService.GetMany( userModel.SentInvitations );
            return sentInvitations.ToArray();
        }

        [HttpGet, Route( "me/invitations/received" )]
        public async Task<ActionResult<AInvitation[]>> GetReceivedInvitations () {
            UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
            if ( userModel == null ) return Status500MissingProfile();
            
            List<AInvitation> receivedInvitations = await invitationService.GetMany( userModel.ReceivedInvitations );

            return receivedInvitations.ToArray();
        }

        [HttpGet, Route( "me/sessions" )]
        public async Task<ActionResult<SessionSummary[]>> GetSessions () {
            UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
            if ( userModel == null ) return Status500MissingProfile();
          

            return userModel.Sessions.ToArray();
        }

    }

}
