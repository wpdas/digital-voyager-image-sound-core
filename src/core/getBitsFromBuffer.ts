import WavDecoder from 'wav-decoder';
import getHigherFrequency from './getHigherFrequency';
import getBinaryFromFilteredSamples from './getBinaryFromFilteredSamples';
import { TYPE_ID_BITS_SIZE } from '../constants';

/**
 * Reads bits located into the buffer and return it.
 * @param buffer Buffer that will be decoded to obtain the bits
 * @param ignoreHeaderBits Should read bits ignoring the basic header bits. The header bits is where
 * basic data is stored like loader typeId. If you are reading a file wrote using some Header of this
 * software, you can set this as 'true', but, if you want just read a file containing only bits without
 * a header, you should set this as 'false' (default).
 */
const getBitsFromBuffer = async (
  buffer: Buffer,
  ignoreHeaderBits: boolean = false
) => {
  const audioData = await WavDecoder.decode(Uint8Array.from(buffer).buffer);
  const frequencyOfBits = getHigherFrequency(audioData.channelData[0]);
  const extractedBytes = getBinaryFromFilteredSamples(frequencyOfBits);
  let bits = extractedBytes.join('');

  // This will ignore the first 8 bits every time in case of true
  if (ignoreHeaderBits == true && bits.length >= TYPE_ID_BITS_SIZE) {
    bits = bits.slice(TYPE_ID_BITS_SIZE);
  }

  return bits;
};

export default getBitsFromBuffer;
