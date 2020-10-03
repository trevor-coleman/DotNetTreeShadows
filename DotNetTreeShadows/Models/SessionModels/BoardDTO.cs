using System.Collections.Generic;
using Newtonsoft.Json;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class BoardDto {

        public HexCoordinates[] TreeTiles { get; set; } = { };
        public Dictionary<HexCoordinates, int> Tiles { get; set; } = new Dictionary<HexCoordinates, int>();
        public SunPosition SunPosition { get; set; } = SunPosition.NorthEast;
    }

}
