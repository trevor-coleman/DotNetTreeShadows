using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.SignalR;

namespace dotnet_tree_shadows.Hubs {
  public class GameHub : Hub {

    private SessionService sessionService;
    public GameHub (SessionService sessionService) { this.sessionService = sessionService; }

    public async Task NewMessage (string senderId, string message) {
      Console.WriteLine( $"NewMessage: {senderId} - {message}" );
      await Clients.All.SendAsync( "MessageReceived", senderId, message );
    }

    public async Task ConnectPlayer (GroupMember groupMember) {
      string sessionId = groupMember.SessionId;
      Task<Session> getSession = sessionService.Get( sessionId );
      string playerId = groupMember.PlayerId;
      await Groups.AddToGroupAsync( Context.ConnectionId, sessionId );
      Session session = await getSession;
      IEnumerable<string> connectedPlayers = session.ConnectedPlayers;
      session.ConnectedPlayers = connectedPlayers.Where( i => i != playerId ).Append( playerId ).ToArray();
      await Clients.Group( sessionId ).SendAsync( "UpdateConnectedPlayers", session.ConnectedPlayers.ToArray() );
      await sessionService.Update( session );
    }

    public async Task DisconnectPlayer (GroupMember groupMember) {
      Console.WriteLine($"Disconnecting Player: {groupMember.PlayerId}");
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
      Console.WriteLine( $"ServerAddPieceToTile - {request.SessionId}" );
      await Clients.Group( request.SessionId ).SendAsync( "ClientAddPieceToTile", request );
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
