using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Utilities;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace dotnet_tree_shadows.Models {
    public class PlayerBoard {
        public string PlayerId { get; set; }
        public TreeType? TreeType { get; set; }
        public PlayerScore Score { get; set; }
        private int light;

        public int Light {
            get => light;
            set => light = Math.Clamp( value, 0, 20 );
        }

        [BsonDictionaryOptions( DictionaryRepresentation.ArrayOfArrays )]
        public readonly Dictionary<string, PieceCounter> Pieces;

        public PlayerBoard () {
            PlayerId = "";
            TreeType = null;
            Score = new PlayerScore();
            Light = 0;
            Pieces = new Dictionary<string, PieceCounter>();
            foreach ( PieceType pieceType in EnumUtil.GetValues<PieceType>() ) {
                Pieces[pieceType.ToString()] = PieceCounter.StartingAmount( pieceType );
            }
        }

        public PlayerBoard (Profile profile) {
            PlayerId = profile.Id;
            TreeType = null;
            Score = new PlayerScore();
            Light = 0;
            Pieces = new Dictionary<string, PieceCounter>();
            foreach ( PieceType pieceType in EnumUtil.GetValues<PieceType>() ) {
                Pieces[pieceType.ToString()] = PieceCounter.StartingAmount( pieceType );
            }
        }

        public PlayerBoardDTO DTO () => new PlayerBoardDTO { ScoringTokens = Score.TokenCountByType, Pieces = Pieces };

        /// <summary>Spends light</summary>
        /// <param name="amount">amount to spend. Must be > 0.</param>
        public void Spend (int amount) {
            if ( amount < 0 ) throw new ArgumentOutOfRangeException( "Tried to spend a negative amount of Light. " );
            if ( Light < amount ) throw new InvalidOperationException( "Tried to spend more light than is available" );
            Light -= amount;
        }

        private static int PieceTypeIndex (PieceType pieceType) => (int) pieceType;
        private static PieceType LargerPiece (PieceType pieceType) => (PieceType) (PieceTypeIndex( pieceType ) + 1);

        /**
         * <summary>Attempts to buy one of the specified resources. </summary>
         * <remarks>Checks whether player can afford piece, and whether a piece exists to buy.</remarks>
         * <returns>true if purchase was successful, false if it wasn't.</returns>
         */
        public bool TryBuy (PieceType pieceType, out string failureMessage) {
            PieceCounter pieceCounter = Pieces[pieceType.ToString()];
            if ( !CanBuy( pieceCounter, out failureMessage ) ) return false;
            pieceCounter.BuyAt( out int price );
            Spend( price );
            return true;
        }
        /// <summary>
        /// Buys one of the specified resource. Throws an exception if not possible.
        /// </summary>
        /// <param name="pieceType">Type of piece to buy.</param>
        public void Buy (PieceType pieceType) {
            PieceCounter pieceCounter = Pieces[pieceType.ToString()];
            pieceCounter.BuyAt( out int price );
            Spend( price );
        }
        
        public bool CanBuy (PieceCounter pieceCounter, out string failureMessage) {
            if ( pieceCounter.CurrentPrice() == -1 ) {
                failureMessage = "None available.";
                return false;
            }

            if ( Light < pieceCounter.CurrentPrice() ) {
                failureMessage = "Can't afford purchase.";
                return false;
            };

            failureMessage = "";
            return true;
        }

        public bool TryHandleGrowTree (PieceType pieceIn, out bool returnedSafely, out string failureReason) {
            returnedSafely = false;
            if ( pieceIn == PieceType.LargeTree ) {
                failureReason = "Can't grow large tree.";
                return false;
            };
            PieceCounter pieceCounterIn = Pieces[pieceIn.ToString()];
            PieceType pieceOut = LargerPiece( pieceIn );
            PieceCounter pieceCounterOut = Pieces[pieceOut.ToString()];
            
            if ( !CanGrowTree( pieceIn, out returnedSafely, out string message ) ) {
                failureReason = $"Can't Grow Tree: {message}";
                return false;
            };
            
            pieceCounterIn.ReturnOrDiscard( out returnedSafely );
            pieceCounterOut.Take();
            Spend( CostToGrow( pieceOut ) );

            failureReason = "success";
            return true;
        }

        public void HandleGrowTree (PieceType pieceIn, out bool returnedSafely) {
            PieceCounter pieceCounterIn = Pieces[pieceIn.ToString()];
            PieceType pieceOut = LargerPiece( pieceIn );
            PieceCounter pieceCounterOut = Pieces[pieceOut.ToString()];
            
            pieceCounterIn.ReturnOrDiscard( out returnedSafely );
            pieceCounterOut.Take();
            Spend( CostToGrow( pieceOut ) );
        }
        
        public bool CanGrowTree (PieceType pieceIn, out bool canReturnSafely, out string message) {
            PieceCounter pieceCounterIn = Pieces[pieceIn.ToString()];
            canReturnSafely = pieceCounterIn.CanReturnSafely();
            if ( pieceIn == PieceType.LargeTree ) {
                message = "can't grow large tree";
                return false;
            }
            
            PieceType pieceOut = LargerPiece( pieceIn );
            PieceCounter pieceCounterOut = Pieces[pieceOut.ToString()];

            if ( !pieceCounterOut.CanBeTaken() ) {
                message = "no available tree to grow";
                return false;
            }
            
            if ( CostToGrow( pieceOut ) > Light ) {
                message = "insufficient light to grow";
                return false;
            }

            message = "can grow";
            return true;
        }

        private static int CostToGrow (PieceType pieceType) {
            return pieceType switch {
                PieceType.Seed => 1,
                PieceType.SmallTree =>1,
                PieceType.MediumTree => 2,
                PieceType.LargeTree => 3,
                _ => throw new ArgumentOutOfRangeException("Invalid pieceType")
            };
        }
        
        public bool CanPlant () {
            PieceCounter seeds = Pieces[PieceType.Seed.ToString()];
            return seeds.CanBeTaken() && Light >= 1;
        }

        public bool TryHandlePlantSeed (out string failureReason) {
            PieceCounter seeds = Pieces[PieceType.Seed.ToString()];
            if(!seeds.CanBeTaken()) {
                failureReason = "No available seeds to plant";
                return false;
            }

            if ( Light < 1 ) {
                failureReason = "Insufficient light";
                return false;
            }
            Spend( CostToGrow( PieceType.Seed ) );
            seeds.Take();
            failureReason = "";
            return true;
        }

        public bool CanCollect () => Light >= 4;

        public void HandleCollect (Scoring.Token? token) {
            PieceCounter largeTrees = Pieces[PieceType.LargeTree.ToString()];
            Score.Score( token );

            largeTrees.ReturnOrDiscard( out bool _ );
        }

        public void CollectLight (int amount) {
            Light += amount;
        }

        public int FinalScore () => Score.Points + (int) Math.Floor( Light / (decimal) 3);

        public class PlayerScore {
            public List<Scoring.Token> Tokens { get; }
            public int Points { get; protected set; }
            public int[] TokenCountByType { get; }

            public void Score (Scoring.Token? nullableToken) {
                if ( nullableToken == null ) return;
                var token = (Scoring.Token) nullableToken;
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
                Tokens = new List<Scoring.Token>();
                TokenCountByType = new int[3];
                foreach ( Scoring.Token token in tokens ) {
                    Score( token );
                }
            }
        } 

    }

}
