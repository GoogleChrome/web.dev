---
layout: post
title: Lazy load third-party resources with facades
description: |
  Learn about the opportunities to lazy load third-party resources with facades.
date: 2020-12-01
#updated: 2020-12-01
web_lighthouse:
  - third-party-facades
---


[Third-party resources](/third-party-javascript/) are often used for displaying ads or videos and integrating with social media. The default approach is to load third-party resources as soon as the page loads, but this can unnecessarily slow the page load. If the third-party content is not critical, this performance cost can be reduced by [lazy loading](/fast/#lazy-load-images-and-video) it.

This audit highlights third-party embeds which can be lazily loaded on interaction. In that case, a *facade* is used in place of the third-party content until the user interacts with it.

{% Aside 'key-term' %}

A *facade* is a static element which looks similar to the actual embedded third-party, but is not functional and therefore much less taxing on the page load.

{% endAside %}

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cvQ4fxFUG5MIXtUfi77Z.jpg", alt="An example of loading YouTube embedded player with a facade. The facade weighs 3 KB and the player weighing 540 KB is loaded on interaction.", width="800", height="521" %}
  <figcaption class="w-figcaption">
    Loading YouTube embedded player with a facade.
  </figcaption>
</figure>


## How Lighthouse detects deferrable third-party embeds

Lighthouse looks for third-party products which can be deferred, such as social button widgets or video embeds (for example, YouTube embedded player).

The data about deferrable products and available facades is [maintained in third-party-web](https://github.com/patrickhulce/third-party-web/).

The audit fails if the page loads resources belonging to one of these third-party embeds.


<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R0osncucBqYCIZfC85Hu.jpg", alt="Lighthouse third-party facade audit highlighting Vimeo embedded player and Drift live chat.", width="800", height="517", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Lighthouse third-party facade audit.
  </figcaption>
</figure>

## How to defer third-parties with a facade

Instead of adding a third-party embed directly to your HTML, load the page with a static element that looks similar to the actual embedded third-party. The interaction pattern should look something like this:

1. On load: Add facade to the page.

2. On mouseover: The facade preconnects to third-party resources.

3. On click: The facade replaces itself with the third-party product.

## Recommended facades

In general, video embeds, social button widgets, and chat widgets can all employ the facade pattern. The list below offers our recommendations of open-source facades. When choosing a facade, take into account the balance between the size and feature set. You can also use a lazy iframe loader such as [vb/lazyframe](https://github.com/vb/lazyframe).

### YouTube embedded player

* [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)

* [justinribeiro/lite-youtube](https://github.com/justinribeiro/lite-youtube)

* [Daugilas/lazyYT](https://github.com/Daugilas/lazyYT)

### Vimeo embedded player

* [luwes/lite-vimeo-embed](https://github.com/luwes/lite-vimeo-embed)

* [slightlyoff/lite-vimeo](https://github.com/slightlyoff/lite-vimeo)

### Live chat (Intercom, Drift, Help Scout, Facebook Messenger)

* [calibreapp/react-live-chat-loader](https://github.com/calibreapp/react-live-chat-loader) ([blog post](https://calibreapp.com/blog/fast-live-chat))

{% Aside 'caution' %}

There are some tradeoffs when lazily loading third-parties with facades as they do not have the full range of functionality of the actual embeds. For example, the Drift Live Chat bubble has a badge indicating the number of new messages. If the live chat bubble is deferred with a facade, the bubble appears when the actual chat widget is loaded in after the browser fires `requestIdleCallback`. For video embeds, autoplay may not work consistently if it's loaded lazily.

{% endAside %}

## Writing your own facade

You may choose to [build a custom facade solution](https://wildbit.com/blog/2020/09/30/getting-postmark-lighthouse-performance-score-to-100#:~:text=What%20if%20we%20could%20replace%20the%20real%20widget) which employs the interaction pattern outlined above. The facade should be significantly smaller in comparison to the deferred third-party product and only include enough code to mimic the appearance of the product.

If you would like your solution to be included in the list above, check out the [submissions process](https://github.com/patrickhulce/third-party-web/blob/master/facades.md).

## Resources

Source code for [Lazy load third-party resources with facades audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/third-party-facades.js).
