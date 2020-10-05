using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Models.GameActions {
  public abstract class AActionParams {
    public ActionRequest Request { get; protected set; }
    public string PlayerId { get; protected set; }
    public Game? Game { get; protected set; }
    public SessionModel.Session? Session { get; protected set; }
    public Board? Board { get; protected set; }

    protected AActionParams (ActionRequest request, string playerId) {
      Request = request;
      PlayerId = playerId;
    }

    public void Deconstruct (
        out ActionRequest request,
        out string playerId,
        out Game? game,
        out SessionModel.Session? session,
        out Board? board
      ) {
      request = Request;
      playerId = PlayerId;
      game = Game;
      session = Session;
      board = Board;
    }

  }
}
