using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class OnPlayersTurn : GameAction.IActionValidator {
        private readonly string playerId;
        private readonly Game game;

        public OnPlayersTurn (string playerId, in Game game) {
            this.playerId = playerId;
            this.game = game;
        }
        public bool IsValid {
            get => game.TurnOrder[game.CurrentTurn] == playerId;
        }
        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player action out of turn.";
        }
    }
}
