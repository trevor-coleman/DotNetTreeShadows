using dotnet_tree_shadows.Actions.Validators;

namespace dotnet_tree_shadows.Actions {
  public abstract class AHostAction:AAction {

    public readonly Models.SessionModel.Session Session;

    protected AHostAction (AActionParams actionParams) : base( actionParams ) {
      Session = actionParams.Session!;
      AddValidators( new AActionValidator[]{new PlayerIsHost(Session, PlayerId)} );
    }
  }
}
