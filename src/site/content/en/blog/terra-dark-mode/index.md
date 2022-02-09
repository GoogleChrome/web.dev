---
layout: post
title: How Terra improved user engagement thanks to Dark Mode
subhead: |
  By displaying a dark theme to users that prefer dark mode on their devices, Terra reduced the bounce rate by 60% and increased the pages read per session by 170%.
description: |
  In this article, we'll analyze Terra's journey from identifying the size of the "dark mode" cohort, to applying a custom dark theme, and finally measuring the impact of this implementation on their main KPIs.
authors:
  - demianrenzulli
  - andreban
  - mobtec
date: 2021-12-18
hero: image/26V1DWN36MZr3mUo8ChSBlCpzp43/0dvTpUWcW7A9b1vecUXT.png
alt: Terra's logo next to a group of developers working on a device with a dark background.
thumbnail: image/26V1DWN36MZr3mUo8ChSBlCpzp43/6o0rt0IM5XkqXsqyulwX.png
tags:
  - blog
  - case-study
  - css
---

Terra, one of Brazil's largest media companies with 75 million monthly users, reduced the bounce rate by 60% and increased the pages read per session by 170% on desktop for users that prefer dark mode by providing a custom dark theme.

In this article, we'll analyze Terra's journey from identifying the size of the "dark mode" cohort, to applying a custom dark theme, and finally measuring the impact of this implementation on their main KPIs.

<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">60<sub>%</sub></p>
    <p>Reduction in Bounce Rates</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">170<sub>%</sub></p>
    <p>More pages per session</p>
  </div>
</ul>

## What is dark mode?

Historically user interfaces in devices are displayed in "light mode", which usually means displaying black text on top of light interfaces. The alternative is "dark mode", with light text on a dark background, such as gray or black.

Dark Mode has [benefits](/prefers-color-scheme/#why-dark-mode) for user experience. Some people prefer it for aesthetic or accessibility reasons. It has  other advantages, such as preserving battery life in devices. Users can express that they prefer dark mode via a setting in their devices, [which depends on the operating system](/prefers-color-scheme/#activating-dark-mode-in-the-operating-system). For example, the following screenshot shows what the **Dark Theme** configuration option looks like in devices that run **Android Q**:

<figure>
  {% Img src="image/admin/Yh6SEoWDK1SbqcGjlL6d.png", alt="Android Q dark mode settings.", width="218", height="250", style="max-width: 218px; margin: 0 auto;" %}
  <figcaption>Android&nbsp;Q dark theme settings.</figcaption>
</figure>

To offer a better experience to users who prefer "dark mode", you can use the [`prefers-color-scheme`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) media query, with a value of `light` or `dark`. This media query reflects the user's choice in their device. You can then load a [custom dark theme](/prefers-color-scheme/#dark-mode-in-practice) for those that prefer dark. For example, by loading a "dark" CSS file, and changing values such as font and background colors. The following code shows an example of that:

```css
@media (prefers-color-scheme: dark) {
   // apply a dark theme
}

@media (prefers-color-scheme: light) {
  // apply a light theme
}
```

{% BrowserCompat 'css.at-rules.media.prefers-color-scheme' %}

{% Aside %}
This article will only cover the technique of applying a custom dark theme, provided by the developer. Chrome 96 has introduced an [origin trial](https://developer.chrome.com/blog/auto-dark-theme/#sign-up-for-the-origin-trial) for "Auto Dark Themes" on Android, for which the browser applies an automatically generated dark theme to light themed sites, when the user has opted into dark themes in the operating system, without requiring the developer to provide styles for it. For more information about "Chrome Auto Dark Mode", check out [this article](https://developer.chrome.com/blog/auto-dark-theme/).
{% endAside %}

## Identifying the "prefers light" vs "dark" user cohorts

At the time of writing (December 2021), [Chrome Platform Status](https://chromestatus.com/features) determines that approximately [22% of the web traffic](https://chromestatus.com/metrics/feature/timeline/popularity/3581) comes from users with the "prefer dark" setting.

This is aggregated data, so the real percentage of users who prefer dark that come to a site can vary. For that reason, to understand the size of this group it is advisable to run in house measurement.

The following code creates an analytics dimension, to measure the performance of users that prefer `light` vs. `dark`:

```javascript
function getColorScheme() {
    let colorScheme = 'Unknown';
    if (window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            colorScheme = 'Dark';
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            colorScheme = 'Light';
        }
    }
    return colorScheme;
}

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};
ga.l=+new Date; ga('create', 'UA-ID', 'auto');
ga('set', 'color-scheme-preference', getColorScheme());
ga('send', 'pageview');
```

Terra implemented this code in their site and compared the behavior of both groups in mobile (Android) and desktop (Windows) devices. At that moment Terra wasn't providing a custom dark theme, so the goals of this experiment were:

- Determining the size of the group of users who prefer dark.
- Identifying patterns: for example, do users that prefer dark leave the site more quickly compared to those that prefer light?

Knowing this can inform decisions, for example: if it's necessary to provide a custom dark theme.
These are the results Terra obtained after testing for 14 days:

### Mobile (Android)

In the case of mobile (Android) the numbers for bounce rate and pages per session didn't show big differences between the users that prefer "light", compared to those that prefer "dark":

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Display Mode</th>
        <th>Bounce Rate</th>
        <th>Pages Per Session</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Prefers Light</td>
        <td>25.84%</td>
        <td>3.96</td>
      </tr>
      <tr>
        <td>Prefers Dark</td>
        <td>26.10%</td>
        <td>3.75</td>
      </tr>
    </tbody>
  </table>
</div>

### Desktop (Windows)

In the case of desktop (Windows), the group of users that preferred "dark" stayed much less on the site: they had almost **twice the bounce rate and read a little more than half of the pages** than those users that preferred "light":

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Display Mode</th>
        <th>Bounce Rate</th>
        <th>Pages Per Session</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Prefers Light</td>
        <td>13.20%</td>
        <td>7.42</td>
      </tr>
      <tr>
        <td>Prefers Dark</td>
        <td>24.12%</td>
        <td>4.68</td>
      </tr>
    </tbody>
  </table>
</div>

Based on this data, Terra hypothesized that users who prefer "dark" stay less in desktop devices, due to the lack of support of a dark theme in their site.

As a next step Terra decided to work on a "dark theme" strategy to see if they could improve the engagement for the group of users that preferred dark.

## Implementing a dark theme

Most websites implement a dark theme by using the simple strategy shown previously of listening to user's configuration changes via the [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme) media query and changing styles based on that.

Terra decided to give more control to the user: when they detect that they have the "prefer dark" setting turned on in their devices (via the media query), they show them a prompt to ask them if they want to navigate in "night mode". As long as the user doesn't deny the prompt (by clicking on the "Ignore" button), they honor the user's OS-setting, and apply a custom dark theme:

<figure>
  {% Img src="image/26V1DWN36MZr3mUo8ChSBlCpzp43/TRqfCAmBe025456JyX1b.png", alt="Screenshot of Terra's light theme prompting the user to accept dark mode.", width="266", height="146", style="max-width: 266px; margin: 0 auto;" %}
  <figcaption>Terra shows a prompt to the user asking if they want to navigate in dark mode after detecting that they prefer dark in their devices.</figcaption>
</figure>

As a complement of this strategy they provide additional configuration options in the "settings" screen, where the user can decide if they explicitly prefer "light", "dark", or want to rely on the underlying device settings.

<figure>
  {% Img src="image/26V1DWN36MZr3mUo8ChSBlCpzp43/B7g0uvq2QB0eWVjnuMAl.png", alt="Screenshots of Terra's configuration screen to opt in and out of dark mode.", width="480", height="417", style="max-width: 480px; margin: 0 auto;" %}
  <figcaption>Terra's themes configurations allow users to choose between "Dark" and "Light" themes or rely on the device's settings.</figcaption>
</figure>

This is how Terra's "Night Mode" looks like:

<figure>
  {% Img src="image/26V1DWN36MZr3mUo8ChSBlCpzp43/QRW06FYeMghUI8obAQWC.png", alt="Screenshot of Terra's dark theme.", width="286", height="468", style="max-width: 286px; margin: 0 auto;" %}
  <figcaption>Terra's dark theme, "Night Mode".</figcaption>
</figure>

{% Aside %}
We have used mobile screenshots for simplicity, but Terra has applied the same strategy across mobile and desktop devices.
{% endAside %}

## Measuring the impact of Terra's dark theme

To measure the impact of the dark theme, Terra took the group of users that have the "Prefer Dark" setting turned on in their devices and compared engagement metrics when showing a "Light" vs. a "DarK" theme.
Here are the results for mobile (Android) and desktop (Windows):

### Mobile (Android)

While bounce rates remained similar, pages and sessions almost doubled (from 2.47 to 5.24) when users were exposed to a dark theme:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Display Mode</th>
        <th>Bounce Rate</th>
        <th>Pages Per Session</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Prefers Light</td>
        <td>26.91%</td>
        <td>2.47</td>
      </tr>
      <tr>
        <td>Prefers Dark</td>
        <td>23.91%</td>
        <td>5.24</td>
      </tr>
    </tbody>
  </table>
</div>

<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">2<sub>X</sub></p>
    <p>More pages per session</p>
  </div>
</ul>

### Desktop (Windows)

Both metrics improved when showing a dark theme: bounce rates went from 27.25% to 10.82% and pages per session almost tripled (from 3.7 to 9.99).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Display Mode</th>
        <th>Bounce Rate</th>
        <th>Pages Per Session</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Prefers Light</td>
        <td>27.5%</td>
        <td>3.7</td>
      </tr>
      <tr>
        <td>Prefers Dark</td>
        <td>10.82%</td>
        <td>9.99</td>
      </tr>
    </tbody>
  </table>
</div>

<ul class="stats">
  <div class="stats__item">
    <p class="stats__figure">60<sub>%</sub></p>
    <p>Reduction in Bounce Rates</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">170<sub>%</sub></p>
    <p>More pages per session</p>
  </div>
</ul>

Based on this data, Terra could confirm the benefits for the users from implementing a dark theme, and has decided to continue maintaining it as a core feature of the site.

## Conclusion

Dark Mode is a preference that users can turn on in their devices  to change the style of the screens into dark themes. This technique has reported benefits from the user experience and for different aspects of the user's devices such as saving  battery life.

In this article we saw how providing a custom dark theme improved engagement metrics for the group of Terra's users that have the preferred dark mode setting turned on in their devices.

For companies with the resources to implement an alternative dark theme this is the recommended approach. For those that don't have the time to invest in such a feature, Chrome is starting to roll out an [Auto Dark Mode feature](https://developer.chrome.com/blog/auto-dark-theme/).
