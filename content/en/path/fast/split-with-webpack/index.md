---
title: Reduce JavaScript payloads with code-splitting
author: houssein
web_lighthouse:
- aria-allowed-attr
- color-contrast
mdn_features:
- promises
- foo
- bar
wf_blink_components: Blink>Accessibility
---

# Reduce JavaScript payloads with code-splitting

<hr>

Nobody likes waiting.

<video autoplay loop muted playsinline>
  <source src="./assets/waiting.mp4" type="video/mp4">
</video>

[Over 50% of users will abandon a website if it takes longer than 3 seconds to load](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/). One of the biggest culprits? Sending down too much JavaScript code to our users.

Now hold on a minute. What exactly do we mean by too much code? Don't we need our users to get all the code that make up our website? How else would they be able to use it?

Well, yes - we ultimately want our users to receive all the code that we spent so much valuable time writing. But maybe we can be a bit more _selective_.

Most webpages and applications are made up of many different parts. Instead of sending all the JavaScript that makes up the application as soon as the first page is loaded, we can **code-split** our bundle into multiple "pieces" (or chunks) and only send what's necessary at the very beginning.

## Measure

Like always, it's important to first measure how our website performs before trying to add any optimizations. Let's take a look at the current JavaScript bundle that loads when we boot up our application.

- Click on the `Show Live` button.

<img src="./assets/show-live.png" width="140" alt="The show live button">

You should see an extremely useful (some say life-changing) app that helps you sort three numbers. Now let's see how unnecessarily large this application is.

- Open the DevTools by pressing `CMD + OPTION + i` / `CTRL + SHIFT + i`.

- Click on the **Network** tab.

<img src="./assets/network-tab.png" width="50%" alt="The network tab in devtools">

- Make sure `Disable Cache` is checked and reload the app.

<img src="./assets/network.png" width="400" alt="The network tab in devtools">

_Wowza_. 71.2kB worth of JavaScript just to sort a few numbers. What gives?

If you dive into the code in `src/index.js`, you'll notice that we're importing the `lodash` library and using one of its methods to sort our numbers. Lodash is an excellent library that provides many useful utility functions, but we're making a common mistake here. We don't have to import the entire library if we're not using most of it!

Now, do the code [if you're using Polymer](codelabs/webpack-with-polymer).

 