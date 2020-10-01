using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TileBelongsToPlayer : GameAction.IActionValidator {
        private readonly string playerId;
        private readonly HexCoordinates target;
        private readonly Game game;

        public TileBelongsToPlayer (string playerId, in HexCoordinates target, Game game) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;
        }
        public bool IsValid {
            get => game.Board.GetTileAt( target ).TreeType == game.PlayerBoards[playerId].TreeType;
        }

        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player does not own the tree on that tile.";

        }
    }
}
