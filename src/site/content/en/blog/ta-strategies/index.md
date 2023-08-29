---
layout: post
title: Pyramid or Crab? Find a testing strategy that fits 
date: 2023-07-26
subhead: >
  Discover how to combine different testing types into a reasonable strategy that matches your project.
description: >
  Discover how to combine different testing types into a reasonable strategy that matches your project.
authors:
  - ramona
hero: image/dPDCek3EhZgLQPGtEG3y0fTn4v82/CS0pyEGhIFszXNpM6Ndv.jpg
alt: A lot of test tubes to depict testing.
tags:
  - blog
  - test-automation
  - testing
---

Welcome back! The [last article](/ta-types) laid down lots of groundwork about how to approach the different testing types and what they contain, and clarified the testing type definitions. Remember this [little meme image](/ta-types/#testing-in-all-shapes-how-does-this-all-work-together)? You might have wondered how all those testing types you learned about could work together.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/n3LPuwApNcCRT5S3zaoq.jpeg", alt="A cupboard with two drawers you can open at the same time.", width="800", height="450" %}

Next, you will learn exactly that. This article gives an introduction on how to combine these testing types into reasonable strategies and choose one that matches your project.

You can compare the strategies to a number of shapes to better grasp their meaning. Here's a list of strategies with respective sizes and development scopes.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
          Application size
        </th>
        <th>
          Team composition
        </th>
        <th>
          Reliance on manual testing
        </th>
        <th>
          Testing strategy
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Small</td>
        <td>Developers only</td>
        <td>High</td>
        <td>Testing Ice Cone<br>Testing Crab</td>
      </tr>
      <tr>
        <td>Small</td>
        <td>Developers & QA engineers</td>
        <td>High</td>
        <td>Testing Ice Cone<br>Testing Crab</td>
      </tr>
      <tr>
        <td>Small</td>
        <td>Developers only</td>
        <td>Low</td>
        <td>Test Pyramid</td>
      </tr>
      <tr>
        <td>Large</td>
        <td>Developers only</td>
        <td>High</td>
        <td>Testing Trophy<br>Testing Diamond</td>
      </tr>
      <tr>
        <td>Large</td>
        <td>Developers & QA engineers</td>
        <td>High</td>
        <td>Testing Trophy<br>Testing Crab</td>
      </tr>
      <tr>
        <td>Large</td>
        <td>Developers only</td>
        <td>Low</td>
        <td>Testing Trophy<br>Testing Honeycomb</td>
      </tr>
    </tbody>
  </table>
</div>

Let's take a closer look at the strategies and learn the meaning behind their names.

## Determine testing goals: What do you want to achieve with these tests?

Before you can start building a good strategy, figure out your testing goal. When do you consider that your application has been sufficiently tested?

Achieving high test coverage is often viewed as the ultimate goal for developers when it comes to testing. But is it always the best approach? There might be another critical factor to consider when deciding on a testing strategy—serving your users' needs.

As a developer, you also use many other applications and devices. In this respect, you are the user who relies on all these systems to “just work”. In turn, you rely on countless developers to do their best to make their applications and devices work. To turn this back around, as a developer, you also strive to live up to this trust. So your first goal should always be to ship working software and serve your users. This extends to the tests you write to ensure application quality. [Kent C. Dodds](https://kentcdodds.com/about) sums it up very well in his [Static vs Unit vs Integration vs E2E Testing for Frontend Apps](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests) post:

<blockquote>
  <p>
    The more your tests resemble the way your software is used, the more confidence they can give you.
  </p>
  <cite>
    by Kent C. Dodds
  </cite>
</blockquote>

Kent describes it as gaining confidence in tests. The closer you get to the users by choosing a testing type that fits, the more you can trust your tests to have valid results. In other words, the higher up you climb the pyramid, the more confident you get. But wait, what is the pyramid?

## Determining test strategies: How to choose a testing strategy

As a first step, determine which parts of the requirements you need to check to make sure they are met. Find out what test types to use and at what level of detail you can achieve the most confidence while maintaining an efficient cost structure. Many developers approach this topic by using analogies. Here are the most common ones, starting with the well-known classic.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/btUEUtD2bmqNwX2DcH4j.jpeg", alt="A lot of shapes like pyramid, diamonds, ice cone, honeycombs and a trophy; representing test strategies.", width="800", height="450" %}

### The classic: The test pyramid

As soon as you start looking for test strategies, you will probably come across the test automation pyramid as the first analogy. Mike Cohn introduced this concept in his book "Succeeding with Agile". Later, Martin Fowler expanded upon the concept in his [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) article. You can represent the pyramid visually as the following:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/iEtr9phjNjENxQlFfJYv.jpeg", alt="The test pyramid.", width="800", height="450" %}

As shown in this drawing, the test pyramid consists of three layers:

1. **Unit**. You find these tests at the base layer of the pyramid because they are fast to execute and simple to maintain. They are isolated and target the most minor test units. For example, see a typical [unit test](https://github.com/leichteckig/phpmagazin-jest-example/blob/main/product.test.js) for a very small product.

1. **Integration**. These tests are in the middle of the pyramid, because they have an acceptable execution speed but bring you closer to the user than the unit tests can. An example of an integration test is an [API test](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/api/api-users.spec.ts). You can also classify [component tests](https://github.com/leichteckig/nuxt-leichteckig/blob/main/test/components/MediaGrid.spec.js) as this type.

1. **E2E tests** (also called **UI tests**). These tests simulate a genuine user and their interaction. Such tests need more time to execute and thus are more expensive. They are at at the top of the pyramid.

### Confidence versus resources

As briefly covered before, the order of the layers is no coincidence. They show the priorities and the corresponding costs. This gives you a clear picture of how many tests you should write for each layer. You have already seen this in the definition of the testing types.

Because E2E tests are closest to your users, they give you the most confidence that you application is working as intended. However, they require a complete application stack and a simulated user, therefore, they are also potentially the most expensive. So the confidence is in direct competition with the resources you need to execute the tests.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/DT57buwCB4uDyJp61Rzb.jpeg", alt="The test pyramid with arrows showing the direction of confidence and resources required for different testing types.", width="800", height="450" %}

The pyramid tries to solve this problem by making you focus more on unit tests and strictly prioritize the cases covered by E2E tests. For example, your most crucial user journeys or the places most vulnerable to defects. As Martin Fowler emphasizes, the two most essential points in Cohn's pyramid are as follows:

1. Write tests with different granularity.
1. The more high level you get, the fewer tests you should have.

## Pyramid evolved! Adaptations of the test pyramids

For several years, discussions have revolved around the pyramid. The pyramid seems to oversimplify testing strategies, leaves out a lot of testing types, and no longer fits all the real-world projects. Therefore, it may be misleading. Has the pyramid fallen out of shape?
[Guillermo Rauch](https://rauchg.com/about) has an opinion about it:

<blockquote>
  <p>
    Write tests. Not too many. Mostly integration.
  </p>
  <cite>
    by Guillermo Rauch
  </cite>
</blockquote>

It's one of the most commonly cited quotes on this subject, so let's break it down:

- "Write tests". Not only because it builds trust, but also because it saves time in maintenance.
- "Not too many". 100% coverage is not always good because then your testing isn't prioritized and there will be a lot of maintenance.
- "Mostly integration". Here again the emphasis is on integration tests: they have the most business value by giving you a daily high confidence level while maintaining a reasonable execution time.

This makes you think again about the testing pyramid and shift your focus to integration testing. Over the last few years, many adaptations have been proposed, so let's look at the most common ones.

### Test diamond

The first adaptation removes the overemphasis on unit testing, as seen in the test pyramid. Imagine that you have reached 100% coverage on unit tests. However, the next time you refactor, you will have to update many of these unit tests and you might be tempted to skip them. So they erode.

As a result, and together with the higher focus on integration testing, the following shape may arise:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/vSFAkoSqbL4p984xf48k.jpeg", alt="The test diamond.", width="800", height="450" %}

A pyramid evolves into a diamond. You can see the previous three layers, but with a different size, and the unit layer has been cut:

- **Unit**. Write unit tests the way you defined them before. However, because they tend to erode, prioritize and cover only the most critical cases.
- **Integration**. The integration tests you know, testing the combination of single units.
- **E2E**. This layer handles the UI tests similar to the test pyramid. Take care to only write E2E tests for the most critical test cases.


### Testing honeycomb

There is another adaptation, introduced by [Spotify](https://engineering.atspotify.com/2018/01/testing-of-microservices/), that is similar to the test diamond but further specialized for microservices-based software systems. The testing honeycomb is another visual analogy for the granularity, scope, and number of tests to write for a [microservices-based software system](https://notes.paulswail.com/public/Testing+microservices). Due to their small size, the most considerable complexity in a microservice is not within the service itself, but in how it interacts with others. So a testing strategy for a microservice should primarily focus on integration tests.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/mrM4QK1kEZgvRvltyiMn.jpeg", alt="The testing honeycomb.", width="800", height="450" %}

This shape reminds us of a honeycomb, thus the name. It has the following layers:

- **Integrated tests**. The article by Spotify uses a quote from [J. B. Rainsberger](https://blog.thecodewhisperer.com/permalink/integrated-tests-are-a-scam) to define this layer: “A test that will pass or fail based on the correctness of another system.” Such tests have external dependencies that you need to consider, and on the contrary, your system might be a dependency that breaks other systems. Similar to E2E tests in other analogies, use these tests carefully, only for the most essential cases.
- **Integration tests**. Similar to other adaptations, you should focus on this layer. It contains tests that verify the correctness of your service in a more isolated fashion, but still in combination with other services. That means the tests will include some other systems too and focus on the interaction points, for example, via API tests. 
- **Tests on implementation details**. These tests resemble unit tests—tests that focus on parts of the code that are naturally isolated and thus have their own internal complexity.

If you want to find out more about this testing strategy, see the [post that compares the test pyramid to the honeycomb](https://martinfowler.com/articles/2021-test-shapes.html) by Martin Fowler and the [original article from Spotify](https://engineering.atspotify.com/2018/01/testing-of-microservices/).


### Testing trophy

You can already see a repeating focus on integration tests. However, another type you came across in the previous article is not testing in theory but is still an important aspect you should consider in a testing strategy. Static analysis is missing from the test pyramid and in most of the adaptations you have seen so far. There's the testing trophy adaptation that takes static analysis into account while maintaining the focus on integration tests. The testing trophy originated from the earlier quote by Guillermo Rauch and was developed by Kent C. Dodds:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/ULNWIc7KY4jVjxPW5CdX.jpeg", alt="The testing trophy.", width="800", height="450" %}

The testing trophy is an analogy depicting the granularity of tests in a slightly different way. It has four layers:

- **Static analysis**. It plays a vital role in this analogy and lets you catch typos, style mistakes, and other bugs by merely running the debugging steps already outlined.
- **Unit tests**. They ensure that your smallest unit is appropriately tested, but the testing trophy won't emphasize them to the same extent as the test pyramid.
- **Integration**. This is the main focus as it balances the cost and the higher confidence in the best way, as with other adaptations.
- **UI tests**. Including E2E and visual tests, they are at the top of the testing trophy, similar to their role in the test pyramid.

To read more about the testing trophy, see the [blog post by Kent C. Dodds](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests) on this subject.


## Some more UI-focused approaches

That's all well and good but no matter how you call your strategy, a “pyramid”, “honeycomb,” or “diamond”, there's still something missing. While test automation is valuable, it's important to remember that manual testing is still essential. Automated testing should alleviate routine tasks and free the quality assurance engineers to focus on crucial areas. Instead of replacing manual testing, automation should complement it. Is there a way to integrate manual testing with automation for optimal results?


### Testing ice cone and testing crab

There are indeed two adaptations of the testing pyramid that focus more on these UI-focused ways of testing. Both have the advantage of high confidence, but are naturally more costly due to slower test execution.

The first one, the test ice cone, looks like the pyramid in reverse. Without the manual testing step, it is also known as the testing pizza.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/QdBKM36jvq93jrERrSCP.jpeg", alt="The testing ice cone.", width="800", height="450" %}

The ice cone has bigger focus on manual or UI testing and the least focus on unit testing. It often takes shape in projects where developers started work with only a few thoughts on the testing strategy. The ice cone is considered an anti-pattern and rightfully so. It is costly in terms of resources and manual work.

The test crab is similar to the test ice cone, but with more emphasis on E2E and visual testing:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/uY4XiFIldA1JySM9ZbHD.jpeg", alt="The testing crab.", width="800", height="450" %}

This testing strategy includes one more aspect: it verifies that your application functions and looks good. The testing crab highlights the importance of [visual testing](https://docs.cypress.io/guides/tooling/visual-testing), defined in the [previous article](/ta-types/#visual-ui-testing). Integration testing, divided into component and API testing, moves further into the background, and unit testing plays an even more secondary role here. You can find further details on this testing strategy in this [article on the testing crab](https://changelog.com/posts/the-testing-pyramid-should-look-more-like-a-crab).

While being more costly, these two testing strategies have their place: for example, in smaller projects where fewer tests are needed, or less complexity needs to be covered. In this case, a full-blown testing strategy focusing on integration testing might be over-engineered.

Although these two testing strategies are more costly, they have their place, for example, in smaller projects that require fewer tests and don't need to cover a lot of complexity. In this case, a full scale testing strategy focused on integration testing may be unnecessarily complex.


## Practical advice: Let's strategize!

You have now learned about the most common testing strategies. You started with the classic—the test pyramid—and got to know its many adaptations. Now you need to evaluate them for your product and decide which is be the best for your project. The answer to this question should start with everyone's favorite "**It depends**". That doesn't make it any less accurate though.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/u1yCzUoUXkXAHUCgyrz2.jpeg", alt="It depends.", width="800", height="450" %}

The choice of the most appropriate testing strategy from those described—and even the ones left out—depends on your application. It should fit your architecture, your requirements, and, last but not least, your users and their requirements. All this might differ from application to application. That's completely normal. Remember that your most important goal is to serve your users, not a textbook definition.

More often than not, real-world tests are difficult to separate and define individually. Even Martin Fowler himself emphasizes the [positive aspect of differing definitions](https://martinfowler.com/articles/2021-test-shapes.html), such as in the case of unit tests. As [Justin Searls](https://justin.searls.co/about/) states correctly in [his tweet](https://twitter.com/searls/status/1393385209089990659):

<blockquote>
  <p>
    […] write expressive tests that establish clear boundaries, run quickly & reliably, and only fail for useful reasons.
  </p>
  <cite>
    by Justin Searls
  </cite>
</blockquote>

Focus on the tests that report actual errors that the users might encounter, and don't get distracted from your goal. Tests should be designed to benefit the user, not just provide 100% coverage or to debate which percentage of which testing type to write.

{% Aside %}
This blog post was written by Ramona, with input and review from
[Jecelyn Yeen](/authors/jecelynyeen/)
([Twitter](https://twitter.com/jecfish)),
[Michael Hablich](https://www.linkedin.com/in/michael-hablich-2128646/)
([Twitter](https://twitter.com/MHablich)), and [Sofia Emelianova](https://www.linkedin.com/in/sofia-yemelianova/).
{% endAside %}
