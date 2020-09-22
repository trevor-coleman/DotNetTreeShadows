#nullable enable
using System;
using System.Numerics;

namespace dotnet_tree_shadows.Models {
    public readonly struct HexCoordinates {
        public readonly int Q;
        public readonly int R;
        public readonly int S;

        public HexCoordinates (int q, int r, int s) {
            if ( q + r + s != 0 )
                throw new ArgumentException(
                        $"Sum of HexCoordinate arguments must be zero. ({q} + {r} + {s} = {q + r + s})"
                    );

            Q = q;
            R = r;
            S = s;
        }

        public HexCoordinates (int q, int r) {
            Q = q;
            R = r;
            S = -q - r;
        }

        public HexCoordinates (int[] coordinateArray) {
            if ( coordinateArray.Length == 3 ) {
                Q = coordinateArray[0];
                R = coordinateArray[1];
                S = coordinateArray[2];
                return;
            }

            if ( coordinateArray.Length == 2 ) {
                Q = coordinateArray[0];
                R = coordinateArray[1];
                S = -Q - R;
                return;
            }

            throw new ArgumentException( "HexCoordinate constructor requires array of length 2 or 3" );
        }

        public override string ToString () => $"Hex[{Q}, {R}, {S}]";
        public int[] ToArray () => new[] { Q, R, S };

        public int[] AxialArray {
            get => new[] { Q, R };
        }

        public static HexCoordinates Zero {
            get => new HexCoordinates( 0, 0, 0 );
        }

        public static HexCoordinates operator + (HexCoordinates a, HexCoordinates b) =>
            new HexCoordinates( a.Q + b.Q, a.R + b.R, a.S + b.S );

        public static HexCoordinates operator - (HexCoordinates a, HexCoordinates b) =>
            new HexCoordinates( a.Q - b.Q, a.R - b.R, a.S - b.S );

        public static HexCoordinates operator + (HexCoordinates a) => a;
        public static HexCoordinates operator - (HexCoordinates a) => new HexCoordinates();

        public static HexCoordinates operator * (int n, HexCoordinates a) =>
            new HexCoordinates( n * a.Q, n * a.R, n * a.S );

        public static bool operator == (HexCoordinates a, HexCoordinates b) => (a.Q == b.Q && a.R == b.R && a.S == b.S);
        public static bool operator != (HexCoordinates a, HexCoordinates b) => !(a == b);

        public override bool Equals (object? obj) {
            if ( (obj == null) || this.GetType() != obj.GetType() ) return false;

            HexCoordinates h = (HexCoordinates) obj;

            return Q == h.Q && R == h.R && S == h.S;
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

        public int DistanceTo (HexCoordinates h) =>
            Math.Max( Math.Abs( Q - h.Q ), Math.Max( Math.Abs( R - h.R ), Math.Abs( S - h.S ) ) );

        public static int Distance (HexCoordinates x, HexCoordinates y) =>
            Math.Max( Math.Abs( x.Q - y.Q ), Math.Max( Math.Abs( x.R - y.R ), Math.Abs( x.S - y.S ) ) );

    }
}
