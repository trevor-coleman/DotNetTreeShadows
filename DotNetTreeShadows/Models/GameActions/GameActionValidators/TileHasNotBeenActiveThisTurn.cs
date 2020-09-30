using System.Reflection.Metadata;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public class TileHasNotBeenActiveThisTurn : GameAction.IActionValidator {
        private readonly HexCoordinates origin;
        private readonly Game game;

        public TileHasNotBeenActiveThisTurn (in HexCoordinates tile, Game game) {
            this.origin = origin;
            this.game = game;
            throw new System.NotImplementedException();
        }
        public bool IsValid {
            get => !game.TilesActiveThisTurn.Contains( origin );
        }
        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Tile has already been activated this turn.";
        }
    }
}
