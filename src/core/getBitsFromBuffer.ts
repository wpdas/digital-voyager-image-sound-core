import WavDecoder from 'wav-decoder';
import decimalToBinary from './decimalToBinary';
import { TYPE_ID_BITS_SIZE, SAMPLE_BYTE } from '@voyager-edsound/constants';

/**
 * Reads bits located into the buffer and return it.
 * @param audioBuffer Buffer that will be decoded to obtain the bits
 * @param ignoreHeaderBits Should read bits ignoring the basic header bits. The header bits is where
 * basic data is stored like loader typeId. If you are reading a file wrote using some Header of this
 * software, you can set this as 'true', but, if you want just read a file containing only bits without
 * a header, you should set this as 'false' (default).
 */
const getBitsFromBuffer = async (
  audioBuffer: Buffer,
  ignoreHeaderBits: boolean = false
) => {
  const audioData = await WavDecoder.decode(audioBuffer);
  const audioDataBuffer: Float32Array = audioData.channelData[0];
  let audioBits = '';

  for (let i = 0; i < audioDataBuffer.length; i++) {
    const byte = audioDataBuffer[i];
    const byteFixSamplePosition = byte + 1;
    const decimalNumber = Math.round(byteFixSamplePosition / SAMPLE_BYTE);
    audioBits += decimalToBinary(decimalNumber, 8);
  }

  // This will ignore the first 8 bits every time in case of true
  if (ignoreHeaderBits == true && audioBits.length >= TYPE_ID_BITS_SIZE) {
    audioBits = audioBits.slice(TYPE_ID_BITS_SIZE);
  }

  return audioBits;
};

export default getBitsFromBuffer;
