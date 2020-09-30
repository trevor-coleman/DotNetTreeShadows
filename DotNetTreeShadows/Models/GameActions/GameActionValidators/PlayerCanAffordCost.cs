using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.GameActionValidators {
    public class PlayerCanAffordCost : GameAction.IActionValidator {
        private readonly string playerId;
        private readonly int cost;
        private readonly Game game;

        public PlayerCanAffordCost (string playerId, int cost, Game game) {
            this.playerId = playerId;
            this.cost = cost;
            this.game = game;
        }
        public bool IsValid {
            get => game.PlayerBoards[playerId].Light >= cost;
        }
        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player cannot afford cost.";
        }
    }
}
