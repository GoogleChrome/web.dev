---
layout: handbook
title: Self-assessments
date: 2020-01-28
description: |
  Learn how to use web.dev's self-assessment components.
---

Self-assessments provide opportunities for users
to check their understanding of concepts covered in your post.

<!--lint disable no-unescaped-template-tags-->
{% from "content/self-assessment.njk" import 'selfAssessment' %}
{{ selfAssessment(assessments[0]) }}
<!--lint disable no-unescaped-template-tags-->
{% Assessment page, 'self-assessment' %}

{% Assessment page, 'self-assessment-2' %}

1. [Start a self-assessment](#start-a-self-assessment)
1. [Question set parameters](#question-set-parameters)
1. [Question anatomy and parameters](#question-anatomy-and-parameters)
1. [Response types](#response-types)
    - [Multiple-choice](#multiple-choice)
    - [Think-and-checks](#think-and-checks)
    - [Composite questions](#composite-questions)
1. [Multiple sets in one post](#multiple-sets-in-one-post)

## Start a self-assessment

To include a self-assessment in your post:
1. Add these lines to your post where you want the self-assessment to appear:
    ```html
    {% raw %}{% from "content/self-assessment.njk" import selfAssessment %}
    {{ selfAssessment(assessments[0]) }}{% endraw %}
    ```
1. Copy `_template-self-assessment.11tydata.js` in `src/site/_drafts/_template-self-assessment`
   to your post's directory.
1. Change the copied file's name to `your-post-directory-name.11tydata.js`.
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
If most of your questions or taller or shorter than the default height,
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

## Question anatomy and parameters
An unanswered self-assessment question includes four components:
- An optional **stimulus** that appears at the top of the question
  and provides any information needed to respond to the question.
  Stimuli may be text, media, or a combination.
  Only one stimulus per question is allowed.
- One or more **stems**, which are the questions or tasks
  the user is being asked to respond to.
  Stems are text only, but they do support inline MarkDown.
- A [response type](#response-types) for each stem.
- An automatically generated question footer,
  which includes the **Check** and **Report issue** buttons.

Once the user submits an answer to a question,
it shows:
- Whether the option is correct or incorrect
- The rationale for the option

### Cardinality

Use the `cardinality` key to control how many options a user may select:
- `n`: The user must select **exactly _n_** options
  before the response is considered complete.
  If _n_&nbsp;>&nbsp;1, all unselected options will be disabled
  when _n_ options are selected.
- `n+`: The user must select **_n_ or more** options
  before the response is considered complete.
- `n–m`: The user must select at **least _n_ and at most _m_** options
  before the response is considered complete.
  All unselected options will be disabled when _m_ options are selected.

For example,
- `cardinality: 1` allows users to select only one option.
- `cardinality: 2+` allows users to select two or more options.
- `cardinality: 2-3` requires users to select two options
  before allowing them to check their answer
  and doesn't allow them to select more than three options.

### Correct answer(s)

Use the `correctAnswers` key to indicate all correct answers to a question
using a comma-separated, zero-indexed list.
For example, `correctAnswers: "0,3"` indicates
that the first and fourth answers are correct.

### Layout

The options of most response types can be presented in two columns
by setting the `columns` key to `true`.
(Response types that don't support a two-column layout
will ignore the `columns` key.)

{% Aside %}
It's almost always best to use a single column for textual options.
For image options,
see which layout best balances legibility and screen real estate.
{% endAside %}

## Response types

### Multiple-choice
The multiple-choice response type lets users respond to a question
by selecting from an array of options,
which can include MarkDown or images.
(But not both! Overstuffing your options can make them artificially hard.)

{% Aside 'warning' %}
To help ensure that users understand what selecting an option will do,
don't include links or any other interactive elements in a multiple-choice option.
{% endAside %}

### Think-and-checks
Think-and-checks let you present a stimulus of some kind
(for example, a code sample) and ask a question about it.
Users can formulate a mental response
and then use the drop-down to check it.

{% Aside 'caution' %}
Since think-and-checks don't provide a way for users to select
and validate an actual response,
it's generally better to use any other [response type](#response-types) instead.
{% endAside %}

### Composite questions
You can use two or more response components in a single question.
<!-- TODO: Explain how to do that -->

{% Aside 'caution' %}
Use composite questions judiciously.
The more response components there are, the harder the question is.
It's better to break up a multi-part question into separate questions
unless the parts are truly interdependent.
{% endAside %}

## Multiple sets in one post
To include another set in your post,
add an assessment object to your `*.11tydata.js` file and
use the appropriate index in the Nunjucks function.
For example, if you want to include the second assessment in the data file,
you'd use:

```html
{% raw %}{{ selfAssessment(assessments[1]) }}{% endraw %}
```
