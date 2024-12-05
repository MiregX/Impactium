export class Color {
  private value: string;

  constructor(value: string | Color) {
    this.value = Color.toVar(value);
  }

  minus(tone: number = 1): Color {
    return this.change(-tone);
  }

  plus(tone: number = 1): Color {
    return this.change(tone);
  }

  private change(tone: number): Color {
    return new Color(this.prefix() + (this.suffix() + tone * 100));
  }

  private prefix(): string {
    return Color.fromVar(this.value).slice(0, -3);
  }

  private suffix(): number {
    return parseInt(Color.fromVar(this.value).slice(-3));
  }

  static isVar(str: string | Color): boolean {
    return typeof str === "string" && str.startsWith("var(--") && str.endsWith(")");
  }

  static toVar(str: string | Color): string {
    if (str instanceof Color) {
      return str.value;
    }
    return Color.isVar(str) ? str : `var(--${str})`;
  }

  static fromVar(str: string | Color): string {
    if (str instanceof Color) {
      return str.value;
    }
    return Color.isVar(str) ? str.slice(6, -1) : str;
  }

  toString(): string {
    return this.value;
  }

  valueOf(): string {
    return this.value;
  }
}
