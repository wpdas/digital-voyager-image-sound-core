import readBits from '../../src/core/readBits';
import { decimalNumber29Wav } from '../mocks';

describe('readBits', () => {
  test('Read specific amount of bits', async () => {
    const bitsToBeReadOne = 8;
    const positionOne = 0;

    // This file (decimalNumber29.wav) has 16 bits stored in frequency = 0000000000011101
    const bitsSequenceOne = await readBits(
      decimalNumber29Wav.wavFile,
      bitsToBeReadOne,
      positionOne
    );
    expect(bitsSequenceOne).toBe('00000000');

    const bitsToBeReadTwo = 8;
    const positionTwo = 8;
    const bitsSequenceTwo = await readBits(
      decimalNumber29Wav.wavFile,
      bitsToBeReadTwo,
      positionTwo
    );
    expect(bitsSequenceTwo).toBe('00011101');

    // (!) Review needed, should be readBits(outputFile, 16, 0)
    const completeBits = await readBits(decimalNumber29Wav.wavFile, 16, 1);
    expect(completeBits).toBe(decimalNumber29Wav.bits);
  });
});
