/**
 * Converts bits containing decimal number data to decimal itself
 * @param {string} bitsSquence bits of a decimal number
 * @returns {number} decimal number
 */
const binaryToDecimal = (bitsSquence: string) => {
  return parseInt(bitsSquence, 2);
};

export default binaryToDecimal;
