/**
 * Reads chunk of bits from a sequence of bits.
 * @param bits Bits to be read
 * @param length The number of bits to read. Will read til the end if null
 * @param position The offset from the beginning of the bits from which data should be read. If `null`, data will be read from the current position.
 */
const readBitsChunk = (
  bits: string,
  length?: number | null,
  position: number = 0
) => {
  if (length == null) {
    return bits.slice(position);
  }
  return bits.slice(position, position + length);
};

export default readBitsChunk;
