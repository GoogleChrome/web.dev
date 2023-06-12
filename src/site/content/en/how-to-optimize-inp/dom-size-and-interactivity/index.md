---
layout: post
title: How large DOM sizes affect interactivity, and what you can do about it
subhead: |
  Large DOM sizes have more of an effect on interactivity than you might think. This guide explains why, and what you can do.
authors:
  - jlwagner
date: 2023-05-09
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/pUkrnwlKeVr2PXK8nfyY.jpg
Thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/aOStgq7HBKxGMfe8XpXt.jpg
alt: A photo of numerous crates, stacked loosely atop one another in rows.
description: |
  Large DOM sizes can be a factor in whether interactions are fast or not. Learn more about the relationship between DOM size and INP, and what you can do to reduce DOM size and other ways to limit rendering work when your page has lots of DOM elements.
tags:
  - blog
  - performance
  - web-vitals
---

There's no way around it: when you build a web page, that page is going to have a [Document Object Model (DOM)](https://developer.mozilla.org/docs/Web/API/Document_Object_Model). The DOM represents the structure of your page's HTML, and gives JavaScript and CSS access to a page's structure and contents.

The problem, however, is that the _size_ of the DOM affects a browser's ability to render a page quickly and efficiently. Generally speaking, the larger a DOM is, the more expensive it is to initially render that page and update its rendering later on in the page lifecycle.

This becomes problematic in pages with very large DOMs when interactions that modify or update the DOM trigger expensive layout work that affects the ability of the page to respond quickly. Expensive layout work can affect a page's [Interaction to Next Paint (INP)](/inp/); If you want a page to respond quickly to user interactions, it's important to ensure your DOM sizes are only as large as necessary.

## When is a page's DOM _too_ large?

{% Aside 'key-term' %}
It's important to know the difference between DOM elements and DOM nodes. A DOM _element_ refers to a specific [HTML element](https://developer.mozilla.org/docs/Web/API/HTMLElement) in the DOM tree. A [DOM _node_](https://developer.mozilla.org/docs/Web/API/Node) has overlapping meaning with the DOM element term, but its definition is expanded to include comments, whitespace, and text. While the [Lighthouse DOM size audit](https://developer.chrome.com/en/docs/lighthouse/performance/dom-size/) refers to DOM nodes, this guide will refer to DOM elements over nodes whenever possible.
{% endAside %}

[According to Lighthouse](https://developer.chrome.com/en/docs/lighthouse/performance/dom-size/#how-the-lighthouse-dom-size-audit-fails), a page's DOM size is excessive when it exceeds 1,400 nodes. Lighthouse will begin to throw warnings when a page's DOM exceeds 800 nodes. Take the following HTML for example:

```html
<ul>
  <li>List item one.</li>
  <li>List item two.</li>
  <li>List item three.</li>
</ul>
```

In the above code, there are four DOM elements: the `<ul>` element, and its three `<li>` child elements. Your web page will almost certainly have many more nodes than this, so it's important to understand what you can do to keep DOM sizes in check—as well as other strategies to optimize the rendering work once you've gotten a page's DOM as small as it can be.

## How do large DOMs affect page performance?

Large DOMs affect page performance in a few ways:

1. During the page's initial render. When CSS is applied to a page, a structure similar to the DOM known as the [CSS Object Model (CSSOM)](/critical-rendering-path-constructing-the-object-model/#css-object-model-cssom) is created. As CSS selectors increase in specificity, the CSSOM becomes more complex, and more time is needed to run the necessary layout, styling, compositing, and paint work necessary to draw the web page to the screen. This added work increases interaction latency for interactions that occur early on during page load.
2. When interactions modify the DOM, either through element insertion or deletion, or by modifying DOM contents and styles, the work necessary to render that update can result in very costly layout, styling, compositing, and paint work. As is the case with the page's initial render, an increase in CSS selector specificity can add to rendering work when HTML elements are inserted into the DOM as the result of an interaction.
3. When JavaScript queries the DOM, references to DOM elements are stored in memory. For example, if you call [`document.querySelectorAll`](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll) to select all `<div>` elements on a page, the memory cost could be considerable if the result returns a large number of DOM elements.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/qqLuCIvjmvKn5L8YTLGt.png", alt="A screenshot of a long task caused by excessive rendering work in the performance panel of Chrome DevTools. The long task's call stack shows significant time spent recalculating page styles, as well as pre-paint.", width="800", height="248" %}
  <figcaption>
    A long task as shown in the performance profiler in Chrome DevTools. The long task shown is caused by inserting DOM elements into a large DOM via JavaScript.
  </figcaption>
</figure>

All of these can affect interactivity, but the second item in the list above is of particular importance. If an interaction results in a change to the DOM, it can kick off a lot of work that can contribute to a poor INP on a page.

## How do I measure DOM size?

You can measure DOM size in a couple of ways. The first method uses Lighthouse. When you run an audit, statistics on the current page's DOM will be in the "Avoid an excessive DOM size" audit under the "Diagnostics" heading. In this section, you can see the total number of DOM elements, the DOM element containing the most child elements, as well as the deepest DOM element.

A simpler method involves using the JavaScript console in the developer tools in any major browser. To get the total number of HTML elements in the DOM, you can use the following code in the console after the page has loaded:

```js
document.querySelectorAll('*').length;
```

{% Aside %}
Note that the code snippet above only includes the number of HTML _elements_ in the DOM. It doesn't include all the _nodes_ in the DOM.
{% endAside %}

If you want to see the DOM size update in realtime, you can also use the [performance monitor tool](https://developer.chrome.com/blog/new-in-devtools-64/#perf-monitor). Using this tool, you can correlate layout and styling operations (and other performance aspects) along with the current DOM size.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/mjhhoz41DjdR4cZFwU89.png", alt="A screenshot of the performance monitor in Chrome DevTools. At left, there are various aspects of page performance that can be continuously monitored during the life of the page. In the screenshot, the number of DOM nodes, layouts per second, and style recalculations per section are actively being monitored.", width="800", height="273" %}
  <figcaption>
    The performance monitor in Chrome DevTools. In this view, the page's current number of DOM nodes is charted along with layout operations and style recalculations performed per second.
  </figcaption>
</figure>

If the DOM's size is approaching Lighthouse DOM size's warning threshold—or fails altogether—the next step is to figure out how to reduce the DOM's size to improve your page's ability to respond to user interactions so that your website's INP can improve.

## How can I measure the number of DOM elements affected by an interaction?

If you're profiling a slow interaction in the lab that you suspect might have something to do with the size of the page's DOM, you can figure out how many DOM elements were affected by selecting any piece of activity in the profiler labeled "Recalculate Style" and observe the contextual data in the bottom panel.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/IjTPVbiLoerWFO5eClbl.png", alt="A screenshot of selected style recalculation activity in the performance panel of Chrome DevTools. At top, the interactions track shows a click interaction, and the majority of the work is spent doing style recalculation and pre-paint work. At the bottom, a panel shows more detail for the selected activity, which reports that 2,547 DOM elements were affected.", width="800", height="639" %}
  <figcaption>
    Observing the number of affected elements in the DOM as the result of style recalculation work. Note that the shaded portion of the interaction in the interactions track represents the portion of the interaction duration that was over 200 milliseconds, which is <a href="https://web.dev/inp/#what-is-a-good-inp-score" rel="noopener">the designated "good" threshold for INP</a>.
  </figcaption>
</figure>

In the above screenshot, observe that the style recalculation of the work—when selected—shows the number of affected elements. While the above screenshot shows an extreme case of the effect of DOM size on rendering work on a page with many DOM elements, this diagnostic info is useful in any case to determine if the size of the DOM is a limiting factor in how long it takes for the next frame to paint in response to an interaction.

## How can I reduce DOM size?

Beyond auditing your website's HTML for unnecessary markup, the principal way to reduce DOM size is to reduce DOM depth. One signal that your DOM might be unnecessarily deep is if you're seeing markup that looks something like this in the **Elements** tab of your browser's developer tools:

```html
<div>
  <div>
    <div>
      <div>
        <!-- Contents -->
      </div>
    </div>
  </div>
</div>
```

When you see patterns like this, you can probably simplify them by flattening your DOM structure. Doing so will reduce the number of DOM elements, and likely give you an opportunity to simplify page styles.

DOM depth may also be a symptom of the frameworks you use. In particular, component-based frameworks—such as those that rely on [JSX](https://reactjs.org/docs/introducing-jsx.html)—require you to nest multiple components in a parent container.

However, many frameworks allow you to avoid nesting components by using what are known as fragments. Component-based frameworks that offer fragments as a feature include (but are not limited to) the following:

- [React](https://reactjs.org/docs/fragments.html)
- [Preact](https://preactjs.com/guide/v10/components/#fragments)
- [Vue](https://v3-migration.vuejs.org/new/fragments.html)
- [Svelte](https://svelte.dev/tutorial/svelte-fragment)

By using fragments in your framework of choice, you can reduce DOM depth. If you're concerned about the impact flattening DOM structure has on styling, you might benefit from using more modern (and faster) layout modes such as [flexbox](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox) or [grid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout).

## Other strategies to consider

Even if you take pains to flatten your DOM tree and remove unnecessary HTML elements to keep your DOM as small as possible, it can still be quite large and kick off a lot of rendering work as it changes in response to user interactions. If you find yourself in this position, there are some other strategies you can consider to limit rendering work.

### Consider an additive approach

You might be in a position where large parts of your page aren't initially visible to the user when it first renders. This could be an opportunity to lazy load HTML by omitting those parts of the DOM on startup, but add them in when the user interacts with the parts of the page that require the initially hidden aspects of the page.

This approach is useful both during the initial load and perhaps even afterwards. For the initial page load, you're taking on less rendering work up front, meaning that your initial HTML payload will be lighter, and will render more quickly. This will give interactions during that crucial period more opportunities to run with less competition for the main thread's attention.

If you have many parts of the page that are initially hidden on load, it could also speed up other interactions that trigger re-rendering work. However, as other interactions add more to the DOM, rendering work will increase as the DOM grows throughout the page lifecycle.

Adding to the DOM over time can be tricky, and it has its own tradeoffs. If you're going this route, you're likely making network requests to get data to populate the HTML you intend to add to the page in response to a user interaction. While in-flight network requests are not counted towards INP, it can increase perceived latency. If possible, show a loading spinner or other indicator that data is being fetched so that users understand that something is happening.

### Limit CSS selector complexity

When the browser parses selectors in your CSS, it has to traverse the DOM tree to understand how—and if—those selectors apply to the current layout. The more complex these selectors are, the more work the browser has to do in order to perform both the initial rendering of the page, as well as increased style recalculations and layout work if the page changes as the result of an interaction.

{% Aside 'objective' %}
**Read to learn more:**&nbsp;[Reduce the scope and complexity of style calculations](/reduce-the-scope-and-complexity-of-style-calculations/).
{% endAside %}

### Use the `content-visibility` property

CSS offers the `content-visibility` property, which is effectively a way to lazily render off-screen DOM elements. As the elements approach the viewport, they're rendered on demand. The benefits of `content-visibility` don't just cut out a significant amount of rendering work on the initial page render, but also skip rendering work for offscreen elements when the page DOM is changed as the result of a user interaction.

{% Aside 'objective' %}
**Read to learn more:**&nbsp;[`content-visibility`: the new CSS property that boosts your rendering performance](/content-visibility/).
{% endAside %}

## Conclusion

Reducing your DOM size to only what is strictly necessary is a good way to optimize your website's INP. By doing so, you can reduce the amount of time it takes for the browser to perform layout and rendering work when the DOM is updated. Even if you can't meaningfully reduce DOM size, there are some techniques you can use to isolate rendering work to a DOM subtree, such as CSS containment and the `content-visibility` CSS property.

However you go about it, creating an environment where rendering work is minimized—as well as reducing the amount of rendering work your page does in response to interactions—the result will be that your website will feel more responsive to users when they interact with them. That means you'll have a lower INP for your website, and that translates to a better user experience.

_Hero image from [Unsplash](https://unsplash.com/), by [Louis Reed](https://unsplash.com/@_louisreed)._
