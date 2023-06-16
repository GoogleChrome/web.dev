---
title: '{% BrowserCompat %}'
---
## Browser compatibility table {: #browsercompat }

With the `BrowserCompat` shortcode, you can embed an
[MDN - Browser Compatibility Data](https://github.com/mdn/browser-compat-data/)
widget in your post. You have to pass in the dot-separated feature ID,
as used on [BCD Schema](https://github.com/mdn/browser-compat-data), e.g. for
[Web/API/BackgroundFetchEvent](https://developer.mozilla.org/docs/Web/API/BackgroundFetchEvent)
the ID is `api.BackgroundFetchEvent`.

```text
{% raw %}{% verbatim %}{% BrowserCompat 'api.BackgroundFetchEvent' %}{% endverbatim %}{% endraw %}
```

{% BrowserCompat 'api.BackgroundFetchEvent' %}

The widget will use 🗑 symbols to represent features that are deprecated:

{% BrowserCompat 'api.Document.execCommand' %}

The following JavaScript snippet, run from the DevTools console, will display the correct ID for a given MDN page that's currently open:

```js
window.alert(document.querySelector(".bc-github-link")?.href.match(/title=(.+?)\+/)[1] ?? "No browser compat widget found on the page.")
```