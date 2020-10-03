using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class GrowthInShadowAllowed : ATurnAction.AActionValidator {
        private readonly HexCoordinates target;
        private readonly Game game;
        public GrowthInShadowAllowed (in HexCoordinates target, Game game) {
            this.target = target;
            this.game = game;
        }

        public override bool IsValid {
            get => game.PreventActionsInShadow == false || game.Board.GetTileAt( target ).ShadowHeight == 0;
        }
        public override string? FailureMessage { get; }
    }
}
