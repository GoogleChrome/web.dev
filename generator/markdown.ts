import * as marked from 'marked';

// nb. mirror Marked's replacement code,
// as its `escape` method is not exposed to users.

const escapeReplace = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements: {[ch: string]: string} = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',  // eslint-disable-line quotes
};

function escape(raw: string) {
  return raw.replace(escapeReplace, (ch) => escapeReplacements[ch]);
}

class Renderer extends marked.Renderer {
  code(code: string, lang: string, escaped: boolean) {
    let className = 'prettyprint';
    if (lang) {
      // we set langPrefix below, so might as well use the option here
      className += ` lang-${lang}`;
    }
    if (!escaped) {
      code = escape(code);
    }

    // DevSite doesn't expect a `<code>` block,
    // it just looks for `<pre class="prettyprint">`.
    return `<pre class="${className}">${code}</pre>`;
  }
}

const renderer = new Renderer();

export function markdown(text: string) {
  return marked(text, {renderer, langPrefix: 'lang-'});
}
