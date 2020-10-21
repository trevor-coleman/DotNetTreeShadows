using System;
using System.Threading.Tasks;
using dotnet_tree_shadows.Actions;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Services.GameActionService.Actions;
using ServiceStack.Text;

namespace dotnet_tree_shadows.Services.GameActionService {
  public class GameActionService {

    private GameService gameService;
    private BoardService boardService;
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
        Cost = 1,
      };
      
      context = await HydrateContext( context );
      
      return new PlantAction( context );
      
    }
    
    public async Task<PlaceStartingTreeAction> PlaceStartingTreeAction (string sessionId, string playerId, int hexCode) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.PlaceStartingTree,
        SessionId = sessionId,
        PlayerId = playerId,
        Origin = new Hex( hexCode ),
        Target = new Hex( hexCode ),
      };

      context = await HydrateContext( context );
      
      return new PlaceStartingTreeAction( context );
      
    }
    
    public async Task<StartGameAction> StartGameAction (string sessionId, string playerId) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.StartGame,
        SessionId = sessionId,
        PlayerId = playerId,
      };

      await HydrateContext( context );
      
      return new StartGameAction( context );
      
    }

    public async Task<ActionContext> HydrateContext (ActionContext context) {
      
      Task<Game> gameTask;
      Task<Board> boardTask;
      Task<Session> sessionTask;
      switch ( context.GameActionType ) {
        case GameActionType.EndTurn: break;
        case GameActionType.Buy: 
          gameTask = FetchGame( context.SessionId);
          context.Game = await gameTask;
          break;
        case GameActionType.PlaceStartingTree:
        case GameActionType.PlaceSecondTree:
        case GameActionType.Grow: 
        case GameActionType.Collect: 
        case GameActionType.Plant:
          gameTask = FetchGame( context.SessionId);
          boardTask = FetchBoard( context.SessionId );
          context.Board = await boardTask;
          context.Game = await gameTask;
          return context;
          
        case GameActionType.StartGame:
          gameTask = FetchGame( context.SessionId);
          sessionTask = FetchSession( context.SessionId);
          context.Game = await gameTask;
          context.Session = await sessionTask;
          return context;
        case GameActionType.UndoAction: break;
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
