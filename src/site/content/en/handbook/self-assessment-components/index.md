---
layout: handbook
title: Self-assessments
date: 2020-01-28
description: |
  Learn how to use web.dev's self-assessment components.
---

Self-assessments provide opportunities for users
to check their understanding of concepts covered in your post.

{% Assessment page, 'self-assessment' %}

1. [Start a self-assessment](#start-a-self-assessment)
1. [Multiple sets in one post](#multiple-sets-in-one-post)

## Start a self-assessment

To include a self-assessment in your post:
1. Add this line to your post where you want the self-assessment to appear:
    ```html
    {% raw %}{% Assessment page, 'self-assessment' %}{% endraw %}
    ```
1. Copy `self-assessment.assess.js` in `src/site/_drafts/_template-self-assessment`
   to your post's directory.
1. You can keep the file's name or change it to match
   the topic of your assessment: `your-assessment-topic.assess.js`.
   Just make sure to update the argument in the short code if you do change the file name.
1. Follow the pattern in the file to create your question set.

## Question set parameters

When a self-assessment includes more than one question,
include a statement about what the self-assessment covers
using the `setLeader` key. For example:

```js
setLeader: "Test your knowledge of resource optimization",
```

Self-assessments have a default height of 640&nbsp;px.
(A stable height keeps the location of the **Check** / **Next** button predictable.)
If most of your questions are taller or shorter than the default height,
change it using the `height` key.

You can adjust the labels for the question tabs using the `tabLabel` key.
There are three options:
- `question` (default): creates the label `Question n`,
  where _n_ is the number of the tab in the set.
  Use for sets that mostly ask users to submit a response.
- `sample`: creates the label `Sample n`.
  Use for sets composed mostly of think-and-checks.
- `bare`: creates the label `n`
  Use for larger sets where horizontal space is limited.

## Multiple sets in one post
To include another set in your post,
create a second `*.assess.js` file and
add a second `Assessment` short code to your post.
You can add as many assessments as you want as long as each has a unique name.
For example:

```html
{% raw %}{% Assessment page, 'first-assessment' %}
{% Assessment page, 'second-assessment' %}{% endraw %}
```
