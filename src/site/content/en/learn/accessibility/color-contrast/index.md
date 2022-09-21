---
title: 'Color and contrast'
authors:
  - cariefisher
description: How to create accessible color palettes with appropriate contrast.
date: 2023-09-23
tags:
  - accessibility
---

Have you ever tried to read text on a screen and found it difficult to read due
to the color scheme or struggled to see the screen in a very bright or
low-light environment? Or maybe you are someone with a more permanent color
vision issue, like the estimated [300 million people with color blindness](https://www.colourblindawareness.org/colour-blindness/)
or the [253 million people with low vision](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5820628/)? 

As a designer or developer, you need to understand how people perceive color
and contrast, whether temporary, situationally, or permanently. This will help
you best support their visual needs.

This module will introduce you to some accessible color and contrast fundamentals.

## Perceiving color

Did you know that objects do not possess color but reflect wavelengths of 
light? When you see color, your eyes receive and process those wavelengths and 
convert them to colors.

<figure>
{% Img
  src="image/VbsHyyQopiec0718rMq2kTE1hke2/cXQwXdc8J77KegJZtDD6.png", alt="An eye viewing the color wheel.", width="600", height="350"
%}
</figure>

When it comes to digital accessibility, we talk about these wavelengths in
terms of hue, saturation, and lightness (HSL). The HSL model was created as an
alternative to the RGB color model and more closely aligns with how a human
perceives color.

{% Aside %}
In CSS, a color can be specified in many ways, such as using color names, RGB,
RGBa, HEX, HSL, HSLa, HSV, or HSVa values. HSLa is similar to HSL, only an
alpha value has been added. Alpha is a measurement of opacity and is defined as
a number between 0.0 (fully transparent) and 1.0 (fully opaque).
{% endAside %}

_Hue_ is a qualitative way to describe a color, such as red, green, or blue,
where each hue has a specific spot on the color spectrum with values ranging
from 0 to 360, with red at 0, green at 120, and blue at 240.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'eYrEZqE',
 height: 300,
 theme: 'dark',
 tab: 'css,result',
 allow: ['geolocation']
} %}

Saturation is the intensity of a color, measured in percentages ranging from 0%
to 100%. A color with full saturation (100%) would be very vivid, while a color
with no saturation (0%) would be grayscale or black and white.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'vYjJKBP',
 height: 300,
 theme: 'dark',
 tab: 'css,result',
 allow: ['geolocation']
} %}

Lightness is a color's light or dark character, measured in percentages ranging
from 0% (black) to 100% (white). 

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'poVrboR',
 height: 300,
 theme: 'dark',
 tab: 'css,result',
 allow: ['geolocation']
} %}

## Measuring color contrast

To help support people with various visual disabilities, the W3C created a
[color contrast formula](https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio) to
ensure [enough contrast exists](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
between the text and its background. When these color contrast ratios are
followed, people with moderately low vision can read text on the background
without needing contrast-enhancing assistive technology.

Let's look at images with a vibrant color palette and compare how that image
would appear to those with specific forms of color blindness.

<div class="switcher">
<figure>
  {% Img
    src="image/VbsHyyQopiec0718rMq2kTE1hke2/Tan7yQpVFXDwUFxta05Z.jpg", alt="Original rainbow sand.", width="640", height="427"
    %}
    <figcaption>
      Photo by Alexander Grey on <a href="https://unsplash.com/photos/QGQz-IBBl5w">Unsplash</a>.
    </figcaption>
</figure>
<figure>
    {% Img
      src="image/VbsHyyQopiec0718rMq2kTE1hke2/3T6ZA4XYZA4sdCUZluNT.jpg", alt="Original rainbow pattern.", width="640", height="427"
      %}
      <figcaption>        
        Photo by Clark Van Der Beken on <a href="https://unsplash.com/photos/xFdrt8YIoJc">Unsplash</a>.
      </figcaption>
</figure>
</div>

On the left, the image shows rainbow sand with purple, red, orange, yellow, aqua green, light blue, and dark blue colors. On the right is a brighter, multicolored rainbow pattern. 

<!-- ADD IMAGES -->

[Deuteranopia](https://www.color-blindness.com/deuteranopia-red-green-color-blindness/) (green blind) - Population % - Male: 1-5, Female: 0.1-0.35.

People with Deuteranopia have a reduced sensitivity to green light. This color blindness filter simulates what this type of color blindness might look like.

<!-- ADD IMAGES -->

[Protanopia](https://www.color-blindness.com/protanopia-red-green-color-blindness/) (red blind) - Population % - Male: 1.01-1.08, Female: 0.02-0.03

People with Protanopia have a reduced sensitivity to red light. This color blindness filter simulates what this type of color blindness might look like.

<!-- ADD IMAGES -->
[Achromatopsia/Monochromatism](https://www.color-blindness.com/2007/07/20/monochromacy-complete-color-blindness/) (RGB blind) - Population % - Male/Felmale: very rare
People with Achromatopsia or Monochromatism have almost no perception of red, green, or blue light. This color blindness filter simulates what this type of color blindness might look like.


The color contrast formula uses the
[relative luminance](https://www.w3.org/TR/WCAG/#dfn-relative-luminance) of
colors to help determine contrast.

```text
(L1 + 0.05) / (L2 + 0.05)
L1 is the relative luminance of the lighter color
L2 is the relative luminance of the darker colors
```

Thankfully, no advanced math is required as there are a lot of tools that will do the color contrast calculations for you. Tools like [Adobe Color](https://color.adobe.com/create/color-accessibility), [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/), [Leonardo](https://leonardocolor.io/), and [Chrome’s DevTools color picker](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast) can quickly tell you the color contrast ratios and offer suggestions to help create the most inclusive color pairs and palettes.
https://codepen.io/web-dot-dev/pen/PoeKzWq

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'PoeKzWq',
 height: 300,
 theme: 'dark',
 tab: 'css,result',
 allow: ['geolocation']
} %}
