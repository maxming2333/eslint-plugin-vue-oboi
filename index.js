module.exports = {
  rules: {
    'attributes-single-line': require('./rules/attributes-single-line.js'),
    'tag-delimiter-no-spaces': require('./rules/tag-delimiter-no-spaces.js'),
    'attribute-hyphenation-with-tag': require('./rules/attribute-hyphenation-with-tag.js'),
  },
  configs: {
    recommended: {
      plugins: [ 'vue-oboi' ],
      rules: {
        'max-len': [ 'off' ],
        'vue/max-len': [ 'off' ],
        'vue/max-attributes-per-line': [ 'off' ],
        'vue/attribute-hyphenation': [ 'off' ],
        'vue-oboi/attributes-single-line': [ 'error' ],
        'vue-oboi/tag-delimiter-no-spaces': [ 'error', 'all' ],
        'vue-oboi/attribute-hyphenation-with-tag': [ 'warn' ],
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
