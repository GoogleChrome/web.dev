---
page_type: guide
title: Style focus
author: robdodson
web_lighthouse: N/A
wf_blink_components: Blink>Accessibility
---

# Style focus

The focus indicator (often signified by a "focus ring") identifies the currently
focused element. For users who are unable to use a mouse, this indicator is
_extremely important_, as it acts as a stand-in for their mouse-pointer.

If the browser's default focus indicator clashes with your design you can use
CSS to restyle it. Just remember to keep your keyboard users in mind!

## Use :focus to always show a focus indicator

The [`:focus`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus)
pseudo-class matches any time an element is focused, regardless of the input
device (mouse, keyboard, stylus, etc.) or method used to focus it.

```css
button:focus {  
  outline: 4px dashed orange;  
}  
```

The button in this example will _always_ show a focus indicator. If you use a
mouse to click on it, or a keyboard to tab to it, the results are the same.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/focus-style?path=index.html&previewSize=100&attributionHidden=true"
    alt="focus-visible on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Use :focus-visible to selectively show a focus indicator

The new
[:focus-visible]([https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible))
pseudo-class matches any time an element receives focus and the browser
determines via heuristics that displaying a focus indicator would be beneficial
to the user.

If the most recent user interaction was via the keyboard; and the key press did
not include a meta, `ALT` / `OPTION`, or `CONTROL` key, then `:focus-visible`
will match.

_Note that `:focus-visible` is currently only supported in Chrome behind a flag,
but there is a [lightweight polyfill](https://github.com/WICG/focus-visible)
that can be added to your app to make it work._

```css
button:focus-visible {  
  outline: 4px dashed orange;  
}  
```

The button in this example will _selectively_ show a focus indicator. If you use
a mouse to click on it, or a keyboard to tab to it, the results are different.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/focus-visible-style?path=index.html&previewSize=100&attributionHidden=true"
    alt="focus-visible on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Use :focus-within to style the parent of a focused element

The
[:focus-within](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)
pseudo-class matches when an element receives focus, or if an element it
contains receive focus.

It can be used to highlight a region of the page, such as a form, to draw the
user's attention to that area.

```css
form:focus-within {
  background: #ffecb3;
}
```

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/focus-within-style?path=index.html&previewSize=100&attributionHidden=true"
    alt="focus-visible on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## When to display a focus indicator

A good rule of thumb is to ask yourself, "If you clicked on this control while
using a mobile device, would you expect it to display a keyboard?"

If the answer is "yes", then the control should probably _always_ show a focus
indicator, regardless of the input device used to focus it. A good example is
the `<input type="text">` element. Regardless of how it receives focus, the user
will need to continue to send it input via the keyboard, so it's helpful for it
to display a focus indicator.

If the answer is "no", then the control may choose to selectively show a focus
indicator. A good example is the `<button>` element. If a user clicks on it with
a mouse or touch screen, the action is complete and a focus indicator may no
longer be needed. If the user is _navigating_ with a keyboard it's useful to
show a focus indicator so they can decide whether or not they want to click the
control using the `ENTER` or `SPACE` keys.

## Avoid outline: none

The way browsers decide when to draw a focus indicator is, frankly, very
confusing. Changing the appearance of a `<button>` element with CSS, or giving
an element a `tabindex` will cause the browser's default focus ring behavior to
kick-in.

A very common anti-pattern is to remove the focus indicator using CSS such as:  

```css
/* Don't do this!!! */  
:focus {  
  outline: none;  
}  
```

A better way to work around this issue is to use a combination of `:focus` and
the `:focus-visible` polyfill.

```css
/*  
  This will hide the focus indicator if the element receives focus via the
mouse,  
  but it will still show up on keyboard focus.  
*/  
.js-focus-visible :focus:not(.focus-visible) {  
  outline: none;  
}

/*  
  Optionally: Define a strong focus indicator for keyboard focus.  
  If you choose to skip this step then the browser's default focus  
  indicator will be displayed instead.  
*/  
.js-focus-visible .focus-visible {  
  …  
}  
```

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/focus-visible?path=index.html&previewSize=100&attributionHidden=true"
    alt="focus-visible on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>
