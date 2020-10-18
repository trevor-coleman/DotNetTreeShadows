namespace dotnet_tree_shadows.Actions.Validators {
  public class PlayerIsHost : AAction.AActionValidator {

    private readonly string playerId;
    private readonly Models.SessionModel.Session session;

    public PlayerIsHost (Models.SessionModel.Session session, string playerId) {
      this.playerId = playerId;
      this.session = session;
    }

    public override bool IsValid {
      get => session.Host == playerId;
    }
    public override string? FailureMessage { get; }

  }
}
