import ILoader from './ILoader';
import Header from './utils/Header';
import EncodedOutput from './utils/EncodedOutput';
import { loadersTypeId } from '@voyager-edsound/constants';
import {
  encodeBitmapPerPixel,
  decodeBitmapPerPixel,
} from '@voyager-edsound/core';

class Bitmap4bitspp implements ILoader<Buffer> {
  private BPP = 4;
  public header: Header = new Header(loadersTypeId.BITMAP_4BITS_PP);

  /**
   * Bitmap4bytepp Loader - encoder and decoder. This will take only 1 byte of color and
   * generate a bitmap with 24 bytes containing the gray factor. The encoded
   * data will store only 4 bits per pixel.
   *
   * The header is storing one parameter:
   * typeId: 1 byte
   * width: 2 bytes
   * height: 2 bytes
   * imageBits: infinity (the rest of bits)
   */
  constructor() {}

  /**
   * Get a 24 bits bitmap and converts it to 4 bits per pixel (16 grey tons)
   * format and generates the bits to be stored on audio.
   *
   * @param imageBuffer 24 bits Bitmap buffer
   */
  encode(imageBuffer: Buffer): EncodedOutput {
    return encodeBitmapPerPixel(imageBuffer, this.header, this.BPP);
  }

  /**
   * Decodes the Bitmap information and return a Bitmap 4 bits per pixel buffer (16 tons of grey).
   * However, the final decoded file will be a 24 Bitmap file.
   * @param bytes bytes containing the data
   */
  decode(bytes: Uint8Array) {
    // Check typeId
    const typeId = bytes[0];
    if (typeId !== this.header.getHeaderTypeId()) {
      throw new Error(
        'This is not a audio file generated by Bitmap4bitspp loader.'
      );
    }

    return decodeBitmapPerPixel(bytes, this.BPP);
  }
}

export default Bitmap4bitspp;
