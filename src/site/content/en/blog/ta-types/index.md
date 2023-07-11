---
layout: post
title: 3 common types of test automation 
date: 2023-07-12
subhead: >
  Let's start with the basics! Exploring the 2 general testing modes and 3 common types of test automation.
description: >
  Let's start with the basics! Exploring the 2 general testing modes and 3 common types of test automation.
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

This meme sums it up quite nicely: each drawer works perfectly well individually, but in combination with the other drawer, they block each other and thus fail to function. We want to have both drawers working well with each other, having the ability to be operable at the same time. 

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/2PY6rfmGkB26vX3qIbsj.jpeg", alt="The same cupboard but with two drawers you can open at the same time.", width="800", height="450" %}

Apply this to web development: we wrote some tests, maybe even achieved 100% test coverage, but our application still needs to perform as soon as other parts come into place. The units are working perfectly well but not in relation to each other. Consequently, writing some tests is crucial, but only one part of finding the ideal test setup for your project. As a very first step, we need to determine which parts of the quality of our application need to be ensured and how we want to achieve that. 

Simply put, we want to have a plan before starting to write actual test code. Therefore, we will answer two basic questions in approaching the topic of how to test practically:

- How do we want to test?
- What do we want to test?

This particular article focuses on the first question. Our main goal is to plan the right strategy for testing, but we’ll cover the very first steps here: Let’s discover which testing types can be used to start from a common ground. In later articles we’ll combine them and thus find the testing strategies which fit our project best - based on the groundwork we learn here. Let's go! 🙌

## Let's start with the basics: general testing modes

The first point to clarify in answering the question of how to test is very abstract. We need to roughly define the way we want to test—should we do it ourselves or should a computer take over? Tiny spoiler alert: we need to avoid falling into binary thinking here. But let's dive into the basics first.

### Manual testing versus automated testing

If you ask people to define testing, you'll probably encounter two answers:

* **Manual testing**: This is the typical method of testing, done by actual people. That means a test will click through the application and check if it works and, at the same time, try to break it. Exploratory testing is the most common way: As the name implies, a tester expires the application, using their own knowledge to investigate the application under test with a predetermined path or any checklists.
* **Automated testing**: This is the answer you might get from developers and testers. Monotonous checklist testing is, in particular, a primary candidate for automation. Thus a computer will do the testing for us.

This series of guides will mostly focus on automated testing. However, a small but important disclaimer: you shouldn't focus on only one way of testing! Even if automation saves a lot of time and effort, humans and thus manual testing will always play a vital role. Rather, test automation should ensure that people can focus on what is important in manual testing, that is, the exploratory testing of the most important features: All test cases where our improvisation and creativity can shine, e.g. in user experience or testing the business logic with high risk involved. In other words, automation has our back. ❤️

### Opaque box versus clear box

So, we have defined the general way we test. However, that’s not enough yet—we now need to get deeper into the details. To plan your testing strategies even more thoroughly, let’s take a look at testing procedures or modes. In both cases, no matter if you go for manual or automated testing, there's one more question to answer. Should you know how your application works under the hood, or is it more helpful to test without this knowledge, basically as a clean slate?

- One procedure for deriving and selecting test cases is called **opaque box testing** (also known as black box testing). It is based on analyzing a component or system's functional or non-functional requirements (specifications) without considering its internal structure.
- The second approach is the opposite: **clear box testing** (also called white box testing) is a procedure for deriving and selecting test cases while considering the internal structure of said box - in other words considering how your application works under the hood.

Both procedures can be applied to manual and automated testing alike. However, some testing types will focus more on one of the two—we'll cover that also. But before that, we should quickly define the exact test automation types.

## Test automation types: how do we want to test?

Let's commit to the testing types we use as measures in our projects as we get closer to answering how we want to test. We've already decided to do some manual testing, but committing to test automation types is a bit more challenging. So let's take a closer look at the most important ones.

As illustrated in the meme mentioned earlier, we have already come across two types—unit testing and integration testing. There are even more essential types to consider, so let's get a brief overview.

### Unit testing

Unit testing is a testing type in which minor testable parts or units of an application, called units, are individually and independently tested for proper operation. These units can vary in range from functions, classes, or interfaces, to services or complete components. Their primary attributes are their execution speed, isolation, and comfortable maintainability. If you want to dive deeper into unit testing, head over to this [guide on unit testing](https://en.wikipedia.org/wiki/Unit_testing).

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/kVCbDIZN23OUGwOdpJmm.jpeg", alt="A simplified depiction of unit testing showing input and output.", width="800", height="450" %}

{% Aside %}
Possible tools to include (but not limited to) are [Vitest](https://vitest.dev/) and [Jest](https://jestjs.io/).
{% endAside %}


### Integration testing

Integration testing focuses on interactions between components or systems. This kind of testing means we’re checking the interplay of units and how they work together. Typical examples of an integration test are API tests or Component tests.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/1dxHGzPGPDgkMqRMj46o.jpeg", alt="A simplified depiction of integration testing showing how two unit working together.", width="800", height="450" %}

{% Aside %}
The tools you may consider using are often the same as those mentioned in the [unit testing section](#unit-testing) and can also include frameworks providing component testing, for example, [WebdriverIO](https://webdriver.io/) and [Cypress](https://www.cypress.io/).
{% endAside %}

### End-to-End testing

These tests are often called UI tests, and this name explains their function even better. These tests interact with your application’s UI, including the complete application stack, and test your application from beginning to end.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/9ZWWlop306SoGFP9rbeH.jpeg", alt="A simplified depiction of end-to-end testing showing a computer as a robot, looking at a workflow.", width="800", height="450" %}

They resemble a system test if you refer to the theory of quality assurance. Thus, these tests simulate a genuine user and their interaction. These tests take more time because they involve the whole system. More runtime also means more computing power is needed and developers spending more time on waiting for pipelines to finish. Consequently, this additional effort results in higher maintenance costs. 

{% Aside %}
Possible tools to include (but not limited to) are:
* [WebdriverIO](https://webdriver.io/) 
* [Cypress](https://www.cypress.io/)
* [Playwright](https://playwright.dev/)
* [Selenium](https://www.selenium.dev/)
{% endAside %}

#### Visual UI testing

An interesting subcategory of UI tests is visual tests. Those tests are extended end-to-end tests, providing a process of checking the visible output of an application by screenshot comparison: A screenshot of the change is compared with another screenshot containing the “status quo” - or in other words, a golden file -  and providing those results to a human reviewer to inspect and check. Put another way: it helps to find “visual bugs” in the appearance of a page, beyond purely functional bugs and outside the concept, not explicitly written down into assertions.

### Static analysis

There’s one more thing I want to introduce here: Static analysis is not a testing type in the textbook way. However, we’ll include it here as it will be an essential aspect in quality assurance  strategies later on. You can imagine it working like a spell check function: it scans your code for more significant defects and syntax errors without running the program, thus detecting code style issues. This simple measure can prevent many bugs. This is a good starting point to learn about Static Analysis if you want to get to know it in more detail.

{% Aside %}
Tools to include (but not limited to) are:
- [Eslint](https://eslint.org/)
- [StyleLint](https://stylelint.io/)
{% endAside %}

## Testing in all shapes: how does this all work together?

Searching for answers to all these questions, you might find a possible solution in some metaphors. In the web and testing communities specifically, people tend to use analogies to give you an idea of how many tests you should use of which type.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/a96diycjrTQ2nVRpVgWH.jpeg", alt="A lot of shapes like pyramid, diamonds, ice cone, honeycombs and a trophy; representing test strategies.", width="800", height="450" %}

The following five strategies depicted in this image are the most common ones:
- Test Pyramid
- Test Diamond
- Test Ice Cone (also known as Test Pizza)
- Test Honeycomb
- Test Trophy

This is truly a lot of information to process. How should we decide on a matching test strategy based on all this? Don’t worry, we’ve got you covered. In the next article, we’ll discuss these different strategies in more detail and explain how to choose the best fit for your project. Stay tuned! 🔥

{% Aside %}
This blog post was written by Ramona, with input and review from
[Jecelyn Yeen](/authors/jecelynyeen/)
([Twitter](https://twitter.com/jecfish)), and
[Michael Hablich](https://www.linkedin.com/in/michael-hablich-2128646/)
([Twitter](https://twitter.com/MHablich)). Special thanks to [Sofia Emelianova](https://www.linkedin.com/in/sofia-yemelianova/) for supporting the publication process.
{% endAside %}
