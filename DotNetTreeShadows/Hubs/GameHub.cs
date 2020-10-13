using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnet_tree_shadows.Hubs {
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme )]
  public class GameHub : Hub {

    private SessionService sessionService;
    private GameService gameService;
    private UserManager<UserModel> userManager;
    
    
    public GameHub (SessionService sessionService, GameService gameService, UserManager<UserModel> userManager) {
      
      this.sessionService = sessionService;
      this.gameService = gameService;
      this.userManager = userManager;
    }

    public async Task NewMessage (string senderId, string message) {
      Console.WriteLine( $"NewMessage: {senderId} - {message}" );
      await Clients.All.SendAsync( "MessageReceived", senderId, message );
    }

    public async Task ConnectPlayer (GroupMember groupMember) {
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

    public async Task DisconnectPlayer (GroupMember groupMember) {
      string sessionId = groupMember.SessionId;
      string playerId = groupMember.PlayerId;
      Task<Session> getSession = sessionService.Get( sessionId );
      Session session = await getSession;
      session.ConnectedPlayers = session.ConnectedPlayers.Where( i => i != playerId ).ToArray();
      await Clients.Group( sessionId ).SendAsync( "UpdateConnectedPlayers", session.ConnectedPlayers.ToArray() );
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

    public async Task TryGameAction (ActionRequest actionRequest) {
      
      
    }

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
