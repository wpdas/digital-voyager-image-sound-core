import { promises, writeFile } from 'fs';
import Bitmap from '../../src/feature/loaders/Bitmap';
import HexColor, { Colors } from '../../src/feature/loaders/utils/HexColor';
import Recorder from '../../src/feature/Recorder';
import Reader from '../../src/feature/Reader';
import { smileyBmp } from '../mocks';

describe('Bitmap', () => {
  test('Encode and decode', async (done) => {
    const loader: Bitmap = new Bitmap();
    const bmpBuffer: Buffer = await promises.readFile(smileyBmp.bmpFile);
    const encodedBits = loader.encode(bmpBuffer).bits;
    const decodedBuffer: Buffer = loader.decode(encodedBits);

    expect(bmpBuffer.length).toBe(86); // Original bmp buffer
    expect(decodedBuffer.length).toBe(198); // Final rendered by software bmp buffer
    done();
  });

  test('Bmp -> Wav -> Bmp (Encode and decode with file)', async (done) => {
    const recorder: Recorder = new Recorder(smileyBmp.bmpFile + '.wav');
    const reader: Reader = new Reader();

    const loader: Bitmap = new Bitmap();
    const bmpBuffer = await promises.readFile(smileyBmp.bmpFile);
    const bEncoded = loader.encode(bmpBuffer).bits;

    // On wav file created successfull
    recorder.on('done', async () => {
      // Read bits from wav file, decode it and...
      const decodedBuffer = loader.decode(
        await reader.getBitsFromFile(smileyBmp.bmpFile + '.wav')
      );

      // ... save the buffer as Bmp file
      writeFile(
        smileyBmp.bmpFile + 'afterwav.bmp',
        decodedBuffer,
        async (_) => {
          // Delete generated wav
          await promises.unlink(smileyBmp.bmpFile + '.wav');
          // Delete generated bmp at the end of the process
          await promises.unlink(smileyBmp.bmpFile + 'afterwav.bmp');
          done();
        }
      );
    });

    recorder.writeBits(bEncoded);
    recorder.end();
  });

  test('Create mono Bitmap buffer using 0 and 1', () => {
    const loader: Bitmap = new Bitmap();
    const imageBits = '1111111100011000001001000100001010000001';

    const myBitmapBuffer = loader.createBitmapBuffer(
      imageBits,
      8,
      5,
      new HexColor(Colors.black),
      new HexColor(Colors.yellow)
    );

    expect(myBitmapBuffer.length).toBe(82);
  });
});
