import ILoader from './ILoader';
import Header from './utils/Header';
import loadersTypesId from 'loadersTypesId';
import EncodeOutput from './utils/EncodeOutput';
import {
  createBitmapBuffer,
  padImageData,
  readBitmapDataFromBuffer,
} from 'tools/bitmap';
import HexColor from './utils/HexColor';
import { TYPE_ID_BITS_SIZE } from '../../constants';
import sliceTextInChunks from 'core/sliceTextInChunks';
import decimalToBinary from 'core/decimalToBinary';
import asciiToBits from 'core/asciiToBits';
import readBitsChunk from 'core/readBitsChunk';
import binaryToDecimal from 'core/binaryToDecimal';
import bitsToAscii from 'core/bitsToAscii';
import checkTypeId from 'core/checkTypeId';

class Bitmap1bpp implements ILoader<Buffer> {
  public header: Header = new Header(loadersTypesId.BITMAP_1BPP);

  /**
   * Bitmap1bpp Loader - encoder and decoder. This loader handle with bitmap that holds
   * 1 bit per pixel. Images that are generated with only two colors. There is a usefull
   * method that can help you creating a bitmap buffer and then save it as a file, it is
   * `createBitmapBuffer(...)` method.
   *
   * The header is storing one parameter:
   * typeId: 8 bits
   * width: 16 bits
   * height: 16 bits
   * color1: 48 bits
   * color2: 48 bits
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
  ): void {
    if (imageBits.length < width * height) {
      throw new Error(
        `Image bits are not enough to fill all the pixels. You must provide enough bits to fill the ${
          width + height
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
      unpaddedImageData: Buffer.from(sliceTextInChunks(imageBits, width, '0b')),
      width,
      height,
    });

    createBitmapBuffer({
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
    const bmpData = readBitmapDataFromBuffer(imageBuffer);

    // Check if the Bitmap have only 1 bit per pixel (this is a rule for 1bpp bitmap file)
    if (bmpData.dibHeader.bitsPerPixel > 1) {
      throw new Error('This is not a 1 bit per pixel Bitmap.');
    }

    const { width, height } = bmpData.dibHeader;

    const colorsBuffer: Buffer = bmpData.colorTable;
    const colorsHex = sliceTextInChunks(colorsBuffer.toString('hex'), 2);
    const color1 = colorsHex[2] + colorsHex[1] + colorsHex[0]; // store it without #
    const color2 = colorsHex[6] + colorsHex[5] + colorsHex[4];

    // Header
    const widthBits = decimalToBinary(width, 16); // 16 bits
    const heightBits = decimalToBinary(height, 16); // 16 bits

    const colorOneBits = asciiToBits(color1); // 48 Bits
    const colorTwoBits = asciiToBits(color2); // 48 Bits

    this.header.addBits(widthBits);
    this.header.addBits(heightBits);
    this.header.addBits(colorOneBits);
    this.header.addBits(colorTwoBits);

    // Convert image data to bits (Buffer)
    const { imageData } = bmpData;
    for (let y = 0; y < imageData.length; y += 4) {
      output += decimalToBinary(imageData.readInt8(y));
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
      throw new Error('This is not a audio file containing Bitmap1bpp bits.');
    }

    const additionalHeaderBits = 128;
    const headerBitsSize = TYPE_ID_BITS_SIZE + additionalHeaderBits;
    let output: Buffer;

    let width: number; // 16 bits
    let height: number; // 16 bits
    let color1: HexColor; // 48 Bits
    let color2: HexColor; // 48 Bits
    let imageBits: string; // Rest of Bits

    // Read after have enough bits loaded to read the header bits
    if (bitsSequence.length >= headerBitsSize) {
      width = binaryToDecimal(
        readBitsChunk(bitsSequence, 16, TYPE_ID_BITS_SIZE)
      );
      height = binaryToDecimal(
        readBitsChunk(bitsSequence, 16, TYPE_ID_BITS_SIZE + 16)
      );

      color1 = new HexColor(
        '#' +
          bitsToAscii(readBitsChunk(bitsSequence, 48, TYPE_ID_BITS_SIZE + 32))
      );
      color2 = new HexColor(
        '#' +
          bitsToAscii(readBitsChunk(bitsSequence, 48, TYPE_ID_BITS_SIZE + 80))
      );
      imageBits = readBitsChunk(bitsSequence, null, TYPE_ID_BITS_SIZE + 128);

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
          sliceTextInChunks(imageBits, width, '0b')
        ),
        width: width,
        height: height,
      });

      output = createBitmapBuffer({
        imageData,
        width: width,
        height: height,
        bitsPerPixel: 1,
        colorTable,
      });
    } else {
      output = Buffer.alloc(0);
    }

    return output;
  }
}

export default Bitmap1bpp;
