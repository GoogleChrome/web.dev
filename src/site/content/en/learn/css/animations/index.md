---
title: Animations
description: >
  Animation is a great way to highlight interactive elements,
  and add interest and fun to your designs.
  In this module find out how to add and control animation effects with CSS.
authors:
  - andybell
audio:
  title: 'The CSS Podcast - 022: Animation'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCO022_TCP_CSS_Podcast_Episode_022_v1.0.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
date: 2021-05-04
---

Sometimes you see little helpers on interfaces that when clicked,
provide some helpful information about that particular section.
These often have a pulsing animation to subtly let you know that the information is there
and should be interacted with.
How do you do this with CSS though?

{% Codepen {
  user: 'web-dot-dev',
  id: 'mdRXGeJ',
  height: 300
} %}

In CSS, you can make this type of animation using CSS animations,
 which allow you to set an animation sequence, using keyframes.
Animations can be simple, one state animations,
or even complex, time-based sequences.

## What is a keyframe?

In animation software, CSS, and most other tools that enable you to animate something,
keyframes are the mechanism that you use to assign animation states to timestamps,
along a timeline.

Let's use the "pulser" as a context for this.
The entire animation runs for 1 second and runs over 2 states.

{% Img
src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/pWCGpgzJqJNTBluK5u8S.svg",
alt="The states of the pulser animation over the 1 second timeframe",
width="800",
height="340" %}

There's a specific point where each of these animation states start and end.
You map these out on the timeline with keyframes.

{% Img
src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/wmKVq5GFj7cf6jfuLiT8.svg",
alt="The same diagram as before, but this time, with keyframes",
width="800",
height="440" %}

### `@keyframes`

Now you know what a keyframe is,
that knowledge should help you understand how the CSS
[`@keyframes`](https://developer.mozilla.org/docs/Web/CSS/@keyframes) rule works.
Here is a basic rule with two states.

```css
@keyframes my-animation {
	from {
		transform: translateY(20px);
	}
	to {
		transform: translateY(0px);
	}
}
```

The first part to note is the
[custom ident](https://developer.mozilla.org/docs/Web/CSS/custom-ident)
(custom identifier)—or in more human terms, the name of the keyframes rule.
This rule's identifier is `my-animation`.
The custom identifier works like a function name. Which, as you learned in the [functions module](/learn/css/functions),
lets you reference the keyframes rule elsewhere in your CSS code.

{% Aside %}
A `<custom-ident>` is used in various places in CSS,
and allows you to provide your own name for things.
These identifiers are case-sensitive,
and in some cases there are words that you can't use.
For example, when naming lines in CSS Grid, you can't use the word `span`.
{% endAside %}

Inside the keyframes rule, `from` and `to` are keywords that represent `0%` and `100%`,
which are the start of the animation and end.
You could re-create the same rule like this:

```css
@keyframes my-animation {
	0% {
		transform: translateY(20px);
	}
	100% {
		transform: translateY(0px);
	}
}
```

You can add as many positions as you like along the timeframe.
Using the context of the "pulser" example, there are 2 states,
which translate to 2 keyframes.
This means you have 2 positions inside your keyframes rule to represent the changes for each of these keyframes.

```css
@keyframes pulse {
  0% {
    opacity: 0;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.4;
  }
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'mdRXGeJ',
  tab: 'css,result',
  height: 300
} %}

## The `animation` properties

To use your `@keyframes` in a CSS rule, define various animation properties _or_, use the
[`animation`](https://developer.mozilla.org/docs/Web/CSS/animation) shorthand property.

### `animation-duration`

```css
.my-element {
	animation-duration: 10s;
}
```

The [animation-duration](https://developer.mozilla.org/docs/Web/CSS/animation-duration)
property defines how long the `@keyframes` timeline should be. It should be a time value.
It defaults to 0 seconds, which means the animation still runs,
but it'll be too quick for you to see.
You can't add negative time values.

### `animation-timing-function`

To help recreate natural motion in animation,
you can use timing functions that calculate the speed of an animation at each point.
Calculated values are often *curved*,
making the animation run at variable speeds over the course of `animation-duration`,
and if a value is calculated beyond that of the value defined in `@keyframes`, make the element appear to bounce.

There are several keywords available as presets in CSS, which are used as the value for
[animation-timing-function](https://developer.mozilla.org/docs/Web/CSS/animation-timing-function):
`linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`.

```css
.my-element {
	animation-timing-function: ease-in-out;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'YzNeJbL'
} %}

Values appear to curve with easing functions because easing is calculated using a **bézier curve**,
which is used to model velocity.
Each of the timing function keywords,
such as `ease`, reference a pre-defined bézier curve.
In CSS, you can define a bézier curve directly,
using the `cubic-bezier()` function,
which accepts four number values: `x1`, `y1`, `x2`, `y2`.

```css
.my-element {
	animation-timing-function: cubic-bezier(.42, 0, .58, 1);
}
```

These values plot each part of the curve along the X and Y axis.

{% Img
src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/AZr17k5ejTYsikAPiwTm.svg",
alt="A bézier on a progression vs time chart",
width="800",
height="499" %}

Understanding bézier curves is complicated and visual tools,
such as
[this generator by Lea Verou](https://cubic-bezier.com/)
are very helpful.

#### The `steps` easing function

Sometimes you might want more granular control of your animation,
and instead of moving along a curve, you want to move in intervals instead.
The `steps()` easing function lets you break the timeline into defined, **equal intervals**.

```css
.my-element {
	animation-timing-function: steps(10, end);
}
```

The first argument is how many steps.
If steps are defined as 10 and there are 10 keyframes,
each keyframe will play in sequence for the exact amount of time,
with no transition between states.
If there are not enough keyframes for the steps,
steps between keyframes are added depending on the second argument.

The second argument is the direction.
If it's set to `end`, which is the default,
the steps finish at the end of your timeline.
If it is set to `start`, the first step of your animation completes as soon as it starts,
which means it ends one step earlier than `end`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEpege'
} %}

### `animation-iteration-count`

```css
.my-element {
	animation-iteration-count: 10;
}
```

The [animation-iteration-count](https://developer.mozilla.org/docs/Web/CSS/animation-iteration-count)
property defines how many times the `@keyframes` timeline should run.
By default, this is 1,
which means that when the animation reaches the end of your timeline,
it will stop at the end.
The number can't be a negative number.

{% Codepen {
  user: 'web-dot-dev',
  id: 'oNBEaYB',
  tab: 'css,result'
} %}

You can use the `infinite` keyword which will loop your animation,
which is how the "pulser" demo from the start of this lesson works.

{% Codepen {
  user: 'web-dot-dev',
  id: 'mdRXGeJ',
  tab: 'css,result'
} %}

### `animation-direction`

```css
.my-element {
	animation-direction: reverse;
}
```

You can set which direction the timeline runs over your keyframes with
[animation-direction](https://developer.mozilla.org/docs/Web/CSS/animation-direction):

- `normal`: the default value, which is forwards.
- `reverse`: runs backwards over your timeline.
- `alternate`: for each animation iteration, the timeline will run forwards or backwards in sequence.
- `alternate-reverse`: the reverse of `alternate`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'JjWPqMv'
} %}

### `animation-delay`

```css
.my-element {
	animation-delay: 5s;
}
```

The [animation-delay](https://developer.mozilla.org/docs/Web/CSS/animation-delay)
property defines how long to wait before starting the animation.
Like the `animation-duration` property, this accepts a time value.

Unlike the `animation-duration` property, you *can* define this as a negative value.
If you set a negative value, the timeline in your `@keyframes` will start at that point.
For example, if your animation is 10 seconds long and you set `animation-delay` to `-5s`, it will start from half-way along your timeline.

{% Codepen {
  user: 'web-dot-dev',
  id: 'bGqbyPw'
} %}

### `animation-play-state`

```css
.my-element:hover {
	animation-play-state: paused;
}
```

The [animation-play-state](https://developer.mozilla.org/docs/Web/CSS/animation-play-state)
property allows you to play and pause the animation.
The default value is `running` and if you set it to `paused`, it will pause the animation.

{% Codepen {
  user: 'web-dot-dev',
  id: 'MWJQZyV',
  height: 400
} %}

### `animation-fill-mode`

The [animation-fill-mode](https://developer.mozilla.org/docs/Web/CSS/animation-fill-mode)
property defines which values in your `@keyframes` timeline persist before the animation starts or after it ends.
The default value is `none` which means when the animation is complete, the values in your timeline are discarded.
Other options are:

- `forwards`: The last keyframe will persist, based on the animation direction.
- `backwards`: The first keyframe will persist, based on the animation direction.
- `both`: follows the rules for both `forwards` and `backwards`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNyBEVK'
} %}

### The `animation` shorthand

Instead of defining all the properties separately,
you can define them in an `animation` shorthand,
which lets you define the animation properties in the following order:

1. `animation-name`
2. `animation-duration`
3. `animation-timing-function`
4. `animation-delay`
5. `animation-iteration-count`
6. `animation-direction`
7. `animation-fill-mode`
8. `animation-play-state`

```css
.my-element {
	animation: my-animation 10s ease-in-out 1s infinite forwards forwards running;
}
```

## Considerations when working with animation

Users can define in their operating system that they prefer to reduce motion
experienced when they interact with applications and websites.
This preference can be detected using the
[prefers-reduced-motion](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion)
media query.

```css
@media (prefers-reduced-motion) {
  .my-autoplaying-animation {
    animation-play-state: paused;
  }
}
```

This isn't necessarily a preference of no animation,
but rather, a preference to reduce animations—
[especially unexpected ones](/prefers-reduced-motion/).
You can learn more about this preference and overall performance with
[this animation guide](https://web.dev/animations/).


{% Codepen {
  user: 'web-dot-dev',
  id: 'bGqbPwq'
} %}

{% Assessment 'animations' %}
