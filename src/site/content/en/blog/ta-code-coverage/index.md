---
layout: post
title: Four common types of code coverage
date: 2023-09-06
subhead: >
  Learn what code coverage is and discover four common ways to measure it.
description: >
  Learn what code coverage is and discover four common ways to measure it.
authors:
  - ramona
  - jecelynyeen
hero: image/NJdAV9UgKuN8AhoaPBquL7giZQo1/A5IWi1Y1jqjDCqmQQxD6.jpg
alt: 'A gree fence with a 100% sign.'
tags:
  - blog
  - test-automation
  - testing
---

Have you heard the phrase "code coverage"? In this post, we will explore what code coverage in tests is and four common ways to measure it.

## What is code coverage?

Code coverage is a metric that measures the percentage of source code your tests execute. It helps you identify areas that may lack proper testing. 

Often, recording these metrics looks like this:

<style type="text/css">
  .tg {
    border: 1px solid var(--color-stroke);
  }

  .tg tbody {
    background-color: var(--color-mid-bg);
  }
  .tg-zo2y span {
    color: var(--color-state-bad-text);
  }
  .tg-bsyc span {
    color: var(--color-state-good-text);
  }
  .tg-kfug span {
    color: var(--color-state-warn-text);
  }
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-1wig"><span>File</span></th>
    <th class="tg-1wig"><span>% Statements</span></th>
    <th class="tg-1wig"><span>% Branch</span></th>
    <th class="tg-1wig"><span>% Functions</span></th>
    <th class="tg-1wig"><span>% Lines</span></th>
    <th class="tg-1wig"><span>Uncovered lines</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0lax"><span>file.js</span></td>
    <td class="tg-bsyc"><span>90%</span></td>
    <td class="tg-bsyc"><span>100%</span></td>
    <td class="tg-bsyc"><span>90%</span></td>
    <td class="tg-bsyc"><span>80%</span></td>
    <td class="tg-zo2y"><span>89,256</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span>coffee.js</span></td>
    <td class="tg-kfug"><span>55.55%</span></td>
    <td class="tg-bsyc"><span>80%</span></td>
    <td class="tg-kfug"><span>50%</span></td>
    <td class="tg-kfug"><span>62.5%</span></td>
    <td class="tg-zo2y"><span>10-11, 18</span></td>
  </tr>
</tbody>
</table>


As you add new features and tests, increasing code coverage percentages can give you more confidence that your application has been thoroughly tested. However, there is more to discover.

## Four common types of code coverage

There are four common ways to collect and calculate code coverage: function, line, branch, and statement coverage.

{% Img src="image/dPDCek3EhZgLQPGtEG3y0fTn4v82/W9iaHL2YtKeBz5vRmWFQ.png", alt="Four types of text coverage.", width="800", height="449" %}

To see how each type of code coverage calculates its percentage, consider the following code example for calculating coffee ingredients:


```js
/* coffee.js */

export function calcCoffeeIngredient(coffeeName, cup = 1) {
  let espresso, water;

  if (coffeeName === 'espresso') {
    espresso = 30 * cup;
    return { espresso };
  }

  if (coffeeName === 'americano') {
    espresso = 30 * cup; water = 70 * cup;
    return { espresso, water };
  }

  return {};
}

export function isValidCoffee(name) {
  return ['espresso', 'americano', 'mocha'].includes(name);
}
```

The tests that verify the `calcCoffeeIngredient` function are:

```js
/* coffee.test.js */

import { describe, expect, assert, it } from 'vitest';
import { calcCoffeeIngredient } from '../src/coffee-incomplete';

describe('Coffee', () => {
  it('should have espresso', () => {
    const result = calcCoffeeIngredient('espresso', 2);
    expect(result).to.deep.equal({ espresso: 60 });
  });

  it('should have nothing', () => {
    const result = calcCoffeeIngredient('unknown');
    expect(result).to.deep.equal({});
  });
});
```

You can run the code and tests on this [live demo](https://stackblitz.com/edit/vitest-coffee-coverage?file=README.md ) or check out the [repository](https://github.com/leichteckig/vitest-coffee-example). 

### Function coverage

**Code coverage: 50%**


<style>del {text-decoration: none; !important}</style>

```text/1-4/5-8
/* coffee.js */

export function calcCoffeeIngredient(coffeeName, cup = 1) {
  // ...
}

function isValidCoffee(name) {
  // ...
}
```

*Function coverage* is a straightforward metric. It captures the percentage of functions in your code that your tests call.

In the code example, there are two functions: `calcCoffeeIngredient` and `isValidCoffee`. The tests only call the `calcCoffeeIngredient` function, so the function coverage is 50%.

### Line coverage

**Code coverage: 62.5%**

```text/5-7,10,15/11-12,19
/* coffee.js */

export function calcCoffeeIngredient(coffeeName, cup = 1) {
  let espresso, water;

  if (coffeeName === 'espresso') {
    espresso = 30 * cup;
    return { espresso };
  }

  if (coffeeName === 'americano') {
    espresso = 30 * cup; water = 70 * cup;
    return { espresso, water };
  }

  return {};
}

export function isValidCoffee(name) {
  return ['espresso', 'americano', 'mocha'].includes(name);
}
```

*Line coverage* measures the percentage of executable code lines that your test suite executed. If a line of code remains unexecuted, it means that some part of the code hasn't been tested.

The code example has eight lines of executable code (highlighted in red and green)  but the tests don’t execute the `americano` condition (two lines) and the `isValidCoffee` function (one line). This results in a line coverage of 62.5%.

Note that line coverage doesn’t take into account declaration statements, such as `function isValidCoffee(name)` and `let espresso, water;`, because they are not executable.

### Branch coverage

**Code coverage: 80%**

```text/1-2,7,15/12
/* coffee.js */

export function calcCoffeeIngredient(coffeeName, cup = 1) {
  // ...

  if (coffeeName === 'espresso') {
    // ...
    return { espresso };
  }

  if (coffeeName === 'americano') {
    // ...
    return { espresso, water };
  }

  return {};
}
…
```

*Branch coverage* measures the percentage of executed branches or decision points in the code, such as if statements or loops. It determines whether tests examine both the true and false branches of conditional statements.

There are five branches in the code example:

<style type="text/css">
  li img.custom-icon {
    margin-top:0 !important;
    display:inline;
  }
</style>

1. Calling `calcCoffeeIngredient` with just `coffeeName` {% Img class="custom-icon", src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/CpHz0pF9m750yTrbDveT.svg", alt="Chek mark.", width="20", height="20" %}
1. Calling `calcCoffeeIngredient` with `coffeeName` and `cup` {% Img class="custom-icon", src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/CpHz0pF9m750yTrbDveT.svg", alt="Chek mark.", width="20", height="20" %}
1. Coffee is Espresso {% Img class="custom-icon", src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/CpHz0pF9m750yTrbDveT.svg", alt="Chek mark.", width="20", height="20" %}
1. Coffee is Americano {% Img class="custom-icon", src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/ufOsI388YJ9gqjrXjZuQ.svg", alt="X mark.", width="20", height="20" %}
1. Other coffee {% Img class="custom-icon", src="image/NJdAV9UgKuN8AhoaPBquL7giZQo1/CpHz0pF9m750yTrbDveT.svg", alt="Chek mark.", width="20", height="20" %}

The tests cover all branches except the `Coffee is Americano` condition. So branch coverage is 80%.

### Statement coverage

**Code coverage: 55.55%**

```text/5-7,10,15/11,12,19
/* coffee.js */

export function calcCoffeeIngredient(coffeeName, cup = 1) {
  let espresso, water;

  if (coffeeName === 'espresso') {
    espresso = 30 * cup;
    return { espresso };
  }

  if (coffeeName === 'americano') {
    espresso = 30 * cup; water = 70 * cup;
    return { espresso, water };
  }

  return {};
}

export function isValidCoffee(name) {
  return ['espresso', 'americano', 'mocha'].includes(name);
}
```

*Statement coverage* measures the percentage of statements in your code that your tests execute. At first glance, you might wonder, “isn’t this the same as line coverage?” Indeed, statement coverage is similar to line coverage but takes into account single lines of code that contain multiple statements.

In the code example, there are eight lines of executable code, but there are nine statements. Can you spot the line containing two statements?

{% Details %}
{% DetailsSummary %}
Check your answer
{% endDetailsSummary %}
It's the following line: `espresso = 30 * cup; water = 70 * cup;`
{% endDetails %}

The tests cover only five of the nine statements, therefore the statement coverage is 55.55%.

If you always write one statement per line, your line coverage will be similar to your statement coverage.

## What type of code coverage should you choose?

Most code coverage tools include these four types of common code coverage. Choosing which code coverage metric to prioritize depends on specific project requirements, development practices, and testing goals.

In general, statement coverage is a good starting point because it is a simple and easy-to-understand metric. Unlike statement coverage, branch coverage and function coverage measure whether tests call a condition (branch) or a function. Therefore, they are a natural progression *after* statement coverage.

Once you have achieved high statement coverage, you can then move on to branch coverage and function coverage.

## Is test coverage the same as code coverage?

No. Test coverage and code coverage are often confused but they are different:

- **Test coverage**: A qualitative metric that measures how well the test suite covers the features of the software. It helps determine the level of risk involved.
- **Code coverage**: A quantitative metric that measures the proportion of code executed during testing. It is about how much code the tests cover.

Here is a simplified analogy: imagine a web application as a house.

- Test coverage measures how well the tests cover the rooms in the house.
- Code coverage measures how much of the house the tests have walked through.

## 100% code coverage doesn’t mean no bugs

While it is certainly desirable to achieve high code coverage in testing, 100% code coverage doesn’t guarantee the absence of bugs or flaws in your code.

### A meaningless way to achieve 100% code coverage

Consider the following test:

```js
/* coffee.test.js */

// ...
describe('Warning: Do not do this', () => {
  it('is meaningless', () => { 
    calcCoffeeIngredient('espresso', 2);
    calcCoffeeIngredient('americano');
    calcCoffeeIngredient('unknown');
    isValidCoffee('mocha');
    expect(true).toBe(true); // not meaningful assertion
  });
});
```

This test achieves 100% function, line, branch, and statement coverage, but it doesn’t make sense because it doesn’t actually test the code. The `expect(true).toBe(true)` assertion will always pass regardless of whether the code works correctly.

### A bad metric is worse than no metric

A bad metric can give you a false sense of security, which is worse than having no metric at all. For example, if you have a test suite that achieves 100% code coverage but the tests are all meaningless, then you may get a false sense of security that your code is well tested. If you accidentally delete or break a part of the application code, the tests will still pass, even though the application no longer works correctly.

To avoid this scenario:

- **Test review.** Write and review tests to make sure they are meaningful and test the code in a variety of different scenarios.
- **Use code coverage as a guideline**, not as the only measure of test effectiveness or code quality.

## Using code coverage in different types of testing

Let’s take a closer look at how you can use code coverage with the [three common types of test](/ta-what-to-test/#test-specifics-dos-and-donts):

- **Unit tests.** They are the best test type for gathering code coverage because they are designed to cover multiple small scenarios and testing paths.
- **Integration tests.** They can help collect code coverage for integration tests, but use them with caution. In this case, you calculate the coverage of a larger portion of the source code, and it can be difficult to determine which tests actually cover which parts of the code. Nonetheless, calculating code coverage of integration tests may be useful for legacy systems that don’t have well-isolated units.
- **End-to-end (E2E) tests.** Measuring code coverage for E2E tests is difficult and challenging due to the intricate nature of these tests. Instead of using code coverage, requirement coverage might be the better way to go. This is because the focus of E2E tests is to cover the requirements of your test, not to focus on the source code.

## Conclusion

Code coverage can be a useful metric for measuring the effectiveness of your tests. It can help you to improve the quality of your application by ensuring that the crucial logic in your code is well tested.

However, remember that code coverage is just one metric. Make sure to also consider other factors, such as the quality of your tests and your application requirements.

Aiming for 100% code coverage is not the goal. Instead, you should use code coverage along with a well-rounded testing plan that incorporates a variety of testing methods, including unit tests, integration tests, end-to-end tests, and manual tests.

See the full code example and tests with good code coverage. You can also run the code and tests with this [live demo](https://stackblitz.com/edit/vitest-coffee-coverage?file=README.md). 

```js
/* coffee.js - a complete example */

export function calcCoffeeIngredient(coffeeName, cup = 1) {
  if (!isValidCoffee(coffeeName)) return {};

  let espresso, water;

  if (coffeeName === 'espresso') {
    espresso = 30 * cup;
    return { espresso };
  }

  if (coffeeName === 'americano') {
    espresso = 30 * cup; water = 70 * cup;
    return { espresso, water };
  }

  throw new Error (`${coffeeName} not found`);
}

function isValidCoffee(name) {
  return ['espresso', 'americano', 'mocha'].includes(name);
}
```

```js
/* coffee.test.js - a complete test suite */

import { describe, expect, it } from 'vitest';
import { calcCoffeeIngredient } from '../src/coffee-complete';

describe('Coffee', () => {
  it('should have espresso', () => {
    const result = calcCoffeeIngredient('espresso', 2);
    expect(result).to.deep.equal({ espresso: 60 });
  });

  it('should have americano', () => {
    const result = calcCoffeeIngredient('americano');
    expect(result.espresso).to.equal(30);
    expect(result.water).to.equal(70);
  });

  it('should throw error', () => {
    const func = () => calcCoffeeIngredient('mocha');
    expect(func).toThrowError(new Error('mocha not found'));
  });

  it('should have nothing', () => {
    const result = calcCoffeeIngredient('unknown')
    expect(result).to.deep.equal({});
  });
});
```

{% Aside %}
This blog post was written by Ramona and [Jecelyn Yeen](/authors/jecelynyeen/) ([Twitter](https://twitter.com/jecfish)), with input and review from [Michael Hablich](https://www.linkedin.com/in/michael-hablich-2128646/) ([Twitter](https://twitter.com/MHablich)), [Rachel Andrew](/authors/rachelandrew/), and [Sofia Emelianova](https://www.linkedin.com/in/sofia-yemelianova/).
{% endAside %}
