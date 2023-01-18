---
layout: post
title: The Hobbit Experience 2014
subhead: Adding WebRTC gameplay to the Hobbit Experience
date: 2014-11-18
authors:
  - danielisaksson
tags:
  - blog
  - case-study
---

In time for the new Hobbit movie “The Hobbit: The Battle of the Five Armies” we have worked on extending last year’s Chrome Experiment, [A Journey through Middle-earth](http://middle-earth.thehobbit.com/) with some new content. The main focus this time has been to widen the use of WebGL as more browsers and devices can view the content and to work with the WebRTC capabilities in Chrome and Firefox. We had three goals with this years experiment:

- P2P gameplay using WebRTC and WebGL on Chrome for Android
- Make a multi-player game that is easy to play and that is based on touch input
- Host on Google Cloud Platform

## Defining the game

The game logic is built on a grid-based setup with troops moving on a game board. This made it easy for us to try out the gameplay on paper as we were defining the rules. Using a grid-based setup also helps with collision detection in the game to keep a good performance since you only have to check for collisions with objects in the same or neighbouring tiles.
We knew from the beginning that we wanted to focus the new game around a battle between the four main forces of Middle-earth, Humans, Dwarves, Elves and Orcs. It also had to be casual enough to be played within a Chrome Experiment and not have too many interactions to learn.
We started by defining five Battlegrounds on the Middle-earth map that serve as game-rooms where multiple players can compete in a peer-to-peer battle.
Showing multiple players in the room on a mobile screen, and allowing users to select who to challenge was a challenge in itself. To make the interaction and the scene easier we decided to only have one button to challenge and accept and only use the room to show events and who is the current king of the hill. This direction also resolved a few issues on the match-making side and allowed us to match the best candidates for a battle.
In our previous Chrome experiment [Cube Slam](https://cubeslam.com/) we learned that it takes a lot of work to handle latency in a multi-player game if the game’s result is relying on it. You constantly have to make assumptions of where the opponent’s state will be, where the opponent thinks that you are and sync that with animations on different devices. [This article](http://www.gamasutra.com/blogs/MarkMennell/20140929/226628/Making_FastPaced_Multiplayer_Networked_Games_is_Hard.php) explains these challenges in more detail. To make it a bit easier we made this game turn-based.

The game logic is built on a grid-based setup with troops moving on a game board. This made it easy for us to try out the gameplay on paper as we were defining the rules. Using a grid-based setup also helps with collision detection in the game to keep a good performance since you only have to check for collisions with objects in the same or neighboring tiles.


## Parts of the game

To make this multi-player game there are a few key parts that we had to build:

- A server side player management API handles users, match-making, sessions and game statistics.
- Servers to help establishing the connection between the players.
- An API for handling the AppEngine Channels API signaling used to connect and communicate with all the players in the game rooms.
- A JavaScript Game engine that handles the syncing of the state and the RTC messaging between the two players/peers.
- The WebGL game view.

## Player management

To support a large number of players we use many parallel game-rooms per Battleground. The main reason to limiting the number of players per game-room is to allow new players to reach the top of the leaderboard in reasonable time. The limit is also connected to the size of the json object describing the game-room sent through the Channel API that has a limit of 32kb.
We have to store players, rooms, scores, sessions and their relationships in the game. To do this, first we used [NDB](https://cloud.google.com/appengine/docs/python/ndb/) for entities and used the query interface to deal with relationships. NDB is an interface to the Google Cloud Datastore. Using NDB worked great in the beginning but we soon ran into a problem with how we needed to use it. The query was run against the "committed" version of the database (NDB Writes is explained at great length [in this in-depth article](https://cloud.google.com/appengine/docs/python/ndb/#writes)) which can have a delay of several seconds. But the entities themselves didn't have that delay as they respond directly from the cache. It might be a bit easier to explain with some example code:

```js
// example code to explain our issue with eventual consistency
def join_room(player_id, room_id):
    room = Room.get_by_id(room_id)
    
    player = Player.get_by_id(player_id)
    player.room = room.key
    player.put()
    
    // the player Entity is updated directly in the cache
    // so calling this will return the room key as expected
    player.room // = Key(Room, room_id)

    // Fetch all the players with room set to 'room.key'
    players_in_room = Player.query(Player.room == room.key).fetch()
    // = [] (an empty list of players)
    // even though the saved player above may be expected to be in the
    // list it may not be there because the query api is being run against the 
    // "committed" version and may still be empty for a few seconds

    return {
        room: room,
        players: players_in_room,
    }
```

After adding unit tests we could see the issue clearly and we moved away from the queries to instead keep the relationships in a comma separated list in [memcache](https://cloud.google.com/appengine/docs/python/memcache/). This felt like a bit of a hack but it worked and the AppEngine memcache has a transaction-like system for the keys using the excellent “compare and set”-feature so now the tests passed again.

Unfortunately memcache is not all rainbows and unicorns but comes with [a few limits](https://cloud.google.com/appengine/docs/python/memcache/#Python_Limits), the most notable ones being the 1MB value size (can’t have too many rooms related to a battleground) and key expiration, or as [the docs](https://cloud.google.com/appengine/docs/python/memcache/#Python_How_cached_data_expires) explains it:

{% Aside %}
In general, an application should not expect a cached value to always be available.
{% endAside %}

We did consider using another great key-value store, Redis. But at the time setting up a scalable cluster was a bit daunting and since we’d rather focus on building the experience than maintaining servers we didn’t go down that path. On the other hand the Google Cloud Platform recently released a simple [Click-to-deploy](https://cloud.google.com/solutions/redis/click-to-deploy) feature, with one of the options being a Redis Cluster so that would have been a very interesting option.

Finally we found [Google Cloud SQL](https://cloud.google.com/appengine/docs/python/cloud-sql/) and moved the relationships into MySQL. It was a lot of work but eventually it worked great, the updates are now fully atomic and the tests still pass. It also made implementing the match-making and score-keeping a lot more reliable.

Over time more of the data slowly has moved over from NDB and memcache to SQL but in general the player, battleground and room entities are still stored in NDB while the sessions and relationships between them all are stored in SQL.

We also had to keep track on who was playing who and pair up players against each other using a matching mechanism that took into consideration the players skill level and experience. We based the match-making on the open-source library [Glicko2](https://github.com/sublee/glicko2).

Since this is a multi-player game we want to inform the other players in the room about events like “who entered or left”, “who won or lost” and if there is a challenge to accept. To handle this we built in the ability to receive notifications into the Player Management API.

## Setting up WebRTC

When two players are matched up for a battle a signaling service is used to get the two matched peers talking to each other and to help start a peer connection.

There are several third-party libraries you can use for the signaling service and that also simplifies setting up WebRTC. Some options are  [PeerJS](http://peerjs.com/), [SimpleWebRTC](http://simplewebrtc.com/), and [PubNub WebRTC SDK](https://github.com/pubnub/webrtc). PubNub uses a hosted server solution and for this project we wanted to host on the Google Cloud Platform. The other two libraries use node.js servers that we could have installed on Google Compute Engine but we would also have to make sure it could handle thousands of concurrent users, something we already knew the Channel API can do.

One of the main advantages of using the Google Cloud Platform in this case is scaling. Scaling the resources needed for an AppEngine project is easily handled through the Google Developers Console and no extra work is needed to scale the signaling service when using  the Channels API. 

There were some concerns about latency and how robust the Channels API is but we had previously used it for the CubeSlam project and it had proven to work for millions of users in that project so we decided to use it again.

Since we didn’t choose to use a third-party library to help with WebRTC we had to build our own. Luckily we could re-use a lot of the work we did for the CubeSlam project. When both players have joined a session the session is set to “active”, and both players will then use that active session id to initiate the peer-to-peer connection through the Channel API. After that all communication between the two players will be handled over a [RTCDataChannel](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/).

We also need STUN and TURN servers to help establishing the connection and cope with NATs and firewalls. Read more in depth about setting up WebRTC in the HTML5 Rocks article [WebRTC in the real world: STUN, TURN, and signaling](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/).

The number of TURN servers used also need to be able to scale depending on the traffic. To handle this we tested the [Google Deployment manager](https://cloud.google.com/deployment-manager/overview). It allows us to dynamically deploy resources on Google Compute Engine and install TURN servers using a [template](https://gist.github.com/danielisaksson/5eb9680fb3c9e3166a33). It’s still in alpha but for our purposes it’s worked flawlessly. For TURN server we use [coturn](https://code.google.com/p/coturn), which is a very fast, efficient and seemingly reliable implementation of STUN/TURN.

## The Channel API

The Channel API is used to send all communication to and from the game room on the client side. Our player Management API is using the Channel API for its notifications about game events.

Working with the Channels API had a few speedbumps. One example is that since the messages can come unordered we had to wrap all messages in an object and sort them. Here’s some example code on how it works:

```js
var que = [];  // [seq, packet...]
var seq = 0;
var rcv = -1;

function send(message) {
  var packet = JSON.stringify({
    seq: seq++,
    msg: message
  });
  channel.send(packet);
}

function recv(packet) {
  var data = JSON.parse(packet);

  if (data.seq &lt;= rcv) {
    // ignoring message, older or already received
  } else if (data.seq > rcv + 1) {
    // message from the future. queue it up.
    que.push(data.seq, packet);
  } else {
    // message in order! update the rcv index and emit the message
    rcv = data.seq;
    emit('message', data.message);

    // and now that we have updated the `rcv` index we 
    // will check the que for any other we can send
    setTimeout(flush, 10);
  }
}

function flush() {
  for (var i=0; i&lt;que.length; i++) {
    var seq = que[i];
    var packet = que[i+1];
    if (data.seq == rcv + 1) {
      recv(packet);
      return; // wait for next flush
    }
  }
}
```


We also wanted to keep the different APIs of the site modular and separated from the hosting of the site and started up with using the [modules](https://cloud.google.com/appengine/docs/python/modules/) built into GAE. Unfortunately after getting it all to work in dev we realized that the Channel API [does not work](http://stackoverflow.com/questions/19163056/app-engine-python-modules-and-channel-service) with modules at all in production. Instead we moved to using separate GAE instances and ran into CORS problems that forced us to use an iframe [postMessage bridge](https://gist.github.com/danielisaksson/f3a1afefdfaffdb4d22f).

## Game engine

To make the game-engine as dynamic as possible we built the front end application using the [entity-component-system (ECS)](http://en.m.wikipedia.org/wiki/Entity_component_system) approach. When we started the development the wireframes and functional specification was not set, so it was very helpful to be able to add features and logic as the development progressed. For example, the [first prototype](http://demo.northkingdom.com/hobbit/battle/entity/) used a simple canvas-render-system to display the entities in a grid. A couple of [iterations later](http://demo.northkingdom.com/hobbit/battle/ai/), a system for collisions was added, and one for AI-controlled players. In the middle of the project we could switch to a 3d-renderer-system without changing the rest of the code. When the networking parts was up and running the ai-system could be modified to use remote commands.

So the basic logic of the multiplayer is to send the configuration of the action-command to the other peer through DataChannels and let the simulation act as if it’s an AI-player. On top of that there’s logic to decide which turn it is, if the player presses pass/attack-buttons, queue commands if they come in while the player still looking at the previous animation etc.

If it was just two users switching turns, both peers could share the responsibility to pass the turn to the opponent when they were done, but there is a third player involved. The AI-system became handy again (not just for testing), when we needed to add enemies like spiders and trolls. To make them fit into the turn-based flow it had to be spawned and executed exactly the same on both sides. This was solved by letting one peer control the turn-system and send the current status to the remote peer. Then when it’s the spiders turn, the turn manager let the ai-system create a command which is sent to the remote user. Since the game-engine is just acting on commands and entity-id:s the game will be simulated just the same on both sides. All units can also have the ai-component which enables easy automated testing.

It was optimal to have a simpler canvas-renderer in the beginning of development while focusing on the game logic. But the real fun started when the 3d version was implemented and the scenes came to life with environments and animations. We use [three.js](http://threejs.org) as 3d-engine, and it was easy to get to a playable state because of the architecture.

The mouse position is sent more frequently to the remote user and a 3d-light subtle hints about where the cursor is at the moment.
