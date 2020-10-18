using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
    public class TilePieceTypeIs : AAction.AActionValidator {
        private readonly Hex Target;
        private readonly PieceType? PieceType;
        private readonly Game Game;
        private readonly Board Board;

        public TilePieceTypeIs (in Hex target, PieceType? pieceType, Game game, Board board) {
            Target = target;
            PieceType = pieceType;
            Game = game;
            Board = board;
        }

        public override bool IsValid {
            get => Tile.GetPieceType( Board.Get(Target)) == PieceType;
        }
        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"PieceType at target is {PieceType.ToString()} .";
        }
    }
}
