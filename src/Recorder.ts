import { promises } from 'fs';
import writeSampleBytes from 'core/writeSampleBytes';
import EncodedOutput from './loaders/utils/EncodedOutput';

interface IRecorder {
  writeBytes: (bits: EncodedOutput) => void;
  endWithFile: (path: string) => void;
  endWithBuffer: () => Promise<Buffer>;
}

class Recorder implements IRecorder {
  private bytesData: Array<number> = [];

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
   * Write bytes
   *
   * @param encodedOutput The loader encoded output containing bytes
   */
  writeBytes = (encodedData: EncodedOutput) => {
    encodedData.bytes.forEach((byte) => {
      this.bytesData.push(byte);
    });
  };

  /**
   * Finishes the process and save the data in a audio format file.
   *
   * @param outputFile A path to a file where the audio buffer will be stored.
   */
  endWithFile = async (outputFile: string) => {
    const { writeFile } = promises;
    const audioBuffer = await writeSampleBytes(this.bytesData);

    // Clear bitsData
    this.bytesData = [];

    return writeFile(outputFile, audioBuffer);
  };

  /**
   * Finishes the process and returns a buffer with audio format file.
   */
  endWithBuffer = async () => {
    const buffer: Buffer = await writeSampleBytes(this.bytesData);

    // Clear bitsData
    this.bytesData = [];

    return buffer;
  };
}

export default Recorder;
