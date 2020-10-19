using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Security.Permissions;

namespace dotnet_tree_shadows.Models.GameModel {
  [Serializable]
  public class TokenStacks {

    private Dictionary<int, int[]> stacks = new Dictionary<int, int[]> {
      { 1, OneLeafTiles },
      { 2, TwoLeafTiles },
      { 3, ThreeLeafTiles },
      { 4, FourLeafTiles },
    };
    
    public int[] this [int index] {
      get =>
        stacks.TryGetValue(index,out int[] stack)
          ? stack
          : new int[0];

      set {
        if ( stacks.ContainsKey( index ) ) {
          stacks[index] =  value;
          return;
        } else {
          stacks.Add( index, value);
        }
      }
    }

    public TokenStacks () { }

    protected TokenStacks(SerializationInfo info, StreamingContext context) 
    {
      int[] intArray = new int[0];

      stacks = new Dictionary<int, int[]> {
        { 1, (int[]) info.GetValue( "1", intArray.GetType() ) },
        { 2, (int[]) info.GetValue( "2", intArray.GetType() ) },
        { 3, (int[]) info.GetValue( "3", intArray.GetType()) },
        { 4, (int[]) info.GetValue( "4", intArray.GetType()) }
      };
    }

    [SecurityPermission(SecurityAction.Demand, SerializationFormatter = true)]
    public virtual void GetObjectData(SerializationInfo info, StreamingContext context)
    {
      info.AddValue("1", stacks[1]);
      info.AddValue("2", stacks[2]);
      info.AddValue("3", stacks[3]);
      info.AddValue("4", stacks[4]);
      
    }  
    
    
    private static readonly int[] OneLeafTiles = { 14, 14, 13, 13, 12, 12, 12, 12 };
    private static readonly int[] TwoLeafTiles = { 17, 16, 16, 14, 14, 13, 13, 13 };
    private static readonly int[] ThreeLeafTiles = { 19, 18, 18, 17, 17 };
    private static readonly int[] FourLeafTiles = { 22, 21, 20 };

    public bool TryGetValue (in int leaves, out int[]? stack) {
      stack = null;
      if ( !stacks.ContainsKey( leaves ) ) return false;
      stack = stacks[leaves];
      return true;
    }

  }
}
