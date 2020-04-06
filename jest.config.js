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
    '\\.css$': '<rootDir>/setup/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/setup/fileMock.js',
  },
};
