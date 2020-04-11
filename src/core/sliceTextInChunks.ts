/**
 * Slices string and returns a new array with the chunks.
 * @param text  String to be sliced
 * @param chunkLength Amount of chars per chunk
 * @param startText String to be added at the beginning of each chunk
 */
const sliceTextInChunks = (
  text: string,
  chunkLength: number = 8,
  startText: string = ''
) => {
  const chunks = [];
  const size = text.length;

  for (let i = 0; i < size; i += chunkLength) {
    chunks.push(startText + text.slice(i, i + chunkLength));
  }
  return chunks;
};

export default sliceTextInChunks;
