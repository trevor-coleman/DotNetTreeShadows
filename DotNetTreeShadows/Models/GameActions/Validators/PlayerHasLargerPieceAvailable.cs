using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PlayerHasLargerPieceAvailable : AGameAction.AActionValidator {
        private readonly string playerId;
        private readonly HexCoordinates target;
        private readonly Game game;
        private readonly PieceType largerPiece;

        public PlayerHasLargerPieceAvailable (in HexCoordinates target, string playerId,Game game) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;

            Tile? tile = game.Board.GetTileAt( target );
            if ( tile != null ) {
                largerPiece = (PieceType) ((int) tile!.PieceType! + 1);
            } 
        }

        public override bool IsValid {
            get => game.PlayerBoards[playerId].Pieces( largerPiece ).Available != 0;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player doesn't have a larger piece available to grow into.";
        }
    }
}
