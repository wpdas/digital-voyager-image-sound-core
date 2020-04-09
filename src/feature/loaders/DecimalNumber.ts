import decimalToBinary from 'core/decimalToBinary';
import binaryToDecimal from 'core/binaryToDecimal';
import Header from './utils/Header';
import loadersTypesId from '../../loadersTypesId';
import { TYPE_ID_BITS_SIZE } from '../../constants';

class DecimalNumber {
  // Define the Header of this loader
  public header: Header = new Header(loadersTypesId.DECIMAL_NUMBER);

  /**
   * DecimalNumber Loader - encoder and decoder
   *
   * The header is storing one parameter:
   * typeId: 8 bits
   */
  constructor() {}

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
   * @param {number} bitsDepth amount of bits (8 bits = 1 byte). Infinite if not informed.
   * @returns {string}
   */
  public encode(numberValue: number, bitsDepth?: number) {
    const output = decimalToBinary(numberValue, bitsDepth);
    return this.header.getHeaderBits() + output;
  }

  /**
   * Converts bits containing decimal number data to decimal itself
   * @param {string} bitsSquence bits of a decimal number
   * @returns {number} decimal number
   */
  public decode(bitsSquence: string) {
    const bitsWithoutHeader = bitsSquence.slice(TYPE_ID_BITS_SIZE);
    return binaryToDecimal(bitsWithoutHeader);
  }
}

export default DecimalNumber;
