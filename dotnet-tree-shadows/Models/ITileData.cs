namespace dotnet_tree_shadows.Models {
    public interface ITileData {
        public int[] HexCoordinateArray { get; set; }
        public int PieceTypeIndex { get; set; }
        public int TreeTypeIndex { get; set; }
        public int ShadowHeight { get; set; }
    }
}
