import path from 'path';
import readBits from '../../src/core/readBits';

describe('readBits', () => {
  test('Read specific amount of bits', async () => {
    // This file has 16 bits stored in frequency = 0000000000011101
    const outputFile = path.join(__dirname, 'output.wav');

    const bitsToBeReadOne = 8;
    const positionOne = 0;
    const bitsSequenceOne = await readBits(
      outputFile,
      bitsToBeReadOne,
      positionOne
    );
    expect(bitsSequenceOne).toBe('00000000');

    const bitsToBeReadTwo = 8;
    const positionTwo = 8;
    const bitsSequenceTwo = await readBits(
      outputFile,
      bitsToBeReadTwo,
      positionTwo
    );
    expect(bitsSequenceTwo).toBe('00011101');

    // (!) Review needed, should be readBits(outputFile, 16, 0)
    const completeBits = await readBits(outputFile, 16, 1);
    expect(completeBits).toBe('0000000000011101');
  });
});
