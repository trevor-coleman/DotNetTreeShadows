using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.DataModels;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.InvitationModel;
using dotnet_tree_shadows.Models.Session;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
  [Route( "api/[controller]" ), ApiController,
   Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class SessionsController : AControllerWithStatusMethods {

    private readonly SessionService sessionService;
    private readonly GameService gameService;
    private readonly BoardService boardService;
    private readonly UserManager<UserModel> userManager;
    private readonly InvitationService invitationService;

    public SessionsController (
        SessionService sessionService,
        GameService gameService,
        BoardService boardService,
        UserManager<UserModel> userManager,
        InvitationService invitationService
      ) {
      this.sessionService = sessionService;
      this.gameService = gameService;
      this.boardService = boardService;
      this.userManager = userManager;
      this.invitationService = invitationService;
    }

    [HttpGet( "{id:length(24)}", Name = "GetSession" )]
    public async Task<ActionResult<Session>> Get (string id) {
      Session? session = await sessionService.Get( id );
      if ( session == null ) return NotFound();

      UserModel currentUserModel = await userManager.GetUserAsync( HttpContext.User );
      if ( currentUserModel.UserId == null )
        return StatusCode(
            StatusCodes.Status401Unauthorized,
            new Response { Status = "Unauthorized", Message = "userId is null" }
          );

      return session;
    }

    [HttpPost]
    public async Task<ActionResult<Session>> Create () {
      UserModel user = await userManager.GetUserAsync( HttpContext.User );
      if ( user?.UserId == null ) return StatusCode( StatusCodes.Status403Forbidden );

      Session session = SessionFactory.Create( user );

      await sessionService.Create( session );

      Game game = new Game { Id = session.Id };

      Board board = BoardFactory.New( session.Id );

      GameOperations.AddPlayer( game, user.UserId );


      await gameService.Create( game );
      await boardService.Create( board );
      user.AddSession( session );
      await userManager.UpdateAsync( user );
      return CreatedAtRoute( "GetSession", new { id = session.Id }, session );
    }

    [HttpDelete]
    [Route( "{id:length(24)}" )]
    public async Task<IActionResult> Delete (string id) {
      UserModel user = await userManager.GetUserAsync( HttpContext.User );
      Session? session = await sessionService.Get( id );
      
      if ( session == null ) {
        return NotFound();
      }

      if ( user?.UserId == null || session.Host != user.UserId ) return StatusCode( StatusCodes.Status403Forbidden );
      
      
      
      List<Task<UserModel>> getPlayersTasks = new List<Task<UserModel>>();
      // ReSharper disable once ForeachCanBeConvertedToQueryUsingAnotherGetEnumerator
      foreach ( (string playerId, _) in session.Players ) {
        getPlayersTasks.Add(userManager.FindByIdAsync( playerId ));
      }  
      
      Task<List<Invitation>> getInvitationsTask = invitationService.GetMany( session.Invitations );
      List<Task> savingTasks = new List<Task>();
      
      user.RemoveSession( session.Id );
      
      Task.WaitAll( getPlayersTasks.ToArray() );
      foreach ( Task<UserModel> playersTask in getPlayersTasks ) {
        UserModel player = await playersTask;
        player.RemoveSession( session.Id );
        savingTasks.Add( userManager.UpdateAsync( player ) );
      }
      
      foreach ( Invitation invitation in await getInvitationsTask) {
        user.RemoveInvitation( invitation.Id );
        savingTasks.Add(invitationService.Update( invitation.Id, InvitationOperations.Cancel( invitation ) ));
      }
      savingTasks.Add(userManager.UpdateAsync( user ));
      savingTasks.Add(sessionService.Remove( session.Id ));

      Task.WaitAll( savingTasks.ToArray() );

      return NoContent();
    }

  }
}
