import decimalToBinary from 'core/decimalToBinary';
import binaryToDecimal from 'core/binaryToDecimal';
import Header from './utils/Header';
import loadersTypesId from '../../loadersTypesId';

class DecimalNumber {
  // Define the Header of this loader
  public static header: Header = new Header(loadersTypesId.DECIMAL_NUMBER);

  /**
   * Converts decimal number to bits (multiple of 8 bits)
   *
   * Example of usage:
   * DecimalNumber.encode(2, 720); Returns "0000001011010000"
   *
   * You can limit the bytes depth by informing the amount on bytesDepth parameter. If not informed,
   * it will use only the necessary amount of bytes (multiple of 8 bits);
   *
   * @param {number} numberValue decimal number value
   * @param {number} bytesDepth amount of bytes (8 bits per byte). Infinite if not informed.
   * @returns {string}
   */
  public static encode(numberValue: number, bytesDepth?: number) {
    return decimalToBinary(numberValue, bytesDepth);
  }

  /**
   * Converts bits containing decimal number data to decimal itself
   * @param {string} bitsSquence bits of a decimal number
   * @returns {number} decimal number
   */
  public static decode(bitsSquence: string) {
    return binaryToDecimal(bitsSquence);
  }
}

export default DecimalNumber;
