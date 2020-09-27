using System;
using System.Collections.Generic;

namespace dotnet_tree_shadows.Models {
    public class Scoring {

        public struct Token {
            public readonly int Leaves;
            public readonly int Points;

            public Token (int leaves, int points) {
                Points = points;
                Leaves = leaves;
            }
        } 
        
        public class Stacks {
            
            private static readonly int[] OneLeafTiles = { 14, 14, 13, 13, 12, 12, 12, 12 };
            private static readonly int[] TwoLeafTiles = { 17, 16, 16, 14, 14, 13, 13, 13 };
            private static readonly int[] ThreeLeafTiles = { 19, 18, 18, 17, 17 };
            private static readonly int[] FourLeafTiles = { 22, 21, 20 };

            private static Dictionary<int, Queue<int>> StartingPiles {
                get =>
                    new Dictionary<int, Queue<int>>() {
                                                          { 1, new Queue<int>( OneLeafTiles ) },
                                                          { 2, new Queue<int>( TwoLeafTiles ) },
                                                          { 3, new Queue<int>( ThreeLeafTiles ) },
                                                          { 4, new Queue<int>( FourLeafTiles ) },
                                                      };
            }

            private readonly Dictionary<int, Queue<int>> piles;
            public Stacks () { piles = StartingPiles; }

            public Stacks (IReadOnlyList<int> remainingTileCounts) {
                piles = new Dictionary<int, Queue<int>>();
                for (int index = 0; index < remainingTileCounts.Count; index++) {
                    
                    int count = remainingTileCounts[index];
                    Queue<int> pile = StartingPiles[index+1];
                    
                    int[] tokens = new int[count];
                    Array.Copy(
                            pile.ToArray(),
                            pile.Count - count,
                            tokens,
                            0,
                            count
                        );
                    
                    piles.Add( count, new Queue<int>(tokens) );
                }
            }
            
            public int[] Remaining {
                get => new[] { piles[1].Count, piles[2].Count, piles[3].Count };
            }

            public Token? Take (int numberOfLeaves) {
                var points = 0;

                for (int i = numberOfLeaves; i >= 0; i--) {
                    if(piles[numberOfLeaves].Count > 0) break;
                    if ( i == 0 ) return null;
                }
                
                points = piles[numberOfLeaves].Dequeue();
                
                return new Token( numberOfLeaves, points );
            }

        }
        
    }
}
