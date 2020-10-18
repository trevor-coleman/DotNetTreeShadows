using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
  public class TileBelongsToPlayerOrIsEmpty : AAction.AActionValidator {
    private readonly string PlayerId;
    private readonly Board Board;
    private readonly Hex Target;
    private readonly Game Game;

    public TileBelongsToPlayerOrIsEmpty (in Hex target,string playerId, Game game, Board board) {
      PlayerId = playerId;
      Board = board;
      Target = target;
      Game = game;
    }

    public override bool IsValid {
      get {
        
        return Tile.GetTreeType( Board.Tiles[Target.HexCode] ) == null ||
               Tile.GetTreeType( Board.Tiles[Target.HexCode] ) == PlayerBoard.Get( Game, PlayerId ).TreeType;
      }
    }

    public override string? FailureMessage {
      get =>
        IsValid
          ? null
          : "Player does not own the tree on that tile.";

    }
  }
}
