using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Utilities;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace dotnet_tree_shadows.Models {
    public class Player {
        public TreeType? TreeType { get; set; }
        public PlayerScore Score { get; set; }
        public string Name { get; set; }
        private int light;
        public int Light {
            get => light;
            set => light = Math.Clamp( value, 0, 20 );
        }

        [BsonDictionaryOptions(DictionaryRepresentation.ArrayOfArrays)]
        public Dictionary<int, Resource> Pieces;
        

        public Player () {
            TreeType = null;
            Score = new PlayerScore();
            Light = 0;
            Pieces = new Dictionary<int, Resource>();
            foreach ( PieceType pieceType in EnumUtil.GetValues<PieceType>()) {
                Pieces[(int)pieceType] = Resource.StartingAmount( pieceType );
            }
        }
        
        public class PlayerScore {
            public List<Scoring.Token> Tokens { get; }
            public int Points { get; protected set; }
            public int[] TokenCountByType { get; }

            public void Score (Scoring.Token token) {
                Tokens.Add( token );
                Points += token.Points;
                TokenCountByType[token.Leaves - 1]++;
            }

            public PlayerScore () {
                Tokens = new List<Scoring.Token>();
                Points = 0;
                TokenCountByType = new int[3];
            }

            public PlayerScore (IEnumerable<Scoring.Token> tokens) {
                foreach ( Scoring.Token token in tokens ) {
                    Score(token);
                }
            }
        }
    }

}
