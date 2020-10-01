using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace dotnet_tree_shadows.Models.GameActions
{
  public class GrowAction : GameActionWithOrigin
  {
    public GrowAction (Game game, string playerId, HexCoordinates origin) : base( game, playerId, origin )
    {
      AddValidators(
          new AActionValidator[] {
            new TilePieceTypeIsNot( origin, PieceType.LargeTree, game ),
            new TilePieceTypeIsNot( origin, null, game ),
            new PieceCanBeReturnedSafely( origin, playerId, game ),
            new PlayerHasLargerPieceAvailable( origin, playerId, game ),
            new PlayerCanAffordLargerPiece( origin, playerId, game ),
            new GrowthInShadowAllowed( origin, game ),
          }
        );
    }

    public override GameActionType Type { get; } = GameActionType.Grow;

    public override void Execute ()
    {
      Tile tile = Game.Board.GetTileAt( Origin )!;
      PieceType growingType = (PieceType) tile.PieceType!;
      PieceType grownType = (PieceType) ((int) growingType + 1);
      int price = (int) grownType;
      BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];

      playerBoard.Pieces( grownType ).DecreaseAvailable();
      tile.PieceType = grownType;
      playerBoard.Pieces( growingType ).IncreaseOnPlayerBoard();
      playerBoard.SpendLight( price );

      Game.Board.SetTileAt( Origin, tile );
    }

    public override void Undo ()
    {
      Tile tile = Game.Board.GetTileAt( Origin )!;
      PieceType grownType = (PieceType) tile.PieceType!;
      PieceType growingType = (PieceType) ((int) grownType - 1);
      int price = (int) grownType;
      BitwisePlayerBoard playerBoard = Game.PlayerBoards[PlayerId];

      playerBoard.RecoverLight( price );
      playerBoard.Pieces( growingType ).DecreaseOnPlayerBoard();
      tile.PieceType = growingType;
      playerBoard.Pieces( grownType ).IncreaseAvailable();

      Game.Board.SetTileAt( Origin, tile );
    }
  }
}
