using System;
using System.Threading.Tasks;
using dotnet_tree_shadows.Actions;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModel;
using dotnet_tree_shadows.Services.GameActionService.Actions;

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

    public PlaceStartingTreeAction PlaceStartingTreeAction (string sessionId, string playerId, int hexCode) {
      ActionContext context = new ActionContext {
        GameActionType = GameActionType.PlaceStartingTree,
        SessionId = sessionId,
        PlayerId = playerId,
        Origin = new Hex( hexCode ),
        Target = new Hex( hexCode ),
      };

      HydrateContext( context );
      
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

      switch ( context.GameActionType ) {
        case GameActionType.EndTurn: break;
        case GameActionType.Buy: 
          gameTask = FetchGame( context.SessionId);
          context.Game = await gameTask;
          break;
        case GameActionType.Grow: 
        case GameActionType.Collect: 
        case GameActionType.Plant:
        case GameActionType.PlaceStartingTree:
        case GameActionType.PlaceSecondTree:
          gameTask = FetchGame( context.SessionId);
          Task<Board> boardTask = FetchBoard( context.SessionId );
          context.Board = await boardTask;
          context.Game = await gameTask;
          break;
        case GameActionType.StartGame:
          gameTask = FetchGame( context.SessionId);
          Task<Session> sessionTask = FetchSession( context.SessionId);
          context.Game = await gameTask;
          context.Session = await sessionTask;
          break;
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
