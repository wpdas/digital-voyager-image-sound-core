import decimalToBinary from 'core/decimalToBinary';

interface IHeader {
  readonly getHeaderBits: () => string;
}

class Header implements IHeader {
  private typeId: string;
  private additionalParams: string = '';

  /**
   * Create the Header content
   * @param {number} typeId Content type. Should be specified so that, the Reader
   * will be able to know how to handle with the bits. This is the most basic
   * information needed. More can be passed using the additional parameter.
   * @param {Array<string>} additionalParams Pass addional header parameters to be stored.
   * This can be used to store data like width, height, etc. Must be multiple of 8 bits.
   */
  constructor(typeId: number, additionalParams?: Array<string>) {
    this.typeId = decimalToBinary(typeId, 1);

    // Check if there are additional params and if they are multiple of 8 bits.
    if (additionalParams != null) {
      const isValid = additionalParams.reduce((_, current) => {
        return current.length === 8;
      }, true);

      if (isValid) {
        this.additionalParams.concat(additionalParams.join());
      }
    }
  }

  getHeaderBits = () => this.typeId + this.additionalParams;
}

export default Header;
