using System.Collections.Generic;
using dotnet_tree_shadows.Models.GameActions.Validators;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions {
    public class CollectAction : GameAction {
        public CollectAction (Game game, string playerId, HexCoordinates target) : base( game, playerId ) {
            AddValidators(
                    new AActionValidator[] {
                      
                              new TilePieceTypeIs( target, PieceType.LargeTree, Game ),
                              new PlayerCanAffordCost( playerId, 4, game ),
                              new TileHasNotBeenActiveThisTurn( target, game ),
                          }
                );

        }
        public override GameActionType Type { get; }
        public override void Execute () { throw new System.NotImplementedException(); }
        public override void Undo () { throw new System.NotImplementedException(); }
    }
}
