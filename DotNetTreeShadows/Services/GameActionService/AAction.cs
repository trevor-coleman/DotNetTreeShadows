using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Services.GameActionService {
  public abstract class AAction {

    protected abstract ActionContext ActionContext { get; }

    protected abstract IEnumerable<Func<ActionContext, bool>> Validators { get; }
    protected abstract IEnumerable<Func<ActionContext, bool>> UndoValidators { get; }

    protected abstract ActionContext DoAction (ActionContext context);

    public bool UnExecute (out ActionContext context, string actionId, out string failureMessage) {
      context = ActionContext;
      failureMessage = "";

      if ( !context.Game.ActionIsLastAction( actionId ) ) {
        failureMessage = $"Undoing {ActionContext.GameActionType} Failed - Tried to undo action ({actionId}) that is not the last action.";
        return false;
      }
      
      if ( !UndoIsValid( out string[] failedValidators ) ) {
        failureMessage =
          $"Undoing {ActionContext.GameActionType} - Failed Validations:\n {string.Join( "\n - ", failedValidators )} ";
        return false;
      }
      
      try {
        context = UndoAction( context );
      }

      catch (Exception e) {
        Console.WriteLine( e.StackTrace );
        failureMessage = e.Message;
        return false;
      }

      return true;
    }

    protected abstract ActionContext UndoAction (ActionContext context);

    protected abstract GameActionData MakeActionData (ActionContext context);

    private bool UndoIsValid (out string[] failedValidators) {
      string[] failed = new string[0];
      bool valid = true;
      foreach ( Func<ActionContext, bool> v in UndoValidators ) {
        if ( v.Invoke( ActionContext ) ) continue;
        failed = failed.Append( v.Method.Name ).ToArray();
        valid = false;
      }

      failedValidators = failed;
      return valid;
    }

    public bool Execute (out ActionContext context, out string failureMessage) {
      context = ActionContext;
      failureMessage = "";
      if ( !IsValid( out string[] failedValidators ) ) {
        failureMessage =
          $"{ActionContext.GameActionType} - Failed Validations:\n {string.Join( "\n - ", failedValidators )} ";
        return false;
      }
      
      try {
        context = DoAction( context );
      }

      catch (Exception e) {
        Console.WriteLine( e.StackTrace );
        failureMessage = e.Message;
        return false;
      }

      return true;
    }

    public bool IsValid (out string[] failedValidators) {
      string[] failed = new string[0];
      bool valid = true;
      foreach ( Func<ActionContext, bool> v in Validators ) {
        if ( v.Invoke( ActionContext ) ) continue;
        failed = failed.Append( v.Method.Name ).ToArray();
        valid = false;
      }

      failedValidators = failed;
      return valid;
    }

  }
}
