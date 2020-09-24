#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Controllers;
using dotnet_tree_shadows.Models.GameActions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
    public class Session {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        public string Host { get; set; }
        
        public Dictionary<string, Player> Players { get; set; }

        public string[] PlayerNames {
            get => Players.Select( playerEntry => playerEntry.Value.Name ).ToArray();
        }

        public Game Game { get; set; }
        public string Name { get; set; }

        public List<string> Invitations { get; set; }

        public Session () {
            Id = "";
            Players = new Dictionary<string, Player>();
            Game = new Game();
            Name = "";
            Host = "";
            Invitations = new List<string>();
        }
        
        public Session (Profile host) {
            Id = "";
            Players = new Dictionary<string, Player> { { host.Id, new Player(host) } };
            Game = new Game();
            Name = $"New Session - {DateTime.Now.ToString()}";
            Host = host.Id;
            Invitations = new List<string>();
        }

        public void AddPlayer (Profile player) {
            Players.Add( player.Id, new Player(player) );
        }
        
        public bool HasInvited (string id) {
            return Invitations.Any( i => i == id );
        }

        public void RemoveInvitation (string id) {
            Invitations.RemoveAll( i => i == id );
        }

        public void AddInvitation (string id) {
            if ( HasInvited( id ) ) return;
            Invitations.Add( id );
        }

        public bool HasPlayer (string id) => Players.ContainsKey( id );
        
        public bool TryProcessAction (string userId, GameAction gameAction, out string failureReason) {
            
            switch ( gameAction.ActionType ) {
                case GameActionType.Buy:
                    return TryBuy( userId, gameAction, out failureReason );
                case GameActionType.Plant:
                    return TryPlant( gameAction, out failureReason );
                case GameActionType.Grow: break;
                case GameActionType.Collect: break;
                case GameActionType.EndTurn: break;
                case GameActionType.Undo: break;
                default: throw new ArgumentOutOfRangeException();
            }

            failureReason = "got to end";
            return false;
        }

        private bool TryPlant (GameAction gameAction, out string failureReason) {
            if ( gameAction.origin == null ) {
                failureReason = "Failed to provide origin";
                return false;
            }

            if ( gameAction.target == null ) {
                failureReason = "Failed to provide target";
                return false;
            }

            return Game.Plant(
                    (HexCoordinates) gameAction.origin,
                    (HexCoordinates) gameAction.target,
                    Players[gameAction.PlayerId],
                    out failureReason
                );
        }

        private bool TryBuy (string userId, GameAction gameAction, out string failureReason) {
            if ( gameAction.PieceType == null ) {
                failureReason = "PieceType Not Included";
                return false;
            }

            if ( !Players[userId].TryBuy( (PieceType) gameAction.PieceType, out string buyFailReason ) ) {
                failureReason = $"Cannot buy piece: {buyFailReason} ";
                return false;
            }

            failureReason = "";
            return true;
        }
    }

}
