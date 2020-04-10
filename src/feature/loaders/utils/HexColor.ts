/**
 * https://gka.github.io/chroma.js/
 * Can be usefull to create colors
 */

export const Colors = {
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  pink: '#ff6d93',
  yellow: '#fafa6e',
};

class HexColor {
  private red: string;
  private green: string;
  private blue: string;

  /**
   * Hex color. Set hex color (#FFFFFF) and get separated value for each color (Blue, Green and Red).
   * @param color Hex color. You can use Colors module. E.g.: Colors.red
   */
  constructor(color: string = Colors.white) {
    if (color.length < 7) {
      throw new Error('Invalid format. Format should be like #FFFFFF');
    }
    this.red = '0x' + color.slice(1, 3);
    this.green = '0x' + color.slice(3, 5);
    this.blue = '0x' + color.slice(5, 7);
  }

  /**
   * Blue color factor
   */
  public get BLUE(): string {
    return this.blue;
  }

  /**
   * Green color factor
   */
  public get GREEN(): string {
    return this.green;
  }

  /**
   * Red color factor
   */
  public get RED(): string {
    return this.red;
  }
}

export default HexColor;
