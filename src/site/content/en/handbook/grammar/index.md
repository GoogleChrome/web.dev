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

<div class="w-columns">
{% Compare 'worse' %}
Drag a photo to the trash to remove it from an album.
{% endCompare %}

{% Compare 'better' %}
To remove a photo from an album, drag it to the trash.
{% endCompare %}
</div>

Favor the imperative mood (giving commands) over declarative (making statements) in instructions.

<div class="w-columns">
{% Compare 'worse' %}
You will click **Run Audit**.
{% endCompare %}

{% Compare 'better' %}
Click **Run Audit**.
{% endCompare %}
</div>

Avoid using _can_ in instructions unless you really mean to convey that the step is optional.

## Linking
Don't include preceding articles (_a_, _an_, _the_) or surrounding punctuation in link text.

<div class="w-columns">
{% Compare 'worse' %}
See [the "Easily discoverable" collection](/discoverable) for more information.
{% endCompare %}

{% Compare 'better' %}
See the [Easily discoverable](/discoverable) collection for more information.
{% endCompare %}
</div>

When referring to webpages, either on web.dev or elsewhere, hyperlink the webpage title only, without quotation marks. (See example above.)

Libraries and tools should be linked the first time they're mentioned.

## Lists
Use an ordered list (numbers) when instructing the reader to perform a series of actions.

{% Compare 'better', 'Good' %}
{% Instruction 'remix', 'ol' %}
{% Instruction 'console', 'ol' %}
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
{% Instruction 'preview' %}
{% endCompare %}

## Numbers
In general, spell out integers from one to nine unless:
* The integer is attached to a unit (e.g., _3 KB_, _page 3_).
* The integer is in the same sentence as a number larger than nine (e.g., "The menu contains 15 options, but 6 of them are disabled.")

Use numerals for decimals and numbers higher than nine.

## Pronouns
Avoid ambiguous pronouns. Follow the advice on the GDDSC [Pronouns](https://developers.google.com/style/pronouns) page. Also avoid pronouns that refer to clauses or phrases, which can complicate translation into some languages.

<div class="w-columns">
{% Compare 'worse' %}
Speed optimizations often regress quickly. Performance budgets are one way to address this.
{% endCompare %}

{% Compare 'better' %}
Speed optimizations often regress quickly. Performance budgets are one way to address this problem.
{% endCompare %}
</div>

## Punctuation
### Ampersands
Don't use ampersands unless one is part of a company or brand name.

<div class="w-columns">
{% Compare 'worse' %}
Safe & secure
{% endCompare %}

{% Compare 'better' %}
Safe and secure
{% endCompare %}
</div>

### Commas
Use the serial comma before the last item in a list.

<div class="w-columns">
{% Compare 'worse' %}
React, Vue and Angular are popular frameworks.
{% endCompare %}

{% Compare 'better' %}
React, Vue, and Angular are popular frameworks.
{% endCompare %}
</div>

### Dashes and hyphens
Use hyphens (-) with no surrounding space to link words together (e.g., _two-year-old_).

Use em dashes (—) with no surrounding space—like this—to set off an aside.

Use an en dash (–) for ranges (e.g., _10–100 KB_).

### Quotation marks and apostrophes
Use straight quotation marks and apostrophes, not smart (curly).

<div class="w-columns">
<!-- lint disable no-smart-quotes -->
{% Compare 'worse' %}
The "Accessible to all" collection
{% endCompare %}
<!-- lint enable no-smart-quotes -->

{% Compare 'better' %}
The "Accessible to all" collection
{% endCompare %}
</div>

Periods and commas always go inside quotation marks. Question marks and exclamation points go inside quotation marks if they're part of the quotation; outside if not.

<div class="w-columns">
{% Compare 'worse' %}
Jane said, "Reader, I married him".
{% endCompare %}

{% Compare 'better' %}
Jane said, "Reader, I married him."
{% endCompare %}
</div>

## Text formatting
Bold words for emphasis sparingly. (The primary use for bolding is [indicating UI element names](/handbook/grammar/#ui-elements-and-interaction).)

Avoid mixing code font and standard font in a single word.

<div class="w-columns">
{% Compare 'worse' %}
`integer`s
{% endCompare %}

{% Compare 'better' %}
`integer` values
{% endCompare %}
</div>

## Titles and headings
Use sentence case for titles and headings.

<div class="w-columns">
{% Compare 'worse' %}
Optimize Your Images
{% endCompare %}

{% Compare 'better' %}
Optimize your images
{% endCompare %}
</div>

Use imperative mood for titles and headings whenever possible.

<div class="w-columns">
{% Compare 'worse' %}
Optimizing your images
{% endCompare %}

{% Compare 'better' %}
Optimize your images
{% endCompare %}
</div>

## UI elements and interaction
Bold the names of UI elements and Lighthouse audits.

{% Compare 'worse' %}
In the New Project window, select the "New Activity" checkbox, and then click "Next."
{% endCompare %}

{% Compare 'better' %}
In the **New Project** window, select the **New Activity** checkbox, and then click **Next**.
{% endCompare %}

{% Compare 'better' %}
To find slow third-party scripts, check the **Reduce JavaScript execution time** and **Avoid enormous network payloads** audits in the **Diagnostics** section.
{% endCompare %}

When referring to a button with an icon but no label, use the name of the button as shown in the tooltip, and add the button icon immediately after. Don't style the icon unless the button would be difficult to recognize without its original styling.

<div class="w-columns">
{% Compare 'worse' %}
Click ![Fullscreen icon](fullscreen.png#_icon).
{% endCompare %}

{% Compare 'better' %}
Click **Fullscreen** ![Fullscreen icon](fullscreen.png#_icon_bordered).
{% endCompare %}
</div>

To refer to a keyboard key:
* Use the key's name in code font.
* Spell out the names of modifier keys.
* To refer to a key combination, use the form _Modifier+Key_ (no spaces).
* When the reader may be on either Windows or Mac, put the Mac shortcut in parentheses after the Windows shortcut.

<div class="w-columns">
{% Compare 'worse' %}
To copy, press Ctrl + C (⌘ + C).
{% endCompare %}

{% Compare 'better' %}
To copy, press `Control+C` (or `Command+C` on Mac).
{% endCompare %}
</div>

Use _pane_ to refer to the content areas associated with tabs—unless you're referring to an area in DevTools; then use _panel_.

## Units
Use _KB_ for kilobytes, _kb_ for kilobits.

Add a space before units.

<div class="w-columns">
{% Compare 'worse' %}
100KB
{% endCompare %}

{% Compare 'better' %}
100 KB
{% endCompare %}
</div>

## Usage
To maintain a conversational tone, use common contractions.

<div class="w-columns">
{% Compare 'worse' %}
This collection assumes that you are already familiar with Angular.
{% endCompare %}

{% Compare 'better' %}
This collection assumes that you're already familiar with Angular.
{% endCompare %}
</div>

Use consistent vocabulary throughout a piece and the collection it lives in.

Acronyms should be spelled out the first time they're used, with the acronym following immediately after in parentheses.

<div class="w-columns">
{% Compare 'worse' %}
WICG
{% endCompare %}

{% Compare 'better' %}
Web Incubation Community Groups (WICG)
{% endCompare %}
</div>

## References
These are the references content reviewers use when reviewing posts and codelabs for editorial issues beyond the ones covered in this post. They worry about this stuff so you don't have to!
* The [Google Developer Documentation Style Guide](https://developers.google.com/style/) (GDDSG) is the primary reference for writing style issues.
* If a style issue isn't covered in the GDDGS, check the [Chicago Manual of Style](https://www.chicagomanualofstyle.org/home.html).
* [Merriam-Webster](http://www.m-w.com) is the primary reference for spelling and capitalization.
* The [Word list](/handbook/word-list) provides spelling and capitalization conventions specific to web.dev.
