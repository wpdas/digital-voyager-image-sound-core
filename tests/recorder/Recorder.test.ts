import path from 'path';
import { promises } from 'fs';
import Recorder from '../../src/feature/Recorder';
import Reader from '../../src/feature/Reader';

describe('Recorder', () => {
  test('Create audio file containing the proposed bits', async (done) => {
    const finalFile = path.join(__dirname, 'output1.wav');
    const recorder = new Recorder(finalFile);
    const fnDone = jest.fn();
    recorder.on('done', () => {
      fnDone();
    });

    const messageChunk1 = '01000001011011100111100100100000';
    const messageChunk2 = '11111111';
    const finalMessage = messageChunk1 + messageChunk2;

    recorder.writeBits(messageChunk1);
    recorder.writeBits(messageChunk2);
    recorder.end();

    // Read wav file to verify if it has the complete message
    const reader: Reader = new Reader();
    const bits = await reader.getBitsFromFile(finalFile);

    expect(fnDone).toBeCalledTimes(1);
    expect(bits).toBe(finalMessage);

    await promises.unlink(finalFile);

    done();
  });
});
