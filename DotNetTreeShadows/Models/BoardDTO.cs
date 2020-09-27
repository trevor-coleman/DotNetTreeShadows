using System.Collections.Generic;

namespace dotnet_tree_shadows.Models {
    public class BoardDTO {

        public HexCoordinates[] TreeTiles { get; set; }
        public Dictionary<HexCoordinates, TileDTO> Tiles { get; set; }
        public SunPosition SunPosition { get; set; }
    }

}
