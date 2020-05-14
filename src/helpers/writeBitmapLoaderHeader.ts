import { BitmapLoaderTypeIds } from '../constants';
import numberToUint8 from '../core/numberToUint8';

/**
 * Writes a Bitmap Loader header
 * @param audioBytes
 * @param bitmapTypeId
 * @param width
 * @param height
 */
const writeBitmapLoaderHeader = (
  audioBytes: Uint8Array,
  bitmapTypeId: BitmapLoaderTypeIds,
  width: number,
  height: number
) => {
  const widthBytes = numberToUint8(width, 2);
  const heightBytes = numberToUint8(height, 2);
  const byteArray: Array<number> = [
    bitmapTypeId,
    widthBytes[0],
    widthBytes[1],
    heightBytes[0],
    heightBytes[1],
  ];

  audioBytes.forEach((byte) => {
    byteArray.push(byte);
  });

  return new Uint8Array(byteArray);
};

export default writeBitmapLoaderHeader;
