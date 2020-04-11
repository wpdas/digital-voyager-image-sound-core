import { DEFAULT_BITS_DEPTH } from '../constants';

/**
 * Converts ASCII-UTF8 text to bits
 * @param text ASCII text format (UTF8)
 */
const asciiToBits = (text: string) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const bin = text[i].charCodeAt(0).toString(2);
    if (DEFAULT_BITS_DEPTH - bin.length + 1 < 1) {
      throw new Error(
        `Invalid characters. You must use only ASCII characters. Check the ASCII characters table here: https://www.rapidtables.com/code/text/ascii-table.html`
      );
    }
    result += Array(DEFAULT_BITS_DEPTH - bin.length + 1).join('0') + bin;
  }
  return result;
};

export default asciiToBits;
