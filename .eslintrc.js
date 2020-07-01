module.exports = {
  extends: [
    'eslint-config-alloy',
    'eslint-config-prettier',
    'eslint-config-egg',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    indent: [ 'error', 2, {
      SwitchCase: 1,
      ignoredNodes: [ 'TemplateLiteral' ],
    }],
  },
};
