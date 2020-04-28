import bmp from 'bmp-js';
import ILoader from './ILoader';
import Header from './utils/Header';
import EncodedOutput from './utils/EncodedOutput';
import {
  sliceTextInChunks,
  decimalToBinary,
  readBitsChunk,
  binaryToDecimal,
  checkTypeId,
} from '@voyager-edsound/core';
import { TYPE_ID_BITS_SIZE, loadersTypeId } from '@voyager-edsound/constants';

class Bitmap implements ILoader<Buffer> {
  public header: Header = new Header(loadersTypeId.BITMAP);

  /**
   * Bitmap Loader - encoder and decoder. There is a usefull
   * method that can help you creating a bitmap buffer and then save it as a file, it is
   * `createBitmapBuffer(...)` method.
   *
   * The header is storing one parameter:
   * typeId: 8 bits
   * width: 16 bits
   * height: 16 bits
   * imageBits: infinity (the rest of bits)
   */
  constructor() {}

  /**
   * Get a 24 bits bitmap and converts it to 24 bits per pixel (RGB color, ignoring alpha)
   * format and generates the bits to be stored on audio.
   *
   * @param imageBuffer 24 bits Bitmap buffer
   */
  encode(imageBuffer: Buffer): EncodedOutput {
    let output = '';
    const bmpData = bmp.decode(imageBuffer);
    const { width, height } = bmpData;

    // Header
    const widthBits = decimalToBinary(width, 16); // 16 bits
    const heightBits = decimalToBinary(height, 16); // 16 bits
    this.header.addBits(widthBits);
    this.header.addBits(heightBits);

    // Convert image data to bits (Buffer)
    const imageData = bmpData.getData();
    for (let y = 1; y < imageData.length; y++) {
      // Ignore the QUAD bits
      if (y % 4 !== 0) {
        output += decimalToBinary(imageData.readUInt8(y));
      }
    }

    return new EncodedOutput(this.header, output);
  }

  /**
   * Decodes the Bitmap information and return a Bitmap 24 bits per pixel buffer (RGB color).
   * However, the final decoded file will be a 24 Bitmap file.
   * @param bitsSequence Bits
   */
  decode(bitsSequence: string) {
    // Check typeId
    const typeIdCheck = checkTypeId(
      bitsSequence,
      this.header.getHeaderTypeId()
    );
    if (typeIdCheck !== null && typeIdCheck === false) {
      throw new Error('This is not a audio file containing Bitmap bits.');
    }

    const additionalHeaderBits = 32;
    const headerBitsSize = TYPE_ID_BITS_SIZE + additionalHeaderBits;
    let output: Buffer;

    let width: number; // 16 bits
    let height: number; // 16 bits
    let imageBits: string; // Rest of Bits

    // Read after have enough bits loaded to read the header bits
    if (bitsSequence.length >= headerBitsSize) {
      width = binaryToDecimal(
        readBitsChunk(bitsSequence, 16, TYPE_ID_BITS_SIZE)
      );
      height = binaryToDecimal(
        readBitsChunk(bitsSequence, 16, TYPE_ID_BITS_SIZE + 16)
      );

      imageBits = readBitsChunk(
        bitsSequence,
        null,
        TYPE_ID_BITS_SIZE + additionalHeaderBits
      );

      // Convert bits to buffer with image data
      let imageDataBitsArray = sliceTextInChunks(imageBits, 8, '0b');

      // Add the QUAD bits
      const imageDataWithQuad: string[] = [];
      for (let y = 0; y < imageDataBitsArray.length; y++) {
        if (y % 3 === 0) {
          imageDataWithQuad.push('0b00000000');
        }
        imageDataWithQuad.push(imageDataBitsArray[y]);
      }

      const bmpData = {
        data: Buffer.from(imageDataWithQuad),
        width,
        height,
      };

      const rawData = bmp.encode(bmpData);

      output = rawData.data;
    } else {
      output = Buffer.alloc(0);
    }

    return output;
  }
}

export default Bitmap;
