using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PlayerHasLargerPieceAvailable : GameAction.IActionValidator {
        private readonly string playerId;
        private readonly HexCoordinates target;
        private readonly Game game;
        private readonly PieceType largerPiece;

        public PlayerHasLargerPieceAvailable (string playerId, in HexCoordinates target, Game game) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;

            Tile? tile = game.Board.GetTileAt( target );
            if ( tile != null ) {
                largerPiece = (PieceType) ((int) tile!.PieceType! + 1);
            } 
        }

        public bool IsValid {
            get => game.PlayerBoards[playerId].Pieces( largerPiece ).Available != 0;
        }

        public string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player doesn't have a larger piece available to grow into.";
        }
    }
}
