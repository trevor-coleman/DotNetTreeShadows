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

    public ProfilesController (UserManager<UserModel> userManager, InvitationService invitationService) {
      this.userManager = userManager;
      this.invitationService = invitationService;
    }

    [HttpGet( "{id:length(24)}", Name = "GetProfile" )]
    public async Task<ActionResult<FriendProfile>> Get (string id) {
      UserModel userModel = await userManager.GetUserAsync( HttpContext.User );

      if ( !userModel.HasFriend( id ) ) return Status403Forbidden();

      UserModel friend = await userManager.FindByIdAsync( id );
      FriendProfile friendProfile = new FriendProfile( friend );

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

      return userModel.Friends.ToArray();
    }

    [HttpDelete, Route( "me/friends/{friendId:length(24)}" )]
    public async Task<ActionResult<FriendProfile[]>> DeleteFriend ([FromRoute] string friendId) {
      UserModel user = await userManager.GetUserAsync( HttpContext.User );
      UserModel friend = await userManager.FindByIdAsync( friendId );

      if ( !user.HasFriend( friend.UserId ) ) return Status400Invalid( "Not friends with that user" );

      user.RemoveFriend( friend );
      friend.RemoveFriend( user );

      await userManager.UpdateAsync( user );
      await userManager.UpdateAsync( friend );
      

      return NoContent();
    }

    [HttpGet, Route( "me/sessions" )]
    public async Task<ActionResult<SessionSummary[]>> GetSessions () {
      UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
      if ( userModel == null ) return Status500MissingProfile();

      return userModel.Sessions.ToArray();
    }

  }
}
