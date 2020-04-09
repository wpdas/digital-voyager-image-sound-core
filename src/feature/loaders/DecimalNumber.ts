import ILoader from './ILoader';
import decimalToBinary from 'core/decimalToBinary';
import binaryToDecimal from 'core/binaryToDecimal';
import Header from './utils/Header';
import EncodeOutput from './utils/EncodeOutput';
import loadersTypesId from '../../loadersTypesId';
import { TYPE_ID_BITS_SIZE } from '../../constants';

class DecimalNumber implements ILoader<number> {
  public header: Header = new Header(loadersTypesId.DECIMAL_NUMBER);

  /**
   * DecimalNumber Loader - encoder and decoder. You can use it for handle with
   * decimal numbers (the common numbers we know as a human).
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
  public encode(numberValue: number, bitsDepth?: number): EncodeOutput {
    const output = decimalToBinary(numberValue, bitsDepth);
    return new EncodeOutput(this.header, output);
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
