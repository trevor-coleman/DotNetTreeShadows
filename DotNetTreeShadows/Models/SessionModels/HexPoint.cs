using System;

namespace dotnet_tree_shadows.Models {
    public class HexPoint : Tuple<sbyte, sbyte, sbyte> {
        public sbyte Q {
            get => Item1;
        }

        public sbyte R {
            get => Item2;
        }

        public sbyte S {
            get => Item3;
        }

        public static int Distance (HexPoint a, HexPoint b) => Math.Max( Math.Abs( a.Q - b.Q ), Math.Max( Math.Abs( a.R - b.R ), Math.Abs( a.S - b.S ) ) );
        
        public HexPoint (sbyte q, sbyte r) : base( q, r, (sbyte) (-q - r) ) { }
        public HexPoint (sbyte q, sbyte r, sbyte s) : base( q, r, s) { }

        public static HexPoint Zero {
            get => new HexPoint( 0, 0 );
        }
        
        public override int GetHashCode () =>
            ShiftAndWrap( Q.GetHashCode(), 4 ) ^ ShiftAndWrap( R.GetHashCode(), 2 ) ^ S.GetHashCode();

        private static int ShiftAndWrap (int value, int positions) {
            positions &= 0x1F;

            // Save the existing bit pattern, but interpret it as an unsigned integer.
            uint number = BitConverter.ToUInt32( BitConverter.GetBytes( value ), 0 );
            // Preserve the bits to be discarded.
            uint wrapped = number >> (32 - positions);
            // Shift and wrap the discarded bits.
            return BitConverter.ToInt32( BitConverter.GetBytes( (number << positions) | wrapped ), 0 );
        }
    }
}
