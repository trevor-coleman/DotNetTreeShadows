#nullable enable
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using dotnet_tree_shadows.Models.GameActions;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using XKCDPasswordGen;

namespace dotnet_tree_shadows.Models.SessionModels {
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
            Game = new Game(host.Id);
            Name = RandomName();
            Host = host.Id;
            Invitations = new List<string>();
        }

        public static string RandomName () {
            TextInfo textInfo = new CultureInfo("en-US",false).TextInfo;
            return textInfo.ToTitleCase($"{XkcdPasswordGen.Generate(3)}");
        }

        public void AddPlayer (Profile player) {
            Players.Add( player.Id );
            Game.AddPlayer( player.Id );
        }

        public bool HasInvited (string id) { return Invitations.Any( i => i == id ); }

        public void RemoveInvitation (string id) { Invitations.RemoveAll( i => i == id ); }

        public void AddInvitation (string id) {
            if ( HasInvited( id ) ) return;
            Invitations.Add( id );
        }

        public bool HasPlayer (string id) => Players.Contains( id );

        public bool TryExecuteAction (AGameAction aGameAction, out string? failureReason) => aGameAction.Execute(out failureReason);

        public SessionDto Dto () => new SessionDto {
                                                        Host = Host,
                                                        Players = Players.ToArray(),
                                                        Game = Game.Dto(),
                                                        Name = Name,
                                                        Invitations = Invitations.ToArray(),
                                                    };
        
        
    }

}
