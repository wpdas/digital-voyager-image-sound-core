module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  errorOnDeprecated: true,
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  moduleDirectories: ['src', 'node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: {
    '@voyager-edsound/(.*)': '<rootDir>/src/$1',
  },
};
