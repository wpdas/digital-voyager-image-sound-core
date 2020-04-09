import { createReadStream } from 'fs';
import { DecodedChunks, Reader } from '../../src';
import { iconPng, decimalNumber29Wav } from '../mocks';
import DecimalNumber from '../../src/feature/loaders/DecimalNumber';

describe('Reader', () => {
  test('Read icon bits stored in audio frequency', async (done) => {
    const reader: Reader = new Reader();
    const bits = await reader.getBitsFromFile(iconPng.wavFile);
    expect(bits).toBe(iconPng.bits);
    done();
  });

  test(`Read the typeId information stored in the header of a generated 
  file using DecimalNumber loader`, async (done) => {
    // Reader(ignoreHeaderBits = true); That means the Reader will return only
    // the data bits ignoring the basic header bits. Should be used when loading
    // a wav file generated with a Header defined by some Loader (e.g.: DecimalNumber)
    const reader: Reader = new Reader();
    const loader: DecimalNumber = new DecimalNumber();

    const typeId = await reader.loadFileHeaderTypeId(
      decimalNumber29Wav.wavFile
    );

    // Must be the same typeId of the Decimal Number.header
    expect(typeId).toBe(loader.header.getHeaderTypeId());
    done();
  });

  test('Read icon bits stored in audio frequency by chunks', (done) => {
    const decodedChunks: DecodedChunks = new DecodedChunks();
    const reader: Reader = new Reader();

    createReadStream(iconPng.wavFile)
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

        expect(decodedChunks.getSize()).toBe(1128);
        expect(decodedChunks.previewFinalFileSize().toFixed(3)).toBe('0.199');
        expect(decodedChunks.getBits()).toBe(iconPng.bits);

        done();
      });
  });
});
