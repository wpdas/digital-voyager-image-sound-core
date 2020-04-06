import Header from '../../src/feature/loaders/utils/Header';

describe('Header builder', () => {
  test('Create header bits', () => {
    const HeaderTest: Header = new Header(29);
    expect(HeaderTest.getHeaderBits()).toBe('00011101');
  });
});
