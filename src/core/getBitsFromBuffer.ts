import WavDecoder from 'wav-decoder';
import getHigherFrequency from './getHigherFrequency';
import getBinaryFromFilteredSamples from './getBinaryFromFilteredSamples';

/**
 * Reads bits located into the buffer and return it.
 * @param {Buffer} buffer Buffer that will be decoded to obtain the bits
 */
const getBitsFromBuffer = async (buffer: Buffer) => {
  const audioData = await WavDecoder.decode(Uint8Array.from(buffer).buffer);
  const frequencyOfBits = getHigherFrequency(audioData.channelData[0]);
  const extractedBytes = getBinaryFromFilteredSamples(frequencyOfBits);
  return extractedBytes.join('');
};

export default getBitsFromBuffer;
