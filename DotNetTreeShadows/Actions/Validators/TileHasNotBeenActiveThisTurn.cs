using System.Linq;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
    public class TileHasNotBeenActiveThisTurn : ATurnAction.AActionValidator {
        private readonly Hex origin;
        private readonly Game game;

        public TileHasNotBeenActiveThisTurn (in Hex origin, Game game) {
            this.origin = origin;
            this.game = game;
        }

        public override bool IsValid {
          get {
            int[] activeTiles = game.TilesActiveThisTurn; 
            return activeTiles.All( t => t != origin.HexCode );
          }
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Tile has already been activated this turn.";
        }
    }
}
