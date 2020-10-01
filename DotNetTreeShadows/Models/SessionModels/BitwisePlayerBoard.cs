using System;
using System.Collections.Generic;
using System.ComponentModel.Design.Serialization;
using System.Linq;
using dotnet_tree_shadows.Models.GameActions;
using Microsoft.AspNetCore.Http.Connections;
using MongoDB.Driver.Core.Servers;

namespace dotnet_tree_shadows.Models.SessionModels {
    public class BitwisePlayerBoard {

        public uint BoardCode {
            get {
                uint boardCode = pieceCounts.Aggregate(
                        treeTypeCode | lightCode,
                        (current, pieceCount) => current | pieceCount.pieceCode
                    );

                return boardCode;
            }
        }

        public BitwisePlayerBoard () { }

        public BitwisePlayerBoard (uint boardCode) {
            Light = (int) ((boardCode >> 2) & 0b_11_1111);
            TreeType = (TreeType) (boardCode & 0b_11);
            
            foreach ( PieceCount pieceCount in pieceCounts ) {
                   pieceCount.ParseBoardCode( boardCode );
            }
        }

        public class PieceCount {
            public uint pieceCode {
                get => (Available << availableBitwiseOffset) | (OnPlayerBoard << onPlayerBoardBitwiseOffset);
            }

            public uint Available { get; private set; }
            public uint OnPlayerBoard { get; private set; }
            private readonly int availableBitwiseOffset;
            private readonly int availableMask;
            private readonly int onPlayerBoardBitwiseOffset;
            private readonly int onPlayerBoardMask;
            private readonly int bitwiseOffset;
            private readonly int maxOnBoard;

            public PieceCount (
                    uint available,
                    uint onPlayerBoard,
                    int availableBitwiseOffset,
                    int availableMask,
                    int onPlayerBoardBitwiseOffset,
                    int onPlayerBoardMask,
                    int maxOnBoard
                ) {
                Available = available;
                OnPlayerBoard = onPlayerBoard;
                this.availableBitwiseOffset = availableBitwiseOffset;
                this.availableMask = availableMask;
                this.onPlayerBoardBitwiseOffset = onPlayerBoardBitwiseOffset;
                this.onPlayerBoardMask = onPlayerBoardMask;
                this.maxOnBoard = maxOnBoard;
            }

            public void IncreaseAvailable () => Available++;
            public void DecreaseAvailable () => Available--;
            public void IncreaseOnPlayerBoard () => OnPlayerBoard++;
            public void DecreaseOnPlayerBoard () => OnPlayerBoard--;
            public bool CanReturnSafely () => OnPlayerBoard < maxOnBoard;

            public void ParseBoardCode (uint boardCode) {
                Available = (uint) (boardCode >> availableBitwiseOffset & availableMask);
                OnPlayerBoard = (uint) (boardCode >> onPlayerBoardBitwiseOffset & onPlayerBoardMask);
            }
            
        }

        public PieceCount Pieces (PieceType pieceType) => pieceCounts[(int) pieceType];

        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private PieceCount[] pieceCounts = {
                                               new PieceCount( 2, 4, 15, 8, 7, 12, 4 ),
                                               new PieceCount( 4, 4, 15, 15, 19, 7, 4 ),
                                               new PieceCount( 1, 3, 22, 7, 25, 7, 3 ),
                                               new PieceCount( 0, 2, 28, 3, 30, 3, 2 )
                                           };

        public TreeType TreeType { get; set; } = TreeType.Ash;

        private uint treeTypeCode {
            get => ((uint) TreeType);
        }

        public int Light { get; set; } = 0;

        private uint lightCode {
            get => (uint) Light << 2;
        }

        public void SpendLight (int i) => Light -= i;
        public void RecoverLight (int i) => Light += i;
    }
}
