using System.Collections.Generic;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.HostActions {
  public class StartGameAction : AHostAction {

    public override GameActionType Type {
      get => GameActionType.StartGame;
    }

    protected override IEnumerable<Game.GameStatus> PermittedDuring { get; } = new[] { Game.GameStatus.Preparing };

    public StartGameAction (Game game, string playerId) : base( game, playerId ) {
      AddValidators( new AActionValidator[] { new MinimumTwoPlayers( game ) } );
    }

    protected override void DoAction () { Game.Start(); }
    protected override void UndoAction () { throw new UndoNotPermittedException(); }

  }
}
