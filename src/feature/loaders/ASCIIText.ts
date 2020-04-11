/**
 * Copied from https://gist.githubusercontent.com/belohlavek/90771ccccb11100e76d1/raw/06d884a90f37d918c2f8e815c072cbbf622d514d/binaryUtil.js
 * and adapted to this project.
 */

import ILoader from './ILoader';
import Header from './utils/Header';
import EncodeOutput from './utils/EncodeOutput';
import loadersTypesId from 'loadersTypesId';
import { TYPE_ID_BITS_SIZE } from '../../constants';
import asciiToBits from 'core/asciiToBits';
import bitsToAscii from 'core/bitsToAscii';
import readBitsChunk from 'core/readBitsChunk';

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
    let result = asciiToBits(text);
    return new EncodeOutput(this.header, result);
  }

  /**
   * Converts bits containing ASCII-UTF8 characters data to ASCII format itself
   * @param bitsSequence Bits
   */
  decode(bitsSequence: string) {
    // Get only data bits without header information
    const result = bitsToAscii(
      readBitsChunk(bitsSequence, null, TYPE_ID_BITS_SIZE)
    );
    return result;
  }
}

export default ASCIIText;
