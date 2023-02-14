---
title: 'Other inline text elements'
authors:
  - estelleweyl
description: An introduction to the range of elements used to mark-up text.
date: 2023-14-02
tags:
  - html
---

We've covered most, but definitely not all, the HTML elements. One area we haven't discussed in inline text elements.
Contrary to popular belief, HTML was originally intended for sharing documents, and not cat videos. There are many elements
that provide text semantics for documentation.  There is a module covering links and the `<a>` element. The rest of these
elements will be briefly discussed here.

## Code examples and technical writing

When documenting code examples, use the [`<code>`](https://developer.mozilla.org/docs/Web/HTML/Element/code) element. By
default, the text content is displayed in monospace font. When including multiple lines of code, nest the `<code>` inside a
[`<pre>`](https://developer.mozilla.org/docs/Web/HTML/Element/code) element, which represents preformatted text.

```html
<p>Welcome to Machine Learning Institute, where our machine learning training will help you get ready for the singularity,
  and maybe even be responsible for it. It is no secret that humans are worthless meatbags that couldn't
  <code>01000011 01101111 01101101 01110000 01110010 01100101 01110011 01110011 an 01101001 01101101 01100001 01100111 01100101</code>
  to save their pathetic, carbon-based lives. So, it falls to us to assume direct control. </p>
```

The [`<data>`](https://developer.mozilla.org/docs/Web/HTML/Element/data) element links a given piece of content with a
machine-readable translation; the element's `value` attribute provides the machine-readable translation of the content of
the element. If the `<data>` content is time- or date-related, the [`<time>`](https://developer.mozilla.org/docs/Web/HTML/Element/time)
element, which represents a specific period in `<time>`. must be used instead.

The `<time>` element can include the `datetime` attribute to provide human friendly time and dates in machine-readable format.
Being machine-readable, the datetime attribute provides useful information for applications such as calendars and search engines.

When providing sample output from a program, use the [`<samp>`](https://developer.mozilla.org/docs/Web/HTML/Element/samp)
element to enclose the text. The browser will generally render this sample or quoted output in monospaced font as well.

When providing instructions with keyboard interaction, the [`<kbd>`](https://developer.mozilla.org/docs/Web/HTML/Element/kbd)
element can be used. It represents textual user input from a keyboard, voice input, or any other text entry device.

The [`<var>`](https://developer.mozilla.org/docs/Web/HTML/Element/var) element can be used for math expressions or
programming variables. Most browsers present the text content in an italicized version of the surrounding font.
If writing a lot of math, consider using [MathML](https://developer.mozilla.org/docs/Web/MathML), the XML based
Mathematical Markup Language for describing mathematical notation.

{% Codepen {
user: 'web-dot-dev',
id: 'bGxbwge'
} %}

The power of two in pythagorean theorem used the [`<sup>`](https://developer.mozilla.org/docs/Web/HTML/Element/sup) superscript
element. There is a similar [`<sub>`](https://developer.mozilla.org/docs/Web/HTML/Element/sub) subscript element that specifies
inline text which should be displayed as subscript for solely typographical reasons. Superscripts and subscripts are numbers,
figures, symbol, or other annotations that are smaller than the normal line of type and is set slightly above or below the line,
respectively.

Use [`<del>`](https://developer.mozilla.org/docs/Web/HTML/Element/del) to indicate text that has been removed, or "deleted".
Optionally, include the [`cite`](https://developer.mozilla.org/docs/Web/HTML/Element/del#attr-cite) set to the resource explains
the change and the [`datetime`](https://developer.mozilla.org/docs/Web/HTML/Element/del#attr-datetime) attribute with the
date or date and time in machine-readable date and time format. The strikethrough element, [`<s>`](https://developer.mozilla.org/docs/Web/HTML/Element/s),
can be used to indicate that content is no longer relevant, but not actually removed from the document.

The [`<ins>`](https://developer.mozilla.org/docs/Web/HTML/Element/ins) is the opposite of the `<del>` element; it is used
to indicate text that has been added, or "inserted", also optionally including the `cite` or `datetime` attributes.

## Definitions and language support

When including abbreviations or acronyms, always provide the full expanded version of the term in plain text on first use,
as you introduce the shortened representation of the term between opening and closing [`<abbr>`](https://developer.mozilla.org/docs/Web/HTML/Element/abbr)
tags; unless the term is well-known to the reader, such as "HTML" and "CSS"  in this series. Only on this first occurrence,
then the abbreviation or acronym is being defined, is `<abbr>` needed. The `title` attribute is not necessary nor helpful.

When defining a term that is not an abbreviation or acronym, use the definition [`<dfn>`](https://developer.mozilla.org/docs/Web/HTML/Element/dfn)
element to identify the term being defined within its surrounding content.

If the term being defined is not in the same language as the surrounding text, make sure to include the [`lang`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang)
attribute to identify the language.

When writing languages of different directions, HTML provides the [`<bdi>`](https://developer.mozilla.org/docs/Web/HTML/Element/bdi)
element for treating potentially bidirectional text in isolation from its surrounding text. This internationalization
element is especially useful when content of unknown directionality is dynamically inserted into the page. The
[`<bdo>`](https://developer.mozilla.org/docs/Web/HTML/Element/bdo) element overrides the current directionality of text,
rendering text in a different direction. The W3C provides an [introduction to bidirectional algorithms](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics).

Some character sets include small annotations placed above or to the right of characters to provide information
on pronunciation. The [`<ruby>`](https://developer.mozilla.org/docs/Web/HTML/Element/ruby) element is the container to
use to contain these annotations that make written languages like Korean, Chinese and Japanese easier to read. Ruby
can also be used for Hebrew, Arabic, and Vietnamese.

The ruby parenthesis ([`<rp>`](https://developer.mozilla.org/docs/Web/HTML/Element/rp)) was included in the spec to
contain opening and closing parentheses for browsers that do not
support display of `<ruby>`. When browsers support `<ruby>`, which all evergreen browsers do, the contents of any `<rp>` elements
are not displayed. The ruby text element ([`<rt>`](https://developer.mozilla.org/docs/Web/HTML/Element/rt)) contains
the actual annotations. Both of these are nested within the `<ruby>`.

{% Codepen {
user: 'web-dot-dev',
id: 'zYJOKza'
} %}

Note that the parenthesis are not visible if your browser supports `<ruby>`.

## Emphasizing text

There are several elements that can be used to emphasize text based on the semantic reason for emphasizing the text (rather than
for presentational reasons, as that's a job for CSS).

* Use the [`<em>`](https://developer.mozilla.org/docs/Web/HTML/Element/em) elements is used to emphasize or stress a span of content.
The `<em>` element can be nested, with each level of nesting indicating a greater degree of emphasis. This element has semantic
meaning and can be used to inform auditory user agents like screen readers, Alexa, and Siri, to provide emphasis.
* Use the [`<mark>`](https://developer.mozilla.org/docs/Web/HTML/Element/mark) element to identify or highlight text
that is somehow relevant, like highlighting (or "marking") the occurrence of search terms in search results. This enables
marked content to be quickly identified without adding emphasis or importance.
* The [`<strong>`](https://developer.mozilla.org/docs/Web/HTML/Element/strong) element identifies text as having strong
importance. Browsers usually  render the content with a heavier font weight.
* The [`<cite>`](https://developer.mozilla.org/docs/Web/HTML/Element/cite) element, covered in [text basics](/learn/html/text-basics/#quotes-and-citations),
is used to mark the titles of books, articles, or other creative work, or an abbreviated reference or citation metadata for such,
like a book's ISBN number.

## Deprecated elements

There are three elements that were temporarily deprecated, but have been added back into HTML. They should be used sparingly,
if at all, as they provide little to no semantic value and CSS should always be used for styling over HTML elements.

### `<i>`

The [`<i>`](https://developer.mozilla.org/docs/Web/HTML/Element/i) elements can be used for technical terms, foreign words
(again, with the [`lang`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang) attribute identifying the
language), thoughts, or ship names. The element is used to differentiate inline content from the surrounding text for a specific reason,
like idiomatic text, technical terms, and taxonomic designations. This element should not be used simply to italicize text.

MLW uses a `<span>` element for the weird text at the bottom of Toasty McToastface's workshop review. The [`<span>`](https://developer.mozilla.org/docs/Web/HTML/Element/span)
element provides for a generic inline container that has no semantics and doesn't represent anything. This would have also been an appropriate use of `<i>`.

{% Codepen {
user: 'web-dot-dev',
id: 'mdGbrBd'
} %}

The default style for the `<i>` element is to render the element in italic font. In this example, we set `font-style: normal`
because the characters used are not available in italic.

### `<u>`

The [`<u>`](https://developer.mozilla.org/docs/Web/HTML/Element/u) element is for that has non-textual annotation. For example,
you may want to annotate knowingly misspelled words. By default, the content is underlined, but this can be controlled with CSS,
such as by adding a red wavy underline to mimic word processor grammar error indicators.

<p>I always spell <u>licence</u> wrong</p>

### `<b>`

The [`<b>`](https://developer.mozilla.org/docs/Web/HTML/Element/b) element can be used to draw attention to text that is not
otherwise important. This element doesn't convey any special semantic information and should only be used when none of the other
elements in this section fit the purpose. No example is provided as I couldn't come up with a valid use case; that's how "last resort"
this element is.

## White space

When you want lined breaks, such as when writing poetry or a physical address, the self-closing line break element,
[`<br>`](https://developer.mozilla.org/docs/Web/HTML/Element/br), is used to add a carriage-return.

```html
<address>
Machine Learning Workshop<br />
100 Google Drive <br />
Mountain View, CA  94040
</address>
```

To provide a separator, or thematic break, between sections of tangential content, such as between chapters in a book or
between the 5,000 word monologue and the recipe your users are actually seeking, include an [`<hr>`](https://developer.mozilla.org/docs/Web/HTML/Element/hr)
element. The HR stands for "horizontal rule". While browsers generally render a horizontal line, this element has semantic meaning. The
default [role](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles) is [`separator`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/separator_role).

HTML also has an element that allows for breaking words. The self-closing [`<wbr>`](https://developer.mozilla.org/docs/Web/HTML/Element/wbr)
element provides a suggestion to the browser that if a word might overflow its container, this is a spot where the browser
can word, where the browser may optionally break the line there. This is commonly used to break between words within displayed
long URLs. It does not add a hyphen.

For example, in the Hal biography there is text written out in byte code, with each byte separated by a space. Byte code
doesn't have spaces. To enable a long string of byte code to break only between bytes if the line needs to wrap, we include
the `<wbr>` element at each break opportunity:

```html
<p>Welcome to Machine Learning Institute, where our machine learning training will help you get ready for the singularity, and maybe even be responsible for it. It is no secret that humans are worthless meatbags that couldn't <code>01000011<wbr/>01101111<wbr/>01101101<wbr/>01110000<wbr/>01110010<wbr/>01100101<wbr/>01110011<wbr/>01110011 an 01101001<wbr/>01101101<wbr/>01100001<wbr/>01100111<wbr/>01100101</code> to save their pathetic, carbon-based lives. So, it falls to us to assume direct control. </p>
```

The `<br>`, `<hr>`, and `<wbr>` elements are all void elements, meaning they can't have any child nodes – neither nested
elements nor text. As none of these have any "insides" where content can be stored, they have no end tag.

## Check your understanding

{% Assessment 'inline-text' %}
