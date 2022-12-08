---
layout: post
title: 'Community highlight: Elisa Bandy'
authors:
  - alexandrawhite
hero: image/VbsHyyQopiec0718rMq2kTE1hke2/8nibxhPpYh7CcJmZubSa.png
alt: 'Learn Accessibility! Community highlight.'
thumbnail: image/VbsHyyQopiec0718rMq2kTE1hke2/8nibxhPpYh7CcJmZubSa.png
subhead: >
  Elisa Bandy is a Googler working on web accessibility and documentation
  for our internal tools.
description: >
  One of a series of interviews with people working in accessibility.
  This time, we spoke with accessibility expert, Elisa Bandy.
date: 2022-12-08
tags:
  - blog
  - accessibility
  - community
---

_This post highlights a community expert, as a part of [Learn Accessibility!](/learn/accessibility/)_

{% Aside %}
Learn more about [Google's accessibility initiatives and research](https://www.google.com/accessibility/initiatives-research/).
{% endAside %}

**Alexandra White**: I'm lucky to call you a colleague. How would you introduce yourself and your job here?

<figure data-float="right">
{% Img
src="image/VbsHyyQopiec0718rMq2kTE1hke2/3wmp0figIYM6Y7IIvMhu.png",
alt="Elisa Bandy, Google technical writer.",
width="300", height="426"
%}
</figure>

**Elisa Bandy**: My name is Elisa, and I write documentation for Google's
internal tooling and infrastructure.

**Alexandra**: That's such cool job. How many people do you work with?

**Elisa**: Our broader team is about 40 people, and that includes technical
writers, instructional designers, and program managers. When I started, six
years ago, there were only four people on the team.

**Alexandra**: What were you up to before Google?

**Elisa**: During the week, I worked in video game development. And then on the
weekends, I worked in shoe repair.

**Alexandra**: Did you start working in web accessibility once you got to
Google? 

**Elisa**: Yes, but not until about a year and a half into it, on the side. I
work on accessibility engineering for Google's internal documentation. Before
this work, the docs were not designed with accessibility in mind. Any doc
feature that was accessible was a happy accident.

There were huge issues, starting with color contrast being entirely
inappropriate for links. The tables were an absolute mess&mdash;if you zoomed in,
everything stayed the same size because it was defined in pixels instead of
`rem`. I volunteered to fix all of those things. And then, I just kept fixing
more things. Here we are five years later, and I'm still at it.

**Alexandra**: You've built yourself to be a person with accessibility
expertise and skills, and you've got the resolve to fix the problems that need
to be fixed.

**Elisa**: Yeah, I guess we can say that [laughs]. As a disabled person myself,
I know how difficult it is to ask for accessibility considerations. So the fact
that we didn't have these accessibility considerations for my co-workers and my
colleagues really angered me. And no one else was fixing them. So I went in and
I fixed them.

I don't think anyone should have to ask for accessibility. It should be built
in from the start.

## Prioritize your accessibility use cases

**Alexandra**: When you think about web accessibility, there are so many
different layers to it, right? There are different, sometimes conflicting needs
for various disabilities. How do you prioritize what should be done?

**Elisa**: A lot of what I do is prioritization. For example, how important is
it that some specific use case be 100% totally accessible? I look at a lot of
data: what percentage of our population is disabled? How many people have a
specific accessibility issue?

For example, there's a subset of users who use
[ChromeVox](https://support.google.com/chromebook/answer/7031755), the built-in
screen reader for Chromebooks. If something is an issue in ChromeVox, I have to
take a look at how many people are using ChromeVox versus
[Jaws](https://www.freedomscientific.com/products/software/jaws/) versus
[NVDA](https://www.nvaccess.org/about-nvda/) versus
[VoiceOver](https://support.apple.com/guide/voiceover/voiceover-keyboard-help-mchlp2683/10/mac/12.0).

Externally, not a lot of people use ChromeVox. Because we're Google, a lot of
people use Chromebooks as their primary work device, which means ChromeVox is
very important for internal documentation. Maybe a ChromeVox bug gets bumped up
a little higher than a VoiceOver bug or a NVDA bug.

{% Aside 'codelab' %}

<figure data-float="right">
  <a href="/learn/accessibility/design-ux/" alt="Take the Design and user experience module.">
{% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/iJa4aaLGjRE7bN5A9CeX.png", alt="", width="198", height="132" %}
</a>
</figure>

Personas also offer a quick and inexpensive way to test and prioritize the
features your users rely on in your development process. Take the Learn
Accessibility module [Design and user experience](/learn/accessibility/design-ux/).

{% endAside %}

Generally speaking, I try to fix things for the major screen readers first.
Coloration tends to be sort of hit or miss because there's a bunch of
extensions that circumnavigate coloration issues, especially for high contrast
modes.

**Alexandra**: You mentioned data, which is incredibly important at Google (of
course). We always hear, "Back up your idea with data." How do you collect data
for accessibility at Google?

**Elisa**: I rely a lot on data that's been collected by
[Google's Disability Alliance](https://careers.google.com/stories/googles-disability-alliance/).
And I'll often cross-check with [WebAIM](https://webaim.org/)'s surveys.

## Culture of accessibility

**Alexandra**: Tell me about the culture of accessibility at Google.

**Elisa**: It's grown very, very rapidly into something which has funding and
broad-reaching concern. And I have found that almost everyone wants to do the
right thing. Our colleagues want educational resources on how to do the right
thing, how to prioritize accessibility.

Restructuring an app or a website or anything to be accessible after you've
already implemented it incorrectly is _hard_. So part of my job is getting our
engineers to think about incorporating accessibility into the initial designs,
before the products are built. People are very receptive to that, even
enthusiastic about it!

{% Aside 'codelab' %}

With component-driven development, you can establish accessibility into the
base structure of your website or web app. Take the Learn Accessibility module
[Patterns, components, and design systems](/learn/accessibility/patterns/).

{% endAside %}

I've only ever had real resistance to incorporating accessibility once, and
even that was fairly easy to resolve.

**Alexandra**: Can you tell me more about that?

**Elisa**: When I first joined accessibility engineering, it was only 20% of my
time. Some people didn't understand why we were focusing on accessibility.
Someone said, "Only 1% of the population is disabled." I stood my
ground&mdash;we needed to do it because it was the right thing to do. And, it
was my time, I'll dedicate it how I see fit.

Of course, it's hard to hear from anyone that disabled people don't matter,
that it's too small a group.

**Alexandra**: Especially when you are a member of that population. Know your
audience!

**Elisa**: I never like to hear, "Oh, this is only 1%." The "only" makes it
sound insignificant. But when you think about the global population, that's a
_lot_ of people. And that's a lot of people who work at Google. _And_ so many
disabilities are
[under-reported](https://hbr.org/2019/06/why-people-hide-their-disabilities-at-work).

**Alexandra**: We know that far more than 1% of the population are affected by
disabilities. [WHO reports](https://www.who.int/news-room/fact-sheets/detail/disability-and-health)
that over 1 billion people have a disability; and 2.2 billion people have
[some kind of vision impairment](https://www.who.int/news-room/fact-sheets/detail/blindness-and-visual-impairment)!
There's varying severity, of course, and some people with visual impairments
wouldn't consider themselves disabled. But these impairments do affect
interaction on the web.

**Elisa**: Exactly.

## Build your own set of expertise

**Alexandra**: Is there any advice that you wish you had had before you started
working in accessibility?

**Elisa**: It's ok not to know every single thing. Accessibility is a huge,
wide expanse of space. I know that there's a lot of stuff that I don't know. I
have a very specific set of skills. It just so happens that I know where to
find information on what the accessibility best practices are. 

Even within my own specialty, screen readers and
[color contrast](/learn/accessibility/color-contrast/), I'm learning new things
every day. And I'm deaf, but I'm not an accessibility expert for Closed
Captions. I know what works for me, but I don't know what works for everyone
else. I'd have to look up best practices if asked.

{% Aside 'codelab' %}

Get a head start on best practices for
[Video and audio](/learn/accessibility/video-audio/). Closed Captions,
transcripts, and other alternative media types support equal access to media.

{% endAside %}

**Alexandra**: It's reasonable not to be the absolute expert of every kind of
accessibility. How would you help engineers learn accessibility patterns?

**Elisa**: I work closely with an engineer who's interested in accessibility.
I'll hand her a bug and show her how I would fix it. Then, I walk her through
the best practice. She may look at other docs and see they recommended one
approach, but it doesn't work for XYZ reasons.

The thing about web accessibility is that there's not a lot of concrete code
examples, because no two people build the same feature in the same way. So you
might jury-rig solutions. Many people don't think about accessibility until
everything's been put together. What are you going to do at that point? Are you
going to tear it down and put it back together and rewrite all of your tests?
No, you're not. You're going to staple something on.

That means you need to understand how a disabled user would expect the
application to function, then model your code so it performs that function. It
might not look like the perfect code samples or inclusive components, but
ultimately, as long as it performs the same function reliably, it's going to be
fine.

**Alexandra**: It sounds to me like you're saying it's more important to get a
positive result than to worry too much about how we get there.

**Elisa**: Yes. Because honestly the ends do justify the means of this case.
It's super important to understand how a screen reader user or any other
disabled user would expect this to work. 

There are a billion ARIA roles, and you cannot possibly know every single one.
Further, some don't work with all screen readers! So you need to know the needs
of your users to build for them. 

**Alexandra**: Are there common external resources that you rely on when
creating internal documentation or offering support to Google engineers?

**Elisa**: I do rely a lot on the [W3C guidelines](https://www.w3.org/). They
are very good for getting an idea of what you need to do. WebAIM is another
extremely good resource that I find to be a little bit better with respect to
technical implementation. I also really like the Mozilla docs&mdash;nine times out
of ten, if I search for something, there's an answer in the
[MDN Web Docs](https://developer.mozilla.org/docs/Web/Accessibility).

I love [inclusive-components.design](https://inclusive-components.design/),
which is great if you want a library of accessible components.

[Deque University](https://dequeuniversity.com/) has a lot of best practices. I
use it for reference materials, when I'm filing bugs or teaching someone how to
follow a specific pattern. 

## Experience accessibility tools first-hand

**Alexandra**: How does one go about learning how a user is affected? Since
your expertise is in supporting people who are colorblind and screen readers, let's start there.

**Elisa**: For color vision deficiency and colorblindness, there are
simulators and [emulators](/blog/new-in-devtools-83/#vision-deficiencies). You
really can't understand how someone else can see until you see it for yourself.
If I notice really bad saturation, as soon as I run it through the simulator, I
can confirm that it isn't discernible at all.

To support screen reader users, there's no better way to understand it than to
actually use a screen reader. Read tutorials first, that's key. Some people get
frustrated when they just turn it on and try messing around with
it&mdash;that's a bad way to learn how to use them. You need more than 5 or 10
or 20 minutes. Use it for an hour at minimum to reveal some of the frustrations
users face who rely on this technology.

{% Aside %}

Some external tutorials you may find useful:

<ul>
<li>[Dragon getting started](https://www.nuance.com/dragon/support/dragon-naturallyspeaking.html#getting-started) and [demo videos](https://www.nuance.com/dragon/dragon-for-pc/how-to-videos.html)</li>
<li>[JAWS training](https://www.freedomscientific.com/training/jaws/additional-jaws-training-downloads/)</li>
<li>[NaturalReader software demos](https://www.naturalreaders.com/software.html#FeaturesforWindows)</li>
<li>[ChromeVox help documentation](https://support.google.com/chromebook/answer/7031755)</li>
</ul>

{% endAside %}

I'm a firm believer that everyone is going to need accessibility technology at
some point in their life. For example, I recently hurt my wrist and couldn't
use my mouse, so I used a keyboard for multiple weeks. It was so frustrating.
These sorts of exercises can really help put you in the position of a disabled
person trying to navigate a world of able-bodied people.


### Simulators, while useful, are not equivalent to a disability

**Alexandra**: Obviously the experience that I have, or any developer would
have, using simulators is not the same as someone with a visual impairment. 

**Elisa**: You can always talk to someone who is disabled, to learn about their
experience. And when you're building that empathy, it's important to remember
that a person who frequently uses these tools is always going to be better at
it than you. Disabled people are always going to be better at navigating their
own spaces, because that's the body that that person lives with.

My fear is that people who go through these empathy exercises, for lack of a
better term, think that they know precisely what people go through. They
suddenly think they're the expert on that experience. You're not the expert on
that experience. If you're able-bodied, you're fundamentally not the expert on
screen readers. I'm not an expert on being colorblind, even though I work in
this space. I'm not an expert on screen readers.

I am an expert in my experience of being hard of hearing. I am an expert on
needing a hearing aid and navigating my own experiences every day. But that
doesn't mean I'm an expert in other people's experience with deafness 

The worst thing you can do in accessibility engineering is have an ego. No
matter what you do, you're going to mess something up. That's not something to
get discouraged about because no two people have the same disability needs. No
two people have the same viewpoint on accessibility and disabilities. You
cannot do everything 100%&mdash;but that doesn't mean you shouldn't try. You
won't ever be perfect, but strive for it anyway.

You may get critical feedback, someone may say, "Hey, your product is not accessible!" Even after you've done so much work, even after you thought that you did everything. 

**Alexandra**: Simulators support a different learning style, to build empathy
by interacting with your product facing some of the problems that disabled
people may face, but that's not the same as experiencing your product with the
accessibility tools they use every day.

**Elisa**: Do I get mildly annoyed when people turn the sound off and read
captions and then suddenly realize, oh, these automatically generated
captions are terrible? Yeah. That's not how I experience captions. Some
disabled people see a person emulate their experience and complain
about the tools, without actively needing those tools. That's frustrating,
I really get that.

But I also don't want to be the person who has to sit there and describe my
experience as a deaf person over and over and over and over and over again.
Every single time. If we want able-bodied people to understand our experiences,
we're going to have to put up with their reaction to the experiences.

That said, the "experiences" like blind restaurant dining and wine tasting,
those make me mad. That's like cosplaying a disability. But in the interests of
trying to understand how your users use a feature or how readers read the page?
That's fine. In fact, that's the minimum. Put yourself in their shoes for an
hour and figure out how these things actually work. It really does matter.

Figure out how people navigate on your site. You may wonder, "Why can't I just
put a banner warning at the top that all the links open in a new tab?" Well,
because someone might not be reading the page starting with the banner. Build
your design with disabled people in mind.

## Do one thing: stop building infinite scroll

**Alexandra**: Is there one thing you wish that engineers would just start
doing to make their sites more accessible?

**Elisa**: Infinite scroll is a blight and no one should ever use it. I can't
find things, I need to be able to find things! And, it's so bad for performance.

Also, moving things around visually and within the DOM is really annoying. The
tab order matters, especially for keyboard users.

{% Aside 'codelab' %}

​​Take the Learn Accessibility module on
[Keyboard focus](/learn/accessibility/focus/) to discover how to ensure all
users can navigate your content.

{% endAside %}

<hr />

Learn more about [Google's accessibility initiatives and research](https://www.google.com/accessibility/initiatives-research/).
Accessibility is critical for development and documentation. In addition to the
web development resources at [Learn Accessibility](/learn/accessibility/),
Google has created an accessible documentation course:
[Tech Writing for Accessibility](https://developers.google.com/tech-writing/accessibility). 

Follow Google's Accessibility team on Twitter at
[@GoogleAccess](https://twitter.com/googleaccess).
