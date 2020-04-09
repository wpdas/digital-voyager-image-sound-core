/**
 * Copied from https://gist.githubusercontent.com/belohlavek/90771ccccb11100e76d1/raw/06d884a90f37d918c2f8e815c072cbbf622d514d/binaryUtil.js
 * and adapted to this project.
 */

import ILoader from './ILoader';
import Header from './utils/Header';
import EncodeOutput from './utils/EncodeOutput';
import loadersTypesId from 'loadersTypesId';
import { DEFAULT_BITS_DEPTH, TYPE_ID_BITS_SIZE } from '../../constants';

class ASCIIText implements ILoader<string> {
  public header: Header = new Header(loadersTypesId.ASCII_TEXT);

  /**
   * ASCIIText Loader - encoder and decoder. You can use it for handle with
   * ascii characters. It's more than 50% (size and time) cheaper than `Alphanumeric` Loader.
   *
   * The header is storing one parameter:
   * typeId: 8 bits
   */
  constructor() {}

  /**
   * Converts ASCII-UTF8 text to bits
   * @param text ASCII text format (UTF8)
   */
  encode(text: string): EncodeOutput {
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
    return new EncodeOutput(this.header, result);
  }

  /**
   * Converts bits containing ASCII-UTF8 characters data to ASCII format itself
   * @param bitsSquence Bits
   */
  decode(bitsSquence: string) {
    // Get only data bits without header information
    const bitsWithoutHeader = bitsSquence.slice(TYPE_ID_BITS_SIZE);

    let result = '';
    const arr = bitsWithoutHeader.match(/.{1,8}/g) || [];
    for (var i = 0; i < arr.length; i++) {
      result += String.fromCharCode(parseInt(arr[i], 2));
    }
    return result;
  }
}

export default ASCIIText;
