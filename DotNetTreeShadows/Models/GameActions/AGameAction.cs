using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.GameActions {
    public abstract class AGameAction {
      [BsonId]
        [BsonRepresentation( BsonType.ObjectId )]
        public string Id { get; set; }
      
      [JsonConverter( typeof( StringEnumConverter ) )]
      [BsonRepresentation( BsonType.String )]
      public abstract GameActionType Type { get; }
        
        [BsonRepresentation( BsonType.ObjectId )]
        public string PlayerId { get; set; }
      
       

        protected readonly Game Game;

        protected AGameAction (Game game, string playerId) { Game = game;
          PlayerId = playerId;
          AddValidators( new AActionValidator[]{new OnPlayersTurn( playerId, game )}  );
        }

        private IEnumerable<AActionValidator> ActionValidators { get; set; } = new List<AActionValidator>();
        private IEnumerable<AActionValidator> UndoValidators { get; set; } = new List<AActionValidator>();

        protected void AddValidators (IEnumerable<AActionValidator> validators) {
            ActionValidators = ActionValidators.Concat( validators );
        }
        
        protected void AddUndoValidators (IEnumerable<AActionValidator> validators) {
          ActionValidators = ActionValidators.Concat( validators );
        }

        public bool Execute (out string? failureMessage) {
          failureMessage = null;
          if ( !CanDo ) {
            failureMessage = FailureMessage;
            return false;
          }

          try {
            DoAction();
          }
          catch (Exception e) {
            failureMessage = e.Message;
            return false;
          }


          return true;
        }

        public bool Undo (out string? failureMessage) {
          failureMessage = null;
          if ( !CanUndo ) {
            failureMessage = FailureMessage;
            return false;
          }

          try {
            UndoAction();
          }
          catch (Exception e) {
            failureMessage = e.Message;
            return false;
          }
          
          return true;
        }
        
        protected abstract void DoAction ();
        protected bool CanDo {
          get => ActionValidators.All( validator => validator.IsValid );
        }
        protected bool CanUndo {
            get => ActionValidators.All( validator => CanDo );
        }

        public string FailureMessage {
            get => ActionValidators.Aggregate( "", (s, v) => s += v.FailureMessage );
        }
        protected abstract void UndoAction ();
        
        public abstract class AActionValidator {
          public abstract bool IsValid { get; }
          public abstract string? FailureMessage { get; }
        }

        protected class UndoNotPermittedException :InvalidOperationException {
          public UndoNotPermittedException() : base("Undo not permitted for this type of action.") {}
        }
    }
}
