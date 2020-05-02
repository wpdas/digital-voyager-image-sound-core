import path from 'path';
import { promises } from 'fs';
import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';
import EncodedOutput from '@voyager-edsound/loaders/utils/EncodedOutput';
import Header from '@voyager-edsound/loaders/utils/Header';

describe('Recorder', () => {
  test('Create audio file containing the proposed bits', async (done) => {
    const finalFile = path.join(__dirname, 'output1.wav');
    const recorder: Recorder = new Recorder();

    const messageChunk1 = [30];
    const messageChunk2 = [255];
    const finalMessage = [0, 30, 0, 255];

    recorder.writeBytes(new EncodedOutput(new Header(0), messageChunk1));
    recorder.writeBytes(new EncodedOutput(new Header(0), messageChunk2));
    await recorder.endWithFile(finalFile);

    // Read wav file to verify if it has the complete message
    const reader: Reader = new Reader();
    const bytes = await reader.getBytesFromFile(finalFile);
    expect(bytes.join('')).toBe(finalMessage.join(''));

    await promises.unlink(finalFile);

    done();
  });
});
