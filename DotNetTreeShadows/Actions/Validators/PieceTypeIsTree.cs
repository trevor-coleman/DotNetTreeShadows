using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
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
          get => (int) (Tile.GetPieceType( board.Get(origin) ) ?? 0) > (int) PieceType.Seed;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Origin is not a tree.";
        }
    }
}
