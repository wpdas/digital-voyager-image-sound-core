import binaryToDecimal from './binaryToDecimal';

const MAX_HEX = 255;

/**
 * Convert the hex value (0 - 255) to fit the desired bits e.g 2, 4, 8
 * @param currentDecimalHexColor Hex value 0 - 255
 * @param maxBitsToStore Bits to store this data 2, 4, 8
 */
const hexToBpp = (currentDecimalHexColor: number, maxBitsToStore: number) => {
  const maxBits = Array(maxBitsToStore).fill('1').join('');
  const bitsMaxSuportedValue = binaryToDecimal(maxBits);
  const per = (currentDecimalHexColor * 100) / MAX_HEX;
  return Math.round((per * bitsMaxSuportedValue) / 100);
};

export default hexToBpp;
