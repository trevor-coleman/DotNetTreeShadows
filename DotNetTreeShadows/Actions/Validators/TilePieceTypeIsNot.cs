using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TilePieceTypeIsNot : ATurnAction.AActionValidator {
        private readonly Hex target;
        private readonly PieceType? pieceType;
        private readonly Board board;

        public TilePieceTypeIsNot (in Hex target, PieceType? pieceType, Board board) {
            this.target = target;
            this.pieceType = pieceType;
            this.board = board;
        }

        public override bool IsValid {
            get => Tile.GetPieceType( board.Tiles[target]) != pieceType;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"PieceType at target is {pieceType.ToString()} .";
        }
    }
}
