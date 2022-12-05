---
title: 'JavaScript'
authors:
  - cariefisher
description: Write accessible JavaScript.
date: 2022-12-05
tags:
  - accessibility
---

In the world of development today, JavaScript plays a major role in almost everything created—from smaller dynamic components
to full products running on a JavaScript framework, such as React or Angular.

This use (or overuse) of JavaScript has brought forward many alarming trends, such as long load times due to large amounts of code,
the use of non-semantic HTML elements, and the injection of HTML and CSS through JavaScript. And there’s confusion as to where accessibility
fits into each of these pieces.

JavaScript can have a huge impact on the accessibility of your site. In this module, we’ll share some general patterns for
accessibility that are enhanced by using JavaScript, as well as solutions for accessibility issues arising from using frameworks.

## Trigger events

JavaScript events allow users to interact with web content and perform a specific action. Many people, such as screen reader users,
people with fine-motor skill disabilities, people without a mouse or trackpad, and others, rely on keyboard support to interact with the web.
It’s critical that you add keyboard support to your JavaScript actions, as it affects all of these users.

Let's look at a [click event](https://developer.mozilla.org/docs/Web/API/Element/click_event). If an onClick() event is used on
a semantic HTML element such as a `<button>` or `<a>`, it naturally includes both mouse and keyboard functionality. However, the keyboard
functionality is not automatically applied when an onClick() event is added to a non-semantic element, such as a generic `<div>`.

Don’t do this:
`<div role="button" tabindex="0" onclick="doAction()">Click me!</div>`

Do this:
`<button onclick="doAction()">Click me!</div>`

{% Codepen {
user: 'cariefisher',
id: 'MWXmJze'
} %}

If a non-semantic element is used for a trigger event, a [keydown/keyup event](https://www.w3.org/WAI/ARIA/apg/example-index/button/button.html)
must be added to detect the enter or space key press. Adding trigger events to non-semantic elements is often forgotten. Unfortunately,
when it is forgotten, the result is a component only accessible via a mouse, and keyboard-only users are left without access to the associated actions.

## Page titles

As we learned in the [Document module](/accessibility/more-html/#page-title), the page title is essential for screen reader users. It tells users what page they are on
and whether they have navigated to a new page.

If you use a JavaScript framework, you need to consider how you handle page titles, especially as [single-page apps](https://developer.mozilla.org/docs/Glossary/SPA) (SPA) that load from
a singular index.html file, transitions, or routes (page change) will not involve a page reload. Each time a user loads a new page,
the title won’t change by default.

For SPAs, the value of the [document.title](https://developer.mozilla.org/docs/Web/API/Document/title) property can be
added manually or by a helper package, depending on the JavaScript framework. Announcing the [updated page titles](https://hidde.blog/accessible-page-titles-in-a-single-page-app/)
to a screen reader user may take some additional work, but the good news is you’ve got options, such as dynamic content.

## Dynamic content

One of the most powerful functionalities in JavaScript is its ability to add HTML and CSS to any element on the page. It allows developers to
create more dynamic applications based on the actions or behaviors of the users.

For example, you need to send a message to users when they log in to your website or app. You want the message to stand out from the
white background and relay the message: "You are now logged in."

You can use JavaScript to set `innerHTML` of content like this:

`document.querySelector("#banner").innerHTML = '<p>You are now logged in</p>';`

And you can also apply CSS in a similar way:

`document.querySelector("#banner").setAttribute("style", "border-color:#0000ff;");`

With great power comes great responsibility. And unfortunately, JavaScript injection of HTML and CSS has historically been
misused to create inaccessible content. Some common misuses are listed here:

<table>
<thead>
  <tr>
    <th>Possible misuse</th>
    <th>Correct usage</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Rendering large chunks of non-semantic HTML</td>
    <td>Rendering smaller pieces of semantic HTML</td>
  </tr>
  <tr>
    <td>Not allowing time for dynamic content to be recognized by assistive technology</td>
    <td>Using a setTimeout() time delay to allow users to hear the full message</td>
  </tr>
  <tr>
    <td>Applying style attributes for onFocus() dynamically</td>
    <td>Use <span style="color:#905;background-color:#ddd">`:focus`</span> for the related elements in your CSS stylesheet</td>
  </tr>
  <tr>
    <td>Applying inline styles may cause user stylesheets to not be read properly</td>
    <td>Keeping your styles in CSS files to keep the consistency of the theme</td>
  </tr>
  <tr>
    <td>Creating very large JavaScript files that slow down overall site performance</td>
    <td>Use less JavaScript. You may be able to perform similar functions in CSS (such as animations or sticky navigation), which parse faster and are more performant</td>
  </tr>
</tbody>
</table>

For CSS, ensure you are toggling CSS classes over adding inline styles, as this allows for reusability and simplicity.
Use hidden content on the page and toggle classes to hide and show content for dynamic HTML. If you need to use JavaScript to dynamically
add content to your page, ensure it's simple and concise, and of course, accessible.

## Focus management

In the module on [keyboard focus](/accessibility/focus), we covered focus order and indicator styles. Focus management is knowing
when and where to trap the focus and when it shouldn't be trapped. Focus management is critical to keyboard-only users.

### Component level

You can create keyboard traps when a component's focus is not properly managed. Keyboard traps occur when a keyboard-only
user gets stuck in a component, or the focus is not maintained when it should be.

One of the most common patterns where users experience focus management issues is in a modal component. When a keyboard-only
user encounters a modal, they should be able to tab between the actionable elements of the modal, but they should never be allowed outside
of the modal without explicitly dismissing it. JavaScript is essential in properly trapping this focus.

Don't do this:

{% Codepen {
user: 'cariefisher',
id: 'rNYeEJX'
} %}

Do this:

{% Codepen {
user: 'cariefisher',
id: 'QWOEWNm'
} %}

### Page level

Similar to components, the focus needs to be maintained when a user navigates from page to page. This is especially true
in single-page applications where there is [no browser refresh](https://marcysutton.com/prototype-testing-accessible-clientside-routing/),
and all content is dynamically changed. Anytime a user clicks on a link to go to another page within your application,
the focus is either kept in the same place or potentially placed somewhere else entirely.

When transitioning between pages (or routing), the development team must decide where the focus goes when the page loads.
There are multiple techniques to achieve this:

* Place focus on the main container with an aria-live announcement.
* Put the focus back to skip to the main content link.
* Move the focus to the top-level heading of a new page.

Where you decide to put the focus will depend on the framework you are using and the content you want to serve up to your users,
and may be context- or action-dependent.

## State management

Another area where JavaScript is critical to accessibility is state management, or when a component or page’s current visual
state is relayed to a low-vision, blind, or deafblind assistive technology user.

Often, the state of a component or page is managed through ARIA attributes, as introduced to you in the [ARIA and HTML](/learn/accessibility/aria-html/) module.
In this section, we review a few of the most common types of ARIA attributes used to help manage the state of an element.

### Component level

Depending on your page content and what information your users need, there are many [ARIA states](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes)
to consider when relaying information about a component to the user.

For example, you may use an aria-expanded attribute to tell the user whether a drop-down menu or list is expanded or collapsed.

{% Codepen {
user: 'cariefisher',
id: 'KKemRoW'
} %}

Or you might use [aria-pressed](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) to indicate that a button has been pressed.

{% Codepen {
user: 'cariefisher',
id: 'wvXejPv'
} %}

It’s important to be selective when applying ARIA attributes. Be sure to think through the user flow to understand what critical
information needs to be conveyed to the user.

### Page level

Developers often use a visually hidden area called the [ARIA live region](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) to announce changes on the screen and alert messages
to assistive technology users. This area can be paired with JavaScript to notify users of dynamic changes to the page without requiring the entire page to reload.

{% Codepen {
user: 'cariefisher',
id: 'eYKWvoK'
} %}

Historically, JavaScript has struggled to announce content in [aria-live](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-live) and alert
regions due to its dynamic nature. Asynchronously adding content into the DOM makes it hard for assistive technologies to pick up the region and announce it.
For the content to be properly read, the live or alert region must be in the DOM on load, and then the text can dynamically be swapped out.

If you use a JavaScript framework, the good news is almost all of them have a "live announcer" package that does all the work
for you and is fully accessible. There is no need to worry about creating your live region and dealing with the issues described in
the previous section.

Here are some live packages for common JavaScript frameworks:

* [React-Aria-Live](https://www.npmjs.com/package/react-aria-live)
* [React-A11y-Announcer](https://github.com/thinkcompany/react-a11y-announcer)
* [Angular Material Live Announcer](https://material.angular.io/cdk/a11y/overview#liveannouncer)
* [Vue-A11y-Utils](https://jinjiang.dev/vue-a11y-utils/#vuelive-component)

Modern JavaScript is a powerful language that allows web developers to create robust web applications. This sometimes leads
to over-engineering and, by extension, inaccessible patterns. By following the JavaScript patterns and tips in this module, you
can make your apps more accessible to all users.

{% Assessment 'javascript' %}
