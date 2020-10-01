using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TileBelongsToPlayer : ATurnAction.AActionValidator {
        private readonly string playerId;
        private readonly HexCoordinates target;
        private readonly Game game;

        public TileBelongsToPlayer (in HexCoordinates target,string playerId, Game game) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;
        }

        public override bool IsValid {
            get => game.Board.GetTileAt( target ).TreeType == game.PlayerBoards[playerId].TreeType;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player does not own the tree on that tile.";

        }
    }
}
