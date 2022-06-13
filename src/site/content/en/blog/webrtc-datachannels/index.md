---
title: Send data between browsers with WebRTC data channels
authors:
  - samdutton
  - danristic
date: 2014-02-04
updated: 2020-11-24
tags:
  - blog
---

Sending data between two browsers for communication, gaming, or file transfer can be a rather involved process. It requires setting up and paying for a server to relay data, and perhaps scaling this to multiple data centers. In this scenario, there is potential for high latency and it's difficult to keep data private.

These problems can be alleviated by using WebRTC's `RTCDataChannel` API to transfer data directly from one peer to another. This article covers the basics of how to set up and use data channels, as well as the common use cases on the web today.

{% Aside %}
To make the most of this article, you need some knowledge of the `RTCPeerConnection` API, and an understanding of how STUN, TURN, and signaling work. For more information, see [Getting Started With WebRTC](https://www.html5rocks.com/tutorials/webrtc/basics/).
{% endAside %}

## Why another data channel?

We have [WebSocket](https://www.html5rocks.com/tutorials/websockets/basics/), [AJAX](https://www.html5rocks.com/tutorials/file/xhr2/) and [Server Sent Events](https://www.html5rocks.com/tutorials/eventsource/basics/). Why do we need another communication channel? WebSocket is bidirectional, but all these technologies are designed for communication to or from a server.

`RTCDataChannel` takes a different approach:

- It works with the `RTCPeerConnection` API, which enables peer-to-peer connectivity. This can result in lower latency - no intermediary server and fewer 'hops'.
- `RTCDataChannel` uses [Stream Control Transmission Protocol](https://en.wikipedia.org/wiki/Stream_Control_Transmission_Protocol#Features) (SCTP), allowing configurable delivery semantics-out-of-order delivery and retransmit configuration.

`RTCDataChannel` is available now with SCTP support on desktop and Android in Google Chrome, Opera, and Firefox.

## A caveat: Signaling, STUN, and TURN

WebRTC enables peer-to-peer communication, but it still needs servers for **signaling** to exchange media and network metadata to bootstrap a peer connection. 

WebRTC copes with NATs and firewalls with: 

- [The ICE framework](https://www.html5rocks.com/tutorials/webrtc/basics/#ice) to establish the best possible network path between peers.
- [STUN servers](https://www.html5rocks.com/tutorials/webrtc/basics/#stun) to ascertain a publicly accessible IP and port for each peer.
- [TURN servers](https://webrtc.org/getting-started/turn-server) if direct connection fails and data relaying is required.

For more information about how WebRTC works with servers for signaling and networking, see [WebRTC inthe real world: STUN, TURN, and signaling](https://www.html5rocks.com/tutorials/webrtc/infrastructure/).

## The capabilities

The `RTCDataChannel` API supports a flexible set of data types. The API is designed to mimic WebSocket exactly, and `RTCDataChannel` supports [strings](https://www.w3.org/TR/webrtc/#widl-RTCDataChannel-send-void-DOMString-data) as well as some of the binary types in JavaScript, such as [Blob](https://www.w3.org/TR/webrtc/#widl-RTCDataChannel-send-void-Blob-data), [ArrayBuffer](https://www.w3.org/TR/webrtc/#widl-RTCDataChannel-send-void-ArrayBuffer-data), and [ArrayBufferView](https://www.w3.org/TR/webrtc/#widl-RTCDataChannel-send-void-ArrayBufferView-data). These types can be helpful when working with file transfer and multiplayer gaming.

`RTCDataChannel` can work in unreliable and unordered mode (analogous to User Datagram Protocol or UDP), reliable and ordered mode (analogous to Transmission Control Protocol or TCP), and partial reliable modes:

- __Reliable and ordered mode guarantees the transmission of messages and also the order in which they are delivered__. This takes extra overhead, thus potentially making this mode slower. 
- __Unreliable and unordered mode does not guarantee every message gets to the other side nor what order they get there in__. This removes the overhead, allowing this mode to work much faster.
- __Partial reliable mode guarantees the transmission of message under a specific condition, such as a retransmit timeout or a maximum amount of retransmissions__. The ordering of messages is also configurable.

Performance for the first two modes is about the same when there are no packet losses. However, in reliable and ordered mode, a lost packet causes other packets to get blocked behind it, and the lost packet might be stale by the time that it is retransmitted and arrives. It is, of course, possible to use multiple data channels within the same app, each with their own reliable or unreliable semantics.

Here's a helpful table from [High Performance Browser Networking](https://www.oreilly.com/library/view/high-performance-browser/9781449344757/) by [Ilya Grigorik](https://www.igvita.com/):

<table>
    <thead>
        <th>
            <td>TCP</td><td>UDP</td><td>SCTP</td>
        </th>
    </thead>
    <tbody>
        <tr>
            <td>Reliability</td><td>Reliable</td><td>Unreliable</td><td>Configurable</td>
        </tr>
        <tr>
            <td>Delivery</td><td>Ordered</td><td>Unordered</td><td>Configurable</td>
        </tr>
        <tr>
            <td>Transmission</td><td>Byte-oriented</td><td>Message-oriented</td><td>Message-oriented</td>
        </tr>
        <tr>
            <td>Flow control</td><td>Yes</td><td>No</td><td>Yes</td>
        </tr>
        <tr>
            <td>Congestion control</td><td>Yes</td><td>No</td><td>Yes</td>
        </tr>
    <tbody>
</table>

Next, you learn how to configure `RTCDataChannel` to use reliable and ordered or unreliable and unordered mode.

## Configuring data channels

There are several simple demos of `RTCDataChannel` online:

- [simpl.info `RTCDataChannel`](https://simpl.info/dc)
- [WebRTC samples Transmit text](https://webrtc.github.io/samples/src/content/datachannel/basic/)
- [WebRTC samples Transfer a file](https://webrtc.github.io/samples/src/content/datachannel/filetransfer/)

In these examples, the browser makes a peer connection to itself, then creates a data channel and sends a message through the peer connection. It is then creating a data channel and sending the message along the peer connection. Finally, your message appears in the box on the other side of the page!

The code to get started with this is short:

```js
const peerConnection = new RTCPeerConnection();

// Establish your peer connection using your signaling channel here
const dataChannel =
  peerConnection.createDataChannel("myLabel", dataChannelOptions);

dataChannel.onerror = (error) => {
  console.log("Data Channel Error:", error);
};

dataChannel.onmessage = (event) => {
  console.log("Got Data Channel Message:", event.data);
};

dataChannel.onopen = () => {
  dataChannel.send("Hello World!");
};

dataChannel.onclose = () => {
  console.log("The Data Channel is Closed");
};
```

The `dataChannel` object is created from an already-established peer connection. It can be created before or after signaling happens. You then pass in a label to distinguish this channel from others and a set of optional configuration settings:

```js
const dataChannelOptions = {
  ordered: false, // do not guarantee order
  maxPacketLifeTime: 3000, // in milliseconds
};
```

It is also possible to add a `maxRetransmits` option (the number of times to try before failing), but you can only specify maxRetransmits or maxPacketLifeTime, not both. For UDP semantics, set `maxRetransmits` to `0` and `ordered` to `false`. For more information, see these IETF RFCs: [Stream Control Transmission Protocol](https://tools.ietf.org/html/rfc4960) and [Stream Control Transmission Protocol Partial Reliability Extension](https://tools.ietf.org/html/rfc3758).

- `ordered`: if the data channel should guarantee order or not
- `maxPacketLifeTime`: the maximum time to try and retransmit a failed message
- `maxRetransmits`: the maximum number of times to try and retransmit a failed message
- `protocol`: allows a subprotocol to be used, which provides meta information toward the app
- `negotiated`: if set to true, removes the automatic setting up of a data channel on the other peer, providing your own way to create a data channel with the same ID on the other side
- `id`: allows you to provide your own ID for the channel that can only be used in combination with `negotiated` set to `true`)

The only options that most people need to use are the first three: `ordered`, `maxPacketLifeTime`, and `maxRetransmits`. With [SCTP](https://en.wikipedia.org/wiki/Stream_Control_Transmission_Protocol) (now used by all browsers that support WebRTC) reliable and ordered is true by default. It makes sense to use unreliable and unordered if you want full control from the app layer, but in most cases, partial reliability is helpful.

Note that, as with WebSocket, `RTCDataChannel` fires events when a connection is established, closed, or errors, and when it receives a message from the other peer.

## Is it safe?

Encryption is mandatory for all WebRTC components. With `RTCDataChannel`, all data is secured with [Datagram Transport Layer Security](https://en.wikipedia.org/wiki/Datagram_Transport_Layer_Security) (DTLS). DTLS is a derivative of SSL, meaning your data will be as secure as using any standard SSL-based connection. DTLS is standardized and built into all browsers that support WebRTC. For more information, see [Wireshark wiki](https://wiki.wireshark.org/DTLS).

## Change how you think about data

Handling large amounts of data can be a pain point in JavaScript. As the developers of [Sharefest](https://github.com/Peer5/ShareFest) pointed out, this required thinking about data in a new way. If you are transferring a file that is larger than the amount of memory you have available, you have to think about new ways to save this information. This is where technologies, such as the [FileSystem API](https://www.html5rocks.com/tutorials/file/filesystem/), come into play, as you see next.

## Build a file-sharing app

Creating a web app that can share files in the browser is now possible with `RTCDataChannel`. Building on top of `RTCDataChannel` means that the transferred file data is encrypted and does not touch an app provider's servers. This functionality, combined with the possibility of connecting to multiple clients for faster sharing, makes WebRTC file sharing a strong candidate for the web.

Several steps are required to make a successful transfer:

1. Read a file in JavaScript using the [File API](https://www.html5rocks.com/tutorials/file/dndfiles/).
1. Make a peer connection between clients with `RTCPeerConnection`.
1. Create a data channel between clients with `RTCDataChannel`.

There are several points to consider when trying to send files over `RTCDataChannel`:

- **File size:** if file size is reasonably small and can be stored and loaded as one Blob, you can load into memory using the File API and then send the file over a reliable channel as is (though bear in mind that browsers impose limits on maximum transfer size). As file size gets larger, things get trickier. When a chunking mechanism is required, file chunks are loaded and sent to another peer, accompanied with `chunkID` metadata so the peer can recognize them. Note that, in this case, you also need to save the chunks first to offline storage (for example, using the FileSystem API) and save it to the user's disk only when you have the file in its entirety.
- **Chunk size:** these are the smallest "atoms" of data for your app. Chunking is required because there is currently a send size limit (though this will be fixed in a future version of data channels). The current recommendation for maximum chunk size is 64KiB.

Once the file is fully transferred to the other side, it can be downloaded using an anchor tag:

```js
function saveFile(blob) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'File Name';
  link.click();
};
```

These file-sharing apps on [PubShare](https://pubnub.github.io/rtc-pubnub-fileshare/) and [GitHub](https://github.com/Peer5/ShareFest) use this technique. They are both open source and provide a good foundation for a file-sharing app based on `RTCDataChannel`.

## So what can you do?

`RTCDataChannel` opens the doors to new ways to build apps for file sharing, multiplayer gaming, and content delivery.

- Peer-to-peer file sharing as previously described
- Multiplayer gaming, paired with other technologies, such as WebGL, as seen in Mozilla's [BananaBread](https://hacks.mozilla.org/2013/03/webrtc-data-channels-for-great-multiplayer/)
- Content delivery as being reinvented by [PeerCDN](https://techcrunch.com/2013/12/17/yahoo-acquires-peercdn/), a framework that delivers web assets through peer-to-peer data communication

## Change the way you build apps

You can now provide more-engaging apps by using high-performance, low-latency connections through `RTCDataChannel`. Frameworks, such as [PeerJS](https://peerjs.com/) and the [PubNub WebRTC SDK](https://github.com/pubnub/webrtc), make `RTCDataChannel` easier to implement and the API now has wide support across platforms.

The advent of `RTCDataChannel` can change the way that you think about data transfer in the browser.

## Find out more

- [Getting started with WebRTC](https://www.html5rocks.com/tutorials/webrtc/basics/)
- [WebRTC in the real world: STUN, TURN, and signaling](https://www.html5rocks.com/tutorials/webrtc/infrastructure/)
- [WebRTC and Web Audio resources](https://bit.ly/webrtcwebaudio)
- [Peer-to-peer Data API](https://www.w3.org/TR/webrtc/#peer-to-peer-data-api)
- [IETF WebRTC DCP Draft](https://tools.ietf.org/html/draft-jesup-rtcweb-data-protocol-04)
- [How to send a File Using WebRTC Data API](https://bloggeek.me/send-file-webrtc-data-api/)
- [7 Creative Uses of WebRTC’s Data Channel](https://bloggeek.me/webrtc-data-channel-uses/)
- [BananaBread](https://developer.mozilla.org/demos/detail/bananabread)
