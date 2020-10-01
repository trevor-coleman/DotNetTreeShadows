using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public class GameActionFactory {
    public static EndTurnAction EndTurnAction (Game game, string playerId) => new EndTurnAction( game, playerId );
  }
}
