---
layout: post
title: The difference between JavaScript libraries and frameworks
description: Understand the differences between frameworks and libraries in the context of a client-side JavaScript environment. 
authors:
  - umarhansa
date: 2022-05-23
---

This article teaches you about the differences between frameworks and libraries in the context of a client-side JavaScript environment, which is the code that runs in your web browser. However, some of the points raised in this article also apply to other environments because libraries and frameworks are part of many software engineering fields, such as native mobile app development.

The discussions in this post focus on the qualitative differences rather than the quantitative differences between libraries and frameworks. For example:

-  **Quantitative:** Frameworks typically adhere to the [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) principle.
-  **Qualitative:** The framework experience can appeal more to future employers when you hunt for jobs.

## Why learn about libraries and frameworks?

JavaScript library and framework usage is prolific across the web. Every other website seems to use some third-party code as part of its JavaScript resources. Web page [weight is getting worse](https://almanac.httparchive.org/en/2021/page-weight#fig-3) with time, which [affects users](https://timkadlec.com/remembers/2020-04-21-the-cost-of-javascript-frameworks/). [JavaScript](https://almanac.httparchive.org/en/2021/javascript) is a large contributing factor toward overall page weight, and it's this same JavaScript that often comprises third-party libraries and frameworks.

It's not good enough to say, "Stop using JavaScript frameworks," because frameworks provide a big benefit to developers. Frameworks can help you to code efficiently and deliver features quickly, among other benefits. Instead, you should educate yourself so that you can make an informed decision when the time arises. 

"Should I use a library or framework today?" is an uncommon question to ask yourself. Libraries and frameworks are two very different things. However, libraries and frameworks are often conflated and the more knowledge you have about the two, the more likely you are to make educated decisions about their use.

## Examples of libraries and frameworks

You might notice third-party code by other names, such as widgets, plugins, polyfills, or packages. However, they all typically fall into the category of a library or a framework. Basically, the difference between the two can be summarized as follows:

-  For a library, your app code calls the library code.
-  For a framework, [your app code is called by the framework](https://en.wikipedia.org/wiki/Inversion_of_control).

### Library

Libraries tend to be simpler than frameworks and offer a narrow scope of functionality. If you pass an input to a method and receive an output, you probably used a library.

Look at this example of the [`lodash`](https://lodash.com/) library:

```js
import lodash from 'lodash'; // [1]
const result = lodash.capitalize('hello'); // [2]
console.log(result); // Hello
```

As is the case with many libraries, it's practical to read through this code and understand what it does. [There's very little magic involved](https://en.wikipedia.org/wiki/Magic_(programming)):

1. An `import` statement imports the lodash library into the JavaScript program.
1. The `capitalize()` method is invoked. 
1. A single argument is passed to the method. 
1. The return value is captured in a variable.

### Framework

Frameworks tend to be bigger than libraries and contribute more to overall page weight. In fact, a framework can include a library. 

This example shows a plain framework without a library and uses [Vue](https://vuejs.org/), which is a [popular](https://2021.stateofjs.com/en-US/libraries/front-end-frameworks/#front_end_frameworks_experience_ranking) JavaScript framework:

```html
<!-- index.html -->
<div id="main">
  {{ '{{ message }}' }}
</div>

<script type="module">
import Vue from './node_modules/vue/dist/vue.esm.browser.js';

new Vue({
  el: '#main',
  data: {
    message: 'Hello, world'
  }
});
</script>
```

If you compare this framework example to the earlier library example, you might notice these differences:

-  The framework code encompasses multiple techniques and abstracts them away into its own opinionated API.
-  Developers don't have full control over how and when operations occur. For example, how and when Vue writes the `'Hello, world'` string to the page is abstracted away from you.
-  The instantiation of the `Vue` class carries some [side effects](https://simple.wikipedia.org/wiki/Side_effect_(computer_science)), which are common when you use frameworks, whereas a library may offer [pure functions](https://en.wikipedia.org/wiki/Pure_function).
-  The framework prescribes a particular HTML template system rather than using your own.
-  If you read further into the Vue framework documentation or most other framework documentations, you can see how frameworks prescribe architectural patterns that you can use. JavaScript frameworks take some cognitive burden away from you because you don't have to figure this out yourself.

## When to use a library versus a framework

After you read the comparisons between libraries and frameworks, you may begin to understand when to use one or the other:

-  A framework can reduce complexity for you, the developer. As discussed, a framework can abstract away logic, behavior, and even architectural patterns. It's especially useful when you begin a new project. A library _can_ help with complexity, but typically focuses on code reuse.
-  Framework authors want you to be productive and often develop extra tools, debugging software, and comprehensive guides among other resources to help you use a framework effectively. Library authors also want you to be productive, but specialized tools are uncommon in libraries.
-  Most frameworks provide a functional starting point, such as a skeleton or boilerplate, to help you build web apps quickly. A library becomes part of your already established codebase.
-  In general, frameworks introduce some complexity to your codebase. The complexity isn't always obvious at the start, but can reveal itself over time.

As a reminder, you don't typically compare a library with a framework because they're different things that achieve different tasks. However, the more knowledge you have about the two, the more empowered you are to decide which is best for you. The decision to use a framework or library ultimately depends on your requirements.

## Swapability

You won't change your library or framework every week. However, it's good practice to understand the downsides of a package that locks you into its ecosystem. It's also recommended that you understand that the developer who decides to use a third-party package is somewhat responsible for the creation of a loose coupling between the package and the app source code.

A package that's tied to the source code is harder to remove and swap for another package. You may need to swap a package when:

-  You must make updates to a package that's no longer maintained. 
-  You discover that the package is too buggy to work with.
-  You learn about a new package that meets your needs better.
-  Your product requirements change and the package isn't needed anymore.

Consider this example:

```js
// header.js file
import color from '@package/set-color';
color('header', 'dark');

// article.js file
import color from '@package/set-color';
color('.article-post', 'dark');

// footer.js file
import color from '@package/set-color';
color('.footer-container', 'dark');
```

The previous example uses the third-party `@package/set-color` package across three separate files. If you work on this code and need to replace the third-party package, you must update the code in three places.

Alternatively, you can simplify maintenance and abstract the library usage to one place, which you can see in this example:

```js
// lib/set-color.js file
import color from '@package/set-color';

export default function color(element, theme = 'dark') {
  color(element, theme);
}

// header.js file
import color from './lib/set-color.js';
color('header');

// article.js file
import color from './lib/set-color.js';
color('.article-post');

// footer.js file
import color from './lib/set-color.js';
color('.footer-container');
```

In the previous example, direct library usage is abstracted away. Thus, if you must swap out the third-party package, you only update one file. In addition, the code is now easier to work with because the internal `set-color.js` file sets a default color theme to use.

{% Aside %}
When you read the old code and new code, you may be unconvinced with the new code and ask questions such as:

- Isn't the new code more complex because there's an additional layer of indirection? 
- What if I never replace the package? How can I justify the time taken to abstract code away?

These are valid questions and the answers ultimately depend on the use case. With some analysis or simple prototyping, you can weigh the pros and cons to answer such questions, but often there isn't a right or wrong answer!
{% endAside %}

## Ease of use

A framework may have a complex API, but the framework could offer developer tools that make it easier to use overall. Ease of use is based on many factors and can be highly subjective. A framework can be hard to use because:

-  The framework has an inherently complex API.
-  The framework is poorly documented, and requires a lot of trial and error to solve problems.
-  The framework uses techniques that are unfamiliar to you and your team.

Frameworks can mitigate against these challenges through common best practices, such as these:

-  The framework offers developer and diagnostic tools to make debugging easier.
-  The framework has an active community of developers who collaborate on free documentation, guides, tutorials, and videos. After you consume this content, you're productive with the framework.
-  The framework offers an API that follows common [coding conventions](https://en.wikipedia.org/wiki/Coding_conventions). You're productive with the framework because you learned such conventions previously and have an increased familiarity with coding styles.

While these points are commonly attributed to frameworks, they can also be attributed to libraries. For example, the [D3.js](https://d3js.org/) JavaScript library is powerful and has a large ecosystem that offers workshops, guides, and documentation among other resources, all of which impact its ease of use.

Additionally, a framework typically prescribes an architecture for your web app while a library is typically compatible with your existing architecture, whatever it might be.

## Performance

In general, frameworks can affect performance more than libraries, although there are exceptions to this case. Web performance is a huge area with many topics, so these sections touch on two topics of note: tree shaking and software updates.

### Tree shaking

Bundling is only one facet of web performance, but it has a big performance effect, especially with larger libraries. The use of tree shaking during import and export helps performance because it finds and prunes code that's unnecessary to the app.

When you bundle JavaScript code, there's a useful step known as tree shaking that's a valuable performance [optimization](https://developer.mozilla.org//docs/Glossary/Tree_shaking) that you can make to your code, although it's easier to do with libraries than frameworks. 

When you import third-party code into your source code, you typically bundle the code into one or a few output files. For example, the `header.js`, `footer.js`, and `sidebar.js` files are all combined into the `output.js` file, which is the output file that you load in your web app. 

To better understand tree shaking, consider these code examples:

```js
// library.js file
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// main.js file
import {add} from './library.js';

console.log(add(7, 10));
```

For the purpose of demonstration, the `library.js` code sample is kept intentionally small compared to what you might find in the real world, where the library can be thousands of lines long.

A naive bundle process may export the code with this output:

```js
// output.js file
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

console.log(add(7, 10));
```

Even though the `subtract()` function isn't needed in this app, it's still included in the final bundle. Unnecessary code like this increases the download size, parse and compile time, and execution costs that your users must pay. A basic tree-shaking approach removes the dead code and produces this output:

```js
// output.js file
function add(a, b) {
  return a + b;
}

console.log(add(7, 10));
```

Notice that the code is shorter and more succinct. In this example, the performance improvement is negligible, but in a real-world app where the library is thousands of lines long, the performance effect can be much more significant. Interestingly, modern bundle tools, such as Parcel, Webpack, and Rollup go a step further because they combine minification and tree shaking to create a highly optimized bundle. To demonstrate the effectiveness of bundle tools, we used [Parcel](https://parceljs.org/) to create a bundle file with the previous code examples. Parcel removed all unused code and exported this single module: 

```js
console.log(7+10);
```

Parcel is smart enough to remove import statements, function definitions, and behavior among other items to create highly optimized code.

Bundling is only one facet of web performance, but it has a big performance effect, especially with larger libraries. Tree shaking is typically simpler to do with libraries than with frameworks. 

### Software updates

For many libraries and frameworks, software updates add functionality, fix bugs, and ultimately grow in size over time. It's not always necessary to download updates, but if the updates include bug fixes, desired feature enhancements, or security fixes, then you should probably update. However, the more data you send over the wire, the less performant your app and the greater the performance effect on your user experience.

If a library grows in size, you can use tree shaking to mitigate the growth. Alternatively, you can use a smaller alternative to the JavaScript library. For more information, see [Swapability](#swapability).

If a framework grows in size, not only is tree shaking more of a challenge, but it can be harder to swap out one framework for another. For more information, see [Swapability](#swapability). 

{% Aside %}
Framework authors and maintainers invest large efforts to optimize their code so you and your users can benefit. For many popular frameworks and libraries, performance fixes and improvements are often shipped with the software updates. Performance doesn't always get worse over time!</th>
{% endAside%}

## Employability

It's a bit of an open secret that many companies have hard requirements for developers who know a particular framework. They may disregard your knowledge of web fundamentals and focus only on your specific knowledge of a certain JavaScript framework! Right or wrong, this is the reality for many jobs.

Knowledge of a few JavaScript libraries won't harm your job application, but there's little guarantee that it'll make you stand out. If you know a few popular JavaScript frameworks very well, there's a good chance that employers see this knowledge as favorable in the current job market for web developers. Some large enterprise organizations are stuck with very old JavaScript frameworks and may even be desperate for candidates who are comfortable with such frameworks.

You can use this open secret to your advantage. However, approach the job market with caution and with these considerations in mind:

-  Remember that if you spend a large amount of time in your career with only one framework, you may miss out on learning experiences with other, more modern frameworks.
-  Consider a developer who doesn't solidly understand software development or web development fundamentals, yet is hired as a framework developer. This developer doesn't write effective code, and you may find it daunting or overwhelming to work on such a codebase. In some cases, this scenario can lead to burnout. For example, you may have to refactor code or performance-tune the code because it's slow.
-  When you learn web development, the best path is to begin with a heavy focus on the fundamentals of web development, software development, and software engineering. Such a strong foundation helps you to pick up any JavaScript framework quickly and effectively.

## Conclusion

Well done on your hard work in understanding how JavaScript frameworks and libraries compare. You won't pick frameworks or libraries often unless you work on [greenfield](https://en.wikipedia.org/wiki/Greenfield_project) projects or as a consultant. However, when such decisions do arise, the more knowledge you have on the subject, the better informed your decision.

As you have learned, the choice of framework you make—and in some cases, the choice of library—can significantly affect your development experience and end users, such as with performance.