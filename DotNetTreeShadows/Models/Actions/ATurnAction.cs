using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public abstract class ATurnAction : AAction {

    protected ATurnAction (AActionParams actionParams) : base( actionParams ) {
      AddValidators(
          new AActionValidator[] {
            new OnPlayersTurn( actionParams.PlayerId, actionParams.Game )
          }
        );
    }

  }
}
