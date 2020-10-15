using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class PieceTypeIsTree : ATurnAction.AActionValidator {
        private readonly Hex origin;
        private readonly Game game;
        private readonly Board board;

        public PieceTypeIsTree (in Hex origin, Game game, Board board) {
            this.origin = origin;
            this.game = game;
            this.board = board;
            
        }

        public override bool IsValid {
          get => (int) (Tile.GetPieceType( board.Tiles[origin] ) ?? 0) > (int) PieceType.Seed;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Origin is not a tree.";
        }
    }
}
