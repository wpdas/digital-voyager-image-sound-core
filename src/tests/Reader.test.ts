import Reader from '@voyager-edsound/Reader';
import { DecimalNumber } from '@voyager-edsound/loaders';
import { simpleFile, decimalNumber29Wav } from '@voyager-edsound/tests/mocks';

describe('Reader', () => {
  test('Read icon bits stored in audio frequency', async (done) => {
    const reader: Reader = new Reader();
    const bits = await reader.getBytesFromFile(simpleFile.wavFile);
    expect(bits.join('')).toBe(simpleFile.bytes.join(''));
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
});
