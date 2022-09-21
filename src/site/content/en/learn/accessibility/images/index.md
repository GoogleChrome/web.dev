---
title: 'Images'
authors:
  - cariefisher
description: Create accessible images.
date: 2023-09-30
tags:
  - accessibility
---

Accessible images may seem like a simple topic at first glance—you add some "alt text" to an image, and you are done. But, the topic is more nuanced than some people think. In this section, we’ll review:

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
determine the image’s purpose, you can determine the most accurate way to code
for it.

{% Img
  src="image/VbsHyyQopiec0718rMq2kTE1hke2/cnUw9wOPYGvEpO69nqFe.png", alt="Example image decision tree.", width="632", height="598"
%}

### Decorative images

A [decorative image](https://www.w3.org/WAI/tutorials/images/decorative/) is a visual element that doesn’t add additional context or information that allows the user to better understand the context. Decorative images are supplemental and may provide style rather than substance.

If you decide an image is decorative, the image must be programmatically hidden from ATs. When you program an image to be hidden, it signals to the AT that the image is not needed to understand the page's content, context, or action. There are many ways to hide images, including using an empty/null text alternative, [applying ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), or adding the image as a CSS background. Below are a few examples of how to hide a decorative image from users.

{% Aside 'caution' %}
Be mindful when making this choice, as "[decorative](https://www.smashingmagazine.com/2021/06/img-alt-attribute-alternate-description-decorative/)" can mean different things to different users. Some AT users want to hear descriptions for every visual on the screen. They can always choose to skip over your image descriptions if and when they deem them redundant or verbose, but they cannot imagine descriptions that don’t exist. When in doubt, add descriptions to your images.
{% endAside %}

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'QWrMgxg',
 height: 300,
 theme: 'auto',
 tab: 'html,css,result'
} %}

```html
<img src=".../Ladybug.jpg" alt="">
```

An empty/null alternative text attribute differs from a missing alternative text attribute. If the alternative text attribute is missing, the AT might read out the file name or surrounding content to give the user more information about the image.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'mdLMwje',
 height: 300,
 theme: 'auto',
 tab: 'html,css,result'
} %}

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'abGywjP',
 height: 300,
 theme: 'auto',
 tab: 'html,css,result'
} %}

```html
<img src=".../Ladybug.jpg" role="presentation">
<img src=".../Ladybug.jpg" role="none">
<img src=".../Ladybug.jpg" aria-hidden="true">
```

The [`"presentation"` or `"none"` role](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/presentation_role) will remove an element's semantics from being exposed to the accessibility tree. Meanwhile, [`aria-hidden= "true"`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-hidden) will remove the entire element—and all of its children—from the accessibility API. Use `aria-hidden` with caution as it may hide elements that you do not wish to hide.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'GRdvEYo',
 height: 300,
 theme: 'auto',
 tab: 'css,result'
} %}

```html
<div class="ladybug">
```

When you add a background image with CSS, a screen reader will not detect the image file. Be sure you want the image to be hidden before applying this method.

### Informative images

An [informative image](https://www.w3.org/WAI/tutorials/images/informative/) is an image that conveys a simple concept, idea, or emotion. Types of informative images include photos of real-world objects, essential icons, simple drawings, and [images of text](https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html). 

If your image is informative, you should include [programmatic alternative text](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html) describing the purpose of the image. Alternative image descriptions—often abbreviated as "alt text"—give AT users more context about an image and help them better understand an image's message or intent.

Simple alternative descriptions using [`<img>` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-alt)</code> are achieved by including the `alt` attribute, regardless of the file type it points to, such as .jpg, .png, .svg, and others.

```html
<img src=".../Ladybug_Swarm.jpg" alt="A swarm of red ladybugs are eating the leaves of my prize rose bush.">
```
{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'yLjoXrj',
 height: 300,
 theme: 'auto',
 tab: 'html,result'
} %}

When you use `<svg>` elements inline, however, you need to pay attention to accessibility.
  
First, since SVGs are semantically code, an AT will skip over them by default. If you have a decorative image, this is not an issue—the AT will ignore them as intended. But if you have an informative image, an ARIA `<role="img">` needs to be added to the pattern for the AT to recognize it as an image.

Second, `<svg>` elements do not use the `alt` attribute, so [different coding methods](https://codepen.io/web-dot-dev/pen/dyezRBP) must be used instead to add alternative descriptions to your informative images.

```html
  <svg role="img"...>
     <title>Cartoon drawing of a red, black, and gray ladybug.</title>
  </svg>
```

### Functional images

A [functional image](https://www.w3.org/WAI/tutorials/images/functional/) is connected to an action. An example of a functional image is a logo that links to the home page, a magnifying glass used as a search button, or a social media icon that directs you to a different website or app.

Like informative images, functional images must include an alternative description to inform all users of their purpose. Unlike an informative image, each functional image needs to describe the image's_ action_&mdash;not the visual aspects.

```html
<!-- Option 1, use alt text -->
<a href="/">
   <img src=".../Ladybug_Logo.png" alt="Social bug network">
</a>

<!-- Option 2, use visually hidden text. -->
<a href="/">
   <span class="visually-hidden">Social bug network</span>
   <img src=".../Ladybug_Logo.png"></img>
</a>
```

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'YzLxxPw',
 height: 300,
 theme: 'auto',
 tab: 'html,result'
} %}

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'gOzxxbg',
 height: 300,
 theme: 'auto',
 tab: 'html,css,result'
} %}

In the logo example, the image is both informative and actionable as it is both an image that conveys information and behaves as a link. In cases like these, you can add alternative descriptions to each element—but it is not a requirement. 

One way to add alternative descriptions to images is through visually hidden text. When you use this method, the text will be read by screen readers because it is in the DOM, but it is visually hidden with the help of custom CSS.

You can see from the code snippet that "Navigate to the homepage" is the wrapper title, and the image alternative text is "Lovely Ladybugs for your Lawn." When you listen to the logo code with a screen reader, you hear both the visual and the action conveyed in one image.

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
 height: 300,
 theme: 'auto',
 tab: 'html,result'
} %}

### Complex images

A [complex image](https://www.w3.org/WAI/tutorials/images/complex/) is often intricate, and possibly used to explain complicated concepts, which require more information than a standard image. It requires both a short and a long alternative description to convey the full message. Complex images include infographics, maps, graphs/charts, and complex illustrations. As with the other image types, there are different methods you can use to add alternative descriptions to your complex images.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'NWMvvqw',
 height: 300,
 theme: 'auto',
 tab: 'html,result'
} %}







{% Assessment 'images' %}
