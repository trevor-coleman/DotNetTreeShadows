using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
  class PlaceFirstTreeAction : ATurnAction {

    private readonly HexCoordinates target;

    public PlaceFirstTreeAction (Game game, string playerId, HexCoordinates target) : base( game, playerId ) {
      this.target = target; 
      AddValidators( new AActionValidator[] {
        new ValidTile(target, game),
        new TilePieceTypeIs(target,null, game),
      } );
    }

    public override GameActionType Type {
      get => GameActionType.PlaceFirstTree;
    }

    protected override IEnumerable<Game.GameStatus> PermittedDuring {
      get => new[] { Game.GameStatus.PlacingFirstTrees };
    }

    protected override void DoAction () { throw new NotImplementedException(); }
    protected override void UndoAction () { throw new NotImplementedException(); }

  }
}
