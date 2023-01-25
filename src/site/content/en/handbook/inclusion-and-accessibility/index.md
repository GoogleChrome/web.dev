---
layout: handbook
title: Inclusion and accessibility
date: 2022-02-01
description: |
  Learn how to write for an international audience with varying needs and preferences.
---

web.dev has a diverse, international audience. We want all members of that
audience to be able to access and understand web.dev content. This means our content should be both inclusive and accessible.

This handbook covers some critical information for inclusion and accessibility.
For more information, refer to the Google developer documentation style guide:

*  [Writing inclusive documentation](https://developers.google.com/style/accessibility)
*  [Writing for a global audience](https://developers.google.com/style/translation)
*  [Writing accessible documentation](https://developers.google.com/style/accessibility)

## Use inclusive words

Use preferred words from [our word
list](https://developers.google.com/style/word-list). This list is extensive
and provides both explanations and alternatives.

### Avoid easy, simple, and fast

Don't describe tasks as easy, simple, or fast. These are often subjective bias
based on the writer's knowledge and resources. It's possible the reader will
see a description of a task as "easy" and feel badly if they don't find it
easy to complete.

You can describe certain things as "less complex" when compared to other
versions. But, for the most part, if you believe something is "simple," the
example should speak for itself instead of needing extra validation.

Refer to [James Fisher's blog on Don't use simply](https://jameshfisher.com/2017/02/22/dont-use-simply/)

## Write readable language

### Write in plain language

Your content is written in plain language if your audience can:

*  Find what they need
*  Understand what they find the first time they read or hear it
*  Use what they find to meet their needs

It can be difficult to write technical content with this practice in mind.
Still, it is essential we write inclusively. Use tools to assess the
readability of your content.

*  [Hemingway App](https://hemingwayapp.com/) will assess English content for
   a reading grade level and suggest changes to phrases or voice.

Refer to guidance from external sources to learn more about plain language:

*  [Plain language in technical documentation](https://clickhelp.com/clickhelp-technical-writing-blog/basics-of-plain-language-in-technical-documentation/)
   has tips and examples from ClickHelp.
*  [Plainlanguage.gov](https://www.plainlanguage.gov/about/definitions/) offers
   guidance to meet U.S. laws and requirements on communication.
*  [Plainenglish.co.uk](http://www.plainenglish.co.uk/free-guides.html) offers
   guidance from the British government.

While we primarily write content in English, there may be times when content is
written in other languages. "Plain language" rules can apply to all languages.

### Write short and clear sentences

Short sentences have one subject and action. If you've connected two ideas
that would make sense split up, consider separating into two sentences.

{% Compare 'worse', 'Don\'t' %}
> We also include an HTML table of buttons for accessibility reasons that is on top of the canvases but is made invisible using opacity: 0.

{% endCompare %}

{% Compare 'better', 'Do' %}
> Also, we include an HTML table of buttons to improve accessibility. The table sits on top of the canvases and is made invisible using opacity: 0.

{% endCompare %}

### Favor known terms and avoid jargon

Write commonly used words that your [audience](/handbook/audience) is likely
to know, instead of specialized vocabulary or jargon. If you need help finding an alternative word, the [Merriam-Webster Learner's Dictionary](http://learnersdictionary.com/) is a handy tool.

{% Compare 'worse', 'Don\'t' %}
> In some scripts, graphemes can be visually joined when they're adjacent.

_Script_ and _grapheme_ are very precise, but they're likely to be unfamiliar to most readers. This may cause confusion, as many readers more commonly see _script_ in reference to code.
{% endCompare %}

{% Compare 'better', 'Do' %}
> In some written languages, certain characters can be visually joined when they're adjacent.

While _written language_ and _character_ are slightly less precise, they should be more familiar and less likely to cause misunderstandings.
{% endCompare %}

If you must use a word that your audience is unlikely to know, provide a definition using the [Key-term Aside component](/handbook/web-dev-components#asides).

## Make information easy to find

Use semantic HTML. [Don't skip heading levels](/heading-levels). Don't add
custom styles to headings. Readers will come to expect a certain
style&mdash;custom styles make the page hierarchy more difficult to follow.

Spell out acronyms the first time they're used.

{% Compare 'better', 'Do' %}
> Web Incubation Community Groups (WICG)
{% endCompare %}

Place exceptions, edge cases, and other kinds of supplemental information right next to the primary content they're related to.

## Use inclusive images

Images are visual mediums of communicating with our users. As such, it's
critical we share images in an inclusive and accessible manner.

### Use appropriate contrast

If you create an illustration or diagram, the content which is essential for
the user's understanding should have a contrast ratio of at least 3:1. You can
verify the image contrast using checkers:

*  [WebAIM](https://webaim.org/resources/contrastchecker/)
*  [Paciello Group](https://developer.paciellogroup.com/resources/contrastanalyser/)

### Text associated with image

You may find it useful to include [alt text](#alt-text) or figure captions.
Independent of these elements, an introductory sentence should precede most
images. The sentence can end with a colon or a period; usually a colon if it
immediately precedes the image, usually a period if there's more material
(such as a note paragraph) between the introduction and the image.

You don't need to introduce screenshots that immediately follow procedural
text that describes a UI.

### Alt text

Alt text can be defined as a concise description of the image that can replace the image when the image isn't visible. Visibility can be related to use of assistive technologies (such as screen readers), preferences (such as use of text-only browsers), or circumstance (such as people with a low-bandwidth internet connection).

Alt text should consider the context of the image, not just its content. For
more information, see alt attribute.

When appropriate, provide [alt text](/image-alt).

Consider the following when writing alt text:

*  Don't include phrases like "Image of" or "Photo of" or "Screenshot of".
*  Include punctuation. When screen readers encounter punctuation, they pause
   before continuing.
*  Write short, descriptive alt text in 155 characters or less. Some screen
   readers cut off reading alt text when longer than 155 characters.

Review more [alt text best
practices](https://developers.google.com/style/images#alt-text).

### Avoid words in images

Images with written words are not inclusive of those who don't speak the
language and those with visual impairments. When possible, define what's represented in a `<figcaption>` beneath the image, instead of relying on the image to self-explain with included text.

### Images of people

Avoid images that may exclude certain audience members. Just like when you
_write_ about people, remember to be inclusive when you _show_ people and the
things they do and make. For example, avoid stock photos that show only male
developers. As an alternative, check out [WOCINTECH Stock
Photos](https://www.wocintechchat.com/blog/wocintechphotos).

## Create accessible code blocks

Make sure code blocks are [concise](/handbook/quality/#keep-it-simple) and
follow accessibility best practices. At a minimum:

*  Add [labels](/labels-and-text-alternatives/#label-form-elements) to form
   elements.
*  Don't use tabs to indent code; use spaces only.
*  Wrap lines at 80 characters.
*  Mark code blocks with the appropriate formatting (CSS, JSON, and more) to
   style it appropriately.

In the rare case that you need to omit an accessibility detail to better convey what you're teaching:

1. Add a note explaining that the developer needs to include accessibility features.
1. Link to the relevant post in the web.dev "[Accessible to all](/accessible)" collection.

## Writing about people

There are several excellent online guides for using inclusive language when
writing about groups of people. The [Content
Guide](https://content-guide.18f.gov/inclusive-language/) from 18F (a U.S.
government office that helps other agencies improve their user experience) is
a great place to start.

Most often, you'll write in second-person and use _you_. When you write in
third-person, be gender inclusive: use _they/them_ for singular personal pronouns instead of _he/him_ and _she/her_.

{% Compare 'better', 'Good' %}
> If the reader is interested in diving deeper after reading web.dev, they can turn to other sources.

{% endCompare %}

{% Compare 'better', 'Better' %}
> If readers are interested in diving deeper after reading web.dev, they can turn to other sources.

{% endCompare %}

## Writing for an international audience

Avoid idioms and colloquialisms. If speakers whose first language isn't
English aren't familiar with the idiom, they may be confused. Further, idioms
are often lost in translation.

{% Compare 'worse', 'Don\'t' %}
> The sample app should work now. Give it a shot!

{% endCompare %}

{% Compare 'better', 'Do' %}
> The sample app should work now. Try it!

{% endCompare %}

### Cultural references

Don't rely on cultural references alone to convey essential information. It's
likely that at least some of your audience won't know the same movies, TV,
books, and games that you do. While a reference here and there can [add
personality](/handbook/voice) to your writing, make sure readers can
understand your ideas even if they don't understand the reference.

### Location bias

Avoid locality bias. For example, "coming this fall" is a way to describe a
point in time that only works on one of the world's hemispheres. Instead,
refer to a specific point in time, for example: "coming in June of 2022" or
"coming in Q2 of 2022".

### Availability versus viability

Be aware of differences in availability and viability. Something
described as "cheap", "affordable" or "ubiquitous" is inherently subjective.
Something that is cheap in one country can be a luxury good for the
top-earners in another. Something that is available at any store in one
part of the world can be a scarce resource in another part.
