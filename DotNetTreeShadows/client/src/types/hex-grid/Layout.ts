import { Orientation } from './Orientation';
import { Point } from './Point';
import { Hex } from './Hex';

export class Layout {
  public orientation: Orientation = Orientation.Flat;
  public size: Point = {
    x: 1000,
    y: 1000,
  };
  public origin: Point = {
    x: 0,
    y: 0,
  };

  constructor(orientation: Orientation, size: Point, origin: Point) {
    this.orientation = orientation;
    this.size = size;
    this.origin = origin;
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
