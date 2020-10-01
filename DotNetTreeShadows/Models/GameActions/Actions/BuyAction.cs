using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public class BuyAction : AGameAction {
    public override GameActionType Type { get; } = GameActionType.Buy;

    public PieceType PieceType { get; }
    private int price;

    public BuyAction (Game game, string playerId, PieceType pieceType) : base( game, playerId ) {
      PieceType = pieceType;
      int cost = game.PlayerBoards[playerId].Pieces( pieceType ).NextPrice;

      AddValidators(
          new AActionValidator[] {
            new OnPlayersTurn( playerId, game ),
            new PlayerHasPieceOnPlayerBoard( playerId, pieceType, game ),
            new PlayerCanAffordCost( PlayerId, cost, game ),
          }
        );
    }
    
    protected override void DoAction () {
      BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];
      BitwisePlayerBoard.PieceCount pieces = playerBoard.Pieces( PieceType );
      price = pieces.NextPrice;
      playerBoard.Light -= price;
      pieces.IncreaseAvailable();
      pieces.DecreaseOnPlayerBoard();
    }

    protected override void UndoAction () {
      BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];
      playerBoard.Light += price;
      playerBoard.Pieces( PieceType ).DecreaseAvailable();
      playerBoard.Pieces( PieceType ).IncreaseOnPlayerBoard();
    }
  }
}
