using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TilePieceTypeIs : ATurnAction.AActionValidator {
        private readonly Hex target;
        private readonly PieceType? pieceType;
        private readonly Game game;
        private readonly Board board;

        public TilePieceTypeIs (in Hex target, PieceType? pieceType, Game game, Board board) {
            this.target = target;
            this.pieceType = pieceType;
            this.game = game;
            this.board = board;
        }

        public override bool IsValid {
            get => Tile.GetPieceType( board.tiles[target]) == pieceType;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"PieceType at target is {pieceType.ToString()} .";
        }
    }
}
