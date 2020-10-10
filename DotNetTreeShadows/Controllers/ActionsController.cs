using System;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
// ReSharper disable ConditionIsAlwaysTrueOrFalse

namespace dotnet_tree_shadows.Controllers {
  [ApiController, Route( "/api/sessions/{sessionId:length(24)}/[controller]" ),
   Authorize( Roles = UserRoles.User, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class ActionsController : AControllerWithStatusMethods {

    private readonly SessionService sessionService;
    private readonly UserManager<UserModel> userManager;
    private ActionFactory actionFactory;

    public ActionsController (SessionService sessionService, UserManager<UserModel> userManager, GameService gameService, BoardService boardService) {
      this.sessionService = sessionService;
      this.userManager = userManager;
      actionFactory = new ActionFactory( gameService, boardService,sessionService );
    }

    [HttpPost]
    public async Task<ActionResult> DoAction (
        [FromRoute] string sessionId,
        [FromBody] ActionRequest actionRequest
      ) {

      UserModel userModel = await userManager.GetUserAsync( HttpContext.User );
      if ( userModel?.UserId == null ) return Status403Forbidden();
      
      
      if ( sessionId == null ) return NotFound();
      Task<Session?> sessionTask = sessionService.Get( sessionId );
      
      Session? session = await sessionTask;
      if ( session == null ) return Status404NotFound( "Session" );

      if ( !session.HasPlayer( userModel.UserId ) ) return Status403Forbidden();
      
      string? failureMessage = null;

      try {
        AActionParams actionParams = await actionFactory.MakeActionParams( sessionId, actionRequest, userModel );
        if ( ActionFactory.Create( actionParams, out AAction action) ) {
          if ( action != null && action.Execute( out failureMessage ) ) {
            actionFactory.Commit( action );
            return Ok();
          }
        } else {
          failureMessage = "Request missing required parameter.";
        }
      }
      catch (Exception e) {
        failureMessage = e.Message;
      }
      

      return failureMessage == null
               ? Status500UnknownError()
               : Status400Invalid( failureMessage );
    }
  }
}
