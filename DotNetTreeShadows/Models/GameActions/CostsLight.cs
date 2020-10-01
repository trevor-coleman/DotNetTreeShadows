using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public abstract class CostsLight : GameAction.IActionValidator {

        protected readonly string PlayerId;
        protected readonly int Price;
        protected readonly Game Game;

        protected CostsLight (Game game, string playerId, int price) {
            PlayerId = playerId;
            Price = price;
        }

        public bool IsValid {
            get =>
                Game.PlayerBoards.TryGetValue( PlayerId, out BitwisePlayerBoard? playerBoard ) && playerBoard.Light >= Price;
        }

        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Insufficient Light";
        }
    }
}
