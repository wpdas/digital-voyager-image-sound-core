import path from 'path';
import { promises } from 'fs';

import DecimalNumber from '@voyager-edsound/loaders/DecimalNumber';
import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';
import EncodedOutput from '@voyager-edsound/loaders/utils/EncodedOutput';
import { deleteFilesAfterTest } from '../mocks';

describe('DecimalNumber', () => {
  test('Encode and Decode', () => {
    const loader: DecimalNumber = new DecimalNumber();

    const numberA = 29;
    const encodedData = loader.encode(numberA);
    expect(loader.decode(encodedData.bytes)).toBe(numberA);
  });

  test('Record and Read bits and show the final content', async (done) => {
    const outputFile = path.join(__dirname, 'output.wav');
    const recorder: Recorder = new Recorder();
    const reader: Reader = new Reader();
    const loader: DecimalNumber = new DecimalNumber();

    const valueTest = 65000;
    const message: EncodedOutput = loader.encode(valueTest);

    recorder.writeBytes(message);
    await recorder.endWithFile(outputFile);

    // Load the typeId from file Header, so that we can certify
    // we are using the properly Loader decoder
    const fileTypeId = await reader.loadFileHeaderTypeId(outputFile);
    expect(fileTypeId).toBe(loader.header.getHeaderTypeId());

    const bytes = await reader.getBytesFromFile(outputFile);
    const decodedMessage = loader.decode(bytes);
    expect(decodedMessage).toBe(valueTest);

    // Delete file
    if (deleteFilesAfterTest) {
      await promises.unlink(outputFile);
    }
    done();
  });
});
