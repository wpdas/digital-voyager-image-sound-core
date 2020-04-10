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

class Bitmap1bpp implements ILoader<Buffer> {
  public header: Header = new Header(loadersTypesId.BITMAP_1BPP);

  constructor() {}

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

  decode(bitsSequence: string) {
    const additionalHeaderBits = 128;
    const headerBitsSize = TYPE_ID_BITS_SIZE + additionalHeaderBits;
    let output: Buffer;

    let widthBits: number; // 16 bits
    let heightBits: number; // 16 bits
    let colorOneBits: HexColor; // 48 Bits
    let colorTwoBits: HexColor; // 48 Bits
    let imageBits: string; // Rest of Bits

    // (!) Adicionar um verificador de typeId em cada loader

    // Read after have enough bits loaded to read the header bits
    if (bitsSequence.length >= headerBitsSize) {
      widthBits = binaryToDecimal(
        readBitsChunk(bitsSequence, 16, TYPE_ID_BITS_SIZE)
      );
      heightBits = binaryToDecimal(
        readBitsChunk(bitsSequence, 16, TYPE_ID_BITS_SIZE + 16)
      );

      colorOneBits = new HexColor(
        '#' +
          bitsToAscii(readBitsChunk(bitsSequence, 48, TYPE_ID_BITS_SIZE + 32))
      );
      colorTwoBits = new HexColor(
        '#' +
          bitsToAscii(readBitsChunk(bitsSequence, 48, TYPE_ID_BITS_SIZE + 80))
      );
      imageBits = readBitsChunk(bitsSequence, null, TYPE_ID_BITS_SIZE + 128);

      const colorTable: Buffer = Buffer.from([
        colorOneBits.BLUE,
        colorOneBits.GREEN,
        colorOneBits.RED,
        0x00,
        colorTwoBits.BLUE,
        colorTwoBits.GREEN,
        colorTwoBits.RED,
        0x00,
      ]);

      const imageData = padImageData({
        unpaddedImageData: Buffer.from(
          sliceTextInChunks(imageBits, widthBits, '0b')
        ),
        width: widthBits,
        height: heightBits,
      });

      output = createBitmapBuffer({
        imageData,
        width: widthBits,
        height: heightBits,
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
