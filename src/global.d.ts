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

// wav-decoder
interface DecodeReturnProps {
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  channelData: Array<Float32Array>;
}

declare module 'wav-decoder' {
  const WavDecoder: {
    decode: (buffer: ArrayBuffer) => DecodeReturnProps;
  };
  export = WavDecoder;
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
