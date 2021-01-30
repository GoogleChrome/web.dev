---
layout: handbook
title: Code
date: 2019-06-26
description: |
  Learn how to create well-formatted code samples for web.dev.
---

This post is about how to get sample code to look right in your piece and follow site conventions. For guidance about how to use code samples to support your writing goals, see the [Write useful code samples](/handbook/write-code-samples/) post.

## All code
Make all code samples [accessible](/handbook/inclusion-and-accessibility/#create-accessible-code-blocks).

## Inline code
Use single backticks to switch to code font in a line of text:

```markdown
 The value of the `type` attribute must be valid.
```

The value of the `type` attribute must be valid.

## Code blocks
Use triple backticks to create a code block.

Include the [language name](https://prismjs.com/#supported-languages) after the triple backticks to generate syntax highlighting:

````markdown
```html
<label>Choose a preferred trait:
  <select id="splinter" name="turtles">
    <option value="leonardo">Leads</option>
    <option value="donatello">Does machines</option>
  </select>
</label>
```
````

{% Aside 'warning' %}
Indented code blocks won't work on web.dev,
so make sure to use fenced code blocks as described above.
{% endAside %}

For code blocks that don't need syntax highlighting (for example, HTTP headers), set
the language to `text`:

````markdown
```text
Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```
````

For terminal commands, set the language to `bash` and omit leading `$` signs.

## Code highlighting
Highlight lines in a code block by adding a slash and the zero-indexed line numbers after the language name. For example, here's what `html/4-5` looks like:

```html/4-5
<label>Choose a preferred trait:
  <select id="splinter" name="turtles">
    <option value="leonardo">Leads</option>
    <option value="donatello">Does machines</option>
    <option value="raphael">Is cool but rude</option>
    <option value="michelangelo">Is a party dude</option>
  </select>
</label>
```

Show that lines have been removed by using a double slash. For example, here's what `html//2` looks like:

```html//2
<label>Choose a preferred trait:
  <select id="splinter" name="turtles">
    <option value="leonardo">Leads</option>
    <option value="donatello">Does machines</option>
    <option value="raphael">Is cool but rude</option>
    <option value="michelangelo">Is a party dude</option>
  </select>
</label>
```

Show that lines have changed by using the pattern `language/lineNumAdded/lineNumRemoved`. For example, here's what `html/6/5` looks like:

```html/6/5
<label>Choose a preferred trait:
  <select id="splinter" name="turtles">
    <option value="leonardo">Leads</option>
    <option value="donatello">Does machines</option>
    <option value="raphael">Is cool but rude</option>
    <option value="michelangelo">Is a party dude</option>
    <option value="michelangelo">Is a party animal</option>
  </select>
</label>
```


## Coding Style
Indent using two spaces.

Always use straight quotes. (Readers often copy code directly from the site, and smart quotes can break code.)

{% Compare 'worse' %}
`const imagemin = require(‘imagemin’);`
{% endCompare %}

{% Compare 'better' %}
`const imagemin = require('imagemin');`
{% endCompare %}
