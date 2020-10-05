using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PlayerHasPieceOnPlayerBoard : ATurnAction.AActionValidator {
        private readonly Game game;
        private readonly string playerId;
        private readonly PieceType pieceType;

        public PlayerHasPieceOnPlayerBoard (string playerId, PieceType pieceType, Game game) {
            this.game = game;
            this.playerId = playerId;
            this.pieceType = pieceType;
        }

        public override bool IsValid {
            get => PlayerBoard.Get(game, playerId).Pieces( pieceType ).OnPlayerBoard > 0;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"No {pieceType.ToString()} on player board to buy.";
        }
    }
}
