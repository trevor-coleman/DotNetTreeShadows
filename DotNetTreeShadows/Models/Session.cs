#nullable enable
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using dotnet_tree_shadows.Models.GameActions;
using dotnet_tree_shadows.Services;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using XKCDPasswordGen;

namespace dotnet_tree_shadows.Models {
    public class Session {
        public SessionSummary Summary {
            get => new SessionSummary( Id, Name );
        }

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
            Name = RandomName();
            Host = "";
            Invitations = new List<string>();
        }

        public Session (Profile host) {
            Id = "";
            Players = new List<string>();
            Game = new Game();
            Name = RandomName();
            Host = host.Id;
            Invitations = new List<string>();
        }

        public static string RandomName () {
            TextInfo myTI = new CultureInfo("en-US",false).TextInfo;
            return myTI.ToTitleCase($"{XkcdPasswordGen.Generate(3, " ")}");
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

        public SessionDTO DTO () => new SessionDTO {
                                                        Host = Host,
                                                        Players = Players.ToArray(),
                                                        Game = Game.DTO(),
                                                        Name = Name,
                                                        Invitations = Invitations.ToArray(),
                                                    };
        
        public class SessionSummary {
            [BsonRepresentation(BsonType.ObjectId)]
            public string Id { get; set; }
            public string Name { get; set; }

            public SessionSummary () {
                Id = "";
                Name = "";
            }
            
            public SessionSummary (string id, string name) {
                Id = id;
                Name = name;
            }

        }
    }
}
