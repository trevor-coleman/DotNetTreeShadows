using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class TileBelongsToPlayer : ATurnAction.AActionValidator {
        private readonly string playerId;
        private readonly Board board;
        private readonly Hex target;
        private readonly Game game;

        public TileBelongsToPlayer (in Hex target,string playerId, Game game, Board board) {
            this.playerId = playerId;
            this.board = board;
            this.target = target;
            this.game = game;
        }

        public override bool IsValid {
          get => Tile.GetTreeType( board.Tiles[target] ) == PlayerBoard.Get( game, playerId ).TreeType;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Player does not own the tree on that tile.";

        }
    }
}
