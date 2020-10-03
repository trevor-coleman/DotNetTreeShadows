using System;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.GameActions.HostActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.EntityFrameworkCore.Metadata;

namespace dotnet_tree_shadows.Models.GameActions {
  public class ActionFactory {

    public static EndTurnAction EndTurnAction (Game game, string playerId) => new EndTurnAction( game, playerId );

    public static bool Create (Session session, string playerId, ActionRequest request, out AAction? action) {
      Game game = session.Game;
      action = request.Type switch {
        GameActionType.Buy => request.HasRequiredProps( "PieceType" )
                                ? new BuyAction( game, playerId, (PieceType) request.PieceType! )
                                : null,
        GameActionType.Plant => request.HasRequiredProps( "Origin", "Target" )
                                  ? new PlantAction(
                                      game,
                                      playerId,
                                      (HexCoordinates) request.Origin!,
                                      (HexCoordinates) request.Target!
                                    )
                                  : null,
        GameActionType.Grow => request.HasRequiredProps( "Origin" )
                                 ? new GrowAction( game, playerId, (HexCoordinates) request.Origin! )
                                 : null,
        GameActionType.Collect => request.HasRequiredProps( "Origin" )
                                    ? new GrowAction( game, playerId, (HexCoordinates) request.Origin! )
                                    : null,
        GameActionType.EndTurn => new EndTurnAction( game, playerId ),
        GameActionType.StartGame => new StartGameAction( game, playerId ),
        GameActionType.PlaceStartingTree => request.HasRequiredProps( "Origin" )
                                           ? new PlaceStartingTreeAction( game, playerId, (HexCoordinates) request.Target! )
                                           : null,
        GameActionType.UndoAction => null, // request.HasRequiredProps( "ActionId" ) ? new UndoAction(game, playerId, request.ActionId) : null,
        GameActionType.Resign => null, //new ResignAction(game, playerId),
        GameActionType.Kick => null, // request.HasRequiredProps("TargetPlayerId") ? new KickAction(game, playerId, request.TargetPlayerId) : null,
        _ => throw new ArgumentOutOfRangeException()
      };

      return action != null;
    }

  }
}
