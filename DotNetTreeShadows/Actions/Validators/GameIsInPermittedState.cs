using System.Collections.Generic;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;
using dotnet_tree_shadows.Models.GameModel;

namespace dotnet_tree_shadows.Actions.Validators {
  public class GameIsInPermittedState: ATurnAction.AActionValidator {
    private readonly Game game;
    private readonly IEnumerable<GameStatus> permittedDuring;
    public GameIsInPermittedState (Game game, IEnumerable<GameStatus> permittedDuring) {
      this.game = game;
      this.permittedDuring = permittedDuring;
    }

    public override bool IsValid { get => permittedDuring.Any(s=>s==game.Status); }
    public override string? FailureMessage { get=>IsValid ? null:"Game is not in permitted state;"; }
  }
}
