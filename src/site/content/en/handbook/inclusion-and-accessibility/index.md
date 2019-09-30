---
layout: handbook
title: Inclusion and accessibility
date: 2019-06-26
description: |
  This handbook helps contributors to web.dev create effective, engaging content
  and get it published as easily as possible.
---

web.dev has a large international audience. Members of that audience should be able to access and understand web.dev content, and they should feel included in the ways we speak to our readers.

## Use readable language
Aim for a grade 8 reading level when possible. If you don't have a feel for what grade 8 texts look like, check out some [examples on Newsela](https://newsela.com/articles/#/rule/latest?grade_levels=8.0). If you're feeling frisky, you can also run your text through a readability test.
* [TextEvaluator](http://textevaluator.ets.org/TextEvaluator/) can be used for pieces up to 1,600 words.
* You can also use [Lexile](https://lexile.com/educators/tools-to-support-reading-at-school/tools-to-determine-a-books-complexity/the-lexile-analyzer/) for pieces up to 1,000 words.

Admittedly, web.dev tends to deal with technical content, so the reading level will sometimes be high. But the following guidelines will help keep your language as accessible as it can be.

Prefer shorter, simpler sentences.

{% Compare 'worse' %}
We also include an HTML table of buttons for accessibility reasons that is on top of the canvases but is made invisible using `opacity: 0`.
{% endCompare %}

{% Compare 'better' %}
We also include an HTML table of buttons to improve accessibility. The table sits on top of the canvases and is made invisible using `opacity: 0`.
{% endCompare %}

Prefer commonly used words that your [audience](/handbook/audience) is likely to be familiar with over specialized vocabulary. If you need help finding a more accessible alternative, the [Merriam-Webster Learner's Dictionary](http://learnersdictionary.com/) is a handy tool.

{% Compare 'worse' %}
In some scripts, graphemes can be visually joined when they're adjacent.

{% CompareCaption %}
_Script_ and _grapheme_ are very precise\, but they\'re likely to be unfamiliar to most readers and may cause confusion since readers probably more commonly see _script_ referring to a piece of code.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
In some written languages, certain characters can be visually joined when they're adjacent.

{% CompareCaption %}
While _written language_ and _character_ are slightly less precise\, they should be more familiar and less likely to cause misunderstandings.
{% endCompareCaption %}
{% endCompare %}

If you must use a word that your audience is unlikely to know, provide a definition using the [Key-term Aside component](/handbook/web-dev-components#asides).

## Make information easy to find
Headings [shouldn't skip levels](/heading-levels). Also, don't add custom styles to headings—it makes the page hierarchy more difficult to follow for sighted readers.

Spell out acronyms the first time they're used. For example: _Web Incubation Community Groups (WICG)_.

Exceptions, edge cases, and other kinds of supplemental information should be right next to the primary content they're related to.

## Use inclusive images
Always provide [alt text](/image-alt).

If you're creating an illustration, the parts that are essential for understanding the illustration should have a contrast ratio of at least 3:1. You can verify the contrast using checkers like the ones from [WeAIM](https://webaim.org/resources/contrastchecker/) or the [Paciello Group](https://developer.paciellogroup.com/resources/contrastanalyser/).

Avoid images that may exclude certain audience members. Just like when we _write_ about people, we must remain inclusive when we _show_ people and the things they do and make. For example, avoid stock photos that show only male developers.

## Create accessible code blocks
While code blocks should be as [simple as possible](/handbook/style#keep-it-simple), they must always include accessibility best practices. At a minimum:
* Form elements should have [labels](/labels-and-text-alternatives/#label-form-elements).
* Images should have [alt text](/image-alt).

In the rare case that you need to omit an accessibility detail to better convey what you're teaching,
1. Add a note explaining that the developer needs to include accessibility features.
1. Link to the relevant post in the web.dev [Accessible to all](/accessible) collection.

## Writing about people
There are several excellent online guides for using inclusive language when writing about groups of people. The [Content Guide](https://content-guide.18f.gov/inclusive-language/) from 18F (a U.S. government office that helps other agencies improve their user experience) is a great place to start.

To be more gender inclusive, use _they/them_ for singular personal pronouns instead of _he/him_ and _she/her_. However, if you can use a plural pronoun instead, that's ideal.

{% Compare 'better', 'Good' %}
If the reader is interested in diving deeper after reading web.dev, they can turn to other sources.
{% endCompare %}

{% Compare 'better', 'Better' %}
If readers are interested in diving deeper after reading web.dev, they can turn to other sources.
{% endCompare %}

## Writing for an international audience
Avoid idioms. If non-native speakers aren't familiar with the idiom, they may be confused.

{% Compare 'worse' %}
The sample app should work now. Give it a shot!
{% endCompare %}

{% Compare 'better' %}
The sample app should work now. Try it!
{% endCompare %}

Don't rely on cultural references alone to convey essential information. It's likely that at least some of your audience won't know the same movies, TV, books, and games that you do. While a reference here and there can [add personality](/handbook/voice) to your writing, make sure readers can understand your ideas even if they don't catch the reference.
