---
layout: handbook
title: Self-assessments
date: 2020-01-28
description: |
  Learn how to use web.dev's self-assessment components.
---

Self-assessments provide opportunities for users
to check their understanding of concepts covered in your post.

{% Assessment 'self-assessment' %}

1. [Start a self-assessment](#start-a-self-assessment)
1. [Response types](#response-types)
    - [Multiple-choice](#multiple-choice)
    - [Think-and-checks](#think-and-checks)
    - [Composite questions](#composite-questions)
1. [Question set parameters](#question-set-parameters)
1. [Question anatomy and parameters](#question-anatomy-and-parameters)
1. [Multiple sets in one post](#multiple-sets-in-one-post)
1. [Example assessment](#example-assessment)
1. [API](#api)
    - [TargetAssessment](#targetassessment)
    - [TargetAssessmentQuestion](#targetassessmentquestion)
    - [TargetAssessmentOption](#targetassessmentoption)

## Start a self-assessment

To include a self-assessment in your post:
1. Add this shortcode to your post where you want the self-assessment to appear:
    ```html
    {% raw %}{% Assessment 'my-first-self-assessment' %}{% endraw %}
    ```
1. Copy `my-first-self-assessment.assess.yml` in `src/site/_drafts/_template-self-assessment`
   to your post's directory.
1. Change the file's name to match
   the topic of your assessment: `your-assessment-topic.assess.yml`.
1. Update the argument in the short code to match the new file name.
1. Using the YAML template as a starting point,
   follow the instructions below to create your question set.

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

{% Details %}

{% DetailsSummary 'h4' %}
multiple-choice.assess.yml
{% endDetailsSummary %}

```yml
{% include './multiple-choice.assess.yml' %}
```

{% endDetails %}

{% Assessment 'multiple-choice' %}

### Think-and-checks
Think-and-checks let you present a stimulus of some kind
(for example, a code sample) and ask a question about it.
Users can formulate a mental response and then check it.

Since think-and-checks don't have any options to submit,
there's no need to provide `cardinality` or `correctAnswers` keys.

{% Aside 'caution' %}
Since think-and-checks don't provide a way for users to select
and validate an actual response,
it's generally better to use any other [response type](#response-types) instead.
{% endAside %}

{% Details %}

{% DetailsSummary 'h4' %}
think-and-check.assess.yml
{% endDetailsSummary %}

```yml
{% include './think-and-check.assess.yml' %}
```

{% endDetails %}

{% Assessment 'think-and-check' %}

### Composite questions
You can include more than one response component in a single question.

To do that, add a `components` key to the question object
and then include all question data _except_ the stimulus in each component object.
(Each question can have only one stimulus.)

{% Aside 'caution' %}
Use composite questions judiciously.
The more response components there are, the harder the question is.
It's better to break up a multi-part question into separate questions
unless the parts are truly interdependent.
{% endAside %}

{% Details %}

{% DetailsSummary 'h4' %}
composite.assess.yml
{% endDetailsSummary %}

```yml
{% include './composite.assess.yml' %}
```

{% endDetails %}

{% Assessment 'composite' %}

## Question set parameters

### Set leader

When a self-assessment includes more than one question,
add a **set leader**—a statement about what the question set
as a whole covers—using the `setLeader` key. For example:

```yaml
setLeader: Test your knowledge of resource optimization
```

You can omit the `setLeader` if there's only one question in the set.
(One-question sets will ignore a `setLeader` if you accidentally include one.)

{% Aside %}
On mobile, the set leader appears on its own with an **Open quiz** button
that launches the self-assessment set in a modal,
so make sure the set leader makes sense whether or not the questions are visible.
{% endAside %}

### Height

Self-assessments have a default question content height of 400&nbsp;px.
(A stable height keeps the location of the **Check** / **Next** button predictable.)

If most of your questions are taller or shorter than the default height,
change it using the `height` key.

If you want each question's height to match its content, set `height` to `unset`.
(Note that this will cause the self-assessment height to change
as users check their responses and navigate across questions.)

### Question labels

You can adjust the labels for the question tabs using the `tabLabel` key.
There are three options:
- `question` (default): creates the label `Question n`,
  where _n_ is the number of the tab in the set.
  Use for sets that mostly ask users to submit a response.
- `sample`: creates the label `Sample n`.
  Use for sets that mostly ask users to evaluate code samples.
- `bare`: creates the label `n`
  Use for larger sets where horizontal space is limited.

## Question anatomy and parameters
A self-assessment question includes four components:
- An optional **stimulus** that appears at the top of the question
  and provides any information needed to respond to the question.
  Stimuli may be text, media, or a combination.
  Only one stimulus per question is allowed.
- One or more **stems**, which are the questions or tasks
  the user is being asked to respond to.
  Stems are text only, but they do support inline MarkDown.
- A [response type](#response-types) for each stem,
  which includes several options to choose from
  and accompanying rationales. Rationales are initially hidden.
- An automatically generated question footer,
  which includes the **Check** and **Report issue** buttons.

Once the user submits an answer to a question,
the question shows:
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
- `cardinality: "1"` allows users to select only one option.
- `cardinality: "2+"` allows users to select two or more options.
- `cardinality: "2-3"` requires users to select two options
  before allowing them to check their answer
  and doesn't allow them to select more than three options.

{% Aside 'gotchas' %}
Put quotes around `cardinality` values
so YAML doesn't incorrectly interpret them as numbers.
{% endAside %}

### Correct answer(s)

Use the `correctAnswers` key to indicate all correct answers to a question
using a comma-separated, zero-indexed list.
For example, `correctAnswers: "0,3"` indicates
that the first and fourth answers are correct.

{% Aside 'gotchas' %}
Put quotes around `correctAnswers` values
so YAML doesn't incorrectly interpret them as numbers.
{% endAside %}

### Layout

The options of most [response types](#response-types) can be presented in two columns
by setting the `columns` key to `true`.
(Response types that don't support a two-column layout
will ignore the `columns` key.)

{% Aside %}
It's almost always best to use a single column for textual options.
For image options,
see which layout best balances legibility and screen real estate.
{% endAside %}

## Multiple sets in one post
To include another set in your post,
create a second `*.assess.yml` file and
add a second `Assessment` short code to your post.
You can add as many assessments as you want as long as each has a unique name.
For example:

```html
{% raw %}{% Assessment 'first-assessment' %}
{% Assessment 'second-assessment' %}{% endraw %}
```

## API

The `*.assess.yml` file can be broken down into the following types:

### TargetAssessment
```typescript
{% include '../../../../../../types/site/_includes/components/Assessment/TargetAssessment.d.ts' %}
```

### TargetAssessmentQuestion
```typescript
{% include '../../../../../../types/site/_includes/components/Assessment/TargetAssessmentQuestion.d.ts' %}
```

### TargetAssessmentOption
```typescript
{% include '../../../../../../types/site/_includes/components/Assessment/TargetAssessmentOption.d.ts' %}
```
