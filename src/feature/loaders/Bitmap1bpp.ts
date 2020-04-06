import { padImageData, createBitmapFile } from '../../tools/bitmap';

class Bitmap1bppLoader {}

const width = 8;
const height = 6;
const colorTable = Buffer.from([
  0xff,
  0x00,
  0xff,
  0x00,
  0x00,
  0xff,
  0xff,
  0x00
]);

const imageData = padImageData({
  unpaddedImageData: Buffer.from([
    0b00000000,
    0b00111100,
    0b01000010,
    0b00000000,
    0b00100100,
    0b00000000
  ]),
  width,
  height
});

await createBitmapFile({
  filename: 'smiley.bmp',
  imageData,
  width,
  height,
  bitsPerPixel: 1,
  colorTable
});
