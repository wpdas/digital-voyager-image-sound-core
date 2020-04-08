// Futuro: capacidade de ler bites em tempo real. Enquanto o audio está sendo tocado.
import { promises } from 'fs';
import getBitsFromBuffer from 'core/getBitsFromBuffer';
import readBits from 'core/readBits';
import BitToneBuffer from './BitToneBuffer';
import { TYPE_ID_BITS_SIZE } from '../constants';
import binaryToDecimal from 'core/binaryToDecimal';

const { readFile } = promises;

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
  private ignoreHeaderBits = false;
  private headerBitsHasBeenRead = false;

  /**
   * Reads WAV file generated by this software and return
   * the founded bits.
   *
   * @param ignoreHeaderBits Should read bits ignoring the basic header bits. The header bits is where
   * basic data is stored like loader typeId. If you are reading a file wrote using some Header of this
   * software, you can set this as 'true', but, if you want just read a file containing only bits without
   * a header, you should set this as 'false' (default).
   */
  constructor(ignoreHeaderBits: boolean = false) {
    this.ignoreHeaderBits = ignoreHeaderBits;
  }

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
    // Condition for return or not the header bits. It should be ignored only once (at the beginning of the file)
    if (this.ignoreHeaderBits == true && this.headerBitsHasBeenRead == false) {
      this.headerBitsHasBeenRead = true;
      return getBitsFromBuffer(buffer, true);
    }

    return getBitsFromBuffer(buffer);
  };

  /**
   * The pure way to load the full file bits at once.
   * @param {string} fileDir File directory to be loaded
   */
  getBitsFromFile = async (fileDir: string) => {
    const buffer = await readFile(fileDir);
    return await this.getBitsFromBuffer(buffer);
  };

  /**
   * Reads bits located into a chunck of buffer. This can be used when you
   * are loading chunk by chunk of a file.
   * @param buffer
   */
  getBitsFromBufferChunks = async (buffer: Buffer) => {
    this.chunksBuffer.push(buffer);

    const currentBits = await this.getBitsFromBuffer(
      BitToneBuffer.concat(this.chunksBuffer)
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
    this.headerBitsHasBeenRead = false;
  };
}

export default Reader;
