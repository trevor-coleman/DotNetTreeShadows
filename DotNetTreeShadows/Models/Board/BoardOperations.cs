using System.Linq;
using dotnet_tree_shadows.Models.SessionModels;

namespace dotnet_tree_shadows.Models.BoardModel {
  public class BoardOperations {

    public static int CountLight (Board board, TreeType treeType) {
      return board.tiles.Where( (h, t) => Tile.TreeTypeIs( t, treeType ) && Tile.ProducesLight( t ) )
               .Aggregate(
                    0,
                    (l, p) => l + Tile.GetLight( p.Value )
                  );
    }
    
    

  }
}
