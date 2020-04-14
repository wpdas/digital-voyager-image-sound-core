import { promises } from 'fs';
import getBitsFromBuffer from '@voyager-edsound/core/getBitsFromBuffer';
import readBits from '@voyager-edsound/core/readBits';
import deprecatedBuffer from '@voyager-edsound/core/deprecatedBuffer';
import {
  TYPE_ID_BITS_SIZE,
  DEFAULT_BITS_DEPTH,
} from '@voyager-edsound/constants';
import binaryToDecimal from '@voyager-edsound/core/binaryToDecimal';

interface IReader {
  loadFileHeaderTypeId: (fileDir: string) => Promise<number>;
  getBitsFromFile: (fileDir: string) => Promise<string>;
  getBitsFromBuffer: (buffer: Buffer) => Promise<string>;
  getBitsFromBufferChunks: (buffer: Buffer) => Promise<string>;
  reset: () => void;
}

class Reader implements IReader {
  private chunksBuffer: Array<Buffer> = [];
  private oldBits = '';

  /**
   * Reads WAV file generated by this software and return
   * the founded bits.
   */
  constructor() {}

  /**
   * Load bits containing the Loader TypeId information. Can be used to know how to decode the information
   * @param fileDir File directory to have its header loaded
   */
  loadFileHeaderTypeId = async (fileDir: string) => {
    const typeIdBits = await readBits(fileDir, TYPE_ID_BITS_SIZE);
    return binaryToDecimal(typeIdBits);
  };

  /**
   * Reads bits located into the buffer and return it.
   * @param {Buffer} buffer Buffer that will be decoded to obtain the bits
   */
  getBitsFromBuffer = async (buffer: Buffer) => {
    return getBitsFromBuffer(buffer);
  };

  /**
   * The pure way to load the full file bits at once.
   * @param {string} fileDir File directory to be loaded
   */
  getBitsFromFile = async (fileDir: string) => {
    const { readFile } = promises;
    const buffer = await readFile(fileDir);
    let bits = await this.getBitsFromBuffer(buffer);

    // Force to fix issued bits (those that are out of the multiple of 8)
    const issuedBits = bits.length % DEFAULT_BITS_DEPTH;
    if (issuedBits !== 0) {
      bits = bits.slice(issuedBits);
    }

    return bits as string;
  };

  /**
   * Reads bits located into a chunck of buffer. This can be used when you
   * are loading chunk by chunk of a file.
   * @param buffer
   */
  getBitsFromBufferChunks = async (buffer: Buffer) => {
    this.chunksBuffer.push(buffer);

    const currentBits = await this.getBitsFromBuffer(
      deprecatedBuffer.concat(this.chunksBuffer)
    );
    const currentChunkOfBits = currentBits.replace(this.oldBits, '');
    this.oldBits = currentBits;

    return currentChunkOfBits;
  };

  /**
   * Reset attributes
   */
  reset = () => {
    this.chunksBuffer = [];
    this.oldBits = '';
  };
}

export default Reader;