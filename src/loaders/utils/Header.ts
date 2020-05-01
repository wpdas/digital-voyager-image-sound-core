interface IHeader {
  readonly getHeaderBytes: () => Array<number>;
  readonly getHeaderTypeId: () => number;
}

class Header implements IHeader {
  private typeId: number;
  private additionalParams: Array<number> = [];

  /**
   * Create the Header content
   * @param {number} typeId Content type. Should be specified so that, the Reader
   * will be able to know how to handle with the bits. This is the most basic
   * information needed. More can be passed using the additional parameter.
   * @param {Array<string>} additionalParams Pass addional header parameters to be stored.
   * This can be used to store data like width, height, etc.
   */
  constructor(typeId: number, additionalParams?: Array<number>) {
    this.typeId = typeId;
    if (additionalParams != null) {
      this.additionalParams.concat(additionalParams);
    }
  }

  /**
   * Get the Header bytes
   */
  getHeaderBytes = () => {
    const headerBytes = [this.typeId];
    return headerBytes.concat(this.additionalParams);
  };

  /**
   * Get typeId data from Header.
   * @return typeId data in decimal number format. e.g.: 29
   */
  getHeaderTypeId = () => this.typeId;

  /**
   * Add bytes to the header
   * @param Bytes Bytes to be stored on Header as a additional parameter. Must be a multiple of 8 bits
   */
  addBytes = (bytes: Array<number>) => {
    this.additionalParams = this.additionalParams.concat(bytes);
  };
}

export default Header;
