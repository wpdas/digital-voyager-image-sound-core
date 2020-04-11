import bmp from 'bmp-js';
import ILoader from './ILoader';
import Header from './utils/Header';
import loadersTypesId from 'loadersTypesId';
import EncodeOutput from './utils/EncodeOutput';
import { createBitmapBuffer, padImageData } from 'tools/bitmap';
import HexColor from './utils/HexColor';
import { TYPE_ID_BITS_SIZE, DEFAULT_BITS_DEPTH } from '../../constants';
import sliceTextInChunks from 'core/sliceTextInChunks';
import decimalToBinary from 'core/decimalToBinary';
import readBitsChunk from 'core/readBitsChunk';
import binaryToDecimal from 'core/binaryToDecimal';
import checkTypeId from 'core/checkTypeId';
import fixBits from 'core/fixBits';

class Bitmap implements ILoader<Buffer> {
  public header: Header = new Header(loadersTypesId.BITMAP);

  /**
   * Bitmap Loader - encoder and decoder. This loader handle with bitmap that holds
   * 1 bit per pixel. Images that are generated with only two colors. There is a usefull
   * method that can help you creating a bitmap buffer and then save it as a file, it is
   * `createBitmapBuffer(...)` method.
   *
   * Caution: Heavy process. It's better to use Base64Image instead.
   *
   * The header is storing one parameter:
   * typeId: 8 bits
   * width: 16 bits
   * height: 16 bits
   * imageBits: infinity (the rest of bits)
   */
  constructor() {}

  /**
   * Create a bitmap buffer. You can save it as a file then.
   * @param imageBits Image bits. 0 = one pixel colored with color 1; 1 = one pixel colored with color 2
   * @param width The image width
   * @param height The image height
   * @param color1 Hex color that represents bit 0. e.g.: new HexColor('#FF00FF'); The `Color` module can be usefull.
   * @param color2 Hex color that represents bit 1. e.g.: new HexColor('#FF00FF'); The `Color` module can be usefull.
   */
  createBitmapBuffer(
    imageBits: string,
    width: number,
    height: number,
    color1: HexColor,
    color2: HexColor
  ): Buffer {
    if (imageBits.length < width * height) {
      throw new Error(
        `Image bits are not enough to fill all the pixels. You must provide enough bits to fill the ${
          width * height
        } pixels.`
      );
    }

    const colorTable: Buffer = Buffer.from([
      color1.BLUE,
      color1.GREEN,
      color1.RED,
      0x00,
      color2.BLUE,
      color2.GREEN,
      color2.RED,
      0x00,
    ]);

    const imageData = padImageData({
      unpaddedImageData: Buffer.from(
        fixBits(imageBits, width, DEFAULT_BITS_DEPTH, '0b')
      ),
      width,
      height,
    });

    return createBitmapBuffer({
      imageData,
      width,
      height,
      bitsPerPixel: 1,
      colorTable,
    });
  }

  /**
   * Get Bitmap 1 bit per pixel format and generates the bits to be stored on audio.
   * @param imageBuffer Bitmap 1 bit per pixel buffer
   */
  encode(imageBuffer: Buffer): EncodeOutput {
    let output = '';
    const bmpData = bmp.decode(imageBuffer);
    const { width, height } = bmpData;

    // Check if the Bitmap have only 1 bit per pixel (this is a rule for 1bpp bitmap file)
    // if (bitPP > 1) {
    //   throw new Error('This is not a 1 bit per pixel Bitmap.');
    // }

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
