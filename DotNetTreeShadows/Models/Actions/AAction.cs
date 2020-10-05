using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using dotnet_tree_shadows.Models.GameModel;
using dotnet_tree_shadows.Models.SessionModels;
using dotnet_tree_shadows.Services;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json.Converters;

namespace dotnet_tree_shadows.Models.GameActions {
  public abstract class AAction {

    [BsonId]
    [BsonRepresentation( BsonType.ObjectId )]
    public string Id { get; set; } = "";

    [JsonConverter( typeof( StringEnumConverter ) )]
    [BsonRepresentation( BsonType.String )]
    public abstract GameActionType Type { get; }
    
    

    protected abstract IEnumerable<GameStatus> PermittedDuring { get; }

    [BsonRepresentation( BsonType.ObjectId )]
    public string PlayerId { get; set; }

    public Game Game { get; protected set; }

    protected AAction (AActionParams actionParams) {
      Game = actionParams.Game!;
      PlayerId = actionParams.PlayerId!;
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
      get {
        ActionValidators.Append( new GameIsInPermittedState( Game, PermittedDuring ) );
        return ActionValidators.All( validator => validator.IsValid );
      }
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

    protected class UndoNotPermittedException : InvalidOperationException {
      public UndoNotPermittedException () : base( "Undo not permitted for this type of action." ) { }
    }
  }
}
