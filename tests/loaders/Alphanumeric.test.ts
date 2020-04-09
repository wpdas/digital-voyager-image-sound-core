import path from 'path';
import { promises } from 'fs';

import Recorder from '../../src/feature/Recorder';
import Reader from '../../src/feature/Reader';
import Alphanumeric from '../../src/feature/loaders/Alphanumeric';

describe('Alphanumeric', () => {
  test('Encode and decode text', () => {
    const loader: Alphanumeric = new Alphanumeric();
    const myPrettyText =
      'abcdefghijklmnopqrstuvwxz1234567890-=!@#$%ˆ&*()_+"<>/`±§çáàéèãõñúùÁÀÉÈÃÕÑÚÙ平仮名';

    const encoded = loader.encode(myPrettyText);
    const decoded = loader.decode(encoded);
    expect(decoded).toBe(myPrettyText);
  });

  test('Record and Read bits and show the final content', async (done) => {
    const outputFile = path.join(__dirname, 'output.wav');
    const recorder: Recorder = new Recorder(outputFile);
    const reader: Reader = new Reader();
    const loader: Alphanumeric = new Alphanumeric();

    const myPrettyText =
      'abcdefghijklmnopqrstuvwxz1234567890-=!@#$%ˆ&*()_+"<>/`±§çáàéèãõñúùÁÀÉÈÃÕÑÚÙ平仮名';
    const message = loader.encode(myPrettyText);

    recorder.on('done', async () => {
      // Load the typeId from file Header, so that we can certify
      // we are using the properly Loader decoder
      const fileTypeId = await reader.loadFileHeaderTypeId(outputFile);
      expect(fileTypeId).toBe(loader.header.getHeaderTypeId());

      const bits = await reader.getBitsFromFile(outputFile);
      expect(bits).toBe(message);

      const decodedMessage = loader.decode(bits);
      expect(decodedMessage).toBe(myPrettyText);

      // Delete file
      await promises.unlink(outputFile);
      done();
    });

    recorder.writeBits(message);
    recorder.end();
  });
});
