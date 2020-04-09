import { FileWriter } from 'wav';
import bitToTone from 'core/bitToTone';
import { DEFAULT_BITS_DEPTH } from '../constants';

interface IRecorder {
  writeBits: (bits: string) => void;
  end: () => void;
  on: (event: string, listener: () => void) => void;
}

class Recorder implements IRecorder {
  private writer: FileWriter;

  /**
   * Prepare to record content
   *
   * WAV
   * 441000 Hz
   * Bit Depth: 16
   * Info: 0.1764184397 audio bits per bit
   *
   * Bits data will be saved as sound frequencies
   *
   * @param {string} outputFile output filename
   */
  constructor(outputFile: string) {
    this.writer = new FileWriter(outputFile, {
      bitDepth: 16,
      channels: 1,
    });
  }

  /**
   * Write bits
   *
   * Example: writeBits('00011101') or writeBits('0001110100011101')
   * Must be a multiple of 8 (8 bits)
   *
   * @param {string} bits write bits (8 bits)
   */
  writeBits = (bits: string) => {
    const cleanedBits = bits.replace(/[^0-1]/g, '');

    // Must be a multiple of 8 (8 bits)
    if (cleanedBits.length % DEFAULT_BITS_DEPTH === 0) {
      bitToTone(this.writer, cleanedBits);
    } else {
      throw new Error(
        'Invalid bits format. You must pass multiple of 8 bits (byte). Example: 00011010 or 0001101000011011...'
      );
    }
  };

  /**
   * Finishes the process of writing wav file
   */
  end = () => {
    this.writer.end();
  };

  /**
   * Listen to events
   * Example on('done', function(){...})
   */
  on = (event: string = 'done', listener: () => void) => {
    this.writer.on(event, listener);
  };
}

export default Recorder;
