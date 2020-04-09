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
const decimalToBinary = (numberValue: number, bitsDepth?: number) => {
  const bits = numberValue.toString(2);
  const currentBitsSize = bits.length;
  let nullBits: string;

  // Limits the amount of bits
  if (bitsDepth != null) {
    // Bytes depth should support the numberValue bits
    if (currentBitsSize > bitsDepth) {
      throw new Error(
        'Bytes depth is not enough to store the passed numberValue.'
      );
    }

    nullBits = Array(bitsDepth - currentBitsSize)
      .fill('0')
      .join('');
  } else {
    // Will auto adjust the necessary amount of bits to store data
    const expectedBitsSize = Math.ceil(currentBitsSize / 8) * 8;

    nullBits = Array(expectedBitsSize - currentBitsSize)
      .fill('0')
      .join('');
  }

  return nullBits + bits;
};

export default decimalToBinary;
