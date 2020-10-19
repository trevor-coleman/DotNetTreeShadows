using System;
using System.Collections.Generic;
using System.Linq;

namespace dotnet_tree_shadows.Services.GameActionService {
  public abstract class AAction {

    protected abstract ActionContext ActionContext { get; }

    protected abstract IEnumerable<Func<ActionContext, bool>> Validators { get; }

    protected abstract ActionContext DoAction (ActionContext context);

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
        failed.Append( v.Method.Name );
        valid = false;
      }

      failedValidators = failed;
      return valid;
    }

  }
}
