import { promises } from 'fs';
import Bitmap24bitsTrueColor from '@voyager-edsound/loaders/Bitmap24bitsTrueColor';
import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';

import {
  calibrationCircleBmp,
  deleteFilesAfterTest,
} from '@voyager-edsound/tests/mocks';

describe('Bitmap', () => {
  test('Encode and decode', async (done) => {
    const loader: Bitmap24bitsTrueColor = new Bitmap24bitsTrueColor();
    const bmpBuffer: Buffer = await promises.readFile(
      calibrationCircleBmp.bmpFile
    );
    const encodedBits = loader.encode(bmpBuffer);
    const decodedBuffer: Buffer = loader.decode(encodedBits.bytes);

    expect(bmpBuffer.length).toBe(decodedBuffer.length);
    done();
  });

  test('Encode, decode and save as bitmap)', async (done) => {
    const recorder: Recorder = new Recorder();
    const reader: Reader = new Reader();

    const loader: Bitmap24bitsTrueColor = new Bitmap24bitsTrueColor();
    const bmpBuffer = await promises.readFile(calibrationCircleBmp.bmpFile);
    const bEncoded = loader.encode(bmpBuffer);

    recorder.writeBytes(bEncoded);
    await recorder.endWithFile(
      calibrationCircleBmp.bmpFile + 'Bitmap24bitsTrueColor.wav'
    );

    // Read bits from wav file, decode it and...
    const fileBytes = await reader.getBytesFromFile(
      calibrationCircleBmp.bmpFile + 'Bitmap24bitsTrueColor.wav'
    );
    const decodedBuffer = loader.decode(fileBytes);
    // ... save the buffer as Bmp file
    await promises.writeFile(
      calibrationCircleBmp.bmpFile + 'Bitmap24bitsTrueColor.bmp',
      decodedBuffer
    );
    // Delete generated wav
    if (deleteFilesAfterTest) {
      await promises.unlink(
        calibrationCircleBmp.bmpFile + 'Bitmap24bitsTrueColor.wav'
      );
      // Delete generated bmp at the end of the process
      await promises.unlink(
        calibrationCircleBmp.bmpFile + 'Bitmap24bitsTrueColor.bmp'
      );
    }
    expect(bEncoded.bytes.length).toBe(fileBytes.length);
    done();
  }, 10000);
});
