using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
    public class PlayerHasAvailablePiece : ATurnAction.AActionValidator {
        private readonly string playerId;
        private readonly PieceType pieceType;
        private readonly Game game;

        public PlayerHasAvailablePiece (string playerId, PieceType pieceType, Game game) {
            this.playerId = playerId;
            this.pieceType = pieceType;
            this.game = game;
        }

        public override bool IsValid {
            get => PlayerBoard.Get( game, playerId ).Pieces(pieceType).Available > 0;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"Player does not have an available {pieceType.ToString()}.";
        }
    }
}
