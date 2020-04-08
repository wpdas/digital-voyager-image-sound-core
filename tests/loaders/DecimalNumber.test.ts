import path from 'path';
import { promises } from 'fs';

import Recorder from '../../src/feature/Recorder';
import Reader from '../../src/feature/Reader';
import DecimalNumber from '../../src/feature/loaders/DecimalNumber';

describe('DecimalNumber', () => {
  test('Encode and decode number without set limit for bits depth', () => {
    const numberA = 29;
    const numberAinBits = DecimalNumber.encode(numberA);
    expect(numberAinBits).toBe('00011101');
    expect(DecimalNumber.decode('00011101')).toBe(numberA);

    const numberB = 256;
    const numberBinBits = DecimalNumber.encode(numberB);
    expect(numberBinBits).toBe('0000000100000000');
    expect(DecimalNumber.decode('0000000100000000')).toBe(numberB);
  });

  test('Encode number with limit for bits depth', () => {
    const numberA = 29;
    const numberAinBits = DecimalNumber.encode(numberA, 2);
    expect(numberAinBits).toBe('0000000000011101');
    expect(DecimalNumber.decode('0000000000011101')).toBe(numberA);
  });

  test('Record and Read bits and show the final content', async (done) => {
    const outputFile = path.join(__dirname, 'output.wav');
    const recorder: Recorder = new Recorder(outputFile, DecimalNumber.header);
    const reader: Reader = new Reader(true);

    const valueTest = 29;
    const message = DecimalNumber.encode(valueTest);

    recorder.on('done', async () => {
      // Load the typeId from file Header, so that we can certify
      // we are using the properly Loader decoder
      const fileTypeId = await reader.loadFileHeaderTypeId(outputFile);
      expect(fileTypeId).toBe(DecimalNumber.header.getHeaderTypeId());

      const bits = await reader.getBitsFromFile(outputFile);
      const decodedMessage = DecimalNumber.decode(bits);
      expect(decodedMessage).toBe(valueTest);

      // Delete file
      await promises.unlink(outputFile);
      done();
    });

    recorder.writeBits(message);
    recorder.end();
  });
});
