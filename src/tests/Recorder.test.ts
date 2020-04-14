import path from 'path';
import { promises } from 'fs';
import Recorder from '@voyager-edsound/Recorder';
import Reader from '@voyager-edsound/Reader';

describe('Recorder', () => {
  test('Create audio file containing the proposed bits', async (done) => {
    const finalFile = path.join(__dirname, 'output1.wav');
    const recorder: Recorder = new Recorder();

    const messageChunk1 = '01000001011011100111100100100000';
    const messageChunk2 = '11111111';
    const finalMessage = messageChunk1 + messageChunk2;

    recorder.writeBits(messageChunk1);
    recorder.writeBits(messageChunk2);
    await recorder.endWithFile(finalFile);

    // Read wav file to verify if it has the complete message
    const reader: Reader = new Reader();
    const bits = await reader.getBitsFromFile(finalFile);
    expect(bits).toBe(finalMessage);

    await promises.unlink(finalFile);

    done();
  });
});
