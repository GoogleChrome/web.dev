---
layout: post
title: Testing Web Design Color Contrast
subhead: |
  An overview of three tools and techniques for testing and verifying accessible color contrast of your design.
description: |
  An overview of three tools and techniques for testing and verifying accessible color contrast of your design.
authors:
  - adamargyle
  - superhighfives
date: 2022-09-22
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/q6qpUvm2TwTyRWKbYCQd.png
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/93UiiPbes6SjeGjB8w1N.png
alt: Text becoming progressively lower contrast.
tags:
  - blog
  - accessibility
  - ux
---

Say you have some text on a light background, like this:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/VVHanPxNDUxheyZRy3wj.png",
alt="The phrase 'The quick brown fox jumps over the lazy dog again' is shown, where each word or couple of words are a lighter blue. Above each section of progressively faded words is their contrast ratio score. The last few words are very difficult to read because of low contrast.", width="800", height="240" %}

While all of the examples may be readable to you, this isn't the case for
everyone.

Accessible color contrast is a practice that ensures text is readable for
everyone. Sometimes testing contrast is easy and sometimes it's really hard. By
the end of this post you'll have three new tools and techniques for inspecting,
correcting, and verifying your web design contrast so you can tackle the hardest
scenarios.

## WCAG and color contrast

[W3C’s Web Accessibility Initiative](https://www.w3.org/WAI/) provides
strategies, standards, and resources to ensure that the internet is accessible
for as many people as possible. The guidelines that underpin these standards are
called the Web Content Accessibility Guidelines, or WCAG. The latest stable
version, [WCAG 2.1](https://www.w3.org/TR/WCAG21/), covers an important
accessibility requirement: [minimum
contrast](https://www.w3.org/WAI/standards-guidelines/act/rules/afw4f7/proposed/).

The relationship between two colors in WCAG 2.1 is described by their contrast
ratio—that is, the number you get when you compare the luminance of two colors.
Luminance is a way of describing how close a color is to black (0%) or white
(100%). WCAG defines some rules and calculation algorithms around what that
contrast ratio needs to be in order for the web to be accessible. There are
[known issues](https://www.cedc.tools/article.html) with this calculation,
though. Eventually an even more reliable way will be adopted, but, currently,
WCAG is the best we have.

### What are the rules?

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>AA</th>
        <th>AAA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Body text (< 24px)</td>
        <td>4.5</td>
        <td>7</td>
      </tr>
      <tr>
        <td>Large text (> 24px)</td>
        <td>3</td>
        <td>4.5</td>
      </tr>
      <tr>
        <td>UI (icons, graphs, etc.)</td>
        <td>3</td>
        <td>not defined</td>
      </tr>
    </tbody>
  </table>
</div>

A higher contrast ratio is scored with a higher number, like 4.5 or 7 instead of
3. To get more familiar with the scoring table, check out [Polypane's Contrast
Checker](https://polypane.app/color-contrast/).



<figure>
  {% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/WKZJY7co0BADkMfwuqxO.png", alt="Text is shown over purple: one pairing is black text over purple and the other is white text over purple.", width="800", height="438" %}
  <figcaption>
    Which of these color pairings do you feel contrast more?
  </figcaption>
</figure>

## Testing contrast between colors

So, now that we know what we’re looking for, how do we test this? Here are three
free tools to assist you in inspecting, correcting and measuring your web site's
contrast. The strengths and weaknesses of each will be outlined so you can
confidently test the accessibility of your site’s colors and content in a
multitude of ways.

1. [Pika](https://superhighfives.com/pika)<br>
A MacOS app, uniquely capable of showing the contrast of any colors
on the entire screen, colors on gradients, colors with transparency, and more.
Intent is explicit, users manually choose the pixels to compare. A tiny bit less
automated with a huge feature gain.
1. [VisBug](https://visbug.web.app)<br>
A cross browser extension, uniquely able to show more than one contrast overlay
at a time, but like DevTools, sometimes isn't able to detect intent.
1. [Chrome DevTools](https://developer.chrome.com/docs/devtools/)<br>
DevTools is built into Chrome and is packed with various ways to inspect,
correct, and debug color issues, but has shortcomings when inspecting gradients
and semi-transparent colors, and sometimes isn't able to detect intent.

### Pika (macOS application)

If DevTools or VisBug can't assess the contrast properly, like when you need to
test a color outside the browser, or when transparency or gradients are
involved, then **Pika is here to save the day**. Pika has access to every pixel
on the screen because it's a system tool and not a web tool.

<a href="https://superhighfives.com/pika" class="button"
data-type="primary">Download Pika</a>

{% Aside %}
Pika is macOS only—for PC,
[PowerToys](https://docs.microsoft.com/en-us/windows/powertoys/)
includes a color picker
{% endAside %}

This also means the UX for using Pika is different to DevTools or VisBug.
DevTools and VisBug do their best to show the text and background colors from
the browser DOM, while the colors Pika compares are chosen manually from any
point on screen. This gives Pika more control, and opens up some additional use
cases:

- Comparing any two colors regardless of whether or not they’re in the
  browser—if you can see it on your screen, you can test it.
- Comparing colors with transparency.
- Comparing colors within gradients.
- Comparing colors that are using blend modes, like mix-blend-mode in CSS.

#### Comparing any two colors

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/X14wQzs23ozvMQs0FiET.mov",
  autoplay="true",
  loop="true",
  muted="true"
%}

Compare text to a background color:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qJutaWyNQZvDBcQxZHUT.png",
alt="Two grays are compared in a side by side, they have a contrast ratio of 13.01 and is passing AA and AAA targets.", width="800", height="553" %}

Compare stroke and fill colors of vector graphics:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/awGWrJlqYytjJe0aUcDZ.png",
alt="Two purples are compared from a duo-toned icon, they have a contrast ratio of 1.63 and are not passing any WCAG targets.", width="800", height="691" %}

#### Comparing colors with transparency

Compare text color to a variety of background sample pixels. Here, the lightest
gray from the [frosted glass effect](https://codepen.io/argyleink/pen/qBmJyvv)
is used as the background comparison color.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/D7IiPPGcppmBrDlDZ9zM.png",
alt="Two colors that look like gray but are actually very desaturated purples are compared from an image with a blurry semi-transparent caption, they have a contrast ratio of 4.65 and are passing the AA target.", width="800", height="339" %}

#### Comparing colors with gradients

Compare text on a gradient or on an image. Here the L from "Lasso" is
compared against the light blue of the image:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/pvFbvPiUoSKVFkay28Cs.png",
alt="A screenshot from a TV show has the show title overtop, the L is white and the blue behind it are compared. They have a contrast ratio of 8 and are passing the AA and AAA targets.", width="800", height="476" %}

### VisBug

VisBug is a [FireBug](https://getfirebug.com/) inspired tool for designers and
developers to visually inspect, debug, and play with their website design. It's
meant to have a lower barrier to entry than the Chrome DevTools by emulating the
UI and UX of the design tools that folks have come to know and love to use.

[Try VisBug](https://visbug.web.app/) or install on
[Chrome](https://chrome.google.com/webstore/detail/cdockenadnadldjbbgcallicgledbeoc),
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/visbug/),
[Edge](https://microsoftedge.microsoft.com/addons/detail/visbug/kdmdoinnkaeognnpegpkepdnggeaodkn),
[Brave](https://brave.com/learn/installing-chrome-extensions/) or
[Safari](https://apps.apple.com/app/id1538509686).

One of its tool offerings is the Accessibility Inspect tool.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/eBATv3Jt8iONLM5YrOSQ.png",
alt="Screenshot of the VisBug toolbar on the left side of a blank page, the accessibility tool icon is pink and a popover is shown that provides instruction of the tool.", width="800", height="469" %}

#### Inspect across browsers (and even on mobile)

Once the Accessibility Inspect tool has been clicked, anything the user points to, or keyboard navigates to, will have its accessibility information reported in the tooltip. This tooltip includes color comparisons between discovered foreground and background colors.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/47Csfarpjv0NdZFsgXgv.png",
alt="A component with a title and an icon are shown with a pink bounding box around it, a VisBug accessibility tooltip points to the pink box with a color comparison report of the text color and it's background. The ratio is 13.86 and is passing both AA and AAA targets.", width="800", height="833" %}

{% Aside %}
VisBug's color contrast UI is heavily inspired by the fantastic design of
[Pika](https://docs.google.com/document/d/1BSWE83huQ2tjoUl8Y0OlUmc3xKmBabVbVR_jmvhpbV8/edit#heading=h.twmsyyxfn58k).
{% endAside %}

#### Inspect one or many

DevTools can either look at a single color pairing or get a report of all of
your color pairings in the page, but VisBug offers a nice middle ground by
allowing multiple color pairings. Click an element and the tooltip will stay
put. Hold Shift and continue clicking other elements and all of the tooltips
will stay put:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/axWMocJEUs0CCfVTXwVL.png",
alt="A list of links on a webpage are shown with multiple VisBug accessibility overlays, each contextually pointing to and reporting the discovered text and background color contrasts.", width="800", height="583" %}

This is especially important for component based design, where multiple parts of
a component need to pass contrast ratio scores. This method allows seeing all of
those component parts at once. Also great for design reviews.

### Chrome DevTools

If you have [Chrome](https://www.google.com/intl/en_us/chrome/) installed then
you're already equipped with many contrast testing tools:

- [The color picker](#the-chrome-devtools-color-picker)
- [Inspection tooltip](#inspection-tooltip)
- [CSS Overview](#css-overview)
- [Lighthouse](#lighthouse)
- [The JS console](#the-js-console)
- [Colorblind emulation tools](#colorblind-emulation)
- [System color contrast preference
  emulation](#color-contrast-system-preference-emulation)
- [WCAG 3.0 APCA experiment](#try-wcag-30-apca)

#### The Chrome DevTools color picker

In the Chrome DevTools Styles pane of the Elements panel, color values will have
a little visual square color swatch next to them. When this swatch is clicked
you'll see the color picker tool. If possible, the middle of the tool will show
the contrast of the color against a foreground or background.

In the following example, the color picker is opened for a custom property color
value. The contrast ratio score is reported as 15.79 and has two green check
marks, indicating the score passes AA and AAA WCAG 2.1 requirements:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/RialptHZZEuHttshMLdy.png", alt="Screenshot of DevTools Elements panel, in the styles the color picker is shown and in the middle is reporting the contrast ratio of the color of 4.98.", width="800", height="602" %}

##### Color Picker auto correction

Seeing the score while picking colors is handy, but Chrome DevTools has an
additional feature for autocorrection. When the color picker reports a failed
accessible color contrast score it can be expanded to reveal the AA and AAA
score targets, plus an [eye
dropper](https://developer.chrome.com/blog/new-in-chrome-95/#eyedropper) tool.
Next to AA and AAA are swatches and a refresh icon that when clicked will find
the nearest passing color for you:

<style>
  .auto-aspect {
    aspect-ratio: auto;
  }
</style>

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Fa74vzYyHK5vbk6lH2ok.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

If you're not picky about colors, the auto correction feature is a great way to
meet accessibility guidelines and not work too hard to get the task done.

#### Inspection tooltip

The element selection tool has a special feature during page hover that reports
general font, color, and accessibility information. The element selection tool
is the icon on the left in the following screenshot. It’s the box with an arrow
cursor over the bottom right corner. It can also be selected using the hotkey
`Control+Shift+C` (or `Command+Shift+C` on MacOS).

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/ZhRJEcge2Dowm36zBU35.png",
alt="Screenshot of the box and arrow icon in DevTools that invokes the element select tool.", width="446", height="172" %}

Once activated, the icon will turn blue, and pointing to anything in the page
will show the following quick inspect tooltip:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jnpoQugZCrUJTvUG6RC1.png",
alt="A screenshot of an overlay very similar to VisBug, it shows some style information and an accessibility section that shows a contrast score of 15.79 that passes the AA target.", width="708", height="550" %}

Instead of the color picker tool, which requires you to find the color swatch in
the Styles pane, this tool lets you simply point around the page to see contrast
scores. Like the color picker, it can only show one contrast score at a time.

{% Aside %}
This tool and interaction pattern was inspired from VisBug's user experience.
{% endAside %}

#### Bump bump 'til you pass 🎶

I often inspect a color pairing with this quick inspect tool and find it just
short of passing the required ratio. Instead of using the autocorrection feature
of the color picker (because I'm picky) I nudge color channels in the CSS and
watch until I pass the ratio I need. I call this process "[bump bump til you
pass](https://twitter.com/argyleink/status/1402694231118946304?s=20&t=kW9Q6J03nbjyAW27Sxn7hw)"
because I'm bumping color channel numbers until they pass WCAG 2.1.

The steps are as follows, and must be done in the exact order:

1. Set keyboard focus inside a color in the Styles panel.
1. Activate the inspect element tool with the keyboard shortcut
   `Control+Shift+C` (or `Command+Shift+C` on MacOS).
1. Point over a target.
1. Press up/down on the keyboard to change the numbers in the color value.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/n7aKGgeh4nGFymLK9ypL.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

This works because the CSS style value still has your keyboard focus, while the
mouse is allowing you to point over a target. Make sure not to click your target
or focus will move from the color value area and not let you nudge values
anymore until refocused.

#### CSS overview

Up to this point, Chrome DevTools has provided ways to look at one color pairing
at a time, but the [CSS
Overview](https://developer.chrome.com/docs/devtools/css-overview/) can crawl
your entire page and present all the inaccessible pairings at once:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/wGFo3rxvWyACrT6ZVxtm.png",
alt="Screenshot of the Overview Summary from running the CSS Overview capture tool. It shows 7 contrast issues, showing the discovered color pairings and their failing results.", width="800", height="283" %}

Read more about this feature in this post [CSS Overview: Identify potential CSS
improvements](https://developer.chrome.com/docs/devtools/css-overview/) or watch
Jecelyn Yeen on YouTube in their series DevTools Tips teach you how to [Identify
potential CSS improvements with the CSS Overview
panel](https://www.youtube.com/watch?v=OAP_Sr0zb5I).

#### Lighthouse

Lighthouse is another auditing tool in Chrome DevTools. It can crawl your page
and report inaccessible color pairings. It features tiny screenshots of each
color pairing for you to review, passing and failing. Any failing combinations
will negatively impact your Lighthouse score.

Here's what those results can look like:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/uo97bt52l87Tbk6C6NZC.png",
alt="A screenshot of a Lighthouse evaluation, showing results of low-contrast text of the color combinations of 2 words.", width="800", height="567" %}

#### The JS console

Maybe all the tools listed so far just aren’t where you are. Maybe where you are
(all day) is JavaScript. [Here's an experiment to
try](https://developer.chrome.com/blog/new-in-devtools-90/?utm_source=devtools#low-contrast).
The Issues pane of the console can constantly report any color contrast
accessibility issues as you build. Enable the feature in Settings > Experiments,
as shown in the following:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/pz17vgSpdFuU0NYGZJhc.png", alt="Screenshot of an enabled checkbox: 'Enable automatic contrast issue reporting via the Issues panel.'", width="800", height="47" %}

Then open the Issue pane and see if it's made any discoveries. If it does, they
can look like this:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qtXnfLI296d57IWhdPP5.png",
alt="Screenshot of the Issues panel inside the Console, it reports 6 errors around contrast.", width="800", height="521" %}

#### Colorblind emulation

While on the topic of color contrast and ensuring accessible color pairings,
it's worth pointing out the vision deficiencies emulation tool. This will change
the colors or appearance of your design to demonstrate the results of different
varieties of color blindness, giving you the opportunity to modify your design
so that color isn't the only way the UX is communicating to a user.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/R9FpuGeUS9GlYfToWvfK.png",
alt="Screenshot of the options in the emulation DevTools for emulating vision deficiencies: no emulation, blurred vision, protanopia, deuteranopia, tritanopia, achromatopsia.", width="800", height="558" %}

It's not a safe accessibility practice to exclusively use color to depict
information, like red for bad and green for good. Some folks don't see greens or
reds the same and this emulation tool will help you experience and remember
that.

#### Color contrast system preference emulation

More and more, users are changing their contrast settings in their operating
system, giving them the ability to ask for less or more contrast personalization
in their UI. CSS can tap into this setting, just as it can with light or dark
theme preferences. Chrome DevTools offers the ability to emulate this preference
so designs can test and adapt to the user request without toggling the setting
from the system.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zSpeqvfJk9V2XrFZWNsb.png",
alt="Screenshot of the options in the emulation DevTools for emulating the CSS media query prefers-contrast: no emulation, more, less, custom.", width="800", height="315" %}

#### Try WCAG 3.0 APCA

Another experiment to try is testing your color pairings with the experimental
APCA color ratio scoring system. Enabled through Settings > Experiments, it
replaces the WCAG 2.1 ratio system with a newer and improved contrast checker
algorithm, letting you preview its results as the proposal works towards a
standard.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/k3P5tDwEueZFFGqQH40m.png",
alt="Screenshot of an enabled checkbox: 'Enable new Advanced Perceptual Contrast Algorithm (APCA) replacing previous contrast ratio and AA/AAA guidelines.'", width="800", height="131" %}

Once enabled, use the point inspect tooltip or the color picker to see the color
pairing score and see if it passes:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/s2qRDE5RRswXWwwKewRI.png",
alt="Devtools inspect element tooltip is showing -100.2% for the contrast score on a dd element.", width="800", height="365" %}

## Conclusion

Color contrast is an important piece of the puzzle for accessibility on the web,
and adhering to it makes the web more usable for the greatest number of people
in the most varied situations. Hopefully these three tools help you feel
empowered to make great color choices.
