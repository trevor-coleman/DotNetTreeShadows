using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PlayerCanAffordCost : ATurnAction.AActionValidator {
        private readonly string playerId;
        private readonly int cost;
        private readonly Game game;

        public PlayerCanAffordCost (string playerId, int cost, Game game) {
            this.playerId = playerId;
            this.cost = cost;
            this.game = game;
        }

        public override bool IsValid {
            get => PlayerBoard.Get( game, playerId ).Light >= cost;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player cannot afford cost.";
        }
    }
}
