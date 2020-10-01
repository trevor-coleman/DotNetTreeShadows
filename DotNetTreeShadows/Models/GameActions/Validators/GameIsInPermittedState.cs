using System;
using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
  public class GameIsInPermittedState: ATurnAction.AActionValidator {
    private readonly Game game;
    private readonly IEnumerable<Game.GameStatus> permittedDuring;
    public GameIsInPermittedState (Game game, IEnumerable<Game.GameStatus> permittedDuring) {
      this.game = game;
      this.permittedDuring = permittedDuring;
      throw new NotImplementedException();
    }

    public override bool IsValid { get; }
    public override string? FailureMessage { get; }
  }
}
