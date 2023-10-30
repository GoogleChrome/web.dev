---
title: 'Patterns, components, and design systems'
authors:
  - cariefisher
description: >
  Evaluate patterns, components, and design systems for accessibility.
date: 2022-12-05
tags:
  - accessibility
---

Many people use component-driven development using pattern style guides, component libraries, or full design systems in their
development workflow process. Even if you have not used these tools formally, it's likely you use a similar process to break up a
large design for a website, app, or other digital product into manageable pieces.

Like building a physical structure, it's important to build one piece at a time. First, the foundation, the structure, walls,
windows, roof, and everything in between. Component-driven development tools allow us to do this for websites, apps, and other digital products.

Some perks to component-driven development include breaking things down into
manageable pieces, so there is less development time with these reusable
components. It allows designers, frontend and backend developers, and QA to
work simultaneously. And clients, designers, PMs, and more, like it because
they can preview the build process and use a living style guide as a reference
after the website has launched.

However, when we look at patterns, components, and design systems with accessibility in mind, some questions arise. How do you know
which patterns are best when it comes to accessibility? Should you use an established pattern/library or create new ones? How do
you know if these patterns will actually help your users?

With the myriad of choices available, it's easy to quickly become confused about this topic. This module aims to give you general
information on how to evaluate patterns, components, and design systems for accessibility and gives you a starting point to help you make
more accessible choices.

## Think critically

Choosing an accessible pattern, component, or design system is not rocket
science, but it does take time and critical thinking. In fact, there's no such thing as "one perfect pattern," but there may potentially be many options that could work. It's about learning to choose the best option for your unique situation.

In the subsequent testing modules, you will learn more about the techniques and methods on how to evaluate patterns, components, and
design systems for accessibility. But before that stage, you need to step back and ask yourself some fundamental questions, such as:

* Does an established accessible pattern, component, or design system already exist?
* What browsers and assistive technology (AT) am I supporting?
* Are there any code/framework limitations or other integrations/factors/user needs I need to consider?

Depending on your dev environment and user needs, you may have additional or different questions from these. Consider
these questions as your starting point in your accessibility evaluation.

## Established resources

Before building something brand new, do your due diligence and review what already exists in terms of accessible patterns,
components, and design systems. With just a little research, you might be surprised to find a solution—or multiple—that fits your needs.

Some great resources for accessible patterns, components, and design systems include:

* [Accessible Components](https://github.com/scottaohara/accessible_components)
* [Deque University ARIA library](https://dequeuniversity.com/library)
* [Gov.UK Design System](https://design-system.service.gov.uk/components/)
* [Inclusive Components](https://inclusive-components.design/)
* [MagentaA11y](https://www.magentaa11y.com/)
* [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/components/overview/), created for the U.S. federal government
* [List of accessible patterns from Smashing Magazine](https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-289/)

For JavaScript frameworks, the following resources are fairly accessible out of
the box or are easy to customize for accessibility:

* [When CSS Isn't Enough: JavaScript Requirements For Accessible Components](https://www.smashingmagazine.com/2021/06/css-javascript-requirements-accessible-components/)
* React
  * [ReachUI](https://reach.tech/)
  * [Reakit](https://reakit.io/)
  * [Chakra](https://chakra-ui.com/)
* Angular: [Material library](https://material.angular.io/cdk/a11y/overview)
* Vue: [Vuetensils](https://vuetensils.com/)

However—and this cannot be stressed enough—you should never just copy/paste
code and assume it will fit within your environment and automatically meet your
user needs. This is true of all patterns, components, and design systems, even
if labeled as fully accessible.

All resources should be seen as a starting point. Be sure to test everything!

## Browsers and assistive technology (AT) support

After researching a few base patterns, components, or a full design system that
might work for your dev environment, you can move on to assistive technology
support. One major type of AT you will want to focus on when evaluating
patterns, components, and design systems is screen readers.

Screen readers were built with specific browsers in mind and will work best
when paired with these browsers. We'll go into this topic in much more detail
in the module on AT testing, but for pattern evaluation purposes, it is helpful
to understand these combinations exist, so you know what you need in terms of
support.

<div class="table-wrapper with-heading-tint">
<table>
<thead>
  <tr>
    <th>Screen reader</th>
    <th>OS</th>
    <th>Browser compatibility</th>
    <th>Cost</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Job Access with Speech (JAWS)</td>
    <td>Windows</td>
    <td>Chrome, Firefox, Edge</td>
    <td>License require (a free 40-min version exists)</td>
  </tr>
  <tr>
    <td>Non-Visual Desktop Access (NVDA)</td>
    <td>Windows</td>
    <td>Chrome and Firefox</td>
    <td>Free (requires download)</td>
  </tr>
  <tr>
    <td>Narrator</td>
    <td>Windows</td>
    <td>Edge</td>
    <td>Free (built into Windows machines)</td>
  </tr>
  <tr>
    <td>VoiceOver</td>
    <td>macOS</td>
    <td>Safari</td>
    <td>Free (built into macOS machines)</td>
  </tr>
  <tr>
    <td>Orca</td>
    <td>Linux</td>
    <td>Firefox</td>
    <td>Free (built into Gnome-based distributions)</td>
  </tr>
  <tr>
    <td>TalkBack</td>
    <td>Android</td>
    <td>Chrome and Firefox</td>
    <td>Free (built into certain versions of Android OS)</td>
  </tr>
  <tr>
    <td>VoiceOver</td>
    <td>iOS</td>
    <td>Safari</td>
    <td>Free (built into iOS devices)</td>
  </tr>
</tbody>
</table>
</div>

Browser support is generally complicated, and things get even trickier when you add AT devices and ARIA specifications to the mix.

But it's not all bad news. Thankfully, great resources such as [HTML5 Accessibility](https://stevefaulkner.github.io/HTML5accessibility),
[Accessibility Support](https://a11ysupport.io), and WCAG's [Custom Control Accessible Development Checklist](https://w3c.github.io/using-aria/#checklist)
help us to better understand current browser and AT device support, and even when to use ARIA in the first place.

These resources outline the different HTML and ARIA pattern sub-elements available, including open-source community tests.
You can also review some pattern examples—for both desktop and mobile browsers/AT devices. As such, these resources can help
you make a more accessible decision regarding patterns, components, and design systems that you may want to use.

### Other considerations

Once you have chosen a few accessible base patterns or components, and factored
in browser and AT device support, you can move on to more specific contextual
questions about the pattern, component, design system, and dev environment.

For example, if you are working in a management system (CMS) or have legacy
code, there may be some limitations to which patterns you can use. Upon review,
several pattern choices may quickly be cut to one or two options.

Many JavaScript frameworks allow developers to use almost any pattern they
choose. In cases like these, you may have fewer restrictions and can choose the
most accessible pattern option.

There are additional considerations to weigh when choosing a pattern,
component, or design system, such as:

* Performance
* Security
* Search engine optimization
* Language translation support
* Third-party integrations

These factors will undoubtedly play into your pattern choice, but you should
also consider the people creating the content and code itself. The pattern you
choose must be robust enough to handle any potential limitations around
editor-generated or user-generated content, plus be built in a way that
developers of all accessibility knowledge can use.

{% Assessment 'patterns' %}
