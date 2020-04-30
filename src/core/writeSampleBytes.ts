import WavEncoder from 'wav-encoder';
import sliceTextInChunks from './sliceTextInChunks';
import binaryToDecimal from './binaryToDecimal';
import { SAMPLE_BYTE, SAMPLE_RATE } from '@voyager-edsound/constants';

export const writeSampleBytes = async (bits: string) => {
  const decimal = sliceTextInChunks(bits, 8).map((binaryData) =>
    binaryToDecimal(binaryData)
  );
  const sampleBytes = decimal.map(
    (decimalNumber) => SAMPLE_BYTE * decimalNumber - 1
  );
  const audioData = {
    sampleRate: SAMPLE_RATE,
    channelData: [new Float32Array(sampleBytes)],
  };

  const arrayBuffer = await WavEncoder.encode(audioData, { bitDepth: 8 });

  return new Buffer(arrayBuffer);
};

export default writeSampleBytes;
