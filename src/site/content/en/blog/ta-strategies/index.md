---
layout: post
title: Pyramid or Crab? Find a testing strategy that fits 
date: 2023-07-26
scheduled: true
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

Welcome back! In the [last article](/ta-types), we laid down lots of groundwork about how to approach the different testing types and what they contain, and we clarified the testing type definitions. Remember our little meme image from before? We wondered how all those testing types we learned about could work together.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/n3LPuwApNcCRT5S3zaoq.jpeg", alt="A cupboard with two drawers you can open at the same time.", width="800", height="450" %}

So next up, we will learn exactly that. This article will give an introduction on how to combine these testing types into a reasonable strategy that matches your project.

I want to share some recommendations on which testing strategies might fit your project, depending on its size. Let’s begin with a short overview—an attempt to generalize based on my own experience, so it can naturally deviate from your use case. I hope this is a good starting point:

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

How did I come to the conclusions pictured in this table? What are the testing strategies mentioned? Let’s take a closer look to discover the answers.


## Determine testing goals: What do we want to achieve with these tests?

Before we can start building a good strategy, we need to find out where we want to go. What is our goal with testing? When do we consider that our application has been sufficiently tested?

Achieving high test coverage is often viewed as the ultimate goal for developers when it comes to testing. But is it always the best approach? In my opinion, there's a more critical factor to consider when deciding a testing strategy—serving our users’ needs.

As well as our role as developers, we all also use many other applications and devices. In this respect, we are the users and rely on all these systems to “just work”—that means we rely on countless developers to do their best to make their applications work. To turn this back around, as developers, we want to live up to this trust. So our first goal—whatever the project size—should always be to ship working software and thus serve our users. This means we must focus on our users' needs, especially in our tests. [Kent C. Dodds](https://kentcdodds.com/about) sums it up very well in [his post](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests):

<blockquote>
  <p>
    The more your tests resemble the way your software is used, the more confidence they can give you.
  </p>
  <cite>
    by Kent C. Dodds
  </cite>
</blockquote>

And I think this nails it. He describes it as becoming more confident in our tests. The closer we get to the users via choosing the corresponding testing type, the more confident we can trust our tests to have valid results. Or in other words, the higher up we climb the pyramid, the more confident we get. But wait, what is the pyramid? Don’t worry: we’ll cover this next.


## Determining test strategies: How to choose a testing strategy

Remember, as a first step, we want to determine which parts of our requirements need to be insured to be fulfilled, and how we want to achieve that. The goal behind that is to find out which types of testing to use, and then, with which granularity of testing we can reach the most confidence while also keeping an efficient cost structure. Many people approach this topic by using metaphors. Let’s take a deeper look at the most common ones, starting with the well-known classic.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/btUEUtD2bmqNwX2DcH4j.jpeg", alt="A lot of shapes like pyramid, diamonds, ice cone, honeycombs and a trophy; representing test strategies.", width="800", height="450" %}


### The classic: The test pyramid

You will probably encounter the test automation pyramid as your initial metaphor as soon as you look up testing strategies. Mike Cohn introduced this concept in his book *Succeeding with Agile*. Later, the concept was expanded upon as the "[Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)" by Martin Fowler. The visual representation of this pyramid is as follows:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/iEtr9phjNjENxQlFfJYv.jpeg", alt="The test pyramid.", width="800", height="450" %}

As shown in this drawing, the test pyramid consists of three layers:

1. **Unit**. You find these tests on the base layer of the pyramid because they are fast execution and simple to maintain. This is due to their isolation and targeting of the most minor units. See this as an example of a typical [unit test](https://github.com/leichteckig/phpmagazin-jest-example/blob/main/product.test.js) testing a very small product.

1. **Integration**. This is in the middle of the pyramid, as it is still acceptable when it comes to speed in execution but brings you the confidence of being closer to the user than unit tests can be. An example of an integration type test is an [API test](https://github.com/cypress-io/cypress-realworld-app/blob/develop/cypress/tests/api/api-users.spec.ts); [component tests](https://github.com/leichteckig/nuxt-leichteckig/blob/main/test/components/MediaGrid.spec.js) can also be considered this type.

1. **E2E tests** (also called **UI tests**). As we have seen, these tests simulate a genuine user and their interaction. These tests need more time to be executed and thus are more expensive—being placed at the top of the pyramid. 


### Confidence versus resources

As briefly covered already, the order of the layers is no coincidence. They show the priorities and the corresponding costs of the layers—thus giving you a clear picture of how many tests you should write from each layer. We have already seen this in the definition of the testing types. 

As E2E tests, for example, are closest to our users, they give us the highest confidence that our application is working as intended. However, due to the complete application stack being present, and the computer simulation of a real user, they are potentially also the most expensive. So the confidence is in direct competition with the resources we need to execute the tests.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/DT57buwCB4uDyJp61Rzb.jpeg", alt="The test pyramid with arrows showing the direction of confidence and resources required for different testing types.", width="800", height="450" %}

The pyramid tries to solve this competition by advising you to focus more on unit tests and strictly prioritize the cases covered by E2E tests: for example, your most crucial user journeys or the most vulnerable to defects. As Martin Fowler emphasizes, the two most essential points in Cohn’s pyramid are as follows:

1. Write tests with different granularity.
1. The more high level you get, the fewer tests you should have.


## Pyramid evolved! Adaptations of the test pyramids

For some years, discussions have revolved around the pyramid. The pyramid seems to oversimplify testing strategies, leaves out a lot of testing types, and no longer fits all real-world projects. Consequently, it may mislead us. So, has the pyramid fallen out of shape?
To answer this question, let’s take a look at the following [quote](https://twitter.com/rauchg/status/807626710350839808) from [Guillermo Rauch](https://rauchg.com/about):

<blockquote>
  <p>
    Write tests. Not too many. Mostly integration.
  </p>
  <cite>
    by Guillermo Rauch
  </cite>
</blockquote>

It’s one of the most commonly cited quotes on this subject, so let’s break it down:

- Write tests: Not only because it builds trust, but also because it saves time in maintenance.
- Not too many: 100% coverage is not always good, because then your testing is unprioritized and there will be a lot of maintenance.
- Mostly integration: Here again the emphasis is on integration tests: they have the most business value by giving you a daily high confidence level while maintaining a reasonable execution time.

This leads us to overthink the testing pyramid and shift our focus to integration testing. Over the last few years, many adaptations have been raised, so let’s look at the most common ones.


### Test diamond

The first adaptation I want to showcase tackles the over-emphasis on unit testing, as seen in the test pyramid. Imagine this situation: you have reached 100% coverage on unit tests. However, in the next refactoring, many of these unit tests will need to be updated, and you might be tempted to skip them. So they erode.

As a result, and together with the higher priority on integration testing, the following shape may arise:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/vSFAkoSqbL4p984xf48k.jpeg", alt="The test diamond.", width="800", height="450" %}

The shape of the test pyramid has evolved more into a diamond. You can see the three layers from before, but with a different size and—in the case of the unit layer—with a slightly different shape:

- Unit: Write unit tests the way we defined them before. However, we’ll consider that they erode, so we’ll prioritize and cover the most critical cases here.
- Integration: The integration tests we know, testing the combination of single units.
- E2E: This layer handles the UI tests similar to the test pyramid. Take care to only write E2E tests for the most critical test cases.


### Testing honeycomb

There is another adaptation similar to the test diamond but further specialized for microservices-based software systems. The testing honeycomb is another visual metaphor for the granularity/scope of and amounts of tests to write for a microservices-based software system. It's an adaptation of the traditional test pyramid specifically for [testing microservices](https://notes.paulswail.com/public/Testing+microservices), introduced by [Spotify](https://engineering.atspotify.com/2018/01/testing-of-microservices/). Due to their small size, the most considerable complexity in a microservice is not within the service itself, but in how it interacts with others. So a testing strategy for a microservice should primarily focus on integration tests.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/mrM4QK1kEZgvRvltyiMn.jpeg", alt="The testing honeycomb.", width="800", height="450" %}

This way, a shape is formed that reminds us of a honeycomb, thus the name. In it, the following layers are used:

- Integrated tests: The article by Spotify uses a quote from [J. B. Rainsberger](https://blog.thecodewhisperer.com/permalink/integrated-tests-are-a-scam) to define this layer: “A test that will pass or fail based on the correctness of another system.” This means these tests have external dependencies that we need to consider, and vice versa—we could break the tests of other systems. Similar to E2E tests in other metaphors, we should use them carefully for the most essential cases only.
- Integration tests: Similar to other adaptations, we should focus on this layer—containing tests to verify the correctness of our service in a more isolated fashion, but still in combination with other services. That means the tests will include some other systems too: focusing on the interaction points, for example, via API tests. 
- Tests on implementation details: These tests can resemble unit tests—this means on parts of the code that are naturally isolated and thus have their own internal complexity.

If you want to find out more about this testing strategy, I advise you to read the post [comparing the test pyramid to the honeycomb](https://martinfowler.com/articles/2021-test-shapes.html) by Martin Fowler, alongside the [original article from Spotify](https://engineering.atspotify.com/2018/01/testing-of-microservices/).


### Testing trophy

Alright, we already see a particular focus on integration tests. However, another type we mentioned in the previous article is not testing in theory but is still an important aspect we should consider in a testing strategy. I’m talking about static analysis, which is missing in the test pyramid and in most of the adaptations we have seen until now. There’s one adaptation, though, which takes static analysis into account while maintaining the focus on integration tests. It’s called the testing trophy, originating from the earlier quote by Guillermo Rauch and developed by Kent C. Dodds:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/ULNWIc7KY4jVjxPW5CdX.jpeg", alt="The testing trophy.", width="800", height="450" %}

The testing trophy is a metaphor depicting the granularity of tests in a slightly different way, distributing your tests into the following four testing types:

- **Static analysis** plays a vital role in this metaphor. This way, you will catch typos, type errors, and other bugs by merely running the debugging steps already outlined.
- **Unit tests** should ensure that your smallest unit is appropriately tested, but the testing trophy won’t emphasize them to the same extent as the test pyramid.
- **Integration** is the main focus as it balances out the cost and the higher confidence in the best way, as with other adaptations.
- **UI tests**, including E2E and visual tests, are at the top of the testing trophy, similar to their role in the test pyramid.

To read more about the testing trophy, I can highly recommend the [blog post by Kent C. Dodds](https://kentcdodds.com/blog/static-vs-unit-vs-integration-vs-e2e-tests) on this subject.


## Some more UI-focused approaches

That’s all well and good. However, no matter if we call our strategy a “pyramid”, “honeycomb,” or “diamond”, there’s still something missing. While test automation is valuable, it's important to remember that manual testing is still essential. Automated testing should alleviate routine tasks, freeing testers to concentrate on crucial areas. Rather than replace manual testing, automation should complement it. Is there a way to integrate manual testing with automation for optimal results?


### Testing ice cone and testing crab

There are indeed two adaptations of the testing pyramid that focus more on these UI-focused ways of testing. Both share the advantage of high confidence, but naturally—due to the slower test execution—they are more costly.

The first one—the test ice cone, also known as the testing pizza if you leave out the manual testing step—looks like the pyramid in reverse.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/QdBKM36jvq93jrERrSCP.jpeg", alt="The testing ice cone.", width="800", height="450" %}

As a result, the following layers will be showcased with the following granularity: the greater focus is on manual or UI testing, with the least focus on unit testing. It often happens with projects where the developers started work with only a few thoughts on testing. However, this testing strategy is considered an anti-pattern and rightfully so—because of its high costs in resources and manual work.

Similar to the test ice cone, but with a more drawn-out focus on E2E and visual testing, is the testing crab:

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/uY4XiFIldA1JySM9ZbHD.jpeg", alt="The testing crab.", width="800", height="450" %}

This testing strategy includes one more aspect: it should verify that our application functions and looks good. So this is the first testing strategy that highlights the importance of [visual testing](https://docs.cypress.io/guides/tooling/visual-testing), which we also briefly defined in the last article. Integration testing, divided into component and API testing, moves further into the background, and unit testing plays an even more minor role here. You can find further details on this testing strategy in this [article on the testing crab](https://changelog.com/posts/the-testing-pyramid-should-look-more-like-a-crab).

While being more costly, these two testing strategies have their place: for example, in smaller projects where fewer tests are needed, or less complexity needs to be covered. In this case, a full-blown testing strategy focusing on integration testing might be over-engineered.


## Practical advice: Let’s strategize!

So we have now learned about the most common testing strategies. We started with the classic—the test pyramid—and got to know its many adaptations. Now we need to evaluate them for our product and decide which might be the best for our use case. As I briefly mentioned at the beginning of this article, the answer to this question should start with everyone’s favorite response (although it’s no less accurate)—**It depends**.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/u1yCzUoUXkXAHUCgyrz2.jpeg", alt="It depends.", width="800", height="450" %}

Choosing the most suitable testing strategy from the ones described—and even the ones we have left out—depends on your application. It needs to suit your architecture, your requirements, and last but not least, your users and their requirements. And this might differ from application to application. That’s totally fine: remember—our most important goal is to serve our users, not a textbook definition.

In reality, you can see this very clearly, as teams sometimes need to stop sticking to the textbook definitions of these strategies. Tests themselves are sometimes really difficult to separate out and define individually. Even Martin Fowler himself emphasizes the [positive aspect of differing definitions](https://martinfowler.com/articles/2021-test-shapes.html), such as in the case of unit tests. As [Justin Searls](https://justin.searls.co/about/) states correctly in [his tweet](https://twitter.com/searls/status/1393385209089990659):

<blockquote>
  <p>
    […] write expressive tests that establish clear boundaries, run quickly & reliably, and only fail for useful reasons.
  </p>
  <cite>
    by Justin Searls
  </cite>
</blockquote>

Focus on the tests that report actual errors which a user might encounter, and don’t get distracted from your goal. Tests should be designed to benefit the user, not just provide 100% coverage or to debate which percentage of which testing type to write.


{% Aside %}
This blog post was written by Ramona, with input and review from
[Jecelyn Yeen](/authors/jecelynyeen/)
([Twitter](https://twitter.com/jecfish)), and
[Michael Hablich](https://www.linkedin.com/in/michael-hablich-2128646/)
([Twitter](https://twitter.com/MHablich)). Special thanks to [Sofia Emelianova](https://www.linkedin.com/in/sofia-yemelianova/) for supporting the publication process.
{% endAside %}
