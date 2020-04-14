import path from 'path';
import { promises } from 'fs';

import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';
import Alphanumeric from '@voyager-edsound/loaders/Alphanumeric';
import EncodedOutput from '@voyager-edsound/loaders/utils/EncodedOutput';

describe('Alphanumeric', () => {
  test('Encode and decode text', () => {
    const loader: Alphanumeric = new Alphanumeric();
    const myPrettyText =
      'abcdefghijklmnopqrstuvwxz1234567890-=!@#$%ˆ&*()_+"<>[]/`±§çáàéèãõñúùÁÀÉÈÃÕÑÚÙ平仮名';

    const encoded: EncodedOutput = loader.encode(myPrettyText);
    const decoded = loader.decode(encoded.bits);
    expect(decoded).toBe(myPrettyText);
  });

  test('Record and Read bits and show the final content', async (done) => {
    const outputFile = path.join(__dirname, 'alphanumeric.wav');
    const recorder: Recorder = new Recorder();
    const reader: Reader = new Reader();
    const loader: Alphanumeric = new Alphanumeric();

    const myPrettyText =
      'abcdefghijklmnopqrstuvwxz1234567890-=!@#$%ˆ&*()_+"<>[]/`±§çáàéèãõñúùÁÀÉÈÃÕÑÚÙ平仮名';
    const message: EncodedOutput = loader.encode(myPrettyText);

    recorder.writeBits(message);
    await recorder.endWithFile(outputFile);

    // Load the typeId from file Header, so that we can certify
    // we are using the properly Loader decoder
    const fileTypeId = await reader.loadFileHeaderTypeId(outputFile);
    expect(fileTypeId).toBe(loader.header.getHeaderTypeId());

    const bits = await reader.getBitsFromFile(outputFile);
    expect(bits).toBe(message.bits);

    const decodedMessage = loader.decode(bits);
    expect(decodedMessage).toBe(myPrettyText);

    // Delete file
    await promises.unlink(outputFile);
    done();
  });
});
