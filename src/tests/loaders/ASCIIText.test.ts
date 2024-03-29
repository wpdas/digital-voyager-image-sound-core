import path from 'path';
import { promises } from 'fs';

import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';
import ASCIIText from '@voyager-edsound/loaders/ASCIIText';
import EncodedOutput from '@voyager-edsound/loaders/utils/EncodedOutput';
import { deleteFilesAfterTest } from '../mocks';

describe('ASCIIText', () => {
  test('Encode and decode text', () => {
    const loader: ASCIIText = new ASCIIText();
    const myPrettyText =
      'abcdefghijklmnopqrstuvwxz1234567890-=!@#$%^&*()_+"<>[]/`±§çáàéèãõñúùÁÀÉÈÃÕÑÚÙ';

    const encoded: EncodedOutput = loader.encode(myPrettyText);
    const decoded = loader.decode(encoded.bytes);
    expect(decoded).toBe(myPrettyText);
  });

  test('Record and Read bits and show the final content', async (done) => {
    const outputFile = path.join(__dirname, 'ascii.wav');
    const recorder: Recorder = new Recorder();
    const reader: Reader = new Reader();
    const loader: ASCIIText = new ASCIIText();

    const myPrettyText =
      'abcdefghijklmnopqrstuvwxz1234567890-=!@#$%^&*()_+"<>[]/`±§çáàéèãõñúùÁÀÉÈÃÕÑÚÙ';

    const message: EncodedOutput = loader.encode(myPrettyText);

    recorder.writeBytes(message);
    await recorder.endWithFile(outputFile);

    // Load the typeId from file Header, so that we can certify
    // we are using the properly Loader decoder
    const fileTypeId = await reader.loadFileHeaderTypeId(outputFile);
    expect(fileTypeId).toBe(loader.header.getHeaderTypeId());

    const bytes = await reader.getBytesFromFile(outputFile);
    const decodedMessage = loader.decode(bytes);
    expect(decodedMessage).toBe(myPrettyText);

    // Delete file
    if (deleteFilesAfterTest) {
      await promises.unlink(outputFile);
    }
    done();
  });
});
