using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class BoardDto {

        public HexCoordinates[] TreeTiles { get; set; } = { };
        public Dictionary<HexCoordinates, uint> Tiles { get; set; } = new Dictionary<HexCoordinates, uint>();
        public SunPosition SunPosition { get; set; } = SunPosition.NorthEast;
    }

}
