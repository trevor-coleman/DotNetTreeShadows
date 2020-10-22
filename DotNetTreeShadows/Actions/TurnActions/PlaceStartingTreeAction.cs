using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Actions.Validators;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services.GameActionService;

namespace dotnet_tree_shadows.Actions.TurnActions {
  class PlaceStartingTreeAction : ATurnActionWithOrigin {
    

    public PlaceStartingTreeAction (Params actionParams)
     : base( actionParams ) {
      AddValidators( new AActionValidator[] {
        new ValidTile(Origin),
        new TilePieceTypeIs(Origin,null, Game, Board),
      } );
    }

    public override GameActionType Type {
      get => GameActionType.PlaceStartingTree;
    }

    protected override IEnumerable<GameStatus> PermittedDuring {
      get => new[] { GameStatus.PlacingFirstTrees };
    }

    protected override void DoAction () {
      PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
      int result = Board.Get(Origin);
      result = Tile.SetPieceType(result, PieceType.SmallTree );
      TreeType treeType = playerBoard.TreeType;
      result = Tile.SetTreeType( result, treeType );
      playerBoard.Pieces( PieceType.SmallTree ).DecreaseAvailable();
      PlayerBoard.Set( Game, PlayerId, playerBoard );
      Board.Set(Origin, result);
      PlayerBoard.Set( Game, PlayerId, playerBoard );
    }
    protected override void UndoAction () { throw new NotImplementedException(); }

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
