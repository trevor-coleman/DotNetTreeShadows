#nullable enable
using System;
using System.ComponentModel;
using System.Linq;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace dotnet_tree_shadows.Models {
  [TypeConverter(typeof(HexConverter))]
    public readonly struct Hex {
        public readonly int Q;
        public readonly int R;
        public readonly int S;

        public Hex (int q, int r, int s) {
            if ( q + r + s != 0 )
                throw new ArgumentException(
                        $"Sum of HexCoordinate arguments must be zero. ({q} + {r} + {s} = {q + r + s})"
                    );

            Q = q;
            R = r;
            S = s;
        }

        public Hex (int q, int r) {
            Q = q;
            R = r;
            S = -q - r;
        }

        public Hex (int[] coordinateArray) {
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

        public Hex(int? hexCode)
        {
            sbyte q = (sbyte) (hexCode >> 16 & 0xff ?? 0);
            sbyte r = (sbyte) (hexCode >> 8 & 0xff ?? 0);
            sbyte s = (sbyte) (hexCode >> 0 & 0xff ?? 0);
            
            Q = q;
            R = r;
            S = s;
        }

      
        public int HexCode {
          get {
            int hexCode = 0;

            sbyte q = (sbyte) Q;
            sbyte r = (sbyte) R;
            sbyte s = (sbyte) S;

            hexCode |= (q & 0xff) << 16 ;
            hexCode |= (r & 0xff) << 8;
            hexCode |= s & 0xff;

            return hexCode;
          }
        }
      
        public override string ToString () => HexCode.ToString();
        public int[] ToArray () => new[] { Q, R, S };

        public int[] AxialArray {
            get => new[] { Q, R };
        }

        public static Hex Zero {
            get => new Hex( 0, 0, 0 );
        }

        public static Hex operator + (Hex a, Hex b) =>
            new Hex( a.Q + b.Q, a.R + b.R, a.S + b.S );

        public static Hex operator - (Hex a, Hex b) =>
            new Hex( a.Q - b.Q, a.R - b.R, a.S - b.S );

        public static Hex operator + (Hex a) => a;
        public static Hex operator - (Hex a) => new Hex();

        public static Hex operator * (int n, Hex a) =>
            new Hex( n * a.Q, n * a.R, n * a.S );

        public static bool operator == (Hex a, Hex b) => (a.Q == b.Q && a.R == b.R && a.S == b.S);
        public static bool operator != (Hex a, Hex b) => !(a == b);

        public override bool Equals (object? obj) {
            if ( (obj == null) || this.GetType() != obj.GetType() ) return false;

            Hex h = (Hex) obj;

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

        public int DistanceTo (Hex h) =>
            Math.Max( Math.Abs( Q - h.Q ), Math.Max( Math.Abs( R - h.R ), Math.Abs( S - h.S ) ) );

        public static int Distance (Hex x, Hex y) =>
            Math.Max( Math.Abs( x.Q - y.Q ), Math.Max( Math.Abs( x.R - y.R ), Math.Abs( x.S - y.S ) ) );

    }
}
