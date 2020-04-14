import readBits from '@voyager-edsound/core/readBits';
import Recorder from '@voyager-edsound/Recorder';
import { ASCIIText } from '@voyager-edsound/loaders';

describe('readBits', () => {
  test('Read specific amount of bits', async () => {
    const recorder: Recorder = new Recorder();
    const loader: ASCIIText = new ASCIIText();

    const text = 'My awesome text!';
    const encodedMessage = loader.encode(text);
    recorder.writeBits(encodedMessage);

    // Get the buffer instead of generating a file
    const finalWavFileBuffer = await recorder.endWithBuffer();

    // Get the bits that holds the header typeId info
    const mappedBits = await readBits(finalWavFileBuffer, 8, 0);
    expect(mappedBits).toBe(loader.header.getHeaderBits());
  });
});
