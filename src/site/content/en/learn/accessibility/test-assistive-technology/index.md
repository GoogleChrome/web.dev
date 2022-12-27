---
title: 'Assistive Technology testing'
authors:
  - cariefisher
description: How to test with Assistive Technology (AT).
date: 2023-01-06
tags:
  - accessibility
---

{% Aside %}
This module is a continuation of the previous two testing modules, [automated accessibility testing](/learn/accessibility/automated-test/) and [manual accessibility testing](/learn/accessibility/manual-test/). If you have not gone through the exercises in those modules yet, we encourage you to do so, as this module starts where they left off.
{% endAside %}

This module focuses on using assistive technology (AT) for accessibility testing. A person with disabilities can use AT to help increase, maintain, or improve the capabilities of performing a task.

In the digital space, ATs can be:

* No/Low-tech: head/mouth sticks, hand-held magnifiers, devices with large buttons
* High-tech: voice-activated devices, eye-tracking devices, adaptive keyboards/mice
* Hardware: switch buttons, ergonomic keyboards, auto-refreshing Braille device
* Software: text-to-speech programs, live captions, screen readers

We encourage you to use multiple types of ATs in your overall testing workflow.

## Screen reader testing basics

In this module, we focus on one of the most popular digital ATs, screen readers. A screen reader is a piece of software that reads the underlying code of a website or app. It then converts that information into speech or Braille output for the user.

Screen readers are essential for people who are blind and deafblind, but they also could benefit people with low-vision, reading disorders, or cognitive disabilities.

### Browser compatibility

There are multiple screen reader options available. The [most popular screen readers](https://webaim.org/projects/screenreadersurvey9) today are JAWS, NVDA, and VoiceOver for desktop computers and VoiceOver and Talkback for mobile devices.

Depending on your operating system (OS), favorite browser, and what device you are using it on, one screen reader may stand out as the best option. Most screen readers are  built with specific hardware and web browsers in mind. When you use a screen reader with a browser it was not calibrated for, you may encounter more "bugs" or unexpected behavior. Screen readers work best when used in the following combinations. 

<div class="table-wrapper scrollbar">
  <table>
    <thead>
          <tr>
        <th>Screen reader</th>
        <th>OS</th>
        <th>Browser compatibility</th>
          </tr>
    </thead>
    <tbody>
          <tr>
             <td><a href="https://www.freedomscientific.com/products/software/jaws">Job Access With Speech (JAWS)</a></td>
             <td>Windows</td>
             <td>Chrome, Firefox, Edge</td>
          </tr>
          <tr>
             <td><a href="https://www.nvaccess.org">Non-Visual Desktop Access (NVDA)</a></td>
             <td>Windows</td>
             <td>Chrome and Firefox</td>
          </tr>
          <tr>
             <td><a href="https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1">Narrator</a></td>
             <td>Windows</td>
             <td>Edge</td>
          </tr>
          <tr>
             <td><a href="https://support.apple.com/guide/voiceover-guide/welcome/web">VoiceOver</a></td>
             <td>macOS</td>
             <td>Safari</td>
          </tr>
          <tr>
             <td><a href="https://help.gnome.org/users/orca/stable/index.html.en">Orca</a></td>
             <td>Linux</td>
             <td>Firefox</td>
          </tr>
          <tr>
             <td><a href="https://support.google.com/accessibility/android/answer/6283677">TalkBack</a></td>
             <td>Android</td>
             <td>Chrome and Firefox</td>
          </tr>
          <tr>
             <td><a href="https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios">VoiceOver (for mobile)</a></td>
             <td>iOS</td>
             <td>Safari</td>
          </tr>
          <tr>
             <td><a href="https://support.google.com/chromebook/answer/7031755">ChromeVox</a></td>
             <td>ChromeOS</td>
             <td>Chrome</td>
          </tr>
    </tbody>
  </table>
</div>

### Screen reader commands 

Once you have the proper set-up for your screen reader software for your desktop or mobile device, you should look at the screen reader documentation (linked in the table above) and run through some [essential screen reader commands](https://dequeuniversity.com/screenreaders) to get yourself familiar with the technology. If you have used a screen reader before, consider trying out a new one!

When using a screen reader for accessibility testing, your goal is to detect problems in your code which interfere with the usage of your website or app, not to emulate the experience of a screen reader user. As such, there is a lot you can do with some foundational knowledge, a few screen reader commands, and a bit—or a lot—of practice.

If you need to further understand the user experience of people using screen readers and other ATs, you can hire many organizations and individuals to gain this valuable insight. Remember that using an AT to test code against a set of rules and asking users about their experience often yields different results. Both are important aspects to create fully inclusive products.

#### Key commands for desktop screen readers

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Element</th>
        <th>NVDA (Windows)</th>
        <th>VoiceOver (macOS)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
         <td>Command</td>
        <td>Insert (NVDA key)</td>
        <td>Control + Option (VO key)</td>
      </tr>
      <tr>
        <td>Stop audio</td>
        <td>Control</td>
        <td>Control</td>
      </tr>
      <tr>
        <td>Read next/prev
</td>
        <td>↓ or ↑
</td>
        <td>VO + → or ←
</td>
      </tr>
      <tr>
        <td>Start reading
</td>
        <td>NDVA + ↓
</td>
        <td>VO + A
</td>
      </tr>
      <tr>
        <td>Element List/Rotor
</td>
        <td>NVDA + F7
</td>
        <td>VO + U
</td>
      </tr>
      <tr>
        <td>Landmarks
</td>
        <td>D
</td>
        <td>VO + U
</td>
      </tr>
      <tr>
        <td>Headings
</td>
        <td>H
</td>
        <td>VO + Command + H
</td>
      </tr>
      <tr>
        <td>Links
</td>
        <td>K
</td>
        <td>VO + Command + L
</td>
      </tr>
      <tr>
        <td>Form controls
</td>
        <td>F
</td>
        <td>VO + Command + J
</td>
      </tr>
      <tr>
        <td>Tables
</td>
        <td>T
</td>
        <td>VO + Command + T
</td>
      </tr>
      <tr>
        <td>Within Tables
</td>
        <td>NDVA + Alt + ↓ ↑ ← → 
</td>
        <td>VO + ↓ ↑ ← →
</td>
      </tr>
    </tbody>
  </table>
</div>

#### Key commands for mobile screen readers

<div class="table-wrapper scrollbar">
  <table>
    <thead>
          <tr>
        <th>Element</th>
        <th>TalkBack (Android)</th>
        <th>VoiceOver (iOS)</th>
          </tr>
    </thead>
    <tbody>
      <tr>
        <td>Explore</td>
        <td>Drag one finger around the screen</td>
        <td>Drag one finger around the screen</td>
      </tr>
      <tr>
        <td>Select or activate</td>
        <td>Double tap</td>
        <td>Double tap</td>
      </tr>
      <tr>
        <td>Move up/down</td>
        <td>Swipe up or down with two fingers</td>
        <td>Swipe up or down with three fingers</td>
      </tr>
      <tr>
        <td>Change pages</td>
        <td>Swipe left or right with two fingers</td>
        <td>Swipe left/right with three fingers</td>
      </tr>
      <tr>
        <td>Next/previous</td>
        <td>Swipe left/right with one finger</td>
        <td>Swipe left/right with one finger</td>
      </tr>
    </tbody>
  </table>
</div>

## Screen reader testing demo

To test our demo, we used a Safari on a laptop running MacOS and capture sound. You can walk through these steps using any screen reader, but the way you encounter some errors may be different from how its described in this module.

### Step 1

Visit the updated [CodePen demo](https://codepen.io/cariefisher/pen/ExpxRmw), which has all the automated and manual accessibility updates applied. View it in [debug mode](https://blog.codepen.io/documentation/debug-view/#getting-to-debug-view-3). This is important, as it removes the `<iframe>` which surrounds the demo webpage, which may interfere with some testing tools.

### Step 2

Activate the screen reader of your choice and go to the demo page. You may consider navigating through the entire page from top to bottom before focusing on specific issues. 

#### Issue 1: Content structure {: #content-structure}

Headings and landmarks are one of the primary ways people navigate using screen readers. If these are not present, a screen reader user has to read the entire page to understand the context. This can take a lot of time and cause frustration. If you try to navigate by either element in the demo, you will quickly discover that they do not exist.

* Landmark example: `<div class="main">...</div>`
* Heading example: `<p class="h1">Join the Club</p>`

If you have updated everything correctly, there should not be any visual changes, but your screen reader experience will have dramatically improved.

<span class="solution" style="display:block;font-weight:strong;">
  <figure data-float="left">
    {% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/dNzbda0Lx1XUeCadVLMH.svg", alt="", width="28", height="28"%}
  </figure> <strong>Let's fix it.</strong>
</span>

Some inaccessible elements can't be observed by just looking at the site. You may remember the importance of heading levels and semantic HTML from the [Content structure](/learn/accessibility/structure) module. A piece of content may look like a heading, but the content is actually wrapped in a stylized `<div>`. 

To fix the issue with headings and landmarks, you must first identify each element that should be marked up as such and update the related HTML. Be sure to update the related CSS as well.

Landmark example: `<main>...</main>`

Heading example: `<h1>Join the Club</h1>`

If you have updated everything correctly, there should not be any visual changes, but your screen reader experience will have dramatically improved.

