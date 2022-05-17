---
layout: post
title: Case-study - JAM with Chrome
subhead: How we made the audio rock
authors:
  - oskareriksson
date: 2012-11-08
tags:
  - blog
  - case-study
---

## Introduction

[JAM with Chrome](http://www.jamwithchrome.com) is a web based musical project created by Google. JAM with Chrome lets people from all over the world form a band and jam in real time inside the browser. We at [DinahMoe](http://www.dinahmoe.com/) had the great pleasure to be a part of this project. Our role was to produce music for the application, and design and develop the music component. The development consisted of three main areas: a "[music workstation](http://en.wikipedia.org/wiki/Music_Workstation)" including midi playback, software samplers, audio effects, routing and mixing; a music logic engine to control the music interactively in real-time; and a synchronization component that makes sure that all players in a session hear the music at exactly the same time, a prerequisite for being able to play together.

To achieve the highest possible level of authenticity, accuracy and audio quality we opted to use the Web Audio API. This case study will discuss some of the challenges we were presented with, and how we solved them. There are already a number of great introductory articles here at HTML5Rocks to get you started with Web Audio, so we’ll jump straight into the deep end of the pool.

## Writing custom audio effects

The Web Audio API has a number of useful effects included in the specification, but we needed  more elaborate effects for our instruments in JAM with Chrome. For example, there is a native delay node in Web Audio, but there are many types of [delays](http://en.wikipedia.org/wiki/Delay_(audio_effect)) - stereo delay, ping pong delay, slapback delay and the list goes on. Luckily, all of these are possible to create in Web Audio using the native effect nodes and some imagination.

Since we wanted to be able to use the native nodes and our own custom effects in such a transparent way as possible, we decided that we needed to create a wrapper format that could  achieve this. The native nodes in Web Audio uses its connect method to link nodes together, so we needed to emulate this behaviour. This is what the basic idea looks like:

```js
var MyCustomNode = function(){
    this.input = audioContext.createGain();
    var output = audioContext.createGain();

    this.connect = function(target){
       output.connect(target);
    };
};
```

With this pattern we’re really close to the native nodes. Let’s see how this would be used.

```js
//create a couple of native nodes and our custom node
var gain = audioContext.createGain(),
    customNode = new MyCustomNode(),
    anotherGain = audioContext.createGain();

//connect our custom node to the native nodes and send to the output
gain.connect(customNode.input);
customNode.connect(anotherGain);
anotherGain.connect(audioContext.destination);
```
<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/BoHq6zyZzDSLG9xluddc.png", alt="Routing the custom node", width="600", height="200" %}
</figure>


The only difference between our custom node and a native one is that we have to connect to the custom nodes input property. I’m sure there are ways to circumvent this, but this was close enough for our purposes. This pattern can be further developed to simulate the disconnect methods of native AudioNodes, as well as accommodating user defined inputs/outputs when connecting and so on. Have a look at the [specification](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#AudioNode-section) to see what the native nodes can do.

Now that we had our basic pattern for creating custom effects, the next step were to actually give the custom node some custom behaviour. Let’s have a look at a slapback delay node.

## Slapback like you mean it

The slapback delay, sometimes called slapback echo, is a classic effect used on a number of instruments, from 50’s style vocals to surf guitars. The effect takes the incoming sound and plays a copy of the sound with a slight delay of approximately 75-250 milliseconds. This gives a feeling of the sound being slapped back, thus the name. We can create the effect like so:

```js
var SlapbackDelayNode = function(){
    //create the nodes we'll use
    this.input = audioContext.createGain();
    var output = audioContext.createGain(),
        delay = audioContext.createDelay(),
        feedback = audioContext.createGain(),
        wetLevel = audioContext.createGain();

    //set some decent values
    delay.delayTime.value = 0.15; //150 ms delay
    feedback.gain.value = 0.25;
    wetLevel.gain.value = 0.25;

    //set up the routing
    this.input.connect(delay);
    this.input.connect(output);
    delay.connect(feedback);
    delay.connect(wetLevel);
    feedback.connect(delay);
    wetLevel.connect(output);

    this.connect = function(target){
       output.connect(target);
    };
};
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/VNFB0KBGaC7mg7hwiSkX.png", alt="Internal routing of the slapback node", width="600", height="200" %}
</figure>

As some of you might already have realised, this delay could be used with bigger delay times too, and thus become a regular mono delay with feedback. Here's an example using this delay to let you hear what it sounds like. 

## Routing audio

When working with different instruments and musical parts in professional audio applications it’s essential to have a flexible routing system that allows you to mix and modulate the sounds in effective ways. In JAM with Chrome we have developed an audio bus system, similar to the ones found in physical mixing boards. This allows us to hook up all instruments that need a reverb effect to a common bus, or channel, and then add the reverb to that bus instead of adding a reverb to each separate instrument. This is a major optimization and it’s quite recommended to do something similar as soon as you start doing more complex applications.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/KB2V7OkiZX6ZoYbawqn4.png", alt="Routing of the AudioBus", width="600", height="450" %}
</figure>


Luckily this is really easy to achieve in Web Audio. We can basically use the skeleton we defined for the effects and use it in the same way.

```js
var AudioBus = function(){
    this.input = audioContext.createGain();
    var output = audioContext.createGain();

    //create effect nodes (Convolver and Equalizer are other custom effects from the library presented at the end of the article)
    var delay = new SlapbackDelayNode(),
        convolver = new tuna.Convolver(),
        equalizer = new tuna.Equalizer();

    //route 'em
    //equalizer -> delay -> convolver
    this.input.connect(equalizer);
    equalizer.connect(delay.input);
    delay.connect(convolver);
    convolver.connect(output);

    this.connect = function(target){
       output.connect(target);
    };
};
```

This would be used like this:

```js
//create some native oscillators and our custom audio bus
var bus = new AudioBus(),
    instrument1 = audioContext.createOscillator(),
    instrument2 = audioContext.createOscillator(),
    instrument3 = audioContext.createOscillator();

//connect our instruments to the same bus
instrument1.connect(bus.input);
instrument2.connect(bus.input);
instrument3.connect(bus.input);
bus.connect(audioContext.destination);
```

And voila, we’ve applied delay, equalization and reverb (which is a rather expensive effect, performance wise) at half the cost as if we’d applied the effects to each separate instrument. If we wanted to add some extra spice to the bus, we could add two new gain nodes - preGain and postGain - which would allow us to turn off or fade the sounds in a bus in two different ways. The preGain is put before the effects, and postGain is put in the end of the chain. If we then fade the preGain the effects will still resonate after the gain has hit bottom, but if we fade postGain all sound will be muted at the same time.

## Where to from here?

These methods I’ve described here can, and should, be further developed. Things like the input and output of the custom nodes, and the connect methods, could/should be implemented using prototype based inheritance. Buses should be able to create effects dynamically by being passed a list of effects. 

To celebrate the release of JAM with Chrome we’ve decided to make our [framework of effects open source](https://github.com/Dinahmoe/tuna). If this brief introduction has tickled your fancy, please have a look and feel free to contribute. There’s a discussion going on [here](https://github.com/h5bp/lazyweb-requests/issues/82) regarding standardizing a format for custom Web Audio entites. Get involved!