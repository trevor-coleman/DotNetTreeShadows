using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.GameModel {
  
  public class ScoreTokens {

    public static bool Take (Game game, in Hex h, out Scoring.Token token) {
      Dictionary<int, Stack<int>> stacks = game.ScoringTokens;
      token = Scoring.Token.NullToken;
      int leaves = 4 - Hex.Distance( h, Hex.Zero );
      while ( leaves > 0 ) {
        if ( stacks.TryGetValue( leaves, out Stack<int> stack ) && stack.Count != 0 ) {
          token = new Scoring.Token( leaves, stack.Pop() );
          return true;
        }

        leaves--;
      }

      return false;
    }

  }
}
