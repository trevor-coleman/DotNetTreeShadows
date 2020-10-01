using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PieceCanBeReturnedSafely : GameAction.IActionValidator {
        private readonly string playerId;
        private readonly HexCoordinates target;
        private readonly Game game;
        private readonly PieceType? pieceType;

        public PieceCanBeReturnedSafely (string playerId, in HexCoordinates target, Game game) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;
            pieceType = game.Board.TileAt( target ).PieceType;
        }
        public bool IsValid {
            get => pieceType != null && game.PlayerBoards[playerId].Pieces( (PieceType) pieceType ).CanReturnSafely();
        }
        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Piece cannot be returned safely. Send GrowAndLosePiece to override.";
        }
    }
}
