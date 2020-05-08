import { WAV_HEADER_BYTES_SIZE } from '../constants';
import uint8ToNumber from '../core/uint8ToNumber';

export type BitmapWavHeader = {
  typeId: number;
  width: number;
  height: number;
};
type GetBitmapHeaderInfo = (audioBuffer: Buffer) => BitmapWavHeader;

/**
 * Get bitmap header information from wav sampleData. You need to know the typeId before in order
 * to be sure the buffer belongs to a Bitmap loader format. Use getTypeIdFromBuffer to get that (typeId).
 * @param audioBuffer Audio file buffer
 */
const getBitmapHeaderInfo: GetBitmapHeaderInfo = (audioBuffer: Buffer) => {
  //Ignore WAV header - 44 bytes and get the 5 bytes necessary to read Wav Bitmap Loader Header information
  const sampleDataBuffer: Buffer = Buffer.alloc(5);
  audioBuffer.copy(
    sampleDataBuffer,
    0,
    WAV_HEADER_BYTES_SIZE,
    WAV_HEADER_BYTES_SIZE + 5
  );

  return {
    typeId: sampleDataBuffer.readUInt8(0),
    width: uint8ToNumber([
      sampleDataBuffer.readUInt8(1),
      sampleDataBuffer.readUInt8(2),
    ]),
    height: uint8ToNumber([
      sampleDataBuffer.readUInt8(3),
      sampleDataBuffer.readUInt8(4),
    ]),
  };
};

export default getBitmapHeaderInfo;
