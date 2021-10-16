---
layout: post
title: Color and contrast accessibility
authors:
  - dgash
  - megginkearney
  - rachelandrew
  - robdodson
date: 2020-03-31
updated: 2020-05-29
description: |
  If you have good vision, it's easy to assume that everyone perceives colors, or text legibility, the same way you do — but of course that's not the case.
tags:
  - accessibility
---

If you have good vision, it's easy to assume that everyone perceives colors,
or text legibility, the same way you do—but of course that's not the case.

As you might imagine,
some color combinations that are easy for some people to read are difficult or impossible for others.
This usually comes down to color contrast,
the relationship between the foreground and background colors' luminance.
When the colors are similar, the contrast ratio is low;
when they are different, the contrast ratio is high.

The [WebAIM guidelines](https://webaim.org/standards/wcag/) recommend an AA (minimum) contrast ratio of 4.5:1 for all text.
An exception is made for very large text (120-150% larger than the default body text),
for which the ratio can go down to 3:1. Notice the difference in the contrast ratios shown below.

<figure class="w-figure">
  {% Img src="image/admin/DcYclKelVqhQ2CWlIG97.jpg", alt="An image showing the different contrast ratios", width="800", height="328" %}
</figure>

The contrast ratio of 4.5:1 was chosen for level AA
because it compensates for the loss in contrast sensitivity
usually experienced by users with vision loss equivalent to approximately 20/40 vision.
20/40 is commonly reported as typical visual acuity of people at about age 80.
For users with low vision impairments or color deficiencies,
we can increase the contrast up to 7:1 for body text.

You can use the Accessibility Audit in Lighthouse to check your color contrast.
Open DevTools, click Audits, and select Accessibility to run the report.

<figure class="w-figure">
  {% Img src="image/admin/vSFzNOurQO6z2xV6qWuW.png", alt="A screenshot of the output of an audit for color contrast.", width="800", height="218", class="w-screenshot" %}
</figure>

Chrome also includes an experimental feature to help you [detect all the low contrast texts of your page](https://developers.google.com/web/updates/2020/10/devtools#css-overview). You can also use the [accessible color suggestion](https://developers.google.com/web/updates/2020/08/devtools#accessible-color) to fix the low contrast text.

<figure class="w-figure">
  {% Img src="image/admin/VYZeK2l2vs6pIoWhH2hO.png", alt="A screenshot of the output of the Chrome low contrast text experimental feature.", width="800", height="521", class="w-screenshot" %}
</figure>

For a more complete report, install the [Accessibility Insights Extension](https://accessibilityinsights.io/).
One of the checks in the Fastpass report, is color contrast.
You will get a detailed report of any failing elements.

<figure class="w-figure w-screenshot">
  {% Img src="image/admin/CR21TFMZw8gWsSTWOGIF.jpg", alt="The report in Accessibility Insights", width="800", height="473" %}
</figure>

## Advanced Perceptual Contrast Algorithm (APCA)

The [Advanced Perceptual Contrast Algorithm (APCA)](https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html) is a new way to compute contrast based on modern research on color perception.

Compared to [AA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum)/[AAA](https://www.w3.org/WAI/WCAG21/quickref/#contrast-enhanced) guidelines, APCA is more context-dependent.

The contrast is calculated based on the following features:

- Spatial properties (font weight and text size)
- Text color (perceived lightness difference between text and background)
- Context (ambient light, surroundings, and intended purpose of the text)

Chrome includes an [experimental feature to replace the AA/AAA contrast ratio guidelines with APCA](https://developers.google.com/web/updates/2021/01/devtools#apca).

<figure class="w-figure">
  {% Img src="image/admin/YhGKRLYvt37j3ldlwiXE.png", alt="A screenshot of the output of the APCA feature in Chrome.", width="800", height="543", class="w-screenshot" %}
</figure>

## Don't convey information with color alone

There are roughly 320 million people worldwide with color vision deficiency.
About 1 in 12 men and 1 in 200 women have some form of "color blindness";
that means about 1/20th, or 5%, of your users will not experience your site the way you intended.
When we rely on color to convey information, we push that number to unacceptable levels.

{% Aside %}
Note: The term "color blindness" is often used to describe a visual condition where a person has trouble distinguishing colors,
but in fact very few people are truly color blind.
Most people with color deficiencies can see some or most colors,
but have difficulty differentiating between certain colors such as reds and greens (most common),
browns and oranges, and blues and purples.
{% endAside %}

For example, in an input form,
a telephone number might be underlined in red to show that it is invalid.
But to a color deficient or screen reader user, that information is not conveyed well, if at all.
Thus, you should always try to provide multiple avenues for the user to access critical information.

<figure class="w-figure" style="width: 200px">
  {% Img src="image/admin/MKmlhejyjNpk7XE9R2KV.png", alt="A image of an input form with an incorrect phone number highlighted only with a red color.", width="293", height="323", class="w-screenshot" %}
</figure>

The [WebAIM checklist states in section 1.4.1](https://webaim.org/standards/wcag/checklist#sc1.4.1) that
"color should not be used as the sole method of conveying content or distinguishing visual elements."
It also notes that "color alone should not be used to distinguish links from surrounding text"
unless they meet certain contrast requirements.
Instead, the checklist recommends adding an additional indicator such as an underscore
(using the CSS `text-decoration` property) to indicate when the link is active.

An easy way to fix the previous example is to add an additional message to the field,
 announcing that it is invalid and why.

<figure class="w-figure" style="width: 200px">
  {% Img src="image/admin/FLQPcG16akNRoElx3pnz.png", alt="The same input form as in the last example, this time with a text label indicating the problem with the field.", width="292", height="343", class="w-screenshot" %}
</figure>

When you're building an app, keep these sorts of things in mind
and watch out for areas where you may be relying too heavily on color to convey important information.

If you're curious about how your site looks to different people,
or if you rely heavily on the use of color in your UI,
you can use DevTools to simulate various forms of visual impairment,
including different types of color blindness.
Chrome includes an [Emulate Vision Deficiencies feature](https://developers.google.com/web/updates/2020/03/devtools#vision-deficiencies).
To access it open DevTools and then open the **Rendering** tab in the Drawer,
you can then emulate the following color deficiencies.

- Protanopia: the inability to perceive any red light.
- Deuteranopia: the inability to perceive any green light.
- Tritanopia: the inability to perceive any blue light.
- Achromatopsia: the inability to perceive any color except for shades of grey (extremely rare).

<figure class="w-figure">
  {% Img src="image/admin/VAnFxYhzFcpovdTCToPl.jpg", alt="Emulating the vision of a person with Achromatopsia shows our page in greyscale.", width="800", height="393", class="w-screenshot--filled" %}
</figure>

## High contrast mode

High-contrast mode allows a user to invert foreground and background colors,
which often helps text stand out better.
For someone with a low vision impairment,
high-contrast mode can make it much easier to navigate the content on the page.
There are a few ways to get a high-contrast setup on your machine.

Operating systems like Mac OSX and Windows offer high-contrast modes
that can be enabled for everything at the system level.

A useful exercise is to turn on high-contrast settings
and verify that all of the UI in your application is still visible and usable.

For example, a navigation bar might use a subtle background color
to indicate which page is currently selected.
If you view it in a high-contrast extension, that subtlety completely disappears,
and with it goes the reader's understanding of which page is active.

<figure class="w-figure" style="width: 500px">
  {% Img src="image/admin/dgmA4W1Qu8JmcgsH80HD.png", alt="Screenshot of a navigation bar in high contrast mode where the acvtive tab is hard to read", width="640", height="57", class="w-screenshot" %}
</figure>

Similarly, if you consider the example from the previous lesson,
the red underline on the invalid phone number field might be
displayed in a hard-to-distinguish blue-green color.

<figure class="w-figure">
  {% Img src="image/admin/HtlXwmHQHBcAO4LYSfAA.jpg", alt="Screenshot of the address form used earlier, this time in high contrast mode. The color change of the invalid element is hard to read.", width="700", height="328" %}
</figure>

If you are meeting the contrast ratios covered earlier
you should be fine when it comes to supporting high-contrast mode.
But for added peace of mind, consider installing the
[High Contrast Chrome Extension](https://chrome.google.com/webstore/detail/high-contrast/djcfdncoelnlbldjfhinnjlhdjlikmph)
and giving your page a once-over just to check that everything works, and looks, as expected.
