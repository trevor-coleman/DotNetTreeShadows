using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Actions.Validators;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.TurnActions {
  public class CollectAction : ATurnActionOnOwnPiece {

    public override GameActionType Type {
      get => GameActionType.Collect;
    }

    protected override IEnumerable<GameStatus> PermittedDuring { get; } = new[] { GameStatus.InProgress };

    public CollectAction (Params actionParams) : base( actionParams ) {
      (ActionRequest request, string playerId, Game? game, _, Board? board) = actionParams;
      Hex origin = (Hex) request.Origin;
      AddValidators(
          new AActionValidator[] {
            new TilePieceTypeIs( origin, PieceType.LargeTree, Game, board ),
            new PlayerCanAffordCost( playerId, 4, game ),
          }
        );
    }

    protected override void DoAction () {
      PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
      Scoring.Token[] playerScore = Game.Scores[PlayerId];
      playerBoard.SpendLight( 4 ); 
      Board.Tiles[Origin.HexCode] = Tile.Empty;
      playerBoard.Pieces( PieceType.LargeTree ).IncreaseOnPlayerBoard();
      if ( ScoreTokens.Take(Game, Origin, out Scoring.Token token )) {
        if ( token != Scoring.Token.NullToken) Game.Scores[PlayerId] = playerScore!.Append( token ).ToArray();
      }
      PlayerBoard.Set( Game, PlayerId, playerBoard );
    }

    protected override void UndoAction () { throw new UndoNotPermittedException(); }

    public class Params : AActionParamsWithGameAndBoard {

      public Params (ActionRequest request, string playerId, Game game, Board board) : base(
          request,
          playerId,
          game,
          board
        ) { }

    }

    public override GameHub.SessionUpdate SessionUpdate () =>
      new GameHub.SessionUpdate() {
        Game = Game,
        Board = Board,
      };
    
  }
}
