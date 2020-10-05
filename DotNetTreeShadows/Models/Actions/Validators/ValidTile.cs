using System;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.GameActions.Validators {
    public class ValidTile : ATurnAction.AActionValidator {

        private readonly Hex target;
        private readonly string propertyName;

        public ValidTile (in Hex target, string propertyName ="target") {
            this.target = target;
            
        }

        public override bool IsValid {
          get =>
            Math.Abs( target.Q ) < 4 &&
            Math.Abs( target.R ) < 4 &&
            Math.Abs( target.R ) < 4 &&
            target.Q + target.R + target.S == 0;
        }

        public override string? FailureMessage {
            get =>
                IsValid
                    ? null
                    : $"Invalid {propertyName} tile.";
        }
    }
}
