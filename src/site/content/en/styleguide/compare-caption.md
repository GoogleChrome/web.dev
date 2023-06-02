---
layout: post
title: '{% CompareCaption %}'
---

<style>
  .webdev-caption {
    opacity: 0.8;
    font-size: 0.8em;
  }
</style>

#### Add a `nonce` attribute to `<script>` elements

With a nonce-based CSP, every `<script>` element must have a `nonce` attribute
which matches the random nonce value specified in the CSP header (all scripts
can have the same nonce). The first step is to add these attributes to all
scripts:

{% Compare 'worse', 'Blocked by CSP'%}

```html
<script src="/path/to/script.js"></script>
<script>foo()</script>
```

{% CompareCaption %}
CSP will block these scripts, because they don't have
`nonce` attributes.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Allowed by CSP' %}

```html
<script nonce="${NONCE}" src="/path/to/script.js"></script>
<script nonce="${NONCE}">foo()</script>
```

{% CompareCaption %}
CSP will allow the execution of these scripts if `${NONCE}`
is replaced with a value matching the nonce in the CSP response header. Note
that some browsers will hide the `nonce` attribute when inspecting the page
source.
{% endCompareCaption %}

{% endCompare %}
