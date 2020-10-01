using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PlayerCanAffordLargerPiece : GameAction.AActionValidator {
        private readonly string playerId;
        private readonly HexCoordinates target;
        private readonly Game game;
        private readonly int largerPiecePrice;

        public PlayerCanAffordLargerPiece ( in HexCoordinates target, string playerId, Game game) {
            this.playerId = playerId;
            this.target = target;
            this.game = game;

            Tile? tile = game.Board.GetTileAt( target );
            if ( tile != null ) {
                largerPiecePrice = (int) tile!.PieceType! + 1;
            } 
        }

        public override bool IsValid {
            get => game.PlayerBoards[playerId].Light >= largerPiecePrice;
        }
        public override string? FailureMessage { get=> IsValid? null : "Can't afford to grow that piece."; }
    }
}
