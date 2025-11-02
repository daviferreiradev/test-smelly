const jest = require('eslint-plugin-jest');

module.exports = [
  {
    files: ['**/*.js'],
    plugins: {
      jest,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...jest.environments.globals.globals,
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      'jest/no-disabled-tests': 'warn',
      'jest/no-conditional-expect': 'error',
      'jest/no-identical-title': 'error',
    },
  },
];
