using System.Collections.Generic;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
  public class BuyAction : ATurnAction {
    
    public PieceType PieceType { get; }
    public int price;

    public BuyAction (Params actionParams) : base( actionParams ) {

      (ActionRequest request, string playerId, Game? game, _, _) = actionParams;
      Game = game!;
      PieceType pieceType = (PieceType) request.PieceType!;
      int cost = PlayerBoard.Get( Game, playerId ).Pieces( pieceType ).NextPrice;

      AddValidators(
          new AActionValidator[] {
            new PlayerHasPieceOnPlayerBoard( playerId, pieceType, Game ),
            new PlayerCanAffordCost( PlayerId, cost, Game ),
          }
        );
    }

    public override GameActionType Type {
      get => GameActionType.Buy;
    }

    protected override IEnumerable<GameStatus> PermittedDuring { get; } = new[] { GameStatus.InProgress };

    protected override void DoAction () {
      PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
      PlayerBoard.PieceCount pieces = playerBoard.Pieces( PieceType );
      price = pieces.NextPrice;
      playerBoard.Light -= price;
      pieces.IncreaseAvailable();
      pieces.DecreaseOnPlayerBoard();
      PlayerBoard.Set( Game, PlayerId, playerBoard );
    }

    protected override void UndoAction () {
      PlayerBoard playerBoard = PlayerBoard.Get(Game, PlayerId);
      playerBoard.Light += price;
      playerBoard.Pieces( PieceType ).DecreaseAvailable();
      playerBoard.Pieces( PieceType ).IncreaseOnPlayerBoard();
      PlayerBoard.Set( Game, PlayerId, playerBoard );
    }

    public override GameHub.SessionUpdate SessionUpdate () =>
      new GameHub.SessionUpdate() {
        Game = Game, 
      };

    public class Params :AActionParams {
    
      public Params (ActionRequest request, string playerId, Game game) : base( request, playerId ) { Game = game; }

    }

  }
}
