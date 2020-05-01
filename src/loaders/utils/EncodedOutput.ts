import Header from './Header';

interface IEncodedOutput {
  readonly bytes: Uint8Array;
}

class EncodedOutput implements IEncodedOutput {
  private finalBytes: Array<number>;

  /**
   * Creates an output with the final bits information
   * @param header The Loader Header
   * @param byteArray The ouput bits
   */
  constructor(header: Header, byteArray: Array<number>) {
    this.finalBytes = header.getHeaderBytes().concat(byteArray);
  }

  /**
   * Output bytes
   */
  public get bytes(): Uint8Array {
    const output = new Uint8Array(this.finalBytes);
    return output;
  }
}

export default EncodedOutput;
