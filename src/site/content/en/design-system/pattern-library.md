---
title: 'Pattern Library'
permalink: '/design-system/pattern-library/index.html'
layout: 'design-system-documentation.njk'
---

## Todo

- Flesh out more information about patterns

## Includes

Including partials within partials works exactly the same as within Eleventy templates. The include base is set to `src/site/_includes`.

For example, if you want to include an icon from `src/site/_includes/icon`, you could write the following.

{% raw %}

```html
<div>{% include "icons/my-icon.svg" %}</div>
```

{% endraw %}

{% Aside %}

In the context of icons, it is recommended that you use the icon macro, which enables you to pass additional arguments like `class` or `aria-label`.

{% raw %}

```html
{% from 'macros/icon.njk' import icon, svg with context %}

<div>
  {{ svg('../../../images/lockup.svg', {label: 'web.dev', className:
  'course-app-bar__logo'}) }}
</div>
```

{% endraw %}

{% endAside %}
