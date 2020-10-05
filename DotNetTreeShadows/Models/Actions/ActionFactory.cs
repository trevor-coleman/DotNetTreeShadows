using System;
using System.Linq;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions.HostActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata;

namespace dotnet_tree_shadows.Models.GameActions {
  public static class ActionFactory {

    private static bool Create (AActionParams actionParams, out AAction? action) {
      (ActionRequest request, string playerId, Game? game, SessionModel.Session? session, Board? board) = actionParams;

      action = actionParams switch {
        BuyAction.Params p => request.HasRequiredProps( "PieceType" ) && AreNotNull( game )
                                ? new BuyAction( p )
                                : null,
        PlantAction.Params p => request.HasRequiredProps( "Origin", "Target" ) && AreNotNull( game, board )
                                  ? new PlantAction( p )
                                  : null,
        GrowAction.Params p => request.HasRequiredProps( "Origin" ) && AreNotNull( game, board )
                                 ? new GrowAction( p )
                                 : null,
        CollectAction.Params p => request.HasRequiredProps( "Origin" ) && AreNotNull( game, board )
                                    ? new CollectAction( p )
                                    : null,
        EndTurnAction.Params p => AreNotNull( game )
                                    ? new EndTurnAction( p )
                                    : null,
        StartGameAction.Params p => AreNotNull( session, game )
                                      ? new StartGameAction( p )
                                      : null,
        PlaceStartingTreeAction.Params p => request.HasRequiredProps( "Origin" ) && AreNotNull( game, board )
                                              ? new PlaceStartingTreeAction( p )
                                              : null,
        _ => throw new ArgumentOutOfRangeException()
      };

      return action != null;
    }

    private static bool AreNotNull (params object?[] args) { return args.All( arg => args != null ); }

  }
}
