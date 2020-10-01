using System;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class ValidTile : GameAction.IActionValidator {

        private readonly HexCoordinates target;
        private readonly Game game;
        private readonly string propertyName;

        public ValidTile (in HexCoordinates target, string propertyName, in Game game) {
            this.target = target;
            this.game = game;
        }

        public bool IsValid {
            get => Math.Abs(target.Q) < 4 && Math.Abs(target.R) < 4 && Math.Abs(target.R) < 4 && game.Board.Tiles.TryGetValue( target, out _ );
        }

        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"Invalid {propertyName} tile.";
        }
    }
}
