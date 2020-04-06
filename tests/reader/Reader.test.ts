import { createReadStream } from 'fs';
import path from 'path';
import { DecodedChunks, Reader } from '../../src';
import { iconBits } from './mocks';

describe('Reader', () => {
  test('Read icon bits stored in audio frequency', async (done) => {
    const reader: Reader = new Reader();
    const bits = await reader.loadFile(path.join(__dirname, 'icon.wav'));
    expect(bits).toBe(iconBits);
    done();
  });

  test('Read icon bits stored in audio frequency by chunks', (done) => {
    const decodedChunks: DecodedChunks = new DecodedChunks();
    const reader: Reader = new Reader();

    createReadStream(path.join(__dirname, 'icon.wav'))
      .on('data', async (bufferChunk: Buffer) => {
        const bufferChunkBytes = await reader.getBitsFromChunkBuffer(
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

        expect(decodedChunks.getSize()).toBe(1128);
        expect(decodedChunks.previewFinalFileSize().toFixed(3)).toBe('0.199');
        expect(decodedChunks.getBits()).toBe(iconBits);

        done();
      });
  });
});
