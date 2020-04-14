/**
 * Copied from https://gist.githubusercontent.com/belohlavek/90771ccccb11100e76d1/raw/06d884a90f37d918c2f8e815c072cbbf622d514d/binaryUtil.js
 * and adapted to this project.
 */

import ILoader from './ILoader';
import Header from './utils/Header';
import EncodedOutput from './utils/EncodedOutput';
import { TYPE_ID_BITS_SIZE, loadersTypeId } from '@voyager-edsound/constants';
import {
  asciiToBits,
  bitsToAscii,
  readBitsChunk,
  checkTypeId,
} from '@voyager-edsound/core';

class ASCIIText implements ILoader<string> {
  public header: Header = new Header(loadersTypeId.ASCII_TEXT);

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
  encode(text: string): EncodedOutput {
    let result = asciiToBits(text);
    return new EncodedOutput(this.header, result);
  }

  /**
   * Converts bits containing ASCII-UTF8 characters data to ASCII format itself
   * @param bitsSequence Bits
   */
  decode(bitsSequence: string) {
    // Check typeId
    const typeIdCheck = checkTypeId(
      bitsSequence,
      this.header.getHeaderTypeId()
    );
    if (typeIdCheck !== null && typeIdCheck === false) {
      throw new Error(
        'This is not a audio file generated by ASCIIText loader.'
      );
    }

    // Get only data bits without header information
    const result = bitsToAscii(
      readBitsChunk(bitsSequence, null, TYPE_ID_BITS_SIZE)
    );
    return result;
  }
}

export default ASCIIText;