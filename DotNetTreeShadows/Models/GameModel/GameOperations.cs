using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Services;

namespace dotnet_tree_shadows.Models.SessionModels {
  public static class GameOperations {
    
    public static void RandomizeTurns (Game game) {
      Random random = new Random();
      string[] array = game.TurnOrder.ToArray();
      int n = array.Length;
      
      while ( n > 1 ) {
        int k = random.Next( n-- );
        string temp = array[n];
        array[n] = array[k];
        array[k] = temp;
      }

      game.TurnOrder = array;
    }

    public static void AddPlayer (Game game, string playerId) {
      game.TurnOrder = game.TurnOrder.Append( playerId ).ToArray();
      game.PlayerBoards.Add( playerId, new PlayerBoard().BoardCode );
      game.Scores.Add( playerId, new Scoring.Token[0] );
    }
  }
}
