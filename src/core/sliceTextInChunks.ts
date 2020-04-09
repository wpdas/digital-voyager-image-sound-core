/**
 * Slices string and returns a new array with the chunks.
 * @param text  Text to be sliced
 * @param chunkLength Amount of chars per chunk
 */
const sliceTextInChunks = (text: string, chunkLength: number = 8) => {
  const chunks = [];
  const size = text.length;

  for (let i = 0; i < size; i += chunkLength) {
    chunks.push(text.slice(i, i + chunkLength));
  }
  return chunks;
};

export default sliceTextInChunks;
