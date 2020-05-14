module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.ts', '.tsx', '.json'],
          alias: {
            '@voyager-edsound/': './lib/',
          },
        },
      ],
    ],
  };
};
