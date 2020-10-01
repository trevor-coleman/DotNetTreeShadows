using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TilePieceTypeIs : AGameAction.AActionValidator {
        private readonly HexCoordinates target;
        private readonly PieceType? pieceType;
        private readonly Game game;
        public TilePieceTypeIs (in HexCoordinates target, PieceType? pieceType, Game game) {
            this.target = target;
            this.pieceType = pieceType;
            this.game = game;
        }

        public override bool IsValid {
            get => game.Board.GetTileAt( target )?.PieceType == pieceType;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"PieceType at target is {pieceType.ToString()} .";
        }
    }
}
