import path from 'path';
import { promises } from 'fs';

import Recorder from '../../src/feature/Recorder';
import Reader from '../../src/feature/Reader';
import DecimalNumber from '../../src/feature/loaders/DecimalNumber';

describe('DecimalNumber', () => {
  test('Encode and decode number without set limit for bits depth', () => {
    const loader: DecimalNumber = new DecimalNumber();

    const numberA = 29;
    const numberAinBits = loader.encode(numberA);
    expect(numberAinBits).toBe('0000000000011101');
    expect(loader.decode('0000000000011101')).toBe(numberA);

    const numberB = 255;
    const numberBinBits = loader.encode(numberB);
    expect(numberBinBits).toBe('0000000011111111');
    expect(loader.decode('0000000011111111')).toBe(numberB);
  });

  test('Encode number with limit for bits depth', () => {
    const loader: DecimalNumber = new DecimalNumber();

    const numberA = 29;
    const numberAinBits = loader.encode(numberA, 8);
    expect(numberAinBits).toBe('0000000000011101');
    expect(loader.decode('0000000000011101')).toBe(numberA);
  });

  test('Record and Read bits and show the final content', async (done) => {
    const outputFile = path.join(__dirname, 'output.wav');
    const recorder: Recorder = new Recorder(outputFile);
    const reader: Reader = new Reader();
    const loader: DecimalNumber = new DecimalNumber();

    const valueTest = 29;
    const message = loader.encode(valueTest);

    recorder.on('done', async () => {
      // Load the typeId from file Header, so that we can certify
      // we are using the properly Loader decoder
      const fileTypeId = await reader.loadFileHeaderTypeId(outputFile);
      expect(fileTypeId).toBe(loader.header.getHeaderTypeId());

      const bits = await reader.getBitsFromFile(outputFile);
      const decodedMessage = loader.decode(bits);
      expect(decodedMessage).toBe(valueTest);

      // Delete file
      await promises.unlink(outputFile);
      done();
    });

    recorder.writeBits(message);
    recorder.end();
  });
});
