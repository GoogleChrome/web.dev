---
title: Announcing Squoosh v2
subhead: New codecs support, updated design, and CLI support!
description: |
  New codecs support, updated design, and CLI support!
date: 2020-12-09
authors:
  - kosamari
hero: image/admin/T6HOx3Tl5ns0H9sTolsh.jpg
thumbnail: image/admin/NybFYj3T4ZRfNOzNoH5A.jpg
alt: A screen capture of the new Squoosh homepage
tags:
  - blog
  - tools
  - javascript
  - images
---



[Squoosh](https://squoosh.app) is an image compression app our team built and [debuted at Chrome 
Dev Summit 2018](https://youtu.be/ipNW6lJHVEs). We built it to make it easy to experiment with 
different image codecs, and to showcase the capabilities of the modern web.  

Today, we are releasing a major update to the app with more codecs support, a new design, and a 
new way to use Squoosh on your command line called Squoosh CLI.


## New codecs support

We now support OxiPNG, MozJPEG, WebP, and AVIF, in addition to codecs natively supported in your 
browser.  A new codec was made possible again with the use of WebAssembly. By compiling a codec 
encoder and decoder as WebAssembly module users can access and experiment with newer codecs even 
if their preferred browser does not support them. 

## Launching a command line Squoosh!

Ever since the original launch in 2018, common user request was to interact with Squoosh 
programmatically without UI. We felt a bit conflicted about this path since our app was a UI on 
top of command-line-based codec tools. However we do understand the desire to interact with the 
whole package of codecs instead of multiple tools. Squoosh CLI does just that.

{% YouTube 'FUqn8eOxCP4' %}

You can install the beta version of the Squoosh CLI by running `npm -i @squoosh/cli` or run it 
directly using `npx @squoosh/cli [parameters]`.

The Squoosh CLI is written in Node and makes use of the exact same WebAssembly modules the PWA 
uses. Through extensive use of workers, all images are decoded, processed and encoded in parallel. 
We also use Rollup to bundle everything into one JavaScript file to make sure installation via 
`npx` is quick and seamless. The CLI also offers auto compression, where it tries to reduce the 
quality of an image as much as possible without degrading the visual fidelity 
(using the [Butteraugli metric](https://github.com/google/butteraugli)). 

With the Squoosh CLI you can compress the images in your web app to multiple formats and use the 
[`<picture>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) 
to let the browser choose the best version. We also plan to build 
plugins for Webpack, Rollup, and other build tools to make image compression
an automatic part of your build process.

## Build process change from Webpack to Rollup

The same team that built Squoosh has spent a significant amount of time looking at build tooling 
this year for [Tooling Report](https://bundlers.tooling.report/), and decided to switch our build 
process from Webpack to Rollup.

The project was initially started with Webpack because we wanted to try it as a team, and at the 
time in 2018 Webpack was the only tool that gave us enough control to set up the project the way 
we wanted. Over time, we've found Rollup's easy plugin system and simplicity with ESM made it a 
natural choice for this project. 


## Updated UI design 

We've also updated the UI design of the app featuring `blobs` as a visual element.  It is a little 
pun on how we treat data in our code. Squoosh passes image data around as a blob, so it felt 
natural to include some blobs in the design (get it?).

Color usage was honed in as well, so that color was more than an accent but additionally a vector 
to distinguish and reinforce which image is in context for the options. All in all, the homepage 
is a bit more vibrant and the tool itself is a bit more clear and concise.


## What's next ? 

We plan to keep working on Squoosh. As the new image format gets released, we want our users to 
have a place where they can play with the codec without heavy lifting. We also hope to expand use 
of Squoosh CLI and integrate more into the build process of a web application. 

Squoosh has always been open source but we've never had focus on growing the community. In 2021, 
we plan to expand our contributor base and have a better onboarding process to the project. 

Do you have any ideas for Squoosh? Please let us know on our
[issue tracker](https://github.com/GoogleChromeLabs/squoosh/issues).
The team is headed to extended winter vacation but we promise to get
back to you in the new year.
