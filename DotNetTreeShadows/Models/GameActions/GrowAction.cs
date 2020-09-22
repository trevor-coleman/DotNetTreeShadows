using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace dotnet_tree_shadows.Models.GameActions {
    public abstract class GameAction {
        public GameActionType ActionType;
        public HexCoordinates? HexCoordinates;
        public PieceType? PieceType;
    }

    public enum GameActionType {
        Buy,
        Plant,
        Grow,
        Collect,
        EndTurn,
        Undo,
    }
}
