---
title: 'BrowserCompat'
---

{% BrowserCompat %}
{% BrowserCompat "api.CSPViolationReportBody"%}
{% BrowserCompat "api.AnimationEffect"%}
{% BrowserCompat "api.Sanitizer"%}

{% BrowserCompat "css.types.filter_function.opacity"%}
{% BrowserCompat "css.types.min"%}

```css
.snaps {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'QWVmYLv',
  height: 700,
  tab: 'result'
} %}

Learn more about the potential of this CSS feature in this [huge and inspiring
Codepen collection](https://codepen.io/collection/KpqBGW) of around 25 demos.

<div class="compat-subject"><code>scroll-snap-type</code></div>
{% BrowserCompat 'css.properties.scroll-snap-type' %}

<div class="compat-subject"><code>scroll-snap-align</code></div>
{% BrowserCompat 'css.properties.scroll-snap-align' %}

<div class="compat-subject"><code>scroll-snap-stop</code></div>
{% BrowserCompat 'css.properties.scroll-snap-stop' %}

<div class="compat-subject"><code>overscroll-behavior</code></div>
{% BrowserCompat 'css.properties.overscroll-behavior' %}
