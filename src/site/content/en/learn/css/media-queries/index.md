---
title: Media Queries
description: >
  In this module learn the ways you can style backgrounds of boxes using CSS.
audio:
  title: 'The CSS Podcast - 036: Page Media'
  src: https://traffic.libsyn.com/secure/force-cdn/highwinds/thecsspodcast/TCP032_v2.mp3?dest-id=189156
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - lozandier
date: 2021-12-06
---

*CSS Media queries allows styles or stylesheets to be conditionally applied based on specific media conditions. Find out how to use them effectively within your stylesheets in this module.*

Suppose you had a group of cards that you had arranged to be in one column on a small viewport, but wanted them to line-up to two & three columns when more space is available for the cards.


With CSS Media Queries you can solve this problem:

{% Codepen {
  user: 'web-dot-dev',
  id: 'YzryWpw',
  theme: 'dark',
  height: 700,
  tab: 'css, result'
} %}

{% YouTube "JLRFF56_S3U" %}

Because the Web is agnostic, there became a need across standardized Web languages for Web developers to be able inquire whether or not a set of criteria applies to a medium. The result of that was the [Media Query]  standard, a normalized means to write a query with a `true` or `false` result whether certain media conditions hold true for a particular device the Web is being consumed on.

CSS styles are applied to documents that can be consumed in a medium other than browsers; accordingly media queries are a handy way for Web creatives to conditionally apply styles to fix, enhance, or maximize a document's usefulness accounting for particular media conditions applicable

In other words, keeping in mind `media` is plural for medium, CSS media queries allow you to apply styles originating from blocks of CSS or a stylesheet depending on medium-related conditions applicable to the device a user is viewing a particular document with. These media-related conditions include the capabilities you require a medium to have & even the users preferences being actively accommodated by the medium.

In CSS you apply a media query using either the  `@media`  or `@import`  [at rules](https://thecsspodcast.libsyn.com/031-rules)  followed by the [**media query**](l).

`@media` is used to conditionally apply styles based on a media query while `@link` conditionally loads a stylesheet based on a media query.

Media queries immediately follow the `@media`   at-rule, while media queries follows the URL to a stylesheet & optionally feature queries when used with the `@import` at-rule.

To begin the module we conditionally placed cards on a grid with the following code:

```css
#cards {
  display: grid;
  grid-template: 1fr;
  grid-gap: 2rem;
  width: 100%;
  padding: 10%;
  margin: 0;
  list-style: none;
  border: 2px solid magenta;
}

@media (min-width: 31.25em /* 500px */)  {
  #cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 65.8125em /* 1053px */)  {
  #cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media(min-width: 80em /* 1280px */) {
  #cards {
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr))
  }
}
```

The equivalent if the `@media` at-rule code blocks were co-located in a separate stylesheet  would be the following

```css
@import "meaningful-layout-tweaks-to-cards-on-larger-viewports.css" (min-width: 31.25em);
```

{% Aside 'warning' %}
Because of performance reasons, `@import` should be utilized with caution. It often is a better choice to use `link` or concatenating the styles you considered importing instead.
{% endAside %}

With all of this in mind, the following section goes over the constructs that make up a media query.

## The anatomy of a Media Query
A  media query is intrinsically a *media condition* consisting of the following:

* An optional query modifier to reverse the meaning of a query expression using the `not` keyword or to restrict styles against legacy media contexts  using the `only` keyword

*  A conditionally optional *media type*

* zero or more *media features*surrounded by parenthesis separated from one another by `and`/`or`  operands.

The following diagram from [the specification of Media Queries](https://www.w3.org/TR/mediaqueries-5/) demonstrates such parts of a media query:

{% Img src="image/bMU6K5O6Yce7QrxAoaF3hsleaRM2/x3LX5AkH0JyJuR9v6GHj.png", alt="Diagram that demonstrates the typical parts of a media query. A media query represents a media condition that has an optional query modifier using 'only' or 'not'; a conditional optional media type, and zero or more media features surrounded by parentheses seperated from one another by 'and' or 'or' keywords", width="800", height="186" %}

A media type is conditionally optional because a media type is by default `all` unless the use of `not` or `only` query modifier keywords begins the condition.

The `not` query modifier keyword enables you to conditionally apply styles if the media condition after it does not evaluate to being true. True media conditions become false, and otherwise false media conditions become true. Impacting media conditions in this manner makes `not` a *negation* operator.

For example, the following demo only makes the screen purple & the text white if the viewport the document associated with the styles *isn't* oriented in a portrait manner:

{% Codepen {
  user: 'web-dot-dev',
  id: 'GRMpmao',
  theme: 'dark',
  height: 700,
  tab: 'css,result'
} %}

{% YouTube 'NEOwsHBClfY' %}

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

The `only` query modifier keyword explicitly ensures that modern browsers must evaluate the media query to be true; matching ups with the criteria of  the media queries within the previous example’s `@media` at-rule blocks,  they can be re-written as demonstrated by the following code example:

```css
#cards {
  display: grid;
  grid-template: 1fr;
  grid-gap: 2rem;
  width: 100%;
  padding: 10%;
  margin: 0;
  list-style: none;
  border: 2px solid magenta;
}

@media only (min-width: 31.25em /* 500px */)  {
  #cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media only (min-width: 65.8125em /* 1053px */)  {
  #cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media only (min-width: 80em /* 1280px */) {
  #cards {
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr))
  }
}
```
{% Aside 'gotcha' %}
You maybe wondering why would there be a need for the `only` keyword if a media query  can return true or false. The need for `only` was needed to conditionally hide certain media queries involving a combination of media types and media features  incompatible of being interpreted correctly by some browsers older than the browsers typically used today.

Accordingly it can be ignored assuming you're conditionally applying styles to documents only intended to be consumable on the constantly updating browsers available today.
{% endAside%}

When neither keyword are used, this convenient default behavior of media type being assumed to be `all` by browsers allows the media queries within the example that began this module be written as they are for styles to be conditionally applied solely based on whether certain *media features* are supported of a particular medium the document is being viewed on; for our example particular [macro-layout]([Macro layouts](https://web.dev/learn/design/macro-layouts/)) styles are applied based on whether the document the styles are associated is on a medium can allows it to be at minimum `31.25em`, `65.8125em`, or `1280px` in width:

```css
@media (min-width: 31.25em /* 500px */)  {
  #cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 65.8125em /* 1053px */)  {
  #cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media(min-width: 80em /* 1280px */) {
  #cards {
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr))
  }
}

```

Instead of having to write the following if the default media type of media queries wasn't `all`:

```css
@media all and (min-width: 31.25em /* 500px */)  {
  #cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media all and (min-width: 65.8125em /* 1053px */)  {
  #cards {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
@media all and (min-width: 80em /* 1280px */) {
  #cards {
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr))
  }
}
```
{% Aside 'gotchas' %}
 If you decide to include the `not` or `only` query modifier keywords with your media query, you **must** specific a type.
{% endAside %}

Let’s have a deeper dive of such parts of a media condition, prioritizing the parts that are usually required or conventionally common in use.

### Media Types

Media types correspond to broad categorizations of devices.  The following are prevalent or well-supported media types browser supports.

* **all**: All media

* **screen**: Media that has rendered the contents of the document the styles are applied to with a screen

* **print**: Media that has rendered the contents of the document the styles in a way that’s optimized for print temporarily (I.e. print preview) or permanently.

* **speech**: Media that can voice the contents of the document the styles are applied to audibly

The `all` media type can be omitted in most queries you write that isn't concerned with what type of media a medium is because the `all`  media type is used by default in media queries that don’t require a media type specified:

{% Compare 'better' %}
```css
@media all and (min-width: 31.25em) {}
```
{% CompareCaption %}
You can elect to write queries with a media type always specified with `all` being the broadest and default one used by browsers…
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
```css
/* Equivalent to */
@media (min-width: 31.25em) {}
```
{% CompareCaption %}
Alternatively you can omit the `all` media type to save a few characters of typing if `all` –the default media type used by browsers–fits your media query needs
{% endCompareCaption %}
{% endCompare %}

{% Aside %}
With this default handling of the media type associated with media queries, most queries in this module will usually omit specififying a media type unless it's needed to be something other than the `all` media type. This aligns wth how media queries are typically used throughout the Web.
{% endAside %}

#### Querying whether a medium is a particular type
A valid media query can be as plain as a valid media type such as the following example where a document with a deliberately dark background is changed to be light-themed to save user’s ink by querying if the media the document is being consumed in can be considered a print-based medium:

```css
@media print {
  --background-color: transparent;
  --primary-color: black;
}
```

The demo below demonstrates these styles conditionally applied in print-media specific contexts:
{% Codepen {
  user: 'web-dot-dev',
  id: 'OJxygKv',
  theme: 'dark',
  height: 700,
  tab: 'css,result'
} %}

{% YouTube 'VLhGBT68N1k', {loop: "1"} %}

#### Querying whether a medium is not a particular type
Using the aforementioned `not` query modifier keyword, you are able to conditionally apply styles if a medium isn’t a particular media type by prefixing the media type with the keyword; the previous example’s page styles specific to non-print environments can be grouped within a media query that conditionally applies the styles only if the medium isn’t print-based:
```css

@media not print {
  /* Styles to conditionally apply if the medium can't be categorized being associated with print-based media */
}
```

### Media features


A wide variety of media features exist to create meaningful media queries with to conditionally apply styles. Media features generally fall into two types
1. Discrete
2. Range


#### Discrete type media features
**discrete type media features** have specific keywords among a specific set of values set-up for the feature to be valid or boolean numbers corresponding to `0` (false) & `1` (true)

`orientation`  used in an earlier example part of this module is an example of a commonly queried discrete media feature that accepts `portrait` or `landscape` as valid values.

Another useful noteworthy discrete media feature is  `prefers-color-scheme` that accepts `light` (default if no user preference can be inferred) or `dark`:

```css
@media (prefers-color-scheme: light) {
  /* Styles to apply if the user has explicitly indicated they prefer light color-themes or no preference indicated */
}

@media (prefers-color-scheme: dark) {
/* Styles to apply if the user has indicated they prefer dark color-themes */
}
```


With this in mind, the following demo adjust the background of the demo depending on the user’s color scheme preference (a white background if they prefer light color schemes, or a dark background if they prefer a dark color scheme):

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNGjexW',
  theme: 'dark',
  height: 700,
  tab: 'css,result'
} %}
{% YouTube 'laB4VoP9PZ0' %}

#### Range type media features
**range type media features** accept values from a numeric range; some ranged media features expect certain units to be used with the numbers specified

Range media features have `min` & `max`   permutations to enable further granularity of their use to create a valid media condition.

One of the most common range media features are the ones associated with the characteristic of a medium’s viewport size such as `width`.

 Media queries associated with such media features are common in adaptive and responsive Web design approaches.

 {% Aside 'key-term' %}
 Media Queries plays an important part facilitating adaptive and responsible Web Design approaches to handling [macro layouts](https://web.dev/learn/design/macro-layouts/) concerns of a Website.

For macro-layout concerns, *adaptive Web Design* uses media queries to contextually apply and switch between specific fixed-width layouts designed for a page (usually based on the viewport sizes of  popular device sizes); *responsive Web design* uses Media Queries to apply Fluid layouts (usually based on the viewport sizes that became meaningful as a result of a document’s design or intent compromised at such particular sizes) .

While it’s common to initially resort to the use of media Queries  for layout concerns;  media queries may not be necessary or the ideal solution for your layout concerns. This is especially true for component-specific layout concerns when modern capabilities of [CSS grid](https://web.dev/learn/css/grid/) and [Flexbox](https://web.dev/learn/css/flexbox/) or container queries can be used instead as a more scalable and efficient solution.

Check out [Web.dev’s dedicated section on the matter part of the Responsible Web Design course](https://web.dev/learn/design/macro-layouts/#do-you-need-a-media-query), as well as the dedication section s on macro-layout and micro-layouts in the same course to learn more about these nuances
 {% endAside %}

The following demo leverages `min-width` and `max-width` to arbitrarily classify whether a viewport within a typical Web browser is “small”, “medium”, or “large”.

{% Codepen {
  user: 'web-dot-dev',
  id: 'gOGaxKQ',
  theme: 'dark',
  height: 700,
  tab: 'css,result'
} %}
{% YouTube 'SY7H4liaUEU' %}

{% Aside 'warning' %}
Regardless of Web design approach you elect to use media queries for, note that viewport-based queries on  **small viewport devices such as phones likely won’t render your conditional layout styles as you expect without overriding their default viewport settings.** When seminal mobile devices entered the market, sites designed with fixed-layouts and much larger screen in mind were prevalent. To counter-act this to provide a more useful default browsing the Web for their users, such devices out of necessity scaled Web sites at a particular width and scale the Web sites rendered at those particular widths to the actual width of the device.

This became an industry standard that still is common today. To counteract this, the following HTML typically suffices to undo the scaling of such portable devices:

```html
<meta name="viewport" value="width=device-width, initial-scale=1">
```

[To learn more about the historic contexts necessitating this code, check out the introduction module of Web.dev’s  Learn Responsive Design course](https://web.dev/learn/design/intro/)
{% endAside %}

Leveraging the established characteristic that range type media features have  `min` and `max`  permutations, terser syntax using *relational operators* is emerging for Web authors to more succinctly communicate the intent of conditionally applying styles associated with a supported bounds/range context as a result of using the `min` and `max` variants of the same media feature in the same media expression.

For example in the previous example, the styles that conditionally apply styles within a range of same-unit width values to arbitrarily establish styles for a “medium” viewport  can be written in a terser and subjectively clearer way:

{% Compare 'better' %}
```css
@media (min-width: 50em) and (max-width: 87.5em) {

  body::after {
    content: "Medium Viewport";
  }
}
```
{% CompareCaption %}
How a range involving a particular particularly media query is typically written
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
```css
@media (50em <= width >= 87.em) {
   body::after {
    content: "Medium Viewport";
  }
}
```
{% CompareCaption %}
The media query more tersely written with *relational operatiors*
{% endCompareCaption %}
{% endCompare %}

{% Aside 'caution' %}
An emerging capability for range type media features, it is recommended to periodically reference [CanIUse.com’s dedicated page on the support of the feature](https://caniuse.com/mdn-css_at-rules_media_range_syntax) prior to extensively using it to account for its limited or missing support in the browsers you need to accomodate with your sytles.
{% endAside %}

{% Aside %}
Many more media features exist than the ones mentioned thus far to audit whether or not a medium supports them to meaningfully enhance a document.  [Check out CSS Trick’ s complete guide to media queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/) and the [MDN’s list of media features](https://developer.mozilla.org/docs/Web/CSS/@media#media_features) on learn more about the most supported and meaningful media features you can query against in CSS.
{% endAside %}

#### Querying that a medium has a particular media feature
Whether a range or discrete type of media feature, a media feature must be surrounded by parenthesis to be interpreted correctly by browsers. This is particular important when combined with media types

{% Compare  'better' %}
```css
@media (min-width: 31.25em) {}
@media all and (min-width: 31.25em) {}
```
{% endCompare %}

{% Compare 'worse' %}
```css
@media min-width: 31.25em {}
@media all and min-width: 31.25em {}
```
{% CompareCaption %}
Invalid queries; browser cannot parse intent with certainty what is a media type and what is a media feature in these queries to enable them to work like typical media queries can.
{% endCompareCaption %}
{% endCompare %}

#### Querying that a medium doesn’t have a particular media feature
This particular characteristic is particularly important to consider when you have the intent of  conditionally applying styles if a media feature *isn’t* supported by a medium.

The `not()` function within a media feature negates the media feature.  The `not()`  function to check if a media feature isn’t supported by a medium is not (pun intended) to be confused with the `not` query modifier keyword used to reverse the result of an entire media condition.

For example, the following code snippet allows you to conditionally apply styles if a medium didn’t have a pointer:

```css
@media (not(pointer)) {
}
```
{% Aside 'gotchas' %}
Some media features are able to be represented without specifying a value to meaningfully communicate the presence of the feature or not.

`pointer` is one of those media features. To conditionally apply styles if a device has a pointing device (i.e. mouse), you can use the following CSS media query
{% Compare 'better' %}

```css
@media (pointer) {
  /* Styles to conditionally apply if the media has a pointer */
}
```
{% endCompare %}

Similarly, you can conditionally apply styles if the medium doesn’t have a pointer device:

{% Compare 'better' %}
```css
@media (not(pointer)) {
  /* Styles to conditionally apply if the media doesn't have a pointer device */
}
```

{% endCompare %}

`pointer`, being a discrete media feature, can be simultaneously more granularly conditionally apply styles regarding the capabilities of a medium’s pointer device.

To conditionally apply styles if the media’s pointing device is considered to be limited in functionality (i.e. to adjust UI accordingly), you could use the following media query

{% Compare 'better' %}
```css
@media (pointer: coarse) {
  /* Styles to conditionally apply if the media's pointing device has limited accuracy */
}
```

{% endCompare %}
You can also use the following media query if a medium’s pointer device is accurate like a desktop with a mouse:

{% Compare 'better' %}
```css
@media (pointer: fine) {
  /* Styles to conditionally apply if the media pointer is considered accurate or quite capable */
}
```
{% endCompare %}

Because this possibility for some media features that may need to be checked with specific media types; you can think of parenthesizes being required for media features as a reliable way for media types and media features be distinguishable from another for browsers and humans.

 For example, the following snippet demonstrates the pointer  media feature alongside the speech media

{% Compare 'worse' %}
```css
@media speech and pointer {
  /* Styles to conditionally apply if this was actually a valid media query */
}
```
{% CompareCaption %}

Without the requirement of media features needing parenthesis, it would be unclear to distinguish the two–especially to

- accommodate meaningful advanced queries allowing you to change multiple media queries in one condition
- group valid syntax to negate a media condition distinct from negating the result of checking the presence or lack of presence of a media feature
- Clear combinations of multiple media queries using commas
{% endCompareCaption %}
{% endCompare %}

For more understanding of the media queries that can be used in this way, check out the [“Evaluating Media Features in a Boolean context” section of the latest specification for Media queries](https://www.w3.org/TR/mediaqueries-5/#mq-boolean-context) when this article was published.
{% endAside %}

#### Associating a particular media type with a media feature together using the logical operator keyword `and`

When you need to conditionally apply styles with a particular media type and a media feature in mind simulataneously represented as one media query, a media type and media feature must be paired with one another using the `and` logic operator keyword:

{% Compare 'better' %}
```css
@media not screen and (orientation: portrait) {
  /* Styles conditionally applied if a screen-based medium wasn't oriented in a portrait manner */
}
```
{% endCompare %}

{% Compare 'worse' %}
```css
@media not screen or (orientation: portrait) {
  /* Styles attempted to be conditionally applied with invalid syntax if a medium had a screen or was a medium oriented in a portrait manner */
}
```
{% CompareCaption %}
Invalid. If you intended to conditionally apply styles based on a media type or a media query distinct from one another, you must treat them as separate media queries.
{% endCompareCaption %}
{% endCompare %}

This is because while great care is taken by browsers to assume a user is querying all possible media types when they don't explicitly specific a media type with their media queries to make specifying a media type *conditonally* optional, a media query can't be written in a way that suggests the media type part of a media query is *completely* optional.

This particular nuance with how a media type and one or more media features are represented in a particular media query make it easier to parse media queries leveraging the `not` query modifier keyword. In particular, this convention with the use of a media type and one or more media features helps ensure it can be consistently understood that an entire media query is negated with the use of `not` and not just the media type if `or` was immediately allowed to follow one right before zero or more media features.

This nuance also further enables the ability for `all` to be an optional media type specified by a typical media query. The following three code blocks would be hard to tell apart without such a convention being established.

{% Compare 'better' %}
```css
@media not screen and (orientation: portrait) {}
```
{% CompareCaption %}
The requirement that a media type and a media feature are always joined by `and` makes it clear that this entire media query is being negated here.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'worse' %}
```css
@media not screen or (orientation: portrait) {}
```
{% CompareCaption %}
`or` is explictly not allowed between a media type and a media feature because the ambiguity
{% endCompareCaption %}
{% endCompare %}

{% Compare 'worse' %}
```css
@media not screen or all and (orientation: portrait) {}
```
{% CompareCaption %}
Example of the ambiguity caused by the invalid use of `or` to join a media feature and a media featue. It's ambigious the criteria to conditionally apply the styles within the media block
* Not on a screen-based medium but the medium is portrait-oriented?
* The device isn't a screen-based device and not a portrait device?
*

{% endCompareCaption %}
{% endCompare %}



{% Aside 'gotchas' %}
As mentioned earlier in this module, the default media type associated with a media query if one isn’t specified is `all`.

This makes sense because documents and the styles we add to them are always rendered on a medium; it's impossible for a document to not be on a medium and it's impossible to style a document without a medium being a factor.

It is an all (pun intended) or anothing affair.

Typical blocks of style we can write in CSS such as the following
```css
#foo {
  color: magenta;
}
```

Can accordingly be alternatively be written the following way to fully embrace how broad the `all` media type really is:

```css
@media all {
  #foo {
    color: magenta;
  }
}
```

Ultimately type of media is always a factor with media queries, with `all` being an all-encompassing media type that makes it a sensible default.  Its usage implicitly and explicitly communicates styles are applicable to any type of media that the document can be rendered on followed by zero or more media features we specify relevant to our conditional styling needs.
{% endAside %}

#### Combining media feaures using the `and`/`or` logical operator keywords

To conditionally apply styles based on multiple media features to represent a single expression, you use either the

1. `and` keyword to conditionally apply styles if all the media features hold true

2.  `or`  keyword to conditionally apply styles if any of the media features hold true

The following code example conditionally applies styles to a document if a medium has a screen, its screen is landscape-oriented, has an accurate pointing device, and is capable of outputting a color:
```css
@media (pointer: fine) and (orientation: landscape) and (color)   {
  /* Styles conditionally applied */
}
```

If a medium did not meet this criteria, the styles would’t apply to the document on the device at all; all the media features specified must be applicable to the medium.

In comparision the media query could be refactored to allow a medium to conditionally have styles within the media at-rule applied to the document on the medium if any the media features specified were applicable to a medium
```css
@media (pointer: fine) or (orientation: landscape) or (color) {
  /* Styles conditionally applied */
}
```

{% Aside %}
 Note that an interesting and powerful feature of media queries and other conditional at-rules is that they can be nested; This capability in particular allows for alternate representation of media features combined in a single media condition using `and`


```css
@media screen and (color) and (pointer) {
}
```

can be reinterpreted as

```css
@media screen {
  @media (color) {}
  @media (pointer) {}
}
```

This enables interesting alternate means you can organize your styles in a stylesheet with complex media queries that may be easier to parse with experimentation.
{% endAside %}

## Combining multiple media queries

In CSS multiple media queries can be combined by being represented as a comma separated list

For example you can conditionally apply styles to print and screen media simultaneously with the following code example:

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

{% Aside 'gotchas' %}
In an earlier example we had a code snippet demonstrating how to  conditionally apply styles based on a media type and media feature simultaneously:
```css
@media not screen and (orienation: portrait) {
  /* Styles */
}
```

What if we wanted to conditionally apply the styles if the media type was not a  `screen` *or* on a medium that had a `portrait` orientation? This necessitates them being two separate media queries.

As mentioned before, a common mistake is to use the  `or`  keyword immediately following the media type instead of a comma to indicate:

{% Compare 'worse' %}
```css
@media not screen or (orientation: portrait) {
}
```
{% CompareCaption %}
Invalid media query syntax
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
```css
@media not screen, (orientation: portrait) {
}
```
{% endCompare %}

{% Compare 'better' %}
```css
@media not screen, all and (orientation: portrait) {
}
```
{% CompareCaption %}
An equivalent to the query above that merely makes more explicit the inferred media type by the browser
{% endCompareCaption %}
{% endCompare %}
{% endAside %}

## Using media queries outside of CSS
In addition to stylesheets, media queries are interoperable within a variety of constructs in HTML & JavaScript:

In HTML you can make more specific when the behavior of certain HTML elements conditionally affect a page based on media-specific criteria you making meaningful with a media query; for example media queries are commonly used to conditionally load resources like stylesheets using the `link` HTML element:
```html
<link rel="stylesheet" href="print-stylesheet.css" media="print" />
```

In addition to `<link>`, other elements such as `<style>`, `<link>`, and `<source>` provide this functionality; they all have a the `media` attribute for

Similarly, in JavaScript you can leverage APIs such as `matchMatchMedia`   available on the `window` object to contextually apply behavior based on media-specific criteria represented by a media query.
```js
const wideEnoughQuery = window.matchMedia('(min-width: 12.5rem)');

wideEnoughQuery.addEventListener('change', (event) => {
  if(event.matches) {
    console.log('The viewport is at least 12.5em (200px); apply side-effects only applicable when that condition is true');
    import('../path/to/some/example-component');
  }
});
```
## Feature queries and how they compare to media queries
*Feature queries* are distinct from media queries, allowing authors to conditionally applying CSS if CSS features are supported by the CSS rendering engine a document is being rendered  by to be consumable on a particular medium.

In the first example of this module, you could do the following if you wanted to check if the CSS engine rendering the document supported grid before applying the styles:
```css
@supports (display: grid) {
  /* Grid-specific card styles */
  #cards {
    display: grid;
    grid-template: 1fr;
    grid-gap: 2rem;
    width: 100%;
    padding: 10%;
    margin: 0;
    list-style: none;
    border: 2px solid magenta;
  }

  @media (min-width: 31.25em)  {
    #cards {
      grid-template-columns: 1fr 1fr;
   }
  }

  @media (min-width: 65.8125em)  {
    #cards {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
}
```

Similarly, you could have more granualarly only loaded a stylesheet containing these styles dependent on a browser's ability to support CSS grids with the following code:
```css
@import "css-grid-styles.css" supports(display: grid);
```

To learn more about feature queries, check out MDN’s documentation on `@support` or [CSSTricks.com’s deep-dive on how they work](https://css-tricks.com/how-supports-works/) or MDN's documentation about them.

{% Assessment 'media-queries' %}
