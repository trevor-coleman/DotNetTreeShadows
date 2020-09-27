#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.GameActions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace dotnet_tree_shadows.Models {
    public class Session {

        [BsonId]
        [BsonRepresentation( BsonType.ObjectId )]
        public string Id { get; set; }

        public string Host { get; set; }
        public List<string> Players { get; set; }

        public Game Game { get; set; }
        public string Name { get; set; }

        public List<string> Invitations { get; set; }

        public Session () {
            Id = "";
            Players = new List<string>();
            Game = new Game();
            Name = "";
            Host = "";
            Invitations = new List<string>();
        }

        public Session (Profile host) {
            Id = "";
            Players = new List<string>();
            Game = new Game();
            Name = $"New Session - {DateTime.Now.ToString()}";
            Host = host.Id;
            Invitations = new List<string>();
        }

        public void AddPlayer (Profile player) {
            Players.Add( player.Id );
            Game.AddPlayerBoard( player.Id );
        }

        public bool HasInvited (string id) { return Invitations.Any( i => i == id ); }

        public void RemoveInvitation (string id) { Invitations.RemoveAll( i => i == id ); }

        public void AddInvitation (string id) {
            if ( HasInvited( id ) ) return;
            Invitations.Add( id );
        }

        public bool HasPlayer (string id) => Players.Contains( id );

        public bool TryProcessAction (string userId, GameAction gameAction, out string failureReason) {
            switch ( gameAction.ActionType ) {
                case GameActionType.Buy: return TryBuy( userId, gameAction, out failureReason );
                case GameActionType.Plant: return TryPlant( gameAction, out failureReason );
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
                    Game.PlayerBoards[gameAction.PlayerId],
                    out failureReason
                );
        }

        private bool TryBuy (string userId, GameAction gameAction, out string failureReason) {
            if ( gameAction.PieceType == null ) {
                failureReason = "PieceType Not Included";
                return false;
            }

            if ( !Game.PlayerBoards[userId].TryBuy( (PieceType) gameAction.PieceType, out string buyFailReason ) ) {
                failureReason = $"Cannot buy piece: {buyFailReason} ";
                return false;
            }

            failureReason = "";
            return true;
        }
    }
}
