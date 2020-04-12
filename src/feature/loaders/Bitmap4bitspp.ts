import bmp from 'bmp-js';
import ILoader from './ILoader';
import Header from './utils/Header';
import loadersTypesId from 'loadersTypesId';
import EncodeOutput from './utils/EncodeOutput';
import { TYPE_ID_BITS_SIZE } from '../../constants';
import sliceTextInChunks from 'core/sliceTextInChunks';
import decimalToBinary from 'core/decimalToBinary';
import readBitsChunk from 'core/readBitsChunk';
import binaryToDecimal from 'core/binaryToDecimal';
import checkTypeId from 'core/checkTypeId';
import hexToBpp from 'core/hexToBpp';
import bppToHex from 'core/bppToHex';

class Bitmap4bitspp implements ILoader<Buffer> {
  private BPP = 4;
  public header: Header = new Header(loadersTypesId.BITMAP_4BITS_PP);

  /**
   * Bitmap4bytepp Loader - encoder and decoder. This will take only 1 byte of color and
   * generate a bitmap with 24 bytes containing the gray factor. The encoded
   * data will store only 1 byte per pixel.
   *
   * The header is storing one parameter:
   * typeId: 8 bits
   * width: 16 bits
   * height: 16 bits
   * imageBits: infinity (the rest of bits)
   */
  constructor() {}

  /**
   * Get Bitmap 1 bit per pixel format and generates the bits to be stored on audio.
   *
   * This will store only 1 byte per pixel
   *
   * @param imageBuffer Bitmap 1 bit per pixel buffer
   */
  encode(imageBuffer: Buffer): EncodeOutput {
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
    // Stores only the red as factor to grey scale
    for (let y = 3; y < imageData.length; y += 4) {
      output += decimalToBinary(
        hexToBpp(imageData.readUInt8(y), this.BPP),
        this.BPP
      );
    }

    return new EncodeOutput(this.header, output);
  }

  /**
   * Decodes the Bitmap information and return a Bitmap 1 bit per pixel buffer
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
      let imageDataBitsArray = sliceTextInChunks(imageBits, this.BPP);

      // Add the QUAD bits and BLUE, GREEN and RED as the factor saved on the encode
      const imageDataWithQBGR: number[] = [];
      for (let y = 0; y < imageDataBitsArray.length; y++) {
        // The fusion of these data will generate gray scale according
        // to the factor registered on imageDataBitsArray[y]
        const color = bppToHex(
          binaryToDecimal(imageDataBitsArray[y]),
          this.BPP
        );
        imageDataWithQBGR.push(
          0, // QUAD
          color, // BLUE
          color, // GREEN
          color // RED
        );
      }

      const bmpData = {
        data: Buffer.from(imageDataWithQBGR),
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

export default Bitmap4bitspp;
