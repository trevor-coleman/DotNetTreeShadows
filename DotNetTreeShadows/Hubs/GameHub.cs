using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.Enums;
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

    private SessionService sessionService;
    private GameService gameService;
    private UserManager<UserModel> userManager;
    private InvitationService invitationService;
    private BoardService boardService;
    private HubGroupService hubGroupService;
    private GameActionService gameActionService;

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

    
    public class SessionUpdate {
      public string SessionId { get; set; } = "";
      public Session? Session { get; set; }
      public Game? Game { get; set; }
      public Board? Board { get; set; }
    }

    public async Task Commit (ActionContext context) {

      Queue<Task> savingTasks = new Queue<Task>();
      
      

      if ( context.Session != null ) {
        savingTasks.Enqueue( sessionService.Update( context.SessionId, context.Session ) );
      }

      if ( context.Game!= null ) {
        savingTasks.Enqueue( gameService.Update( context.SessionId, context.Game) );
      }
      
      if ( context.Board!= null ) {
        savingTasks.Enqueue( boardService.Update( context.SessionId, context.Board) );
      }

      while ( savingTasks.Count > 0 ) {
        await savingTasks.Dequeue();
      }
    }

    public async Task DoAction (AAction action) {
      await Clients.Caller.SendAsync( "LogMessage", "starting DoAction" );
      if(action.Execute( out ActionContext context, out string failureMessage )) {
        await Clients.Caller.SendAsync( "LogMessage", "committing" );
        await Commit( context );
        await Clients.Caller.SendAsync( "LogMessage", "sendingUpdate" );
        await Clients.Group( context.SessionId ).SendAsync( "HandleSessionUpdate", new SessionUpdate() {
          SessionId = context.SessionId,
          Game = context.Game,
          Board = context.Board,
        } );
        await Clients.Caller.SendAsync( "LogMessage", "sentUpdate" );
      } else {
        Console.WriteLine(failureMessage);
        await Clients.Caller.SendAsync( "LogMessage", failureMessage );
      }
    }
    
    public async Task PlaceStartingTree (string sessionId, int origin) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - PlaceStartingTree ({sessionId} - {origin})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      PlaceStartingTreeAction action = gameActionService.PlaceStartingTreeAction( sessionId, user.UserId, origin );
      await DoAction( action );
    }

    public async Task StartGame (string sessionId) {
      await Clients.Caller.SendAsync( "LogMessage", $"Received Request - StartGame ({sessionId})" );
      UserModel user = await userManager.GetUserAsync( Context.GetHttpContext().User );
      StartGameAction action = await gameActionService.StartGameAction( sessionId, user.UserId );
      await DoAction( action );
    }
    

  }
}
