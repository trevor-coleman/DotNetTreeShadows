using System;
using System.Threading.Tasks;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Services.GameActionService.Actions;

namespace dotnet_tree_shadows.Services.GameActionService {
  public class GameActionService {

    private BoardService boardService;

    private GameService gameService;
    private SessionService sessionService;

    public GameActionService (GameService gameService, BoardService boardService, SessionService sessionService) {
      this.gameService = gameService;
      this.boardService = boardService;
      this.sessionService = sessionService;
    }

    public async Task<PlantAction> PlantAction (string sessionId, string playerId, int originCode, int targetCode) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.Plant,
        SessionId = sessionId,
        PlayerId = playerId,
        PieceType = PieceType.Seed,
        Origin = new Hex( originCode ),
        Target = new Hex( targetCode ),
        Cost = 1
      };

      context = await HydrateContext( context );

      return new PlantAction( context );
    }

    public async Task<BuyAction> BuyAction (string sessionId, string playerId, PieceType pieceType) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.Buy,
        SessionId = sessionId,
        PlayerId = playerId,
        PieceType = pieceType
      };

      Console.WriteLine( pieceType );

      context = await HydrateContext( context );

      return new BuyAction( context );
    }

    public async Task<PlaceStartingTreeAction> PlaceStartingTreeAction (
        string sessionId,
        string playerId,
        int hexCode
      ) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.PlaceStartingTree,
        SessionId = sessionId,
        PlayerId = playerId,
        Origin = new Hex( hexCode ),
        Target = new Hex( hexCode )
      };

      context = await HydrateContext( context );

      return new PlaceStartingTreeAction( context );
    }

    public async Task<GrowAction> GrowAction (string sessionId, string playerId, int origin) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.Grow,
        SessionId = sessionId,
        PlayerId = playerId,
        Origin = new Hex( origin ),
        Target = new Hex( origin )
      };

      context = await HydrateContext( context );

      return new GrowAction( context );
    }

 public async Task<CollectAction> CollectAction (string sessionId, string playerId, int origin) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.Collect,
        SessionId = sessionId,
        PlayerId = playerId,
        Origin = new Hex( origin ),
        Target = new Hex( origin ),
      };

      context = await HydrateContext( context );

      return new CollectAction( context );
    }

    public async Task<StartGameAction> StartGameAction (string sessionId, string playerId) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.StartGame, SessionId = sessionId, PlayerId = playerId
      };

      await HydrateContext( context );

      return new StartGameAction( context );
    }

    public async Task<EndTurnAction> EndTurnAction (string sessionId, string playerId) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.EndTurn, SessionId = sessionId, PlayerId = playerId
      };

      await HydrateContext( context );

      return new EndTurnAction( context );
    }

    public async Task<ActionContext> HydrateContext (ActionContext context) {
      Task<Board> boardTask;
      Task<Session> sessionTask;

      Task<Game> gameTask = FetchGame( context.SessionId );
      context.PermittedGameStatuses = new[] { GameStatus.InProgress };

      switch ( context.GameActionType ) {
        case GameActionType.EndTurn:
          boardTask = FetchBoard( context.SessionId );
          context.Game = await gameTask;
          context.Board = await boardTask;
          break;
        
        case GameActionType.Buy:
          context.Game = await gameTask;
          break;
        
        case GameActionType.PlaceStartingTree:
          boardTask = FetchBoard( context.SessionId );
          context.Game = await gameTask;
          context.Board = await boardTask;
          context.PermittedGameStatuses = new[] { GameStatus.PlacingFirstTrees, GameStatus.PlacingSecondTrees };
          break;
        
        case GameActionType.Grow:
          boardTask = FetchBoard( context.SessionId );
          context.Board = await boardTask;
          context.Game = await gameTask;
          break;
        
        case GameActionType.PlaceSecondTree:
        case GameActionType.Collect:
        case GameActionType.Plant:
          boardTask = FetchBoard( context.SessionId );
          context.Board = await boardTask;
          context.Game = await gameTask;
          break;
        
        case GameActionType.StartGame:
          sessionTask = FetchSession( context.SessionId );
          context.Game = await gameTask;
          context.Session = await sessionTask;
          context.PermittedGameStatuses = new[] { GameStatus.Preparing };
          break;
        case GameActionType.Undo: break;
        case GameActionType.Resign: break;
        case GameActionType.Kick: break;
        default: throw new ArgumentOutOfRangeException( nameof(context.GameActionType), context.GameActionType, null );
      }

      return context;
    }

    private Task<Game> FetchGame (string sessionId) => gameService.Get( sessionId );

    private Task<Session> FetchSession (string sessionId) => sessionService.Get( sessionId );

    private Task<Board> FetchBoard (string sessionId) => boardService.Get( sessionId );

  }
}
