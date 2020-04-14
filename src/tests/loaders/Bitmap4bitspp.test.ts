import { promises } from 'fs';
import Bitmap4bitspp from '@voyager-edsound/loaders/Bitmap4bitspp';
import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';

import { calibrationCircleBmp } from '@voyager-edsound/tests/mocks';

describe('', () => {
  test('Encode and decode', async (done) => {
    const loader: Bitmap4bitspp = new Bitmap4bitspp();
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

    const loader: Bitmap4bitspp = new Bitmap4bitspp();
    const bmpBuffer = await promises.readFile(calibrationCircleBmp.bmpFile);
    const bEncoded = loader.encode(bmpBuffer).bits;

    recorder.writeBits(bEncoded);
    await recorder.endWithFile(
      calibrationCircleBmp.bmpFile + 'bitmap4bitspp.wav'
    );

    // Read bits from wav file, decode it and...
    const fileBits = await reader.getBitsFromFile(
      calibrationCircleBmp.bmpFile + 'bitmap4bitspp.wav'
    );
    const decodedBuffer = loader.decode(fileBits);
    // ... save the buffer as Bmp file
    await promises.writeFile(
      calibrationCircleBmp.bmpFile + 'bitmap4bitspp.bmp',
      decodedBuffer
    );
    // Delete generated wav
    await promises.unlink(calibrationCircleBmp.bmpFile + 'bitmap4bitspp.wav');
    // Delete generated bmp at the end of the process
    await promises.unlink(calibrationCircleBmp.bmpFile + 'bitmap4bitspp.bmp');
    expect(bEncoded.length).toBe(fileBits.length);
    done();
  });
});
