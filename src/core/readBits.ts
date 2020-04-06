import { promises, read } from 'fs';
import getBitsFromBuffer from './getBitsFromBuffer';
import { WAV_HEADER_BYTES_SIZE, WAV_TONE_BYTES_SIZE } from '../constants';

const { open } = promises;

/**
 * Asynchronously reads data bits from the file referenced by the supplied file descriptor.
 * @param fileDir File directory to be read.
 * @param length The number of bits to read.
 * @param position The offset from the beginning of the file from which data should be read. If `null`, data will be read from the current position.
 */
const readBits = async (
  fileDir: string,
  length: number,
  position: number = 0
) => {
  const informationSizeNeeded =
    WAV_HEADER_BYTES_SIZE + WAV_TONE_BYTES_SIZE * (length + position);

  const fileHandler = await open(fileDir, 'r');
  const buffer = Buffer.alloc(informationSizeNeeded);

  return new Promise<string>((resolve) => {
    read(
      fileHandler.fd,
      buffer,
      0,
      informationSizeNeeded,
      0,
      async (_, __, headerBuffer) => {
        const headerInBits = await getBitsFromBuffer(headerBuffer);
        resolve(headerInBits.slice(position, position + length));
      }
    );
  });
};

export default readBits;
