import readBytes from '@voyager-edsound/core/readBytes';
import Recorder from '@voyager-edsound/Recorder';
import { ASCIIText } from '@voyager-edsound/loaders';

describe('readBytes', () => {
  test('Read specific amount of bits', async () => {
    const recorder: Recorder = new Recorder();
    const loader: ASCIIText = new ASCIIText();

    const text = 'My awesome text!';
    const encodedMessage = loader.encode(text);
    recorder.writeBytes(encodedMessage);

    // Get the buffer instead of generating a file
    const finalWavFileBuffer = await recorder.endWithBuffer();

    // Get the bits that holds the header typeId info
    const mappedBits = await readBytes(finalWavFileBuffer, 1, 0);
    expect(mappedBits[0]).toBe(loader.header.getHeaderBytes()[0]);
  });
});
