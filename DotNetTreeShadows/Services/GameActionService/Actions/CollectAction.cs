using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.Shadow;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class CollectAction:AAction {

    public CollectAction (ActionContext actionContext) { ActionContext = actionContext; }

    protected override ActionContext ActionContext { get; }

    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } = new Func<ActionContext, bool>[] {
      ValidIf.IsPlayersTurn,
      ValidIf.GameIsInPermittedState,
      ValidIf.OriginIsValidTile,
      ValidIf.OriginPieceTypeIsTree,
      ValidIf.TargetIsLargeTree,
    };

    protected override ActionContext DoAction (ActionContext context) {
      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.Board == null ) throw new InvalidOperationException("Action context missing required property (Board)");
      if ( context.Origin == null ) throw new InvalidOperationException("Action context missing required property (Origin)");
      if ( context.Target == null ) throw new InvalidOperationException("Action context missing required property (Target)");

      string playerId = context.PlayerId;
      Game game = context.Game;
      Board board = context.Board;
      Hex origin = (Hex) context.Origin; 
      
      PlayerBoard playerBoard = PlayerBoard.Get( game, playerId );
      Scoring.Token[] playerScore = game.Scores[playerId];
      playerBoard.SpendLight( 4 ); 
      board[origin] = Tile.Empty;
      playerBoard.Pieces( PieceType.LargeTree ).IncreaseOnPlayerBoard();
      if ( ScoreTokens.Take(game, origin, out Scoring.Token? token )) {
        if ( token != null) game.Scores[playerId] = playerScore!.Append( token ).ToArray();
      }
      PlayerBoard.Set( game, playerId, playerBoard );
      board.Tiles = Shadow.UpdateAllShadows( board, game.SunPosition );
      
      
      return context;
    }
    
  }
}
