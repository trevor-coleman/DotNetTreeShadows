using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.GameActionValidators {
    public class PieceTypeIsNull : GameAction.IActionValidator {
        private readonly HexCoordinates target;
        private readonly Game game;
        public PieceTypeIsNull (in HexCoordinates target, Game game) {
            this.target = target;
            this.game = game;
        }
        public bool IsValid {
            get => game.Board.TileAt( target )?.PieceType == null;
        }
        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "PieceType at target is not null.";
        }
    }
}
