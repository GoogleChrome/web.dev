---
title: YouTube enhances UX with Media Capabilities Web API
subhead: Learn how Media Capabilities helped YouTube.
authors:
  - beaufortfrancois
date: 2019-06-05
hero: hero.jpeg
hero_position: top
alt: Youtube application screengrab
description: |
  In an experiment with the Media Capabilities API, YouTube saw a 7.1% increase
  in MTBR with only a 0.4% decrease in average resolution of videos served. 
tags:
  - post # post is a required tag for the article to show up in the blog.
  - media
  - ux
---

In an experiment with the Media Capabilities API, YouTube saw a 7.1% increase in
MTBR with only a 0.4% decrease in average resolution of videos served. 

{% Aside 'key-term' %}
MTBR (Mean Time Between Rebuffers) is total play time divided by the number of
rebuffering events.
{% endAside %}

## The Problem

Typically, media sites will have several variants that they can present users,
encoded in different frame rates, resolutions, and codecs. Until recently, while
choosing which variant to play for an individual user, web developers had to
rely solely on `isTypeSupported()` or `canPlayType()` to determine whether each
variant could be played in that user’s browser. While this told the developer
whether media could be played at all, it didn’t provide an indication of
playback quality, such as whether the media playback would experience frame
drops or rapidly drain the device’s battery. In the absence of this signal,
developers either had to create their own heuristics, or just assume that if a
device could playback a codec/resolution combination, it could do so smoothly
and power efficiently. For users with less capable devices, this often led to a
very poor experience.

## The Solution

The [Media Capabilities](https://wicg.github.io/media-capabilities/) API allows
websites to get more information about the client’s video decode performance and
make an informed decision about which codec and resolution to deliver to the
user. Specifically, the API provides the developer with an estimate of
smoothness and power efficiency of a particular codec and resolution
combination. This allows the developer to avoid scenarios where the client is
likely to have a poor playback experience.

In Chrome, the Media Capabilities API uses metrics from previous playbacks to
predict whether future playbacks in the same codec and at the same resolution
will be smoothly decoded.

## YouTube Case Study

YouTube used the [Media
Capabilities](https://wicg.github.io/media-capabilities/) API to prevent their
adaptive bitrate algorithm from automatically selecting resolutions that a
device could not playback smoothly.

Users who were part of the experimental group collectively saw less frequent
rebuffers (the meantime between rebuffers, or MTBR, increased by 7.1%) while the
average resolution, measured by video height, served to the aggregate group only
declined by 0.4%. The substantial increase in the MTBR with the small
corresponding reduction in average resolution indicates that this change
significantly improved quality for a small subset of users who previously had a
poor experience.

## Implementing Media Capabilities API on your site

{% Aside 'codelab' %}
[Decoding info sample](https://googlechrome.github.io/samples/media-capabilities/decoding-info.html)
{% endAside %}
