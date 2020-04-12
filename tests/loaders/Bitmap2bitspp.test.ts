// Use https://online-converting.com/image/convert2bmp/# for get any bmp you want

import { promises, writeFile } from 'fs';
import Bitmap2bitspp from '../../src/feature/loaders/Bitmap2bitspp';
import { smileyBmp } from '../mocks';

describe('', () => {
  test('Encode, decode and store as bitmap', async (done) => {
    // const recorder: Recorder = new Recorder(smileyBmp.bmpFile + '.wav');
    // const reader: Reader = new Reader();

    const loader: Bitmap2bitspp = new Bitmap2bitspp();
    const bmpBuffer = await promises.readFile(smileyBmp.bmpFile);
    const bEncoded = loader.encode(bmpBuffer).bits;

    console.log(bEncoded.length);

    // On wav file created successfull
    // recorder.on('done', async () => {
    //   // Read bits from wav file, decode it and...
    //   const decodedBuffer = loader.decode(
    //     await reader.getBitsFromFile(smileyBmp.bmpFile + '.wav')
    //   );

    // ... save the buffer as Bmp file
    writeFile(
      smileyBmp.bmpFile + 'afterwav.bmp',
      // decodedBuffer,
      loader.decode(bEncoded),
      async (_) => {
        // Delete generated wav
        // await promises.unlink(smileyBmp.bmpFile + '.wav');
        // Delete generated bmp at the end of the process
        await promises.unlink(smileyBmp.bmpFile + 'afterwav.bmp');
        done();
      }
    );
    // });

    // recorder.writeBits(bEncoded);
    // recorder.end();
  });
});
