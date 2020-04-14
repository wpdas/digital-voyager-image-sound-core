import { promises } from 'fs';
import Bitmap2bitspp from '@voyager-edsound/loaders/Bitmap2bitspp';
import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';

import { calibrationCircleBmp } from '@voyager-edsound/tests/mocks';

describe('Bitmap2bitspp', () => {
  test('Encode and decode', async (done) => {
    const loader: Bitmap2bitspp = new Bitmap2bitspp();
    const bmpBuffer: Buffer = await promises.readFile(
      calibrationCircleBmp.bmpFile
    );
    const encodedBits = loader.encode(bmpBuffer).bits;
    const decodedBuffer: Buffer = loader.decode(encodedBits);

    expect(bmpBuffer.length).toBe(81054);
    expect(decodedBuffer.length).toBe(81054);
    done();
  });

  test('Encode, decode and save as bitmap', async (done) => {
    const recorder: Recorder = new Recorder();
    const reader: Reader = new Reader();

    const loader: Bitmap2bitspp = new Bitmap2bitspp();
    const bmpBuffer = await promises.readFile(calibrationCircleBmp.bmpFile);
    const bEncoded = loader.encode(bmpBuffer).bits;

    recorder.writeBits(bEncoded);
    await recorder.endWithFile(
      calibrationCircleBmp.bmpFile + 'bitmap2bitspp.wav'
    );

    // Read bits from wav file, decode it and...
    const fileBits = await reader.getBitsFromFile(
      calibrationCircleBmp.bmpFile + 'bitmap2bitspp.wav'
    );
    const decodedBuffer = loader.decode(fileBits);
    // ... save the buffer as Bmp file
    await promises.writeFile(
      calibrationCircleBmp.bmpFile + 'bitmap2bitspp.bmp',
      decodedBuffer
    );
    // Delete generated wav
    await promises.unlink(calibrationCircleBmp.bmpFile + 'bitmap2bitspp.wav');
    // Delete generated bmp at the end of the process
    await promises.unlink(calibrationCircleBmp.bmpFile + 'bitmap2bitspp.bmp');
    expect(bEncoded.length).toBe(fileBits.length);
    done();
  });
});