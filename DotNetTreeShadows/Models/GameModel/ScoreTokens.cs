using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.GameModel {
  
  public class ScoreTokens {

    public static bool Take (Game game, in Hex h, out Scoring.Token token) {
      TokenStacks stacks = game.ScoringTokens;
      token = Scoring.Token.NullToken;
      int leaves = 4 - Hex.Distance( h, Hex.Zero );
      while ( leaves > 0 ) {
        if ( stacks.TryGetValue( leaves, out int[] scores ) && scores.Length != 0 ) {
          Stack<int> stack = new Stack<int>(scores);
          token = new Scoring.Token( leaves, stack.Pop() );
          stacks[leaves] = stack.ToArray();
          return true;
        }

        leaves--;
      }

      return false;
    }

  }
}
