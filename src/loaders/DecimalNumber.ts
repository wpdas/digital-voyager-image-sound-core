import ILoader from './ILoader';
import Header from './utils/Header';
import EncodedOutput from './utils/EncodedOutput';
import { loadersTypeId, TYPE_ID_BYTE_SIZE } from '../constants';
import numberToUint8 from '../core/numberToUint8';
import uint8ToNumber from '../core/uint8ToNumber';

class DecimalNumber implements ILoader<number, null, void> {
  public header: Header = new Header(loadersTypeId.DECIMAL_NUMBER);

  /**
   * DecimalNumber Loader - encoder and decoder. You can use it for handle with
   * decimal numbers (the common numbers we know as a human).
   *
   * The header is storing one parameter:
   * typeId: 1 byte
   */
  constructor() {}

  /**
   * Encodes decimal number
   *
   * @param {number} numberValue decimal number value
   * @returns {string}
   */
  public encode(numberValue: number) {
    const uint8Number = numberToUint8(numberValue);
    return new EncodedOutput(this.header, uint8Number);
  }

  /**
   * Converts bits containing decimal number data to decimal itself
   * @param bytes bytes containing the data with decimal number
   */
  public decode(bytes: Uint8Array) {
    // Check typeId
    const typeId = bytes[0];
    if (typeId !== this.header.getHeaderTypeId()) {
      throw new Error(
        'This is not a audio file generated by ASCIIText loader.'
      );
    }

    // Decimal byte array
    const decimalDataByteArray: Array<number> = [];
    bytes.slice(1).forEach((byte) => decimalDataByteArray.push(byte));

    return uint8ToNumber(decimalDataByteArray);
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

export default DecimalNumber;
