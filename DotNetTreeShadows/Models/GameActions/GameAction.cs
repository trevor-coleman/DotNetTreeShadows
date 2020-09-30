using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.GameActions {
    public abstract class GameAction {
        [BsonId]
        [BsonRepresentation( BsonType.ObjectId )]
        public string Id { get; set; }
        
        [BsonRepresentation( BsonType.ObjectId )]
        public string PlayerId { get; set; }
        
        

        [JsonConverter( typeof( StringEnumConverter ) )]
        [BsonRepresentation( BsonType.String )]
        public GameActionType ActionType { get; set; } = GameActionType.EndTurn;

        protected readonly Game Game;

        protected GameAction (Game game, string playerId) { Game = game; }
        protected abstract IEnumerable<IActionValidator> ActionValidators { get; }
        
        public abstract void Execute ();
        public bool IsValid {
            get => ActionValidators.All( validator => IsValid );
        }

        public string FailureMessage {
            get => ActionValidators.Aggregate( "", (s, v) => s += v.FailureMessage );
        }
        public abstract void Undo ();
        
        public interface IActionValidator {
            bool IsValid { get; }
            string? FailureMessage { get; }
        }
        
    }

}
