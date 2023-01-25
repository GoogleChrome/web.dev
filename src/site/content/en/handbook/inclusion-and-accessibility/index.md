---
layout: handbook
title: Inclusion and accessibility
date: 2019-06-26
description: |
  Learn how to write for an international audience with varying needs and preferences.
---

web.dev has a large international audience. We want members of that audience to access and understand web.dev content, and they should feel included in the ways we speak to our readers.

## Use readable language
Aim for a grade 8 reading level when possible. If you don't have a feel for what grade 8 texts look like, check out some [examples on Newsela](https://newsela.com/articles/#/rule/latest?grade_levels=8.0). You can also run your text through a readability test.
* For pieces up to 1,600 words, use [TextEvaluator](http://textevaluator.ets.org/TextEvaluator/).
* For pieces up to 1,000 words, use [Lexile](https://lexile.com/educators/tools-to-support-reading-at-school/tools-to-determine-a-books-complexity/the-lexile-analyzer/).

It can be difficult to write technical content for a grade 8 reading level. The following guidelines help keep your language as accessible as it can be.

Write shorter, simpler sentences.

{% Compare 'worse', 'Don\'t' %}
> We also include an HTML table of buttons for accessibility reasons that is on top of the canvases but is made invisible using opacity: 0.

{% endCompare %}

{% Compare 'better', 'Do' %}
> We also include an HTML table of buttons to improve accessibility. The table sits on top of the canvases and is made invisible using opacity: 0.

{% endCompare %}

Use commonly used words that your [audience](/handbook/audience) is likely to be familiar with instead of specialized vocabulary. If you need help finding a more accessible alternative, the [Merriam-Webster Learner's Dictionary](http://learnersdictionary.com/) is a handy tool.

{% Compare 'worse', 'Don\'t' %}
> In some scripts, graphemes can be visually joined when they're adjacent.

_Script_ and _grapheme_ are very precise, but they're likely to be unfamiliar to most readers and may cause confusion since readers probably more commonly see _script_ referring to a piece of code.
{% endCompare %}

{% Compare 'better', 'Do' %}
> In some written languages, certain characters can be visually joined when they're adjacent.

While _written language_ and _character_ are slightly less precise, they should be more familiar and less likely to cause misunderstandings.
{% endCompare %}

If you must use a word that your audience is unlikely to know, provide a definition using the [Key-term Aside component](/handbook/web-dev-components#asides).

## Make information easy to find
[Don't skip heading levels](/heading-levels). Don't add custom styles to headings—it makes the page hierarchy more difficult to follow.

Spell out acronyms the first time they're used. For example: _Web Incubation Community Groups (WICG)_.

Place exceptions, edge cases, and other kinds of supplemental information right next to the primary content they're related to.

## Use inclusive images
Always provide [alt text](/image-alt).

If you're creating an illustration, the parts that are essential for understanding the illustration should have a contrast ratio of at least 3:1. You can verify the contrast using checkers like the ones from [WeAIM](https://webaim.org/resources/contrastchecker/) or the [Paciello Group](https://developer.paciellogroup.com/resources/contrastanalyser/).

Avoid images that may exclude certain audience members. Just like when you _write_ about people, remember to be inclusive when you _show_ people and the things they do and make. For example, avoid stock photos that show only male developers.

## Create accessible code blocks
Make sure code blocks are [simple](/handbook/quality/#keep-it-simple) and follow accessibility best practices. At a minimum:
* Add [labels](/labels-and-text-alternatives/#label-form-elements) to form elements.
* Include [alt text](/image-alt) for every image.

In the rare case that you need to omit an accessibility detail to better convey what you're teaching,
1. Add a note explaining that the developer needs to include accessibility features.
1. Link to the relevant post in the web.dev "[Accessible to all](/accessible)" collection.

## Writing about people
There are several excellent online guides for using inclusive language when writing about groups of people. The [Content Guide](https://content-guide.18f.gov/inclusive-language/) from 18F (a U.S. government office that helps other agencies improve their user experience) is a great place to start.

To be more gender inclusive, use _they/them_ for singular personal pronouns instead of _he/him_ and _she/her_. However, it's ideal to make it plural.

{% Compare 'better', 'Good' %}
> If the reader is interested in diving deeper after reading web.dev, they can turn to other sources.

{% endCompare %}

{% Compare 'better', 'Better' %}
> If readers are interested in diving deeper after reading web.dev, they can turn to other sources.

{% endCompare %}

## Writing for an international audience
Avoid idioms. If speakers whose first language isn't English aren't familiar with the idiom, they may be confused. Also, idioms are often lost in translation.

{% Compare 'worse', 'Don\'t' %}
> The sample app should work now. Give it a shot!

{% endCompare %}

{% Compare 'better', 'Do' %}
> The sample app should work now. Try it!

{% endCompare %}

Don't rely on cultural references alone to convey essential information. It's likely that at least some of your audience won't know the same movies, TV, books, and games that you do. While a reference here and there can [add personality](/handbook/voice) to your writing, make sure readers can understand your ideas even if they don't catch the reference.
