---
title: Recognize your users' handwriting
subhead:
  The Handwriting Recognition API allows you to recognize text from handwritten input as it happens.
description: |
  The Handwriting Recognition API allows web applications to use advanced handwriting recognition services to recognize text from handwritten input in real time.
authors:
  - christianliebel
  - thomassteiner
date: 2021-05-17
# updated: 2021-05-14
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/k1gdvpBMneFVrOC5h4yQ.jpg
alt: A hand draws letters in calligraphic script on paper.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/3207688834594635777
---

{% Aside %} The Handwriting Recognition API is part of the [capabilities project](/fugu-status/) and
is currently in development. This post will be updated as the implementation progresses.
{% endAside %}

## What is the Handwriting Recognition API? {: #what }

The Handwriting Recognition API allows you to convert handwriting (ink) from your users into text.
Some operating systems have long included such APIs, and with this new capability, your web apps can
finally use this functionality. The conversion takes place directly on the user's device, works even
in offline mode, all without adding any third-party libraries or services.

This API implements so-called "on-line" or near real-time recognition. This means that the
handwritten input is recognized while the user is drawing it by capturing and analyzing the single
strokes. In contrast to "off-line" procedures such as Optical Character Recognition (OCR), where
only the end product is known, on-line algorithms can provide a higher level of accuracy due to
additional signals like the temporal sequence and pressure of individual ink strokes.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/xpKdyvsjKswk4kISP0pQ.mp4", autoplay=true, muted=true, playsinline=true, loop=true %}

### Suggested use cases for the Handwriting Recognition API {: #use-cases }

Example uses include:

- Note-taking applications where users want to capture handwritten notes and have them translated
  into text.
- Forms applications where users can use pen or finger input due to time constraints.
- Games that require filling in letters or numbers, such as crosswords, hangman, or sudoku.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | [In progress][ot]        |
| 5. Launch                                | Not started              |

</div>

## How to use the Handwriting Recognition API {: #use }

### Enabling via about://flags

To experiment with the Handwriting Recognition API locally, without an origin trial token, enable
the `#experimental-web-platform-features` flag in `about://flags`.

{% Aside %} Note that the API is currently exclusive to Chrome&nbsp;OS devices. Chrome&nbsp;91
already contains limited support for the API, but to fully experience it, we recommend you test on
Chrome&nbsp;92 to Chrome&nbsp;94. {% endAside %}

### Enabling support during the origin trial phase

Starting in Chrome&nbsp;92, the Handwriting Recognition API will be available as an origin trial on
Chrome&nbsp;OS. The origin trial is expected to end in Chrome&nbsp;94 (October 13, 2021).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Feature detection

Detect browser support by checking for the existence of the `createHandwritingRecognizer()` method
on the navigator object:

```js
if ('createHandwritingRecognizer' in navigator) {
  // 🎉 The Handwriting Recognition API is supported!
}
```

### Core concepts

The Handwriting Recognition API converts handwritten input into text, regardless of the input method
(mouse, touch, pen). The API has four main entities:

1. A _point_ represents where the pointer was at a particular time.
2. A _stroke_ consists of one or more points. The recording of a stroke starts when the user puts
   the pointer down (i.e., clicks the primary mouse button, or touches the screen with their pen or
   finger) and ends when they raise the pointer back up.
3. A _drawing_ consists of one or more strokes. The actual recognition takes place at this level.
4. The _recognizer_ is configured with the expected input language. It is used to create an instance
   of a drawing with the recognizer configuration applied.

These concepts are implemented as specific interfaces and dictionaries, which I'll cover shortly.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/IUbfA7u5K0vUYspj7XK5.png", alt="The core entities of the Handwriting Recognition API: One or more points compose a stroke, one or more strokes compose a drawing, that the recognizer creates. The actual recognition takes place at the drawing level.", width="800", height="445" %}

#### Creating a recognizer

To recognize text from handwritten input, you need to obtain an instance of a
`HandwritingRecognizer` by calling `navigator.createHandwritingRecognizer()` and passing constraints
to it. Constraints determine the handwriting recognition model that should be used. Currently, you
can specify a list of languages in order of preference:

```js
const recognizer = await navigator.createHandwritingRecognizer({
  languages: ['en'],
});
```

{% Aside 'caution' %} The current implementation on Chrome&nbsp;OS can only recognize one language
at a time. It only supports English (`en`), and a gesture model (`zxx-x-gesture`) to recognize
gestures such as crossing out words. {% endAside %}

The method returns a promise resolving with an instance of a `HandwritingRecognizer` when the
browser can fulfill your request. Otherwise, it will reject the promise with an error, and
handwriting recognition will not be available. For this reason, you may want to query the
recognizer's support for particular recognition features first.

#### Querying recognizer support

By calling `navigator.queryHandwritingRecognizerSupport()`, you can check if the target platform
supports the handwriting recognition features you intend to use. In the following example, the
developer:

- wants to detect texts in English
- get alternative, less likely predictions when available
- gain access to the segmentation result, i.e., the recognized characters, including the points and
  strokes that make them up

```js
const { languages, alternatives, segmentationResults } =
  await navigator.queryHandwritingRecognizerSupport({
    languages: ['en'],
    alternatives: true,
    segmentationResult: true,
  });

console.log(languages); // true or false
console.log(alternatives); // true or false
console.log(segmentationResult); // true or false
```

The method returns a promise resolving with a result object. If the browser supports the feature
specified by the developer, its value will be set to `true`. Otherwise, it will be set to `false`.
You can use this information to enable or disable certain features within your application, or to
adjust your query and send a new one.

{% Aside %} Due to fingerprinting concerns, you cannot request a list of supported features, such as
particular languages, and the browser may ask for user permission or reject your request entirely if
you send too many feature queries. {% endAside %}

#### Start a drawing

Within your application, you should offer an input area where the user makes their handwritten
entries. For performance reasons, it is recommended to implement this with the help of a
[canvas object](https://developer.mozilla.org/docs/Web/API/Canvas_API/Tutorial). The exact
implementation of this part is out of scope for this article, but you may refer to the [demo](#demo)
to see how it can be done.

To start a new drawing, call the `startDrawing()` method on the recognizer. This method takes an
object containing different hints to fine-tune the recognition algorithm. All hints are optional:

- The kind of text being entered: text, email addresses, numbers, or an individual character
  (`recognitionType`)
- The type of input device: mouse, touch, or pen input (`inputType`)
- The preceding text (`textContext`)
- The number of less-likely alternative predictions that should be returned (`alternatives`)
- A list of user-identifiable characters ("graphemes") the user will most likely enter
  (`graphemeSet`)

The Handwriting Recognition API plays well with
[Pointer Events](https://developer.mozilla.org/docs/Web/API/Pointer_events) which provide an
abstract interface to consume input from any pointing device. The pointer event arguments contain
the type of pointer being used. This means you can use pointer events to determine the input type
automatically. In the following example, the drawing for handwriting recognition is automatically
created on the first occurrence of a `pointerdown` event on the handwriting area. As the
`pointerType` may be empty or set to a proprietary value, I introduced a consistency check to make
sure only supported values are set for the drawing's input type.

```js
let drawing;
let activeStroke;

canvas.addEventListener('pointerdown', (event) => {
  if (!drawing) {
    drawing = recognizer.startDrawing({
      recognitionType: 'text', // email, number, per-character
      inputType: ['mouse', 'touch', 'pen'].find((type) => type === event.pointerType),
      textContext: 'Hello, ',
      alternatives: 2,
      graphemeSet: ['f', 'i', 'z', 'b', 'u'], // for a fizz buzz entry form
    });
  }
  startStroke(event);
});
```

{% Aside 'caution' %} The current implementation on Chrome&nbsp;OS does not support grapheme sets
yet, they are silently ignored. {% endAside %}

#### Add a stroke

The `pointerdown` event is also the right place to start a new stroke. To do so, create a new
instance of `HandwritingStroke`. Also, you should store the current time as a point of reference for
the subsequent points added to it:

```js
function startStroke(event) {
  activeStroke = {
    stroke: new HandwritingStroke(),
    startTime: Date.now(),
  };
  addPoint(event);
}
```

#### Add a point

After creating the stroke, you should directly add the first point to it. As you will add more
points later on, it makes sense to implement the point creation logic in a separate method. In the
following example, the `addPoint()` method calculates the elapsed time from the reference timestamp.
The temporal information is optional, but can improve recognition quality. Then, it reads the X and
Y coordinates from the pointer event and adds the point to the current stroke.

```js
function addPoint(event) {
  const timeElapsed = Date.now() - activeStroke.startTime;
  activeStroke.stroke.addPoint({
    x: event.offsetX,
    y: event.offsetY,
    t: timeElapsed,
  });
}
```

The `pointermove` event handler is called when the pointer is moved across the screen. Those points
need to be added to the stroke as well. The event can also be raised if the pointer is not in a
"down" state, for example when moving the cursor across the screen without pressing the mouse
button. The event handler from the following example checks if an active stroke exists, and adds the
new point to it.

```js
canvas.addEventListener('pointermove', (event) => {
  if (activeStroke) {
    addPoint(event);
  }
});
```

#### Recognize text

When the user lifts the pointer again, you can add the stroke to your drawing by calling its
`addStroke()` method. The following example also resets the `activeStroke`, so the `pointermove`
handler will not add points to the completed stroke.

{% Aside %} If necessary, you can also use the drawing's `getStrokes()` method to list all strokes,
and the `removeStroke()` method to remove a particular one from the drawing. {% endAside %}

Next, it's time for recognizing the user's input by calling the `getPrediction()` method on the
drawing. Recognition usually takes less than a few hundred milliseconds, so you can repeatedly run
predictions if needed. The following example runs a new prediction after each completed stroke.

```js
canvas.addEventListener('pointerup', async (event) => {
  drawing.addStroke(activeStroke.stroke);
  activeStroke = null;

  const [mostLikelyPrediction, ...lessLikelyAlternatives] = await drawing.getPrediction();
  if (mostLikelyPrediction) {
    console.log(mostLikelyPrediction.text);
  }
  lessLikelyAlternatives?.forEach((alternative) => console.log(alternative.text));
});
```

This method returns a promise which resolves with an array of predictions ordered by their
likelihood. The number of elements depends on the value you passed to the `alternatives` hint. You
could use this array to present the user with a choice of possible matches, and have them select an
option. Alternatively, you can simply go with the most likely prediction, which is what I do in the
example.

The prediction object contains the recognized text and an optional segmentation result, which I will
discuss in the following section.

#### Detailed insights with segmentation results

If supported by the target platform, the prediction object can also contain a segmentation result.
This is an array containing all recognized handwriting segment, a combination of the recognized
user-identifiable character (`grapheme`) along with its position in the recognized text
(`beginIndex`, `endIndex`), and the strokes and points that created it.

```js
if (mostLikelyPrediction.segmentationResult) {
  mostLikelyPrediction.segmentationResult.forEach(
    ({ grapheme, beginIndex, endIndex, drawingSegments }) => {
      console.log(grapheme, beginIndex, endIndex);
      drawingSegments.forEach(({ strokeIndex, beginPointIndex, endPointIndex }) => {
        console.log(strokeIndex, beginPointIndex, endPointIndex);
      });
    },
  );
}
```

You could use this information to track down the recognized graphemes on the canvas again.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/0UK0jj7vOXaNqkRr3SF9.png", alt="Boxes are drawn around each recognized grapheme", width="800", height="338" %}

#### Complete recognition

After the recognition has completed, you can free resources by calling the `clear()` method on the
`HandwritingDrawing`, and the `finish()` method on the `HandwritingRecognizer`:

```js
drawing.clear();
recognizer.finish();
```

## Demo

The web component `<handwriting-textarea>` implements a
[progressively enhanced](/progressively-enhance-your-pwa/), editing control capable of handwriting
recognition. By clicking the button in the lower right corner of the editing control, you activate
the drawing mode. When you complete the drawing, the web component will automatically start the
recognition and add the recognized text back to the editing control. If the Handwriting Recognition
API is not supported at all, or the platform doesn't support the requested features, the edit button
will be hidden. But the basic editing control remains usable as a `<textarea>`.

The web component offers properties and attributes to define the recognition behavior from the
outside, including `languages` and `recognitiontype`. You can set the content of the control via the
`value` attribute:

```html
<handwriting-textarea languages="en" recognitiontype="text" value="Hello"></handwriting-textarea>
```

To be informed about any changes to the value, you can listen to the `input` event.

You can try the component using [this demo on Glitch](https://handwriting-recognition.glitch.me/).
Also be sure to have a look at the
[source code](https://github.com/christianliebel/handwriting-textarea). To use the control in your
application, [obtain it from npm](https://www.npmjs.com/package/handwriting-textarea).

## Security and permissions

The Chromium team has designed and implemented the Handwriting Recognition API using the core
principles defined in [Controlling Access to Powerful Web Platform Features][powerful-apis],
including user control, transparency, and ergonomics.

### User control

The Handwriting Recognition API can't be turned off by the user. It is only available for websites
delivered via HTTPS, and may only be called from the top-level browsing context.

### Transparency

There is no indication if handwriting recognition is active. To prevent fingerprinting, the browser
implements countermeasures, such as displaying a permission prompt to the user when it detects
possible abuse.

### Permission persistence

The Handwriting Recognition API currently does not show any permissions prompts. Thus, permission
does not need to be persisted in any way.

## Feedback

The Chromium team wants to hear about your experiences with the Handwriting Recognition API.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `Blink>Handwriting` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Handwriting Recognition API? Your public support helps the Chromium team
prioritize features and shows other browser vendors how critical it is to support them.

Share how you plan to use it on the [WICG Discourse thread][wicg-discourse]. Send a tweet to
[@ChromiumDev][cr-dev-twitter] using the hashtag
[`#HandwritingRecognition`](https://twitter.com/search?q=%23HandwritingRecognition&src=recent_search_click&f=live)
and let us know where and how you're using it.

## Helpful Links

- [Explainer][explainer]
- [GitHub repo][github]
- [ChromeStatus](https://www.chromestatus.com/features/5263213807534080)
- [Chromium bug](https://crbug.com/1207667)
- [TAG review](https://github.com/w3ctag/design-reviews/issues/591)
- [Intent to Prototype][i2p]
- [WebKit-Dev thread](https://lists.webkit.org/pipermail/webkit-dev/2021-March/031762.html)
- [Mozilla standards position](https://github.com/mozilla/standards-positions/issues/507)

## Acknowledgements

This article was reviewed by [Joe Medley], Honglin Yu and Jiewei Qian. Hero image by
[Samir Bouaked](https://unsplash.com/@sbouaked) on
[Unsplash](https://unsplash.com/photos/MFvflDBZdyM).

[explainer]: https://github.com/WICG/handwriting-recognition/blob/main/explainer.md
[github]: https://github.com/WICG/handwriting-recognition
[issues]: https://github.com/WICG/handwriting-recognition/issues
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[wicg-discourse]: https://discourse.wicg.io/t/proposal-handwriting-recognition-api/4935
[i2p]: https://groups.google.com/a/chromium.org/g/blink-dev/c/VXUq1UY4m7Y
[joe medley]: https://github.com/jpmedley
[ot]: https://developer.chrome.com/origintrials/#/view_trial/3207688834594635777
