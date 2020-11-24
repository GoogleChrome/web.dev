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

For terminal commands, set the language to `bash` and omit leading `$` signs:

````markdown
```bash
npm install left-pad
```
````

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

## Code tabs
You may need to add language- or tooling-dependent code instructions that look as follows:

<web-tabs>
  <div data-label="HTML">
    <pre>
      <code>

        ```
          <div id="foo">Foo!</div>
        ```
      </code>
    </pre>
  </div>
  <div data-label="CSS">
    <pre>
      <code>
        #foo {
          background-color: red;
        }
      </code>
    </pre>
  </div>
  <div data-label="JavaScript">
    <pre>
      <code>
        const el = document.getElementById("foo");
      </code>
    </pre>
  </div>
</web-tabs>

To create tabs with code that look as above, use the following markup:

```html
<web-tabs>
  <div data-label="HTML">
    <pre>
      <code>

        ```
          <div id="foo">Foo!</div>
        ```
      </code>
    </pre>
  </div>
  <div data-label="CSS">
    <pre>
      <code>
        #foo {
          background-color: red;
        }
      </code>
    </pre>
  </div>
  <div data-label="JavaScript">
    <pre>
      <code>
        const el = document.getElementById("foo");
      </code>
    </pre>
  </div>
</web-tabs>
```

{% Details %}
{% DetailsSummary %}
How to add syntax highlighting to the code inside the tabs
{% endDetailsSummary %}
1. Prepare your tabs:
    ```html
    <web-tabs>
      <div data-label="HTML">
        <pre>
        </pre>
      </div>
      <div data-label="CSS">
        <pre>
        </pre>
      </div>
      <div data-label="JavaScript">
        <pre>
        </pre>
      </div>
    </web-tabs>
    ```
2. At another place in the markdown (it doesn't matter where, you'll delete this at Step 5): write
   the code instructions you want your tabs to contain. Use [triple
   backticks](/handbook/markup-code/#code-blocks) and specify the language.
3. Build the site, use DevTools to inspect the code instructions you've created at Step 2, and copy
   their HTML.
4. Paste the HTML you've copied into the tabs you've created at Step 1:
    ```html
    <web-tabs>
      <div data-label="HTML">
        <pre>
        // paste the code you copied
        </pre>
      </div>
      <!-- and so on -->
    </web-tabs>
    ```
5. Clean up: delete the code instructions you've created at Step 2.
{% endDetails %}


## Coding Style
Indent using two spaces.

Always use straight quotes. (Readers often copy code directly from the site, and smart quotes can break code.)

{% Compare 'worse' %}
`const imagemin = require(‘imagemin’);`
{% endCompare %}

{% Compare 'better' %}
`const imagemin = require('imagemin');`
{% endCompare %}
