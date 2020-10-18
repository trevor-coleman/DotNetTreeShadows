using dotnet_tree_shadows.Models;

namespace dotnet_tree_shadows.Actions.Validators {
  public class TilePieceTypeIsNot : AAction.AActionValidator {

    private readonly Board board;
    private readonly PieceType? pieceType;
    private readonly Hex target;

    public TilePieceTypeIsNot (in Hex target, PieceType? pieceType, Board board) {
      this.target = target;
      this.pieceType = pieceType;
      this.board = board;
    }

    public override bool IsValid {
      get => Tile.GetPieceType( board.Get( target ) ) != pieceType;
    }

    public override string? FailureMessage {
      get =>
        IsValid
          ? null
          : $"PieceType at target is {pieceType.ToString()} .";
    }

  }
}
