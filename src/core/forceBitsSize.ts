/**
 * Adjusts bits that has less than the desired chars to have the desired chars putting
 * null bit (0) at the beginning of the sequence
 * @param bits Sequence of bits to be adjusted
 * @param bitsSize The desired bits size (amount of chars)
 * @param order Where the 0 bits should be put, FIRST = at the beginning, LAST = at the end
 * @return bits with N characters
 */
const forceBitsSize = (
  bits: string,
  bitsSize: number,
  order: string = 'FIRST'
) => {
  if (bits.length > bitsSize) {
    throw new Error(`The max size of bits allowed is ${bitsSize}.`);
  }

  const additional = Array(bitsSize - bits.length)
    .fill('0')
    .join('');

  let output = '';

  if (order === 'FIRST') {
    output = additional + bits;
  } else if (order === 'LAST') {
    output = bits + additional;
  }

  return output;
};

export default forceBitsSize;
