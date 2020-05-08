import WavEncoder from 'wav-encoder';
import { SAMPLE_BYTE, SAMPLE_RATE } from '../constants';

const writeSampleBytes = async (bytes: Array<number>) => {
  const floatSampleDataMono: Float32Array = new Float32Array(bytes.length);

  bytes.forEach((uint8Value, index) => {
    // Using this formula avoid ther error caused by second formula
    floatSampleDataMono[index] = SAMPLE_BYTE * uint8Value - 1;
    // floatSampleDataMono[index] = (uint8Value - 128) / 128.0;
  });
  SAMPLE_RATE;

  const audioData = {
    sampleRate: SAMPLE_RATE,
    channelData: [floatSampleDataMono],
  };

  const arrayBuffer = await WavEncoder.encode(audioData, { bitDepth: 8 });

  return Buffer.from(arrayBuffer);
};

export default writeSampleBytes;
