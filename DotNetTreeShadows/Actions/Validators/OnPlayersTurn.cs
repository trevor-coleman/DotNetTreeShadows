using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class OnPlayersTurn : ATurnAction.AActionValidator {
        private readonly string playerId;
        private readonly Game game;

        public OnPlayersTurn (string playerId, in Game game) {
            this.playerId = playerId;
            this.game = game;
        }

        public override bool IsValid {
            get => game.CurrentPlayer == playerId;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player action out of turn.";
        }
    }
}