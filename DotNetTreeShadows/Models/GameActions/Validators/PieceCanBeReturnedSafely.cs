using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PieceCanBeReturnedSafely : AGameAction.AActionValidator {
        private readonly string playerId;
        private readonly HexCoordinates target;
        private readonly Game game;
        private readonly PieceType? pieceType;

        public PieceCanBeReturnedSafely (in HexCoordinates target, string playerId, Game game) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;
            pieceType = game.Board.GetTileAt( target ).PieceType;
        }

        public override bool IsValid {
            get => pieceType != null && game.PlayerBoards[playerId].Pieces( (PieceType) pieceType ).CanReturnSafely();
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Piece cannot be returned safely. Send GrowAndLosePieceAction to override.";
        }
    }
}
