import { isString } from 'util';
import { promises, read } from 'fs';
import getBitsFromBuffer from './getBitsFromBuffer';
import { WAV_HEADER_BYTES_SIZE } from '@voyager-edsound/constants';

const { open } = promises;

/**
 * Asynchronously reads data bits from the file referenced by the supplied file descriptor.
 * @param file File to be read.
 * @param length The number of bits to read.
 * @param position The offset from the beginning of the file from which data should be read. If `null`, data will be read from the current position.
 */
const readBits = async (
  file: string | Buffer,
  length: number,
  position: number = 0
) => {
  const informationSizeNeeded = WAV_HEADER_BYTES_SIZE + length + position;
  const buffer = Buffer.alloc(informationSizeNeeded);
  let headerInBits: string;

  if (isString(file) === true) {
    const fileHandler = await open(file, 'r');
    return new Promise<string>((resolve) => {
      read(
        fileHandler.fd,
        buffer,
        0,
        informationSizeNeeded,
        0,
        async (_, __, headerBuffer) => {
          headerInBits = await getBitsFromBuffer(headerBuffer);
          resolve(headerInBits.slice(position, position + length));
        }
      );
    });
  }

  headerInBits = await getBitsFromBuffer(file as Buffer);
  return headerInBits.slice(position, position + length);
};

export default readBits;
