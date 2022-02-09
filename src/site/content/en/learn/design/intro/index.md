---
title: Introduction
description: >
  Find out where responsive design came from.
authors:
  - adactio
date: 2021-11-03
---

Right from the start,
the World Wide Web was designed to be agnostic.
It doesn't matter what hardware you've got.
It doesn't matter what operating system your device is running.
As long as you can connect to the internet, the World Wide Web is accessible to you.

In the early days of the web, most people were using desktop computers.
These days the web is available on desktops, laptops, tablets, foldable phones, fridges, and cars.
People rightly expect that websites will look good no matter what device they're using.
Responsive design makes this possible.

Responsive design isn't the first approach to designing websites.
In the years before responsive design, web designers and developers tried many different techniques.

## Fixed-width design

In the early 1990s, when the web was first becoming popular,
most monitors had screen dimensions of 640 pixels wide by 480 pixels tall.
These were convex cathode ray tubes,
not like the flat liquid crystal displays we have now.

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/0a8vHe4LgChVZvaZQfYs.png",
alt="The Microsoft website with two simple columns of text plus a navbar.",
width="640", height="480" %}
  <figcaption>The Microsoft website in the late 90s designed for a width of 640 pixels. Screenshot from <a href="https://archive.org">archive.org</a></figcaption>
</figure>

In the formative days of early web design,
it was a safe bet to design web pages with a width of 640 pixels.
But while other technologies like phones and cameras were miniaturizing,
screens were getting bigger (and eventually, flatter).
Before long, most screens had dimensions of 800 by 600 pixels.
Web designs changed accordingly. Designers and developers started assuming that 800 pixels was a safe default.

<figure>
  {% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/C88van0yWyvbz5l746pB.png", alt="The Microsoft website using a three-column, mostly text-based design.", width="800", height="600" %}
  <figcaption>The Microsoft website in the learly 2000s designed for a width of 800 pixels. Screenshot from <a href="https://archive.org">archive.org</a></figcaption>
</figure>

Then the screens got bigger again. 1024 by 768 became the default.
It felt like an arms race between web designers and hardware manufacturers.

​​<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/nuHSqBVgInTvLti73Qz2.png", alt="The Microsoft website with a more complex design using images as well as text.", width="800", height="600" %}
<figcaption>The Microsoft website in the mid 2000s designed for a width of 1024 pixels. Screenshot from <a href="https://archive.org">archive.org</a></figcaption>
</figure>

Whether it was 640, 800, or 1024 pixels,
choosing one specific width to design for was called fixed-width design.

If you specify a fixed width for your layout,
then your layout will only look good at that specific width.
If a visitor to your site has a wider screen than the width you have chosen, then there'll be wasted space on the screen.
You can center the content of your pages to distribute that space more evenly
(instead of having empty space on one side) but you still wouldn't be taking full advantage of the available space.

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/t0Zd1eGEJeeqMO8ItsqK.png", alt="A narrow layour with a lot of white space around it.", width="800", height="320" %}
<figcaption>The Yahoo website from the early 2000s as experienced in a browser that's wider than the site's 800 pixel wide design. Screenshot from <a href="https://archive.org">archive.org</a></figcaption>
</figure>

Similarly, if a visitor arrives with a narrower screen than the width you've chosen,
then your content won't fit horizontally.
The browser generates a crawlbar—the horizontal equivalent of a scrollbar—and the user has to move the whole page left and right to see all the content.

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/bnh7fDiGjFhdBHTD5CJ8.png", alt="A website that appears cut-off to the right due to being too wide for the viewport.", width="420", height="640" %}
<figcaption>The Yahoo website from the early 2000s as experienced in a browser that's narrower than the site's 800 pixel wide design. Screenshot from <a href="https://archive.org">archive.org</a></figcaption>
</figure>

{% Codepen {
 user: 'web-dot-dev',
 id: 'RwZjwoQ',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

## Liquid layouts

While the majority of designers used fixed-width layouts, some chose to make their layouts flexible.
Instead of using fixed widths for your layouts you could make a flexible layout using percentages for your column widths.
These designs work in more situations than a fixed-width layout that only looks right at one specific size.

These were called liquid layouts.
But while a liquid layout will look good across a wide range of widths, it will begin to worsen at the extremes.
On a wide screen the layout looks stretched.
On a narrow screen the layout looks squashed. Both scenarios aren't ideal.

<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/oBAbgP2JCt2zVENHVCnc.png", alt="A layout that is squashed into a narrow window.", width="420", height="640" %}
<figcaption>Wikipedia's liquid layout from the mid 2000s as experienced in a narrow browser window. Screenshot from <a href="https://archive.org">archive.org</a></figcaption>
</figure>
​​
<figure>
{% Img src="image/KT4TDYaWOHYfN59zz6Rc0X4k4MH3/zRBSmS1xCgYPTueUBMd9.png", alt="A layout stretched horizontally with very long line lengths.", width="800", height="320" %}
<figcaption>Wikipedia's liquid layout from the mid 2000s as experienced in a wide browser window. Screenshot from <a href="https://archive.org">archive.org</a></figcaption>
</figure>

You can mitigate these problems by using `min-width` and `max-width` for your layout.
But then at any size below the minimum width or above the maximum width you've got the same issues you'd have with a fixed-width layout.
On a wide screen there'd be unused space going to waste.
On a narrow screen, the user would have to move the whole page left and right to see everything.

<figure>
{% Codepen {
 user: 'web-dot-dev',
 id: 'YzxEzpE',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}

<figcaption>Open <a href="https://codepen.io/web-dot-dev/pen/YzxEzpE">the liquid layout example</a>
in a new browser window to see how changing the size of the window stretches the design.</figcaption>
</figure>

The word _liquid_ is just one of the terms used to describe this kind of layout.
These kinds of designs were also called fluid layouts or flexible layouts.
The terminology was as fluid as the technique.

## Small screens

In the 21st century, the web continued to get bigger and bigger.
So did monitors. But new screens arrived that were smaller than any desktop device.
With the arrival of mobile phones with fully-featured web browsers, designers faced a dilemma.
How could they ensure their designs would look good on a desktop computer and a mobile phone?
They needed a way of styling their content for screens as small as 240 pixels wide and as large as thousands of pixels wide.

## Separate sites

One option is to make a separate subdomain for mobile visitors.
But then you have to maintain two separate codebases and designs.
And in order to redirect visitors on mobile devices, you'd need to do
[user-agent sniffing](https://en.wikipedia.org/wiki/Browser_sniffing),
which can be unreliable and easily spoofed.
Chrome will be deprecating its user-agent string for privacy reasons.
Also, there's no clear line between mobile and not-mobile. Which site do you send tablet devices to?

## Adaptive layouts

Instead of having separate sites on different subdomains,
you could have a single site with two or three fixed-width layouts.

When media queries first arrived in CSS, they opened the door to making layouts more flexible.
But many developers were still most comfortable making fixed-width layouts.
One technique involved switching between a handful of fixed-width layouts at specified widths.
Some people call this an adaptive design.

Adaptive design allowed designers to provide layouts that looked good at a few different sizes,
but the design never looked quite right when viewed between those sizes.
The problem of excess space persisted although it wasn't as bad as in a fixed-width layout.

Using CSS media queries, you can give people the layout that's closest to their browser width.
But given the variety of device sizes, chances are the layout will look less than perfect for most people.

<figure>
{% Codepen {
 user: 'web-dot-dev',
 id: 'oNeoNYw',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}
<figcaption>Open <a href="https://codepen.io/web-dot-dev/pen/oNeoNYw">the adaptive layout example</a>
in a new browser window to see how changing the size of the window causes the design to jump between layouts.</figcaption>
</figure>

## Responsive web design

If adaptive layouts are a mashup of media queries and fixed-width layouts, responsive web design is a mashup of media queries and liquid layouts.

<figure>
{% Codepen {
 user: 'web-dot-dev',
 id: 'JjyOjbE',
 height: 500,
 theme: 'dark',
 tab: 'result'
} %}
<figcaption>Open <a href="https://codepen.io/web-dot-dev/pen/JjyOjbE">the responsive design example</a>
in a new browser window to see how changing the size of the window causes the design to fluidly change layout.</figcaption>
</figure>

The term was coined by [Ethan Marcotte](https://ethanmarcotte.com/) in
[an article in A List Apart](https://alistapart.com/article/responsive-web-design/) in 2010.

Ethan defined three criteria for responsive design:

1. Fluid grids
2. Fluid media
3. Media queries

The layout and images of a responsive site would look good on any device. But there was one problem.

## A `meta` element for `viewport`

Browsers on mobile phones had to deal with websites that were designed with fixed-width layouts for wider screens.
By default mobile browsers assumed that 980 pixels was the width that people were designing for (and they weren't wrong).
So even if you used a liquid layout,
the browser would apply a width of 980 pixels and then scale the rendered web page down to the actual width of the screen.

If you're using responsive design you need to tell the browser not to do that scaling.
You can do that with a `meta` element in the `head` of the web page:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

There are two values, separated by commas.
The first one is `width=device-width`.
This tells the browser to assume the width of the website is the same as the width of the device
(instead of assuming the width of the website is 980 pixels).
The second value is `initial-scale=1`.
This tells the browser how much or how little scaling to do.
With a responsive design, you don't want the browser to do any scaling at all.

<figure>
{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/HahSW2IXIkGux7cMCMpE.png", alt="Images of two mobile phones containing text, one appearing zoomed out due to not having the meta tag in place.", width="800", height="748" %}
  <figcaption>The phone on the left shows how the layout looks before the meta tag is in place, when compared to the layout on the right.</figcaption>
</figure>

With that `meta` element in place, your web pages are ready to be responsive.

## Modern responsive design

Today we have the ability to make websites that are responsive in ways far beyond viewport sizes.
Media features give developers access to user preferences and enable customized experiences.
Container queries enable components to own their own responsive information.
The `picture` element empowers designers to make art-direction decisions based on screen ratios.

{% Assessment 'intro' %}

Responsive design is an exciting, growing world of possibilities.
In the rest of this course, you'll learn about these technologies and how to use them to create beautiful,
responsive websites for everyone.
