using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
    public class PieceCanBeReturnedSafely : ATurnAction.AActionValidator {
        private readonly string playerId;
        private readonly Hex target;
        private readonly Game game;
        private readonly PieceType? pieceType;

        public PieceCanBeReturnedSafely (in Hex target, string playerId, Game game, Board board) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;
            pieceType = Tile.GetPieceType( board.Get(target) );
        }

        public override bool IsValid {
            get => pieceType != null && PlayerBoard.Get( game, playerId ).Pieces( (PieceType) pieceType ).CanReturnSafely();
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Piece cannot be returned safely. Send GrowAndLosePieceAction to override.";
        }
    }
}
