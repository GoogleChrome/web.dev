---
title: 'Video and audio'
authors:
  - cariefisher
description: How to create accessible video and audio.
date: 2022-10-26
tags:
  - accessibility
---

Have you ever wanted to watch a live event but couldn't find your headphones,
so you turned on the captions? Or maybe you didn't quite catch the last few
talking points from your favorite podcast, so you decided to read the
transcript instead? If so, you probably understand the importance and
convenience of having alternative ways to access audio and video content. 

While your role at your company or organization may not require you to create
audio and video content directly, it is important to know the basics of
[accessibility requirements for media](https://www.w3.org/WAI/WCAG21/Understanding/time-based-media).
This knowledge will help you design and build the appropriate layouts and
features to accommodate users with different environmental and sensory needs,
like the millions of people with hearing loss or visual impairments worldwide.

## Alternative media types

Alternative media types were developed to support the media needs of people
with disabilities. This gives people additional formats to choose from when
accessing audio and video content.

The [alternative media types you must include](https://www.w3.org/WAI/media/av/planning/#wcag-standard) with your media files depend on:

* The type of media you are supporting—audio-only, video-only, or video with audio (multimedia) formats
* Whether the media is live or pre-recorded
* The version and level of WCAG compliance you are targeting
* Any additional media-related user needs

When it comes to [creating accessible audio and video content](https://www.w3.org/WAI/media/av/) for websites and apps, there are four main types of alternative media types: [captions](#captions), [transcripts](#transcripts), [audio descriptions](#audio-descriptions), and [sign language interpretation](#sign-language-interpretation).

## Captions

One of the most widely used alternative media types are
[captions](https://www.w3.org/WAI/media/av/captions/). Captions are written
text synchronized with multimedia content for people who cannot hear or
understand spoken words. They are presented in the same language as the main
audio track and include important non-speech information, such as sound
effects, background noises, and essential music. 

Captions benefit people who are deaf, hard of hearing, and have cognitive disabilities but are useful to many other people as well.

Captions come in two forms—open or closed. 

* Closed captions (CC) are text on top of a video that can be turned on or off
  by the viewer and, depending on the media player, styled in a way that fits
  the user's needs.
* Open captions (OC) are text burned into the video and cannot be turned off or
  styled differently. 

One method might be preferable, depending on the situation or how the
multimedia will be consumed.

People often confuse captions with subtitles, but they are not synonymous. Both
are text synchronized with multimedia content, often appearing at the bottom of
the media. Captions can be thought of as a transcription of dialogue and other
essential sounds for people with disabilities. Subtitles are visual text for
people who can hear the audio track but may not understand what was said, like
when watching a foreign language film.

{% Aside %}
There are some geographical differences in what are considered captions and
subtitles, so be sure to check the terminology in your location.
{% endAside %}

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Features</th>
        <th>Subtitles</th>
        <th>Closed captions</th>
        <th>Open captions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Visual text matches audio track</td>
        <td>No</td>
        <td>Yes</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td>Includes essential background sounds</td>
        <td>No</td>
        <td>Yes</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td>Ability to toggle on/off</td>
        <td>Yes</td>
        <td>Yes</td>
        <td>No</td>
      </tr>
    </tbody>
  </table>
</div>

Check out an example of captions in this video, _Google — A CODA Story_. Toggle the CC button to on to see the closed captions on this video.

{% YouTube "pXc_w49fsmI" %}

{% Details %}
{% DetailsSummary %}
Compare screenshots from this video, with and without captions.
{% endDetailsSummary %}
<div class="switcher">
<figure class="screenshot">
{% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/5gUlKnnfGwqP3SrG2oJa.png", alt="Video with captions.", width="800", height="450" %}
</figure>
<figure class="screenshot">
{% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/bfDTwxctgjbPpxqtLwsV.png", alt="Video without captions.", width="800", height="450" %}
</figure>
</div>
{% endDetails %}

## Transcripts

Close cousins to captions,
[transcripts](https://www.w3.org/WAI/media/av/transcripts/) are detailed
text-based documents that capture all essential words, sounds, and important
visual information in your media. Transcripts primarily help people who are
hard of hearing and deaf, and descriptive transcripts help people who are
deafblind. 

Transcripts are also great for people with cognitive disabilities or for people
who want to review the content at their own speed.

While transcripts are typically more detailed than captions, they are very
similar in format and purpose. They are so similar that many people first add
captions to their media, export them, and then use them as the foundation of
their transcripts. Repurposing your captions to build your transcripts saves
time versus creating everything from scratch.

Search bots cannot access your captions but can crawl your text transcripts.
When you include transcripts with your media files, your search engine
optimization (SEO) gets a boost. It is one of those rare exceptions when
duplicate content is not confusing to users nor penalized by search engine
algorithms.

Every media player handles transcripts in a different way. Some providers may
not have that functionality built into their media player, and even when they
do, some users may not be able to access the transcript interface. One way to
be sure you've made your transcript available to all is to include it in a
section or download it on the same page, or linked out to a new page in your
introduction to the video.

<figure>
{% YouTube "SlGuvC5nnTA" %}
<figcaption>In _Password Problems? | There's no place like Chrome_, you can review an example of a transcript.</figcaption>
</figure>

{% Aside %}
Under the video title, press the "more" icon with three horizontal dots and
select **Show transcript** from the dropdown menu. The transcripts will show up
to the right or bottom of the video, depending on your screen size.
{% endAside %}

## Audio descriptions

Another alternative media used to support people with disabilities are
[audio descriptions](https://www.w3.org/WAI/media/av/description/). This type
of alternative media utilizes a narrator to explain important visual
information to people who cannot see the visual content. These descriptions
include nonverbal information such as facial expressions, unspoken actions, and
the background environment in video-only and multimedia content.

Sometimes audio descriptions need to be very detailed due to the large amounts
of information that needs to be shared with the viewer. If there are not enough
natural pauses in the video for audio descriptions, extended audio descriptions
are used. In extended audio descriptions, a video will pause to give a narrator
enough time to convey all the information in the media before playing the rest
of the video.

Audio descriptions and extended audio descriptions help people who are blind or
have low vision but could help people with some cognitive disorders as well.

<figure>
{% YouTube "fNq5jWyEeWo" %}
<figcaption>Here’s an example titled _`[Audio Described]` Get started with Lookout from Google | Android_.</figcaption>
</figure>

## Sign language interpretation

Another major alternative media type you may encounter is [sign language
interpretation](https://www.w3.org/WAI/media/av/sign-languages/), where you add
an interpreter to narrate the auditory portion of the audio-only or multimedia
content using sign language. This is very important for many people who are
deaf, as sign language is their first and most fluent language. 

Sign language interpretation is often more expressive and detailed than written
documents, providing a much richer experience than captions or transcripts
alone.

That said, sign language interpretation can be time-consuming and
cost-prohibitive to many organizations. And even if you have the time and
budget to add sign language interpretation to your media, there are
[over 300 different sign languages](https://en.wikipedia.org/wiki/List_of_sign_languages)
worldwide. Adding one sign language interpretation to your media would not be
enough if you need to support a global audience.

<figure>
{% YouTube "MbHuSHGZf5U?t=33" %}
<figcaption>
  See how sign language interpreters narrated the story of Google
  Sustainability, in the video Google Presents: Search On '22.
</figcaption>
</figure>
