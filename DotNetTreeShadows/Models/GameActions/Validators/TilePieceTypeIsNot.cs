using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TilePieceTypeIsNot : GameAction.IActionValidator {
        private readonly HexCoordinates target;
        private readonly PieceType pieceType;
        private readonly Game game;
        public TilePieceTypeIsNot (in HexCoordinates target, PieceType pieceType, Game game) {
            this.target = target;
            this.pieceType = pieceType;
            this.game = game;
        }
        public bool IsValid {
            get => game.Board.TileAt( target )?.PieceType == pieceType;
        }
        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"PieceType at target is {pieceType.ToString()} .";
        }
    }
}
