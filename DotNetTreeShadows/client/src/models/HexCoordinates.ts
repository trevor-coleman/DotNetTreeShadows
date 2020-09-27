import { IHexCoordinates } from '../store/sessions/types';

export class HexCoordinates implements IHexCoordinates {
  public get axialArray(): number[] {
    return [this.q, this.r]
  }

  public q: number = 0;
  public r: number = 0;
  public s: number = 0;

  public toString = ():string=>`Hex[${this.q}, ${this.r}, ${this.s}]`;
}
