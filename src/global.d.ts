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
