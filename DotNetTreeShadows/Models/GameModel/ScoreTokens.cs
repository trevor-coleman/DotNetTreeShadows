using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameModel {
  
  public class ScoreTokens {

    public static bool Take (Game game, in int Leaves, out Scoring.Token token) {
      Dictionary<int, Stack<int>> stacks = game.ScoringTokens;
      token = Scoring.Token.NullToken;
      int i = Leaves;
      while ( i > 0 ) {
        if ( stacks.TryGetValue( i, out Stack<int> stack ) && stack.Count != 0 ) {
          token = new Scoring.Token( i, stack.Pop() );
          return true;
        }

        i--;
      }

      return false;
    }

  }
}
