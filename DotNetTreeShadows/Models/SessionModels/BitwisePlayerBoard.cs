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
                uint boardCode = pieceCounts.Aggregate( treeTypeCode | lightCode, (current, pieceCount) => current | pieceCount.pieceCode );
                return boardCode;
            }
        }

        public class PieceCount {
            public uint pieceCode {
                get => Available << availableBitwiseOffset & OnPlayerBoard << onPlayerBoardBitwiseOffset;
            }

            public uint Available { get; set; }
            public uint OnPlayerBoard { get; set; }
            private readonly int availableBitwiseOffset;
            private readonly int onPlayerBoardBitwiseOffset;
            private readonly int bitwiseOffset;
            private readonly int maxOnBoard;

            public PieceCount (
                    uint available,
                    uint onPlayerBoard,
                    int availableBitwiseOffset,
                    int onPlayerBoardBitwiseOffset,
                    int maxOnBoard
                ) {
                this.Available = available;
                this.OnPlayerBoard = onPlayerBoard;
                this.availableBitwiseOffset = availableBitwiseOffset;
                this.onPlayerBoardBitwiseOffset = onPlayerBoardBitwiseOffset;
                this.maxOnBoard = maxOnBoard;
            }

            public void IncreaseAvailable () => Available++;
            public void DecreaseAvailable () => Available--;
            public void IncreaseOnPlayerBoard () => OnPlayerBoard++;
            public void DecreaseOnPlayerBoard () => OnPlayerBoard--;
            public bool CanReturnSafely () => OnPlayerBoard < maxOnBoard;

        }

        public PieceCount Pieces (PieceType pieceType) => pieceCounts[(int) pieceType];
        
        // ReSharper disable once FieldCanBeMadeReadOnly.Local
        private PieceCount[] pieceCounts = {
                                               new PieceCount( 2, 4, 8, 12,4 ),
                                               new PieceCount( 4, 4, 15, 19,4 ),
                                               new PieceCount( 1, 3, 22, 25,3 ),
                                               new PieceCount( 0, 2, 28, 30,2 )
                                           };

        public TreeType TreeType {
            get;
            set;
        }

        private uint treeTypeCode {
            get => ((uint) TreeType);
        }

        public int Light { get; set; }

        private uint lightCode {
            get => ((uint) Light) << 2;
        }
        
    }
}
