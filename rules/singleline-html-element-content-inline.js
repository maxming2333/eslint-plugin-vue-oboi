const utils = require('eslint-plugin-vue/lib/utils');
const casing = require('eslint-plugin-vue/lib/utils/casing');
const INLINE_ELEMENTS = require('eslint-plugin-vue/lib/utils/inline-non-void-elements.json');

/**
 * @param {VElement & { endTag: VEndTag } } element
 */
function isSinglelineElement(element) {
  return element.loc.start.line === element.endTag.loc.start.line;
}

function isSingleChildElement(element) {
  if (!element.children || !element.children.length) {
    return false;
  }

  return !(element.children.every(elem => elem.type === 'VText' || elem.type === 'VExpressionContainer'));
}

/**
 * Check whether the given element is inline or not.
 * This ignores whitespaces, doesn't ignore comments.
 * @param {VElement & { endTag: VEndTag } } node The element node to check.
 * @param {SourceCode} sourceCode The source code object of the current context.
 * @returns {boolean} `true` if the element is empty.
 */
function isInline(node, sourceCode) {
  const start = node.startTag.range[1];
  const end = node.endTag.range[0];
  return !/\r|\n/i.test(sourceCode.text.slice(start, end).trim());
}

/**
 * @param {any} options
 */
function parseOptions(options) {
  return Object.assign(
    {
      ignores: ['pre', 'textarea', ...INLINE_ELEMENTS],
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
    },
    options,
  );
}

/**
 * Check whether the given element is empty or not.
 * This ignores whitespaces, doesn't ignore comments.
 * @param {VElement & { endTag: VEndTag } } node The element node to check.
 * @param {SourceCode} sourceCode The source code object of the current context.
 * @returns {boolean} `true` if the element is empty.
 */
function isEmpty(node, sourceCode) {
  const start = node.startTag.range[1];
  const end = node.endTag.range[0];
  return sourceCode.text.slice(start, end).trim() === '';
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'require no line break before and after the contents of a singleline element',
      category: 'strongly-recommended',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreWhenNoAttributes: {
            type: 'boolean',
          },
          ignoreWhenEmpty: {
            type: 'boolean',
          },
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unexpectedAfterClosingBracket: 'Expected no line break after opening tag (`<{{name}}>`), but line breaks found.',
      unexpectedBeforeOpeningBracket: 'Expected no line break before closing tag (`</{{name}}>`), but line breaks found.',
    },
  },
  create(context) {
    const options = parseOptions(context.options[0]);
    const { ignores } = options;
    const { ignoreWhenNoAttributes } = options;
    const { ignoreWhenEmpty } = options;
    const template = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore();
    const sourceCode = context.getSourceCode();

    let inIgnoreElement = null;

    function isIgnoredElement(node) {
      return (
        ignores.includes(node.name) ||
        ignores.includes(casing.pascalCase(node.rawName)) ||
        ignores.includes(casing.kebabCase(node.rawName))
      );
    }

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (inIgnoreElement) {
          return;
        }
        if (isIgnoredElement(node)) {
          // ignore element name
          inIgnoreElement = node;
          return;
        }
        if (node.startTag.selfClosing || !node.endTag) {
          // self closing
          return;
        }

        const elem = node;

        if (isSinglelineElement(elem)) {
          return;
        }

        if (ignoreWhenNoAttributes && elem.startTag.attributes.length === 0) {
          return;
        }

        if (elem.type !== 'VElement') {
          return;
        }

        if (isSingleChildElement(elem)) {
          return;
        }

        if (!isInline(elem, sourceCode)) {
          return;
        }

        const getTokenOption = {
          includeComments: true,
          filter: (token) => token.type !== 'HTMLWhitespace',
        };
        if (
          ignoreWhenEmpty &&
          elem.children.length === 0 &&
          template.getFirstTokensBetween(
            elem.startTag,
            elem.endTag,
            getTokenOption,
          ).length === 0
        ) {
          return;
        }

        const contentFirst = template.getTokenAfter(elem.startTag, getTokenOption);
        const contentLast = template.getTokenBefore(elem.endTag, getTokenOption);

        if (elem.startTag.range[1] !== contentFirst.range[0]) {
          context.report({
            node: template.getLastToken(elem.startTag),
            loc: {
              start: elem.startTag.loc.end,
              end: contentFirst.loc.start,
            },
            messageId: 'unexpectedAfterClosingBracket',
            data: {
              name: elem.rawName,
            },
            fix(fixer) {
              const range = [elem.startTag.range[1], contentFirst.range[0]];
              return fixer.replaceTextRange(range, '');
            },
          });
        }

        if (isEmpty(elem, sourceCode)) {
          return;
        }

        if (contentLast.range[1] !== elem.endTag.range[0]) {
          context.report({
            node: template.getFirstToken(elem.endTag),
            loc: {
              start: contentLast.loc.end,
              end: elem.endTag.loc.start,
            },
            messageId: 'unexpectedBeforeOpeningBracket',
            data: {
              name: elem.rawName,
            },
            fix(fixer) {
              const range = [contentLast.range[1], elem.endTag.range[0]];
              return fixer.replaceTextRange(range, '');
            },
          });
        }
      },
      'VElement:exit': function (node) {
        if (inIgnoreElement === node) {
          inIgnoreElement = null;
        }
      },
    });
  },
};
