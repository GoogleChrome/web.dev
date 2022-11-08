---
title: 'Images'
authors:
  - cariefisher
description: Create accessible images.
date: 2022-09-30
tags:
  - accessibility
---

Accessible images may seem like a simple topic at first glance&mdash;you add
some "alt text" to an image, and you are done. But, the topic is more nuanced
than some people think. In this section, we'll review:

* How to update the code to make images accessible.
* What information should be shared with users and where to share it.
* Additional ways to improve your images to support people with disabilities.

## Image purpose and context

Before even one line of code is written, you must first think about the point
of the image and how it will be used. Asking yourself questions about the
purpose and context of the image can help you determine how best to convey the
information to a person using
[assistive technology (AT)](https://www.nichd.nih.gov/health/topics/rehabtech/conditioninfo/device)
such as screen readers.

You may ask yourself:

* _Is the image essential to understanding the context of the feature or page?_
* _What type of information is the image trying to convey?_
* _Is the image simple or complex?_
* _Does the image elicit emotion or prompt the user to act?_
* _Or is the image just visual "eye candy" with no real purpose?_

A visual flowchart, such as an
[image decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/),
can help you decide which category your image belongs to.

Try hiding the images on your site or web app using a browser extension or
other methods. Then ask yourself: "Do I understand the content that remains?"
If the answer is yes, it is most likely a decorative image. If not, the image
is instead informative in some way and contextually necessary. Once you
determine the image's purpose, you can determine the most accurate way to code
for it.

{% Img
  src="image/VbsHyyQopiec0718rMq2kTE1hke2/cnUw9wOPYGvEpO69nqFe.png", alt="Example image decision tree.", width="632", height="598"
%}

### Decorative images

A [decorative image](https://www.w3.org/WAI/tutorials/images/decorative/) is a
visual element that doesn't add additional context or information that allows
the user to better understand the context. Decorative images are supplemental
and may provide style rather than substance.

If you decide an image is decorative, the image must be programmatically hidden
from ATs. When you program an image to be hidden, it signals to the AT that the
image is not needed to understand the page's content, context, or action. There
are many ways to hide images, including using an empty/null text alternative,
[applying ARIA](https://developer.mozilla.org/docs/Web/Accessibility/ARIA), or
adding the image as a CSS background. Below are a few examples of how to hide a
decorative image from users.

{% Aside 'caution' %}
<p>Be mindful when making this choice, as
"[decorative](https://www.smashingmagazine.com/2021/06/img-alt-attribute-alternate-description-decorative/)"
can mean different things to different users. Some AT users want to hear
descriptions for every visual on the screen.</p>
<p>Users can choose to skip over your image descriptions if and when they deem
  them redundant or verbose, but they cannot imagine descriptions that don't
  exist. When in doubt, add descriptions to your images.</p>
{% endAside %}

#### Empty or null `alt`

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'QWrMgxg',
 height: 300,
 theme: 'auto',
 tab: 'html,css,result'
} %}

An empty/null alternative text attribute differs from a missing alternative
text attribute. If the alternative text attribute is missing, the AT might read
out the file name or surrounding content to give the user more information
about the image.

#### Role set to `presentation` or `none`

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'mdLMwje',
 height: 350,
 theme: 'auto',
 tab: 'html,result'
} %}

A role set to [`presentation` or `none`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/presentation_role)
removes an element's semantics from exposure to the accessibility
tree. Meanwhile, [`aria-hidden= "true"`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-hidden)
will remove the entire element&mdash;and all of its children&mdash;from the
accessibility API.

```html
<!-- All of these choices lead to the same result. -->
<img src=".../Ladybug.jpg" role="presentation">
<img src=".../Ladybug.jpg" role="none">
<img src=".../Ladybug.jpg" aria-hidden="true">
```

Use `aria-hidden` with caution as it may hide elements that
you do not wish to hide.

#### Images in CSS

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'GRdvEYo',
 height: 350,
 theme: 'auto',
 tab: 'css,result'
} %}

When you add a background image with CSS, a screen reader will not detect the
image file. Be sure you want the image to be hidden before applying this method.

### Informative images

An [informative image](https://www.w3.org/WAI/tutorials/images/informative/) is an image that conveys a simple concept, idea, or emotion. Types of informative images include photos of real-world objects, essential icons, simple drawings, and [images of text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html).

If your image is informative, you should include [programmatic alternative text](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html) describing the purpose of the image. Alternative image descriptions&mdash;often abbreviated as "alt text"&mdash;give AT users more context about an image and help them better understand an image's message or intent.

Simple alternative descriptions using
[`<img>` elements](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-alt)
are achieved by including the `alt` attribute, regardless of the file type it
points to, such as `.jpg`, `.png`, `.svg`, and others.

```html
<img src=".../Ladybug_Swarm.jpg" alt="A swarm of red ladybugs are eating the leaves of my prize rose bush.">
```
{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'yLjoXrj',
 height: 350,
 theme: 'auto',
 tab: 'html,result'
} %}

When you use `<svg>` elements inline, however, you need to pay attention to accessibility.

First, since SVGs are semantically coded, AT will skip over them by default.
If you have a decorative image, this is not an issue&mdash;the AT will ignore
it as intended. But if you have an informative image, an ARIA `role="img"`
needs to be added to the pattern for the AT to recognize it as an image.

Second, `<svg>` elements do not use the `alt` attribute, so
[different coding methods](https://codepen.io/web-dot-dev/pen/dyezRBP) must be
used instead to add alternative descriptions to your informative images.

```html
  <svg role="img"...>
     <title>Cartoon drawing of a red, black, and gray ladybug.</title>
  </svg>
```

### Functional images

A [functional image](https://www.w3.org/WAI/tutorials/images/functional/) is
connected to an action. An example of a functional image is a logo that links
to the home page, a magnifying glass used as a search button, or a social media
icon that directs you to a different website or app.

Like informative images, functional images must include an alternative
description to inform all users of their purpose. Unlike an informative image,
each functional image needs to describe the image's action&mdash;not the
visual aspects.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'YzLxxPw',
 height: 350,
 theme: 'auto',
 tab: 'html,result'
} %}

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'gOzxxbg',
 height: 350,
 theme: 'auto',
 tab: 'html,result'
} %}

In the logo example, the image is both informative and actionable as it is both
an image that conveys information and behaves as a link. In cases like these,
you can add alternative descriptions to each element&mdash;but it is not a
requirement.

One way to add alternative descriptions to images is through visually hidden
text. When you use this method, the text will be read by screen readers because
it is in the DOM, but it is visually hidden with the help of custom CSS.

You can see from the code snippet that "Navigate to the homepage" is the
wrapper title, and the image alternative text is "Lovely Ladybugs for your
Lawn." When you listen to the logo code with a screen reader, you hear both the
visual and the action conveyed in one image.

```html
<div title="Navigate to the homepage">
   <a href="/">
      <img src=".../Ladybug_Logo.png" alt="Lovely Ladybugs for your Lawn"></img>
   </a>
</div>
```

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'qBYXXdW',
 height: 350,
 theme: 'auto',
 tab: 'html,result'
} %}

### Complex images

A [complex image](https://www.w3.org/WAI/tutorials/images/complex/) often
requires more explanation than a decorative, informational, or
functional image. It requires both a short and a long alternative
description to convey the full message. Complex images include infographics,
maps, graphs/charts, and complex illustrations. As with the other
image types, there are different methods you can use to add alternative
descriptions to your complex images.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'NWMvvqw',
 height: 400,
 theme: 'auto',
 tab: 'html,result'
} %}

```html
<img src=".../Ladybug_Anatomy.svg" alt="Diagram of the anatomy of a ladybug."><a href="ladybug-science.html">Learn more about the anatomy of a ladybug</a>
```

One way to add additional explanation to an image is to link out to a resource
or provide a jump link to a longer explanation later on the page. This method
is a good choice, not only for AT users but also helps people with
disabilities&mdash;such as cognitive, learning, and reading
disabilities&mdash;who might benefit from having this additional image
information readily available on the screen instead of buried in the code.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'OJZjxGK',
 height: 400,
 theme: 'auto',
 tab: 'html,result'
} %}

Another method you can use is to append the `aria-describedby` attribute to the
`<img>` element. You can programmatically link the image to an ID containing a
longer description. This method creates a strong association between the image
and the full description. The extended description can be displayed on the
screen or visually hidden&mdash;but consider keeping it visible to support even
more people.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'MWGvEdJ',
 height: 450,
 theme: 'auto',
 tab: 'html,result'
} %}

One other way to group short alternative descriptions with a longer one is to use the HTML5 `<figure>` and `<figcaption>` elements. These elements act similarly to `aria-describedby` in that it semantically groups elements, forming a stronger association between the image and its description. Adding ARIA `role="group"` ensures backward compatibility with older web browsers that don't support the native semantics of the `<figure>` element.

### Alternative text best practices

Of course, including alternate text is not enough. The text should also be
meaningful. For example, if your image is about a swarm of ladybugs chewing the
leaves of your prize rose bush, but your alternative text reads "bugs," would
that convey the full message and intent of the image? Definitely not.

Alternative descriptions need to capture as much relevant visual information as
possible and be succinct. While there is no limit to the number of characters a
screen reader can read, it is usually advised to cap your alternative text to
150 characters or less to avoid reader fatigue. If you need to add additional
context to the image, you can use one of the complex image patterns, add
caption text, or further describe the image in the main copy.

Some additional [alternative text best
practices](https://www.w3.org/WAI/tutorials/images/tips/) include:

* Avoid using words like "image of" or "photo of" in the description, as the
  screen reader will identify these file types for you.
* When naming your images, be as consistent and accurate as possible. Image
  names are a fallback when the alternative text is missing or ignored.
* Avoid using non-alpha characters (for example, #, 9, &) and use dashes
  between words rather than underscores in your image names or alternative text.
* Use proper punctuation whenever possible. Without it, the image descriptions
  will sound like one long, never-ending, run-on sentence.
* Write alternative text like a human and not a robot. Keyword stuffing does
  not benefit anyone&mdash;people using screen readers will be annoyed, and search engine algorithms will penalize you.

{% Assessment 'images' %}
