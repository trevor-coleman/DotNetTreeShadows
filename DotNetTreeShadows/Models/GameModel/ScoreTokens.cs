using System;
using System.Collections.Generic;
using System.Linq;

namespace dotnet_tree_shadows.Models.GameModel {
  
  public class ScoreTokens {

    public static bool Take (Game game, in Hex h, out Scoring.Token? token) {
      TokenStacks stacks = game.ScoringTokens;
      token = null;
      int leaves = 4 - Hex.Distance( h, Hex.Zero );
      while ( leaves > 0 ) {
        if ( stacks.TryGetValue( leaves, out int[] scores ) && scores.Length != 0 ) {
          Stack<int> stack = new Stack<int>(scores);
          token = new Scoring.Token( leaves, stack.Pop() );
          stacks[leaves] = stack.Reverse().ToArray();
          return true;
        }

        leaves--;
      }

      return false;
    }

    public static TokenStacks Return (Game game, Scoring.Token toReturn) {
      TokenStacks stacks = game.ScoringTokens;

      if ( !stacks.TryGetValue( toReturn.Leaves, out int[] scores ) ) throw new InvalidOperationException("Tried to return token to non-existent stack");
      Stack<int> stack = new Stack<int>(scores);
      stack.Push( toReturn.Points );
      stacks[toReturn.Leaves] = stack.Reverse().ToArray();
      return stacks;
    }

  }
}
