---
title: '{% Compare %}'
---

#### `<snap-tabs>` layout {: #tabs-layout }

The top level layout I chose was flex (Flexbox). I set the direction to
`column`, so the header and section are vertically ordered. This is our first
scroll window, and it hides everything with overflow hidden. The header and
section will employ overscroll soon, as individual zones.

{% Compare 'better', 'HTML' %}
```html
<snap-tabs>
  <header></header>
  <section></section>
</snap-tabs>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
snap-tabs {
  display: flex;
  flex-direction: column;

  /* establish primary containing box */
  overflow: hidden;
  position: relative;

  & > section {
    /* be pushy about consuming all space */
    block-size: 100%;
  }

  & > header {
    /* defend against <section> needing 100% */
    flex-shrink: 0;
    /* fixes cross browser quarks */
    min-block-size: fit-content;
  }
}
```
{% endCompare %}


## New powers {: #new-powers }

The new abilities that Catalina brought to the system font are now available to web developers as of Chromium 83. The `system-ui` font now **has more variable settings**: optical sizing and 2 unique weight adjustments:

{% Compare 'worse', 'Mojave' %}
```css
h1 {
  font-family: system-ui;
  font-weight: 700;
  font-variation-settings:
    'wght' 750
  ;
}

```

{% endCompare %}

{% Compare 'better', 'Catalina' %}
```css/5-7
h1 {
  font-family: system-ui;
  font-weight: 700;
  font-variation-settings:
    'wght' 750,
    'opsz' 20,
    'GRAD' 400,
    'YAXS' 400
  ;
}

```

{% endCompare %}