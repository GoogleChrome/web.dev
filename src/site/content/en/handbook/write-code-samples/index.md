---
layout: handbook
title: Write useful code samples
date: 2019-06-26
description: |
  Strategies for using code blocks and sample apps to support the author's purpose on web.dev.
---

This post is about how to use code blocks and sample apps to support your writing goals. If you're looking for how to author code blocks in Markdown, see the [Code](/handbook/markup-code) post.

web.dev uses embedded [Glitches](https://glitch.com/) to embed sample apps in posts and codelabs. See the [Sample apps](/handbook/markup-sample-app) post for information about how to set up a Glitch.

## Typical use cases
Use code blocks when the key concept you want to convey can be understood by looking at code alone. For example, a code block would make sense if you wanted to show the [markup for a well-structured set of HTML heading elements](/headings-and-landmarks/#use-headings-to-outline-the-page).

Use a sample app when it would be helpful to see how code works. For example, you'd use a sample app if you wanted to show how the use of heading elements affects a screen reader.

## Give useful context
Summarize what the sample code or app does before explaining how it does it.

Indicate which details are relevant in longer code blocks by providing explanations and [code highlighting](/handbook/markup-code/#code-highlighting). If readers don't need to understand everything about the code, tell them that—it makes the task less intimidating, especially for less experienced readers.

## Keep it simple
Sample code should be as simple as possible while still conveying the essential concept. (The one exception is [accessibility details](/handbook/inclusion-and-accessibility#create-accessible-code-blocks), which should always be included.) If there are complications that would appear in common real-world applications, provide supplemental codelabs.

## Have a little fun
Code blocks and sample apps are good places to [have fun](/handbook/voice)—as long as the reader doesn't need unrelated background knowledge to understand the concept you're conveying.

For example, you might have a code block showing how to add a name to a group of radio buttons. The group name and input values are incidental to what you're trying to teach, so why not name them something fun for readers who're familiar with video game history?

```html
<label for="inky">
  Inky
  <input type="radio" id="inky" name="ghosts" value="inky" checked>
</label>

<label for="pinky">
  Pinky
  <input type="radio" id="pinky" name="ghosts" value="pinky">
</label>

<label for="clyde">
  Clyde
  <input type="radio" id="clyde" name="ghosts" value="clyde">
</label>
```
