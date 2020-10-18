



using dotnet_tree_shadows.Models;

namespace dotnet_tree_shadows.Actions.Validators {
    public class WithinRangeOfOrigin : ATurnAction.AActionValidator {

        protected readonly Hex origin;
        protected readonly Hex target;
        protected readonly int AllowedDistance;

        public WithinRangeOfOrigin (Hex origin, Hex target, int allowedDistance) {
            this.origin = origin;
            this.target = target;
            AllowedDistance = allowedDistance;
        }

        public override bool IsValid {
            get => Hex.Distance( origin, target ) < AllowedDistance;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : "Out of allowed range.";
        }
    }
}


