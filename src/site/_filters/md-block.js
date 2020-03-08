const md = require("markdown-it");
const Prism = require("prismjs");

const markdownItOptions = {
  html: true,
  highlight: function(str, lang) {
    // TODO (mfriesenhahn): Abstract this so it doesn't duplicate 11ty config
    // TODO (mfriesenhahn): Figure out why line breaks are ignored
    if (lang && Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang], "" + lang + "");
    }

    return ""; // use external default escaping
  },
};

const mdLib = md(markdownItOptions);

// custom renderer rules
const fence = mdLib.renderer.rules.fence;

const rules = {
  fence: (tokens, idx, options, env, slf) => {
    const fenced = fence(tokens, idx, options, env, slf);
    return `<web-copy-code>${fenced}</web-copy-code>`;
  },
  table_close: () => "</table>\n</div>",
  table_open: () => '<div class="w-table-wrapper">\n<table>\n',
};

mdLib.renderer.rules = {...mdLib.renderer.rules, ...rules};

/**
 * Render content as markdown.
 * @param {string} content
 * @return {?string}
 */
module.exports = (content) => {
  if (!content) {
    return;
  }
  return mdLib.render(content);
};
