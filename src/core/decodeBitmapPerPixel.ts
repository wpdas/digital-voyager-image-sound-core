import bmp from 'bmp-js';
import {
  TYPE_ID_BYTE_SIZE,
  DEFAULT_BITS_DEPTH,
} from '@voyager-edsound/constants';
import {
  sliceTextInChunks,
  decimalToBinary,
  binaryToDecimal,
  bppToHex,
  uint8ToNumber,
} from './index';

/**
 * Decodes bitmap data using any bit depth less than 8 bits
 * @param bytes bytes containing the data
 */
const decodeBitmapPerPixel = (bytes: Uint8Array, bitsPerPixel: number) => {
  const additionalHeaderBytes = 4;
  const headerBitsSize = TYPE_ID_BYTE_SIZE + additionalHeaderBytes;

  let output: Buffer;
  let width: number; // 2 bytes
  let height: number; // 2 bytes
  let imageBits: string = ''; // Rest of Bits

  // Read after have enough bytes loaded to read the header bytes
  if (bytes.length >= headerBitsSize) {
    width = uint8ToNumber([bytes[1], bytes[2]]);
    height = uint8ToNumber([bytes[3], bytes[4]]);

    // Transform byte to bits
    bytes
      .slice(headerBitsSize)
      .forEach(
        (byte) => (imageBits += decimalToBinary(byte, DEFAULT_BITS_DEPTH))
      );

    // Get group bits
    const imageDataBitsArray = sliceTextInChunks(imageBits, bitsPerPixel);

    // Add the QUAD bits and BLUE, GREEN and RED as the factor saved on the encode
    const imageDataWithQBGR: number[] = [];
    for (let y = 0; y < imageDataBitsArray.length; y++) {
      // The fusion of these data will generate gray scale according
      // to the factor registered on imageDataBitsArray[y]
      const color = bppToHex(
        binaryToDecimal(imageDataBitsArray[y]),
        bitsPerPixel
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
};

export default decodeBitmapPerPixel;
