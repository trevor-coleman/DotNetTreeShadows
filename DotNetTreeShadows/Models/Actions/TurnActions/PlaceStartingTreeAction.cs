using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.BoardModel;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
  class PlaceStartingTreeAction : ATurnAction {

    public Board Board { get; }
    public Hex Target { get; }

    public PlaceStartingTreeAction (Params actionParams)
     : base( actionParams ) {
      AddValidators( new AActionValidator[] {
        new ValidTile(Target),
        new TilePieceTypeIs(Target,null, Game, Board),
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
      int result = Board[Target];
      result = Tile.SetPieceType(result, PieceType.SmallTree );
      TreeType treeType = playerBoard.TreeType;
      result = Tile.SetTreeType( result, treeType );
      playerBoard.Pieces( PieceType.SmallTree ).DecreaseAvailable();
      PlayerBoard.Set( Game, PlayerId, playerBoard );
      Board[Target] = result;
      PlayerBoard.Set( Game, PlayerId, playerBoard );
    }
    protected override void UndoAction () { throw new NotImplementedException(); }

    public class Params : AActionWithGameAndBoardParams {

      public Params (ActionRequest request, string playerId, Game game, Board board) : base( request, playerId, game, board ) { }

    }
  }
  
  
}
