---
title: WebSocketStream—Integrating Streams with the WebSocket API
subhead: |
  Prevent your app from getting drowned in WebSocket messages
  or flooding a WebSocket server with messages by applying backpressure.
authors:
  - thomassteiner
date: 2020-03-24
update: 2020-03-24
hero: hero.jpg
alt: A fire hose with water dripping out of it.
description: |
  WebSocketStream integrates streams with the WebSocket API.
  This allows your app to apply backpressure to received messages.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - backpressure
  - websocket
  - websocketstream
  - capabilities
  - fugu
draft: true
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745
---
## Background

### The WebSocket API

The [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
provides a JavaScript interface to the [WebSocket protocol](https://tools.ietf.org/html/rfc6455),
which makes it possible to open a two-way interactive communication session
between the user's browser and a server.
With this API, you can send messages to a server and receive event-driven responses
without having to poll the server for a reply.

### The Streams API

The [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
allows JavaScript to programmatically access streams of data chunks received over the network
and process them as desired by the developer.
An important concept in the context of streams is
[backpressure](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts#Backpressure).
This is the process by which a single stream or a pipe chain
regulates the speed of reading or writing.
When a stream later in the chain is still busy and isn't yet ready to accept more chunks,
it sends a signal backwards through the chain to slow down delivery as appropriate.

### The Problem with the current WebSocket API

#### Applying backpressure to received messages is impossible

With the current WebSocket API, reacting to a message happens via the
[`WebSocket.onmessage`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/onmessage)
property, an `EventHandler` that is called when a message is received from the server.

Let's assume you had an application that needed to perform some heavy data crunching operations
whenever a new message is received.
You would probably set up the flow similar to the code in the example below,
and since you `await` the result of the `process()` call, you should be good, right?

```js
const process = async (data) => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      console.log('WebSocket message processed:', data);
      return resolve('done');
    }, 1000);
  });
};

webSocket.onmessage = async (event) => {
  const data = event.data;
  await process(data);
};
```

Wrong! The problem with the current WebSocket API is that there is no way to apply backpressure.
When messages arrive faster than the `process()` method can handle them,
the render process will either fill up memory by buffering those messages,
become unresponsive due to 100% CPU usage, or both.

#### Applying backpressure to sent messages is non-ergonomic

Applying backpressure to sent messages is possible, but involves polling the
[`WebSocket.bufferedAmount`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount)
property, which is inefficient and non-ergonomic.
This read-only property returns the number of bytes of data that have been queued
using calls to
[`WebSocket.send()`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send),
but not yet transmitted to the network.
This value resets to zero once all queued data has been sent, but if you keep calling `send()`,
it will continue to climb.

## What is the WebSocketStream API? {: #what }



### Suggested use cases for the WebSocketStream API {: #use-cases }

Examples of sites that may use this API include:
* TODO.
* TODO.
* TODO.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | [In progress][spec]          |
| 3. Gather feedback & iterate on design     | [In progress](#feedback)     |
| 4. Origin trial                            | [Complete][ot]               |
| 5. Launch                                  | Not started                  |

</div>

## How to use the WebSocketStream API {: #use }



### Progressive enhancement

Applying backpressure to received messages is not possible.
Applying backpressure to sent messages is possible, but involves polling the
[`WebSocket.bufferedAmount`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount)
property, which is inefficient and non-ergonomic.

### Feature detection
To check if the WebSocketStream API is supported, use:

```javascript
if ('WebSocketStream' in window) {
  // `WebSocketStream` is supported!
}
```

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the API_NAME API.

### Tell us about the API design
Is there something about the API that doesn't work like you expected?
Or are there missing methods or properties that you need to implement your idea?
Have a question or comment on the security model?
File a spec issue on the corresponding [GitHub repo][issues],
or add your thoughts to an existing issue.

### Report a problem with the implementation
Did you find a bug with Chrome's implementation?
Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com).
Be sure to include as much detail as you can, simple instructions for reproducing,
and enter `Blink>Network>WebSockets` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy reproduction cases.

### Show support for the API
Are you planning to use the WebSocketStream API?
Your public support helps the Chrome team to prioritize features
and shows other browser vendors how critical it is to support them.

Send a Tweet to [@ChromiumDev][cr-dev-twitter] with the `#WebSocketStream` hashtag
and let us know where and how you're using it.

## Helpful links {: #helpful }

* [Public explainer][explainer]
* [WebSocketStream API Demo][demo] | [WebSocketStream API Demo source][demo-source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: [`Blink>Network>WebSockets`][blink-component]

## Acknowledgements

Hero image by [Daan Mooij](https://unsplash.com/@daanmooij) on
[Unsplash](https://unsplash.com/photos/91LGCVN5SAI).

[spec]: https://github.com/ricea/websocketstream-explainer/blob/master/README.md
[issues]: https://github.com/ricea/websocketstream-explainer/issues
[demo]: https://websocketstream-demo.glitch.me/
[demo-source]: https://glitch.com/edit/#!/websocketstream-demo
[explainer]: https://github.com/ricea/websocketstream-explainer/blob/master/README.md
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=983030
[cr-status]: https://chromestatus.com/feature/5189728691290112
[blink-component]: https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3ENetwork%3EWebSockets
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[ot]: https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745
