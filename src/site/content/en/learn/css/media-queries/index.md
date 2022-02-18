---
title: Media Queries
description: Learn about media queries and how to use them to create responsive web designs.
audio:
  title: 'The CSS Podcast   - 036: Page Media'
  src: "https://traffic.libsyn.com/secure/force-cdn/highwinds/thecsspodcast/TCP032_v2.mp3?dest-id=189156"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - lozandier
date: 2022-02-20
---

*CSS media queries allow styles or stylesheets to be conditionally applied on specific media based on specific media conditions. Find out how to use them effectively within your stylesheets in this module.*

Suppose you had a group of cards arranged in one column on a small viewport, that you want to display as two and three columns when more space is available.


With CSS Media Queries you can solve this problem:

// TODO: Embedded video (Not YT) looped
{% YouTube "JLRFF56_S3U" %}

{% Codepen {
  user: 'web-dot-dev',
  id: 'YzryWpw',
  height: 700,
  tab: 'css, result'
} %}


Media Queries let you query from CSS the type of media that your page is being viewed on, and some of the conditions of that media. They allow you to apply different styles based on a true of false response to a set of conditions, for example:

Is the viewport wider than 30em?
Is the page being printed?



In CSS you apply a media query using the  `@media`  or `@import`  [at rules](https://thecsspodcast.libsyn.com/031-rules)  followed by the query itself.

To begin the module we placed cards on a grid with the following code:

```css
#cards {
  display: grid;
  grid-template: 1fr;
  gap: 2rem;
  width: 100%;
  padding: 10%;
  margin: 0;
  list-style: none;
  border: 2px solid magenta;
}

@media (min-width: 500px)  {
  #cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1053px )  {
  #cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media(min-width: 1280px) {
  #cards {
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr))
  }
}
```

The equivalent if the `@media` at-rule code blocks were located in a separate stylesheet  would be the following

```css
@import "meaningful-layout-tweaks-to-cards-on-larger-viewports.css" (min-width: 31.25em);
```

{% Aside 'warning' %}
Because of performance reasons, `@import` should be used with caution. It often is a better choice to use `link` or concatenating the imported styles instead.
{% endAside %}

## The anatomy of a media query

A  media query is a *media condition*: a set of options with associated rules to target specific media. 

The following diagram from [the specification of Media Queries](https://www.w3.org/TR/mediaqueries-5/) demonstrates the parts of a media query:

{% Img src="image/bMU6K5O6Yce7QrxAoaF3hsleaRM2/x3LX5AkH0JyJuR9v6GHj.png", alt="Diagram that demonstrates the typical parts of a media query. A media query represents a media condition that has an optional query modifier using 'only' or 'not'; a conditional optional media type, and zero or more media features surrounded by parentheses separated from one another by 'and' or 'or' keywords.", width="800", height="186" %}


The `not` query modifier keyword enables you to conditionally apply styles if the media condition after it does not evaluate to being true. True media conditions become false, and otherwise false media conditions become true, making `not` a *negation* operator.

For example, the following demo makes the screen purple and the text white only when the viewport is not oriented in a portrait manner:

// TODO: Embedded video (Not YT) looped
{% YouTube 'NEOwsHBClfY' %}

{% Codepen {
  user: 'web-dot-dev',
  id: 'GRMpmao',
  height: 700,
  tab: 'css,result'
} %}


Normally the following media query utilized by the demo would only apply if the medium the document is rendering on has a screen and was portrait oriented:
```css
@media screen and (orientation: portrait) {
  body {
    background: rebeccapurple;
    color: white;
  }

  body::after {
    content: "Landscape";
  }
}
```

With the use of the `not` query modifier keyword, the styles within the media query are conditionally applied if the medium *isn't* portrait oriented but screen-based:

```css
@media not screen and (orientation: portrait) {
  body {
    background: rebeccapurple;
    color: white;
  }

  body::after {
    content: "Landscape";
  }
}
```


### Media Types

Media types correspond to broad categories of devices. The following are well-supported media types.

* **all**: All media.

* **screen**: Media that has rendered the contents of the document the styles are applied to with a screen.

* **print**: Media that has rendered the contents of the document the styles in a way that’s optimized for print temporarily (for example print preview) or permanently.

* **speech**: Media that speaks the contents of the document.




#### Querying whether a medium is a particular type

In the following example, a document with a dark background is changed to a transparent background to save ink when printed. 

```css
@media print {
  --background-color: transparent;
  --primary-color: black;
}
```

// TODO: Embedded video (Not YT) looped
{% YouTube 'VLhGBT68N1k', {loop: "1"} %}

{% Codepen {
  user: 'web-dot-dev',
  id: 'OJxygKv',
  height: 700,
  tab: 'css,result'
} %}




### Media features

After identifying the type of media, media features can be used to identify various things about the environment and device the webpage is being displayed on.

The media queries used for responsive design are typically **range-type media queries**. These are typically used to test the width of the viewport and then adjust the layout for the best representation of the content.

The following demo uses `min-width` and `max-width` to classify whether a viewport within a typical web browser is “small”, “medium”, or “large”.

{% Codepen {
  user: 'web-dot-dev',
  id: 'gOGaxKQ',
  theme: 'dark',
  height: 700,
  tab: 'css,result'
} %}
{% YouTube 'SY7H4liaUEU' %}


{% Aside %}
While it’s common to initially resort to the use of media queries  for layout they may not be necessary. This is especially true for components where [CSS grid](https://web.dev/learn/css/grid/) or [Flexbox](/learn/css/flexbox/) can be used instead. 

Check out [Do you need a media query?](https://web.dev/learn/design/macro-layouts/#do-you-need-a-media-query) for more.
 {% endAside %}


#### Testing user preferences


Users can set preferences on their devices, such as requesting dark mode. You can query these media features, and respond to the preference.


For example, you can test the color-scheme preference of your user with `prefers-color-scheme`:

```css
@media (prefers-color-scheme: light) {
  /* Styles to apply if the user has explicitly indicated they prefer light color-themes or no preference indicated */
}

@media (prefers-color-scheme: dark) {
/* Styles to apply if the user has indicated they prefer dark color-themes */
}
```

The following demo adjusts the background of the demo depending on the user’s color scheme preference (a white background if they prefer light color schemes, or a dark background if they prefer a dark color scheme):

// TODO: Embedded video (Not YT) looped
{% YouTube 'laB4VoP9PZ0' %}

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNGjexW',
  theme: 'dark',
  height: 700,
  tab: 'css,result'
} %}


{% Aside %}
In addition to honoring the way people like to browse the web, testing for preferences can assist with making your content more accessible. The [`prefers-reduced-motion`](prefers-reduced-motion/) media feature allows you to test for a user preference for less motion, and dial down the animation used in your app.
{% endAside%}

#### Testing device capabilities


{% Aside %}
Many more media features exist.  [Check out CSS Trick’ s complete guide to media queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/) and the [MDN’s list of media features](https://developer.mozilla.org/docs/Web/CSS/@media#media_features) to learn more about the different media features you can query against in CSS.
{% endAside %}


### Logical Operators 

You can use logical operators within media queries.

1. The `and` keyword conditionally applies styles if all the media features are true.

2.  The `or`  keyword conditionally applies styles if any of the media features are true.

The following code example conditionally applies styles to a document if a medium has a screen, its screen is landscape-oriented, has an accurate pointing device, and is capable of outputting a color:

```css
@media (pointer: fine) and (orientation: landscape) and (color)   {
  /* Styles conditionally applied */
}
```

If a medium does not meet all these criteria, the styles won’t apply.

Alternatively, the media query could conditionally apply styles within the media if any of the media features applied:

```css
@media (pointer: fine) or (orientation: landscape) or (color) {
  /* Styles conditionally applied */
}
```


## Combining multiple media queries

In CSS multiple media queries can be combined by being represented as a comma separated list

For example you can conditionally apply styles to print and screen media with the following code example:

```css
@media screen, print {
  /* Styles */
}
```

When using the `not` query modifier, note that the operator operates on one media query at a time (does not extend beyond the media query it was intended for).

The following two code snippets are accordingly not equivalent
```css
@media not screen and (orientation: portrait), print {}
```
```css
@media not screen and (orientation: portrait), not print {}
```

## Resources
* [Web.dev’s Learn Responsive Web Design Course](https://web.dev/learn/design/)

*  [MDN’s Beginner’s guide to using Media Queries]([Beginner’s guide to media queries - Learn web development | MDN](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Media_queries)

* [A Complete Guide to CSS Media Queries - CSS-Tricks](https://css-tricks.com/a-complete-guide-to-css-media-queries/)

* [Media Queries for Standard Devices](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/)

* [Mediaquerie.es (Collection of inspirational websites using media queries and responsive Web design)](https://mediaqueri.es/)

{% Assessment 'media-queries' %}
