---
title: Profiling Web Audio apps in Chrome
subhead: >
  Learn how to profile the performance of Web Audio apps in Chrome using
  `about://tracing` and the **WebAudio** extension in Chrome DevTools.
description: >
  Learn how to profile the performance of Web Audio apps in Chrome using
  `about://tracing` and the **WebAudio** extension in Chrome DevTools.
date: 2020-05-04
updated: 2022-06-02
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - audio
  - performance
authors:
  - hongchanchoi
hero: image/admin/uXHdcVy0A8BFAdNr8bXu.jpg
alt: Artistic image of microphone and pop filter
---

You reached this article probably because you're developing an app that uses the
[Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) 
and experienced unexpected glitches such as popping noises from
the output, or you are hearing something unexpected. You might already be
involved in a [crbug.com](https://crbug.com) discussion and a Chrome engineer
asked you to upload "tracing data" or look into the graph visualization. This
article shows how to obtain the relevant information so we can understand a
problem and eventually fix the underlying issue.

## Web Audio profiling tools

There are two tools that will help you when profiling Web Audio,
`about://tracing` and the **WebAudio** extension in Chrome DevTools.

### When do you use `about://tracing`?

When mysterious "glitches" happen. Profiling the app with the tracing tools
gives you insights on:

* **Time slices spent by specific function calls** on different threads
* **Audio callback timing** in the timeline view

It usually shows missed audio callback deadlines or big garbage collection that
might cause unexpected audio glitches. This information is useful for
understanding an underlying problem, so Chromium engineers will often ask it
especially when the local reproduction is not feasible. The general
instructions for tracing are available [here](chromium-tracing).

### When do you use Web Audio DevTools extension?

When you want to visualize the audio graph and monitor how the audio renderer
performs in real time. The audio graph, a network of `AudioNode` objects to
generate and synthesize an audio stream, often gets complex but the graph
topology is opaque by design. (The Web Audio API doesn’t have features for
node/graph introspection.) Some changes happen in your graph and now you hear
silence. Then it’s time for debugging by listening. It is never easy, and it
becomes more difficult when you have a bigger audio graph. The Web Audio
DevTools extension can help you by visualizing the graph.

With this extension, you can monitor a running estimate of render capacity,
which indicates how the web audio renderer performs over a given render budget
(e.g. approximately 2.67ms @ 48KHz). If the capacity goes near 100 percent, that
means your app is likely to produce glitches because the renderer is failing to
finish the work in the given budget.

## Use `about://tracing`

### How to capture tracing data

*The instructions below written are for Chrome 80 and later.*

For best results, close all other tabs and windows, and disable extensions.
Alternatively you can either [launch a new instance of Chrome][new-chrome-instance]
or use other builds from [different release channels][diff-channel] (e.g.
Beta or Canary). Once you have the browser ready, follow the steps below:

1. Open your application (web page) on a tab.
1. Open another tab and go to `about://tracing`.
1. Press the **Record** button and select **Manually select settings**.
1. Press the **None** buttons on both the **Record Categories** and
   **Disabled by Default Categories** sections.
1. In the **Record Categories** section, select the following:
    * `audio`
    * `blink_gc`
    * `media`
    * `v8.execute` (if you're interested in `AudioWorklet` JS code performance)
    * `webaudio`
1. In the **Disabled by Default Categories** section, select the following:
    * `audio-worklet` (if you're interested in where the `AudioWorklet` thread starts)
    * `webaudio.audionode` (if you need the detailed trace for each `AudioNode`)
1. Press the **Record** button at the bottom.
1. Go back to your application tab and redo the steps that triggered the issue.
1. When you have enough trace data, go back to the tracing tab and press **Stop**.
1. The tracing tab will visualize the result.

   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3GqKLXTP7XzFp6ADztc4.jpg", alt="Screen shot after tracing has completed.", width="800", height="525" %}

1. Press **Save** to save the tracing data.

### How to analyze tracing data

The tracing data visualizes how Chrome's web audio engine renders the audio.
The renderer has two different render modes: **Operating system mode** and
**Worklet mode**. Each mode uses a different threading model, so the tracing
results also differ.

#### Operating system mode

In operating system mode, the [`AudioOutputDevice`][cr-audio-output-device] thread runs
all the web audio code. The `AudioOutputDevice` is a real-time priority thread
originating from the browser's Audio Service that is driven by the audio
hardware clock. If you see irregularity from the trace data in this lane,
it means the callback timing from the device may be jittery. The combination
of Linux and Pulse Audio is known to have this problem. See the following Chromium issues
for more details: [#825823](https://crbug.com/825823),
[#864463](https://crbug.com/864463).

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Mf64zHw10phOMhU3gXsJ.jpg", alt="Screen shot of operating system mode tracing result.", width="800", height="398" %}

#### Worklet mode

In Worklet Mode, which is characterized by one thread jump from
`AudioOutputDevice` to the [`AudioWorklet` thread][cr-audio-worklet-thr], you
should see well-aligned traces in two thread lanes as shown below.  When the
worklet is activated all the web audio operations are rendered by the
`AudioWorklet` thread. This thread is currently not a real-time priority one.
The common irregularity here is a big block caused by the garbage collection
or missed render deadlines. Both cases lead to glitches in the audio stream.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2kSG5BoaXZ5CZIlVvIYI.png", alt="Screen shot of worklet mode tracing result.", width="800", height="449" %}

In both cases, the ideal tracing data is characterized by well-aligned audio
device callback invocations and render tasks being completed well within the
given render budget. The two screenshots above are great examples of the ideal
tracing data.

### Learning from real-world examples

#### Example 1: Render tasks going beyond render budget

The screenshot below ([Chromium issue #796330](https://crbug.com/796330)) is a
typical example of when code in `AudioWorkletProcessor` takes too long and
goes beyond a given render budget. The callback timing is well behaved but
the audio processing function call of the Web Audio API failed to complete the
work before the next device callback.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J3CkP24NupnqB1XDGH6w.png", alt="Diagram showing audio glitch due to render task overflowing budget.", width="734", height="362" %}

**Your options:**

* Reduce the workload of the audio graph by using fewer `AudioNode` instances.
* Reduce the workload of your code in the `AudioWorkletProcessor`.
* Increase the base latency of `AudioContext`.

#### Example 2: Significant garbage collection on the worklet thread

Unlike on the operating system audio rendering thread, garbage collection is managed
on the worklet thread. That means if your code does memory allocation/deallocation
(e.g. new arrays) it eventually triggers a garbage collection which
synchronously blocks the thread. If the workload of web audio operations and
garbage collection is bigger than a given render budget, it results in
glitches in the audio stream. The following screenshot is an extreme example of this
case.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ckdPwqnRtoHsRQkOVy8J.png", alt="Audio glitches caused by garbage collection.", width="800", height="334" %}

**Your options:**

* Allocate the memory up front and reuse it whenever possible.
* Use different design patterns based on `SharedArrayBuffer`. Although this
  is not a perfect solution, several web audio apps use a similar pattern with
  `SharedArrayBuffer` to run the intensive audio code. Examples:
  * [Audio Worklet Design Pattern][webfu-audio-worklet-dp]

#### Example 3: Jittery audio device callback from `AudioOutputDevice`

The precise timing of audio callback is the most important thing for web audio.
This should be the most precise clock in your system. If the operating system
or its audio subsystem cannot guarantee a solid callback timing, all the
subsequent operations will be affected. The following image is an example
of jittery audio callback. Compared to the previous two images, the interval
between each callback varies significantly.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1UN5udXOW56ooihw5M18.png", alt="Screen shot comparing unstable vs stable callback timing.", width="800", height="252" %}

**Your options:**

* Increase the system audio callback buffer size by adjusting the
  [`latencyHint`](https://webaudio.github.io/web-audio-api/#dom-audiocontextoptions-latencyhint)
  option.
* If you find a problem, [file an issue on crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EWebAudio) 
  with the tracing data.

## Use the Web Audio DevTools extension

You can also use the DevTools extension specifically designed for the Web Audio API.
Unlike the tracing tool, this provides real time inspection of graphs and
performance metrics.

This extension needs to be installed from the
[Chrome Web Store](https://chrome.google.com/webstore/detail/audion/cmhomipkklckpomafalojobppmmidlgl).

After the installation, you access the panel by opening Chrome DevTools and
clicking “Web Audio” on the top menu.

{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/JUXLwtX83TOXqRHD2CGU.png", alt="Screenshot showing how to open Web Audio panel in Chrome DevTools.", width="800", height="201" %}

The Web Audio panel has four components: context selector, property inspector,
graph visualizer, and performance monitor.

{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/4xQhLJBdDWW3X2nIssIS.png", alt="Screenshot of the Web Audio panel in Chrome DevTools.", width="800", height="416" %}

### Context Selector

Since a page can have multiple `BaseAudioContext` objects, this drop-down menu allows you
choosing the context you want to inspect. You can also manually trigger garbage
collection by clicking the trash can icon on the left. 

### Property Inspector

The side panel shows various properties of a user-selected context or
`AudioNode`. Inspecting dynamic values in `AudioParam` is not supported.

### Graph Visualizer

This view renders the current graph topology of a user-selected context. This
visualization changes dynamically in real time. By clicking an element in the
visualization, you can inspect the detailed information on the property
inspector.

### Performance Monitor

The status bar at the bottom is only active when the selected `BaseAudioContext`
is an `AudioContext`, which runs in real-time. This bar shows the instantaneous
audio stream quality of a selected `AudioContext` and is updated every second. It
provides the following information: 

* **Callback interval** (ms): Displays the weighted mean/variance of callback
  interval. Ideally the mean should be stable and the variance should be close
  to zero. If you see a large variance, it means that the system-level audio
  callback function has unstable timing that can lead to poor audio stream
  quality. (See example 3, above.)

* **Render Capacity** (percent): When the capacity gets close to 100 percent, it
  means that the renderer is doing too much for a given render budget, so you
  should consider doing less (e.g. using fewer `AudioNodes` objects in the
  graph).

You can manually trigger a garbage collector by clicking the trash can icon.

## Legacy WebAudio DevTools panel

The extension is now a recommended method by the Chrome Web Audio team, but the
legacy WebAudio DevTools panel is also available. You can access this panel by
clicking the "three dots" menu in the top right corner of DevTools, then going to
**More tools**, then **WebAudio**.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t2eX431PTio5oOFkmOtR.jpg", alt="Screen shot showing how to open WebAudio panel in Chrome DevTools.", width="800", height="423" %}

## Conclusion

Debugging audio is hard. Debugging audio in the browser is even harder. However,
these tools can ease the pain by providing you with useful insights on how the
web audio code performs. In some cases, however, you may find problems in Chrome
or the extension. Then do not be afraid to
[file a bug on crbug.com][cr-file-a-bug] or on the
[extension issue tracker](https://github.com/GoogleChrome/audion/issues).

Photo by Jonathan Velasquez on [Unsplash](https://unsplash.com/photos/c1ZN57GfDB0)

[cr-file-a-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EWebAudio
[webfu-audio-worklet-dp]: https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern#webaudio_powerhouse_audio_worklet_and_sharedarraybuffer
[aud-dev-client-proto]: https://github.com/GoogleChromeLabs/audio-device-client-prototype
[cr-audio-worklet-thr]: https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/modules/webaudio/audio_worklet_thread.h
[chromium-tracing]: https://www.chromium.org/developers/how-tos/trace-event-profiling-tool
[new-chrome-instance]: https://developer.chrome.com/devtools/docs/clean-testing-environment
[diff-channel]: https://www.chromium.org/getting-involved/dev-channel
[cr-audio-output-device]: https://source.chromium.org/chromium/chromium/src/+/master:media/audio/audio_output_device.h
