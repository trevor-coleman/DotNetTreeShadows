using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.ProfileModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
  [Route( "api/[controller]" ), ApiController,
   Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class ProfilesController : AControllerWithStatusMethods {

    private readonly UserManager<UserModel> userManager;
    private readonly InvitationService invitationService;
    private readonly SessionService sessionService;
    private readonly GameService gameService;
    private readonly IHubContext<GameHub> gameHubContext;

    public ProfilesController (UserManager<UserModel> userManager, InvitationService invitationService, SessionService sessionService, GameService gameService, IHubContext<GameHub> gameHubContext) {
      this.userManager = userManager;
      this.invitationService = invitationService;
      this.sessionService = sessionService;
      this.gameService = gameService;
      this.gameHubContext = gameHubContext;
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

    public class ProfileInfoChangeRequest {

      public string? Name { get; set; }
      public string? Email { get; set; }

    }
    
    [HttpPut] [Route( "me" )]
    public async Task<ActionResult<UserProfile>> PutMe (ProfileInfoChangeRequest profile) {
      UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
      if ( userModel == null ) return NotFound();
      userModel.HandleChangeRequest( profile );
      return userModel.UserProfile();
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

    [HttpPost]
    [Route( "me/sessions/{sessionId:length(24)}" )]
    [Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
    public async Task<ActionResult> JoinSession ([FromRoute] string sessionId) {
      Task<UserModel> userTask = userManager.GetUserAsync( HttpContext.User );
      Task<Game> gameTask = gameService.Get( sessionId );
      Session? session = await sessionService.Get( sessionId );
      if ( session == null ) return Status404NotFound( "Session" );
      if ( session.LinkEnabled == false ) return Status400Invalid( "Session is private." );
      if ( (session.Players.Count + session.Invitations.Length) >= 4 ) return Status400Invalid( "Session is full." );
      Game game = await gameTask;
      if ( game.Status != GameStatus.Preparing ) return Status400Invalid( "Game has started." );
      UserModel user = await userTask;
      if ( session.Players.Any( (kvp) => kvp.Key == user.UserId ) ) {
        return NoContent();
      }

      user.AddSession( session );
      List<Task> updateTasks = new List<Task> { userManager.UpdateAsync( user ) };
      GameOperations.AddPlayer( game, user.UserId );
      updateTasks.Add( gameService.Update( sessionId, game ) ); 
      session.Players.Add( user.UserId, PlayerSummary.CreateFromUser( user ) );
      updateTasks.Add( sessionService.Update( sessionId, session ) );
      Task.WaitAll( updateTasks.ToArray() );
      return NoContent();

    }


  }
}
