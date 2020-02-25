module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce tag right delimiter no spaces.',
      category: 'strongly-recommended',
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: [ 'all', 'enter', 'space' ],
      },
    ],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const options = context.options[0] || 'all';
    const template = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore();
    const optionsReg = options === 'enter' ? /[\f|\t|\v|\r|\n]+/ : /[ ]+/;

    function getRightDelimiterPrevToken(node) {
      if (!node.attributes.length) {
        return template.getFirstToken(node);
      }
      return node.attributes[node.attributes.length - 1];
    }

    function getReplaceRightDelimiterRange(node) {
      const lastToken = getRightDelimiterPrevToken(node);
      const start = lastToken.range[1];
      const end = node.range[1] - 1;
      return [ start, end ];
    }

    function getRelativePosition(node, range) {
      const rangeStart = node.range[0];
      return [ range[0] - rangeStart, range[1] - rangeStart ];
    }

    function analysisRange(text, rangeStart, ranges = []) {
      if (options === 'all') return ranges;
      return text.split('').reduce((ret, item, index) => {
        if (optionsReg.test(item)) {
          const itemRangeStart = rangeStart + index;
          const prevRange = ret[ret.length - 1];
          // 如果不是连续的，就出现一个新的区间，如果是连续的，就合并为一个区间
          if (prevRange && (prevRange[1] === itemRangeStart)) {
            prevRange[1] = itemRangeStart + 1;
          } else {
            ret.push([ itemRangeStart, itemRangeStart + 1 ]);
          }
        }
        return ret;
      }, ranges);
    }

    function getReplaceRangesByRules(node, range) {
      const text = sourceCode.getText(node).substring(...getRelativePosition(node, range));
      const ranges = [];
      if (!text) return ranges;
      if (options === 'all') {
        if (/\s+/.test(text)) {
          ranges.push(range);
        }
      }
      return analysisRange(text, range[0], ranges);
    }

    function showErrors(node, range) {
      const ranges = getReplaceRangesByRules(node, range);
      if (!ranges.length) return;
      ranges.forEach(rangeItem => {
        context.report({
          node,
          loc: {
            start: sourceCode.getLocFromIndex(rangeItem[0]),
            end: sourceCode.getLocFromIndex(rangeItem[1]),
          },
          message: '\'{{name}}\' tag delimiter should no {{spacesType}}.',
          data: {
            name: template.getFirstToken(node).value,
            spacesType: options === 'all' ? 'space or enter' : options,
          },
          fix: fixer => {
            return fixer.replaceTextRange(rangeItem, '');
          },
        });
      });
    }

    return context.parserServices.defineTemplateBodyVisitor({
      VStartTag(node) {
        if (node.selfClosing) return;
        const range = getReplaceRightDelimiterRange(node);
        if (range[0] < range[1]) {
          return showErrors(node, range);
        }
      },
    });
  },
};
