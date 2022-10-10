---
title: 'Overview of HTML'
authors:
  - estelleweyl
description: A brief introduction to the key concepts in HTML.
date: 2022-09-27
tags:
  - html
---

HyperText Markup Language, or HTML, is the standard markup language for describing the structure of documents displayed on the web. HTML consists of a series of elements and attributes which are used to mark up all the components of a document to structure it in a meaningful way.

HTML documents are basically a tree of nodes, including HTML elements and text nodes. HTML elements provide the semantics and formatting for documents, including creating paragraphs, lists and tables, and embedding images and form controls. Each element may have multiple attributes specified. Many elements can have content, including other elements and text. Other elements are empty, with the tag and attributes defining their function.

There are several categories of elements, including metadata, sectioning, text, inline semantic, form, interactive, media, component, and scripting. We'll cover most of these in the series. But first, what is an element?

## Elements

HTML consists of a series of elements, which you use to enclose, or wrap, different parts of the content to make it appear or act in a certain way. HTML elements are delineated by tags, written using angle brackets (`<` and `>`).

Our page title is a heading, level one, for which we use the `<h1>` tag. The actual title, "Machine Learning Workshop", is the content of our element. The content goes between the open and closing tags. The entire thing—the opening tag, closing tag, and the content—is the element.

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/oyFzeg8ttK57XMGuVNvG.png", alt="The tags and content that make up an HTML element.", width="752", height="245" %}

The closing tag is the same tag as the opening tag, preceded by a slash.

Elements and tags aren't the exact same thing, though many people use the terms interchangeably. The tag name is the content in the brackets. The tag includes the brackets. In this case, `<h1>`. An "element" is the opening and closing tags, and all the content between those tags, including nested elements.

```html
<p>This paragraph has some
  <strong><em>strongly emphasized</em></strong>
  content</p>
```

This paragraph element has other elements _nested_ in it.  When nesting elements, it's important that they are properly nested.  HTML tags should be closed in the reverse order of which they were opened. In the above example, notice how the `<em>` is both opened and closed within the opening and closing `<strong>` tags, and the `<strong>` is both open and closed within the `<p>` tags.

Browsers do not display the tags. The tags are used to interpret the content of the page.

HTML is very, very forgiving. For example, if we omit the closing `</li>` tags, the closing tags are implied.

```html
<ul>
    <li>Blendan Smooth
    <li>Hoover Sukhdeep
    <li>Toasty McToastface
</ul>
```

Although it is valid to not close an `<li>`, it isn't good practice.  The closing `</ul>` is mandatory. If the unordered list's closing tag is omitted, the browser will try to determine where your list and list items end, but you might not agree with the decision.

The specification for each element lists whether the closing tag is mandatory or not. "Neither tag is omissible" in the specification means both an opening tag and a closing tag are required. The [specification provides a list of all the required closing tags](https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-omission).

If the `<em>` or `<strong>` in the example earlier  had not been closed, the browser may or may not close the element for you. Not closing an `<em>` simply leads to content possibly being rendered differently than you intended.  If a `</ul>` is omitted and the next tag is a closing tag for the list's parent container, you're lucky. If, on the other hand, it's an opening `<h1>` tag, the browser will assume the header is part of the list, including inheriting styles. Some omitted closing tags cause bigger issues: not closing some tags, such as `<script>`, `<style>`, `<template>`, `<textarea>`, and `<title>`, breaks subsequent content as shown in the following example.

{% Codepen {
  user: 'web-dot-dev',
  id: 'VwxzBLq',
  height: 500,
  theme: 'dark',
  tab: 'html,result'
} %}

Having some content being unintentionally italic or having a heading indented won't destroy your business. Having most of your content appear unstyled in a 200x300 textarea because you forgot to add a `</textarea>` or not show up at all because you forgot to close a `</style>` makes the site unusable.

In some cases, browsers will include elements even if the tags aren't present in the markup. Because elements can be implied, an element can exist even when the tags don't. The browser will add a `<body></body>` around your content and  `<tbody></tbody>` around your table rows, even if you don't. That being said, while it is valid to omit tags, don't. Also, as already mentioned, make sure they are correctly nested. Your future self as a maintainer of markup, and anyone else working on your code base, will thank you.

There are two types of elements: replaced and non-replaced.

### Non-replaced elements

The paragraph, header, and lists marked up in the earlier section are all non-replaced. Non-replaced elements have opening and (sometimes optional) closing tags that surround them and may include text and other tags as sub-elements. These enclosing tags can turn a phrase or image into a hyperlink, can make a sentence into a header, can give emphasis to words, and so on.

### Replaced and void elements

Replaced elements are replaced by objects, be it a graphical user interface (UI) widget in the case of most form controls, or a raster or scalable image file in the case of most images. Being replaced by objects, each comes with a default appearance. Depending on the type of object and the browser, the applicable styles are limited. For example, most browsers enable limited styling of UI widgets and related pseudo-elements. In the case of raster images, height, width, clipping, and filtering are easily done with CSS, but not much else. On the other hand, scalable vector graphics, using a markup language based on XML similar to HTML are fully scalable (unless they contain raster images). They are also fully styleable. Note that the ability to style an embedded SVG from the CSS linked to the HTML file that embeds it depends on how the SVG is set up.

In this example, the two replaced elements `<img>` and `<input>` are replaced by non-text content: an image and a graphical user interface object, respectively.

```html
<input type="range">
<img src="switch.svg" alt="light switch">
```

Output of the above HTML:

<input type="range">
<img src="https://machinelearningworkshop.com/svg/switch2.svg" alt="light switch" style="max-width: 200px;">
Replaced elements and void elements are often confused. Void elements are all self-closing elements and are represented by one tag. This means there is no such thing as a closing tag for a void element. Optionally, you can include a slash at the end of the tag, which many people find makes markup easier to read. Continuing with this example, we self close the tag with a slash:

```html
<input type="range"/>
<img src="switch.svg" alt="light switch"/>
```

The slash at the end is old school: it's a way of indicating that the element is self-closing and there will be no matched end or closing tag.

Void elements cannot contain text content or nested elements. Void elements include  `<br>`, `<col>`, `<embed>`, `<hr>`, `<img>`, `<input>`, `<link>`, `<meta>`, `<source>`, `<track>`, and `<wbr>`, among others.

Most replaced elements are void elements, but not all. The `video`, `picture`, `object`, and `iframe` elements are replaced, but aren't void. They can all contain other elements or text, so they all have a closing tag.

Most void elements are replaced; but again, not all, as we saw with `base`, `link`, `param`, and `meta`. Why have a void element, which can't have any content, that isn't replaced and thereby doesn't render anything to the screen? To provide information about the content! The information is provided by the elements' attributes.

## Attributes

You may have noticed the `<img>` and `<input`> examples had more than just the element type in their opening tag. These extra bits of space-separated name/value pairs (though sometimes including a value is optional) are called _attributes_. Attributes are what make HTML so incredibly powerful. We'll be covering hundreds of attributes and attribute values in this series, but here we'll just discuss what they are in general and how to include them.

Attributes provide information about the element. The attribute, like the rest of the opening tag, won't appear in the content, but they do help define how the content will appear to both your sighted and non-sighted (assistive technologies and search engines) users.

Attributes only appear in the opening tag. The opening tag always starts with the element type. The type can be followed by zero or more attributes, separated by one or more spaces. Most attribute names are followed by an equal sign equating it with the attribute value, wrapped with opening and closing quotation marks.

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/IdGp51MB61yo6WDSRZZ3.png", alt="An opening tag with attributes.", width="800", height="218" %}

In this example, we have an anchor link with two attributes. These two attributes have converted the content "Registration" into an internal anchor link that scrolls to the attribute `id="register"` in the current browser tab when the link is clicked, tapped, or activated with the keyboard or other device.

Attributes define the behavior, linkages, and functionality of elements. We'll cover more attributes in the [Attributes](/learn/html/attributes/) section of this series. For now, just note that some attributes are global—meaning they can appear within any element's opening tag. Some apply only to several elements but not all, and others are element-specific, relevant only to a single element.

Most attributes are name/value pairs. Boolean attributes, whose value is true, false, or the same as the name of the attribute, can be included as just the attribute: the value is not necessary.

```html
<img src="switch.svg" alt="light switch" ismap />
```

This image has three attributes: `src`, `alt`, and `ismap`. The `src` attribute is used to provide the location of the SVG image asset. The `alt` attribute provides alternative text describing the contents of the image. The `ismap` attribute is Boolean, and doesn't require a value. This is just to explain what attributes are. We'll cover these attributes in more detail in the [images](/learn/html/images/) section.

While quoting attributes isn't always required, it sometimes is. If the value includes a space or special characters, quotes are needed. For this reason, quoting is always recommended. One or more spaces between attributes if the attribute value is quoted are not actually required, but, to be safe, and for legibility, quotes and spaces are recommended, and appreciated.

HTML is not case-sensitive, but some attribute values are. Values that are defined in the specification are case-insensitive. Strings that are not defined as keywords are generally case-sensitive, including `id` and `class` values.

Note that if an attribute value is case-sensitive in HTML, it is case-sensitive when used as part of an [attribute selector](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors) in CSS and in JavaScript.

To make markup easier to read, it is recommended, but not required, to mark up your HTML using lowercase letters for all your element names and attribute names within your tags, and quote all attribute values.  If you ever hear the term "XHTML style markup", this, and self-closing empty elements with a slash at the end, is what that means.

## Appearance of elements

The default appearance of semantic elements is set by user-agent stylesheets. Most browsers use actual stylesheets for this purpose, while others simulate them in code. The end result is the same. Although some constraints on user-agent stylesheets are set by the HTML specification, browsers have a lot of latitude, which means some differences exist between browsers.

The element you choose, and therefore the tags you use, should be appropriate for the content you are displaying, as tags have semantic meaning. The [semantics](/learn/html/semantic-html/), or `role`, of an element is important to assistive technologies and, in some cases, search engines.  HTML should be used to structure content, not to define the content's appearance. Appearance is the realm of CSS. While many elements that alter the appearance of content, such as `<h1>`, `<strong>`, and `<em>`, have a semantic meaning, the appearance can and generally will be changed with author styles.

```html
<h1>This header has both <strong>strong</strong> and <em>emphasized</em> content</h1>
```

## Element, attributes, and JavaScript

The Document Object Model (DOM) is the data representation of the structure and content of the HTML document.  As the browser parses HTML, it creates a JavaScript object for every element and section of text encountered. These objects are called nodes—element nodes and text nodes, respectively.

There is an interface to define the functionality of every HTML element.  The [HTML DOM API](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API) provides access to and control of every HTML element via the DOM, providing interfaces for the HTML element and all the HTML classes that inherit from it. The [HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement) interface represents the HTML element and all of its descendant nodes. Every other element implements it via an interface that inherits from it. Each inheriting interface has a constructor, methods, and properties.  Via the inherited HTMLElement properties, you can access every global attribute, as well as `input`, `pointer`, `transition`, and `animation` events. Via the individual element's sub-type, such as [HTMLAnchorElement](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement) and  [HTMLImageElement](https://developer.mozilla.org/docs/Web/API/HTMLImageElement), you can access element-specific attribute values and methods.

{% Assessment 'overview' %}
