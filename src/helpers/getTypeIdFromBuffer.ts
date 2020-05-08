import { WAV_HEADER_BYTES_SIZE } from '../constants';

type GetTypeIdFromBuffer = (audioBuffer: Buffer) => number;

/**
 * Get typeId of a wav buffer
 * @param audioBuffer
 */
const getTypeIdFromBuffer: GetTypeIdFromBuffer = (audioBuffer: Buffer) => {
  //Ignore WAV header - 44 bytes
  const sampleDataBuffer: Buffer = Buffer.alloc(1);
  audioBuffer.copy(
    sampleDataBuffer,
    0,
    WAV_HEADER_BYTES_SIZE,
    WAV_HEADER_BYTES_SIZE + 1
  );

  return sampleDataBuffer.readUInt8(0);
};

export default getTypeIdFromBuffer;
