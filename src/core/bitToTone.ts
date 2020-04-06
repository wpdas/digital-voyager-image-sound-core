import tone from 'tonegenerator';
import { FileWriter } from 'wav';
import volumes from './volumes';
import { WAV_TONE_FREQUENCY } from '../constants';

/**
 * Converts bytes to audio tone
 *
 * Each tone registers 88 bits of information.
 *
 * @param {FileWriter} writer
 * @param {string} bytes Sequence of bits (Must be a multiple of 8 bits)
 */
const bitToTone = (writer: FileWriter, bytes: string) => {
  const listOfBits = bytes.split(' ');
  const lengthInSeconds = 0.1 / 64;

  listOfBits.forEach((bits) => {
    const currentBits = bits.split('');

    currentBits.forEach((bit: string) => {
      const currentBit = Number(bit);

      writer.write(
        new Buffer(
          tone({
            freq: WAV_TONE_FREQUENCY,
            lengthInSecs: lengthInSeconds,
            volume: volumes.DIVISOR,
          })
        )
      );

      if (currentBit == 0) {
        writer.write(
          new Buffer(
            tone({
              freq: WAV_TONE_FREQUENCY,
              lengthInSecs: lengthInSeconds,
              volume: volumes.ZERO,
            })
          )
        );
      } else if (currentBit == 1) {
        writer.write(
          new Buffer(
            tone({
              freq: WAV_TONE_FREQUENCY,
              lengthInSecs: lengthInSeconds,
              volume: volumes.ONE,
            })
          )
        );
      }
    });
  });
};

export default bitToTone;
