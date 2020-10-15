using System.Linq;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TileHasNotBeenActiveThisTurn : ATurnAction.AActionValidator {
        private readonly Hex origin;
        private readonly Game game;

        public TileHasNotBeenActiveThisTurn (in Hex origin, Game game) {
            this.origin = origin;
            this.game = game;
        }

        public override bool IsValid {
          get {
            Hex[] activeTiles = game.TilesActiveThisTurn ?? new Hex[0]; 
            return activeTiles.All( t => t != origin );
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
