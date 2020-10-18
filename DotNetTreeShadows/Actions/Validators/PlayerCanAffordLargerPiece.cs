using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
  public class PlayerCanAffordLargerPiece : ATurnAction.AActionValidator {

    private readonly string playerId;
    private readonly Hex target;
    private readonly Game game;
    private readonly Board board;
    private readonly int largerPiecePrice;

    public PlayerCanAffordLargerPiece (in Hex target, string playerId, Game game, Board board) {
      this.playerId = playerId;
      this.target = target;
      this.game = game;
      this.board = board;

      if ( board.TryGetValue( target, out int t ) ) largerPiecePrice = (int) (Tile.GetPieceType( t ) ?? 0) + 1;
    }

    public override bool IsValid {
      get => PlayerBoard.Get( game, playerId ).Light >= largerPiecePrice;
    }

    public override string? FailureMessage {
      get =>
        IsValid
          ? null
          : "Can't afford to grow that piece.";
    }

  }
}
