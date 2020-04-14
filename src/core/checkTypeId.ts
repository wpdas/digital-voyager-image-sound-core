import { TYPE_ID_BITS_SIZE } from '@voyager-edsound/constants';
import binaryToDecimal from './binaryToDecimal';

/**
 * Check if the typeId bits matchs the decimal typeId
 * @param bitsToCheck typeId bits to be checked
 * @param typeId decimal typeId used in the comparation
 */
const checkTypeId = (bitsToCheck: string, typeId: number) => {
  let output: boolean | null = null;
  if (bitsToCheck.length >= TYPE_ID_BITS_SIZE) {
    output =
      binaryToDecimal(bitsToCheck.slice(0, TYPE_ID_BITS_SIZE)) === typeId;
  }
  return output;
};

export default checkTypeId;
