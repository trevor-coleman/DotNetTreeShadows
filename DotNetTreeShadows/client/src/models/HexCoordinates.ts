import { IHexCoordinates } from '../store/sessions/types';

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

  public toString = (): string => `Hex[${this.q}, ${this.r}, ${this.s}]`;
}
