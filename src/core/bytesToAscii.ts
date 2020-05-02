/**
 * Converts bytes containing ASCII-UTF8 characters data to ASCII format itself
 * @param bytes bytes containing the data
 *
 * Check example here: https://gist.github.com/eyecatchup/6742657
 */
const bytesToAscii = (bytes: Array<number>) => {
  return bytes.map((byte) => String.fromCharCode(byte)).join('');
};

export default bytesToAscii;
