using System;
using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public class GameIsInPermittedState: ATurnAction.AActionValidator {
    private readonly Game game;
    private readonly IEnumerable<Game.GameStatus> permittedDuring;
    public GameIsInPermittedState (Game game, IEnumerable<Game.GameStatus> permittedDuring) {
      this.game = game;
      this.permittedDuring = permittedDuring;
    }

    public override bool IsValid { get => permittedDuring.Any(s=>s==game.Status); }
    public override string? FailureMessage { get=>IsValid ? null:"Game is not in permitted state;"; }
  }
}
