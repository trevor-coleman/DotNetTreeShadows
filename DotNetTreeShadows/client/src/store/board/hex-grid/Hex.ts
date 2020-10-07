
export class Hex {
    private hexCode: number = 0;

    constructor(hexCode: number) {
        this.hexCode = hexCode;
    }

    get q(): number {
        const q= (this.hexCode >> 17) & 0xff;
        return (q) < 128 ? (q) : (q) - 256
    }

    get r(): number {
        const r= (this.hexCode >> 9) & 0xff ;
        return (r) < 128 ? (r) : (r) - 256
    }

    get s(): number {
        const s= this.hexCode & 0xff;
        return (s) < 128 ? (s) : (s) - 256
    }


    public get axialArray(): number[] {
        return [this.q, this.r];
    }

    public static Create = (q:number, r:number, s:number):Hex => {
        console.group("Create")
        let hexCode:number = 0;
        console.log(q, q.toString(2), ((q & 255) << 16).toString(2) )
        hexCode |= (q & 0xff) << 17;
        console.log(r, r.toString(2), ((r & 0xff) << 8).toString(2) )
        hexCode |= (r & 0xff) << 9;
        console.log(s, s.toString(2), ((s & 0xff)).toString(2) )
        hexCode |= (s & 0xff);
        console.groupEnd();
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

    public static test = ()=> {
        for (let i = -4; i <= 4; i++) {
            for (let j = -4; j <= 4; j++) {
                let k = 0 - i - j;
                const h = Hex.Create( i, j, k );
                console.log("--->",  h.hexCode.toString(2));
                console.log(`(${i}, ${j}, ${k}) => [${h.q}, ${h.r}, ${h.s}]`)

            }
        }
    }
}
