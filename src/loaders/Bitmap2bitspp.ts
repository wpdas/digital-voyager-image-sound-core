import ILoader from './ILoader';
import Header from './utils/Header';
import EncodedOutput from './utils/EncodedOutput';
import { loadersTypeId, TYPE_ID_BYTE_SIZE } from '../constants';
import encodeBitmapPerPixel from '../core/encodeBitmapPerPixel';
import decodeBitmapPerPixel from '../core/decodeBitmapPerPixel';
import decimalToBinary from '../core/decimalToBinary';
import sliceTextInChunks from '../core/sliceTextInChunks';
import bppToHex from '../core/bppToHex';
import binaryToDecimal from '../core/binaryToDecimal';

interface DecodeChunkProps {
  data: Uint8ClampedArray;
  imageData: Uint8Array;
  bytesChunk: number;
}

class Bitmap2bitspp implements ILoader<Buffer, DecodeChunkProps, void> {
  private BPP = 2;
  public header: Header = new Header(loadersTypeId.BITMAP_2BITS_PP);

  /**
   * Bitmap2bitspp Loader - encoder and decoder. This will take only 1 byte of color and
   * generate a bitmap with 24 bytes containing the gray factor. The encoded
   * data will store only 2 bits per pixel.
   *
   * The header is storing one parameter:
   * typeId: 1 byte
   * width: 2 bytes
   * height: 2 bytes
   * imageBits: infinity (the rest of bits)
   */
  constructor() {}

  /**
   * Get a 24 bits bitmap and converts it to 2 bits per pixel (4 grey tons)
   * format and generates the bits to be stored on audio.
   *
   * @param imageBuffer 24 bits Bitmap buffer
   */
  encode(imageBuffer: Buffer): EncodedOutput {
    return encodeBitmapPerPixel(imageBuffer, this.header, this.BPP);
  }

  /**
   * Decodes the Bitmap information and return a Bitmap 2 bits per pixel buffer (4 tons of grey).
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

  /**
   * Get only sample data from bytes. Bytes can be delivered by Reader
   * @param bytes bytes containing the data
   */
  getSampleData(bytes: Uint8Array) {
    const additionalHeaderBits = 4;
    const headerBitsSize = TYPE_ID_BYTE_SIZE + additionalHeaderBits;
    return bytes.slice(headerBitsSize);
  }

  private position = 0;
  private groupPosition = 0;

  /**
   * Process every file bytes and converts each value to an RGBA (integers in the range 0 to 255) that'll
   * be put into a slot of a imageData (Uint8ClampedArray). Each 4 slots represents an RGBA pixel.
   *
   * @param data one-dimensional array containing the data in RGBA order, as integers in the range 0 to 255. This is provided by a Canvas context.
   * @param imageData Bitmap wav data
   * @param bytesChunk The amount of bytes that must be read in this cycle
   */
  decodeChunk({ data, imageData, bytesChunk }: DecodeChunkProps) {
    for (let i = 0; i < bytesChunk; i++) {
      const imageDataPixelsInfo = imageData[this.position];
      const imageDataGroup = sliceTextInChunks(
        decimalToBinary(imageDataPixelsInfo),
        this.BPP
      );

      for (let d = 0; d < imageDataGroup.length; d++) {
        const colorFactor = bppToHex(
          binaryToDecimal(imageDataGroup[d]),
          this.BPP
        );

        data[this.groupPosition * 4] = colorFactor;
        data[this.groupPosition * 4 + 1] = colorFactor;
        data[this.groupPosition * 4 + 2] = colorFactor;
        data[this.groupPosition * 4 + 3] = 255;

        this.groupPosition++;
      }
      this.position++;
    }
  }
}

export default Bitmap2bitspp;
