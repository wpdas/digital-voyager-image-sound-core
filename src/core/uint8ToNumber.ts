import decimalToBinary from './decimalToBinary';
import binaryToDecimal from './binaryToDecimal';

/**
 * Converts Uint8 number sequence to int number. This is the way of having the number encoded by
 * numberToUint8 module.
 *
 * Examples:
 * give [1], it'll return 1
 * give [255], it'll return 255
 * give [1, 0], it'll return 256
 * give [253, 232], it'll return 65000
 *
 * @param uint8Sequence Uint8 sequence to be converted to int number
 */
const uint8ToNumber = (uint8Sequence: Array<number>) => {
  const bitsArray = uint8Sequence.map((decimalValue) =>
    decimalToBinary(decimalValue)
  );
  return binaryToDecimal(bitsArray.join(''));
};

export default uint8ToNumber;
