using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
    public class GrowthInShadowAllowed : ATurnAction.AActionValidator {
        private readonly int tileCode;
        private readonly Game game;
        private readonly Board board;
        public GrowthInShadowAllowed (in Hex target, Game game, Board board) {
          tileCode = board.Get( target );
            this.game = game;
            
        }

        public override bool IsValid {
            get => game.GameOptions.Has( GameOption.PreventActionsInShadow ) == false || !Tile.IsShadowed( tileCode );
        }
        public override string? FailureMessage {
          get => "Growth in shadow is not permitted.";
        }
    }
}
