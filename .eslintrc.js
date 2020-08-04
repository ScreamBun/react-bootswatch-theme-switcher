module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: [
    '@typescript-eslint',
    'compat',
    'eslint-comments',
    'eslint-plugin',
    'import',
    'promise',
    'react'
  ],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      webpack: {
        config: require.resolve('./config/config.eslint.js')
      }
    }
  },
  rules: {
    // eslint-disable-next-line global-require
    ...require('./config/eslint_rules'),
    'import/extensions': 0,
    // temp silence of cyclic dependencies
    'import/no-cycle': 1
  }
};