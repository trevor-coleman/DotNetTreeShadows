namespace dotnet_tree_shadows.Models.SessionModels {
    public class GrowActionValidator {

        private Game.GameOptions options { get; }
        private Board board;
        private PlayerBoard playerBoard;
        
        public GrowActionValidator (Game.GameOptions gameOptions, PlayerBoard playerBoard, Board board) {
            this.options = gameOptions;
            this.playerBoard = playerBoard;
        }
        
        public bool CanGrow (HexCoordinates targetHex, out string failureReasons, out Tile? tile) {
            failureReasons = "";
            bool canGrow = true;
            tile = null;

            if ( !board.Tiles.TryGetValue( targetHex, out uint tileCode ) ) {
                failureReasons += "Tried to grow with hex that is not in the board. ";
                return false;
            }
            
            tile = new Tile(tileCode);
            
            PieceType? targetPiece = tile.PieceType;
            TreeType? targetTree = tile.TreeType;
            
            if ( targetTree != playerBoard.TreeType ) {
                failureReasons += "Tried to grow another player's tree.";
                return false;
            }

            if ( targetPiece == null || targetTree == null) {
                failureReasons += "Tile is empty. ";
                canGrow = false;
            }

            if ( options.PreventActionsInShadow && tile.ShadowHeight > 0 ) {
                failureReasons += "Game options don't allow growth in shadow. ";
                canGrow = false;
            }

            if ( tile.PieceType == SessionModels.PieceType.LargeTree ) {
                failureReasons += "Can't grow large tree. ";
                canGrow = false;
            }
            
            if ( !playerBoard.TryHandleGrowTree( targetPiece, out bool _, out string playerFailureReasons ) ) {
                failureReasons += $"Player can't grow tree: {playerFailureReasons} ";
                canGrow = false;
            }
            
            
            
            failureReasons = canGrow ? null : failureReasons;
            return true;

        }
    }
}
