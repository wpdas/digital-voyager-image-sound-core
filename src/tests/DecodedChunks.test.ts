import { createReadStream } from 'fs';
import DecodedChunks from '@voyager-edsound/DecodedChunks';
import Reader from '@voyager-edsound/Reader';
import { simpleFile } from '@voyager-edsound/tests/mocks';

describe('DecodedChunks', () => {
  test('Read icon bits stored in audio frequency by chunks', (done) => {
    const decodedChunks: DecodedChunks = new DecodedChunks();
    const reader: Reader = new Reader();

    createReadStream(simpleFile.wavFile)
      .on('data', async (bufferChunk: Buffer) => {
        const bufferChunkBytes = await reader.getBitsFromBufferChunks(
          bufferChunk
        );

        decodedChunks.push(bufferChunkBytes);

        console.log(
          `Decoded Chunks info [Bits Size: ${decodedChunks.getSize()}, File size: ${decodedChunks
            .previewFinalFileSize()
            .toFixed(3)} Mb]`
        );
      })
      .on('close', () => {
        console.log(
          `Decoded Chunks info [Bits Size: ${decodedChunks.getSize()}, File size: ${decodedChunks
            .previewFinalFileSize()
            .toFixed(3)} Mb]`
        );

        expect(decodedChunks.getSize()).toBe(40);
        expect(decodedChunks.previewFinalFileSize().toFixed(3)).toBe('0.007');
        expect(decodedChunks.getBits()).toBe(simpleFile.bits);

        done();
      });
  });
});
