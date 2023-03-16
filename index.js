module.exports = {
  rules: {
    'attributes-single-line': require('./rules/attributes-single-line'),
    'tag-delimiter-no-spaces': require('./rules/tag-delimiter-no-spaces'),
    'attribute-hyphenation-with-tag': require('./rules/attribute-hyphenation-with-tag'),
    'singleline-html-element-content-inline': require('./rules/singleline-html-element-content-inline'),
  },
  configs: {
    recommended: {
      plugins: [ 'vue-oboi' ],
      rules: {
        'max-len': 'off',
        'vue/max-len': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/attribute-hyphenation': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue-oboi/attributes-single-line': [ 'error' ],
        'vue-oboi/tag-delimiter-no-spaces': [ 'error', 'all' ],
        'vue-oboi/attribute-hyphenation-with-tag': [ 'warn' ],
        'vue-oboi/singleline-html-element-content-inline': [ 'warn' ],
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
