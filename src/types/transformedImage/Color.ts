import { NumberUtils } from "../NumberUtils";

interface IRgba {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;
}

interface IHex {
    readonly r: string;
    readonly g: string;
    readonly b: string;
    readonly a: string;
}

export class Color {
    internalRgba: IRgba;

    get rgba(): IRgba {
        return this.internalRgba;
    }

    set rgba(rgba: IRgba) {
        this.internalRgba = rgba;
    }

    get hex(): IHex {
        const { a, r, g, b } = this.internalRgba;

        const rHex = NumberUtils.toHex(r);
        const gHex = NumberUtils.toHex(g);
        const bHex = NumberUtils.toHex(b);
        let aHex: string;

        if (a === 0) {
            aHex = "";
        } else {
            aHex = NumberUtils.toHex(a);
        }

        return {
            r: rHex,
            g: gHex,
            b: bHex,
            a: aHex
        }
    }

    set hex(
        argbHex: IHex
    ) {
        this.internalRgba = {
            r: Number(`0x${argbHex.r}`) || 0,
            g: Number(`0x${argbHex.g}`) || 0,
            b: Number(`0x${argbHex.b}`) || 0,
            a: Number(`0x${argbHex.a}`) || 0
        };
    }

    static fromHex(argbHex: string) {
        const doubleCharacter = (c: string) => c + c;

        if (argbHex.length === 3) {
            argbHex = `${argbHex}0`;
        }

        if (argbHex.length === 4) {
            argbHex = [...argbHex].map(doubleCharacter).join("");
        }

        if (argbHex.length === 6) {
            argbHex = `${argbHex}00`;
        }

        const r = Number(`0x${argbHex.slice(0, 2)}`) || 0;
        const g = Number(`0x${argbHex.slice(2, 4)}`) || 0;
        const b = Number(`0x${argbHex.slice(4, 6)}`) || 0;
        let a = Number(`0x${argbHex.slice(6, 8)}`) || 0;

        return new Color({
            r: r,
            g: g,
            b: b,
            a: a
        });
    };

    constructor(rgba: { r: number, g: number, b: number, a?: number }) {
        this.rgba = rgba
            ? {
                a: rgba.a ? NumberUtils.toRounded(rgba.a) : 0,
                r: NumberUtils.toRounded(rgba.r) || 0,
                g: NumberUtils.toRounded(rgba.g) || 0,
                b: NumberUtils.toRounded(rgba.b) || 0
            }
            : { a: 0, r: 0, g: 0, b: 0 };
    }

    isEmpty(): boolean {
        const { a, r, g, b } = this.rgba;
        return (a === 0)
            && r === 0
            && g === 0
            && b === 0;
    }

    toHexString(fastlyFormat: boolean = false): string {
        return fastlyFormat
            ? `${this.hex.a}${this.hex.r}${this.hex.g}${this.hex.b}`
            : `${this.hex.r}${this.hex.g}${this.hex.b}${this.hex.a}`;
    }

    toShortHexString(fastlyFormat: boolean = false): string {
        if (this.isEmpty()) {
            return "";
        }

        const { a, r, g, b } = this.internalRgba;

        if (NumberUtils.isHexOneChar(a)
            && NumberUtils.isHexOneChar(r)
            && NumberUtils.isHexOneChar(g)
            && NumberUtils.isHexOneChar(b)
        ) {
            let aHex = NumberUtils.toHex(a / 17, 1);
            const rHex = NumberUtils.toHex(r / 17, 1);
            const gHex = NumberUtils.toHex(g / 17, 1);
            const bHex = NumberUtils.toHex(b / 17, 1);

            if (a === 0) {
                aHex = "";
            }

            return fastlyFormat
                ? `${aHex}${rHex}${gHex}${bHex}`
                : `${rHex}${gHex}${bHex}${aHex}`;
        }

        return this.toHexString(fastlyFormat);
    }

    toCssRgba(): string {
        const { a, r, g, b } = this.rgba;

        return `rgba(${r},${g},${b},${a === 0 ? 1 : NumberUtils.toRounded(a / 255, 4)})`;
    }

    toRgb() {
        return {
            r: this.rgba.r,
            g: this.rgba.g,
            b: this.rgba.b
        }
    }

    toPickerFormat() {
        return {
            a: NumberUtils.toRounded(this.rgba.a / 255, 4),
            r: this.rgba.r,
            g: this.rgba.g,
            b: this.rgba.b
        }
    }

    static fromPickerFormat(rgba: { r: number, g: number, b: number, a?: number }): Color {
        return new Color({
            r: rgba.r,
            g: rgba.g,
            b: rgba.b,
            a: NumberUtils.toRounded((rgba.a || 1) * 255)
        });
    };
}