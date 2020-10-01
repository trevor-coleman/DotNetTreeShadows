using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class GrowthInShadowAllowed : GameAction.IActionValidator {
        private readonly HexCoordinates target;
        private readonly Game game;
        public GrowthInShadowAllowed (in HexCoordinates target, Game game) {
            this.target = target;
            this.game = game;
        }
        public bool IsValid {
            get => game.PreventActionsInShadow == false || game.Board.TileAt( target ).ShadowHeight == 0;
        }
        public string? FailureMessage { get; }
    }
}
