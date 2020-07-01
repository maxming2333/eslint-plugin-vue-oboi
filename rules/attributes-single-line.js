module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce all attributes to be on the same line.',
      category: 'strongly-recommended',
    },
    fixable: 'whitespace',
    schema: [],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const template = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore();

    function showErrors(attributes) {
      attributes.forEach((prop, i) => {
        const fix = fixer => {
          if (i !== 0) return null;

          const prevToken = template.getTokenBefore(prop);

          const range = [ prevToken.range[1], prop.range[0] ];

          return fixer.replaceTextRange(range, ' ');
        };

        context.report({
          node: prop,
          loc: prop.loc,
          message: '\'{{name}}\' attribute should be on the same line.',
          data: { name: sourceCode.getText(prop.key) },
          fix,
        });
      });
    }

    function groupAttrsByLine(node) {
      return node.attributes.reduce((ret, current) => {
        if (node.loc.start.line !== current.loc.start.line) {
          ret.push([ current ]);
        }
        return ret;
      }, []);
    }

    return context.parserServices.defineTemplateBodyVisitor({
      VStartTag(node) {
        if (node.loc.start.line !== node.loc.end.line) {
          const groupAttrs = groupAttrsByLine(node);
          groupAttrs.forEach(attrs => {
            showErrors(attrs);
          });
        }
      },
    });
  },
};
