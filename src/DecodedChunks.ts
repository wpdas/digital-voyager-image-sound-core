interface IDecodedChunks {
  push: (decodedChunk: string) => void;
  getBits: () => string;
  getSize: () => number;
  previewFinalFileSize: () => number;
}

class DecodedChunks implements IDecodedChunks {
  private chunks: Array<string> = [];

  /**
   * Add a decoded chunk to the list of chunks
   * @param decodedChunk
   */
  push = (decodedChunk: string) => {
    this.chunks.push(decodedChunk);
  };

  /**
   * Get bits
   */
  getBits = () => {
    let currentBytes = String().concat(this.chunks.join());
    return currentBytes.replace(/[, ]+/g, '');
  };

  /**
   * Get the bits length
   */
  getSize = () => {
    return this.getBits().length;
  };

  /**
   * Get a preview of file size in Mb
   */
  previewFinalFileSize = () => {
    const audioBitsPerBit = 0.1764184397;
    return (this.getSize() * audioBitsPerBit) / 1000;
  };
}

export default DecodedChunks;
