using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.InvitationModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnet_tree_shadows.Hubs {
  [Authorize( AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class GameHub : Hub {

    private SessionService sessionService;
    private GameService gameService;
    private UserManager<UserModel> userManager;
    private InvitationService invitationService;
    private ActionFactory actionFactory;
    private BoardService boardService;
    private HubGroupService hubGroupService;

    public async Task NewMessage (string senderId, string message) {
      Console.WriteLine( $"NewMessage: {senderId} - {message}" );
      await Clients.All.SendAsync( "MessageReceived", senderId, message );
    }

    public GameHub (
        SessionService sessionService,
        GameService gameService,
        UserManager<UserModel> userManager,
        InvitationService invitationService,
        BoardService boardService,
        HubGroupService hubGroupService
      ) {
      this.sessionService = sessionService;
      this.gameService = gameService;
      this.userManager = userManager;
      this.invitationService = invitationService;
      this.boardService = boardService;
      this.hubGroupService = hubGroupService;
      actionFactory = new ActionFactory( gameService, boardService,sessionService );
    }

    public async Task ConnectToSession (string sessionId) {
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      await Groups.AddToGroupAsync( Context.ConnectionId, sessionId );
      string[] membersAfter = hubGroupService.AddToGroup( sessionId, user.UserId );
      
      await Clients.Group( sessionId ).SendAsync( 
        "UpdateConnectedPlayers",
        sessionId,
        membersAfter 
        );
    }

    public async Task DisconnectFromSession (string sessionId) {
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      await Groups.RemoveFromGroupAsync( Context.ConnectionId, sessionId );
      string[] membersAfter = hubGroupService.RemoveFromGroup( sessionId, user.UserId );
      
      await Clients.Group( sessionId )
                   .SendAsync( "UpdateConnectedPlayers", sessionId, membersAfter);
    }

    public async Task ServerAddPieceToTile (AddPieceToTileRequest request) {
      await Clients.Group( request.SessionId ).SendAsync( "ClientAddPieceToTile", request );
    }

    public class SetGameOptionRequest {

      public string SessionId { get; set; }
      public GameOption GameOption { get; set; }
      public bool Value { get; set; }

    }

    public async Task SetGameOption (SetGameOptionRequest request) {
      Game game = await gameService.Get( request.SessionId );
      await Clients.Group( request.SessionId ).SendAsync( "UpdateGameOptions", request );
      game.GameOptions.Set( request.GameOption, request.Value );
      await gameService.Update( game.Id, game );
    }

    public override async Task OnDisconnectedAsync (Exception exception) {
      await base.OnDisconnectedAsync( exception );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );

      IEnumerable<string> groups = hubGroupService.PlayerGroups( user.UserId );

      foreach ( string groupId in groups ) {
        await Groups.RemoveFromGroupAsync( Context.ConnectionId, groupId );
        string[] membersAfter = hubGroupService.RemoveFromGroup( groupId, user.UserId );
        await Clients.Group( groupId )
                     .SendAsync( "UpdateConnectedPlayers",groupId, membersAfter  );
      }
    }



    public async Task DoAction (
        string sessionId,
        ActionRequest actionRequest
      ) {
      
      UserModel userModel = await userManager.GetUserAsync( Context.GetHttpContext().User );
      Task<Session?> sessionTask = sessionService.Get( sessionId );
      
      Session? session = await sessionTask;
      if ( session == null ) {
        await Clients.Caller.SendAsync( "HandleActionFailure", actionRequest, sessionId, "Session not found" );
        return;
      }

      if ( !session.HasPlayer( userModel.UserId ) ) {
        await Clients.Caller.SendAsync( "HandleActionFailure", actionRequest, sessionId, "You are not a part of that session." );
        return;
      }
      
      string? failureMessage = null;

      try {
        AActionParams actionParams = await actionFactory.MakeActionParams( sessionId, actionRequest, userModel );
        if ( ActionFactory.Create( actionParams, out AAction action) ) {
          if ( action != null && action.Execute( out failureMessage ) ) {
            actionFactory.Commit( action );
            await Clients.Group( sessionId ).SendAsync( "LogMessage", "WE DID IT KIDS" );
            await Clients.Group( sessionId ).SendAsync( "HandleActionResult", "failure" );
          }
        } else {
          failureMessage = "Request missing required parameter.";
        }
      }
      catch (Exception e) {
        failureMessage = e.Message;
      }
      

      await Clients.Caller.SendAsync( "LogMessage", failureMessage );
    }

    

    public class GroupMember {

      public string SessionId { get; set; }
      public string PlayerId { get; set; }

    }

    public class AddPieceToTileRequest {

      public string SessionId { get; set; }
      public int HexCode { get; set; }
      public TreeType TreeType { get; set; }
      public PieceType PieceType { get; set; }

    }

  }
}
