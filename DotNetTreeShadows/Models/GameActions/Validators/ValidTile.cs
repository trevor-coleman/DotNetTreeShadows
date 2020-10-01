using System;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class ValidTile : GameAction.AActionValidator {

        private readonly HexCoordinates target;
        private readonly Game game;
        private readonly string propertyName;

        public ValidTile (in HexCoordinates target, in Game game, string propertyName ="target") {
            this.target = target;
            this.game = game;
        }

        public override bool IsValid {
            get => Math.Abs(target.Q) < 4 && Math.Abs(target.R) < 4 && Math.Abs(target.R) < 4 && game.Board.Tiles.TryGetValue( target, out _ );
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"Invalid {propertyName} tile.";
        }
    }
}
