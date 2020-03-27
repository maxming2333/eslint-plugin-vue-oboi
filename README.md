# eslint-plugin-vue-oboi

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-vue-oboi.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue-oboi)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-vue-oboi.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue-oboi)
[![License](https://img.shields.io/github/license/maxming2333/eslint-plugin-vue-oboi.svg?style=flat)](https://github.com/maxming2333/eslint-plugin-vue-oboi/blob/master/LICENSE.md)

> Supplement to [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), added several custom rules

![oboi](https://user-images.githubusercontent.com/8816730/74127556-ef3d0800-4c15-11ea-91e4-4d55707fe678.gif)

## Premise

Because this plugin and [vue/max-attributes-per-line](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/max-attributes-per-line.md) rules are conflicting drops

So you must ensure turn off the `vue/max-attributes-per-line` rule

```js
// .eslintrc.js
{
  'vue/max-attributes-per-line': 'off',
}
```

Since all properties are the same, it may cause the screen width to be exceeded

Thus triggering rules [max-len](https://eslint.org/docs/rules/max-len) and [vue/max-len](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/max-len.md)

If this happens, please turn off these two rules

```js
// .eslintrc.js
{
  'max-len': 'off',
  'vue/max-len': 'off',
}
```

## Usage

Because the rules of this plugin may conflict with many different rules

So it is recommended to reasonably disable other rules

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue-oboi/recommended',
  ],
  rules: {
    // Must to disable this rules
    'vue/max-attributes-per-line': 'off',

    // May need to disable these rules
    'max-len': 'off',
    'vue/max-len': 'off',

    // Rules for this plugin
    'vue-oboi/attributes-single-line': 'error',
    'vue-oboi/tag-delimiter-no-spaces': ['error', 'all'],
  },
}
```

## Rules

### vue-oboi/attributes-single-line

enforce all attributes to be on the same line.

```vue
<template>
  <!-- ✔ GOOD -->
  <div v-if="foo" class="bar"></div>

  <!-- ✘ BAD -->
  <div
  v-if="foo"
  class="bar"
  ></div>
</template>
```

### vue-oboi/tag-delimiter-no-spaces

enforce tag right delimiter no spaces.

```vue
<template>
  <!-- ✔ GOOD -->
  <div v-if="foo" class="bar"></div>

  <!-- ✘ BAD -->
  <div v-if="foo" class="bar"    ></div>
  <div v-if="foo" class="bar"
  ></div>
</template>
```

This rule is the same as the [`vue/html-closing-bracket-newline`](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-closing-bracket-newline.md) rule

```js
// .eslintrc.js
{
  'vue/html-closing-bracket-newline': ['error', {
    'singleline': 'never',
    'multiline': 'never'
  }],
}
```

#### Option

**all**: all space and line break, corresponding regular expression `/\s+/`

**enter**: all line break, corresponding regular expression `/[\f|\t|\v|\r|\n]+/`

**space**: all space, corresponding regular expression `/[ ]+/`

Example:

```js
// .eslintrc.js
{
  'vue-oboi/tag-delimiter-no-spaces': ['error', 'all'],
}
```

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).