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
      context.Target != null && IsValidHex( (Hex) context.Target! );

    public static bool GameHasMinimumTwoPlayers (ActionContext context) =>
      context.Game != null && context.Game.TurnOrder.Length >= 2;

    public static bool GameIsInPermittedState (ActionContext context) =>
      context.PermittedGameStatuses != null && context.Game != null && context.PermittedGameStatuses.Any(status=>status == context.Game.Status);

    public static bool GrowthInShadowAllowed (ActionContext context) =>
      context.Game!.GameOptions.Has( GameOption.PreventActionsInShadow ) == false ||
      !Tile.IsShadowed( ((Hex) context.Origin!).HexCode );

    public static bool IsPlayersTurn (ActionContext context) =>
      context.Game!.CurrentPlayer == context.PlayerId;

    public static bool OriginPieceTypeIsTree (ActionContext context) =>
      (int) (Tile.GetPieceType( context.Board!.Get( (Hex) context.Origin! ) ) ?? 0) > (int) PieceType.Seed;

    public static bool PlayerCanAffordCost (ActionContext context) =>
      PlayerBoard.Get( context.Game!, context.PlayerId ).Light >= context.Cost;
    
    public static bool PlayerCanAffordCostOfPiece (ActionContext context) {
      PlayerBoard playerBoard = PlayerBoard.Get( context.Game!, context.PlayerId ); 
      return playerBoard.Light >= playerBoard.Pieces( (PieceType) context.PieceType! ).NextPrice;
    }

    public static bool PlayerCanAffordToGrow (ActionContext context) {
      PlayerBoard playerBoard = PlayerBoard.Get( context.Game!, context.PlayerId );
      int tileCode = context.Board!.Get( (Hex) context.Origin! );
      return Tile.GetPieceHeight( tileCode ) + 1 <= playerBoard.Light;
    }

    public static bool PlayerHasLargerPieceAvailable (ActionContext context) {
      PieceType largerPiece = (PieceType) Tile.GetPieceHeight( context.Board!.Get( (Hex) context.Target! ) ) + 1;
      return PlayerBoard.Get( context.Game!, context.PlayerId ).Pieces( largerPiece ).Available > 0;
    } 
    
    public static bool TargetIsNotALargeTree (ActionContext context) => Tile.GetPieceType( context.Board!.Get( (Hex) context.Target! ) ) !=  PieceType.LargeTree;

    public static bool PlayerHasAvailablePiece (ActionContext context) =>
      PlayerBoard.Get( context.Game!, context.PlayerId ).Pieces( (PieceType) context.PieceType! ).Available > 0;
    
    public static bool PlayerHasPieceOnPlayerBoard (ActionContext context) =>
      PlayerBoard.Get( context.Game!, context.PlayerId ).Pieces( (PieceType) context.PieceType! ).OnPlayerBoard > 0;

    public static bool PlayerIsHost (ActionContext context) => context.Session!.Host == context.PlayerId;
    
    public static bool TileBelongsToPlayer (ActionContext context) => 
      Tile.GetTreeType( context.Board!.Get((Hex)context.Target!) ) == PlayerBoard.Get( context.Game!, context.PlayerId ).TreeType;
    
    public static bool TargetTileIsEmpty (ActionContext context) => context.Target.HasValue && Tile.GetTreeType( context.Board!.Get( (Hex) context.Target ) ) == null;

    public static bool TargetTileIsNotEmpty (ActionContext context) => 
      Tile.GetTreeType( context.Board!.Get((Hex)context.Target!) ) != null;

    public static bool TargetHasNotBeenActiveThisTurn (ActionContext context) {
      int[] activeTiles = context.Game!.TilesActiveThisTurn ?? new int[0]; 
      return activeTiles.All( t => t != context.Target!.Value.HexCode );
    }
    public static bool OriginHasNotBeenActiveThisTurn (ActionContext context) {
      int[] activeTiles = context.Game!.TilesActiveThisTurn ?? new int[0]; 
      return activeTiles.All( t => t != context.Origin!.Value.HexCode );
    }
    
    public static bool TargetIsLargeTree (ActionContext context) => 
      Tile.GetPieceType( context.Board!.Get((Hex) context.Target!)) == PieceType.LargeTree;

    public static bool TargetIsWithinRangeOfOrigin (ActionContext context) {
      int distance = Hex.Distance( (Hex) context.Origin!, (Hex) context.Target! );
      int height = Tile.GetPieceHeight( context.Board!.Get( (Hex) context.Origin ) );
      return distance <= height;
    }
    
    

    public static bool TargetIsOnEdgeOfBoard (ActionContext context) {
      Hex h = (Hex) context.Target!;
      return Math.Abs( h.Q ) == 3 || Math.Abs( h.R ) == 3 || Math.Abs( h.S ) == 3;
    }

    

  }
}
