---
layout: post
title: Writing an AngularJS App with Socket.IO
authors:
  - brianford
date: 2012-07-27
tags:
  - blog
---

## Introduction

[AngularJS](http://angularjs.org) is an awesome JavaScript framework that gives you two-way data binding that's both easy to use and fast, a powerful directive system that lets you use create reusable custom components, plus a lot more. Socket.IO is a cross-browser wrapper and polyfill for websockets that makes developing real-time applications a breeze. Incidentally, the two work quite well together!

I've written before about [writing an AngularJS app with Express](http://briantford.com/blog/angular-express.html), but this time I'll be writing about how to integrate [Socket.IO](http://socket.io/) to add real-time features to an AngularJS application. In this tutorial, I'm going to walk through writing a instant messaging app. This builds upon my earlier tutorial (using a similar node.js stack on the server), so I recommend checking that out first if you're not familiar with Node.js or Express.

[Open the Demo](http://btford.angular-socket-io-im.jit.su/)


As always, you can [get the finished product on Github](https://github.com/btford/angular-socket-io-im).

## Prerequisites

There's a bit of boilerplate to getting Socket.IO set up and integrated with Express, so I created the [Angular Socket.IO Seed](https://github.com/btford/angular-socket-io-seed).

To get started, you can either clone the angular-node-seed repo from Github:

```shell
git clone git://github.com/btford/angular-socket-io-seed my-project
```

or [download it as a zip](https://github.com/btford/angular-socket-io-seed/zipball/master).

Once you have the seed, you need to grab a few dependencies with npm. Open a terminal to the directory with the seed, and run:

```shell
npm install
```

With these dependencies installed, you can run the skeleton app:

```shell
node app.js
```

and see it in your browser at `http://localhost:3000` to ensure that the seed is working as expected.

## Deciding on App Features

There are more than a few different ways to write a chat application, so let's describe the minimal features that ours will have. There will be just one chat room that all users will belong to. Users can choose and change their name, but the names must be unique. The server will enforce this uniqueness and announce when users change their names. The client should expose a list of messages, and a list of users currently in the chat room.

## A Simple Front End

With this specification, we can make a simple front end with Jade that provies the necessary UI elements. Open `views/index.jade` and add this inside of `block body`:

```css
div(ng-controller='AppCtrl')
.col
  h3 Messages
  .overflowable
    p(ng-repeat='message in messages') {{message.user}}: {{message.text}}

.col
  h3 Users
  .overflowable
    p(ng-repeat='user in users') {{user}}

.clr
  form(ng-submit='sendMessage()')
    | Message: 
    input(size='60', ng-model='message')
    input(type='submit', value='Send')

.clr
  h3 Change your name
  p Your current user name is {{name}}
  form(ng-submit='changeName()')
    input(ng-model='newName')
    input(type='submit', value='Change Name')
```

Open `public/css/app.css` and add the CSS to provide columns and overflows:

```css
/* app css stylesheet */

.overflowable {
  height: 240px;
  overflow-y: auto;
  border: 1px solid #000;
}

.overflowable p {
  margin: 0;
}

/* poor man's grid system */
.col {
  float: left;
  width: 350px;
}

.clr {
  clear: both;
}
```

## Interacting with Socket.IO

Although Socket.IO exposes an `io` variable on the `window`, it's better to encapsulate it in AngularJS's [Dependency Injection system](http://docs.angularjs.org/guide/di). So, we'll start by writing a service to wrap the `socket` object returned by Socket.IO. This is awesome, because it will make it much easier to test our controller later. Open `public/js/services.js` and replace the contents with:

```js
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
```

Notice that we wrap each socket callback in `$scope.$apply`. This tells AngularJS that it needs to check the state of the application and update the templates if there was a change after running the callback passed to it. Internally, `$http` works in the same way; after some XHR returns, it calls `$scope.$apply`, so that AngularJS can update its views accordingly.

Note that this service doesn't wrap the entire Socket.IO API (that's left as an exercise for the reader ;P ). However, it covers the methods used in this tutorial, and should point you in the right direction if you want to expand on it. I may revisit writing a complete wrapper, but that's beyond the scope of this tutorial.

Now, within our controller, we can ask for the `socket` object, much like we would with `$http`:

```js
function AppCtrl($scope, socket) {
  /* Controller logic */
}
```

Inside the controller, let's add logic for sending and receiving messages. Open `js/public/controllers.js` and replace the contents with the following:

```js
function AppCtrl($scope, socket) {

  // Socket listeners
  // ================

  socket.on('init', function (data) {
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });

  socket.on('change:name', function (data) {
    changeName(data.oldName, data.newName);
  });

  socket.on('user:join', function (data) {
    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + data.name + ' has joined.'
    });
    $scope.users.push(data.name);
  });

  // add a message to the conversation when a user disconnects or leaves the room
  socket.on('user:left', function (data) {
    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + data.name + ' has left.'
    });
    var i, user;
    for (i = 0; i &lt; $scope.users.length; i++) {
      user = $scope.users[i];
      if (user === data.name) {
        $scope.users.splice(i, 1);
        break;
      }
    }
  });

  // Private helpers
  // ===============

  var changeName = function (oldName, newName) {
    // rename user in list of users
    var i;
    for (i = 0; i &lt; $scope.users.length; i++) {
      if ($scope.users[i] === oldName) {
        $scope.users[i] = newName;
      }
    }

    $scope.messages.push({
      user: 'chatroom',
      text: 'User ' + oldName + ' is now known as ' + newName + '.'
    });
  }

  // Methods published to the scope
  // ==============================

  $scope.changeName = function () {
    socket.emit('change:name', {
      name: $scope.newName
    }, function (result) {
      if (!result) {
        alert('There was an error changing your name');
      } else {

        changeName($scope.name, $scope.newName);

        $scope.name = $scope.newName;
        $scope.newName = '';
      }
    });
  };

  $scope.sendMessage = function () {
    socket.emit('send:message', {
      message: $scope.message
    });

    // add the message to our model locally
    $scope.messages.push({
      user: $scope.name,
      text: $scope.message
    });

    // clear message box
    $scope.message = '';
  };
}
```

This application will only feature one view, so we can remove the routing from `public/js/app.js` and simplify it to:

```js
// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.directives']);
```

## Writing the Server

Open `routes/socket.js`. We need to define an object for maintaining the state of the server, so that user names are unique.

```js
// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || userNames[name]) {
      return false;
    } else {
      userNames[name] = true;
      return true;
    }
  };

  // find the lowest unused "guest" name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'Guest ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in userNames) {
      res.push(user);
    }

    return res;
  };

  var free = function (name) {
    if (userNames[name]) {
      delete userNames[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());
```

This basically defines a set of names, but with APIs that make more sense for the domain of a chat server. Let's hook this up to the server's socket to respond to the calls that our client makes:

```js
// export function for listening to the socket
module.exports = function (socket) {
  var name = userNames.getGuestName();

  // send the new user their name and a list of users
  socket.emit('init', {
    name: name,
    users: userNames.get()
  });

  // notify other clients that a new user has joined
  socket.broadcast.emit('user:join', {
    name: name
  });

  // broadcast a user's message to other users
  socket.on('send:message', function (data) {
    socket.broadcast.emit('send:message', {
      user: name,
      text: data.message
    });
  });

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;

      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    socket.broadcast.emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
};
```

And with that, the application should be complete. Try it out by running `node app.js`. The application should update in real-time, thanks to Socket.IO.

## Conclusion

There's a lot more you could add to this instant messaging app. For instance, you can submit empty messages. You could use [`ng-valid`](http://docs.angularjs.org/api/ng.directive:form) to prevent this on the client side, and a check on the server. Maybe the server could keep a recent history of messages for the benefit of new users joining the app.

Writing AngularJS apps that make use of other libraries is easy once you understand how to wrap them in a service and notify Angular that a model has changed. Next I plan to cover using AngularJS with [D3.js](http://d3js.org/), the popular visualization library.

## References

[Angular Socket.IO Seed](https://github.com/btford/angular-socket-io-seed)
[Finished Instant Messaging App](https://github.com/btford/angular-socket-io-im)
[AngularJS](http://angularjs.org/)
[Express](http://expressjs.com/)
[Socket.IO](http://socket.io/)`
