---
title: 'Details'
---

{% Details %}
{% DetailsSummary %}
Explanation of _ancestor_, _parent_, and _descendant_
{% endDetailsSummary %}
The term descendant refers to the
fact that an item is contained somewhere inside of another. The opposite term is ancestor, which is
to say an item is contained by ancestors. For the next container up/down, these may use the more
specific terms parent/child. For example, imagine a document with a paragraph that has a link
inside. The link's parent is a paragraph, but it also has the document as an ancestor.
Conversely, the document may have many paragraph children, each with links. The links are all
descendants of the grandparent document.
{% endDetails %}


[Try to build a form](https://codepen.io/web-dot-dev/pen/c7d89671f738240187a86cda1074d554) where users can submit their favorite color.
The data should be sent as a `POST` request, and the URL where the data will be processed should be `/color`.

{% Details %}
{% DetailsSummary 'h3' %} Show form {% endDetailsSummary %}
One possible solution is using this form:

```html
<form method="post" action="/color">
    <label for="color">What is your favorite color?</label>
    <input type="text" name="color" id="color">
    <button>Save</button>
</form>
```

{% endDetails %}

Say you want a script running at `https://web.dev`
to process the form data—how would you do that?
[Try it out](https://codepen.io/web-dot-dev/pen/fbf90faccc7a22e208c2a507f33be598?editors=1100)!

{% Details %}

{% DetailsSummary 'h3' %} Toggle answer {% endDetailsSummary %}

You can select the location of the script by using the `action` attribute.

```html
<form action="https://example.com/animals">
...
</form>
```

{% endDetails %}

### Using mkcert: cheatsheet

{% Details %}
{% DetailsSummary %}
mkcert in short
{% endDetailsSummary %}

To run your local development site with HTTPS:

1.  Set up mkcert.

    If you haven't yet, install mkcert, for example on macOS:

    ```bash
    brew install mkcert

    ```

    Check [install mkcert](https://github.com/FiloSottile/mkcert#installation) for Windows and Linux instructions.

    Then, create a local certificate authority:

    ```bash
    mkcert -install
    ```

2.  Create a trusted certificate.

    ```bash
    mkcert {YOUR HOSTNAME e.g. localhost or mysite.example}
    ```

    This create a valid certificate (that will be signed by `mkcert` automatically).

3.  Configure your development server to use HTTPS and the certificate you've created in Step 2.
4.  ✨ You're done! You can now access `https://{YOUR HOSTNAME}` in your browser, without warnings

{% Aside 'caution' %}

Do this only for **development purposes** and **never export or share** the file `rootCA-key.pem` (if you need to know where this file is located to make sure it's safe, run `mkcert -CAROOT`).

{% endAside %}

{% endDetails %}
