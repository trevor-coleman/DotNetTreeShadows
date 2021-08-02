using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Services;
using dotnet_tree_shadows.Services.GameActionService;
using dotnet_tree_shadows.Services.GameActionService.Actions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnet_tree_shadows.Hubs {
  [Authorize( AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class GameHub : Hub {

    private BoardService boardService;
    private GameActionService gameActionService;
    private GameService gameService;
    private HubGroupService hubGroupService;
    private InvitationService invitationService;

    private SessionService sessionService;
    private UserManager<UserModel> userManager;

    public GameHub (
        SessionService sessionService,
        GameService gameService,
        UserManager<UserModel> userManager,
        InvitationService invitationService,
        BoardService boardService,
        HubGroupService hubGroupService,
        GameActionService gameActionService
      ) {
      this.sessionService = sessionService;
      this.gameService = gameService;
      this.userManager = userManager;
      this.invitationService = invitationService;
      this.boardService = boardService;
      this.hubGroupService = hubGroupService;
      this.gameActionService = gameActionService;
      
    }

    public async Task NewMessage (string senderId, string message) {
      Console.WriteLine( $"NewMessage: {senderId} - {message}" );
      await Clients.All.SendAsync( "MessageReceived", senderId, message );
    }

    public async Task ConnectToSession (string sessionId) {
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      await Groups.AddToGroupAsync( Context.ConnectionId, sessionId );
      IEnumerable<string> membersAfter = hubGroupService.AddToSession( sessionId, user.UserId );

      Task<Session> sessionTask = sessionService.Get( sessionId );
      Task<Game> gameTask = gameService.Get( sessionId );
      Task<Board> boardTask = boardService.Get( sessionId );

      Session session = await sessionTask;
      Game game = await gameTask;
      
      
      SessionUpdate sessionUpdate = new SessionUpdate {
        SessionId = sessionId,
        Session = session,
        Game = game,
        Board = await boardTask
      };
      
      await Clients.Group( sessionId ).SendAsync(
          "HandleSessionUpdate",
          sessionUpdate   
        );

      await Clients.Group( sessionId ).SendAsync( "UpdateConnectedPlayers", sessionId, membersAfter.ToArray() );
    }

    public async Task DisconnectFromSession (string sessionId) {
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      await Groups.RemoveFromGroupAsync( Context.ConnectionId, sessionId );
      IEnumerable<string> membersAfter = hubGroupService.RemoveFromSession( sessionId, user.UserId );

      
      await Clients.Group( sessionId ).SendAsync( "UpdateConnectedPlayers", sessionId, membersAfter.ToArray() );
    }

    public async Task SetGameOption (SetGameOptionRequest request) {
      Game game = await gameService.Get( request.SessionId );
      await Clients.Group( request.SessionId ).SendAsync( "UpdateGameOptions", request );
      if ( request.Value ) {
        game.GameOptions = game.GameOptions.Where( i => i != request.GameOption )
                               .Append( request.GameOption )
                               .ToArray();
      } else {
        game.GameOptions = game.GameOptions.Where( i => i != request.GameOption ).ToArray();
      }
      
      await gameService.Update( game.Id, game );
      
    }

    public async Task SetLinkEnabled (string sessionId, bool value) {
      Session session = await sessionService.Get( sessionId );
      await Clients.Group( sessionId ).SendAsync( "UpdateLinkEnabled", sessionId, value );
      session.LinkEnabled = value;
      await sessionService.Update( sessionId, session );
    }

    public override async Task OnDisconnectedAsync (Exception exception) {
      await base.OnDisconnectedAsync( exception );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );

      IEnumerable<string> groups = hubGroupService.PlayerSessions( user.UserId );

      foreach ( string groupId in groups ) {
        await Groups.RemoveFromGroupAsync( Context.ConnectionId, groupId );
        IEnumerable<string> membersAfter = hubGroupService.RemoveFromSession( groupId, user.UserId );
        await Clients.Group( groupId ).SendAsync( "UpdateConnectedPlayers", groupId, membersAfter.ToArray() );
      }
    }

    public async Task Commit (ActionContext context) {
      Queue<Task> savingTasks = new Queue<Task>();

      if ( context.Session != null ) savingTasks.Enqueue( sessionService.Update( context.SessionId, context.Session ) );

      if ( context.Game != null ) savingTasks.Enqueue( gameService.Update( context.SessionId, context.Game ) );

      if ( context.Board != null ) savingTasks.Enqueue( boardService.Update( context.SessionId, context.Board ) );

      while ( savingTasks.Count > 0 ) {
        await savingTasks.Dequeue();
      }
    }

    public async Task DoAction (AAction action) {
      if ( action.Execute( out ActionContext context, out string failureMessage ) ) {
        await Commit( context );
        await Clients.Group( context.SessionId )
                     .SendAsync(
                          "HandleSessionUpdate",
                          new SessionUpdate {
                            SessionId = context.SessionId,
                            Game = context.Game,
                            Board = context.Board,
                            Session = context.Session
                          }
                        );
      } else {
        Console.WriteLine( failureMessage );
        await Clients.Caller.SendAsync( "LogMessage", failureMessage );
      }
    }
    
    public async Task UndoAction (AAction action, string actionId) {
      if ( action.UnExecute( out ActionContext context, actionId, out string failureMessage ) ) {
        context.Game!.RemoveGameAction( actionId );
        await Commit( context );
        Console.WriteLine($"SessionId: {context.SessionId}");
        await Clients.Group( context.SessionId )
                     .SendAsync(
                          "HandleSessionUpdate",
                          new SessionUpdate {
                            SessionId = context.SessionId, Game = context.Game, Board = context.Board
                          }
                        );
      } else {
        Console.WriteLine( failureMessage );
        await Clients.Caller.SendAsync( "LogMessage", failureMessage );
      }
    }

    public async Task PlaceStartingTree (string sessionId, int origin) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - PlaceStartingTree ({sessionId} - {origin})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      PlaceStartingTreeAction action =
        await gameActionService.PlaceStartingTreeAction( sessionId, user.UserId, origin );

      await DoAction( action );
    }

    public async Task StartGame (string sessionId) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - StartGame ({sessionId})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      StartGameAction action = await gameActionService.StartGameAction( sessionId, user.UserId );
      await DoAction( action );
    }

    public async Task Buy (string sessionId, PieceType pieceType) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - Buy ({sessionId} - {pieceType})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      BuyAction action = await gameActionService.BuyAction( sessionId, user.UserId, pieceType );
      await DoAction( action );
    }

    public async Task Plant (string sessionId, int origin, int target) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - Plant ({sessionId} - {origin} - {target})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      PlantAction action = await gameActionService.PlantAction( sessionId, user.UserId, origin, target );
      await DoAction( action );
    }

    public async Task Grow (string sessionId, int origin) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - Grow ({sessionId} - {origin})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      GrowAction action = await gameActionService.GrowAction( sessionId, user.UserId, origin );
      await DoAction( action );
    }

    public async Task Collect (string sessionId, int origin) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - Collect ({sessionId} - {origin})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      CollectAction action = await gameActionService.CollectAction( sessionId, user.UserId, origin );
      await DoAction( action );
    }

    public async Task EndTurn (string sessionId) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - EndTurn ({sessionId})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      EndTurnAction action = await gameActionService.EndTurnAction( sessionId, user.UserId );
      await DoAction( action );
    }

    public async Task Undo (string sessionId) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - Undo ({sessionId})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      Game game = await gameService.Get( sessionId );
      
      if ( game.TryGetLastAction(out GameActionData? gameActionData) ) {
        if(gameActionData!.PlayerId != user.UserId) {
          await Clients.Caller.SendAsync( "LogMessage", $"Cant Undo -- Not your action ({sessionId})" );
          return;
        }
        string playerId = gameActionData.PlayerId;
        int? origin = gameActionData.Origin;

        AAction? action = gameActionData.ActionType switch {
          GameActionType.Buy => await gameActionService.BuyAction(
                                    sessionId,
                                    playerId,
                                    (PieceType) gameActionData.PieceType!
                                  ),
          GameActionType.Plant => await gameActionService.PlantAction(
                                      sessionId,
                                      playerId,
                                      (int) gameActionData.Origin!,
                                      (int) gameActionData.Target!
                                    ),
          GameActionType.Grow => await gameActionService.GrowAction( sessionId, playerId, (int) origin! ),
          GameActionType.Collect => await gameActionService.CollectAction( sessionId, playerId, (int) origin!),
          GameActionType.EndTurn => null,
          GameActionType.StartGame => null,
          GameActionType.PlaceStartingTree => null,
          GameActionType.PlaceSecondTree => null,
          GameActionType.Undo => null,
          GameActionType.Resign => null,
          GameActionType.Kick => null,
          _ => null
        };
        
        if(action == null) {
          await Clients.Caller.SendAsync( "LogMessage", $"Cannot Undo this Action ({sessionId})" );
          return;
        }

        await UndoAction( action, gameActionData.Id );
      }
      
      
    }

    public class SetGameOptionRequest {

      public string SessionId { get; set; }
      public string GameOption { get; set; }
      public bool Value { get; set; }

    }

    public class SessionUpdate {

      public string SessionId { get; set; } = "";
      public Session? Session { get; set; }
      public Game? Game { get; set; }
      public Board? Board { get; set; }

    }

  }
}
