using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public class PlayerIsHost : AAction.AActionValidator {

    private readonly string playerId;
    private readonly Game game;

    public PlayerIsHost (string playerId, Game game) {
      this.playerId = playerId;
      this.game = game;
      throw new System.NotImplementedException();
    }

    public override bool IsValid {
      get => game.Host == playerId;
    }
    public override string? FailureMessage { get; }

  }
}
