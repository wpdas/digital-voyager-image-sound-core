// tonegenerator
interface ToneProps {
  freq: number;
  lengthInSecs: number;
  volume: number;
}

declare module 'tonegenerator' {
  function tone(props: ToneProps): Buffer;
  export = tone;
}

// wav-encoder
interface AudioData {
  sampleRate: number;
  channelData: Array<Float32Array>;
}

interface Options {
  bitDepth?: number;
  float?: boolean;
  symmetric?: number;
}

declare module 'wav-encoder' {
  const WavEncoder: {
    encode: (audioData: AudioData, opts?: Options) => Promise<ArrayBuffer>;
  };
  export = WavEncoder;
}
