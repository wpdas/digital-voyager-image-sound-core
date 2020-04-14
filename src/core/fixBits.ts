import sliceTextInChunks from './sliceTextInChunks';
import forceBitsSize from './forceBitsSize';
import { DEFAULT_BITS_DEPTH } from '@voyager-edsound/constants';

/**
 * Slices string and returns a new array with the fixed bits chunks.
 * @param bits  String to be sliced
 * @param chunkLength Amount of chars per chunk
 * @param fitOnBitsDepth Fit the chunks into the desired bits depth
 * @param startText String to be added at the beginning of each chunk
 *
 * Example of usage:
 * having: 000000001 ( 9 bits )
 * you want to have it stored in 8 bits buffer sequence, so:
 * fixBits(000000001) returns ['00000000', '10000000']
 */
const fixBits = (
  bits: string,
  chunkLength: number = 8,
  fitOnBitsDepth: number = DEFAULT_BITS_DEPTH,
  startText: string = ''
) => {
  const slices = sliceTextInChunks(bits, chunkLength);

  let output: string[] = [];
  for (let l = 0; l < slices.length; l++) {
    const current = slices[l];

    const correction = sliceTextInChunks(current, fitOnBitsDepth);
    for (let i = 0; i < correction.length; i++) {
      if (correction[i].length >= fitOnBitsDepth) {
        output.push(startText + correction[i]);
      } else {
        output.push(
          startText + forceBitsSize(correction[i], fitOnBitsDepth, 'LAST')
        );
      }
    }

    // const correction = sliceTextInChunks(current, fitOnBitsDepth).map(
    //   (currentBitsSequence) => {
    //     let bitsSequence: string;
    //     if (currentBitsSequence.length >= fitOnBitsDepth) {
    //       bitsSequence = currentBitsSequence;
    //     } else {
    //       bitsSequence = forceBitsSize(currentBitsSequence, 8, 'LAST');
    //     }
    //     return bitsSequence;
    //   }
    // );

    // output.concat(correction);
  }
  return output;
};

export default fixBits;
