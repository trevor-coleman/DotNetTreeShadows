using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Models.GameActions {
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
