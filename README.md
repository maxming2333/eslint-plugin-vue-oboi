# eslint-plugin-vue-oboi

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-vue-oboi.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue-oboi)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-vue-oboi.svg?style=flat)](https://npmjs.org/package/eslint-plugin-vue-oboi)
[![License](https://img.shields.io/github/license/maxming2333/eslint-plugin-vue-oboi.svg?style=flat)](https://github.com/maxming2333/eslint-plugin-vue-oboi/blob/master/LICENSE.md)

> Supplement to [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), added several custom rules

![oboi](https://user-images.githubusercontent.com/8816730/74127556-ef3d0800-4c15-11ea-91e4-4d55707fe678.gif)

## Premise

Because this plugin and [vue/max-attributes-per-line](https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/max-attributes-per-line.md) rules are conflicting drops

So you must ensure that the `vue/max-attributes-per-line` rule is off

```js
// .eslintrc.js
{
  'vue/max-attributes-per-line': 'off',
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