import Header from './Header';

interface IEncodedOutput {
  readonly bits: string;
}

class EncodedOutput implements IEncodedOutput {
  private _bits: string;

  /**
   * Creates an output with the final bits information
   * @param header The Loader Header
   * @param output The ouput bits
   */
  constructor(header: Header, output: string) {
    this._bits = header.getHeaderBits() + output;
  }

  /**
   * Output bits
   */
  public get bits(): string {
    return this._bits;
  }
}

export default EncodedOutput;