using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PlayerHasAvailablePiece : ATurnAction.AActionValidator {
        private readonly string playerId;
        private readonly PieceType pieceType;
        private readonly Game game;

        public PlayerHasAvailablePiece (string playerId, PieceType pieceType, Game game) {
            this.playerId = playerId;
            this.pieceType = pieceType;
            this.game = game;
            throw new System.NotImplementedException();
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
