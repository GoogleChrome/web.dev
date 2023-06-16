---
title: '{% Details %}'
---

## Details

### Basic details component

{% Details %}

{% DetailsSummary %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

### Details component with preview

{% Details %}

{% DetailsSummary %}
Details _summary_
This is an optional preview. Make your preview text match the first paragraph
of your panel text.
{% endDetailsSummary %}

This is an optional preview. Make your preview text match the first paragraph
of your panel text.

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

### Details component with custom heading level

The default heading level is `h2`.
To ensure the `Details` component is in the correct place in the page hierarchy,
add a custom heading argument to the `DetailsSummary` shortcode.
For example, if the component is in an `h2` section,
use an `h3` heading.

{% Details %}

{% DetailsSummary 'h3' %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

### Details component in open state

The `Details` component is closed by default.
If for some reason you want it open,
add the `open` argument to the `Details` shortcode.

{% Details 'open' %}

{% DetailsSummary %}
Details _summary_
{% endDetailsSummary %}

Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.

{% endDetails %}

### Details used in the wild

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