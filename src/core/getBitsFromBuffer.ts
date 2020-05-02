import {
  WAV_HEADER_BYTES_SIZE,
  TYPE_ID_BYTE_SIZE,
} from '@voyager-edsound/constants';

/**
 * Reads bytes located into the buffer and return it.
 * @param audioBuffer Buffer that will be decoded to obtain the bits
 * @param ignoreHeaderBytes Should read bytes ignoring the basic header bits. The header bits is where
 * basic data is stored like loader typeId. If you are reading a file wrote using some Header of this
 * software, you can set this as 'true', but, if you want just read a file containing only bytes without
 * a header, you should set this as 'false' (default).
 */
export const getBitsFromBuffer = async (
  audioBuffer: Buffer,
  ignoreHeaderBytes: boolean = false
) => {
  //Ignore WAV header - 44 bytes
  const ignoreLengthSize = ignoreHeaderBytes
    ? WAV_HEADER_BYTES_SIZE + TYPE_ID_BYTE_SIZE
    : WAV_HEADER_BYTES_SIZE;

  const sampleDataBuffer: Buffer = Buffer.alloc(
    audioBuffer.byteLength - ignoreLengthSize
  );
  audioBuffer.copy(sampleDataBuffer, 0, ignoreLengthSize);

  return Uint8Array.from(sampleDataBuffer);
};

export default getBitsFromBuffer;
