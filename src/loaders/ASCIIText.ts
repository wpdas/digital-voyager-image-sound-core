import ILoader from './ILoader';
import Header from './utils/Header';
import EncodedOutput from './utils/EncodedOutput';
import { loadersTypeId, TYPE_ID_BYTE_SIZE } from '../constants';
import asciiToBytes from '../core/asciiToBytes';
import bytesToAscii from '../core/bytesToAscii';

class ASCIIText implements ILoader<string, null, void> {
  public header: Header = new Header(loadersTypeId.ASCII_TEXT);

  /**
   * ASCIIText Loader - encoder and decoder. You can use it for handle with
   * ascii characters.
   *
   * The header is storing one parameter:
   * typeId: 1 byte
   */
  constructor() {}

  /**
   * Converts ASCII-UTF8 text to bits
   * @param text ASCII text format (UTF8)
   */
  encode(text: string): EncodedOutput {
    let asciiByteArray = asciiToBytes(text);
    return new EncodedOutput(this.header, asciiByteArray);
  }

  /**
   * Converts bytes containing ASCII-UTF8 characters data to ASCII format itself
   * @param bytes bytes containing the data
   */
  decode(bytes: Uint8Array) {
    // Check typeId
    const typeId = bytes[0];
    if (typeId !== this.header.getHeaderTypeId()) {
      throw new Error(
        'This is not a audio file generated by ASCIIText loader.'
      );
    }

    // ASCII byte array
    const asciiDataByteArray: Array<number> = [];
    bytes.slice(1).forEach((byte) => asciiDataByteArray.push(byte));

    return bytesToAscii(asciiDataByteArray);
  }

  /**
   * Get only sample data from bytes. Bytes must be delivered by Reader
   * @param bytes bytes containing the data
   */
  getSampleData(bytes: Uint8Array) {
    return bytes.slice(TYPE_ID_BYTE_SIZE);
  }

  decodeChunk() {}
}

export default ASCIIText;
