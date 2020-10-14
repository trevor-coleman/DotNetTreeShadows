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

    public GameHub (
        SessionService sessionService,
        GameService gameService,
        UserManager<UserModel> userManager,
        InvitationService invitationService,
        BoardService boardService
      ) {
      this.sessionService = sessionService;
      this.gameService = gameService;
      this.userManager = userManager;
      this.invitationService = invitationService;
      this.boardService = boardService;
      actionFactory = new ActionFactory( gameService, boardService,sessionService );
    }

    public async Task NewMessage (string senderId, string message) {
      Console.WriteLine( $"NewMessage: {senderId} - {message}" );
      await Clients.All.SendAsync( "MessageReceived", senderId, message );
    }

    public async Task ConnectToSession (GroupMember groupMember) {
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      string sessionId = groupMember.SessionId;
      Task<Session> getSession = sessionService.Get( sessionId );
      string playerId = groupMember.PlayerId;
      await Groups.AddToGroupAsync( Context.ConnectionId, sessionId );
      Session session = await getSession;
      IEnumerable<string> connectedPlayers = session.ConnectedPlayers;
      session.ConnectedPlayers = connectedPlayers.Where( i => i != user.UserId ).Append( user.UserId ).ToArray();
      await Clients.Group( sessionId ).SendAsync( "UpdateConnectedPlayers", session.ConnectedPlayers.ToArray() );
      await sessionService.Update( session );
    }

    public async Task DisconnectFromSession (string sessionId) {
      Task<Session> getSession = sessionService.Get( sessionId );
      Task<UserModel> getUser = userManager.GetUserAsync( Context.GetHttpContext().User );
      Session session = await getSession;
      UserModel user = await getUser;
      session.ConnectedPlayers = session.ConnectedPlayers.Where( i => i != user.UserId ).ToArray();
      await Clients.Group( sessionId )
                   .SendAsync( "UpdateConnectedPlayers", sessionId, session.ConnectedPlayers.ToArray() );

      await Groups.RemoveFromGroupAsync( Context.ConnectionId, sessionId );
      await sessionService.Update( session );
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
      Queue<Task<Session>> getSessionTasks = new Queue<Task<Session>>(
          from sessionId in user.ConnectedSessions select sessionService.Get( sessionId )
        );

      Queue<Task> savingTasks = new Queue<Task>();

      while ( getSessionTasks.Count > 0 ) {
        Session session = await getSessionTasks.Dequeue();
        Task removeFromGroupTask = Groups.RemoveFromGroupAsync( Context.ConnectionId, session.Id );
        session.ConnectedPlayers = session.ConnectedPlayers.Where( id => id != user.UserId ).ToArray();
        user.RemoveConnectedSession( session.Id );
        await removeFromGroupTask;
        await Clients.Group( session.Id )
                     .SendAsync( "UpdateConnectedPlayers", session.Id, session.ConnectedPlayers.ToArray() );

        savingTasks.Enqueue( sessionService.Update( session ) );
      }

      savingTasks.Enqueue( userManager.UpdateAsync( user ) );
      while ( savingTasks.Count > 0 ) {
        await savingTasks.Dequeue();
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
            await Clients.Group( sessionId ).SendAsync( "HandleActionResult", action );
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
