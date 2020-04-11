import ILoader from './ILoader';
import Header from './utils/Header';
import EncodeOutput from './utils/EncodeOutput';
import loadersTypesId from 'loadersTypesId';
import sliceTextInChunks from 'core/sliceTextInChunks';
import forceBitsSize from 'core/forceBitsSize';
import readBitsChunk from 'core/readBitsChunk';
import decimalToBinary from 'core/decimalToBinary';
import binaryToDecimal from 'core/binaryToDecimal';
import { DEFAULT_BITS_DEPTH, TYPE_ID_BITS_SIZE } from '../../constants';

class Alphanumeric implements ILoader<string> {
  public header: Header = new Header(loadersTypesId.ALPHANUMERIC);

  /**
   * Alphanumeric Loader - encoder and decoder. You can use it for handle with
   * global alphanumeric characters. If you'll use only ascii characters, use
   * the ASCIIText Loader instead. By doing this, you will reduce more than
   * 50% (size and time) of the final file size.
   *
   * The header is storing two parameters:
   * typeId: 8 bits
   * bitsPerChar: 8 bits
   */
  constructor() {}

  /**
   * A heavy process to get the bigger character in bits and
   * adjusts it to be multiple of 8.
   *
   * E.g.: if get 9 - 15, it will be changed to 16,
   * if 1 - 7, it will be changed to 8...
   * @param text
   */
  private getBiggerCharInBits(text: string) {
    let bigger = 0;

    for (let i = 0; i < text.length; i++) {
      const currentCharBits = text[i].charCodeAt(0).toString(2);
      if (currentCharBits.length > bigger) {
        bigger = currentCharBits.length;
      }
    }

    bigger = bigger - (bigger % DEFAULT_BITS_DEPTH) + DEFAULT_BITS_DEPTH;

    return bigger;
  }

  /**
   * Converts global alphanumeric characters content to bits.
   *
   * This was created to support almost all characters format. Can become heavy if using
   * characters different of ASCII format.
   *
   * @param text  Any alphanumeric content
   */
  public encode(text: string): EncodeOutput {
    const biggerCharInBits = this.getBiggerCharInBits(text);

    // Set the bitsPerChar (8 bits) parameter on Header
    this.header.addBits(decimalToBinary(biggerCharInBits, DEFAULT_BITS_DEPTH));

    let output = '';
    for (let i = 0; i < text.length; i++) {
      output += forceBitsSize(
        text[i].charCodeAt(0).toString(2),
        biggerCharInBits
      );
    }

    return new EncodeOutput(this.header, output);
  }

  /**
   * Converts bits containing global alphanumeric characters data to alphanumeric itself
   * @param bitsSquence Bits
   */
  public decode(bitsSquence: string) {
    let bitsPerChar = 0;
    let output = '';

    if (bitsSquence.length >= TYPE_ID_BITS_SIZE + DEFAULT_BITS_DEPTH) {
      // Read bitsPerChar from header and then, process the information
      bitsPerChar = binaryToDecimal(
        readBitsChunk(bitsSquence, TYPE_ID_BITS_SIZE, DEFAULT_BITS_DEPTH)
      );

      // Get only data bits without header information
      const bitsWithoutHeader = bitsSquence.slice(
        TYPE_ID_BITS_SIZE + DEFAULT_BITS_DEPTH
      );

      const arrayOfBytes = sliceTextInChunks(bitsWithoutHeader, bitsPerChar);

      for (let i = 0; i < arrayOfBytes.length; i++) {
        output += String.fromCharCode(parseInt(arrayOfBytes[i], 2));
      }
    }
    return output;
  }
}

export default Alphanumeric;
