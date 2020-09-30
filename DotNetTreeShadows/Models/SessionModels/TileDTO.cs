namespace dotnet_tree_shadows.Models.SessionModels {
    public struct OldTileDto {
        public HexCoordinates HexCoordinates { get; set; }
        public PieceType? PieceType { get; set; }
        public TreeType? TreeType { get; set; }
        public int ShadowHeight { get; set; }
    }
}
