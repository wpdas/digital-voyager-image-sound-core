/**
 * Converts bits containing ASCII-UTF8 characters data to ASCII format itself
 * @param bitsSquence Bits
 *
 * Check example here: https://gist.github.com/eyecatchup/6742657
 */
const bitsToAscii = (bitsSquence: string) => {
  return bitsSquence.replace(/\s*[01]{8}\s*/g, function (bin) {
    return String.fromCharCode(parseInt(bin, 2));
  });
};

export default bitsToAscii;
