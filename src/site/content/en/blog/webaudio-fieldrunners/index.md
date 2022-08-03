---
layout: post
title: Case Study - A Tale of an HTML5 Game with Web Audio
authors:
  - zgoddard
date: 2012-04-24
tags:
  - blog
---

## Fieldrunners

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/9cFnKkN7rru58JS1RevH.png", alt="Fieldrunners screenshot", width="800", height="601" %}
  <figcaption>Fieldrunners screenshot</figcaption>
</figure>

Fieldrunners is an award-winning tower-defense style game that was originally released for [iPhone](http://itunes.apple.com/us/app/fieldrunners/id292421271?mt=8) in 2008. Since then it has been ported to many other platforms. One of the most recent platforms was the [Chrome browser](https://chrome.google.com/webstore/detail/lkpikhjbfbffdblahfidklcohlaeabak) in October 2011. One of the challenges of porting Fieldrunners to an HTML5 platform was how to play sound.

Fieldrunners does not make complicated use of sound effects, but it does comes with some expectations of how it can interact with its sound effects. The game has 88 sound effects of which a large number can be expected to playing at one time. Most of these sounds are very short and need to be played in as timely a fashion as possible to avoid creating any disconnect with the graphical presentation.

## Some Challenges Appeared

While porting Fieldrunners to HTML5 we encountered issues with audio playback with the Audio tag and early on decided to focus on the [Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html) instead. Using WebAudio helped us solve issues like giving us the high number of concurrent effects playing back that Fieldrunners requires. Still, while developing an audio system for Fieldrunners HTML5 we hit a few nuanced problems that other developers may want to be aware of.

### Nature of AudioBufferSourceNodes

AudioBufferSourceNodes are your primary method of playing sounds with WebAudio. It is very important to understand that they are a one time use object. You create an AudioBufferSourceNode, assign it a buffer, connect it to the graph, and play it with noteOn or noteGrainOn. After that you can call noteOff to stop playback, but you won't be able to play the source again by calling noteOn or noteGrainOn - you have to create another AudioBufferSourceNode. You can - and this is key - reuse the same underlying AudioBuffer object, however (in fact, you can even have multiple active AudioBufferSourceNodes that point to the same AudioBuffer instance!).  You can find a playback snippet from Fieldrunners in Give Me a Beat.

### Non-caching content

At release the Fieldrunners HTML5 server showed a massive number of requests for music files. This result arose from the Chrome 15 proceeding to download the file in chunks and then not cache it. In response at the time we decided to load music files like the rest of our audio files. Doing so is suboptimal but some versions of other browsers still do this.

### Silencing when out of focus

Detecting when your game's tab is out of focus was difficult previously. Fieldrunners began porting before Chrome 13 where the [Page Visibility API](http://www.w3.org/TR/2011/WD-page-visibility-20110602/) replaced the need for our convoluted code to detect tab blurring. Every game should use the Visibility API to write a small snippet to mute or pause their sound if not pause the whole game. Since Fieldrunners used the [requestAnimationFrame](http://paulirish.com/2011/requestanimationframe-for-smart-animating/) API, game pausing was implicitly handled, but not sound pausing.

### Pausing sounds

Oddly enough while getting feedback to this article we were informed that the technique we were using for pausing sounds wasn't appropriate - we were utilizing a bug in Web Audio's current implementation to pause playback of sounds. Since this will be fixed in the future, you cannot just pause sound by disconnecting a node or subgraph to halt playback.

## A Simple Web Audio Node Architecture

Fieldrunners has a very simple audio model. That model can support the following feature set:

- Control the volume of sound effects.
- Control the volume of the background music track.
- Mute all audio. 
- Turn off playing sounds when the game is paused.
- Turn those same sounds back on when the game is resumed.
- Turn off all audio when the game's tab loses focus.
- Restart playback after a sound is played as needed.

To achieve the above features with Web Audio, it used 3 of the provided possible nodes: DestinationNode, GainNode, AudioBufferSourceNode. The AudioBufferSourceNodes play the sounds. The GainNodes connect the AudioBufferSourceNodes together. The DestinationNode, created by the Web Audio context, called destination, plays sounds for the player. Web Audio has many more types of nodes but with only these we can create a very simple graph for sounds in a game.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/CYp9mdaf3OPvfd4d1ivg.png", alt="Node Graph Chart", width="683", height="235" %}
</figure>

A Web Audio node graph leads from the leaf nodes to the destination node. Fieldrunners used 6 permanent gain nodes, but 3 is enough to allow easy control over volume and connect a larger number of temporary nodes that will playback buffers. First a master gain node attaching every child node to the destination. Immediately attached to the master gain node is two gain nodes, one for a music channel and another to link all sound effects.

Fieldrunners had 3 extra gain nodes due to the incorrect usage of a bug as a feature. We used those nodes to clip off groups of playing sounds from the graph which stops their progress. We did this to pause sounds. As it is not correct, we would now only use 3 total gain nodes as described above. Many of the snippets following will include our incorrect nodes, showing what we did, and how we would fix that in the short term. But in the long term you would want to not use our nodes after our coreEffectsGain node.

```js
function AudioManager() {
  // map for loaded sounds
  this.sounds = {};

  // create our permanent nodes
  this.nodes = {
    destination: this.audioContext.destination,
    masterGain: this.audioContext.createGain(),

    backgroundMusicGain: this.audioContext.createGain(),

    coreEffectsGain: this.audioContext.createGain(),
    effectsGain: this.audioContext.createGain(),
    pausedEffectsGain: this.audioContext.createGain()
  };

  // and setup the graph
  this.nodes.masterGain.connect( this.nodes.destination );

  this.nodes.backgroundMusicGain.connect( this.nodes.masterGain );

  this.nodes.coreEffectsGain.connect( this.nodes.masterGain );
  this.nodes.effectsGain.connect( this.nodes.coreEffectsGain );
  this.nodes.pausedEffectsGain.connect( this.nodes.coreEffectsGain );
}
```

Most games allow separate control of the sound effects and the music. This can be easily accomplished with our above graph. Each gain node has a "gain" attribute that can be set to any decimal value between 0 and 1, which can be used to essentially control volume. Since we want to control the volume of the music and sound effect channels separately we have a gain node for each where we could control their volume.

```js
function setArbitraryVolume() {
  var musicGainNode = this.nodes.backgroundMusicGain;

  // set music volume to 50%
  musicGainNode.gain.value = 0.5;
}
```

We can use this same ability to control the volume of everything, of sound effects and music. Setting the gain of the master node will affect all sound from the game. If you set the gain value to 0, you will mute the sound and music.
AudioBufferSourceNodes have a gain parameter as well. You could track a list of all playing sound and adjust their gain values individually for overall volume. If you were making sound effects with Audio tags, this is what you would have to do. Instead Web Audio's node graph makes it much easier to modify the sound volume of countless sounds.
Controlling volume this way also gives you extra power without complication. We could just attach a AudioBufferSourceNode directly to the master node for playing music and control its own gain. But you would have to set this value every time you create a AudioBufferSourceNode for the purpose of playing music. Instead you change one node only when a player changes the music volume and at launch. Now we have a gain value on buffer sources to do something else. For music one common use can be for creating a cross fade from one audio track to another as one leaves and another comes in. Web Audio provides a nice method for performing this easily.

```js
function arbitraryCrossfade( track1, track2 ) {
  track1.gain.linearRampToValueAtTime( 0, 1 );
  track2.gain.linearRampToValueAtTime( 1, 1 );
}
```

Fieldrunners did not make specific use of crossfading. Had we known of WebAudio's value setting functionality during our original pass of the sound system we would likely have.

## Pausing Sounds

When a player pauses a game they can expect some sounds to still play. Sound is a great part of feedback for the common pressing of user interface elements in game menus. As Fieldrunners has a number of interfaces for the user to interact with while the game is paused we still want those playing. However we do not want any long or looping sounds to keep playing. It is pretty easy to stop those sounds with Web Audio or at least we thought so.

```js
AudioManager.prototype.pauseEffects = function() {
  this.nodes.effectsGain.disconnect();
}
```

The paused effects node is still connected. Any sounds that are allowed to ignore the paused state of the game will continue to play through that. When the game unpauses we can reconnect those nodes and have all sound playing again instantly.

```js
AudioManager.prototype.resumeEffects = function() {
  this.nodes.effectsGain.connect( this.nodes.coreEffectsGain );
}
```

After shipping Fieldrunners, we discovered that disconnecting a node or subgraph alone will not pause the playback of the AudioBufferSourceNodes. We actually took advantage of a bug in WebAudio that currently stops playback of nodes not connected to the Destination node in the graph. So to make sure we are ready for that future fix we need some code like the following:

```js
AudioManager.prototype.pauseEffects = function() {
  this.nodes.effectsGain.disconnect();

  var now = Date.now();
  for ( var name in this.sounds ) {
    var sound = this.sounds[ name ];

    if ( !sound.ignorePause &amp;&amp; ( now - sound.source.noteOnAt &lt; sound.buffer.duration * 1000 ) ) {
      sound.pausedAt = now - sound.source.noteOnAt;
      sound.source.noteOff();
    }
  }
}

AudioManager.prototype.resumeEffects = function() {
  this.nodes.effectsGain.connect( this.nodes.coreEffectsGain );

  var now = Date.now();
  for ( var name in this.sounds ) {
    if ( sound.pausedAt ) {
      this.play( sound.name );
      delete sound.pausedAt;
    }
  }
};
```

If we had known this earlier, that we were abusing a bug, our audio code's structure would be very different. As such, this has affected a number of sections of this article. It has a direct effect here but also in our code snippets in Losing Focus and Give Me a Beat. Knowing how this actually works requires changes in both the Fieldrunners node graph (since we created nodes for shorting out playback) and the additional code that will record and provide the paused states that Web Audio does not do on its own.

## Losing Focus

Our master node comes into play for this feature. When a browser user switches to another tab, the game is no longer visible. Out of sight, out of mind, and so should the sound be gone. There are tricks that can be done to determine specific visibility states for a game's page but it has become vastly easier with the Visibility API.

Fieldrunners will only play as the active tab thanks to using requestAnimationFrame for calling its update loop. But the Web Audio context will continue to play looped effects and background tracks while a user is in another tab. But we can stop that with a very small Visibility API aware snippet.

```js 
function AudioManager() {
  // map and node setup
  // ...

  // disable all sound when on other tabs
  var self = this;
  window.addEventListener( 'webkitvisibilitychange', function( e ) {
    if ( document.webkitHidden ) {
      self.nodes.masterGain.disconnect();

      // As noted in Pausing Sounds disconnecting isn't enough.
      // For Fieldrunners calling our new pauseEffects method would be
      // enough to accomplish that, though we may still need some logic
      // to not resume if already paused.
      self.pauseEffects();
    } else {
      self.nodes.masterGain.connect( this.nodes.destination );
      self.resumeEffects();
    }
  });
}
```

Before writing this article, we thought disconnecting the master would be enough to pause all sound instead of muting it. By disconnecting the node at the time, we stopped it and its children from processing and playing. When it was reconnected all of the sounds and music would begin playing where they left at just as the game play will continue where it left at. But this is unexpected behaviour. It isn't enough to just disconnect to halt playback.

The Page Visibility API makes it very easy to know when your tab is no longer in focus. If you already have effective code to pause sounds, it only takes a few lines to write in sound pausing when the games tab is hidden.

## Give Me a Beat

We have a few things set up now. We have a graph of nodes. We can pause sounds when the player pauses the game, and play new sounds for elements such as game menus. We can pause all sound and music when the user switches to a new tab. Now we need to actually play a sound.

Instead of playing multiple copies of the sound for multiple instances of a game entity like a character dying, Fieldrunners plays one sound only once for its duration. If the sound is needed after it has finished playing then it can restart but not while already playing. This is a decision for Fieldrunners' audio design as it has sounds that are requested to be played rapidly which would otherwise stutter if allowed to restart or create an un-enjoyable cacophony if allowed to play multiple instances. AudioBufferSourceNodes are expected to be used as one-shots. Create a node, attach a buffer, set loop boolean value if needed, connect to a node on the graph that will lead to destination, call noteOn or noteGrainOn, and optionally call noteOff.

For Fieldrunners it looks something like:

```js
AudioManager.prototype.play = function( options ) {
  var now = Date.now(),
    // pull from a map of loaded audio buffers
    sound = this.sounds[ options.name ],
    channel,
    source,
    resumeSource;

  if ( !sound ) {
    return;
  }

  if ( sound.source ) {
    var source = sound.source;
    if ( !options.loop &amp;&amp; now - source.noteOnAt &gt; sound.buffer.duration * 1000 ) {
      // discard the previous source node
      source.stop( 0 );
      source.disconnect();
    } else {
      return;
    }
  }

  source = this.audioContext.createBufferSource();
  sound.source = source;
  // track when the source is started to know if it should still be playing
  source.noteOnAt = now;

  // help with pausing
  sound.ignorePause = !!options.ignorePause;

  if ( options.ignorePause ) {
    channel = this.nodes.pausedEffectsGain;
  } else {
    channel = this.nodes.effectsGain;
  }

  source.buffer = sound.buffer;
  source.connect( channel );
  source.loop = options.loop || false;

  // Fieldrunners' current code doesn't consider sound.pausedAt.
  // This is an added section to assist the new pausing code.
  if ( sound.pausedAt ) {
    source.start( ( sound.buffer.duration * 1000 - sound.pausedAt ) / 1000 );
    source.noteOnAt = now + sound.buffer.duration * 1000 - sound.pausedAt;

    // if you needed to precisely stop sounds, you'd want to store this
    resumeSource = this.audioContext.createBufferSource();
    resumeSource.buffer = sound.buffer;
    resumeSource.connect( channel );
    resumeSource.start(
      0,
      sound.pausedAt,
      sound.buffer.duration - sound.pausedAt / 1000
    );
  } else {
    // start play immediately with a value of 0 or less
    source.start( 0 );
  }
}
```

## Too Much Streaming

Fieldrunners was originally launched with background music played with an Audio tag. At release, we discovered that music files were being requested an disproportionate number of times to that which the rest of the game content was requested. After some research we discovered that at the time the Chrome browser was not caching the streamed chunks of the music files. This resulted in the browser requesting the playing track every few minutes as it finished. In more recent testing, Chrome cached streamed tracks however other browsers may not be doing this yet. Streaming large audio files with the Audio tag for functionality like music playback is optimal but for some browser versions you may want to load your music the same way you load sound effects.

Since all the sound effects were playing through Web Audio we moved playing of the background music to Web Audio as well. This meant that we would load the tracks the same way we loaded all the effects with XMLHttpRequests and the arraybuffer response type.

```js
AudioManager.prototype.load = function( options ) {
  var xhr,
      // pull from a map of name, object pairs
      sound = this.sounds[ options.name ];

  if ( sound ) {
    // this is a great spot to add success methods to a list or use promises
    // for handling the load event or call success if already loaded
    if ( sound.buffer &amp;&amp; options.success ) {
      options.success( options.name );
    } else if ( options.success ) {
      sound.success.push( options.success );
    }

    // one buffer is enough so shortcut here
    return;
  }

  sound = {
    name: options.name,
    buffer: null,
    source: null,
    success: ( options.success ? [ options.success ] : [] )
  };
  this.sounds[ options.name ] = sound;

  xhr = new XMLHttpRequest();
  xhr.open( 'GET', options.path, true );
  xhr.responseType = 'arraybuffer';
  xhr.onload = function( e ) {
    sound.buffer = self._context.createBuffer( xhr.response, false );

    // call all waiting handlers
    sound.success.forEach( function( success ) {
      success( sound.name );
    });
    delete sound.success;
  };
  xhr.onerror = function( e ) {

    // failures are uncommon but you want to do deal with them

  };
  xhr.send();
}
```

## Summary

Fieldrunners was a blast to bring to Chrome and HTML5. Outside of its own mountain of work bringing thousands of C++ lines into javascript, some interesting dilemmas and decisions specific to HTML5 arouse. To reiterate one if none of the others, AudioBufferSourceNodes are one time use objects. Create them, attach an Audio Buffer, connect it to the Web Audio graph, and play with noteOn or noteGrainOn. Need to play that sound again? Then create another AudioBufferSourceNode.
