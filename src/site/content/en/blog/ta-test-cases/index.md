---
layout: post
title: Defining test cases and priorities
date: 2023-08-09
subhead: >
  Determine what to test, define your test cases, and prioritize.
description: >
  Determine what to test, define your test cases, and prioritize.
authors:
  - ramona
hero: image/dPDCek3EhZgLQPGtEG3y0fTn4v82/reTqGo078zXM3UQ9wgHf.jpg
alt: 
tags:
  - blog
  - test-automation
  - testing
---

In the [previous post](/ta-strategies/), you learned about testing strategies, the number of tests needed to test an application, and how to find the best fit to gain the most confidence in the results while bearing in mind your resources. However, this only gives us an idea of how much to test. You still need to determine exactly what to test.
The following three criteria can be helpful in understanding what to expect in a test and to see what testing type and level of detail might fit best:

1. **Take care of your happy path**. This is the most generic or primary user story of your application, where your user will notice an error very quickly. 
2. **Decide carefully on the level of detail**. Get into more detail if your use case is vulnerable or where an error would cause high damage.
3. **Prioritize lower-level tests**, such as unit and integration tests, over higher-level end-to-end tests whenever possible.

The rest of this article explores these criteria, and how they apply as you define test cases.

## What is a test case?

In software development, a test case is a sequence of actions or circumstances that are devised to confirm the effectiveness of a software program or application. 
A test case aims to ensure that the software operates as planned and that all its features and functions perform correctly. Software testers or developers typically create these test cases to guarantee that the software meets the specified requirements and specifications.

{% Img src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/Am7IXUF5DVMprZQsSA5p.jpeg", alt="Test case is verifying.", width="800", height="450" %}

When a test case is run, the software performs a series of checks to ensure it produces the desired results. While doing that, a test fulfills the following tasks:

- **Verification**. The process of thoroughly checking software to ensure it functions without errors. Determining whether the created product meets all the necessary non-functional requirements and successfully achieves its intended purpose is crucial. The question it answers is: “Are we building the product right?”
- **Validation**. The process of ensuring that the software product meets the necessary standards or high-level requirements. It involves checking whether the actual product aligns with the expected product. Essentially, we’re answering the question: “Are we building the right product for the user’s requirements?”

Suppose the program fails to deliver the expected outcome. In that case, the test case will be the messenger—thus reporting an unsuccessful result, and the developer or tester will need to investigate the issue and find a solution.
Think of the checks and actions as paths the computer follows, regardless of the testing type.  Groups of input data or conditions used for checking are called "equivalence classes". They should get similar behavior or results from the system under test. The specific paths executed inside a test may vary but should match the activities and assertions done in your test. 

## Test paths: Typical kinds of test cases

In software development, a [test case](https://en.wikipedia.org/wiki/Happy_path) is a code execution scenario from which a certain behavior is expected and tested. Typically, there are three scenarios to form test cases from.

{% Img src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/SyLaoC8VQymTbBwIUd11.jpeg", alt="The happy path.", width="800", height="450" %}

The first one is the most well known, which you are probably already using. It’s the *happy path*, also known as the “happy day scenario” or “golden path”. It defines the most common use case of your feature, application, or change—the way it should work out for the customer. 

{% Img src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/7F0MGozRfVyyi3vn65No.jpeg", alt="The scary path.", width="800", height="450" %}

The second most crucial test path to cover in your test cases is often left out as it’s uncomfortable—as its name may imply. It’s the “scary path” or, in other words, the *negative test*. This path targets scenarios that cause the code to misbehave or enter an error state. Testing these scenarios is especially important if you have highly vulnerable use cases imposing a high risk on the stakeholders or users.

There are some other paths you might want to know about and consider using, but typically they are less commonly used. The following table summarizes them:

| Test path  | Explanation |
|---|---|
| Angry path  | This leads to an error, but an expected one; for example, if you want to ensure error handling works correctly. |
| Delinquent path  | This path takes care of any security-related scenarios your application needs to fulfill. |
| Desolate path  | The path testing the scenario in your application doesn’t get enough data to function, for example, testing null values. |
| Forgetful path  | Testing the behavior of your application with insufficient resources, for example, triggering a data loss. |
| Indecisive path  | Testing with a user who is trying to do actions or following user stories in your application but hasn’t completed those workflows. This could be the case, for example, when the user interrupts their workflow.  |
| Greedy path  | Trying to test using vast amounts of inputs or data.  |
| Stressful path  | Trying to put a load on your application by any means necessary until it no longer functions (similar to a load test). |

There are several methods to categorize those paths. Two common approaches are:

- **Equivalence partitioning**. A testing method that categorizes test cases into groups or partitions and, as a result, helps create equivalence classes. This is based on the idea that if one test case in a partition uncovers a defect, other test cases in the same partition will likely reveal similar defects. As all inputs within a specific equivalence class should exhibit identical behavior, you can decrease the number of test cases. [Learn more about equivalence partitioning](https://en.wikipedia.org/wiki/Equivalence_partitioning). 
- **Limit analysis**. A testing method, also known as [boundary-value analysis](https://en.wikipedia.org/wiki/Boundary-value_analysis), that examines the limits or extremes of input values to find any potential issues or errors that might arise at the system's limits of capabilities or constraints.

## Best practice: Writing test cases

A classical test case written by a tester will contain specific data to help you grasp the content of the test you want to conduct and, of course, execute the test. A typical tester would document their testing efforts in a table. There are two patterns we can use at this stage, helping us to structure our test cases and later, our tests themselves, too:

- **Arrange, act, assert** pattern. The "arrange, act, assert" (also known as the "AAA" or "Triple A") testing pattern is a way of organizing tests into three distinct steps: arranging the test, then performing the test, and last but not least, drawing conclusions.
- **Given, when, then** pattern. This pattern is similar to the AAA pattern but has some roots in [behavior-driven development](https://en.wikipedia.org/wiki/Behavior-driven_development).

Future articles will go into more details on these patterns, as soon as we cover the structure of a test itself. If you want to go deeper into these patterns at this stage, check out these two articles: [Arrange-Act-Assert: A pattern for writing good tests](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/) and [Given-When-Then](https://martinfowler.com/bliki/GivenWhenThen.html).

According to all the learnings from this article, the following table summarizes a classic example:

| Information  | Explanation |
|---|---|
| Prerequisites  | Everything which needs to be done before writing the test. |
| Object under test  | What needs to be verified? |
| Input data  | Variables and their values.  |
| Steps to be executed  | All the things you will do to bring your test to life: all actions or interactions you do in your tests. |
| Expected result  | What should happen and which expectations are to be fulfilled. |
| Actual result  | What actually happens. |

In automated testing, you don’t need to document all these test cases in the way that a tester needs to, even though it’s undoubtedly helpful to do so. You can find all this information in your test if you pay attention. So let’s translate this classical test case into an automated test.

| Information  | Translation into test automation |
|---|---|
| Prerequisites  | All the things you need, arranging the test, and thinking about what is given to make your test’s scenario happen. |
| Object under test  | This “object” can be various things: an application, flow, unit, or component under test. |
| Input data  | Parameter values.  |
| Steps to be executed  | All the actions and commands executed inside your test, the things you act upon, and finding out what happens when you do certain things. |
| Expected result  | The assertion you use to validate your application, the things you assert upon in your application. |
| Actual result  | The result of your automated test. |

{% Aside %}
This blog post was written by Ramona, with input and review from
[Jecelyn Yeen](/authors/jecelynyeen/)
([Twitter](https://twitter.com/jecfish)),
[Michael Hablich](https://www.linkedin.com/in/michael-hablich-2128646/)
([Twitter](https://twitter.com/MHablich)), and [Rachel Andrew](/authors/rachelandrew/). Special thanks to [Sofia Emelianova](https://www.linkedin.com/in/sofia-yemelianova/) for supporting the publication process.
{% endAside %}
