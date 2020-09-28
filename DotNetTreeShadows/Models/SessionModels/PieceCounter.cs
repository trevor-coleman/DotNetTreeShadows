using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.SessionModels {
    [SuppressMessage( "ReSharper", "ArrangeMethodOrOperatorBody" )]
    public class PieceCounter {

        [JsonConverter( typeof( StringEnumConverter ) )]
        [BsonRepresentation( BsonType.String )]
        public PieceType PieceType;

        public int Available { get; set; }
        public int OnPlayerBoard { get; set; }
        public int Discarded { get; set; }
        public int[] Prices { get; set; }


        public PieceCounter () {
            Available = 0;
            OnPlayerBoard = 0;
            Prices = new int[0];
            Discarded = 0;
            PieceType = PieceType.Seed;
        }
        
        public PieceCounter (PieceType pieceType, IReadOnlyList<int> startingCounts, int[] prices) {
            Available = startingCounts[0];
            OnPlayerBoard = startingCounts[1];
            Prices = StartingPrices( pieceType );
            Discarded = 0;
            PieceType = pieceType;
        }
        
        public bool BuyAt (out int price) {
            price = 0;
            if ( OnPlayerBoard == 0 ) return false;
            price = Prices[OnPlayerBoard-1];
            OnPlayerBoard--;
            Available++;
            return true;
        }

        public int CurrentPrice () {
            if ( OnPlayerBoard == 0 ) return -1;
            return Prices[OnPlayerBoard - 1];
        }
        
        
        public bool CanReturnSafely () {
            return OnPlayerBoard < Prices.Length ;
        }
        
        public void ReturnOrDiscard (out bool returnedSafely) {
            returnedSafely = false;
            if ( OnPlayerBoard >= Prices.Length ) {
                Discarded++;
                return;
            }
            OnPlayerBoard++;
            returnedSafely = true;
        }

        public bool CanBeTaken () {
            return Available > 0;
        }
        
        public void Take () {
            if ( Available <= 0 ) throw new InvalidOperationException("Tried to take a tree when no trees available.");
            Available--;
        }

        public static int[] StartingCounts (PieceType pieceType) {
            return pieceType switch {
                PieceType.Seed => new[] { 2, 4 },
                PieceType.SmallTree => new[] { 4, 4 },
                PieceType.MediumTree => new[] { 1, 3 },
                PieceType.LargeTree => new[] { 0, 2 },
                _ => throw new ArgumentException( "invalid pieceType" )
            };
        }

        public static int[] StartingPrices (PieceType pieceType) {
            return pieceType switch {
            PieceType.Seed => new[] { 2, 2, 1, 1 },
            PieceType.SmallTree => new[] { 3, 3, 2, 2 },
            PieceType.MediumTree => new[] { 4, 3, 3 },
            PieceType.LargeTree => new[] { 5, 4 },
            _ => throw new ArgumentException( "invalid pieceType" )
        };
        }

        
        public static PieceCounter StartingAmount (PieceType pieceType) =>
            new PieceCounter( pieceType, StartingCounts(pieceType), StartingPrices(pieceType) );
        
    }

}
