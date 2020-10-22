using System;
using System.Linq;
using dotnet_tree_shadows.Models.Enums;
using static dotnet_tree_shadows.Models.GameModel.PlayerBoard.PieceCount;

namespace dotnet_tree_shadows.Models.GameModel {
  public class PlayerBoard {

    private PieceCount[] PieceCounts { get; } = {
      //pieceType, available, onboard, max
      //value,offset, mask
      
      new PieceCount( PieceType.Seed, new BitValue( 2, 8, 15 ), new BitValue( 4, 12, 7 ), 4 ),
      new PieceCount( PieceType.SmallTree, new BitValue( 4, 15, 15 ), new BitValue( 4, 19, 7 ), 4 ),
      new PieceCount( PieceType.MediumTree, new BitValue( 1, 22, 7 ), new BitValue( 3, 25, 7 ), 3 ),
      new PieceCount( PieceType.LargeTree, new BitValue( 0, 28, 3 ), new BitValue( 2, 30, 3 ), 2 )
    };
    
    

    public PlayerBoard () { }

    public PlayerBoard (int boardCode) {
      Light = (int) ((boardCode >> 2) & 0b_11_1111);
      TreeType = (TreeType) (boardCode & 0b_11);

      foreach ( PieceCount pieceCount in PieceCounts ) {
        pieceCount.ParseBoardCode( boardCode );
      }
    }


    public int BoardCode {
      get {
        int boardCode = PieceCounts.Aggregate(
            treeTypeCode | lightCode,
            (current, pieceCount) => current | pieceCount.pieceCode
          );

        return boardCode;
      }
    }

    public TreeType TreeType { get; set; } = TreeType.Ash;

    private int treeTypeCode {
      get => (int) TreeType;
    }

    private int light = 0;
    
    public int Light {
      get => light;
      set =>
        light = value > 30
                  ? 30
                  : value;
    }

    private int lightCode {
      get => (int) Light << 2;
    }

    public PieceCount Pieces (PieceType pieceType) => PieceCounts[(int) pieceType];

    public void SpendLight (int i) => Light -= i;
    public void RecoverLight (int i) => Light += i;

    public class PieceCount {

      private BitValue available;
      private BitValue onPlayerBoard;
      private readonly int maxOnBoard;
      private readonly int[] prices;

      public PieceCount (PieceType pieceType, BitValue available, BitValue onPlayerBoard, int maxOnBoard) {
        this.available = available;
        this.onPlayerBoard = onPlayerBoard;
        this.maxOnBoard = maxOnBoard;
        prices = pieceType switch {
          PieceType.Seed => new[] { 2, 2, 1, 1 },
          PieceType.SmallTree => new[] { 3, 3, 2, 2 },
          PieceType.MediumTree => new[] { 4, 3, 3 },
          PieceType.LargeTree => new[] { 5, 4 },
          _ => throw new ArgumentException( "invalid pieceType" )
        };
      }

      public int pieceCode {
        get => (Available << available.Offset) | (OnPlayerBoard << onPlayerBoard.Offset);
      }

      public int Available {
        get => available.Value;
        private set => available.Value = value;
      }

      public int OnPlayerBoard {
        get => onPlayerBoard.Value;
        private set => onPlayerBoard.Value = Math.Min(value, maxOnBoard);
      }

      public int NextPrice {
        get =>
          OnPlayerBoard == 0
            ? int.MaxValue
            : prices[OnPlayerBoard - 1];
      }

      public void IncreaseAvailable () => Available++;
      public void DecreaseAvailable () => Available--;
      public void IncreaseOnPlayerBoard () => OnPlayerBoard++;
      public void DecreaseOnPlayerBoard () => OnPlayerBoard--;
      public bool CanReturnSafely () => OnPlayerBoard < maxOnBoard;

      public void ParseBoardCode (int boardCode) {
        Available = (boardCode >> available.Offset) & available.Mask;
        OnPlayerBoard = (boardCode >> onPlayerBoard.Offset) & onPlayerBoard.Mask;
      }

      public struct BitValue {

        public BitValue (int value, int offset, int mask) {
          Value = value;
          Offset = offset;
          Mask = mask;
        }

        public int Value { get; set; }
        public int Offset { get; set; }
        public int Mask { get; set; }

      }

    }

    public static PlayerBoard Get (Game game, string playerId) => new PlayerBoard(game.PlayerBoards[playerId]);

    public static Game Set (Game game, string playerId, PlayerBoard playerBoard) {
      game.PlayerBoards[playerId] = playerBoard.BoardCode;
      return game;
    }

  }
}
