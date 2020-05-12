---
layout: handbook
title: Content quality guidelines
date: 2019-10-01
description: |
  The primary guidelines for writing high-quality content.
---

Read this page to learn the guiding principles of content quality on web.dev.
The top-level sections of this page like [Accuracy](#Accuracy) and [Relevance](#relevance)
represent core themes. The second-level sections like [Know your audience](#know-your-audience) represent
more concrete guidelines for achieving each theme.

If you're already drafting or reviewing content and just need to quickly determine whether
the content meets web.dev's quality guidelines, use the [content checklist](/handbook/content-checklist/)
instead.

The long-term goal of this page is to provide concrete examples of each quality guideline, as
well as research backing up each guideline. This page is primarily intended to teach web.dev
authors why these quality guidelines are important, and how to concretely follow each guideline.

## Accuracy

### Follow best practices

Make sure your information aligns to current documentation, standards, and best practices. 

### Make sure you have relevant expertise

If you're writing about a topic that isn't in your area of expertise, get a subject matter expert to review your content.

## Relevance

### Know your audience

*Canonical example: [Identify slow third-party JavaScripts](/identify-slow-third-party-javascript/)
focuses on helping [goal-driven problem solvers](/handbook/audience/#goal-driven-problem-solver-(damir))
and helps them prioritize what to do based on how much time they have*

Use the [audience guidelines](/handbook/audience) to keep a particular type of reader in mind as you write.
These audience categories map to well-known user types across technical documentation. For example, someone
who needs to just get a particular task done usually doesn't want to scan through a lot of conceptual
information.

### Explain why a user should care about your content {: #explanations }

*Canonical example: [Use Imagemin to compress images](/use-imagemin-to-compress-images/) leads off with a very
straightforward explanation of how the guidance will make the reader's site better without sacrificing quality*

Make sure your content is meeting a need of your audience. (For example, is it teaching them how to do something? Helping them grasp a commonly misunderstood concept?)
Be upfront and explicit about explaining how your content will make the reader's life better.

Phrase your titles, subtitles, and descriptions with the needs and concerns of your readers in mind.

{% Compare 'worse' %}
A post titled "The Media Capabilities API"

{% CompareCaption %}
If the reader isn\'t familiar with the API, its name isn\'t meaningful and doesn\'t convey how the post will be useful.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
A post titled "How YouTube improved video performance with the Media Capabilities API"

{% CompareCaption %}
While slightly longer, this title tells less experienced readers what they\'ll learn from the post while still providing the name of the API for readers who recognize it.
{% endCompareCaption %}
{% endCompare %}

### Help readers get things done

*Canonical example: [Precache with Workbox](/precache-with-workbox/)*

Focus on readers and the concrete task they're trying to complete. While an introductory paragraph can provide important [context](#give-useful-context), get to the instructional content as soon as possible. 

When providing instruction, favor the imperative mood.

{% Compare 'worse' %}
You can do _x_ by clicking **Run Audit**.

{% CompareCaption %}
The declarative mood ("you can…") makes it less clear that the reader needs to take an action.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
Click **Run Audit** to do _x_.

{% CompareCaption %}
The imperative "click" makes it obvious that an action is needed.
{% endCompareCaption %}
{% endCompare %}

When talking about technologies or tools, focus on what they let the reader do, not on their features or the work that went into creating them. (Avoiding first-person pronouns helps.)

{% Compare 'worse' %}
We've added _[a cool thing]_ in DevTools.

{% CompareCaption %}
This sentence emphasizes the work the developers of DevTools did rather than what it lets the reader do.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
Use _[a cool thing]_ in DevTools to _[do neat stuff]_.

{% CompareCaption %}
This sentence better focuses on what how readers can meet their goals.
{% endCompareCaption %}
{% endCompare %}

Address the reader directly rather than imagining a hypothetical third party.

{% Compare 'worse' %}
A seller can choose a variety of shopfront themes.

{% CompareCaption %}
If the reader isn\'t a seller, this detail may not seem relevant.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
You can choose a variety of shopfront themes.

{% CompareCaption %}
Using second person helps convey that we think this information is relevant to readers. (This strategy assumes that the post has been appropriately targeted to an [audience](/handbook/audience).)
{% endCompareCaption %}
{% endCompare %}

Provide a way to measure success. How can developers test that they've followed your instruction correctly?

### Be mindful of the development landscape

*Canonical example: [Serve images in next-gen formats](/uses-webp-images/#webp-browser-support) makes it clear
that WebP is not supported in all browsers*

Acknowledge browser complexity. Clearly state browser support (e.g., link to the relevant feature page on [caniuse](https://www.caniuse.com/)) and provide workarounds for browser incompatibilities (e.g., polyfills).

When selecting tooling, follow the advice in the [Tooling and libraries](/handbook/tooling-and-libraries) post.

### Omit irrelevant ideas

While tangents can sometimes be fun, web.dev readers usually come to the site with a specific task or goal in mind.

## Readability

### Be concise

*Canonical example: [Add a web app manifest](/add-manifest/)*

Use the fewest words possible while keeping language clear and [readable](/handbook/inclusion-and-accessibility#use-readable-language).

{% Compare 'worse' %}
Absolute and fixed positioning have been reimplemented and are more spec compliant than the old implementation. They also better match the behavior in other browsers.

{% CompareCaption %}
This sentence includes unnecessary words in some places (e.g., multiple phrases saying there\'s a new version)\, while not providing enough detail in others (for example\, which spec?).
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
Absolute and fixed positioning are now more compliant with W3C specifications and better match the behavior in other browsers.

{% CompareCaption %}
This revision gives detail readers will likely need (for example\, the relevant specification) while omitting unnecessary words.
{% endCompareCaption %}
{% endCompare %}

Keep posts and codelabs short—typically 1,000 words or less.

This emphasis on concision often means you can't discuss every aspect of a tool or technique. Instead, focus on the essential concepts required for readers to get started with a technique and apply it to their projects. If readers are interested in diving deeper, they can move on to resources outside of web.dev.

## Accessibility

web.dev aims to be a world-class example of an accessible site. Common content problems include:

* [Headings skipping levels](/heading-levels/)
* [Images not having alt text](/image-alt/)

## Instructional effectiveness and completeness

### Use examples liberally

Examples are an extremely effective way to get ideas across.

{% Aside %}
  This page itself is an example of the power of examples. See for yourself whether
  the guidelines with examples are easier to understand than the guidelines without examples.
  We're working on adding examples to every guideline.
{% endAside %}

### Chunk your content

Dividing your content into logical chunks makes it easier to understand.

Use section headings and subheadings to convey the structure of your piece. There are two structures that tend to work well on web.dev (though feel free to try others!):
* **Measure → optimize → monitor**

  This sequence works in many posts and is all but essential for posts about how to address Lighthouse audits.

* **Concept → how-to → further reading**

  This sequence works well for codelabs.

Focus each paragraph (typically 2–3 sentences) on one main idea.

Use a list for a set of instructions or related ideas.

Include examples and figures. (See the next guideline.)

### Keep it simple

*Canonical example: [Code splitting with React.lazy and Suspense](/code-splitting-suspense)*

Focus on essential details when explaining a tool or technique. Avoid overwhelming the reader with "real-world" examples that include complexities that aren't required to understand the basic concept. Save those details for supplemental codelabs or follow-up posts. 

Avoid jargon. If you absolutely _must_ use a term most web.dev readers are unlikely to know, define it in a short aside. See the [web.dev components](/handbook/web-dev-components#asides) post for how to include asides. Also check out the [Inclusion and accessibility](/handbook/inclusion-and-accessibility#use-readable-language) post for more info about writing readable language.

{% Compare 'worse' %}
In some scripts, graphemes can be visually joined when they're adjacent.

{% CompareCaption %}
_Script_ and _grapheme_ are very precise, but they\'re likely to be unfamiliar to most readers and may cause confusion since readers probably more commonly see _script_ referring to a piece of code.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
In some written languages, certain characters can be visually joined when they're adjacent.

{% CompareCaption %}
While _written language_ and _character_ are slightly less precise\, they should be more familiar and less likely to cause misunderstandings.
{% endCompareCaption %}
{% endCompare %}

### Give useful context

Tell readers what you're expecting them to know up front—and provide links to where they can learn it if you can. See the [Get started: optimize your React app](/get-started-optimize-react/#what-will-you-learn) post for an example. Make sure readers won't get lost when you link them off to other sites. In other words, make sure there's a clear connection between your content and the linked content.

Explain why what you're teaching matters before jumping into the instruction. This context can be provided in a collection via an introductory post (see the [Accessible to all](/accessible) collection for an example) or in a post via an introductory paragraph (the [Use Imagemin to compress images](/use-imagemin-to-compress-images) post is a nice example).

Indicate which details are relevant in longer code blocks by providing explanations and code highlighting. If readers don't need to understand everything about the code, tell them that—it makes the task less intimidating, especially for less experienced developers. See the [Serve responsive images](/serve-responsive-images) post for an example.

When there's more than one way to solve a problem, organize them in order of simplest to most complex.

### Make section headings scannable

*Canonical example: [Performance budgets 101](/performance-budgets-101/)*

A lot of web.dev readers are in a hurry. Putting a lot of thought into how you word your section headings
makes your content much more usable for readers who need to quickly find certain information.

## Alignment to larger priorities

### Write in the [web.dev voice](/handbook/voice) as much as possible

*Canonical example: [Serve images with correct dimensions](/serve-images-with-correct-dimensions/) suggests
multiple approaches in a friendly, positive way]*

Whenever a reader comes to web.dev, we want them to expect a voice that is knowledgeable, humble, sympathetic, and friendly.

### Follow our style guides

web.dev primarily follows the [Google Developer Documentation Style Guide](https://developers.google.com/style/) (GDDSG).
Exceptions to the GDDSG are listed in the [handbook](/handbook). Adherence to the style guides is important
for conveying a sense of professionalism to repeat visitors.

web.dev authors aren't expected to memorize every style guide rule. The best approach is to give
your web.dev reviewer edit access to your article and let them do a final pass on the content to
adhere to our style guides. They won't make any changes that substantially affect your voice.

## Engaging UX

### Think about whether there's a better medium to express your ideas

*Canonical example: [How to prevent clickjacking](/same-origin-policy/#how-to-prevent-clickjacking)
uses a drawing to effectively convey an idea that's hard to describe in text and
[Are long JavaScript tasks delaying your Time to Interactive?](/long-tasks-devtools/) uses DevTools
performance recordings to visualize long tasks*

Aside from breaking up long sections of prose, media can be better than text for conveying some concepts and instructions.
A key question to ask as you write is: "Is there a better way to express this idea?"

web.dev supports the following figures, which you can include in your post or codelab by following the examples in the [web.dev components](/handbook/web-dev-components) post.

* Tables (Use tables sparingly—they don't resize well on mobile.)
* Comparisons
* Images and video (See the [Use images and video effectively](/handbook/use-media) post.)
* Code blocks
* Sample apps (See the [Write useful code samples](/handbook/write-code-samples) post.)

### Use high-quality media

Nobody likes a blurry photo!
