using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public class PlayerIsHost : AAction.AActionValidator {

    private readonly string playerId;
    private readonly SessionModel.Session session;

    public PlayerIsHost (SessionModel.Session session, string playerId) {
      this.playerId = playerId;
      this.session = session;
    }

    public override bool IsValid {
      get => session.Host == playerId;
    }
    public override string? FailureMessage { get; }

  }
}
