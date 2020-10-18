using System;
using System.Linq;
using dotnet_tree_shadows.Models;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Services.GameActionService.ActionValidation {
  public static class ValidIf {

    private static bool IsValidHex (Hex h) =>
      Math.Abs( h.Q ) < 4 && Math.Abs( h.R ) < 4 && Math.Abs( h.R ) < 4 && h.Q + h.R + h.S == 0;

    public static bool OriginIsValidTile (ActionContext context) =>
      context.Origin != null && IsValidHex( (Hex) context.Origin );

    public static bool TargetIsValidTile (ActionContext context) =>
      context.Target != null && IsValidHex( (Hex) context.Target );

    public static bool GameHasMinimumTwoPlayers (ActionContext context) =>
      context.Game != null && context.Game.TurnOrder.Length >= 2;

    public static bool GameIsInPermittedState (ActionContext context) =>
      context.PermittedGameStatus != null && context.Game != null && context.Game.Status == context.PermittedGameStatus;

    public static bool GrowthInShadowAllowed (ActionContext context) =>
      context.Game.GameOptions.Has( GameOption.PreventActionsInShadow ) == false ||
      !Tile.IsShadowed( ((Hex) context.Origin).HexCode );

    public static bool OnPlayersTurn (ActionContext context) =>
      context.Game.CurrentPlayer == context.PlayerId;

    public static bool PieceTypeIsTree (ActionContext context) =>
      (int) (Tile.GetPieceType( context.Board.Get( (Hex) context.Origin ) ) ?? 0) > (int) PieceType.Seed;

    public static bool PlayerCanAffordCost (ActionContext context) =>
      PlayerBoard.Get( context.Game, context.PlayerId ).Light >= context.Cost;

    public static bool PlayerHasAvailablePiece (ActionContext context) =>
      PlayerBoard.Get( context.Game, context.PlayerId ).Pieces( (PieceType) context.PieceType ).Available > 0;

    public static bool PlayerHasPieceOnPlayerBoard (ActionContext context) =>
      PlayerBoard.Get( context.Game, context.PlayerId ).Pieces( (PieceType) context.PieceType ).OnPlayerBoard > 0;

    public static bool PlayerIsHost (ActionContext context) => context.Session.Host == context.PlayerId;
    
    public static bool TileBelongsToPlayer (ActionContext context) => 
      Tile.GetTreeType( context.Board.Get((Hex)context.Target) ) == PlayerBoard.Get( context.Game, context.PlayerId ).TreeType;
    
    public static bool TileIsEmpty (ActionContext context) => 
      Tile.GetTreeType( context.Board.Get((Hex)context.Target) ) == null;

      public static bool TileIsNotEmpty (ActionContext context) => 
      Tile.GetTreeType( context.Board.Get((Hex)context.Target) ) != null;

    public static bool TileHasNotBeenActiveThisTurn (ActionContext context) {
      Hex[] activeTiles = context.Game.TilesActiveThisTurn ?? new Hex[0]; 
      return activeTiles.All( t => t != context.Origin );
    }
    
    public static bool TilePieceTypeIsLargeTree (ActionContext context) => 
      Tile.GetPieceType( context.Board.Get((Hex) context.Target)) == PieceType.LargeTree;

    public static bool TargetIsWithinRangeOfOrigin (ActionContext context) =>
      Hex.Distance( (Hex)context.Origin, (Hex) context.Target ) <
      ((int) Tile.GetTreeType( context.Board.Get( (Hex) context.Origin ) ) );

  }
}
