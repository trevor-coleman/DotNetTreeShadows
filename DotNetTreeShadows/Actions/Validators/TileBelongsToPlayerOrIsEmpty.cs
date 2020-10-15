using System;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
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
        Console.WriteLine(Board.Tiles[Target]);
        return Tile.GetTreeType( Board.Tiles[Target] ) == null ||
               Tile.GetTreeType( Board.Tiles[Target] ) == PlayerBoard.Get( Game, PlayerId ).TreeType;
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
