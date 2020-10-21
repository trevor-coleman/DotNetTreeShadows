using System;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;
using ServiceStack.Text;

namespace dotnet_tree_shadows.Models.GameModel {
  public static class GameOperations {
    
    public static void AddPlayer (Game game, string playerId) {
      game.TurnOrder = game.TurnOrder.Append( playerId ).ToArray();
      TreeType treeType = game.RemainingTreeTypes[new Random().Next(game.RemainingTreeTypes.Length)];
      game.RemainingTreeTypes = game.RemainingTreeTypes.Where( tt => tt != treeType ).ToArray();
      PlayerBoard playerBoard = new PlayerBoard { TreeType = treeType };
      Console.WriteLine($"Adding player - {treeType} - {playerBoard.TreeType}");
      game.PlayerBoards.Add( playerId, playerBoard.BoardCode );
      game.Scores.Add( playerId, new Scoring.Token[0] );
    }
  }
}
