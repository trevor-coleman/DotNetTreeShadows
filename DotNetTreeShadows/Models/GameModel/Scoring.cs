using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class Scoring {

        public readonly struct Token {
            public readonly int Leaves;
            public readonly int Points;

            public Token (int leaves, int points) {
                Points = points;
                Leaves = leaves;
            }

            public static Token NullToken {
              get => new Token( 0, 0 );
            }

            public static bool operator == (Token a, Token b) => a.Leaves == b.Leaves && a.Points == b.Points;
            public static bool operator != (Token a, Token b) => !(a == b);
        }

        public Dictionary<string, PlayerScore> playerScores;
        
        public class PlayerScore {
          public PlayerScore () {
            tokens = new List<Token>();
          }
          public IEnumerable<Token> tokens { get; private set; }
          public int Score {
            get => tokens.Aggregate( 0, (score, token) => score += token.Points );
          }

          public int[] tokensCollectedByType {
            get =>
              tokens.Aggregate(
                  new int[] { 0, 0, 0, 0 },
                  (scores, token) => {
                    scores[token.Leaves - 1]++;
                    return scores;
                  }
                );
          }

          public void CollectToken (Token token) {
            tokens = tokens.Append( token );
          }
        }
        
        public class Stacks {
            
            private static readonly int[] OneLeafTiles = { 14, 14, 13, 13, 12, 12, 12, 12 };
            private static readonly int[] TwoLeafTiles = { 17, 16, 16, 14, 14, 13, 13, 13 };
            private static readonly int[] ThreeLeafTiles = { 19, 18, 18, 17, 17 };
            private static readonly int[] FourLeafTiles = { 22, 21, 20 };

            private static Dictionary<int, Stack<int>> StartingPiles {
                get =>
                    new Dictionary<int, Stack<int>>() {
                                                          { 0, new Stack<int>( OneLeafTiles ) },
                                                          { 1, new Stack<int>( TwoLeafTiles ) },
                                                          { 2, new Stack<int>( ThreeLeafTiles ) },
                                                          { 3, new Stack<int>( FourLeafTiles ) },
                                                      };
            }

            private Dictionary<int, Stack<int>> piles;
            public Stacks () { piles = StartingPiles; }

            public Stacks (IReadOnlyList<int> remainingTileCounts) {
                piles = new Dictionary<int, Stack<int>>();
                for (int index = 0; index < remainingTileCounts.Count; index++) {
                    
                    int count = remainingTileCounts[index];
                    Stack<int> pile = StartingPiles[index];
                    
                    int[] tokens = new int[count];
                    Array.Copy(
                            pile.ToArray(),
                            pile.Count - count,
                            tokens,
                            0,
                            count
                        );
                    
                    piles.Add( index, new Stack<int>(tokens) );
                }
            }
            
            public int[] Remaining {
                get => new[] { piles[0].Count, piles[1].Count, piles[2].Count, piles[3].Count };
            }

          
            public bool Take (int numberOfLeaves, out Token token) {
                int points = 0;
                token = Token.NullToken;
              

                for (int i = numberOfLeaves; i >= 0; i--) {
                    if(piles[numberOfLeaves].Count > 0) break;
                    if ( i == 0 ) return false;
                }
                
                points = piles[numberOfLeaves].Pop();
                
                token = new Token( numberOfLeaves, points );
                return true;
            }

        }
        
    }
}
