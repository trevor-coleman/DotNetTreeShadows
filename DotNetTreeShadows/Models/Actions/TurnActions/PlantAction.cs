using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
    public class PlantAction : ATurnActionWithOrigin {
      public override GameActionType Type {
        get => GameActionType.Plant;
      }

      protected override IEnumerable<GameStatus> PermittedDuring { get; } = new []{ GameStatus.InProgress };
      
        private Hex Target { get; }
        public TreeType? TreeType { get; }

        public PlantAction (Params actionParams) : base(
                actionParams
            ) {
          (_, _, Game? game, _,_) = actionParams;
          Game = game!;
          TreeType = PlayerBoard.Get( game, PlayerId).TreeType;
            Target = (Hex) actionParams.Request.Target!;
            
            AddValidators(
                new AActionValidator[] {
                  new PlayerCanAffordCost( PlayerId, 1, Game ),
                  new PlayerHasAvailablePiece( PlayerId, PieceType.Seed, Game ),
                  new PieceTypeIsTree( Origin, Game, Board),
                  new TilePieceTypeIs( Target, null, Game, Board ),
                  new WithinRangeOfOrigin( Origin, Target, Tile.GetPieceHeight(Board[Origin]) ),
                  new GrowthInShadowAllowed( Target, Game, Board ),
                }
              );
        }


        protected override void DoAction () {
          PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
          int tileCode = Board[Origin];
          tileCode = Tile.SetPieceType( tileCode, PieceType.Seed );
          tileCode = Tile.SetTreeType( tileCode, TreeType );
          playerBoard.SpendLight( 1 );
          Game.PlayerBoards[PlayerId] = playerBoard.BoardCode;
          Board[Origin] = tileCode;
          Game.TilesActiveThisTurn = Game.TilesActiveThisTurn.Append( Origin ).ToArray();
          Game.TilesActiveThisTurn = Game.TilesActiveThisTurn.Append( Target ).ToArray();
          PlayerBoard.Set( Game, PlayerId, playerBoard );
        }

        protected override void UndoAction () {
          PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
          int result = Board[Origin];
          result = Tile.SetPieceType( result, null );
          result = Tile.SetTreeType( result, null );
          playerBoard.RecoverLight( 1 );
          Game.PlayerBoards[PlayerId] = playerBoard.BoardCode;
          Board[Target] = result;
          Game.TilesActiveThisTurn = Game.TilesActiveThisTurn.Where( h => h != Target ).ToArray();
            Game.TilesActiveThisTurn= Game.TilesActiveThisTurn.Where( h => h != Origin ).ToArray();
        }
        
        public class Params : AActionWithGameAndBoardParams {

          public Params (ActionRequest request, string playerId, Game game, Board board) : base( request, playerId, game, board ) { }

        }
    }
    

}
