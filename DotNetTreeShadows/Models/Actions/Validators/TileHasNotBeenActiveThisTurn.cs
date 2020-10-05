using System.Linq;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TileHasNotBeenActiveThisTurn : ATurnAction.AActionValidator {
        private readonly Hex origin;
        private readonly Game game;

        public TileHasNotBeenActiveThisTurn (in Hex tile, Game game) {
            this.origin = origin;
            this.game = game;
            throw new System.NotImplementedException();
        }

        public override bool IsValid {
          get => game.TilesActiveThisTurn.All( t => t != origin );
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Tile has already been activated this turn.";
        }
    }
}
