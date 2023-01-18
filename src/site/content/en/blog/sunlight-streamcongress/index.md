---
layout: post
title: Case Study - Real-time Updates in Stream Congress
authors:
  - luigimontanez
date: 2011-03-17
tags:
  - blog
  - case-study
---

## Introduction

Through [WebSockets](http://www.html5rocks.com/tutorials/websockets/basics/) and [EventSource](http://www.html5rocks.com/tutorials/eventsource/basics/), HTML5 enables developers to build web apps that communicate in real time with a server. [Stream Congress](http://streamcongress.com) (available in the [Chrome Web Store](https://chrome.google.com/webstore/detail/ahebmhmbjonbglfkghfennmigkcmpbjp)) provides live updates about the workings of the United States Congress. It streams floor updates from both the House and Senate, relevant news updates, tweets from members of Congress, and other social media updates. The app is meant to be left open all day as it captures the business of Congress.

## Starting with WebSockets

The WebSockets spec has gotten quite a bit of attention for what it enables: a stable, bi-directional [TCP socket](http://www.csc.villanova.edu/~mdamian/Sockets/TcpSockets.htm) between the browser and server. There is no data format imposed on the TCP socket; the developer is free to define a messaging protocol. In practice, passing JSON objects around as strings is most convenient. The client-side JavaScript code to listen for live updates is clean and simple:

```js
var liveSocket = new WebSocket("ws://streamcongress.com:8080/live");

liveSocket.onmessage = function (payload) {
  addToStream(JSON.parse(payload.data).reverse());
};
```

While browser support for WebSockets is straightforward, server-side support is still in the formative stage. [Socket.IO](http://socket.io/) on Node.js provides one of the most mature and robust server-side solutions. An event-driven server like Node.js is the right fit for WebSockets. For alternative implementations, Python developers can use [Twisted](http://twistedmatrix.com/trac/) and [Tornado](http://www.tornadoweb.org/), while Ruby developers have [EventMachine](http://rubyeventmachine.com/).

### Introducing Cramp

[Cramp](https://github.com/lifo/cramp) is an asynchronous Ruby web framework that runs on top of EventMachine. It's written by [Pratik Naik](http://m.onkey.org/), a member of the Ruby on Rails core team. Providing a domain specific language (DSL) for real-time web apps, Cramp is an ideal choice for Ruby web developers. Those familiar with writing controllers in Ruby on Rails will recognize Cramp's style:

```ruby
require "rubygems"
require "bundler"
Bundler.require
require 'cramp'
require 'http_router'
require 'active_support/json'
require 'thin'

Cramp::Websocket.backend = :thin

class LiveSocket < Cramp::Websocket
periodic_timer :check_activities, :every => 15

def check_activities
    @latest_activity ||= nil
    new_activities = find_activities_since(@latest_activity)
    @latest_activity = new_activities.first unless new_activities.empty?
    render new_activities.to_json
end
end

routes = HttpRouter.new do
add('/live').to(LiveSocket)
end
run routes
```

Because Cramp sits on top of the non-blocking EventMachine, there are several considerations to keep in mind:

- Non-blocking database drivers must be used, like [MySQLPlus](https://github.com/oldmoe/mysqlplus) and [em-mongo](https://github.com/bcg/em-mongo). 
- Event-driven web servers must be used. Support is built in for [Thin](http://code.macournoyer.com/thin/) and [Rainbows](http://rainbows.rubyforge.org/).
- The Cramp app must be run separately from the main Rails app that powers Stream Congress, restarted and monitored independently.

### Current Limitations

WebSockets suffered a setback on December 8, 2010 when a security vulnerability was publicized. Both [Firefox and Opera](http://hacks.mozilla.org/2010/12/websockets-disabled-in-firefox-4/) removed browser support for WebSockets. While no pure JavaScript polyfill exists, there is a [Flash fallback](https://github.com/gimite/web-socket-js/) that has been widely adopted. However, relying on Flash is far from ideal. Even though Chrome and Safari continue to support WebSockets, it became clear that to support all modern browsers without relying on Flash, WebSockets would need to be replaced.

## Rolling back to AJAX polling

The decision was made to move away from WebSockets and back to "old-school" AJAX polling. While much less efficient from a disk and network I/O perspective, AJAX polling simplified the technical implementation of Stream Congress. Most significantly, the need for a separate Cramp app was eliminated. The AJAX endpoint was instead provided by the Rails app. The client-side code was modified to support jQuery AJAX polling:

```js
var fillStream = function(mostRecentActivity) {
  $.getJSON(requestURL, function(data) {
    addToStream(data.reverse());

    setTimeout(function() {
      fillStream(recentActivities.last());
    }, 15000);
  });
};

AJAX polling, though, is not without its downsides. Relying on the HTTP request/response cycle means that the server sees constant load even when there aren't any new updates. And of course, AJAX polling doesn't take advantage of what HTML5 has to offer.

## EventSource: The right tool for the job

Up to this point, a key factor was ignored about the nature of Stream Congress: the app only needs to stream updates one way, from server to client - downstream. It didn't need to be real-time, upstream client-to-server communication. 

In this sense, WebSockets is overkill for Stream Congress. Server-to-client communication is so common that it's been given a general term: push. In fact, many existing solutions for WebSockets, from the hosted [PusherApp](http://pusherapp.com) to the Rails library [Socky](https://github.com/socky), optimize for push and don't support client-to-server communication at all.

Enter EventSource, also called Server-Sent Events. The specification compares favorably to WebSockets in the context to server to client push:

- A similar, simple JavaScript API on the browser side.
- The open connection is HTTP-based, not dropping to the low level of TCP.
- Automatic reconnection when the connection is closed.

### Going Back to Cramp

In recent months, Cramp has added support for EventSource. The code is very similar to the WebSockets implementation:

```ruby
class LiveEvents < Cramp::Action
self.transport = :sse

periodic_timer :latest, :every => 15

def latest
@latest_activity ||= nil
new_activities = find_activities_since(@latest_activity)
@latest_activity = new_activities.first unless new_activities.empty?
render new_activities.to_json
end
end

routes = HttpRouter.new do
add('/').to(LiveEvents)
end
run routes
```

A significant issue to keep in mind with EventSource is that cross-domain connections are not allowed. This means that the Cramp app must be served from the same streamcongress.com domain as the main Rails app. This can be accomplished with proxying at the web server. Assuming the Cramp app is powered by Thin and running on port 8000, the Apache configuration looks like so:

```apacheconf
LoadModule  proxy_module             /usr/lib/apache2/modules/mod_proxy.so
LoadModule  proxy_http_module        /usr/lib/apache2/modules/mod_proxy_http.so
LoadModule  proxy_balancer_module    /usr/lib/apache2/modules/mod_proxy_balancer.so

<VirtualHost *:80>
  ServerName streamcongress.com
  DocumentRoot /projects/streamcongress/www/current/public
  RailsEnv production
  RackEnv production

  <Directory /projects/streamcongress/www/current/public>
    Order allow,deny
    Allow from all
    Options -MultiViews
  </Directory>

  <Proxy balancer://thin>
    BalancerMember http://localhost:8000
  </Proxy>

  ProxyPass /live balancer://thin/
  ProxyPassReverse /live balancer://thin/
  ProxyPreserveHost on
</VirtualHost>
```

This configuration sets an EventSource endpoint at `streamcongress.com/live`.

### Stable Polyfill

One of the most significant advantages of EventSource over WebSockets is that fallback is completely JavaScript-based, with no dependence on Flash. Remy Sharp's [polyfill](https://github.com/remy/polyfills) accomplishes this by implementing long-polling in browsers that don't support EventSource natively. Thus, EventSource works today on all modern browsers with JavaScript enabled.

## Conclusion

HTML5 opens the door to many new and exciting web development possibilities. With WebSockets and EventSource, web developers now have clean, well-defined standards to enable real-time web apps. But not all users run modern browsers. Graceful degradation must be considered when choosing to implement these technologies. And tooling on the server side for WebSockets and EventSource is still in the early stages. It's important to keep these factors in mind when developing real-time HTML5 apps.
