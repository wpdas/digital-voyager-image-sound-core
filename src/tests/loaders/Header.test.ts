import Header from '@voyager-edsound/loaders/utils/Header';

describe('Header builder', () => {
  test('Create header bits', () => {
    const HeaderTest: Header = new Header(29);
    expect(HeaderTest.getHeaderBytes()[0]).toBe(29);
  });
});
