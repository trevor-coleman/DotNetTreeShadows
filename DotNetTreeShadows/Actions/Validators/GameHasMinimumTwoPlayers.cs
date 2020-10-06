using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public class GameHasMinimumTwoPlayers : ATurnAction.AActionValidator {
    private readonly Game game;
    public GameHasMinimumTwoPlayers (Game game) {
      this.game = game;
    }

    public override bool IsValid {
      get => game.TurnOrder.Length >= 2;
    }
    public override string? FailureMessage {
      get => "2 players required to start game";
    }
  }
}