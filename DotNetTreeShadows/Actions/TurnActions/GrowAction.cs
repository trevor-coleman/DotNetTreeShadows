using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Actions.Validators;
using dotnet_tree_shadows.Hubs;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.TurnActions {
  public class GrowAction : ATurnActionOnOwnPiece {

    public override GameActionType Type {
      get => GameActionType.Grow;
    }

    protected override IEnumerable<GameStatus> PermittedDuring {
      get => new[] { GameStatus.InProgress };
    }

    public GrowAction (Params actionParams) : base( actionParams ) {
      AddValidators(
          new AActionValidator[] {
            new TilePieceTypeIsNot( Origin, PieceType.LargeTree, Board ),
            new TilePieceTypeIsNot( Origin, null, Board ),
            new PieceCanBeReturnedSafely( Origin, PlayerId, Game, Board ),
            new PlayerHasLargerPieceAvailable( Origin, PlayerId, Game, Board ),
            new PlayerCanAffordLargerPiece( Origin, PlayerId, Game, Board ),
            new GrowthInShadowAllowed( Origin, Game, Board ),
          }
        );
    }

    protected override void DoAction () {
      int tileCode = Board.Tiles[Origin.HexCode];
      int growingTypeCode = (int) (Tile.GetPieceType( tileCode ) ?? 0);
      int grownTypeCode = growingTypeCode + 1;
      int price = grownTypeCode;
      PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );

      playerBoard.Pieces( (PieceType) grownTypeCode ).DecreaseAvailable();
      int resultingTile = Tile.SetPieceType( tileCode, (PieceType) grownTypeCode );
      playerBoard.Pieces( (PieceType) growingTypeCode ).IncreaseOnPlayerBoard();
      playerBoard.SpendLight( price );
      Board.Tiles[Origin.HexCode] = resultingTile;
    }

    protected override void UndoAction () {
      PlayerBoard playerBoard = PlayerBoard.Get( Game, PlayerId );
      int tileCode = Board.Tiles[Origin.HexCode];

      int grownTypeCode = (int) (Tile.GetPieceType( tileCode ) ?? 0);

      if ( grownTypeCode == 0 ) throw new InvalidOperationException( "Can't undo growth on this tile." );

      int growingTypeCode = grownTypeCode - 1;
      int price = grownTypeCode;

      playerBoard.RecoverLight( price );
      playerBoard.Pieces( (PieceType) growingTypeCode ).DecreaseOnPlayerBoard();
      playerBoard.Pieces( (PieceType) grownTypeCode ).IncreaseAvailable();
      int resultTile = Tile.SetPieceType( tileCode, (PieceType) growingTypeCode );

      Board.Set( Origin, resultTile );
      PlayerBoard.Set( Game, PlayerId, playerBoard );
    }

    public class Params : AActionParamsWithGameAndBoard {

      public Params (ActionRequest request, string playerId, Game game, Board Board) : base(
          request,
          playerId,
          game,
          Board
        ) { }

    }
    
    public override GameHub.SessionUpdate SessionUpdate () =>
      new GameHub.SessionUpdate() {
        Game = Game,
        Board = Board,
      };

  }
}
