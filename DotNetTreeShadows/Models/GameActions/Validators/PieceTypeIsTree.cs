using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PieceTypeIsTree : GameAction.IActionValidator {
        private readonly HexCoordinates origin;
        private readonly Game game;

        public PieceTypeIsTree (in HexCoordinates origin, Game game) {
            this.origin = origin;
            this.game = game;
            throw new System.NotImplementedException();
        }

        public bool IsValid {
            get => (int) game.Board.GetTileAt( origin ).PieceType > (int) PieceType.Seed;
        }

        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Origin is not a tree.";
        }
    }
}
