---
layout: handbook
title: Style
date: 2019-06-26
description: |
  The primary guidelines for writing in the web.dev style.
---

The style guidelines apply to posts, codelabs, and anything else you might write on web.dev. They're intended to help both writers and reviewers evaluate drafts, and they're included in the [web.dev content checklist](/handbook/content-checklist).

## Know your audience and purpose
Have a specific [audience](/handbook/audience) in mind as you write.

Make sure your content is meeting a need of your audience. (For example, is it teaching them how to do something? Helping them grasp a commonly misunderstood concept?)

{% Compare 'worse', "Don't" %}
> A post titled "The Media Capabilities API"

If the reader isn't familiar with the API, its name isn't meaningful and doesn't convey how the post will be useful.
{% endCompare %}

{% Compare 'better', 'Do' %}
> A post titled "How YouTube improved video performance with the Media Capabilities API"

While slightly longer, this title tells less experienced readers what they'll learn from the post while still providing the name of the API for readers who recognize it.
{% endCompare %}

## Be concise
Use the fewest words possible while keeping language clear and [readable](/handbook/inclusion-and-accessibility#use-readable-language).

{% Compare 'worse', "Don't" %}
> Absolute and fixed positioning have been reimplemented and are more spec compliant than the old implementation. They also better match the behavior in other browsers.

This sentence includes unnecessary words in some places (e.g., multiple phrases saying there's a new version), while not providing enough detail in others (e.g., which spec?).
{% endCompare %}

{% Compare 'better', 'Do' %}
> Absolute and fixed positioning are now more compliant with W3C specifications and better match the behavior in other browsers.

This revision gives detail readers will likely need (e.g., the relevant specification) while omitting unnecessary words.
{% endCompare %}

Keep posts and codelabs short—typically 1,000 words or less.

This emphasis on concision often means you can't discuss every aspect of a tool or technique. Instead, focus on the essential concepts required for readers to get started with a technique and apply it to their projects. If readers are interested in diving deeper, they can move on to resources outside of web.dev.

## Chunk your content
Dividing your content into logical chunks makes it easier to understand.

Use section headings and subheadings to convey the structure of your piece. There are two structures that tend to work well on web.dev (though feel free to try others!):
* **Measure → optimize → monitor**

  This sequence works in many posts and is all but essential for posts about how to address Lighthouse audits.

* **Concept → how-to → further reading**

  This sequence works well for codelabs.

Focus each paragraph (typically 2–3 sentences) on one main idea.

Use a list for a set of instructions or related ideas.

Include examples and figures. (See the next guideline.)

## Use figures when text won't do
Aside from breaking up long sections of prose, media can be better than text for conveying some concepts and instructions. A key question to ask as you write is: "Would this idea be easier to understand if I provided a figure?"

web.dev supports the following figures, which you can include in your post or codelab by following the examples in the [web.dev components](/handbook/web-dev-components) post.
* Tables (Use tables sparingly—they don't resize well on mobile.)
* Comparisons
* Images and video (See the [Use images and video effectively](/handbook/use-media) post.)
* Code blocks
* Sample apps (See the [Write useful code samples](/handbook/write-code-samples) post.)

## Help readers get things done
Focus on readers and the concrete task they're trying to complete. While an introductory paragraph can provide important [context](#give-useful-context), get to the instructional content as soon as possible. The [Use Imagemin to compress images](/use-imagemin-to-compress-images) post is a great example.

When providing instruction, favor the imperative mood.

{% Compare 'worse', "Don't" %}
> You can do _x_ by clicking **Run Audit**.

The declarative mood ("you can…") makes it less clear that the reader needs to take an action.
{% endCompare %}

{% Compare 'better', 'Do' %}
> Click **Run Audit** to do _x_.

The imperative "click" makes it obvious that an action is needed.
{% endCompare %}

When talking about technologies or tools, focus on what they let the reader do, not on their features or the work that went into creating them. (Avoiding first-person pronouns helps.)

{% Compare 'worse', "Don't" %}
> We've added _[a cool thing]_ in DevTools.

This sentence emphasizes the work the developers of DevTools did rather than what it lets the reader do.
{% endCompare %}

{% Compare 'better', 'Do' %}
> Use _[a cool thing]_ in DevTools to _[do neat stuff]_.

This sentence better focuses on what how readers can meet their goals.
{% endCompare %}

Address the reader directly rather than imagining a hypothetical third party.

{% Compare 'worse', "Don't" %}
> A seller can choose a variety of shopfront themes.

If the reader isn't a seller, this detail may not seem relevant.
{% endCompare %}

{% Compare 'better', 'Do' %}
> You can choose a variety of shopfront themes.

Using second person helps convey that we think this information is relevant to readers. (This strategy assumes that the post has been appropriately targeted to an [audience](/handbook/audience).)
{% endCompare %}

Provide a way to measure success. How can developers test that they've followed your instruction correctly?

## Keep it simple
Focus on essential details when explaining a tool or technique. Avoid overwhelming the reader with "real-world" examples that include complexities that aren't required to understand the basic concept. Save those details for supplemental codelabs or follow-up posts. See the [Code splitting with React.lazy and Suspense](/code-splitting-suspense) post for an example.

Avoid jargon. If you absolutely _must_ use a term most web.dev readers are unlikely to know, define it in a short aside. See the [web.dev components](/handbook/web-dev-components#asides) post for how to include asides. Also check out the [Inclusion and accessibility](/handbook/inclusion-and-accessibility#use-readable-language) post for more info about writing readable language.

{% Compare 'worse', "Don't" %}
> In some scripts, graphemes can be visually joined when they're adjacent.

_Script_ and _grapheme_ are very precise, but they're likely to be unfamiliar to most readers and may cause confusion since readers probably more commonly see _script_ referring to a piece of code.
{% endCompare %}

{% Compare 'better', 'Do' %}
> In some written languages, certain characters can be visually joined when they're adjacent.

While _written language_ and _character_ are slightly less precise, they should be more familiar and less likely to cause misunderstandings.
{% endCompare %}

## Be accurate
Make sure your information aligns to current documentation, standards, and best practices. If you're writing about a topic that isn't in your area of expertise (or even if it is!), get input from other experts.

## Give useful context
Tell readers what you're expecting them to know up front—and provide links to where they can learn it if you can. See the [Get started: optimize your React app](/get-started-optimize-react/#what-will-you-learn) post for an example.

Explain why what you're teaching matters before jumping into the instruction. This context can be provided in a collection via an introductory post (see the [Accessible to all](/accessible) collection for an example) or in a post via an introductory paragraph (the [Use Imagemin to compress images](/use-imagemin-to-compress-images) post is a nice example).

Indicate which details are relevant in longer code blocks by providing explanations and code highlighting. If readers don't need to understand everything about the code, tell them that—it makes the task less intimidating, especially for less experienced developers. See the [Serve responsive images](/serve-responsive-images) post for an example.

When there's more than one way to solve a problem, organize them in order of simplest to most complex.

## Be mindful of the development landscape
Acknowledge browser complexity. Clearly state browser support (e.g., link to the relevant feature page on [caniuse](https://www.caniuse.com/)) and provide workarounds for browser incompatibilities (e.g., polyfills).

When selecting tooling, follow the advice in the [Tooling and libraries](/handbook/tooling-and-libraries) post.
