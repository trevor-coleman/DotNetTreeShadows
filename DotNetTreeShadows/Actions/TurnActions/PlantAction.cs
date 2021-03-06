using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Actions.Validators;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService;

namespace dotnet_tree_shadows.Actions.TurnActions {
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
                  new WithinRangeOfOrigin( Origin, Target, Tile.GetPieceHeight(Board.Get(Origin)) ),
                  new GrowthInShadowAllowed( Target, Game, Board ),
                }
              );
        }


        protected override void DoAction () {
          PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
          int tileCode = Board.Get( Origin );
          tileCode = Tile.SetPieceType( tileCode, PieceType.Seed );
          tileCode = Tile.SetTreeType( tileCode, TreeType );
          playerBoard.SpendLight( 1 );
          Game.PlayerBoards[PlayerId] = playerBoard.BoardCode;
          Board.Set(Origin, tileCode);
          Game.TilesActiveThisTurn = Game.TilesActiveThisTurn.Append( Origin.HexCode ).ToArray();
          Game.TilesActiveThisTurn = Game.TilesActiveThisTurn.Append( Target.HexCode ).ToArray();
          PlayerBoard.Set( Game, PlayerId, playerBoard );
        }

        protected override void UndoAction () {
          PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
          int result = Board.Get(Origin);
          result = Tile.SetPieceType( result, null );
          result = Tile.SetTreeType( result, null );
          playerBoard.RecoverLight( 1 );
          Game.PlayerBoards[PlayerId] = playerBoard.BoardCode;
          Board.Set( Target, result );
          Game.TilesActiveThisTurn = Game.TilesActiveThisTurn.Where( h => h != Target.HexCode ).ToArray();
          Game.TilesActiveThisTurn= Game.TilesActiveThisTurn.Where( h => h != Origin.HexCode ).ToArray();
        }
        
        public class Params : AActionParamsWithGameAndBoard {

          public Params (ActionRequest request, string playerId, Game game, Board board) : base( request, playerId, game, board ) { }

        }
        
        public override GameHub.SessionUpdate SessionUpdate () =>
          new GameHub.SessionUpdate() {
            Game = Game,
            Board = Board,
          };
    }
    

}
