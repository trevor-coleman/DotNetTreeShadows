using System;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Authentication;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions.HostActions;
using dotnet_tree_shadows.Models.GameActions.TurnActions;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata;

namespace dotnet_tree_shadows.Models.GameActions {
  public class ActionFactory {

    private readonly GameService gameService;
    private readonly BoardService boardService;
    private readonly SessionService sessionService;

    public ActionFactory (GameService gameService, BoardService boardService, SessionService sessionService) {
      this.gameService = gameService;
      this.boardService = boardService;
      this.sessionService = sessionService;
    }

    public async Task<AActionParams> MakeActionParams (
        string sessionId,
        ActionRequest actionRequest,
        UserModel userModel
      ) {
      AActionParams actionParams;
      Game game;
      Board board;
      string playerId = userModel.UserId;

      switch ( actionRequest.Type ) {
        case GameActionType.Buy:
          game = await gameService.Get( sessionId );
          actionParams = new BuyAction.Params( actionRequest, playerId, game );
          break;
        case GameActionType.Plant:
          game = await gameService.Get( sessionId );
          board = await boardService.Get( sessionId );
          actionParams = new PlantAction.Params( actionRequest, playerId, game, board );
          break;
        case GameActionType.Grow:
          game = await gameService.Get( sessionId );
          board = await boardService.Get( sessionId );
          actionParams = new GrowAction.Params( actionRequest, playerId, game, board );
          break;
        case GameActionType.Collect:
          game = await gameService.Get( sessionId );
          board = await boardService.Get( sessionId );
          actionParams = new CollectAction.Params( actionRequest, playerId, game, board );
          break;
        case GameActionType.EndTurn:
          game = await gameService.Get( sessionId );
          actionParams = new EndTurnAction.Params( actionRequest, playerId, game );
          break;
        case GameActionType.StartGame:
          game = await gameService.Get( sessionId );
          actionParams = new EndTurnAction.Params( actionRequest, playerId, game );
          break;
        case GameActionType.PlaceStartingTree:
          game = await gameService.Get( sessionId );
          board = await boardService.Get( sessionId );
          actionParams = new PlaceStartingTreeAction.Params( actionRequest, playerId, game, board );
          break;
        case GameActionType.UndoAction:
        case GameActionType.Resign:
        case GameActionType.Kick:
        default:
          throw new ArgumentOutOfRangeException();
      }

      return actionParams;
    }

    public async void Commit (AAction action) {
      switch ( action ) {
        case StartGameAction startGameAction:
          await gameService.Update( startGameAction.Game );
          break;
        case BuyAction buyAction:
          await gameService.Update( buyAction.Game );
          break;
        case CollectAction collectAction:
          await gameService.Update( collectAction.Game );
          await boardService.Update( collectAction.Board );
          break;
        case EndTurnAction endTurnAction:
          await gameService.Update( endTurnAction.Game );
          break;
        case GrowAction growAction:
          await gameService.Update( growAction.Game );
          await boardService.Update( growAction.Board );
          break;
        case PlaceStartingTreeAction placeStartingTreeAction:
          await gameService.Update( placeStartingTreeAction.Game );
          await boardService.Update( placeStartingTreeAction.Board );
          break;
        case PlantAction plantAction:
          await gameService.Update( plantAction.Game );
          await boardService.Update( plantAction.Board );
          break;
        default: throw new ArgumentOutOfRangeException( nameof(action) );
      }
    }

    public static bool Create (AActionParams actionParams, out AAction? action) {
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
