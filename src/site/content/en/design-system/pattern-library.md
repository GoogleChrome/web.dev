---
title: 'Pattern Library'
permalink: '/design-system/pattern-library/index.html'
layout: 'design-system-documentation.njk'
---

## Todo

- Flesh out more information about patterns

## Includes

Including partials within partials works exactly the same as within Eleventy templates. The include base is set to `src/site/_includes`.

For example, if you want to include an icon from `src/site/_includes/icon`, you would write the following.

{% raw %}

```html
<div>{% include "icons/my-icon.svg" %}</div>
```

{% endraw %}
