/**
 * @fileoverview Define a style for the props casing in templates.
 * @author keroming
 */


const utils = require('eslint-plugin-vue/lib/utils');
const casing = require('eslint-plugin-vue/lib/utils/casing');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function eraseTextFormat(text) {
  return text.toLowerCase().replace(/-|\s/g, '');
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce attribute naming style on custom components in template',
      category: 'strongly-recommended',
      url: 'https://eslint.vuejs.org/rules/attribute-hyphenation.html',
    },
    fixable: 'code',
    schema: [
      {
        enum: [ 'always', 'never' ],
      },
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: {
              allOf: [
                { type: 'string' },
                { not: { type: 'string', pattern: ':exit$' } },
                { not: { type: 'string', pattern: '^\\s*$' } },
              ],
            },
            uniqueItems: true,
            additionalItems: false,
          },
          ignoreTag: {
            type: 'array',
            items: {
              allOf: [
                { type: 'string' },
                { not: { type: 'string', pattern: ':exit$' } },
                { not: { type: 'string', pattern: '^\\s*$' } },
              ],
            },
            uniqueItems: true,
            additionalItems: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const option = context.options[0];
    const optionsPayload = context.options[1];
    const useHyphenated = option !== 'never';
    let ignoredAttributes = [ 'data-', 'aria-', 'slot-scope' ];
    let ignoredTags = [ ];

    if (optionsPayload && optionsPayload.ignore) {
      ignoredAttributes = ignoredAttributes.concat(optionsPayload.ignore);
    }

    if (optionsPayload && optionsPayload.ignoreTag) {
      ignoredTags = ignoredTags.concat(optionsPayload.ignoreTag.map(tag => eraseTextFormat(tag)));
    }

    const caseConverter = casing.getConverter(useHyphenated ? 'kebab-case' : 'camelCase');

    function reportIssue(node, name) {
      const text = sourceCode.getText(node.key);

      context.report({
        node: node.key,
        loc: node.loc,
        message: useHyphenated ? "Attribute '{{text}}' must be hyphenated." : "Attribute '{{text}}' can't be hyphenated.",
        data: {
          text,
        },
        fix: fixer => fixer.replaceText(node.key, text.replace(name, caseConverter(name))),
      });
    }

    function isIgnoredAttribute(value) {
      const isIgnored = ignoredAttributes.some(function(attr) {
        return value.indexOf(attr) !== -1;
      });

      if (isIgnored) {
        return true;
      }

      return useHyphenated ? value.toLowerCase() === value : !/-/.test(value);
    }

    function isIgnoredTag(value) {
      return ignoredTags.some(function(attr) {
        return value.indexOf(eraseTextFormat(attr)) !== -1;
      });
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.defineTemplateBodyVisitor(context, {
      VAttribute(node) {
        if (!utils.isCustomComponent(node.parent.parent)) return;

        const name =
           !node.directive ? node.key.rawName
             : node.key.name.name === 'bind' ? node.key.argument && node.key.argument.rawName
               : /* otherwise */ false;

        if (!name || isIgnoredTag(node.parent.parent.rawName) || isIgnoredAttribute(name)) return;

        reportIssue(node, name);
      },
    });
  },
};
