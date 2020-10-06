
export class Hex {
    private hexCode: number = 0;

    constructor(hexCode: number) {
        this.hexCode = hexCode;
    }

    get q(): number {
        return (this.hexCode >> 16) & 0xff;
    }

    get r(): number {
        return (this.hexCode >> 8) & 0xff;
    }

    get s(): number {
        return this.hexCode & 0xff
    }

    public get axialArray(): number[] {
        return [this.q, this.r];
    }

    public static Create = (q:number, r:number, s:number):Hex => {
        let hexCode:number = 0;
        hexCode |= (q && 0xff) << 16;
        hexCode |= (r && 0xff) << 8;
        hexCode |= (s && 0xff);

        return new Hex(hexCode);
    }

    public static Add = (a: Hex, b: Hex): Hex => Hex.Create(a.q + b.q,
        a.r + b.r,
        a.s + b.s);

    public static Subtract = (a: Hex, b: Hex): Hex => Hex.Create(a.q - b.q,
        a.r - b.r,
        a.s - b.s);

    public static Multiply = (a: Hex, k: number) => Hex.Create(a.q * k, a.r * k, a.s * k);

    public static Length = (hex: Hex): number => (
        (
            Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2);

    public static Distance = (a: Hex, b: Hex): number => (
        Hex.Length(Hex.Subtract(a, b)));

    public toString = (): string => `Hex[${this.q}, ${this.r}, ${this.s}]`;

    get index(): number {
        return this.hexCode;
    }

    public Equals = (other: Hex): boolean => this.q === other.q && this.r === other.r && this.s === other.s;
}
