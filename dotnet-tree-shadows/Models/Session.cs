#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
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

        public List<Invitation> Invitations;

        public Session () {
            Id = "";
            Players = new Dictionary<string, Player>();
            Game = new Game();
            Name = "";
            Host = "";
            Invitations = new List<Invitation>();
        }
        
        public Session (string host, string hostName, string? name) {
            Id = "";
            Players = new Dictionary<string, Player> { { host, new Player() } };
            Players[host].Name = hostName;
            Game = new Game();
            Name = name ?? $"New Session - {DateTime.Now.ToString()}";
            Host = host;
            Invitations = new List<Invitation>();
        }

        public void AddPlayer (string playerId) {
            Players.Add( playerId, new Player() );
        }

        public Invitation Invite (string playerId, string senderId) {
            Invitation invitation = new Invitation( senderId, playerId, Id, InvitationType.ToSession );
            Invitations.Add( invitation );
            return invitation;
        }

        public bool HasInvited (string id) {
            return Invitations.Any( i => i.RecipientId == id );
        }
    }

}
