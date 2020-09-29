import { IHexCoordinates } from '../../store/sessions/types';

export class HexCoordinates implements IHexCoordinates {
  public q: number = 0;
  public r: number = 0;
  public s: number = 0;

  constructor(q: number = 0, r: number = 0, s: number = 0) {
    this.q = q;
    this.r = r;
    this.s = s;
  }

  public get axialArray(): number[] {
    return [this.q, this.r];
  }

  public static Add = (a: HexCoordinates, b: HexCoordinates): HexCoordinates => new HexCoordinates(a.q + b.q,
    a.r + b.r,
    a.s + b.s);

  public static Subtract = (a: HexCoordinates, b: HexCoordinates): HexCoordinates => new HexCoordinates(a.q - b.q,
    a.r - b.r,
    a.s - b.s);

  public static Multiply = (a: HexCoordinates, k: number) => new HexCoordinates(a.q * k, a.r * k, a.s * k);

  public static Length = (hex: HexCoordinates): number => (
    (
      Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2);

  public static Distance = (a: HexCoordinates, b: HexCoordinates): number => (
    HexCoordinates.Length(HexCoordinates.Subtract(a, b)));

  public toString = (): string => `Hex[${this.q}, ${this.r}, ${this.s}]`;

  public Equals = (other: HexCoordinates): boolean => this.q === other.q && this.r === other.r && this.s === other.s;
}
