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
    {% raw %}{% Assessment page, 'my-first-self-assessment' %}{% endraw %}
    ```
1. Copy `my-first-self-assessment.assess.yml` in `src/site/_drafts/_template-self-assessment`
   to your post's directory.
1. Change the file's name to match
   the topic of your assessment: `your-assessment-topic.assess.yml`.
1. Update the argument in the short code to match the new file name.
1. Using the YAML template as a starting point,
   follow the instructions below to create your question set.

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
On mobile, the set leader will appear on its own with an **Open quiz** button,
so make sure the set leader makes sense whether or not the questions are visible.
{% endAside %}

### Height

Self-assessments have a default question content height of 400&nbsp;px.
(A stable height keeps the location of the **Check** / **Next** button predictable.)

If most of your questions are taller or shorter than the default height,
change it using the `height` key.

If you want each question's height to match its content, set `height` to `unset`.
(Note that this will cause the self-assessment height to change
as users check their responses and navigate across items.)

### Question labels

You can adjust the labels for the question tabs using the `tabLabel` key.
There are three options:
- `question` (default): creates the label `Question n`,
  where _n_ is the number of the tab in the set.
  Use for sets that mostly ask users to submit a response.
- `sample`: creates the label `Sample n`.
  Use for sets composed mostly of [think-and-checks](#think-and-checks).
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
