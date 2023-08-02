---
layout: post
title: Three common types of test automation
date: 2023-07-12
subhead: >
  Let's start with the basics! Exploring the two general testing modes and three common types of test automation.
description: >
  Let's start with the basics! Exploring the two general testing modes and three common types of test automation.
authors:
  - ramona
hero: image/dPDCek3EhZgLQPGtEG3y0fTn4v82/Ry1V42EY9YKOBeoWlLaY.jpg
alt: A lot of test tubes to depict testing.
tags:
  - blog
  - test-automation
  - testing
---

We've all been there: what is a recurring coding meme that happens all too often in real life?
{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/yl1OSGuWVIOsgLO6odFZ.jpeg", alt="A cupboard with two drawers you cannot open at the same time.", width="800", height="450" %}

This meme sums it up quite nicely: each drawer works perfectly well individually, but in combination with the other drawer, they block each other and fail to function. You want both drawers to work well with each other and be operable at the same time.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/2PY6rfmGkB26vX3qIbsj.jpeg", alt="The same cupboard but with two drawers you can open at the same time.", width="800", height="450" %}

Apply this to web development: you wrote some tests, maybe even achieved 100% test coverage, but your application still needs to work once other parts fall into place. The units may work well on their own but not in relation to each other. Writing some tests is crucial but it's only one part of the ideal test setup for your project. As a very first step, you need to determine what parts of the application quality you need to ensure and how you can achieve that.

Simply put, you need a plan before you start writing the actual test code. To approach the topic of how to test practically, let's start with a clean slate and answer two basic questions:

- How do you want to test?
- What do you want to test?

This article focuses on the general things you need to know to answer the first question. To start from a common ground, let's first learn what testing modes exist and then focus on the common types of testing. In later articles, we will answer the second question, combine the answers, and find the testing strategy that works best for your project. Let's go! 🙌

## Start with the basics: General testing modes

When answering the question of how to test, the first point to clarify is very abstract. Should you test manually or let a computer take over? It's important, however, not to fall into binary thinking here.

### Manual testing versus automated testing

If you ask quality assurance engineers to define testing, they will probably break it down into two "modes" first:

* **Manual testing**. This is a typical testing method conducted by actual people. A quality assurance engineer click through the application, check if it works and, at the same time, try to break it. The most common way is exploratory testing, where the engineer investigates the application using their knowledge of the application against a predefined path or checklist.
* **Automated testing**. This is a type of testing conducted by a computer. Quality assurance engineers implement it to automate away repetitive and monotonous tests.

This series of guides will mostly focus on automated testing. However, you shouldn't focus on only one way of testing. Even if automation saves a lot of time and effort, humans and manual testing will always play a vital role. Rather, test automation should free up people to focus on exploratory testing and creative problem-solving. For example, ensuring the quality of user experiences or protecting the high-risk business logic. In other words, automation has your back. ❤️

### Opaque box versus clear box

So, you have defined the general modes of testing. However, that's not enough yet. To plan the testing strategy, there is one more question to answer: should you know how your application works under the hood or is it better to test without this knowledge? Depending on the answer, there are two procedures to choose from for deriving and selecting test cases:

- **Opaque box testing** (or black box testing). It is based on analyzing a component or system's functional or non-functional requirements (specifications) without considering its internal structure.
- **Clear box testing** (or white box testing) is a procedure that takes into account the internal structure of said box. In other words, how your application works under the hood.

Both procedures can be applied to manual and automated testing. However, some aspects of general testing modes may focus more on one of the two—we will cover that later. For now, let's further break down test automation into types.

## Test automation types: How do you want to test?

As you get closer to answering the "how" question, you have already decided to do some manual testing. However, choosing and applying test automation types is a bit more challenging. The types of automation testing are closely related to the metrics you want to create in your projects. So let's take a closer look at the most important ones.

As illustrated in the meme mentioned earlier, you have already come across two types: unit testing and integration testing. End-to-end testing is the third important one to consider. But that isn't all of them still. Let's take a closer look.

### Unit testing

Unit testing is a testing type in which minor testable parts or units of an application are individually and independently tested for proper operation. These units can vary in scope from functions, classes, or interfaces, to services or complete components. Their primary attributes are execution speed, isolation, and comfortable maintainability. If you want to dive deeper into unit testing, head over to this [guide on unit testing](https://en.wikipedia.org/wiki/Unit_testing).

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/kVCbDIZN23OUGwOdpJmm.jpeg", alt="A simplified depiction of unit testing showing input and output.", width="800", height="450" %}

{% Aside %}
Possible tools include but aren't limited to [Vitest](https://vitest.dev/) and [Jest](https://jestjs.io/).
{% endAside %}

### Integration testing

Integration testing focuses on interactions between components or systems. In other words, on how well they work together. Typical examples of integration tests are API or component tests.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/1dxHGzPGPDgkMqRMj46o.jpeg", alt="A simplified depiction of integration testing showing how two unit working together.", width="800", height="450" %}

{% Aside %}
The tools you may consider using are often the same as those mentioned in the [unit testing section](#unit-testing) and can also include frameworks providing component testing, for example, [WebdriverIO](https://webdriver.io/) and [Cypress](https://www.cypress.io/).
{% endAside %}

### End-to-end testing

These tests are often called UI tests and this name explains their function even better. These tests interact with your application's UI, including the complete application stack, and test your application from one end to the other.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/9ZWWlop306SoGFP9rbeH.jpeg", alt="A simplified depiction of end-to-end testing showing a computer as a robot, looking at a workflow.", width="800", height="450" %}

They resemble a system test if you refer to the theory of quality assurance. These tests simulate a genuine user and their interactions. End-to-end tests take more runtime because they involve the whole system and more runtime requires more computing power. As a result, this additional effort results in higher maintenance costs. 

{% Aside %}
The tools you might use for end-to-end testing include but aren't limited to [WebdriverIO](https://webdriver.io/), [Cypress](https://www.cypress.io/), [Playwright](https://playwright.dev/), [Selenium](https://www.selenium.dev/).
{% endAside %}

#### Visual UI testing

An interesting subcategory of UI tests is visual tests. These tests are extended end-to-end tests that provide a means to verify the visible output of an application. Such a test takes a screenshot after a change and another screenshot containing the “status quo” (or golden file), then provides those results to a human reviewer to inspect and check. In other words, it helps find “visual bugs” in the appearance of a page, beyond purely functional bugs and not explicitly written down into assertions.

### Static analysis

There's one more thing to introduce here: static analysis. It isn't a testing type in the textbook sense. However, it will be an essential aspect in quality assurance strategies later on. You can imagine it working like a spell check function: it scans your code for more significant defects and syntax errors without running the program, thus detecting code style issues. This simple measure can prevent many bugs. This is a good point to learn about Static Analysis if you want to get to know it in more detail.

{% Aside %}
The tools you might use for static analysis include but aren't limited to [Eslint](https://eslint.org/) and [StyleLint](https://stylelint.io/).

{% endAside %}

## Testing in all shapes: How does this all work together?

While searching for answers to all these questions, you might find a possible solution in some analogies. In the web and testing communities specifically, developers tend to use these analogies to give you an idea of how many tests you should use of which type.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/a96diycjrTQ2nVRpVgWH.jpeg", alt="A lot of shapes like pyramid, diamonds, ice cone, honeycombs and a trophy; representing test strategies.", width="800", height="450" %}

The following five strategies depicted in this image are the most common ones:

- Test Pyramid
- Test Diamond
- Test Ice Cone (also known as Test Pizza)
- Test Honeycomb
- Test Trophy

This is truly a lot of information to process. How should you decide on a matching test strategy based on all this? Don't worry, we've got you covered. In the next article, we will discuss these different strategies in more detail and explain how to choose the best fit for your project. Stay tuned! 🔥

{% Aside %}
This blog post was written by Ramona, with input and review from
[Jecelyn Yeen](/authors/jecelynyeen/)
([Twitter](https://twitter.com/jecfish)),
[Michael Hablich](https://www.linkedin.com/in/michael-hablich-2128646/)
([Twitter](https://twitter.com/MHablich)), and [Sofia Emelianova](https://www.linkedin.com/in/sofia-yemelianova/).
{% endAside %}
