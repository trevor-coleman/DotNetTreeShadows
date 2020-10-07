import { Orientation } from './Orientation';
import { Point } from './Point';
import { Hex } from './Hex';

export class HexLayout {
  public orientation: Orientation = Orientation.Flat;
  public size: Point = {
    x: 120,
    y: 120,
  };
  public origin: Point = {
    x: 1000,
    y: 1000,
  };


  constructor(orientation: Orientation, tileSize?: Point, origin?: Point) {
    this.orientation = orientation;
    this.size = tileSize || this.size;
    this.origin = origin || this.origin;
  }

  public hexCodeToPixel = (hexCode:number):Point => {
    return this.hexToPixel(new Hex(hexCode));
  }

  public hexToPixel = (h: Hex): Point => {
    const m = this.orientation;
    const x = (
                m.f0 * h.q + m.f1 * h.r) * this.size.x;
    const y = (
                m.f2 * h.q + m.f3 * h.r) * this.size.y;
    return {
      x: x + this.origin.x,
      y: y + this.origin.y,
    };
  };
}
