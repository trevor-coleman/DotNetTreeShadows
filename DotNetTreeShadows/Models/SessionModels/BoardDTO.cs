using System.Collections.Generic;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class BoardDto {

        public HexCoordinates[] TreeTiles { get; set; } = { };
        public Dictionary<HexCoordinates, TileDto> Tiles { get; set; } = new Dictionary<HexCoordinates, TileDto>();
        public SunPosition SunPosition { get; set; } = SunPosition.NorthEast;
    }

}
