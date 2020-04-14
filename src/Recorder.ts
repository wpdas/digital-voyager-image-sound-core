import { promises } from 'fs';
import { isString } from 'util';
import writeSampleBytes from 'core/writeSampleBytes';
import { DEFAULT_BITS_DEPTH } from './constants';
import EncodedOutput from './loaders/utils/EncodedOutput';

interface IRecorder {
  writeBits: (bits: EncodedOutput | string) => void;
  endWithFile: (path: string) => void;
  endWithBuffer: () => Promise<Buffer>;
}

class Recorder implements IRecorder {
  private bitsData: string = '';

  /**
   * Prepare to record content
   *
   * WAV
   * 441000 Hz
   * Bit Depth: 8
   *
   * Bits data will be saved as sound sample rates
   */
  constructor() {}

  /**
   * Write bits
   *
   * Example: writeBits('00011101') or writeBits('0001110100011101')
   * Must be a multiple of 8 (8 bits)
   *
   * @param encodedOutput The loader encoded output containing the bits
   * @param autoFix Auto fix bits by adding the rest necessary at the end (may corrupt the content)
   */
  writeBits = (
    encodedOutput: EncodedOutput | string,
    autoFix: boolean = false
  ) => {
    let bits: string = isString(encodedOutput)
      ? encodedOutput
      : encodedOutput.bits;

    let cleanedBits = bits.replace(/[^0-1]/g, '');

    // Fix bits (may cause issue to the content)
    if (autoFix === true) {
      cleanedBits += Array(
        DEFAULT_BITS_DEPTH - (cleanedBits.length % DEFAULT_BITS_DEPTH)
      )
        .fill('0')
        .join('');
    }

    // Must be a multiple of 8 (8 bits)
    if (cleanedBits.length % DEFAULT_BITS_DEPTH === 0) {
      this.bitsData += cleanedBits;
    } else {
      throw new Error(
        'Invalid bits format. You must pass multiple of 8 bits (byte). Example: 00011010 or 0001101000011011... You can set autoFix as true and have this fixed.'
      );
    }
  };

  /**
   * Finishes the process and save the data in a audio format file.
   *
   * @param outputFile A path to a file where the audio buffer will be stored.
   */
  endWithFile = async (path: string) => {
    const { writeFile } = promises;
    const audioBuffer = await writeSampleBytes(this.bitsData);

    // Clear bitsData
    this.bitsData = '';

    return writeFile(path, audioBuffer);
  };

  /**
   * Finishes the process and returns a buffer with audio format file.
   *
   * @param outputFile A path to a file where the audio buffer will be stored.
   */
  endWithBuffer = async () => {
    const buffer: Buffer = await writeSampleBytes(this.bitsData);

    // Clear bitsData
    this.bitsData = '';

    return buffer;
  };
}

export default Recorder;
