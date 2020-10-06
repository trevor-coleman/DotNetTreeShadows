using System;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.Extensions.ObjectPool;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
  public class PlayerHasLargerPieceAvailable : ATurnAction.AActionValidator {

    private readonly string playerId;
    private readonly Game game;
    private readonly PieceType largerPiece;

    public PlayerHasLargerPieceAvailable (in Hex target, in string playerId, in Game game, in Board board) {
      this.playerId = playerId;
      this.game = game;

      if ( board.TryGetValue( target, out int tileCode ) ) {
        largerPiece = (PieceType) (int) (Tile.GetPieceType( tileCode ) ?? 0) + 1;
      }
    }

    public override bool IsValid {
      get => PlayerBoard.Get( game, playerId ).Pieces( largerPiece ).Available != 0;
    }

    public override string? FailureMessage {
      get =>
        IsValid
          ? null
          : "Player doesn't have a larger piece available to grow into.";
    }

  }
}
