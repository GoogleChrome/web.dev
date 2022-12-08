---
layout: post
title: What is accessibility?
authors:
  - robdodson
date: 2018-11-18
description: |
  An accessible site is one whose content can be accessed regardless of any
  user's impairments, and whose functionality can also be operated by the most
  diverse range of users possible.
---

{% Aside 'update' %}
In 2022, we published [Learn Accessibility!](/learn/accessibility/) for beginner and advanced web developers. You can go through the series for a general understanding of accessibility practices and testing, or you can use it as a reference for specific subjects.

If you're interested in this topic, we recommend [What is digital accessibility, and why does it matter?](/learn/accessibility/why/)
{% endAside %}

An accessible site is one whose content can be accessed regardless of any user's
impairments and whose functionality can also be operated by the most diverse
range of users possible.

As developers, it's easy to assume that all users can see and use a keyboard,
mouse, or touch screen to interact with your page. This can lead to an
experience that works well for some people but creates issues for others that
range from simple annoyances to complete blockers.

## Understanding the diverse needs of your users

When learning about accessibility, it helps to have an understanding of the
diverse range of users in the world and the kinds of accessibility topics that
affect them. To explain further, here's an informative video from Victor Tsaran,
a Technical Program Manager at Google.

{% YouTube 'RHIVx4m8V4M' %}

Generally speaking, accessibility concerns can be split into four broad
categories:

- Vision
- Motor/dexterity
- Auditory
- Cognitive

Planning for accessibility means thinking about users who are experiencing some
type of impairment or disability in one or more of these categories. Bear
in mind that that experience might be non-physical or temporary—for instance,
trying to read a screen outside during a bright, sunny day or operating a
device one-handed while carrying a cup of coffee.

When you plan for these situations upfront, you end up with an experience that
is more robust and works for more users regardless of their ability or
context.

### Vision

Vision impairments range from limited or low vision to complete blindness. Users
with low vision may use a combination of screen magnification, high contrast
themes, and text-to-speech to access content. Some users may rely on a screen
reader or braille display to navigate a page, perform actions, and read
descriptions of content and controls.

### Motor/dexterity

Motor and dexterity impairments may affect a user's ability to use a mouse,
touchscreen, or other pointing device. Some users may rely on alternative input
devices to access content. These devices might include a keyboard, head- or
eye-tracking software, switch devices, sip-and-puff devices, or voice access.

### Auditory

Auditory impairments range from difficulty hearing certain frequencies, to
speech processing issues, to a total inability to hear sound. Users
experiencing an auditory impairment may rely on captions or transcripts to
provide an alternative to sound in an interface.

### Cognitive

Cognitive impairment is a broad category, encompassing topics such as ADHD,
dyslexia, and autism, just to name a few. The accommodations for these users are
quite diverse, but generally speaking, users may seek to minimize distractions,
flashing, heavy animations, and anything which shifts the user's context around
the page in an unexpected way. Users may also use custom colors and styles to
improve readability or prevent headaches.

## Next steps

Now that you have a high level understanding of accessibility, it's time to dive
in to more specific details, starting with keyboard access.

{% Aside 'codelab' %}
Check out [Keyboard focus](/learn/accessibility/focus/) to understand and enhance keyboard navigation order and style.
{% endAside %}
