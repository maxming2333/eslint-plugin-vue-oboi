module.exports = {
  rules: {
    'attributes-single-line': require('./rules/attributes-single-line.js'),
    'tag-delimiter-no-spaces': require('./rules/tag-delimiter-no-spaces.js'),
  },
  configs: {
    recommended: {
      plugins: [ 'vue-oboi' ],
      rules: {
        'vue/max-attributes-per-line': 'off',
        'vue-oboi/attributes-single-line': 'error',
        'vue-oboi/tag-delimiter-no-spaces': 'error',
      },
    },
  },
  parser: require.resolve('vue-eslint-parser'),
  plugins: [ 'vue-oboi' ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
  },
};
