using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public class BuyAction : GameAction {
        public PieceType PieceType { get; }
        private int price;

        public BuyAction (Game game, string playerId, PieceType pieceType) : base( game, playerId ) {
            PieceType = pieceType;
            int cost = game.PlayerBoards[playerId].Pieces( pieceType ).NextPrice;
            
                ActionValidators = new IActionValidator[] {
                                                              new OnPlayersTurn( playerId,game ), 
                                                              new PlayerHasPieceOnPlayerBoard( playerId, pieceType, game ),
                                                              new PlayerCanAffordCost(PlayerId, cost, game ), 
                                                          };
        }

        protected override IEnumerable<IActionValidator> ActionValidators { get; }

        public override void Execute () {
            BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];
            BitwisePlayerBoard.PieceCount pieces = playerBoard.Pieces( PieceType );
            price = pieces.NextPrice;
            playerBoard.Light -= price;
            pieces.IncreaseAvailable();
            pieces.DecreaseOnPlayerBoard();
        }

        public override void Undo () {
            BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];
            playerBoard.Light += price;
            playerBoard.Pieces( PieceType ).DecreaseAvailable();
            playerBoard.Pieces( PieceType ).IncreaseOnPlayerBoard();
        }
    }

}
