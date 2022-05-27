---
layout: post
title: Data-binding revolutions with Object.observe()
date: 2014-05-20
authors:
  - addyosmani
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

{% Aside 'warning' %}
In November 2015, it was [announced on esdiscuss](https://esdiscuss.org/topic/an-update-on-object-observe) 
that the `Object.observe()` proposal is being withdrawn from TC39.
{% endAside %}

## Introduction

A revolution is coming. There’s a new addition to JavaScript that’s going to change __everything__ you think you know about data-binding. It’s also going to change how many of your MVC libraries approach observing models for edits and updates. Are you ready for some sweet performance boosts to apps that care about property observation?

Okay. Okay. Without further delay, I’m happy to announce [`Object.observe()`](http://wiki.ecmascript.org/doku.php?id=harmony:observe) has landed in [Chrome 36](http://www.chromestatus.com/features/6147094632988672) stable. __[WOOOO. THE CROWD GOES WILD]__.

`Object.observe()`, part of a future ECMAScript standard, is a method for asynchronously observing changes to JavaScript objects… without the need for a separate library. It allows an observer to receive a time-ordered sequence of change records which describe the set of changes which took place to a set of observed objects.

```js
// Let's say we have a model with data
var model = {};

// Which we then observe
Object.observe(model, function(changes){

    // This asynchronous callback runs
    changes.forEach(function(change) {

        // Letting us know what changed
        console.log(change.type, change.name, change.oldValue);
    });

});
```

Anytime a change is made, it gets reported:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/AyTEBW6MUiau9OXMaVOG.png", alt="Change reported.", width="686", height="257" %}
</figure>

With `Object.observe()` (I like to call it O.o() or Oooooooo), you can implement two-way data-binding [without the need for a framework](http://bitworking.org/news/2014/05/zero_framework_manifesto).

That’s not to say you shouldn’t use one. For large projects with complicated business logic, opinionated frameworks are invaluable and you should continue to use them. They simplify the orientation of new developers, require less code maintenance and impose patterns on how to achieve common tasks. When you don’t need one, you can use smaller, more focused libraries like [Polymer](http://polymer-project.org) (which already take advantage of O.o()).

Even if you find yourself heavily using a framework or MV* library, O.o() has the potential to provide them with some healthy performance improvements, with a faster, simpler implementation whilst keeping the same API. For example, [last year Angular found](https://mail.mozilla.org/pipermail/es-discuss/2012-September/024978.html) that in a benchmark where changes were being made to a model, dirty-checking took 40ms per update and O.o() took 1-2ms per update (an improvement of 20-40x faster).

Data-binding without the need for tons of complicated code also means you no longer have to poll for changes, so longer battery life!

If you're already sold on O.o(), skip-ahead to the feature introduction, or read ahead for more on the problems it solves.

## What do we want to observe?

When we’re talking about data observation, we’re usually referring to keeping an eye out for some specific types of changes:

- Changes to raw JavaScript objects
- When properties get added, changed, deleted
- When arrays have elements spliced in and out of them
- Changes to the prototype of the object

## The importance of data-binding

Data-binding starts to become important when you care about model-view control separation. HTML is a great declarative mechanism, but it’s completely static. Ideally, you just want to declare the relationship between your data and the DOM and keep the DOM up to date. This creates leverage and saves you a lot of time writing really repetitive code that just sends data to and from the DOM between your application’s internal state or the server.

Data-binding is particularly useful when you have a complex user-interface where you need to wire up relationships between multiple properties in your data models with multiple elements in your views. This is pretty common in the single-page applications we’re building today.

By baking a way to natively observe data in the browser, we give JavaScript frameworks (and small utility libraries you write) a way to observe changes to model data without relying on some of the slow hacks the world uses today.

## What the world looks like today

**Dirty-checking**

Where have you seen data-binding before? Well, if you use a modern MV* library for building your webapps (e.g Angular, Knockout) you’re probably used to binding model data to the DOM. As a refresher, here’s an example of a Phone list app where we’re binding the value of each phone in a `phones` array (defined in JavaScript) to a list item so that our data and UI are always in sync:

```js
<html ng-app>
  <head>
    ...
    <script src='angular.js'></script>
    <script src='controller.js'></script>
  </head>
  <body ng-controller='PhoneListCtrl'>
    <ul>
      <li ng-repeat='phone in phones'>
        {{phone.name}}
        <p>{{phone.snippet}}</p>
      </li>
    </ul>
  </body>
</html>
```

and the JavaScript for the controller:

```js
var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function($scope) {
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
});
```

Anytime the underlying model data changes, our list in the DOM gets updated. How does Angular achieve this? Well, behind the scenes it’s doing something called dirty-checking.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/8NhwcWyZJiLZS5k4EEru.png", alt="Dirty checking", width="800", height="446" %}
</figure>
 
The basic idea with dirty-checking is that anytime data could have changed, the library has to go and check if it did change via a digest or change cycle. In Angular’s case, a digest cycle identifies all expressions registered to be watched to see if there’s a change. It [knows](http://stackoverflow.com/questions/9682092/databinding-in-angularjs/9693933#9693933) about a model’s previous values and if they have changed, a change event is fired. For a developer, the main benefit here is that you get to use raw JavaScript object data which is pleasant to use and composes fairly well. The downside is that it has bad algorithmic behavior and is potentially very expensive.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/RjWKA54O8RSUxYjEZ13M.png", alt="Dirty checking.", width="800", height="431" %}
</figure>

The expense of this operation is proportional to the total number of observed objects. I may need to do a lot of dirty checking. Also may need a way to trigger dirty-checking when data *might* have changed. There are lots of clever tricks frameworks use for this. It's unclear if this is ever going to be perfect.

The web ecosystem should have more ability to innovate and evolve its own declarative mechanisms, e.g.

- Constraint-based model systems
-  Auto-persistence systems (e.g persisting changes to IndexedDB or localStorage)
- Container objects (Ember, Backbone)

[Container](http://www.slideshare.net/mixonic/containers-di) objects are where a framework creates objects which on the inside hold the data. They have accessors to the data and they can capture what you set or get and internally broadcast. This works well. It's relatively performant and has good algorithmic behavior. An example of container objects using Ember can be found below:

```js
// Container objects
MyApp.president = Ember.Object.create({
  name: "Barack Obama"
});
 
MyApp.country = Ember.Object.create({
  // ending a property with "Binding" tells Ember to
  // create a binding to the presidentName property
  presidentNameBinding: "MyApp.president.name"
});
 
// Later, after Ember has resolved bindings
MyApp.country.get("presidentName");
// "Barack Obama"
 
// Data from the server needs to be converted
// Composes poorly with existing code
```

The expense of discovering what changed here is proportional to the number of things that changed. Another problem is now you're using this different kind of object. Generally speaking you have to convert from data you're getting from the server to these objects so they're observable.

This doesn't compose particularly well with existing JS code because most code assumes it can operate on raw data. Not for these these specialized kinds of objects.

## `Introducing Object.observe()`

Ideally what we want is the best of both worlds - a way to observe data with support for raw data objects (regular JavaScript objects) if we choose to AND without the need to dirty-check everything all the time. Something with good algorithmic behavior. Something that composes well and is baked into the platform. This is the beauty of what `Object.observe()` brings to the table.

It allows us to observe an object, mutate properties and see the change report of what has changed. But enough about the theory, let’s look at some code!

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/mZEHsJKa7hgENbT7btX3.png", alt="Object.observe()", width="800", height="448" %}
</figure>

### Object.observe() and Object.unobserve()

Let’s imagine that we have a simple vanilla JavaScript object representing a model:

```js
// A model can be a simple vanilla object
var todoModel = {
  label: 'Default',
  completed: false
};
```

We can then specify a callback for whenever mutations (changes) are made to the object:

```js
function observer(changes){
  changes.forEach(function(change, i){
      console.log('what property changed? ' + change.name);
      console.log('how did it change? ' + change.type);
      console.log('whats the current value? ' + change.object[change.name]);
      console.log(change); // all changes
  });
}
```

{% Aside %}
When the observer callback is invoked, the observed objects may have been changed multiple times, so for each change, the new value (the value following each change) and the current value (the final value) aren't necessarily the same thing.
{% endAside %}

We can then observe these changes using O.o(), passing in the object as our first argument and the callback as our second:

```js
Object.observe(todoModel, observer);
```

Let’s start making some changes to our Todos model object:

```js
todoModel.label = 'Buy some more milk';
```

Looking at the console, we get back some useful information! We know what property changed, how it was changed and what the new value is.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/SuipCSKRhKasAwoLxssX.png", alt="Console report", width="685", height="259" %}
</figure>

Woo! Goodbye, dirty-checking! Your tombstone should be carved in Comic Sans. Let’s change another property. This time `completeBy`:

```js
todoModel.completeBy = '01/01/2014';
```

As we can see we once again successfully get back a change report:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/HYrWbPQDDPyZo9mxdZA1.png", alt="Change report.", width="689", height="253" %}
</figure>

Great. What if we now decided to delete the ‘completed’ property from our object:

```js
delete todoModel.completed;
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Rw7ym71bRXj07vQWgPEx.png", alt="Completed", width="686", height="261" %}
</figure>

As we can see, the report of changes returned includes information about the deletion. As expected, the new value of the property is now undefined. So, we now know you can find out when properties have been added. When they've been deleted. Basically, the __set__ of properties on an object ("new", "deleted", "reconfigured") and it's prototype changing (_proto_).

As in any observation system, a method also exists to stop listening out for changes. In this case, it’s `Object.unobserve()`, which has the same signature as O.o() but can be called as follows:

```js
Object.unobserve(todoModel, observer);
```

As we can see below, any mutations made to the object after this has been run no longer result in a list of change records being returned.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/oznJVQJ0gVHuAlsHhY86.png", alt="Mutations", width="684", height="259" %}
</figure>

### Specifying changes of interest

So we’ve looked at the basics behind how to get back a list of changes to an observed object. What if you’re interested in only a subset of changes that were made to an object rather than all of them?. Everyone needs a spam filter. Well, observers can specify only those types of changes they wish to hear about through an accept list. This can be specified using the third argument to O.o() as follows:

```js
Object.observe(obj, callback, optAcceptList)
```

Let’s walk through an example of how this can be used:

```js
// Like earlier, a model can be a simple vanilla object

var todoModel = {
  label: 'Default',
  completed: false

};


// We then specify a callback for whenever mutations 
// are made to the object
function observer(changes){
  changes.forEach(function(change, i){
    console.log(change);
  })

};

// Which we then observe, specifying an array of change 
// types we're interested in

Object.observe(todoModel, observer, ['delete']);

// without this third option, the change types provided 
// default to intrinsic types

todoModel.label = 'Buy some milk'; 

// note that no changes were reported
```

If however we now delete the label, notice that this type of change does get reported:

```js
delete todoModel.label;
```

If you don’t specify a list of accept types to O.o(), it defaults to the "intrinsic" object change types (`add`, `update`, `delete`, `reconfigure`, `preventExtensions` (for when an object becoming non-extensible isn’t observable)).

## Notifications

O.o() also comes with the notion of notifications. They’re nothing like those annoying things you get on a phone, but rather useful. Notifications are similar to [Mutation Observers](https://developer.mozilla.org/docs/Web/API/MutationObserver). They happen at the end of the micro-task. In the browser context, this is almost always going to be at the end of the current event handler.

The timing is nice because generally one unit of work is finished and now observers get to do their work. It’s a nice turn-based processing model.

The workflow for using a notifier looks a little like this:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/NX0q4MKDAHCyacZ1lvoJ.png", alt="Notifications", width="800", height="448" %}
</figure>

Let’s look at an example of how notifiers might be used in practice to define custom notifications for when properties on an object are get or set. Keep an eye on the comments here:

```js
// Define a simple model
var model = {
    a: {}
};

// And a separate variable we'll be using for our model's 
// getter in just a moment
var _b = 2;

// Define a new property 'b' under 'a' with a custom
// getter and setter

Object.defineProperty(model.a, 'b', {
    get: function () {
        return _b;
    },
    set: function (b) {

        // Whenever 'b' is set on the model
        // notify the world about a specific type
        // of change being made. This gives you a huge
        // amount of control over notifications
        Object.getNotifier(this).notify({
            type: 'update',
            name: 'b',
            oldValue: _b
        });

        // Let's also log out the value anytime it gets
        // set for kicks
        console.log('set', b);

        _b = b;
    }
});

// Set up our observer
function observer(changes) {
    changes.forEach(function (change, i) {
        console.log(change);
    })
}

// Begin observing model.a for changes
Object.observe(model.a, observer);
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Hw9MxpD9bTYK98aq6JrL.png", alt="Notifications console", width="686", height="271" %}
</figure>

Here we report when the value of the data properties change ("update"). Anything else the object’s implementation chooses to report (`notifier.notifyChange()`).

Years of experience on the web platform have taught us that a synchronous approach is the first thing you try because its the easiest to wrap your head around. The problem is it creates a fundamentally dangerous processing model. If you're writing code and say, update the property of an object, you don't really want a situation having update the property of that object could have invited some arbitrary code to go do whatever it wanted. It's not ideal to have your assumptions invalidated as you're running through the middle of a function.

If you're an observer, you ideally don't want to be called if someone is in the middle of something. You don't want to be asked to go to do work on an inconsistent state of the world. End up doing a lot more error checking. Trying to tolerate a lot more bad situations and generally, its a hard model to work with. Async is harder to deal with but its a better model at the end of the day.

The solution to this problem is synthetic change records.

## Synthetic change records

Basically, if you want to have accessors or computed properties it is your responsibility to notify when these values change. It’s a little extra work but it is designed as a sort of first-class feature of this mechanism and these notifications will be delivered with the rest of the notifications from underlying data objects. From data properties.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/U2yz4qnKJrPd5DmiePoL.png", alt="Synthetic change records", width="800", height="444" %}
</figure>

Observing accessors and computed properties can be solved with notifier.notify - another part of O.o(). Most observation systems want some form of observing derived values. There are lots of ways to do this. O.o makes no judgement as to the "right" way. Computed properties should be accessors which *notify* when the internal (private) state changes.

Again, webdevs should expect libraries to help make notifying and various approaches to computed properties easy (and reduce boilerplate). 

Let’s set up the next example, which is a circle class. The idea here is that we have this circle and there’s a radius property. In this case the radius is an accessor and when its value changes it’s actually going to notify for itself that the value changed. This will be delivered with all other changes to this object or any other object. Essentially, if you’re implementing an object you want to have synthetic or computed properties or you have to pick a strategy for how this is going to work. Once you do, this will fit into your system as a whole.

Skip past the code to see this working in DevTools.

```js
function Circle(r) {
  var radius = r;
 
  var notifier = Object.getNotifier(this);
  function notifyAreaAndRadius(radius) {
    notifier.notify({
      type: 'update',
      name: 'radius',
      oldValue: radius
    })
    notifier.notify({
      type: 'update',
      name: 'area',
      oldValue: Math.pow(radius * Math.PI, 2)
    });
  }
 
  Object.defineProperty(this, 'radius', {
    get: function() {
      return radius;
    },
    set: function(r) {
      if (radius === r)
        return;
      notifyAreaAndRadius(radius);
      radius = r;
    }
  });
 
  Object.defineProperty(this, 'area', {
    get: function() {
      return Math.pow(radius, 2) * Math.PI;
    },
    set: function(a) {
      r = Math.sqrt(a/Math.PI);
      notifyAreaAndRadius(radius);
      radius = r;
    }
  });
}
 
function observer(changes){
  changes.forEach(function(change, i){
    console.log(change);
  })
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/9VeNfFdGdgZaBj8sf6rr.png", alt="Synthetic change records console", width="690", height="355" %}
</figure>

## Accessor properties

A quick note on accessor properties. We mentioned earlier that only the value changes are observable for data properties. Not for computed properties or accessors. The reason is that JavaScript doesn't really have the notion of changes in value to accessors. An accessor is just a collection of functions.

If you assign to an accessor JavaScript just invokes the function there and from its point of view nothing has changed. It just gave some code the opportunity to run.

The problem is semantically we can look at our above assignment to the value - 5 to it. We ought to be able to know what happened here. This is actually an unsolvable problem. The example demonstrates why. There is really no way for any system to know what is meant by this because this can be arbitrary code. It can do whatever it wants in this case. It’s updating the value every time it is accessed and so asking whether it changed doesn’t make much sense.

## Observing multiple objects with one callback

Another pattern possible with O.o() is the notion of a single callback observer. This allows a single callback to be used as an "observer" for lots of different objects. The callback will be delivered the full set of changes to all objects it observes at the “end of the microtask” (Note the similarity to Mutation Observers).

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Ecy0DdsooKMHqHfoAzl0.png", alt="Observing multiple objects with one callback", width="800", height="440" %}
</figure>

## Large-scale changes

Maybe you’re working on a reaaaally big app and regularly have to work with large-scale changes. Objects may wish to describe larger semantic changes which will affect lots of properties in a more compact way (instead of broadcasting tons of property changes).

O.o() helps with this in the form of two specific utilities: `notifier.performChange()` and `notifier.notify()`, which we’ve already introduced.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/h9YEPzJj6eEkoWhYTOwn.png", alt="Large-scale changes", width="800", height="453" %}
</figure>

Let’s look at this in an example of how large-scale changes can be described where we define a Thingy object with some math utilities (multiply, increment, incrementAndMultiply). Any time a utility is used, it tells the system that a collection of work comprises a specific type of change.

For example: `notifier.performChange('foo', performFooChangeFn);`

```js
function Thingy(a, b, c) {
  this.a = a;
  this.b = b;
}

Thingy.MULTIPLY = 'multiply';
Thingy.INCREMENT = 'increment';
Thingy.INCREMENT_AND_MULTIPLY = 'incrementAndMultiply';


Thingy.prototype = {
  increment: function(amount) {
    var notifier = Object.getNotifier(this);

    // Tell the system that a collection of work comprises 
    // a given changeType. e.g
    // notifier.performChange('foo', performFooChangeFn);
    // notifier.notify('foo', 'fooChangeRecord');
    notifier.performChange(Thingy.INCREMENT, function() {
      this.a += amount;
      this.b += amount;
    }, this);

    notifier.notify({
      object: this,
      type: Thingy.INCREMENT,
      incremented: amount
    });
  },

  multiply: function(amount) {
    var notifier = Object.getNotifier(this);

    notifier.performChange(Thingy.MULTIPLY, function() {
      this.a *= amount;
      this.b *= amount;
    }, this);

    notifier.notify({
      object: this,
      type: Thingy.MULTIPLY,
      multiplied: amount
    });
  },

  incrementAndMultiply: function(incAmount, multAmount) {
    var notifier = Object.getNotifier(this);

    notifier.performChange(Thingy.INCREMENT_AND_MULTIPLY, function() {
      this.increment(incAmount);
      this.multiply(multAmount);
    }, this);

    notifier.notify({
      object: this,
      type: Thingy.INCREMENT_AND_MULTIPLY,
      incremented: incAmount,
      multiplied: multAmount
    });
  }
}
```

We then define two observers for our object: one which is a catch-all for changes and another which will only report back on specific accept types we’ve defined (Thingy.INCREMENT, Thingy.MULTIPLY, Thingy.INCREMENT_AND_MULTIPLY).

```js
var observer, observer2 = {
    records: undefined,
    callbackCount: 0,
    reset: function() {
      this.records = undefined;
      this.callbackCount = 0;
    },
};

observer.callback = function(r) {
    console.log(r);
    observer.records = r;
    observer.callbackCount++;
};

observer2.callback = function(r){
	console.log('Observer 2', r);
}


Thingy.observe = function(thingy, callback) {
  // Object.observe(obj, callback, optAcceptList)
  Object.observe(thingy, callback, [Thingy.INCREMENT,
                                    Thingy.MULTIPLY,
                                    Thingy.INCREMENT_AND_MULTIPLY,
                                    'update']);
}

Thingy.unobserve = function(thingy, callback) {
  Object.unobserve(thingy);
}
```

We can now start playing with this code. Let's define a new Thingy:

```js
var thingy = new Thingy(2, 4);
```
Observe it and then make some changes. OMG, so fun. SO many thingies!

```js
// Observe thingy
Object.observe(thingy, observer.callback);
Thingy.observe(thingy, observer2.callback);

// Play with the methods thingy exposes
thingy.increment(3);               // { a: 5, b: 7 }
thingy.b++;                        // { a: 5, b: 8 }
thingy.multiply(2);                // { a: 10, b: 16 }
thingy.a++;                        // { a: 11, b: 16 }
thingy.incrementAndMultiply(2, 2); // { a: 26, b: 36 }
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/QSJ7imhSFnzjxdAVa1ji.png", alt="Large-scale changes", width="688", height="356" %}
</figure>

Everything inside of the "perform function" is considered to be the work of “big-change”. Observers which accept “big-change” will only receive the “big-change” record. Observers which do not will receive the underlying changes resulting from the work which “perform function” did.

## Observing arrays

We’ve talked for a while about observing changes to objects but what about arrays?! Great question. When someone tells me, "Great question." I never hear their answer because I'm busy congratulating myself for asking such a great question, but I digress. We have new methods for working with arrays too!

`Array.observe()` is a method that treats large-scale changes to itself - for example - splice, unshift or anything which implicitly changes it length - as a "splice" change record. Internally it uses `notifier.performChange("splice",...)`. 

Here’s an example where we observe a model "array" and similarly get back a list of changes when there are any changes to the underlying data:

```js
var model = ['Buy some milk', 'Learn to code', 'Wear some plaid'];
var count = 0;

Array.observe(model, function(changeRecords) {
  count++;
  console.log('Array observe', changeRecords, count);
});

model[0] = 'Teach Paul Lewis to code';
model[1] = 'Channel your inner Paul Irish';
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/W259zu0LSyKmcSOv9DBl.png", alt="Observing arrays", width="689", height="357" %}
</figure>

## Performance

The way to think about the computational performance impact of O.o() is to think about it like a read cache. Generally speaking, a cache is a great choice when (in order of importance):

1. The frequency of reads dominates the frequency of writes.
1. You're able to create a cache which trades the constant amount of work involved during writes for algorithmically better performance during reads.
1. The constant time slowdown of writes is acceptable.

O.o() is designed for use-cases like 1).

Dirty-checking requires keeping a copy of all the data you're observing. This means you incur a structural memory cost to dirty-checking you just don't get with O.o(). Dirty-checking, whilst a decent stop-gap solution, is also a fundamentally leaky abstraction which can create unnecessary complexity for applications. 

Why? Well, dirty-checking has to run any time data *may* have changed. There simply isn't a very robust way to do this and any approach to it has significant downsides (e.g checking on a polling interval risks visual artifacts and race conditions between code concerns). Dirty-checking also requires a global registry of observers, creating memory-leak hazards and tear-down costs O.o() avoids.

Let’s take a look at some numbers. 

The below benchmark tests (available on [GitHub](https://github.com/Polymer/observe-js/tree/master/benchmark)) allow us to compare dirty-checking vs O.o(). They're structured as graphs of Observed-Object-Set-Size vs Number-Of-Mutations.
The general result is that dirty-checking performance is algorithmically proportional to the number of observed objects while O.o() performance is proportional to the number of mutations which were made. 

**Dirty-checking**

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/u0YA16bZphwvi61IzqR9.png", alt="Dirty checking performance", width="800", height="355" %}
</figure>

**Chrome with Object.observe() switched on**

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Bu4TUrPE5juVVZDUlmis.png", alt="Observe performance", width="800", height="359" %}
</figure>

## Polyfilling Object.observe()

Great - so O.o() can be used in Chrome 36, but what about using it in other browsers? We’ve got you covered. Polymer’s [Observe-JS](https://github.com/Polymer/observe-js) is a polyfill for O.o() which will use the native implementation if it’s present, but otherwise polyfills it and includes some useful sugaring on top. It offers an aggregate view of the world that sums up changes and delivers a report of what has changed. Two really powerful things it exposes are:

1. You can observe paths. This means you can say, I would like to observe "foo.bar.baz" from a given object and they’ll tell you when the value at that path changed. If the path is unreachable, it considers the value undefined.

Example of observing a value at a path from a given object:

```js
var obj = { foo: { bar: 'baz' } };

var observer = new PathObserver(obj, 'foo.bar');
observer.open(function(newValue, oldValue) {
  // respond to obj.foo.bar having changed value.
});
```

2. It will tell you about array splices. Array splices are basically the minimal set of splice operations you will have to perform on an array in order to transform the old version of the array into the new version of the array. This is a type of transform or different view of the array. It’s the minimum amount of work you need to do to move from the old state to the new state.

Example of reporting changes to an array as a minimal set of splices:

```js
var arr = [0, 1, 2, 4];

var observer = new ArrayObserver(arr);
observer.open(function(splices) {
  // respond to changes to the elements of arr.
  splices.forEach(function(splice) {
    splice.index; // index position that the change occurred.
    splice.removed; // an array of values representing the sequence of elements which were removed
    splice.addedCount; // the number of elements which were inserted.
  });
});
```

## Frameworks and Object.observe()

As mentioned, O.o() will give frameworks and libraries a huge opportunity to improve the performance of their data-binding in browsers that support the feature.

Yehuda Katz and Erik Bryn from Ember confirmed that adding support for O.o() is in Ember's near-term roadmap. Angular's Misko Hervy wrote a [design doc](https://docs.google.com/document/d/10W46qDNO8Dl0Uye3QX0oUDPYAwaPl0qNy73TVLjd1WI/edit) on Angular 2.0's improved change detection. Their long term approach will be to take advantage of Object.observe() when it lands in Chrome stable, opting for [Watchtower.js](https://github.com/angular/watchtower.js/), their own change detection approach until then. Suuuuper exciting.

## Conclusions

O.o() is a powerful addition to the web platform which you can go out and use today.

We’re hopeful that in time the feature will land in more browsers, allowing JavaScript frameworks to get performance boosts from access to native object observation capabilities. Those targeting Chrome should be able to use O.o() in Chrome 36 (and above) and the feature should also be available in a future Opera release.

So, go forth and talk to the authors of JavaScript frameworks about `Object.observe()` and how they’re planning on using it to improve the performance of data-binding in your apps. There are most definitely exciting times ahead!

## Resources

- [Object.observe() on the Harmony wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe)>
- [Databinding with Object.observe() by Rick Waldron](http://bocoup.com/weblog/javascript-object-observe/)
- [Everything you wanted to know about Object.observe() - JSConf](http://addyosmani.com/blog/the-future-of-data-binding-is-object-observe/)
- [Why Object.observe() is the best ES7 feature](http://georgestefanis.com/blog/2014/03/25/object-observe-ES7.html)

__With thanks to Rafael Weinstein, Jake Archibald, Eric Bidelman, Paul Kinlan and Vivian Cromwell for their input and reviews.__
