using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class ValidTile : GameAction.IActionValidator {

        private readonly HexCoordinates origin;
        private readonly Game game;
        private readonly string propertyName;

        public ValidTile (in HexCoordinates origin, string propertyName, in Game game) {
            this.origin = origin;
            this.game = game;
        }

        public bool IsValid {
            get => game.Board.Tiles.TryGetValue( origin, out _ );
        }

        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"Invalid {propertyName} tile.";
        }
    }
}
