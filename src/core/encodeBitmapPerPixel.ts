import bmp from 'bmp-js';
import { DEFAULT_BITS_DEPTH } from '../constants';
import Header from '../loaders/utils/Header';
import EncodedOutput from '../loaders/utils/EncodedOutput';
import sliceTextInChunks from './sliceTextInChunks';
import decimalToBinary from './decimalToBinary';
import binaryToDecimal from './binaryToDecimal';
import hexToBpp from './hexToBpp';
import numberToUint8 from './numberToUint8';

/**
 * Encodes bitmap data using any bit depth less than 8 bits
 *
 * @param imageBuffer 24 bits Bitmap buffer
 */
const encodeBitmapPerPixel = (
  imageBuffer: Buffer,
  header: Header,
  bitsPerPixel: number
) => {
  const bmpData = bmp.decode(imageBuffer);
  const { width, height } = bmpData;

  // Header
  const widthBits = numberToUint8(width, 2); // 2 bytes
  const heightBits = numberToUint8(height, 2); // 2 bytes
  header.addBytes(widthBits);
  header.addBytes(heightBits);

  // Get image pixels buffer
  const imageData = bmpData.getData();
  const bitmapByteArray: Array<number> = [];

  // Shold store complete byte (8 bits).
  // before of it be stored.
  let colorBits = '';

  // Stores only the red as factor to grey scale
  for (let y = 3; y < imageData.length; y += 4) {
    colorBits += decimalToBinary(
      hexToBpp(imageData.readUInt8(y), bitsPerPixel),
      bitsPerPixel
    );
  }

  // Converts each 8 bits to decimal value to be stored
  const colorBytes = sliceTextInChunks(
    colorBits,
    DEFAULT_BITS_DEPTH,
    '',
    true,
    '0'
  );

  colorBytes.forEach((byteInBits) => {
    bitmapByteArray.push(binaryToDecimal(byteInBits));
  });

  return new EncodedOutput(header, bitmapByteArray);
};

export default encodeBitmapPerPixel;
