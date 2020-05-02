/**
 * Slices string and returns a new array with the chunks.
 * @param text  String to be sliced
 * @param chunkLength Amount of chars per chunk
 * @param startText String to be added at the beginning of each chunk
 * @param fillEmptySlots Should fill the chunks that not have enough data to be filled?
 * @param emptySlotText Text used to fill the empty slots in case of fillEmptySlots param is true. This text will be
 * placed at the final.
 */
const sliceTextInChunks = (
  text: string,
  chunkLength: number = 8,
  startText: string = '',
  fillEmptySlots: boolean = false,
  emptySlotText: string = '0'
) => {
  const chunks = [];
  const size = text.length;

  for (let i = 0; i < size; i += chunkLength) {
    let chunk = startText + text.slice(i, i + chunkLength);
    if (fillEmptySlots && chunk.length < chunkLength) {
      const emptyRepresentationalData = Array(chunkLength - chunk.length)
        .fill(emptySlotText)
        .join('');

      chunks.push(chunk + emptyRepresentationalData);
    } else {
      chunks.push(chunk);
    }
  }
  return chunks;
};

export default sliceTextInChunks;
