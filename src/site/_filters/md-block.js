const md = require('markdown-it');
const Prism = require('prismjs');

const markdownItOptions = {
  html: true,
  highlight: function (str, lang) {
    if (!lang) {
      // empty string means defer to the upstream escaping code built into markdown lib.
      return '';
    }

    let html;
    if (lang === 'text') {
      html = str;
    } else {
      html = Prism.highlight(str, Prism.languages[lang], '' + lang + '');
    }

    const lines = html.split('\n').slice(0, -1); // The last line is empty.

    // prettier-ignore
    return `<pre class="language-${lang}"><code class="language-${lang}">${lines.join('<br>')}</code></pre>`;
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
  table_close: () => '</table>\n</div>',
  table_open: () => '<div class="w-table-wrapper">\n<table>\n',
};

mdLib.renderer.rules = {...mdLib.renderer.rules, ...rules};

/**
 * Render content as markdown.
 * @param {string} content
 * @return {string|undefined}
 */
module.exports = (content) => {
  return content ? mdLib.render(content) : undefined;
};
