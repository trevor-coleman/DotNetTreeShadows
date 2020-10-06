using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public abstract class AHostAction:AAction {

    public readonly SessionModel.Session Session;

    protected AHostAction (AActionParams actionParams) : base( actionParams ) {
      Session = actionParams.Session!;
      AddValidators( new AActionValidator[]{new PlayerIsHost(Session, PlayerId)} );
    }
  }
}
