using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PieceTypeIsTree : AGameAction.AActionValidator {
        private readonly HexCoordinates origin;
        private readonly Game game;

        public PieceTypeIsTree (in HexCoordinates origin, Game game) {
            this.origin = origin;
            this.game = game;
            throw new System.NotImplementedException();
        }

        public override bool IsValid {
            get => (int) game.Board.GetTileAt( origin ).PieceType > (int) PieceType.Seed;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Origin is not a tree.";
        }
    }
}
