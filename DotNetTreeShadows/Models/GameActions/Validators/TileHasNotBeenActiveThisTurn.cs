using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TileHasNotBeenActiveThisTurn : ATurnAction.AActionValidator {
        private readonly HexCoordinates origin;
        private readonly Game game;

        public TileHasNotBeenActiveThisTurn (in HexCoordinates tile, Game game) {
            this.origin = origin;
            this.game = game;
            throw new System.NotImplementedException();
        }

        public override bool IsValid {
            get => !game.TilesActiveThisTurn.Contains( origin );
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Tile has already been activated this turn.";
        }
    }
}
