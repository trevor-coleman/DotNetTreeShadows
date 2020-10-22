using System;
using System.Linq;
using System.Threading.Tasks;
using dotnet_tree_shadows.Actions.HostActions;
using dotnet_tree_shadows.Actions.TurnActions;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Authentication;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services;
using dotnet_tree_shadows.Services.GameActionService;

namespace dotnet_tree_shadows.Actions {
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
      Models.SessionModel.Session session;
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
          session = await sessionService.Get( sessionId );
          actionParams = new StartGameAction.Params( actionRequest, playerId, session, game );
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

    public async Task Commit (AAction action) {
      switch ( action ) {
        case StartGameAction a:
          await gameService.Update( a.Game );
          break;
        case BuyAction a:
          await gameService.Update( a.Game );
          break;
        case CollectAction a:
          await gameService.Update( a.Game );
          await boardService.Update(a.Board.Id, a.Board );
          break;
        case EndTurnAction a:
          await gameService.Update(a.Game.Id, a.Game );
          break;
        case GrowAction a:
          await gameService.Update( a.Game );
          await boardService.Update(a.Board.Id, a.Board );
          break;
        case PlaceStartingTreeAction a:
          await gameService.Update( a.Game );
          await boardService.Update(a.Board.Id, a.Board );
          break;
        case PlantAction a:
          await gameService.Update( a.Game );
          await boardService.Update(a.Board.Id, a.Board );
          break;
        default: throw new ArgumentOutOfRangeException( nameof(action) );
      }
    }

    public static bool Create (AActionParams actionParams, out AAction? action) {
      

      action = actionParams switch {
        BuyAction.Params p => ActionRequest.HasRequiredProps(actionParams.Request, "PieceType" ) && AreNotNull( actionParams.Game )
                                ? new BuyAction( p )
                                : null,
        PlantAction.Params p => ActionRequest.HasRequiredProps(actionParams.Request, "Origin", "Target" ) && AreNotNull( actionParams.Game, actionParams.Board )
                                  ? new PlantAction( p )
                                  : null,
        GrowAction.Params p => ActionRequest.HasRequiredProps(actionParams.Request, "Origin" ) && AreNotNull( actionParams.Game, actionParams.Board )
                                 ? new GrowAction( p )
                                 : null,
        CollectAction.Params p => ActionRequest.HasRequiredProps(actionParams.Request, "Origin" ) && AreNotNull( actionParams.Game, actionParams.Board )
                                    ? new CollectAction( p )
                                    : null,
        EndTurnAction.Params p => AreNotNull( actionParams.Game )
                                    ? new EndTurnAction( p )
                                    : null,
        StartGameAction.Params p => AreNotNull( actionParams.Session, actionParams.Game )
                                      ? new StartGameAction( p )
                                      : null,
        PlaceStartingTreeAction.Params p => ActionRequest.HasRequiredProps(actionParams.Request, "Origin" ) && AreNotNull( actionParams.Game, actionParams.Board )
                                              ? new PlaceStartingTreeAction( p )
                                              : null,
        _ => throw new ArgumentOutOfRangeException()
      };

      return action != null;
    }

    private static bool AreNotNull (params object?[] args) { return args.All( arg => args != null ); }

  }
}
