/**
 * Adjusts bits that has less than 8 chars to have 8 chars putting
 * null bit (0) at the beginning of the sequence
 * @param bits Sequence of bits to be adjusted
 * @return bits with 8 characters
 */
const forceBitsSize = (bits: string, bitsSize: number) => {
  if (bits.length > bitsSize) {
    throw new Error(`The max size of bits allowed is ${bitsSize}.`);
  }

  return (
    Array(bitsSize - bits.length)
      .fill('0')
      .join('') + bits
  );
};

export default forceBitsSize;
