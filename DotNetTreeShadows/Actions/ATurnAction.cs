using dotnet_tree_shadows.Actions.Validators;

namespace dotnet_tree_shadows.Actions {
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
