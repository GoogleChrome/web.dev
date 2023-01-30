---
title: 'Use just the data you need'
authors:
  - sil
description: To do.
date: 2023-01-26
tags:
  - privacy
---

A good way to mitigate risk for users is to not hold sensitive data about them that you do not need that impacts their privacy.
There are a surprising number of ways to do this while still meeting your business goals, and it is worthwhile to consider each.
You might:

* Explain what you need the data for.
* Collect data at lower granularity.
* Remove data once used.
* Not collect it in the first place.

Each of these approaches can help your users feel more comfortable with what you're doing and why, and this contributes greatly
to your relationship with them. Transparency builds trust, and importantly, trust can be a unique selling point for you. Many people
assume that users and customers trust them by default, but consumers are constantly evaluating products and services and this may
not be the case. If you build a relationship with your users where they trust you to handle their data and your interactions
with respect, it can deliver a competitive advantage to you as a project or a business: it is something that your rivals may
not match, a genuine differentiator.

Let's unpack the above approaches, in order of most effective (but also most impactful on your business) to least effective
but least disruptive to implement.

## Don't collect it in the first place

The most obvious way to avoid compromising your users' data is to not collect it. Some data collection is necessary to provide services,
but there are more places where you can avoid data collection than you might think. Consider, for example, guest checkout.
When users come to purchase something using your web app, you might require them to sign up for an account, because then
you've captured personal details for later fulfillment: they can be added to the mailing list, they're already pre-qualified
as an interested customer, and so on. However, customers recognise this, and don't like it:
[in 2021, a study found that one out of  four abandoned sales](https://baymard.com/lists/cart-abandonment-rate) was because
the site demanded that the user create an account. If you don't require an account, you're more likely to keep those customers.
Making it possible to [complete a purchase without signing up](/payment-and-address-form-best-practices/#guest-checkout) gives
users better options and also means you don't have as much of their data to protect and secure.

## "Fuzz" your data

Of course, avoiding collecting data at all may not be an option. It is important to collect data to provide services and make
sensible business decisions. It can also be helpful to build marketing communications in the context of a trusting relationship.
However, it's also important to realize that decisions made in aggregate (that is, which affect many users at once) are made
about data in aggregate (that is, about collective properties of the data).

For example, it is sometimes useful to have a sense of the demographics of your audience: which age brackets they fall into,
location, and so on. This may change your messaging or your approach. But this does not mean that you need to collect the exact
age for every user of your service. What you're often looking for are trends and overall properties. If the decision you wish to
reach is affected by whether most of your audience is in the "18-34 key demographic", then the only question you actually need
to ask  is whether your users are in that demographic. This collects them into two "buckets": in that group and not in that group.
There may be situations where you need more granular data than that, but it's entirely reasonable to take the list of demographics
you use to make decisions and ask your users to classify themselves with that list.

### Example

So, if it is useful to know how your user base divides up between the age categories "18-34", "35-49", "49-64", and "65+",
then you can ask your users to choose which of those categories they fall into. It is tempting to ask for extremely granular,
personal and personalized data, and then classify your users yourself, as this avoids needing to ask the same question again in
more detail later; for example, to ask for an exact age and date of birth, and then use this to produce your own lists of how
many users are in the "35-49" category. But it's important to realize how this looks: as the course has already covered and
will cover again, asking for detailed levels of data can make people uncomfortable and so reduces user trust in your organization,
while adding risk.

It's also important to consider your data needs. Sometimes, the "need" for more granular data is speculative, a "just in case"
requirement. Maybe we only need to classify users into those four age groups right now, but in the future we might want to
narrow that down, and therefore we should collect very detailed data now to keep that option open for later. It may be worth
considering how often the more granular data has actually been used in the past to guide decisions. Asking for data that is
perceived as invasive relative to the service being offered necessarily results in a decrease in how much your users trust your
organization. If that data is being gathered for “just in case” reasons, then you may not just be trading away user trust for
improved business decisions but trading it away merely for the possibility of some theoretical future decision that may
not even exist, while also taking on security requirements for that information.

There are more detailed algorithmic ways to reduce the granularity of collected data as well. [Randomized response methods](https://en.wikipedia.org/wiki/Randomized_response)
mean that the data is gathered with a tuneable degree of inaccuracy, and these have been used for decades in the social
sciences when collecting potentially invasive or sensitive data while maintaining the responder's confidentiality. The
above method of data gathering involves widening the user's answers (so "how old are you" becomes
"which one of the following age groups do you fall into"), where randomized response involves having a certain proportion
of users lie about their answers. If the proportion of users who respond incorrectly is known, then meaningful conclusions
can still be drawn from the gathered data, but individual user's privacy is not compromised because their collected data may
be incorrect. In this case, if 80% of your audience still state that they fall into the 18-34 demographic, you can be
relatively confident that this is still the largest share, even if 10% of them are deliberately giving incorrect answers.
The degree of incorrectness can also be altered programmatically, where correct answers are always solicited but the
software alters a certain percentage of answers before transmitting.  This process and the consequences of it can also
be explained to users when data is gathered: it means that the users do not have to trust that you will not abuse their
collected data, because individual data is unreliable.

A similar but more technically involved process is [_differential privacy_](https://en.wikipedia.org/wiki/Differential_privacy).
This uses mathematical techniques to alter data storage so that aggregate properties of the data are still present, but
it is not possible to even tell whether a particular individual even provided data, or which if any data they provided.
Like randomized response, this protects users' data even from you and demonstrates clear intent on your part:
you can't use your users' data if you don't have that data.

These and similar approaches also provide increased security against data breaches and leaks, because the collected data
reduces compromises to user privacy, even to you, and will also reduce the level of compromise if the data is leaked.
Remember, though, that if you're applying differential privacy techniques on the server (so your users are sending you
unaggregated data and then you use the techniques to aggregate it), you still need to secure that raw user data and
then delete it after processing, and should have and follow clear policies to confirm that you're not using it before
aggregation (or are clear about what you are using it for).

## Retention: collect data and then remove it once used

It's useful to remember that collected data has a lifecycle; it's collected, it gets used to help you make business decisions,
and then, at some point, it should be removed. These are, again, trade offs: when you ask your users questions, or you
store information about other websites they've visited, or you track which things they looked at and for how long in order
to make predictions about their preferences, this is the data which is being granted to you for a specific purpose - not as
an open-ended grant for the developer to use as they see fit. When that data is no longer needed for that purpose - sometimes
after a minute, sometimes after many years - it should be deleted.

Whenever you gather information about your users, you should know what you'll be using that data for (see below) and you should
also know when and why you will stop holding that data. This might be when the user chooses to delete it, or when they sign
out, after a specific time period, or after a specific event takes place. An excellent way to build trust in the relationship
is to make it clear to your users how they can control data about them, including, wherever possible, a unilateral opt-out.
How do they delete their data? How do they delete their account? In addition to helping to build that relationship, it is best
practice to store data for as long as you need to process it and not longer, and that there should be a way for your users to
see and remove data you collect from them or on their behalf. There may even be legislation on this point in territories in
which you operate.

This is an area where you can define clear technical goals, which helps users with self-service; if your users can opt out of
your data warehouse without having to ask permission then they can feel much more comfortable with opting in, and it doesn't
take any support resource to do so.

It's important to recognise the importance of easy and default opt outs: "To build trust and recognition, companies can
start by agreeing to a social contract where they commit to respecting their audience at each and every touchpoint,
listening to their needs, and responding accordingly", states [IAPP](https://iapp.org/news/a/opt-in-opt-out-consent-is-what-its-all-about/).
[The Nielsen Norman Group says](https://www.nngroup.com/articles/ten-usability-heuristics/) that users "need a clearly marked
'emergency exit' to leave the unwanted action without having to go through an extended process". Everyone is aware that it's
easier to subscribe than to unsubscribe. But, as Nielsen Norman says, giving users the ability to walk away without having to
jump through hoops, "fosters a sense of freedom and confidence". Academic studies back this up and name it the "principle of
revocability", stating: "The interface should allow the user to easily revoke authorities that the user has granted wherever
revocation is possible. Users should be able to revoke such consent and therefore reduce authorities to access their resources
if possible." (See [Yee](http://zesty.ca/pubs/csd-02-1184.pdf) and [Iacono](https://www.researchgate.net/profile/Luigi-Lo-Iacono/publication/326107790_Consolidating_Principles_and_Patterns_for_Human-centred_Usable_Security_Research_and_Development/links/5bb79798a6fdcc9552d45f77/Consolidating-Principles-and-Patterns-for-Human-centred-Usable-Security-Research-and-Development.pdf) for examples.)

How long to retain data for, and which data to retain, is a subject which differs a great deal between organizations and
between projects, but there are some common guidelines to consider.

### Do

It is useful here to allow users to delete accounts (and any associated data, where it is possible to do so) and to regularly (for example, on sign out)
clear ephemeral and locally stored data on sign-out with the [Clear-Site-Data](https://developer.mozilla.org/docs/Web/HTTP/Headers/Clear-Site-Data) header.

Supply a `Clear-Site-Data` header to remove some or all user data which has been stored client-side (whether in cookies,
localStorage or IndexedDB, or in the browser cache), when reasonable. The obvious use-case for Clear-Site-Data is when a user
logs out, but it can also be used after security incidents to ensure that a potentially compromised account has no lingering traces
of compromised data stored on the client.

Adding support for `Clear-Site-Data` involves sending an HTTP header, `Clear-Site-Data`, when the user signs out (or at other
times when you wish to clear client-side storage), on the page which confirms the logged-out status (`https://your-site/logout`
or similar). This header can have some or all of the following values, or "*" for all:

```html
Clear-Site-Data: "cache", "cookies", "storage"
```

These values clear, respectively, cached pages (and other HTTP-cached resources), stored cookies, and localStorage and IndexedDB and similar.
You may see reference to another option, “executionContexts”, but this is not supported [by many browsers](https://caniuse.com/?search=executionContexts).
Note that using the `Clear-Site-Data` header is likely to be easier than individually deleting all created resources yourself, because it does not require JavaScript code to be
run on the client (and it is the only official way to clear the browser cache), but is [not supported by all browsers](https://caniuse.com/?search=clear-site-data).

Usage note: If you're clearing the cache (by sending `Clear-Site-Data: cache`), then the `Clear-Site-Data` header should not be
sent on your actual sign-out page, but on some other resource that that page loads. This is because on a slower computer
with a large cache, the page will block while it clears the cache and this prevents navigation. This can take minutes to do,
which will frustrate the user. It is unlikely to happen, but is difficult to test for and thus it is best practice to bear this in mind.

## Explain what you need the data for

The importance of trust in your users' relationship with your service has been stated repeatedly, because it increases user longevity.
It also provides competitive advantage.  One way to increase that level of trust is with transparency into your processes, and a
good way to be transparent is to explain what you want data for. You learned earlier that for each thing collected you should know
when that thing will be deleted. In order to know that, you need to know why you want this data, which specific questions need it in
order to find answers, and which decisions will be guided by collecting it. Once you know why you need this data that you've asked your
user to give up, it will help to build trust by explaining that to those users. In your privacy policy, or when asking questions on account
creation, describe why you need the answer to this particular question, what you'll do with that data, and when and how it can be removed.

These explanations are much more visible when presented inline. Burying explanations in a dense policy document elsewhere on the website
can seem like an attempt to hide them. A sign-up, checkout, or request form can present the reasons to collect data alongside the collection
itself. Often, a form field may have an asterisk (*) to indicate that a field is required; complicated forms often have an information link
(i) to explain what the field means. Consider adding to these explanations a description of why the data is being collected. A frequently
used phrase for this is "Why do we need this?" next to a form field, which when clicked shows a pop-up explanation.

Some example HTML might look as follows, and then CSS and JavaScript would take care of hiding the `<aside>` and showing it as a pop-up when
the link is clicked. (Be sure to confirm the accessibility of the form you make for your site at [https://web.dev/learn/forms/accessibility/](/learn/forms/accessibility)!)
Exactly how to lay this out is dependent on your styles and approaches, but the main point here is to directly associate data collection with
an explanation for why that data is being collected. This isn't necessary for every field. Nobody needs an explanation of why you require them to
choose a password at sign-up. But decorating each request for personal and contact information with how you plan to use it and keep it can help
make it clear to your users that you're invested in protecting their data.

```html
<div>
	<label for="email">Email address*</label>
	<input id="email" type="email" name="email" required aria-describedby="whyemail">
	<a href="#whyemail">Why do we need this?</a>
	<aside id="whyemail">We need this information as a unique identifier for you, and if you forget your password we can send you a reminder. We will use your email address to send you regular updates on the service if you choose, and will delete your email address from any mailing lists if you delete your account.</aside>
</div>
```

Going through this process with everything you collect about a user can also help with internal processes and discussions.
Earlier, you saw how there can be a temptation to collect data "just in case". When you are transparent about your reasons
for collecting, it can be quite obvious that this is happening. If you are reluctant to write down publicly what you want
to do with user data because those users won't like the explanation, this may be a sign that it is worth rethinking collecting
it. This applies whether the distasteful explanation is too invasive ("we will use this to track where you visit on an hourly basis"),
too wide-ranging ("we don't know what we'll use this for yet but we want it in case we think up something for it"), or too evasive
("we will use this for internal undisclosed purposes"). This is not simply a question of morality; people are savvy enough to
recognise this, as already described, and there is a user expectation that experimenting with something is not the beginning
of a long-term commitment. It is a commonplace of user experience design to make sign-up as friction-free and easy as possible,
because at early stages the user is (by definition) not heavily invested in your service, and so it is important to allow
them to become more invested easily when they yet have little inclination to do so. If it is as easy to leave again, then
experimenting with the service becomes exactly experimentation and not the unwilling start of a forced long-term commitment.
As before, it is paradoxical but true that the best way to build trust is to not require your users to trust you if they do
not want to.

People have good reasons for not sharing data, or for sharing minimal data. At the beginning of your relationship with them, they
might not have a reason to trust you, and should not have to. Your goal is to demonstrate why they should.

### Do

* Decide for all the data you plan to collect why you want it and how long you'll keep it for.
* When you ask for that data, explain to your users why you are collecting it.
* Delete it from your server databases after you've used it.
* Allow users to delete accounts that they have created and clear stored data from their storage with the `Clear-Site-Data` header.

### Why

Building a relationship with your users is about trust, and trust is about openness. If you can demonstrate that you're not
just collecting as much data as possible about your users and concealing your uses for it, then that helps to build trust, which can
be a competitive advantage for you over less scrupulous rivals.
