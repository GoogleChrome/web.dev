---
layout: handbook
title: Self-assessment components
date: 2020-01-28
description: |
  Learn how to use web.dev's self-assessment components.
---

## Self-assessment components

1. [Self-assessment callout](#self-assessment-callout)
1. [Tabs](#tabs)
1. [Questions](#questions)
1. [Response types](#response-types)
    - [Multiple-choice](#multiple-choice)
1. [Think-and-checks (Hints)](#think-and-checks)
1. [Putting it all together](#putting-it-all-together)

## Self-assessment callout

Use a self-assessment callout to provide opportunities for users
to check their understanding of concepts covered in your post.

When self-assessments include more than one question,
include a statement about what the self-assessment covers
in the callout shortcode.

```html
{% raw %}{% AssessmentCallout 'Test your knowledge of resource optimization.' %}

Content goes here.

{% endAssessmentCallout %}{% endraw %}
```


{% AssessmentCallout 'Test your knowledge of resource optimization.' %}

Content goes here.

{% endAssessmentCallout %}

## Tabs

Use tabs when your self-assessment includes more than one question.

Include a description of the tabs purpose in the shortcode for accessibility.

You can use three keywords in the Tab shortcode argument
to generate sequentially numbered tab labels:
- `question`: creates the label `Question n`, where _n_ is the number of the tab in the set.
- `sample`: creates the label `Sample n`.
- `bare`: creates the label `n`.

Any other text in the Tab shortcode argument will be presented as-is.

```html
{% raw %}{% Tabs 'Questions for knowledge self check' %}
{% Tab 'question' %}

Here's the content for the first tab.

{% endTab %}
{% Tab 'question' %}

Here's the content for the second tab. It includes a [link](#).

{% endTab %}
{% Tab 'Custom' %}

Here's the content for the third tab. This tab has a custom label.

{% endTab %}
{% endTabs %}{% endraw %}
```

{% Tabs 'Questions for knowledge self check' %}
{% Tab 'question' %}

Here's the content for the first tab.

{% endTab %}
{% Tab 'question' %}

Here's the content for the second tab. It includes a [link](#).

{% endTab %}
{% Tab 'Custom' %}

Here's the content for the third tab. This tab has a custom label.

{% endTab %}
{% endTabs %}

## Questions
A self-assessment question includes three components:
- The question or task the user is being asked to respond to,
  which can be MarkDown or HTML.
- One or more [response types](#response-types)
- An automatically generated question footer,
  which includes the **Check** and **Report issue** buttons

Create a question using the `AssessmentQuestion` shortcode:

```html
{% raw %}{% AssessmentQuestion %}
Question content, including the response type(s), goes here
{% endAssessmentQuestion %}{% endraw %}
```

{% Aside 'gotchas' %}
[Response-type components](#response-types) won't work
if they're not included in a question component.
{% endAside %}

## Response types

### Multiple-choice
The multiple-choice response type lets users respond to a question
by selecting from an array of options,
which can include MarkDown or images.

{% Aside 'warning' %}
To help ensure that users understand what selecting an option will do,
don't include links or any other interactive elements in a multiple-choice option.
{% endAside %}

#### Options
Wrap each option in a `Option` shortcode:

```html
{% raw %}{% AssessmentQuestion %}

When is it appropriate to lazy load an image?

{% ResponseMultipleChoice '1' %}
{% Option %}When the image is offscreen during initial page load.{% endOption %}
{% Option %}When the image is a PNG or JPG.{% endOption %}
{% Option %}When the image has a `lazyload` class.{% endOption %}
{% Option %}When the image is larger than 10&nbsp;KB.{% endOption %}
{% endResponseMultipleChoice %}

{% endAssessmentQuestion %}{% endraw %}
```

{% AssessmentQuestion %}

When is it appropriate to lazy load an image?

{% ResponseMultipleChoice '1' %}
{% Option %}When the image is offscreen during initial page load.{% endOption %}
{% Option %}When the image is a PNG or JPG.{% endOption %}
{% Option %}When the image has a `lazyload` class.{% endOption %}
{% Option %}When the image is larger than 10&nbsp;KB.{% endOption %}
{% endResponseMultipleChoice %}

{% endAssessmentQuestion %}

#### Cardinality

Use the `cardinality` parameter to control how many options a user may select:
- `n`: The user must select **exactly _n_** options
  before the response is considered complete.
  If _n_&nbsp;>&nbsp;1, all unselected options will be disabled
  when _n_ options are selected.
- `n+`: The user must select **_n_ or more** options
  before the response is considered complete.
- `n–m`: The user must select at **least _n_ and at most _m_** options
  before the response is considered complete.
  All unselected options will be disabled when _m_ options are selected.

For example, setting `cardinality` to `1` allows users
to select one option:

```html
{% raw %}{% ResponseMultipleChoice '1' %}{% endraw %}
```

{% AssessmentQuestion %}

When is it appropriate to lazy load an image?

{% ResponseMultipleChoice '1' %}
{% Option %}When the image is offscreen during initial page load.{% endOption %}
{% Option %}When the image is a PNG or JPG.{% endOption %}
{% Option %}When the image has a `lazyload` class.{% endOption %}
{% Option %}When the image is larger than 10&nbsp;KB.{% endOption %}
{% endResponseMultipleChoice %}

{% endAssessmentQuestion %}

Another example: setting `cardinality` to `2+` allows users
to select two or more options:

```html
{% raw %}{% ResponseMultipleChoice '2+' %}{% endraw %}
```

{% AssessmentQuestion %}

Which statements about optimizing third-party resources are accurate?
Choose **two or more** statements.

{% ResponseMultipleChoice '2+' %}
{% Option %}The `async` and `defer` attributes can be used interchangeably.{% endOption %}
{% Option %}Pre-connecting to resources is sometimes appropriate.{% endOption %}
{% Option %}Lazy-loading ads should typically be avoided.{% endOption %}
{% Option %}Resources that don't provide value should be removed.{% endOption %}
{% Option %}Self-hosting resources requires minimal maintenance.{% endOption %}
{% endResponseMultipleChoice %}

{% endAssessmentQuestion %}

#### Layout

Multiple-choice options can be presented in two columns
by setting the `columns` parameter to `true`:

```html
{% raw %}{% ResponseMultipleChoice '1', true %}{% endraw %}
```

{% AssessmentQuestion %}

When is it appropriate to lazy load an image?

{% ResponseMultipleChoice '1', true %}
{% Option %}When the image is offscreen during initial page load.{% endOption %}
{% Option %}When the image is a PNG or JPG.{% endOption %}
{% Option %}When the image has a `lazyload` class.{% endOption %}
{% Option %}When the image is larger than 10&nbsp;KB.{% endOption %}
{% endResponseMultipleChoice %}

{% endAssessmentQuestion %}

{% Aside %}
Always use a single column for textual options.
For image options,
see which layout best balances legibility and screen real estate.
{% endAside %}

## Think-and-checks
Think-and-checks (also known as Hints) let you present a stimulus of some kind
(for example, a code sample) and ask a question about it.
The user can formulate a mental response
and then use the drop-down to check it.

{% Aside 'caution' %}
Since think-and-checks don't provide a way for users to select
and validate an actual response,
it's generally better to use a [response type](#response-types) instead.
{% endAside %}

````html
```html
<label for="pwd-input">Password</label>

<input type="text" role="textbox" id="pwd-input" name="password">
```

{% raw %}{% AssessmentHint 'Does the sample need ARIA?' %}
**No.** This sample is **incorrect**.
Since the text input is a native HTML form element,
it doesn't need ARIA for its semantics.
To fix the sample, remove the `role` attribute from the `<input>` element.
{% endAssessmentHint %}{% endraw %}

````

```html
<label for="pwd-input">Password</label>

<input type="text" role="textbox" id="pwd-input" name="password">
```

{% AssessmentHint 'Does the sample need ARIA?' %}
**No.** This sample is **incorrect**.
Since the text input is a native HTML form element,
it doesn't need ARIA for its semantics.
To fix the sample, remove the `role` attribute from the `<input>` element.
{% endAssessmentHint %}

## Putting it all together

Here's an example of a multi-question self-assessment. It includes:
- The self-assessment callout
- Tabs
- Multiple-choice questions with different cardinalities and layouts

{% AssessmentCallout 'Test your knowledge of resource optimization.' %}

{% Tabs 'Questions for knowledge self check' %}
{% Tab 'question' %}

{% AssessmentQuestion %}

When is it appropriate to lazy load an image?

{% ResponseMultipleChoice '1' %}
{% Option %}When the image is offscreen during initial page load.{% endOption %}
{% Option %}When the image is a PNG or JPG.{% endOption %}
{% Option %}When the image has a `lazyload` class.{% endOption %}
{% Option %}When the image is larger than 10&nbsp;KB.{% endOption %}
{% endResponseMultipleChoice %}

{% endAssessmentQuestion %}

{% endTab %}
{% Tab 'question' %}

Here's the content for the second tab. It includes a [link](#).

{% endTab %}
{% Tab 'question' %}

Here's the content for the third tab. This tab has a custom label.

{% endTab %}
{% endTabs %}

{% endAssessmentCallout %}
