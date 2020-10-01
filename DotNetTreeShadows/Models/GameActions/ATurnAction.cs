using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Driver;

namespace dotnet_tree_shadows.Models.GameActions {
  public abstract class ATurnAction : AAction {

    protected ATurnAction (Game game, string playerId) : base( game, playerId ) {
      AddValidators(
          new AActionValidator[] {
            new OnPlayersTurn( playerId, game )
          }
        );
    }

  }
  
}
