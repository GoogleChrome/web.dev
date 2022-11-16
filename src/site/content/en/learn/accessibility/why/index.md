---
title: What is digital accessibility, and why does it matter?
description: >
  Learn how why it matters to design and build websites and web
  apps so that disabled people can interact with them in a meaningful
  and equivalent way.
authors:
  - cariefisher
date: 2022-09-30
updated: 2022-10-03
---

Imagine a world where you couldn't buy a present for a friend because the
online shopping cart was incompatible with your device. Or a world where you
had to ask a coworker to help you understand the recent sales chart because it
only used soft monotone colors. Maybe you couldn't enjoy that new show
everyone's been talking about because the captions are missing or badly
automated.

For some people, this world is an everyday reality. But it doesn't have to be
this way—this is a reality you can help change when you make digital
accessibility a priority. Digital accessibility, commonly abbreviated to
[a11y](https://www.a11yproject.com/posts/a11y-and-other-numeronyms/), is about
designing and building digital products so that, regardless of a person's
disability, they can still interact with the product in a meaningful and
equivalent way.

Beyond the typical leadership buy-in, time, effort, and budget that are
required of any project, building digital products with full inclusivity in
mind also requires:

* Expert knowledge of various accessibility standards
* Understanding the fundamentals of accessible designs and code
* Understanding the importance of using multiple testing techniques and tools

Most importantly, true inclusivity can only come when you include people with
disabilities and accessibility best practices into the full product
lifecycle—from planning, to designing, to coding, and more.

## What is the individual impact?

The [World Health Organization](https://www.who.int/teams/noncommunicable-diseases/sensory-functions-disability-and-rehabilitation/world-report-on-disability)
(WHO) estimates that over 15% of the world's population—or 1.3 billion
people—self-identify as having a disability, making this group the largest
minority group globally.

More recent reports from the
[Centers for Disease Control and Prevention (CDC)](https://www.cdc.gov/ncbddd/disabilityandhealth/infographic-disability-impacts-all.html),
the [US Census](https://www.census.gov/content/dam/Census/library/publications/2018/demo/p70-152.pdf),
the [Academic Network of European Disability experts (ANED)](https://includ-ed.eu/sites/default/files/documents/aned_2013_task_6_-_comparative_data_synthesis_report_-_europe2020_final.pdf),
and others estimate the total number of people with disabilities to be even
greater. This number continues to grow as the world population ages and faces
chronic health conditions.

{% Img
  src="image/VbsHyyQopiec0718rMq2kTE1hke2/wmi25b63ncEEhKTGYBUS.png",
  alt="Six people representing various disabilities. Each character will be represented.",
  width="800", height="200"
%}

Inaccessible digital products impact people with disabilities. Some types of
disabilities are impacted more in the digital world than others.

{% Aside %}
To learn more about identity and language choices, we recommend reading
[Demystifying Disability: What to Know, What to Say, and How to be an Ally](https://emilyladau.com/book/)
by Emily Ladau.
{% endAside %}

{% Details  'open' %}

{% DetailsSummary 'h3' %}
Visual impairments
{% endDetailsSummary %}

[Visual impairment](https://www.disabled-world.com/disability/types/vision/)
(vision impairment, vision disability) is a decreased ability to see to the
degree that causes problems not fixable by usual means, such as glasses or
medication. Visual impairment can be due to disease, trauma, or congenital or
degenerative conditions.

<figure data-float="right">
{% Img
  src="image/VbsHyyQopiec0718rMq2kTE1hke2/9rl95PJGmH4j9z6PYCVD.png",
  alt="A woman using a white cane.", width="240", height="300"
  %}
</figure>

* _Examples_: B/blindness, low vision, color blindness
* _Prevalence_: 253 million people with visual impairment worldwide—36 million
  are blind, 217 million have moderate to severe visual impairment (MSVI)
  ([Source](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5820628/)), and 1 in
  12 men and 1 in 200 women are colorblind.
  ([Source](https://www.colourblindawareness.org/colour-blindness/))
* _Tools include_: Screen reader software, screen magnification tools, Braille output devices.
* _Pain points_: ​Digital products that do not work with screen reader software, mobile websites/apps without pinch to zoom, complex graphs and charts differentiated by colors alone, color contrasts that make it difficult to read text on the screen

{% Aside 'important' %}
Use lowercase when referring to a vision-loss condition or to a blind person who prefers lowercase. Capitalize for those who capitalize Blind when describing themselves.
{% endAside %}

<blockquote>
  <p>"My vision has deteriorated rapidly over the last three years, and my phone's default font size ranges from large to mega-large. There are a decent amount of mobile apps that I can barely use because of their absurd font sizes."</p>
  <cite>Frank</cite>
</blockquote>

Read a short [article in the New York Times](https://www.nytimes.com/2022/08/16/opinion/blindness-retinitis-pigmentosa.html)
or watch a [video](https://youtu.be/X04HKyW-3hc) on what it means to be
legally blind.

{% endDetails %}

{% Details %}
{% DetailsSummary 'h3' %}
Mobility impairments
{% endDetailsSummary %}

[Mobility impairment](https://www.disabled-world.com/disability/types/mobility/)
is a category of disability that includes people with various physical
disabilities. This type of disability includes upper or lower limb loss or
disability, manual dexterity, and disability in coordination with different
organs of the body.

<figure data-float="right">
{% Img
  src="image/VbsHyyQopiec0718rMq2kTE1hke2/QJhp1Phv2QSOAVsj9Ce9.png",
  alt="A man in a wheelchair, holding an open laptop.",
  width="240", height="300"
%}
</figure>

* _Examples_: Arthritis, paralysis, amputees, seizure disorders.
* _Prevalence_: 1 in 7 people have mobility issues. ([Source](https://www.cdc.gov/media/releases/2018/p0816-disability.html#:~:text=One%20in%204%20U.S.%20adults,affects%201%20in%207%20adults.))
* _Tools include_: Adaptive switches, eye tracking devices, mouth/head sticks, speech input.
* _Pain points_: Elements that are only designed to work with the use of a mouse.

<blockquote>
  <p>"Accessibility isn't just for people with disabilities. I had elbow surgery, and it temporarily changed how I managed my daily digital activities."</p>
  <cite>Melissa</cite>
</blockquote>

{% endDetails %}

{% Details %}

{% DetailsSummary 'h3' %}
Hearing impairments
{% endDetailsSummary %}

A [hearing impairment or hearing loss](https://www.disabled-world.com/disability/types/hearing/)
is a full or partial decrease in the ability to detect or understand sounds.
Hearing impairments are caused by a wide range of biological and environmental
factors.

<figure data-float="right">
  {% Img
    src="image/VbsHyyQopiec0718rMq2kTE1hke2/1nUPylVp4y3mMe6ksPKq.png", alt="A man with a hearing aid.", width="183", height="320"
    %}
</figure>

* _Examples_: D/deafness, hard of hearing (HoH), hearing impaired (HI)
* _Prevalence_: Globally, over 1.5 billion people have a low to medium level of hearing loss, while it is estimated that 66 million people have a [significant level of hearing loss](https://www.who.int/health-topics/hearing-loss#tab=tab_1).
* _Tools include_: hearing aids, captions, transcripts, sign language.
* _Pain points_: Audio content without text transcripts, video with no synchronized captions

{% Aside 'important' %}
Use lowercase when referring to a hearing-loss condition or to a deaf person
who prefers lowercase. Capitalize for those who identify as members of the Deaf
community or when they capitalize Deaf when describing themselves.
{% endAside %}

<blockquote>
  <p>"Some deaf people say auto-captions are NOT better than nothing. Some deaf people say automatic captions ARE better than nothing. Unlike people with hearing, deaf people have nothing to fall back on. All they have is the captions. Personally, I'd rather see no captions than watch automatic captions. Sure, I'm disappointed there aren't captions. With no auto-captions, I avoid the painful experience of its notoriously bad captions."</p>
  <cite>Meryl</cite>
</blockquote>

{% endDetails %}

{% Details %}
{% DetailsSummary 'h3' %}
Cognitive impairments
{% endDetailsSummary %}

A [cognitive disability](https://www.disabled-world.com/disability/types/cognitive/) covers
a variety of medical conditions affecting cognitive ability. People with
cognitive disabilities include various intellectual or cognitive deficits,
deficits too mild to properly qualify as intellectual disability, specific
conditions, and problems acquired later in life through acquired brain injuries
or neurodegenerative diseases like dementia.

<figure data-float="right">
  {% Img
    src="image/VbsHyyQopiec0718rMq2kTE1hke2/FFQbr519qx67nnEU9YKU.png",
    alt="An older woman in glasses, holding an animal.", width="183", height="320"
    %}
</figure>

* _Examples_: Down's syndrome, A/autism, ADHD, dyslexia, aphasia.
* _Frequency_: Varies by condition.
* _Tools include_: Screen readers, text highlighting, text prediction,
  abstractive summarization tools.
* _Pain points_: Busy interfaces that make it overly complicated to focus on
  the task at hand, big walls of words with little whitespace, justified text,
  and small or hard-to-read fonts.

{% Aside 'important' %}
Use lowercase when referring to autism as a disorder or to an autistic person
who prefers lowercase. Capitalize for those who capitalize Autism or Autistic
when describing themselves.
{% endAside %}

<blockquote>
  <p>"Right now, I am recovering from an ocular migraine, and I would say dark mode is not helping enough. I still need contrast, but less harshly bright."</p>
  <cite>Ruth</cite>
</blockquote>

Read a short
[article in the New York Times](https://www.nytimes.com/2022/08/30/opinion/face-blindness-prosopagnosia.html)
or watch a [video](https://youtu.be/3-MzNPcEh6M) on face blindness
(prosopagnosia).

{% endDetails %}

{% Details %}
{% DetailsSummary 'h3' %}
Seizure and vestibular disorders
{% endDetailsSummary %}

A seizure is an excessive surge of electrical activity in the brain that can
cause various symptoms, depending on which parts of the brain are involved.
Seizures may result from genetics or a brain injury, but their
[cause is often unknown](https://nyulangone.org/conditions/epilepsy-seizure-disorders-in-adults/types).

The vestibular system includes the parts of the inner ear and brain that
process the sensory information that controls balance and eye movements. If
disease or injury damages these processing areas, vestibular disorders can
result. [Vestibular disorders](https://vestibular.org/article/diagnosis-treatment/types-of-vestibular-disorders/)
can also result from or be worsened by genetic or environmental conditions or
occur for unknown reasons.

<figure data-float="right">
 {% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/6jKwFBXkliZ0wtJgr8tj.png", alt="A person in a green jacket with glasses.", width="183", height="320" %}
</figure>

* _Examples_: Epilepsy, vertigo, dizziness, labyrinthitis, balance, and eye movement disorders.
* _Frequency_: [50 million people worldwide have epilepsy](https://www.who.int/health-topics/epilepsy),
  and 1.8 million adults worldwide have
  [bilateral vestibular hypofunction](https://www.hopkinsmedicine.org/news/newsroom/news-releases/implant-improves-balance-movement-and-quality-of-life-for-people-with-inner-ear-disorder) (BVH).
* _Tools include_: Operating system settings to reduce motion. In Windows, this
  setting is framed positively as **Show animation**, and is turned off. On
  Android, the setting **Remove animations** is turned on.
* _Pain points_: Videos that autoplay, extreme flashing or strobing of visual
  content, parallax effects, or scroll-triggered animations.

<blockquote>
  <p>"I <em>really</em> dislike the superfluous animation that plagues iOS transitions between apps, so I turn it off. Downside: I'm denied most of the thoughtfully executed motion design on the web because there's no “some motion is fine” middle ground."</p>
  <cite>Oliver</cite>
</blockquote>

{% endDetails %}

{% Details %}
{% DetailsSummary 'h3' %}
Speech impairments
{% endDetailsSummary %}

A [speech disorder](https://www.pennmedicine.org/for-patients-and-visitors/patient-information/conditions-treated-a-to-z/speech-and-language-disorders#:~:text=A%20speech%20disorder%20is%20a,Articulation%20disorders)
is a condition in which a person has problems creating or forming the speech
sounds needed to communicate with others.

<figure data-float="right">
{% Img
  src="image/VbsHyyQopiec0718rMq2kTE1hke2/uR06sT1scRQ8Qnt4hW6l.png", alt="A person wearing glasses and waving.", width="183", height="320"
%}
</figure>

* _Examples_: Muscular or cognitive issues that impede speech, such as apraxia, dysarthria, or stuttering.
* _Frequency_: 18.5 million individuals have a [speech, voice, or language disorder](https://www.nidcd.nih.gov/health/statistics/quick-statistics-voice-speech-language).
* _Tools include_: Augmentative and alternative communication (AAC) and speech-generating devices.
* _Pain points_: Voice-activated technology such as smart home devices and apps.

<blockquote>
  <p>"My son has a lisp due to dyspraxia.
He will say "seep" rather than "sheep" or
"fower" rather than "flower". It is sweet,
but he gets so frustrated by voice-activated
software.</p>
<p>Our new car uses voice activation to
interact with a phone. Often if we are
together, my husband will send us a
WhatsApp message. The car will read it
out loud, but when it asks us if we want
to reply, my son's reply is not understood.
He gets so upset... he now whispers the
message to me so I can say it for the
reply."</p>
  <cite>Helen</cite>
</blockquote>

Read a short [article in the New York
Times](https://www.nytimes.com/2022/08/23/opinion/stutter-speech-listening.html)
or watch a [video](https://youtu.be/m0E_wMIwfSI) on stuttering and technology.

{% endDetails %}

While the number of people with disabilities worldwide is large, it's important
to remember that these numbers don’t include people who do not identify as
having a disability but who could benefit from accessible digital products,
including those who are:

* _Temporarily disabled_. It may mean someone has a broken wrist or is
  cognitively impaired due to medication.
* _Situationally disabled_. For example, someone experiencing glare on a device
  screen or being unable to play the audio on a video in a public setting.
* _Mildly disabled_. A person needing eyeglasses to see a screen or captions to
  understand audio.
* _Non-native speakers_. If a person is not fluent in the language on the
  screen, they may need more time to read content on a slide on a
  carousel/slideshow.
* _Older people with age-related diminishing senses_. It could be a person
  needing reading glasses or bifocals to read small print or requiring a larger
  target size for buttons on their touch device due to an age-related hand
  tremor.
* _Search engine optimization (SEO) bots_. SEO bots do not have senses like
  sight and hearing and navigate by keyboard only, so they can also benefit from
  accessible digital products.

## Business impact

People with disabilities make up almost a fourth of the world's population, but
did you know that they also have a lot of spending power?

According to the
[American Institutes for Research (AIR)](https://www.researchgate.net/profile/Dahlia-Shaewitz/publication/324603094_A_Hidden_Market_The_Purchasing_Power_of_Working-Age_Adults_With_Disabilities_A_Hidden_Market_The_Purchasing_Power_of_Working-Age_Adults_With_Disabilities/links/5ad89016458515c60f5918f3/A-Hidden-Market-The-Purchasing-Power-of-Working-Age-Adults-With-Disabilities-A-Hidden-Market-The-Purchasing-Power-of-Working-Age-Adults-With-Disabilities.pdf),
the total after-tax disposable income for working-age Americans with
disabilities is about $490 billion annually. This number is similar to other
significant market segments in the US, such as the Black ($501 billion) and
Latinx ($582 billion) communities. Companies that do not plan for, design, and
build accessible products can lose out on this potential revenue.

While these numbers are impressive, people with disabilities are also part of a
larger network of family members, friends, communities, and institutions. This
larger network often looks for and supports businesses that create accessible
digital products. When you factor in the friends and family of the over 1.3
billion people worldwide who identify as disabled, the disability market
touches 53% of all consumers. It is the world's largest emerging market.

In addition to money and market shares, businesses focused on disability
inclusion as part of an overall diversity strategy are [higher performing and
more innovative](https://www.w3.org/WAI/business-case/). There are many examples of [everyday products](https://incl.ca/the-evolution-of-assistive-technology-into-everyday-products/) that evolved from technology developed by, or for, people with disabilities, including:

* Telephones
* Typewriters / keyboards
* Email
* Kitchen utensils
* Easy-open pull-out drawers
* Automatic door openers
* Voice controls
* Eye gaze technology

When we look at accessibility as a design or coding challenge, not a begrudging
requirement, innovation is the byproduct. For people without disabilities, such
improvements can increase the overall user experience. For people with
disabilities, these improvements are essential for equal access.

## Legal impact

Beyond the individual and business impact, you should also be aware of the
looming [legal impact](https://f.hubspotusercontent30.net/hubfs/3280432/Remediated-2021-Year-End-Report-FINAL.pdf)
of not building accessible digital products. Public sector entities in the
United States, such as government-funded programs/schools, airlines, and
nonprofits, must follow certain digital accessibility rules, while many private
sector companies do not. In countries such as Canada, the United Kingdom,
Japan, Australia, and the European Union, stricter
[digital accessibility laws](https://www.w3.org/WAI/policies/) exist for both
public and private companies.

For many disabled people in the US, filing a lawsuit is their only option to
bring awareness and change to digital products. It is estimated that in the US,
over ten lawsuits are filed daily focused on digital accessibility. Many
businesses have received multiple digital accessibility-based lawsuits. And
every year, the number of total lawsuits has increased.

E-commerce websites and apps are typically the biggest targets, comprising over
74% of the lawsuits filed in 2021. If your company has both a physical location
and an online presence, you are more likely to have been part of a lawsuit. In
fact, of the top 500 e-commerce sites, 412 have been served with a lawsuit
within the past four years. Often, the first lawsuit is for the company's
website and the second for their mobile app.

While avoiding lawsuits shouldn't be the only reason you focus on making sure
your digital products are accessible, it is an important piece of the
conversation.

{% Assessment 'why' %}
