---
title: Build the backend services needed for a WebRTC app
authors:
  - samdutton
date: 2013-11-04
updated: 2020-11-24
tags:
  - blog
---

{% Aside %}

WebRTC enables peer-to-peer communication, but it still needs servers so that clients can exchange metadata to coordinate communication through a process called signaling, and to cope with network address translators (NATs) and firewalls.

This article shows you how to build a signaling service, and how to deal with the quirks of real-world connectivity with STUN and TURN servers. It also explains how WebRTC apps can handle multiparty calls and interact with services, such as VoIP and PSTN (also known as telephones).

If you're not familiar with the basics of WebRTC, see [Get started with WebRTC](https://www.html5rocks.com/tutorials/webrtc/basics) before you read this article.

{% endAside %}

## What is signaling?

Signaling is the process of coordinating communication. In order for a WebRTC app to set up a call, its clients need to exchange the following information:

- Session-control messages used to open or close communication
- Error messages
- Media metadata, such as codecs, codec settings, bandwidth, and media types
- Key data used to establish secure connections
- Network data, such as a host's IP address and port as seen by the outside world

This signaling process needs a way for clients to pass messages back and forth. That mechanism is not implemented by the WebRTC APIs. You need to build it yourself. Later in this article, you learn ways to build a signaling service. First, however, you need a little context.

### Why is signaling not defined by WebRTC?

To avoid redundancy and to maximize compatibility with established technologies, signaling methods and protocols are not specified by WebRTC standards. This approach is outlined by the [JavaScript Session Establishment Protocol (JSEP)](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-03#section-1.1):

{% Aside %}
The thinking behind WebRTC call setup has been to fully specify and control the media plane, but to leave the signaling plane up to the app as much as possible. The rationale is that different apps may prefer to use different protocols, such as the existing SIP or Jingle call signaling protocols, or something custom to the particular app, perhaps for a novel use case. In this approach, the key information that needs to be exchanged is the multimedia session description, which specifies the necessary transport and media configuration information necessary to establish the media plane.
{% endAside %}

JSEP's architecture also avoids a browser having to save state, that is, to function as a signaling state machine. This would be problematic if, for example, signaling data was lost each time a page was reloaded. Instead, signaling state can be saved on a server.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/EzU1PV2xaYrKCARCFIW9.png", alt="JSEP architecture diagram", width="800", height="499" %}
  <figcaption>JSEP architecture</figcaption>
</figure>

JSEP requires the exchange between peers of __offer__ and __answer__, the media metadata mentioned above. Offers and answers are communicated in Session Description Protocol (SDP) format, which look like this:

```http
v=0
o=- 7614219274584779017 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio video
a=msid-semantic: WMS
m=audio 1 RTP/SAVPF 111 103 104 0 8 107 106 105 13 126
c=IN IP4 0.0.0.0
a=rtcp:1 IN IP4 0.0.0.0
a=ice-ufrag:W2TGCZw2NZHuwlnf
a=ice-pwd:xdQEccP40E+P0L5qTyzDgfmW
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=mid:audio
a=rtcp-mux
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:9c1AHz27dZ9xPI91YNfSlI67/EMkjHHIHORiClQe
a=rtpmap:111 opus/48000/2
…
```

Want to know what all this SDP gobbledygook actually means? Take a look at the [Internet Engineering Task Force (IETF) examples](https://datatracker.ietf.org/doc/draft-nandakumar-rtcweb-sdp/?include_text=1).

Bear in mind that WebRTC is designed so that the offer or answer can be tweaked before being set as the local or remote description by editing the values in the SDP text. For example, the `preferAudioCodec()` function in [appr.tc](https://appr.tc) can be used to set the default codec and bitrate. SDP is somewhat painful to manipulate with JavaScript and there is discussion about whether future versions of WebRTC should use JSON instead, but there are [some advantages](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-03#section-3.3) to sticking with SDP.

### `RTCPeerConnection` API and signaling: Offer, answer, and candidate

`RTCPeerConnection` is the API used by WebRTC apps to create a connection between peers, and communicate audio and video.

To initialize this process, `RTCPeerConnection` has two tasks:

- Ascertain local media conditions, such as resolution and codec capabilities. This is the metadata used for the offer-and-answer mechanism.
- Get potential network addresses for the app's host, known as _candidates_.

Once this local data has been ascertained, it must be exchanged through a signaling mechanism with the remote peer.

Imagine [Alice is trying to call Eve](https://xkcd.com/177/). Here's the full offer/answer mechanism in all its gory detail:

1. Alice creates an `RTCPeerConnection` object.
1. Alice creates an offer (an SDP session description) with the `RTCPeerConnection` `createOffer()` method.
1. Alice calls `setLocalDescription()` with her offer.
1. Alice stringifies the offer and uses a signaling mechanism to send it to Eve.
1. Eve calls `setRemoteDescription()` with Alice's offer, so that her `RTCPeerConnection` knows about Alice's setup.
1. Eve calls `createAnswer()` and the success callback for this is passed a local session description - Eve's answer.
1. Eve sets her answer as the local description by calling `setLocalDescription()`.
1. Eve then uses the signaling mechanism to send her stringified answer to Alice.
1. Alice sets Eve's answer as the remote session description using `setRemoteDescription()`.

{% Aside %}
[Strewth!](https://www.urbandictionary.com/define.php?term=strewth)
{% endAside %}

Alice and Eve also need to exchange network information. The expression "finding candidates" refers to the process of finding network interfaces and ports using the [ICE framework](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment).

1. Alice creates an `RTCPeerConnection` object with an `onicecandidate` handler.
1. The handler is called when network candidates become available.
1. In the handler, Alice sends stringified candidate data to Eve through their signaling channel.
1. When Eve gets a candidate message from Alice, she calls `addIceCandidate()` to add the candidate to the remote peer description.

JSEP supports [ICE Candidate Trickling](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-03#section-3.4.1), which allows the caller to incrementally provide candidates to the callee after the initial offer, and for the callee to begin acting on the call and set up a connection without waiting for all candidates to arrive.

### Code WebRTC for signaling

The following code snippet is a [W3C code example](https://w3c.github.io/webrtc-pc/#simple-peer-to-peer-example) that summarizes the complete signaling process. The code assumes the existence of some signaling mechanism, `SignalingChannel`. Signaling is discussed in greater detail later.

```js
// handles JSON.stringify/parse
const signaling = new SignalingChannel();
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.example.org'}]};
const pc = new RTCPeerConnection(configuration);

// Send any ice candidates to the other peer.
pc.onicecandidate = ({candidate}) => signaling.send({candidate});

// Let the "negotiationneeded" event trigger offer generation.
pc.onnegotiationneeded = async () => {
  try {
    await pc.setLocalDescription(await pc.createOffer());
    // send the offer to the other peer
    signaling.send({desc: pc.localDescription});
  } catch (err) {
    console.error(err);
  }
};

// After remote track media arrives, show it in remote video element.
pc.ontrack = (event) => {
  // Don't set srcObject again if it is already set.
  if (remoteView.srcObject) return;
  remoteView.srcObject = event.streams[0];
};

// Call start() to initiate.
async function start() {
  try {
    // Get local stream, show it in self-view, and add it to be sent.
    const stream =
      await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((track) =>
      pc.addTrack(track, stream));
    selfView.srcObject = stream;
  } catch (err) {
    console.error(err);
  }
}

signaling.onmessage = async ({desc, candidate}) => {
  try {
    if (desc) {
      // If you get an offer, you need to reply with an answer.
      if (desc.type === 'offer') {
        await pc.setRemoteDescription(desc);
        const stream =
          await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) =>
          pc.addTrack(track, stream));
        await pc.setLocalDescription(await pc.createAnswer());
        signaling.send({desc: pc.localDescription});
      } else if (desc.type === 'answer') {
        await pc.setRemoteDescription(desc);
      } else {
        console.log('Unsupported SDP type.');
      }
    } else if (candidate) {
      await pc.addIceCandidate(candidate);
    }
  } catch (err) {
    console.error(err);
  }
};
```

To see the offer/answer and candidate-exchange processes in action, see [simpl.info RTCPeerConnection](https://simpl.info/rtcpeerconnection/) and look at the console log for a single-page video chat example. If you want more, download a complete dump of WebRTC signaling and stats from the about://webrtc-internals page in Google Chrome or the opera://webrtc-internals page in Opera.

### Peer discovery

This is a fancy way of asking, "How do I find someone to talk to?"

For telephone calls, you have telephone numbers and directories. For online video chat and messaging, you need identity and presence management systems, and a means for users to initiate sessions. WebRTC apps need a way for clients to signal to each other that they want to start or join a call.

Peer discovery mechanisms are not defined by WebRTC and you don't go into the options here. The process can be as simple as emailing or messaging a URL. For video chat apps, such as [Talky](https://talky.io), [tawk.to](https://tawk.com) and [Browser Meeting](https://browsermeeting.com), you invite people to a call by sharing a custom link. Developer Chris Ball built an intriguing [serverless-webrtc](https://blog.printf.net/articles/2013/05/17/webrtc-without-a-signaling-server/) experiment that enables WebRTC call participants to exchange metadata by any messaging service they like, such as IM, email, or homing pigeon.

## How can you build a signaling service?

To reiterate, signaling protocols and mechanisms are not defined by WebRTC standards. Whatever you choose, you need an intermediary server to exchange signaling messages and app data between clients. Sadly, a web app cannot simply shout into the internet, "Connect me to my friend!"

Thankfully signaling messages are small and mostly exchanged at the start of a call. In testing with [appr.tc](https://appr.tc) for a video chat session, a total of around 30-45 messages were handled by the signaling service with a total size for all messages of around 10KB.

As well as being relatively undemanding in terms of bandwidth, WebRTC signaling services don't consume much processing or memory because they only need to relay messages and retain a small amount of session state data, such as which clients are connected.

{% Aside %}
The signaling mechanism used to exchange session metadata can also be used to communicate app data. It's just a messaging service!
{% endAside %}

### Push messages from the server to the client

A message service for signaling needs to be bidirectional: client to server and server to client. Bidirectional communication goes against the HTTP client/server request/response model, but various hacks such as [long polling](https://en.wikipedia.org/wiki/Comet_(programming)) have been developed over many years in order to push data from a service running on a web server to a web app running in a browser.

More recently, the [`EventSource` API](https://www.html5rocks.com/tutorials/eventsource/basics/) has been [widely implemented](https://caniuse.com/?search=eventsource). This enables server-sent events - data sent from a web server to a browser client through HTTP. `EventSource` is designed for one-way messaging, but it can be used in combination with XHR to build a service for exchanging signaling messages. A signaling service passes a message from a caller, delivered by XHR request, by pushing it through `EventSource` to the callee.

[WebSocket](https://www.html5rocks.com/tutorials/websockets/basics/) is a more-natural solution, designed for full duplex client–server communication - messages that can flow in both directions at the same time. One advantage of a signaling service built with pure WebSocket or server-sent events (`EventSource`) is that the backend for these APIs can be implemented on a variety of web frameworks common to most web-hosting packages for languages such as PHP, Python, and Ruby.

All modern browsers except Opera Mini [support WebSocket](https://caniuse.com/#search=websocket) and, more importantly, all browsers that support WebRTC also support WebSocket, both on desktop and mobile. [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) should be used for all connections to ensure messages cannot be intercepted unencrypted and also to  [reduce problems with proxy traversal](https://www.infoq.com/articles/Web-Sockets-Proxy-Servers). (For more information about WebSocket and proxy traversal see the [WebRTC chapter](https://hpbn.co/webrtc) in Ilya Grigorik's __High Performance Browser Networking__.)

It is also possible to handle signaling by getting WebRTC clients to poll a messaging server repeatedly through Ajax, but that leads to a lot of redundant network requests, which is especially problematic for mobile devices. Even after a session has been established, peers need to poll for signaling messages in case of changes or session termination by other peers. The [WebRTC Book](https://webrtcbook.com) app example takes this option with some optimizations for polling frequency.

### Scale signaling

Although a signaling service consumes relatively little bandwidth and CPU per client, signaling servers for a popular app may have to handle a lot of messages from different locations with high levels of concurrency. WebRTC apps that get a lot of traffic need signaling servers able to handle considerable load.
You don't go into detail here, but there are a number of options for high-volume, high-performance messaging, including the following:

- [eXtensible Messaging and Presence Protocol](https://en.wikipedia.org/wiki/Xmpp) (XMPP), originally known as Jabber-a protocol developed for instant messaging that can be used for signaling (Server implementations include [ejabberd](https://en.wikipedia.org/wiki/Ejabberd) and [Openfire](https://en.wikipedia.org/wiki/Openfire). JavaScript clients, such as [Strophe.js](https://strophe.im/strophejs/), use [BOSH](https://en.wikipedia.org/wiki/BOSH) to emulate bidirectional streaming, but for [various reasons](https://stackoverflow.com/questions/7327153/xmpp-bosh-vs-comet), BOSH may not be as efficient as WebSocket and, for the same reasons, may not scale well.) (On a tangent, [Jingle](https://en.wikipedia.org/wiki/Jingle_(protocol)) is an XMPP extension to enable voice and video. The WebRTC project uses network and transport components from the [libjingle](https://developers.google.com/talk/libjingle/developer_guide) library - a C++ implementation of Jingle.)

- Open source libraries, such as [ZeroMQ](https://zeromq.org/) (as used by TokBox for their [Rumour](https://www.tokbox.com/blog/tokbox-builds-it%E2%80%99s-own-internal-messaging-infrastructure/) service) and [OpenMQ](https://en.wikipedia.org/wiki/Open_Message_Queue) ([NullMQ](https://avalanche123.com/blog/2012/02/25/interacting-with-zeromq-from-the-browser/) applies ZeroMQ concepts to web platforms using the [STOMP protocol](https://stomp.github.io/) over WebSocket.)

- Commercial cloud-messaging platforms that use WebSocket (though they may fall back to long polling), such as [Pusher](https://pusher.com/), [Kaazing](https://kaazing.com/), and [PubNub](https://pubnub.com) (PubNub also has an [API for WebRTC](https://github.com/pubnub/webrtc).)

- Commercial WebRTC platforms, such as [vLine](https://vline.com/)

(Developer Phil Leggetter's [Real-Time Web Technologies Guide](https://www.leggetter.co.uk/real-time-web-technologies-guide) provides a comprehensive list of messaging services and libraries.)

### Build a signaling service with Socket.io on Node

The following is code for a simple web app that uses a signaling service built with [Socket.io](https://socket.io) on [Node](https://nodejs.org/). The design of Socket.io makes it simple to build a service to exchange messages and Socket.io is particularly suited to WebRTC signaling because of its built-in concept of rooms. This example is not designed to scale as a production-grade signaling service, but is simple to understand for a relatively small number of users.

Socket.io uses WebSocket with fallbacks: AJAX long polling, AJAX multipart streaming, Forever Iframe, and JSONP polling. It has been ported to various backends, but is perhaps best known for its Node version used in this example. 

There's no WebRTC in this example. It's designed only to show how to build signaling into a web app. View the console log to see what's happening as clients join a room and exchange messages. This [WebRTC codelab](https://codelabs.developers.google.com/codelabs/webrtc-web/#0) gives step-by-step instructions for how to integrate this into a complete WebRTC video chat app.

Here is the client `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>WebRTC client</title>
  </head>
  <body>
    <script src='/socket.io/socket.io.js'></script>
    <script src='js/main.js'></script>
  </body>
</html>
```

Here's the JavaScript file `main.js` referenced in the client:

```js
const isInitiator;

room = prompt('Enter room name:');

const socket = io.connect();

if (room !== '') {
  console.log('Joining room ' + room);
  socket.emit('create or join', room);
}

socket.on('full', (room) => {
  console.log('Room ' + room + ' is full');
});

socket.on('empty', (room) => {
  isInitiator = true;
  console.log('Room ' + room + ' is empty');
});

socket.on('join', (room) => {
  console.log('Making request to join room ' + room);
  console.log('You are the initiator!');
});

socket.on('log', (array) => {
  console.log.apply(console, array);
});
```

Here's the complete server app:

```js
const static = require('node-static');
const http = require('http');
const file = new(static.Server)();
const app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2013);

const io = require('socket.io').listen(app);

io.sockets.on('connection', (socket) => {

  // Convenience function to log server messages to the client
  function log(){
    const array = ['>>> Message from server: '];
    for (const i = 0; i < arguments.length; i++) {
      array.push(arguments[i]);
    }
      socket.emit('log', array);
  }

  socket.on('message', (message) => {
    log('Got message:', message);
    // For a real app, would be room only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', (room) => {
    const numClients = io.sockets.clients(room).length;

    log('Room ' + room + ' has ' + numClients + ' client(s)');
    log('Request to create or join room ' + room);

    if (numClients === 0){
      socket.join(room);
      socket.emit('created', room);
    } else if (numClients === 1) {
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room);
    } else { // max two clients
      socket.emit('full', room);
    }
    socket.emit('emit(): client ' + socket.id +
      ' joined room ' + room);
    socket.broadcast.emit('broadcast(): client ' + socket.id +
      ' joined room ' + room);

  });

});
```

(You don't need to learn about node-static for this. It just happens to be used in this example.)

To run this app on localhost, you need to have Node, Socket.IO, and [node-static](https://github.com/cloudhead/node-static) installed. Node can be downloaded from [Node.js](https://nodejs.org/) (installation is straightforward and quick). To install Socket.IO and node-static, run Node Package Manager from a terminal in your app directory:

```shell
npm install socket.io
npm install node-static
```

To start the server, run the following command from a terminal in your app directory:

```shell
node server.js
```

From your browser, open `localhost:2013`. Open a new tab or window in any browser and open `localhost:2013` again. To see what's happening, check the console. In Chrome and Opera, you can access the console through Google Chrome Developer Tools with `Ctrl+Shift+J` (or `Command+Option+J` on Mac).

Whatever approach you choose for signaling, your backend and client app - at the very least - need to provide services similar to this example.

### Signaling gotchas

- `RTCPeerConnection` won't start gathering candidates until `setLocalDescription()` is called. This is mandated in the [JSEP IETF draft](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-03#section-4.2.4).
- Take advantage of Trickle ICE. Call `addIceCandidate()` as soon as candidates arrive.

### Readymade signaling servers

If you don't want to roll your own, there are several WebRTC signaling servers available, which use Socket.IO like the previous example and are integrated with WebRTC client JavaScript libraries:

- [webRTC.io](https://github.com/webRTC/webRTC.io) is one of the first abstraction libraries for WebRTC.
- [Signalmaster](https://github.com/andyet/signalmaster) is a signaling server created for use with the [SimpleWebRTC](https://github.com/HenrikJoreteg/SimpleWebRTC) JavaScript client library.

If you don't want to write any code at all, complete commercial WebRTC platforms are available from companies, such as [vLine](https://www.vline.com/), [OpenTok](https://tokbox.com/opentok), and [Asterisk](https://wiki.asterisk.org/wiki/display/AST/Asterisk+WebRTC+Support).

For the record, Ericsson built a [signaling server using PHP on Apache](https://labs.ericsson.com/blog/a-web-rtc-tutorial) in the early days of WebRTC. This is now somewhat obsolete, but it's worth looking at the code if you're considering something similar.

### Signaling security

{% Blockquote 'Salman Rushdie' %}
"Security is the art of making nothing happen."
{% endBlockquote %}

Encryption is [mandatory](https://www.ietf.org/proceedings/82/slides/rtcweb-13.pdf) for all WebRTC components.

However, signaling mechanisms aren't defined by WebRTC standards, so it's up to you to make signaling secure. If an attacker manages to hijack signaling, they can stop sessions, redirect connections, and record, alter, or inject content.

The most important factor in securing signaling is to use secure protocols - HTTPS and WSS (for example, TLS) - which ensure that messages cannot be intercepted unencrypted. Also, be careful not to broadcast signaling messages in a way that they can be accessed by other callers using the same signaling server.

{% Aside %}
To secure a WebRTC app, it is absolutely imperative that signaling uses [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security).
{% endAside %}

## After signaling: Use ICE to cope with NATs and firewalls

For metadata signaling, WebRTC apps use an intermediary server, but for actual media and data streaming once a session is established, `RTCPeerConnection` attempts to connect clients directly or peer-to-peer.

In a simpler world, every WebRTC endpoint would have a unique address that it could exchange with other peers in order to communicate directly.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/LrErdUdxSBf8XaSJ1XhO.png", alt="Simple peer to peer connection", width="800", height="188" %}
  <figcaption>A world without NATs and firewalls</figcaption>
</figure>

In reality, most devices live behind one or more layers of [NAT](https://www.howstuffworks.com/nat.htm), some have antivirus software that blocks certain ports and protocols, and many are behind proxies and corporate firewalls. A firewall and NAT may in fact be implemented by the same device, such as a home WIFI router.

<figure>   
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ZVsek1SKMsrPTLQcRA63.png", alt="Peers behind NATs and firewalls", width="800", height="494" %}
  <figcaption>The real world</figcaption>
</figure>

WebRTC apps can use the [ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) framework to overcome the complexities of real-world networking. To enable this to happen, your app must pass ICE server URLs to `RTCPeerConnection`, as described in this article.

ICE tries to find the best path to connect peers. It tries all possibilities in parallel and chooses the most efficient option that works. ICE first tries to make a connection using the host address obtained from a device's operating system and network card. If that fails (which it will for devices behind NATs), ICE obtains an external address using a STUN server and, if that fails, traffic is routed through a TURN relay server.

In other words, a STUN server is used to get an external network address and TURN servers are used to relay traffic if direct (peer-to-peer) connection fails.

Every TURN server supports STUN. A TURN server is a STUN server with additional built-in relaying functionality. ICE also copes with the complexities of NAT setups. In reality, NAT hole-punching may require more than just a public IP:port address.

URLs for STUN and/or TURN servers are (optionally) specified by a WebRTC app in the `iceServers` configuration object that is the first argument to the `RTCPeerConnection` constructor. For [appr.tc](https://appr.tc), that value looks like this:

```json
{
  'iceServers': [
    {
      'urls': 'stun:stun.l.google.com:19302'
    },
    {
      'urls': 'turn:192.158.29.39:3478?transport=udp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    },
    {
      'urls': 'turn:192.158.29.39:3478?transport=tcp',
      'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      'username': '28224511:1379330808'
    }
  ]
}
```

{% Aside %}
The TURN credentials example was time-limited and expired in September 2013. TURN servers are expensive to run and you need to pay for your own servers or find a service provider. To test credentials, you can use the [candidate gathering sample](https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice) and check if you get a candidate with type `relay`.
{% endAside %}

Once `RTCPeerConnection` has that information, the ICE magic happens automatically. `RTCPeerConnection` uses the ICE framework to work out the best path between peers, working with STUN and TURN servers as necessary.

### STUN

[NATs](https://www.howstuffworks.com/nat.htm) provide a device with an IP address for use within a private local network, but this address can't be used externally. Without a public address, there's no way for WebRTC peers to communicate. To get around this problem, WebRTC uses [STUN](https://en.wikipedia.org/wiki/STUN).

STUN servers live on the public internet and have one simple task - check the IP:port address of an incoming request (from an app running behind a NAT) and send that address back as a response. In other words, the app uses a STUN server to discover its IP:port from a public perspective. This process enables a WebRTC peer to get a publicly accessible address for itself and then pass it to another peer through a signaling mechanism in order to set up a direct link. (In practice, different NATs work in different ways and there may be multiple NAT layers, but the principle is still the same.)

STUN servers don't have to do much or remember much, so relatively low-spec STUN servers can handle a large number of requests.

Most WebRTC calls successfully make a connection using STUN - 86% according to [Webrtcstats.com](https://webrtcstats.com/), though this can be less for calls between peers behind firewalls and complex NAT configurations.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/YGV8R7cI2RxpDtC0KMhl.png", alt="Peer to peer connection using a STUN server", width="800", height="545" %}
  <figcaption>Using STUN servers to get public IP:port addresses</figcaption>
</figure>

### TURN

`RTCPeerConnection` tries to set up direct communication between peers over UDP. If that fails, `RTCPeerConnection` resorts to TCP. If that fails, TURN servers can be used as a fallback, relaying data between endpoints.

Just to reiterate, TURN is used to relay audio, video, and data streaming between peers, not signaling data!

TURN servers have public addresses, so they can be contacted by peers even if the peers are behind firewalls or proxies. TURN servers have a conceptually simple task - to relay a stream. However, unlike STUN servers, they inherently consume a lot of bandwidth. In other words, TURN servers need to be beefier.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/sXMerfYKQmlGTWOwUCe1.png", alt="Peer to peer connection using a STUN server", width="800", height="545" %}
  <figcaption>The full Monty: STUN, TURN, and signaling</figcaption>
</figure>

This diagram shows TURN in action. Pure STUN didn't succeed, so each peer resorts to using a TURN server.

### Deploying STUN and TURN servers

For testing, Google runs a public STUN server, stun.l.google.com:19302, as used by [appr.tc](https://appr.tc). For a production STUN/TURN service, use the rfc5766-turn-server. Source code for STUN and TURN servers is available on [GitHub](https://github.com/coturn/rfc5766-turn-server/), where you can also find links to several sources of information about server installation. A [VM image for Amazon Web Services](https://groups.google.com/forum/#!msg/discuss-webrtc/X-OeIUC0efs/XW5Wf7Tt1vMJ) is also available.

An alternative TURN server is restund, available as [source code](https://www.creytiv.com/restund.html) and also for AWS. Here are instructions for how to set up restund on Compute Engine.

1. Open firewall as necessary for tcp=443, udp/tcp=3478.
1. Create four instances, one for each public IP, Standard Ubuntu 12.06 image.
1. Set up local firewall config (allow ANY from ANY).
1. Install tools:
    ```shell
    sudo apt-get install make
    sudo apt-get install gcc
    ```
1. Install libre from [creytiv.com/re.html](https://creytiv.com/re.html).
1. Fetch restund from [creytiv.com/restund.html](https://creytiv.com/restund.html) and unpack./
1. `wget` [hancke.name/restund-auth.patch](https://hancke.name/restund-auth.patch) and apply with `patch -p1 < restund-auth.patch`.
1. Run `make`, `sudo make install` for libre and restund.
1. Adapt `restund.conf` to your needs (replace IP addresses and make sure it contains the same shared secret) and copy to `/etc`.
1. Copy `restund/etc/restund` to `/etc/init.d/`.
1. Configure restund:
    1. Set `LD_LIBRARY_PATH`.
    1. Copy `restund.conf` to `/etc/restund.conf`.
    1. Set `restund.conf` to use the right 10. IP address.
1. Run restund
1. Test using stund client from remote machine: `./client IP:port`

## Beyond one-to-one: Multiparty WebRTC

You may also want to take a look at Justin Uberti's proposed IETF standard for a [REST API for access to TURN Services](https://tools.ietf.org/html/draft-uberti-rtcweb-turn-rest-00).

It's easy to imagine use cases for media streaming that go beyond a simple one-to-one call. For example, video conferencing between a group of colleagues or a public event with one speaker and hundreds or millions of viewers.

A WebRTC app can use multiple RTCPeerConnections so that every endpoint connects to every other endpoint in a mesh configuration. This is the approach taken by apps, such as [talky.io](https://talky.io), and works remarkably well for a small handful of peers. Beyond that, processing and bandwidth consumption becomes excessive, especially for mobile clients.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/wnlggGjq35kOISPOfV0a.png", alt="Mesh: small N-way call", width="300", height="288" %}
  <figcaption>Full mesh topology: Everyone connected to everyone</figcaption>
</figure>

Alternatively, a WebRTC app could choose one endpoint to distribute streams to all others in a star configuration. It would also be possible to run a WebRTC endpoint on a server and construct your own redistribution mechanism (a [sample client app](https://code.google.com/p/webrtc/source/browse/#svn%2Ftrunk%2Ftalk) is provided by webrtc.org).

Since Chrome 31 and Opera 18, a `MediaStream` from one `RTCPeerConnection` can be used as the input for another. This can enable more flexible architectures because it enables a web app to handle call-routing by choosing which other peer to connect to. To see this in action, see [WebRTC samples Peer connection relay](https://webrtc.github.io/samples/src/content/peerconnection/multiple-relay/) and [WebRTC samples Multiple peer connections](https://webrtc.github.io/samples/src/content/peerconnection/multiple/).

### Multipoint Control Unit

A better option for a large number of endpoints is to use a [Multipoint Control Unit](https://en.wikipedia.org/wiki/Multipoint_control_unit) (MCU). This is a server that works as a bridge to distribute media between a large number of participants. MCUs can cope with different resolutions, codecs, and frame rates in a video conference; handle transcoding; do selective stream forwarding; and mix or record audio and video. For multiparty calls, there are a number of issues to consider, particularly how to display multiple video inputs and mix audio from multiple sources. Cloud platforms, such as [vLine](https://www.vline.com/), also attempt to optimize traffic routing.

It's possible to buy a complete MCU hardware package or build your own.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/d8MN1t22X6P7lD5ql9AZ.png", alt="Rear view of Cisco MCU5300", width="300", height="51" %}
  <figcaption>The back of a <a href="https://cisco.com/en/US/products/ps12283">Cisco MCU</a></figcaption>
</figure>

Several open source MCU software options are available. For example, [Licode](https://lynckia.com/) (previously known as Lynckia) produces an open source MCU for WebRTC. OpenTok has [Mantis](https://www.tokbox.com/blog/mantis-next-generation-cloud-technology-for-webrtc/).

## Beyond browsers: VoIP, telephones, and messaging

The standardized nature of WebRTC makes it possible to establish communication between a WebRTC app running in a browser and a device or platform running on another communication platform, such as a telephone or a video-conferencing system.

[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) is a signaling protocol used by VoIP and video-conferencing systems. To enable communication between a WebRTC web app and a SIP client, such as a video-conferencing system, WebRTC needs a proxy server to mediate signaling. Signaling must flow through the gateway but, once communication has been established, SRTP traffic (video and audio) can flow directly peer to peer.

The [Public Switched Telephone Network (PSTN)](https://en.wikipedia.org/wiki/Public_switched_telephone_network) is the [circuit-switched](https://en.wikipedia.org/wiki/Circuit_switching) network of all "plain old" analog telephones. For calls between WebRTC web apps and telephones, traffic must go through a PSTN gateway. Likewise, WebRTC web apps need an intermediary XMPP server to communicate with [Jingle](https://en.wikipedia.org/wiki/Jingle_(protocol)) endpoints such as IM clients. Jingle was developed by Google as an extension to XMPP to enable voice and video for messaging services. Current WebRTC implementations are based on the C++ [libjingle](https://developers.google.com/talk/libjingle/developer_guide) library, an implementation of Jingle initially developed for Talk.

A number of apps, libraries, and platforms make use of WebRTC's ability to communicate with the outside world:

- [sipML5](https://code.google.com/p/sipml5/): an open source JavaScript SIP client
- [jsSIP](https://www.jssip.net/): JavaScript SIP library
- [Phono](https://phono.com/): open source JavaScript phone API built as a plugin
- [Zingaya](https://zingaya.com/product/): an embeddable phone widget
- [Twilio](https://www.twilio.com/): voice and messaging
- [Uberconference](https://www.uberconference.com/): conferencing

The sipML5 developers have also built the [webrtc2sip](https://code.google.com/p/webrtc2sip/) gateway. Tethr and Tropo have demonstrated [a framework for disaster communications](https://tethr.tumblr.com/) "in a briefcase" using an [OpenBTS cell](https://en.wikipedia.org/wiki/OpenBTS) to enable communications between feature phones and computers through WebRTC. That's telephone communication without a carrier!

## Find out more

The [WebRTC codelab](https://bitbucket.org/webrtc/codelab) provides step-by-step instructions for how to build a video and text chat app using a Socket.io signaling service running on Node.

[Google I/O WebRTC presentation from 2013](https://www.youtube.com/watch?v=p2HzZkd2A40) with WebRTC tech lead, Justin Uberti

Chris Wilson's SFHTML5 presentation - [Introduction to WebRTC Apps](https://www.youtube.com/watch?v=3Ifbqaw5l_I)

The 350-page book [WebRTC: APIs and RTCWEB Protocols of the HTML5 Real-Time Web](https://webrtcbook.com) provides a lot of detail about data and signaling pathways, and includes a number of detailed network topology diagrams.

[WebRTC and Signaling: What Two Years Has Taught Us](https://www.tokbox.com/blog/webrtc-and-signaling-what-two-years-has-taught-us/) - TokBox blog post about why leaving signaling out of the spec was a good idea

[Ben Strong's](https://www.linkedin.com/in/strongben) [A Practical Guide to Building WebRTC Apps](https://thenewcircle.com/s/post/1548/a_practical_guide_to_building_webrtc_apps_ben_strong_video) provides a lot of information about WebRTC topologies and infrastructure.

The [WebRTC chapter](https://chimera.labs.oreilly.com/books/1230000000545/ch18.html) in [Ilya Grigorik's](https://www.igvita.com/) __High Performance Browser Networking__ goes deep into WebRTC architecture, use cases, and performance.

