using System;
using System.Collections.Generic;
using System.Linq;

namespace dotnet_tree_shadows.Utilities {
    public static class EnumUtil {
        public static IEnumerable<T> GetValues<T>() => Enum.GetValues(typeof(T)).Cast<T>();
    }
}
