using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService.ActionValidation;

namespace dotnet_tree_shadows.Services.GameActionService.Actions {
  public class BuyAction:AAction {
    
    public BuyAction (ActionContext context) { this.ActionContext = context; }
    
    protected override ActionContext DoAction (ActionContext context) {
      
      if ( context.Game == null ) throw new InvalidOperationException("Action context missing required property (Game)");
      if ( context.PieceType == null ) throw new InvalidOperationException("Action context missing required property (PieceType)");
      
      Game game = context.Game;
      PieceType pieceType = (PieceType) context.PieceType;
      PlayerBoard playerBoard = PlayerBoard.Get( game, context.PlayerId );
      int price = playerBoard.Pieces( pieceType ).NextPrice;
      playerBoard.SpendLight( price );
      playerBoard.Pieces( pieceType).DecreaseOnPlayerBoard();
      playerBoard.Pieces( pieceType).IncreaseAvailable();
      game.SetPlayerBoard( context.PlayerId, playerBoard );
      
      context.Game = game;
      
      return context;

    }
    
    protected override ActionContext ActionContext { get; }



    protected override IEnumerable<Func<ActionContext, bool>> Validators { get; } =
      new Func<ActionContext, bool> [] {
        ValidIf.IsPlayersTurn,
        ValidIf.GameIsInPermittedState,
        ValidIf.PlayerCanAffordCostOfPiece,
        ValidIf.PlayerHasPieceOnPlayerBoard,
      };

  }
}
