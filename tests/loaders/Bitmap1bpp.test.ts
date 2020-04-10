// import { createReadStream } from 'fs';
import { promises, writeFile } from 'fs';

import Bitmap1bpp from '../../src/feature/loaders/Bitmap1bpp';
// import HexColor, { Colors } from '../../src/feature/loaders/utils/HexColor';
import { readBitmapFile } from '../../src/tools/bitmap';
import decimalToBinary from '../../src/core/decimalToBinary';
import EncodeOutput from '../../src/feature/loaders/utils/EncodeOutput';

// {
//     fileHeader: { filesize: 86, imageDataOffset: 62 },
//     dibHeader: {
//       headerLength: 40,
//       headerType: 'BITMAPINFOHEADER',
//       width: 8,
//       height: 6,
//       bitsPerPixel: 1,
//       compressionType: 0,
//       bitmapDataSize: 24,
//       numberOfColorsInPalette: 2,
//       numberOfImportantColors: 0
//     },
//     imageData: <Buffer 00 00 00 00 3c 00 00 00 42 00 00 00 00 00 00 00 24 00 00 00 00 00 00 00>,
//     colorTable: <Buffer 00 00 00 00 00 00 ff 00>
//   }

describe('Bitmap1bpp', () => {
  // test('Encode and decode', () => {
  //   const loader: Bitmap1bpp = new Bitmap1bpp();
  //   const imageBits = '000000000011110001000010000000000010010000000000';
  //   // const imageBits = '1111111100011000001001000100001010000001';
  //   // const imageBits = '1111111100000000';
  //   loader.encode(
  //     imageBits,
  //     8,
  //     6,
  //     new HexColor(Colors.black),
  //     new HexColor(Colors.red)
  //   );
  // });

  test('Encode and decode', async (done) => {
    // createReadStream('test.bmp')
    // .on('data', bufferChunk => {
    //   //
    // })
    const loader: Bitmap1bpp = new Bitmap1bpp();
    const bmpBuffer = await promises.readFile('test.bmp');
    const bitmapMessage: EncodeOutput = loader.encode(bmpBuffer);
    console.log(bitmapMessage.bits);

    const bitmapBuffer: Buffer = loader.decode(bitmapMessage.bits);

    writeFile('decoded.bmp', bitmapBuffer, (_) => {
      console.log('Done');
      done();
    });
  });
});
