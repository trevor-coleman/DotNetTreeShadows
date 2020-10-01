using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public abstract class AHostAction:AAction {

    protected AHostAction (Game game, string playerId) : base( game, playerId ) {
      AddValidators( new AActionValidator[]{new PlayerIsHost(playerId, game)} );
    }

  }
}
