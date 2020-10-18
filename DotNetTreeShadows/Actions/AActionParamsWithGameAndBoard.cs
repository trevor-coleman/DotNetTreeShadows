using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions {
  public abstract class AActionParamsWithGameAndBoard : AActionParams {

    protected AActionParamsWithGameAndBoard (ActionRequest request, string playerId, Game game, Board board) : base(
        request,
        playerId
      ) {
      Game = game;
      Board = board;
    }

  }
}
