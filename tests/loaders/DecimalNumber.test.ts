import path from 'path';

import loadersTypesId from '../../src/loadersTypesId';
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

  test.only('Record and Read bits and show the final content', async (done) => {
    const outputFile = path.join(__dirname, 'output.wav');
    const recorder: Recorder = new Recorder(outputFile, DecimalNumber.header);
    const reader: Reader = new Reader();

    const message = DecimalNumber.encode(29);

    recorder.on('done', async () => {
      // Load the typeId from file Header, so that we can certify
      // we are using the properly Loader decoder
      const fileTypeId = await reader.loadFileHeaderTypeId(outputFile);
      expect(fileTypeId).toBe(loadersTypesId.DECIMAL_NUMBER);

      // (!) Ok, mas como tratar os bits ignorando os 8 bits da Header?

      const bits = await reader.getBitsFromFile(outputFile);
      console.log(bits);
      done();
    });

    recorder.writeBits(message);
    recorder.end();
  });
});
