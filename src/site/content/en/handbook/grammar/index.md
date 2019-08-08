---
layout: handbook
title: Grammar, mechanics, and usage
date: 2019-06-26
description: |
  A list of grammar, mechanics, and usage rules for web.dev, followed by a list of style and usage references.
---

<style>
  img[src*="icon"] {
    max-width: 32px;
    vertical-align: middle;
  }

  img[src*="bordered"] {
    border: 1px solid #949494;
    border-radius: 5px;
  }
</style>

Grammar and mechanics are important for making writing clear, but don't let them get in the way of putting text on the page! Content reviewers will always support you with editorial stuff. That said, here are a few conventions to be aware of.

## Instructions
Use second person (_you_) rather than first person (_we_) except in rare cases where you're providing a rationale for a recommendation (e.g., "We chose this library because…").

Begin instructions with the objective rather than the action.

{% Compare 'worse', "Don't" %}
> Drag a photo to the trash to remove it from an album.

{% endCompare %}

{% Compare 'better', 'Do' %}
> To remove a photo from an album, drag it to the trash.

{% endCompare %}

Favor the imperative mood (giving commands) over declarative (making statements) in instructions.

{% Compare 'worse', "Don't" %}
> You will click **Run Audit**.

{% endCompare %}

{% Compare 'better', 'Do' %}
> Click **Run Audit**.

{% endCompare %}

Avoid using _can_ in instructions unless you really mean to convey that the step is optional.

## Linking
Don't include preceding articles (_a_, _an_, _the_) or surrounding punctuation in link text.

{% Compare 'worse', "Don't" %}
> See [the "Easily discoverable" collection](/discoverable) for more information.

{% endCompare %}

{% Compare 'better', 'Do' %}
> See the [Easily discoverable](/discoverable) collection for more information.

{% endCompare %}

When referring to webpages, either on web.dev or elsewhere, hyperlink the webpage title only, without quotation marks. (See example above.)

Libraries and tools should be linked the first time they're mentioned.

## Lists
Use an ordered list (numbers) when instructing the reader to perform a series of actions.

{% Compare 'better', 'Good' %}
1. Click **Remix to Edit** to make the project editable.
1. Click **Tools**.
1. Click **Console**.
{% endCompare %}

<!-- lint disable no-inline-padding -->
Use an unordered list (bullets) when breaking down sub-steps of an action.
{% Compare 'better', 'Good' %}
1. Do the hokey pokey:
    * Put your left foot in.
    * Take your left foot out.
    * Put your left foot in and shake it all about.
{% endCompare %}
<!-- lint enable no-inline-padding -->

Use an unordered list item for a standalone action.


{% Compare 'better', 'Good' %}
* To preview the site, press **View App**. Then press **Fullscreen**.
{% endCompare %}

## Numbers
In general, spell out integers from one to nine unless:
* The integer is attached to a unit (e.g., _3 KB_, _page 3_).
* The integer is in the same sentence as a number larger than nine (e.g., "The menu contains 15 options, but 6 of them are disabled.")

Use numerals for decimals and numbers higher than nine.

## Pronouns
Avoid ambiguous pronouns. Follow the advice on the GDDSC [Pronouns](https://developers.google.com/style/pronouns) page. Also avoid pronouns that refer to clauses or phrases, which can complicate translation into some languages.

{% Compare 'worse', "Don't" %}
> Speed optimizations often regress quickly. Performance budgets are one way to address this.

{% endCompare %}

{% Compare 'better', 'Do' %}
> Speed optimizations often regress quickly. Performance budgets are one way to address this problem.

{% endCompare %}

## Punctuation
### Ampersands
Don't use ampersands unless one is part of a company or brand name.

{% Compare 'worse', "Don't" %}
> Safe & secure

{% endCompare %}

{% Compare 'better', 'Do' %}
> Safe and secure

{% endCompare %}

### Commas
Use the serial comma before the last item in a list.

{% Compare 'worse', "Don't" %}
> React, Vue and Angular are popular frameworks.

{% endCompare %}

{% Compare 'better', 'Do' %}
> React, Vue, and Angular are popular frameworks.

{% endCompare %}

### Dashes and hyphens
Use hyphens (-) with no surrounding space to link words together (e.g., _two-year-old_).

Use em dashes (—) with no surrounding space—like this—to set off an aside.

Use an en dash (–) for ranges (e.g., _10–100 KB_).

### Quotation marks and apostrophes
Use straight quotation marks and apostrophes, not smart (curly).

<!-- lint disable no-smart-quotes -->
{% Compare 'worse', "Don't" %}
> The “Accessible to all” collection
<!-- lint enable no-smart-quotes -->

{% endCompare %}

{% Compare 'better', 'Do' %}
> The "Accessible to all" collection

{% endCompare %}

Periods and commas always go inside quotation marks. Question marks and exclamation points go inside quotation marks if they're part of the quotation; outside if not.

{% Compare 'worse', "Don't" %}
> Jane said, "Reader, I married him".

{% endCompare %}

{% Compare 'better', 'Do' %}
> Jane said, "Reader, I married him."

{% endCompare %}

## Text formatting
Bold words for emphasis sparingly. (The primary use for bolding is [indicating UI element names](/handbook/grammar/#ui-elements-and-interaction).)

Avoid mixing code font and standard font in a single word.

{% Compare 'worse', "Don't" %}
> `integer`s

{% endCompare %}

{% Compare 'better', 'Do' %}
> `integer` values

{% endCompare %}

## Titles and headings
Use sentence case for titles and headings.

{% Compare 'worse', "Don't" %}
> Optimize Your Images

{% endCompare %}

{% Compare 'better', 'Do' %}
> Optimize your images

{% endCompare %}

Use imperative mood for titles and headings whenever possible.

{% Compare 'worse', "Don't" %}
> Optimizing your images

{% endCompare %}

{% Compare 'better', 'Do' %}
> Optimize your images

{% endCompare %}

## UI elements and interaction
Bold the names of UI elements and Lighthouse audits.

{% Compare 'worse', "Don't" %}
> In the New Project window, select the "New Activity" checkbox, and then click "Next."

{% endCompare %}

{% Compare 'better', 'Do' %}
> In the **New Project** window, select the **New Activity** checkbox, and then click **Next**.

{% endCompare %}

{% Compare 'better', 'Do' %}
> To find slow third-party scripts, check the **Reduce JavaScript execution time** and **Avoid enormous network payloads** audits in the **Diagnostics** section.

{% endCompare %}

When referring to a button with an icon but no label, use the name of the button as shown in the tooltip, and add the button icon immediately after. Don't style the icon unless the button would be difficult to recognize without its original styling.

{% Compare 'worse', "Don't" %}
> Click ![Fullscreen icon](fullscreen.png#_icon).

{% endCompare %}

{% Compare 'better', 'Do' %}
> Click **Fullscreen** ![Fullscreen icon](fullscreen.png#_icon_bordered).

{% endCompare %}

To refer to a keyboard key:
* Use the key's name in code font.
* Spell out the names of modifier keys.
* To refer to a key combination, use the form _Modifier+Key_ (no spaces).
* When the reader may be on either Windows or Mac, put the Mac shortcut in parentheses after the Windows shortcut.

{% Compare 'worse', "Don't" %}
> To copy, press Ctrl + C (⌘ + C).

{% endCompare %}

{% Compare 'better', 'Do' %}
> To copy, press `Control+C` (or `Command+C` on Mac).

{% endCompare %}

Use _pane_ to refer to the content areas associated with tabs—unless you're referring to an area in DevTools; then use _panel_.

## Units
Use _KB_ for kilobytes, _kb_ for kilobits.

Add a space before units.

{% Compare 'worse', "Don't" %}
> 100KB

{% endCompare %}

{% Compare 'better', 'Do' %}
> 100 KB

{% endCompare %}

## Usage
To maintain a conversational tone, use common contractions.

{% Compare 'worse', "Don't" %}
> This collection assumes that you are already familiar with Angular.

{% endCompare %}

{% Compare 'better', 'Do' %}
> This collection assumes that you're already familiar with Angular.

{% endCompare %}

Use consistent vocabulary throughout a piece and the collection it lives in.

Acronyms should be spelled out the first time they're used, with the acronym following immediately after in parentheses.

{% Compare 'worse', "Don't" %}
> WICG

{% endCompare %}

{% Compare 'better', 'Do' %}
> Web Incubation Community Groups (WICG)

{% endCompare %}

## References
These are the references content reviewers use when reviewing posts and codelabs for editorial issues beyond the ones covered in this post. They worry about this stuff so you don't have to!
* The [Google Developer Documentation Style Guide](https://developers.google.com/style/) (GDDSG) is the primary reference for writing style issues.
* If a style issue isn't covered in the GDDGS, check the [Chicago Manual of Style](https://www.chicagomanualofstyle.org/home.html).
* [Merriam-Webster](http://www.m-w.com) is the primary reference for spelling and capitalization.
* The [Word list](/handbook/word-list) provides spelling and capitalization conventions specific to web.dev.
