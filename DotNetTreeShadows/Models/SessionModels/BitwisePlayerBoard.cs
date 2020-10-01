using System;
using System.Linq;
using static dotnet_tree_shadows.Models.SessionModels.BitwisePlayerBoard.PieceCount;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class BitwisePlayerBoard {

        private PieceCount[] PieceCounts { get; } = {
                                                             new PieceCount(
                                                                     PieceType.Seed,
                                                                     new BitValue( 2, 8, 0b1111 ),
                                                                     new BitValue( 4, 12, 0b111 ),
                                                                     4
                                                                 ),
                                                             new PieceCount(
                                                                     PieceType.SmallTree,
                                                                     new BitValue( 4, 15, 0b1111 ),
                                                                     new BitValue( 4, 19, 0b111 ),
                                                                     4
                                                                 ),
                                                             new PieceCount(
                                                                     PieceType.MediumTree,
                                                                     new BitValue( 1, 22, 0b111 ),
                                                                     new BitValue( 3, 25, 0b111 ),
                                                                     3
                                                                 ),
                                                             new PieceCount(
                                                                     PieceType.LargeTree,
                                                                     new BitValue( 0, 28, 3 ),
                                                                     new BitValue( 0, 30, 3 ),
                                                                     2
                                                                 )
                                                         };

        public BitwisePlayerBoard () { }

        public BitwisePlayerBoard (uint boardCode) {
            Light = (int) ((boardCode >> 2) & 0b_11_1111);
            TreeType = (TreeType) (boardCode & 0b_11);

            foreach ( PieceCount pieceCount in PieceCounts ) {
                pieceCount.ParseBoardCode( boardCode );
            }
        }

        public uint BoardCode {
            get {
                uint boardCode = PieceCounts.Aggregate(
                        treeTypeCode | lightCode,
                        (current, pieceCount) => current | pieceCount.pieceCode
                    );

                return boardCode;
            }
        }

        public TreeType TreeType { get; set; } = TreeType.Ash;

        private uint treeTypeCode {
            get => (uint) TreeType;
        }

        public int Light { get; set; }

        private uint lightCode {
            get => (uint) Light << 2;
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

            public uint pieceCode {
                get => (Available << available.Offset) | (OnPlayerBoard << onPlayerBoard.Offset);
            }

            public uint Available {
                get => available.Value;
                private set => available.Value = value;
            }

            public uint OnPlayerBoard {
                get => onPlayerBoard.Value;
                private set => onPlayerBoard.Value = value;
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

            public void ParseBoardCode (uint boardCode) {
                Available = (boardCode >> available.Offset) & available.Mask;
                OnPlayerBoard = (boardCode >> onPlayerBoard.Offset) & onPlayerBoard.Mask;
            }

            public struct BitValue {

                public BitValue (uint value, int offset, uint mask) {
                    Value = value;
                    Offset = offset;
                    Mask = mask;
                }

                public uint Value { get; set; }
                public int Offset { get; set; }
                public uint Mask { get; set; }
            }
        }
    }
}
