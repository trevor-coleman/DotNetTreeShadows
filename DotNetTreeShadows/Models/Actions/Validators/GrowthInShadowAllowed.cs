using System.Collections.Generic;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class GrowthInShadowAllowed : ATurnAction.AActionValidator {
        private readonly int tileCode;
        private readonly Game game;
        private readonly Board board;
        public GrowthInShadowAllowed (in Hex target, Game game, Board board) {
            tileCode = board.tiles[target];
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
