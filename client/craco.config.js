const { whenProd } = require('@craco/craco');
const CracoAlias = require('craco-alias');

module.exports = {
  eslint: {
    ...whenProd(() => ({ enable: false })),
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.json',
      },
    },
  ],
};
