#nullable enable
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
    public class Session {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        public string Host { get; set; }
        
        public Dictionary<string, Player> Players { get; set; }
        public Game Game { get; set; }
        public string Name { get; set; }

        public Session () {
            Id = "";
            Players = new Dictionary<string, Player>();
            Game = new Game();
            Name = "";
            Host = "";
        }
        
        public Session (string host, string? name) {
            Id = "";
            Players = new Dictionary<string, Player>();
            Game = new Game();
            Name = name ?? $"New Session - {DateTime.Now.ToString()}";
            Host = host;
        }

        public void AddPlayer (string playerId) {
            Players.Add( playerId, new Player() );
        }
        
    }

}
