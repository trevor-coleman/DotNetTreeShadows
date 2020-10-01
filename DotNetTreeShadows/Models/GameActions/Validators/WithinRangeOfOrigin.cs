



using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class WithinRangeOfOrigin : ATurnAction.AActionValidator {

        protected readonly HexCoordinates origin;
        protected readonly HexCoordinates target;
        protected readonly int AllowedDistance;

        public WithinRangeOfOrigin (HexCoordinates origin, HexCoordinates target, int allowedDistance) {
            this.origin = origin;
            this.target = target;
            AllowedDistance = allowedDistance;
        }

        public override bool IsValid {
            get => HexCoordinates.Distance( origin, target ) < AllowedDistance;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Out of allowed range.";
        }
    }
}


