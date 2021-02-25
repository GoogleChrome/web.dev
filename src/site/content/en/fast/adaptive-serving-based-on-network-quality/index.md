---
layout: post
title: Adaptive serving based on network quality
date: 2019-05-06
authors:
  - mihajlija
description: |
  Use Network Information API to adapt the assets served to users based on the
  quality of their connection.
codelabs:
  - codelab-adapt-video-to-image-serving-based-on-network-quality
tags:
  - performance
---

Loading a website can be a very different experience depending on the network
conditions. Everything is usually smooth when you are on a fast network, but
when you're on the go with a limited data plan and spotty connection, or stuck
with a laptop on slow coffee-shop Wi-Fi, it's a different story.

One way to deal with this is by adapting which assets you're serving to users
based on the quality of their connection. This is now possible with the
[Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
which enables web applications to access information about the user's network.

{% Aside %}
  You can see which browsers support [the Network Information API on caniuse.com](https://caniuse.com/#feat=netinfo).
{% endAside %}

## Usage

There are many ways you can use this network information to improve the user
experience:

* Switch between serving high-definition and low-definition content based on the
  user's network.
* Decide whether to preload resources.
* Defer uploads and downloads when users are on a slow connection.
* Enable offline mode if the network quality is not good enough to load the app
  and use the features.
* Warn users that doing something (for example, watching video) over cellular could cost
  them money.
* Use it in your analytics to gather data on your users' network quality.

Many applications are already doing something similar. For example, YouTube,
Netflix and most other video (or video calling) services automatically adjust
the resolution during streaming. When Gmail is loading, it provides users with a
link to "load basic HTML (for slow connections)".

<figure class="w-figure">
  {% Img src="image/admin/zSTd1IMrb3UJfefdeRAt.png", alt="A link to load basic HTML version of Gmail when users are on slow connections", width="528", height="236", class="w-screenshot" %}
</figure>

## How it works

The `navigator.connection` object contains information about a client's
connection. Its properties are explained in the table bellow.

<div class="w-table-wrapper">
  <table>
    <tr>
      <th>Property</th>
      <th>Explanation</th>
    </tr>
    <tr>
      <td><code>downlink</code></td>
      <td>The bandwidth estimate in megabits per second.</td>
    </tr>
    <tr>
      <td><code>effectiveType</code></td>
      <td>The effective type of the connection, with possible values <code>'slow-2g'</code>, <code>'2g'</code>, <code>'3g'</code>, or <code>'4g'</code> (covers 4g and higher). Determined based on the combination of <a href="https://wicg.github.io/netinfo/#effective-connection-types">round-trip time and downlink speed</a>. For example, fast downlink combined with high latency will have lower effectiveType due to latency.</td>
    </tr>
    <tr>
      <td><code>onchange</code></td>
      <td>An event handler that fires when connection information changes.</td>
    </tr>
    <tr>
      <td><code>rtt</code></td>
      <td>The estimated round-trip latency of the connection in milliseconds.</td>
    </tr>
    <tr>
      <td><code>saveData</code></td>
      <td>A boolean that defines whether the user has requested a reduced data usage mode.</td>
    </tr>
  </table>
</div>

Here's what this looks like when you run it in the browser's console:

{% Img src="image/admin/ayW8uxhh3S6I4MTipr0m.jpg", alt="Chrome DevTools console displaying the values of navigator.connection object's properties", width="800", height="523", class="w-screenshot" %}

The `effectiveType` values are also available via
[Client Hints](https://www.chromestatus.com/feature/5407907378102272)
and allow you to communicate the browser's connection type to servers.

{% Aside %}
You can access Network Information API inside
[Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker)
to adapt to situations when users are offline.
{% endAside %}

The `onchange` event listener enables you to dynamically adapt to changes in
network quality. If you deferred uploads or downloads because of poor network
conditions, you can rely on the event listener to restart the transfer when it
detects better network conditions. You can also use it to notify users when the
network quality changes. For example, if they lost their Wi-Fi signal and were
dropped to a cellular network this can prevent accidental data transfers (and
charges 💸).

Use the `onchange` event listener as you would any other event listener:

```js
navigator.connection.addEventListener('change', doSomethingOnChange);
```

{% Aside %}
Network information API is
[supported in Chromium-based browsers](https://caniuse.com/#feat=netinfo)
since version 62.
{% endAside %}

## Conclusion

The potential benefits of the Network Information API are big, especially for
users on slow networks and applications that require a lot of bandwidth. Best of
all, it can be used as a progressive enhancement technique.
