import decimalToBinary from './decimalToBinary';
import sliceTextInChunks from './sliceTextInChunks';
import binaryToDecimal from './binaryToDecimal';
import { DEFAULT_BITS_DEPTH } from '../constants';

/**
 * Converts any number to Uint8 number.
 * 1 byte (8 bits) supports a total of 255 in decimal, this module will create the necessary amount of bits
 * and converts every sequence of 8 bits in decimal. An array will be returned containing the values.
 *
 * Examples:
 * give 1, it'll return [1]
 * give 255, it'll return [255]
 * give 256, it'll return [1, 0]
 * give 257, it'll return [1, 1]
 * give 65000, it'll return [253, 232]
 *
 * @param value Number to be converted
 * @param depth The uint8 array depth. Each depth is equal to 8 bits / 1 byte / 255 in decimal / 1 item into the array.
 * It will be adjusted to fit the desired depth, example:
 *
 * give numberToUint8(255, 2), it'll return [0, 255]
 */
const numberToUint8 = (value: number, depth?: number) => {
  const bits = decimalToBinary(value);
  const bitsArray = sliceTextInChunks(bits, DEFAULT_BITS_DEPTH);

  if (depth != null) {
    // Error if bigger
    if (bitsArray.length > depth) {
      throw new Error('The value is too long to be stored');
    }

    // Adjust if not fit the desired depth
    if (depth - bitsArray.length < depth) {
      for (let i = 0; i < depth - bitsArray.length; i++) {
        bitsArray.unshift('00000000');
      }
    }
  }

  return bitsArray.map((bitsSequence) => binaryToDecimal(bitsSequence));
};

export default numberToUint8;
