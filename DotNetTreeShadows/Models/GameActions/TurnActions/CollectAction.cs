using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.TurnActions {
  public class CollectAction : ATurnActionWithOrigin {
    public override GameActionType Type {
      get => GameActionType.Collect;
    }

    protected override IEnumerable<Game.GameStatus> PermittedDuring { get; } = new []{ Game.GameStatus.InProgress };

    public CollectAction (Game game, string playerId, HexCoordinates origin) : base( game, playerId, origin ) {
      AddValidators(
          new AActionValidator[] {
            new TilePieceTypeIs( origin, PieceType.LargeTree, Game ), new PlayerCanAffordCost( playerId, 4, game ),
          }
        );
    }
    
    protected override void DoAction () {
      BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];
      Scoring.PlayerScore playerScore = Game.PlayerScores[PlayerId];
      playerBoard.SpendLight( 4 );
      Tile tile = Game.Board.GetTileAt( Origin );
      tile.PieceType = null;
      tile.TreeType = null;
      playerBoard.Pieces( PieceType.LargeTree ).IncreaseOnPlayerBoard();
      if ( Game.ScoreTokenStacks.Take(
          HexCoordinates.Distance( Origin, HexCoordinates.Zero ),
          out Scoring.Token token
        ) ) {
        playerScore.CollectToken( token );
      }
    }

    protected override void UndoAction () { throw new UndoNotPermittedException(); }
  }
}
