---
title: Payment and address form best practices
subhead: Maximize conversions by helping your users complete address and payment forms as quickly and easily as possible.
authors:
  - samdutton
scheduled: true
date: 2020-12-09
updated: 2021-01-15
description: Maximize conversions by helping your users complete address and payment forms as quickly and easily as possible.
hero: image/admin/dbYeeV2PCRZNY6RRvQd2.jpg
thumbnail: image/admin/jy8z8lRuLmmnyytD5xwl.jpg
alt: Businessman using a payment card to make a payment on a laptop computer.
tags:
  - blog
  - forms
  - identity
  - layout
  - mobile
  - payments
  - security
  - ux
codelabs:
  - codelab-payment-form-best-practices
  - codelab-address-form-best-practices
---

{% YouTube 'xfGKmvvyhdM' %}

Well-designed forms help users and increase conversion rates. One small fix can make a big difference!

{% Aside 'codelab' %}
If you prefer to learn these best practices with a hands-on tutorial, check out the two codelabs
for this post:

* [Payment form best practices codelab](/codelab-payment-form-best-practices)
* [Address form best practices codelab](/codelab-address-form-best-practices)
{% endAside %}

Here is an example of a simple payment form that demonstrates all of the best practices:

{% Glitch {
  id: 'payment-form',
  path: 'index.html',
  height: 720
} %}

Here is an example of a simple address form that demonstrates all of the best practices:

{% Glitch {
  id: 'address-form',
  path: 'index.html',
  height: 980
} %}

## Checklist

* [Use meaningful HTML elements](#meaningful-html): `<form>`, `<input>`, `<label>`, and `<button>`.
* [Label each form field with a `<label>`](#html-label).
* Use HTML element attributes to [access built-in browser features](#html-attributes), in particular
[`type`](#type-attribute) and [`autocomplete`](#autocomplete-attribute) with appropriate values.
* Avoid using `type="number"` for numbers that aren't meant to be
incremented, such as payment card numbers. Use `type="text"` and [`inputmode="numeric"`](#inputmode-attribute) instead.
* If an [appropriate autocomplete value](#autocomplete-attribute) is available for an `input`,
`select`, or `textarea`, you should use it.
* To help browsers autofill forms, give input `name` and `id` attributes [stable values](#stable-name-id)
that don't change between page loads or website deployments.
* [Disable submit buttons](#disable-submit) once they've been tapped or clicked.
* [Validate](#validate) data during entry—not just on form submission.
* Make [guest checkout](#guest-checkout) the default and make account creation simple once checkout
is complete.
* Show [progress through the checkout process](#checkout-progress) in clear steps with clear calls
to action.
* [Limit potential checkout exit points](#reduce-checkout-exits) by removing clutter and distractions.
* [Show full order details](#checkout-details) at checkout and make order adjustments easy.
* [Don't ask for data you don't need](#unneeded-data).
* [Ask for names with a single input](#single-name-input) unless you have a good reason not to.
* [Don't enforce Latin-only characters](#unicode-matching) for names and usernames.
* [Allow for a variety of address formats](#address-variety).
* Consider using a [single `textarea` for address](#address-textarea).
* Use [autocomplete for billing address](#billing-address).
* [Internationalize and localize](#internationalization-localization) where necessary.
* Consider avoiding [postal code address lookup](#postal-code-address-lookup).
* Use [appropriate payment card autocomplete values](#payment-form-autocomplete).
* Use a [single input for payment card numbers](#single-number-input).
* [Avoid using custom elements](#avoid-custom-elements) if they break the autofill experience.
* [Test in the field as well as the lab](#analytics-rum): page analytics, interaction analytics, and
real-user performance measurement.
* [Test on a range of browsers, devices, and platforms](#test-platforms).

{% Aside %}
This article is about frontend best practices for address and payment forms. It does not explain
how to implement transactions on your site. To find out more about adding payment functionality to your
website, see [Web Payments](/payments).
{% endAside %}

## Use meaningful HTML {: #meaningful-html}

Use the elements and attributes built for the job:
* `<form>`, `<input>`, `<label>`, and `<button>`
* `type`, `autocomplete`, and `inputmode`

These enable built-in browser functionality, improve accessibility, and add meaning to your markup.

### Use HTML elements as intended {: #html-elements}

#### Put your form in a &lt;form&gt; {: #html-form}

You might be tempted not to bother wrapping your `<input>` elements in a `<form>`, and to handle data
  submission purely with JavaScript.

Don't do it!

An HTML `<form>` gives you access to a powerful set of built-in features across all modern browsers,
  and can help make your site accessible to screen readers and other assistive devices. A `<form>`
  also makes it simpler to build basic functionality for older browsers with limited JavaScript
  support, and to enable form submission even if there's a glitch with your code—and for the
  small number of users who actually disable JavaScript.

If you have more than one page component for user input, make sure to put each in its own `<form>`
  element. For example, if you have search and sign-up on the same page, put each in its own `<form>`.

#### Use `<label>` to label elements {: #html-label}

To label an `<input>`, `<select>`, or `<textarea>`, use a [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label).

Associate a label with an input by giving the label's `for` attribute the same value as
the input's `id`.

```html
<label for="address-line1">Address line 1</label>
<input id="address-line1" …>
```
Use a single label for a single input: don't try to label multiple inputs with only one label. This
works best for browsers, and best for screenreaders. A tap or click on a label moves focus to the input
it's associated with, and screenreaders announce label text when the *label* or the label's *input*
gets focus.

{% Aside 'caution' %}
Don't use [placeholders](https://www.smashingmagazine.com/2018/06/placeholder-attribute/)
on their own instead of labels. Once you start entering text in an input, the
placeholder is hidden, so it can be easy to forget what the input is for. The same is true if
you use the placeholder to show the correct format for values such as dates. This can be especially
problematic for users on phones, particularly if they're distracted or feeling stressed!
{% endAside %}

#### Make buttons helpful {: #html-button}

Use [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
for buttons! You can also use `<input type="submit">`, but don't use a `div` or some
other random element acting as a button. Button elements provide accessible behaviour, built-in
form submission functionality, and can easily be styled.

Give each form submit button a value that says what it does. For each step towards checkout, use
a descriptive call-to-action that shows progress and makes the next step obvious. For example, label
the submit button on your delivery address form **Proceed to Payment** rather than **Continue**
or **Save**.

{: #disable-submit}

Consider disabling a submit button once the user has tapped or clicked it—especially when the user is
making a payment or placing an order. Many users click buttons repeatedly, even if they're working fine.
That can mess up checkout and add to server load.

On the other hand, don't disable a submit button waiting on complete and valid user input. For
example, don't just leave a **Save Address** button disabled because something is missing or invalid.
That doesn't help the user—they may continue to tap or click the button and assume that it's broken.
Instead, if users attempt to submit a form with invalid data, explain to them what's gone wrong
and what to do to fix it. This is particularly important on mobile, where data entry is more
difficult and missing or invalid form data may not be visible on the user's screen by the time they
attempt to submit a form.

### Make the most of HTML attributes {: #html-attributes}

#### Make it easy for users to enter data

{: #type-attribute}

Use the appropriate input [`type` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email)
to provide the right keyboard on mobile and enable basic built-in validation by the browser.

For example, use `type="email"` for email addresses and `type="tel"` for phone numbers.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bi7J9Z1TLP4IsQLyhbQm.jpg", alt="Two screenshots of Android phones, showing a keyboard appropriate for entering an email addresss (using type=email) and for entering a telephone number (with type=tel).", width="800", height="683" %}
  <figcaption class="w-figcaption">Keyboards appropriate for email and telephone.</figcaption>
</figure>

{: #inputmode-attribute}

{% Aside 'warning' %}
Using type="number" adds an up/down arrow to increment numbers, which makes no sense for data such
as telephone, payment card or account numbers.

For numbers like these, set `type="text"` (or leave off the attribute, since `text` is the default).
For telephone numbers, use `type="tel"` to get the appropriate keyboard on mobile. For other numbers
use `inputmode="numeric"` to get a numeric keyboard on mobile.

Some sites still use `type="tel"` for payment card numbers to ensure that mobile users get the right
keyboard. However, `inputmode` is [very widely supported now](https://caniuse.com/input-inputmode),
so you shouldn't have to do that—but do check your users' browsers.
{% endAside %}

{: #avoid-custom-elements}

For dates, try to avoid using custom `select` elements. They break the autofill experience if not
properly implemented and don't work on older browsers. For numbers such as birth year, consider
using an `input` element rather than a `select`, since entering digits manually can be easier and less
error prone than selecting from a long drop-down list—especially on mobile. Use `inputmode="numeric"`
to ensure the right keyboard on mobile and add validation and format hints with text or a
placeholder to make sure the user enters data in the appropriate format.

{% Aside %}
The [`datalist`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) element enables
a user to select from a list of available options and provides matching suggestions as the user enters text.
Try out `datalist` for `text`, `range` and `color` inputs at [simpl.info/datalist](https://simpl.info/datalist).
For birth year input, you can compare a `select` with an `input` and `datalist` at [datalist-select.glitch.me](https://datalist-select.glitch.me).
{% endAside %}

#### Use autocomplete to improve accessibility and help users avoid re-entering data {: #autocomplete-attribute}

Using appropriate `autocomplete` values enables browsers to help users by securely storing data and
autofilling `input`, `select`, and `textarea` values. This is particularly important on mobile, and
crucial for avoiding [high form abandonment rates](https://www.zuko.io/blog/8-surprising-insights-from-zukos-benchmarking-data). Autocomplete also provides [multiple accessibility benefits](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html).

If an appropriate autocomplete value is available for a form field, you should use it. [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) has a full list of values and explanations of how to use
them correctly.

{: #stable-name-id}

{% Aside %}
As well as using appropriate autocomplete values, help browsers autofill forms by giving form fields
`name` and `id` attributes [stable values](#stable-name-id) that don't change between page loads or
website deployments.
{% endAside %}

{: #billing-address}

By default, set the billing address to be the same as the delivery address. Reduce visual clutter by
providing a link to edit the billing address (or use [`summary` and `details` elements](https://simpl.info/details/))
rather than displaying the billing address in a form.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TIan7TU8goyoOXwLPYyd.png", alt="Example checkout page showing link to change billing address.", width="800", height="250" %}
  <figcaption class="w-figcaption">Add a link to review billing.</figcaption>
</figure>

Use appropriate autocomplete values for the billing address, just as you do for shipping address,
so the user doesn't have to enter data more than once. Add a prefix word to autocomplete
attributes if you have different values for inputs with the same name in different sections.

```html
<input autocomplete="shipping address-line-1" ...>
...
<input autocomplete="billing address-line-1" ...>
```

#### Help users enter the right data {: #validation}

Try to avoid "telling off" customers because they "did something wrong". Instead, help users complete
forms more quickly and easily by helping them fix problems as they happen. Through the checkout process,
customers are trying to give your company money for a product or service—your job is to assist them,
not to punish them!

You can add [constraint attributes](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Intrinsic_and_basic_constraints) to form elements to specify acceptable
values, including `min`, `max`, and `pattern`. The [validity state](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
of the element is set automatically depending on whether the element's value is valid, as are the
`:valid` and `:invalid` CSS pseudo-classes which can be used to style elements with valid or invalid
values.

For example, the following HTML specifies input for a birth year between
1900 and 2020. Using `type="number"` constrains input values to numbers only, within the range
specified by `min` and `max`. If you attempt to enter a number outside the range, the input will be
set to have an invalid state.

{% Glitch {
  id: 'constraints',
  path: 'index.html',
  height: 170
} %}

The following example uses `pattern="[\d ]{10,30}"` to ensure a valid payment card number, while
allowing spaces:

{% Glitch {
  id: 'payment-card-input',
  path: 'index.html',
  height: 170
} %}

Modern browsers also do basic validation for inputs with type `email` or `url`.

{% Glitch {
  id: 'type-validation',
  path: 'index.html',
  height: 250
} %}

{% Aside %}
Add the `multiple` attribute to an input with `type="email"` to enable built-in validation for
multiple comma-separated email addresses in a single input.
{% endAside %}

On form submission, browsers automatically set focus on fields with problematic or missing required
values. No JavaScript required!

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mPyN7THWJNRQIiBezq6l.png", alt="Screenshot of a sign-in form in Chrome on desktop showing browser prompt and focus for an invalid email value.", width="500", height="483", class="w-screenshot" %}
  <figcaption class="w-figcaption">Basic built-in validation by the browser.</figcaption>
</figure>

Validate inline and provide feedback to the user as they enter data, rather than providing a list of
errors when they click the submit button. If you need to validate data on your server after form
submission, list all problems that are found and clearly highlight all form fields with invalid
values, as well as displaying a message inline next to each problematic field explaining what needs
to be fixed. Check server logs and analytics data for common errors—you may need to redesign your form.

You should also use JavaScript to do more robust validation while users are entering data and
on form submission. Use the [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints)
(which is [widely supported](https://caniuse.com/#feat=constraint-validation)) to add custom
validation using built-in browser UI to set focus and display prompts.

Find out more in [Use JavaScript for more complex real-time validation](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation).

{% Aside 'warning' %}
Even with client-side validation and data input constraints, you must still ensure that your
back-end securely handles input and output of data from users. Never trust user input: it could be
malicious. Find out more in [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).
{% endAside %}

#### Help users avoid missing required data {: #required}

Use the [`required` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/required)
on inputs for mandatory values.

When a form is submitted [modern browsers](https://caniuse.com/mdn-api_htmlinputelement_required)
automatically prompt and set focus on `required` fields with missing data, and you can use the
[`:required` pseudo-class](https://caniuse.com/?search=required) to highlight required fields. No
JavaScript required!

Add an asterisk to the label for every required field, and add a note at the start of the form to
explain what the asterisk means.

## Simplify checkout {: #checkout-forms}

### Mind the mobile commerce gap! {: #m-commerce-gap}

Imagine that your users have a *fatigue budget*. Use it up, and your users will leave.

You need to reduce friction and maintain focus, especially on mobile. Many sites get more *traffic*
on mobile but more *conversions* on desktop—a phenomenon known as the [mobile commerce gap](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs). Customers may simply prefer to
complete a purchase on desktop, but lower mobile conversion rates are also a result of poor user
experience. Your job is to *minimize* lost conversions on mobile and *maximize* conversions
on desktop. [Research has shown](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs) that there's a huge opportunity to provide a better mobile form experience.

Most of all, users are more likely to abandon forms that look long, that are complex, and without a sense of
direction. This is especially true when users are on smaller screens, distracted, or in a rush. Ask for as
little data as possible.

### Make guest checkout the default {: #guest-checkout}

For an online store, the simplest way to reduce form friction is to make guest checkout the default.
Don't force users to create an account before making a purchase. Not allowing guest checkout is cited
as a major reason for shopping cart abandonment.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a7OQLnCRb0FZglj07N7z.png", alt="Reasons for shopping cart abandonment during checkout.", width="800", height="503", class="w-screenshot" %}
  <figcaption class="w-figcaption">From <a href="https://baymard.com/checkout-usability">baymard.com/checkout-usability</a></figcaption>
</figure>

You can offer account sign-up after checkout.  At that point, you already have most of the data you
need to set up an account, so account creation should be quick and easy for the user.

{% Aside 'gotchas' %}
If you do offer sign-up after checkout, make sure that the purchase the user just made is linked to
their newly created account!
{% endAside %}

### Show checkout progress  {: #checkout-progress}

You can make your checkout process feel less complex by showing progress and making it clear what
needs to be done next. The video below shows how UK retailer [johnlewis.com](https://www.johnlewis.com)
achieves this.

<figure class="w-figure">
  {% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/6gIb1yWrIMZFiv775B2y.mp4", controls=true, autoplay=true, muted=true, class="w-screenshot", poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ViftAUUUHr4TDXNec0Ch.png" %}
  <figcaption class="w-figcaption">Show checkout progress.</figcaption>
</figure>

You need to maintain momentum! For each step towards payment, use page headings and descriptive
button values that make it clear what needs to be done now, and what checkout step is next.

<figure class="w-figure">
   <video controls autoplay loop muted class="w-screenshot">
     <source src="https://samdutton.com/address-form-save.mp4" type="video/mp4">
   </video>
  <figcaption class="w-figcaption">Give form buttons meaningful names that show what's next.</figcaption>
</figure>

Use the `enterkeyhint` attribute on form inputs to set the mobile keyboard enter key label. For
example, use `enterkeyhint="previous"` and `enterkeyhint="next"` within a multi-page form,
`enterkeyhint="done"` for the final input in the form, and `enterkeyhint="search"` for a search
input.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QoY8Oynpw0CqjPACtCdG.png", alt="Two screenshots of an address form on Android showing how the enterkeyhint input attribute changes the enter key button icon.", width="800", height="684", class="w-screenshot" %}
  <figcaption class="w-figcaption">Enter key buttons on Android: 'next' and 'done'.</figcaption>
</figure>

The `enterkeyhint` attribute is [supported on Android and iOS](https://caniuse.com/mdn-html_global_attributes_enterkeyhint).
You can find out more from the [enterkeyhint explainer](https://github.com/dtapuska/enterkeyhint).

{: #checkout-details}

Make it easy for users to go back and forth within the checkout process, to easily adjust
their order, even when they're at the final payment step. Show full details of the order, not just
a limited summary. Enable users to easily adjust item quantities from the payment page. Your priority at checkout is to
avoid interrupting progress towards conversion.

### Remove distractions {: #reduce-checkout-exits}

Limit potential exit points by removing visual clutter and distractions such as product promotions.
Many successful retailers even remove navigation and search from checkout.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UR97R2LqJ5MRkL5H4V0U.png", alt="Two screenshots on mobile showing progress through johnlewis.com checkout. Search, navigation and other distractions are removed.", width="800", height="683", class="w-screenshot" %}
  <figcaption class="w-figcaption">Search, navigation and other distractions removed for checkout.</figcaption>
</figure>

Keep the journey focused. This is not the time to tempt users to do something else!

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lKJwd5e2smBfDjNxV22N.jpg", alt="Screenshot of checkout page on mobile showing distracting promotion for FREE STICKERS.", width="350", height="735", class="w-screenshot" %}
  <figcaption class="w-figcaption">Don't distract customers from completing their purchase.</figcaption>
</figure>

For returning users you can simplify the checkout flow even more, by hiding data they don't need to
see. For example: display the delivery address in plain text (not in a form) and allow users to
change it via a link.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xEAYOeEFYhOZLaB2aeCY.png", alt="Screenshot of 'Review order' section of checkout page, showing text in plain text, with links to change delivery address, payment method and billing address, which are not displayed.", width="450", height="219", class="w-screenshot" %}
  <figcaption class="w-figcaption">Hide data customers don't need to see.</figcaption>
</figure>

## Make it easy to enter name and address {: #address-forms}

### Only ask for the data you need {: #unneeded-data}

Before you start coding your name and address forms, make sure to understand what data is required.
Don't ask for data you don't need! The simplest way to reduce form complexity is to remove unnecessary
fields. That's also good for customer privacy and can reduce back-end data cost and liability.

### Use a single name input {: #single-name-input}

Allow your users to enter their name using a single input, unless you have a good reason for
separately storing given names, family names, honorifics, or other name parts. Using a single name
input makes forms less complex, enables cut-and-paste, and makes autofill simpler.

In particular, unless you have good reason not to, don't bother adding a separate input for a
prefix or title (like Mrs, Dr or Lord). Users can type that in with their name if they want to. Also,
`honorific-prefix` autocomplete currently doesn't work in most browsers, and so adding a field for
name prefix or title will break the address form autofill experience for most users.

### Enable name autofill

Use `name` for a full name:

```html
<input autocomplete="name" ...>
```

If you really do have a good reason to split out name parts, make sure to to use appropriate
autocomplete values:

* `honorific-prefix`
* `given-name`
* `nickname`
* `additional-name-initial`
* `additional-name`
* `family-name`
* `honorific-suffix`

### Allow international names {: #unicode-matching}

You might want to validate your name inputs, or restrict the characters allowed for name data. However,
you need to be as unrestrictive as possible with alphabets. It's rude to be told your name is "invalid"!

For validation, avoid using regular expressions that only match Latin characters. Latin-only excludes
users with names or addresses that include characters that aren't in the Latin alphabet. Allow Unicode
letter matching instead—and ensure your back-end supports Unicode securely as both input and output.
Unicode in regular expressions is well supported by modern browsers.

{% Compare 'worse' %}
```html
<!-- Names with non-Latin characters (such as Françoise or Jörg) are 'invalid'. -->
<input pattern="[\w \-]+" ...>
```
{% endCompare %}

{% Compare 'better' %}
```html
<!-- Accepts Unicode letters. -->
<input pattern="[\p{L} \-]+" ...>
```
{% endCompare %}


<figure class="w-figure">
   <video controls autoplay loop muted class="w-screenshot">
     <source src="https://samdutton.com/unicode-letter-matching.mp4" type="video/mp4">
   </video>
  <figcaption class="w-figcaption">Unicode letter matching compared to Latin-only letter matching.</figcaption>
</figure>

{% Aside %}
You can find out more about [internationalization and localization](#internationalization-localization)
below, but make sure your forms work for names in all regions where you have users. For example,
for Japanese names you should consider having a field for phonetic names. This helps customer
support staff say the customer's name on the phone.
{% endAside %}

### Allow for a variety of address formats {: #address-variety}

When you're designing an address form, bear in mind the bewildering variety of address formats,
even within a single country. Be careful not to make assumptions about "normal" addresses. (Take a
look at [UK Address Oddities!](http://www.paulplowman.com/stuff/uk-address-oddities/) if you're not
convinced!)

#### Make address forms flexible {:flexible-address}

Don't force users to try to squeeze their address into form fields that don't fit.

For example, don't insist on a house number and street name in separate inputs, since many addresses
don't use that format, and incomplete data can break browser autofill.

Be especially careful with `required` address fields. For example, addresses in large cities in the
UK do not have a county, but many sites still force users to enter one.

Using two flexible address lines can work well enough for a variety of address formats.

```html
<input autocomplete="address-line-1" id="address-line1" ...>
<input autocomplete="address-line-2" id="address-line2" ...>
```

Add labels to match:

```html/0-2,5-7
<label for="address-line-1">
Address line 1 (or company name)
</label>
<input autocomplete="address-line-1" id="address-line1" ...>

<label for="address-line-2">
Address line 2 (optional)
</label>
<input autocomplete="address-line-2" id="address-line2" ...>
```
You can try this out by remixing and editing the demo embedded below.

{% Aside 'caution' %}
Research shows that [**Address line 2** may be problematic for users]((https://baymard.com/blog/address-line-2)).
Bear this in mind when designing address forms—you should consider alternatives such as using a
single `textarea` (see below) or other options.
{% endAside %}


#### Consider using a single textarea for address {: #address-textarea}

The most flexible option for addresses is to provide a single `textarea`.

The `textarea` approach fits any address format, and it's great for cutting and pasting—but bear in
mind that it may not fit your data requirements, and users may miss out on autofill if they previously
only used forms with `address-line1` and `address-line2`.

For a textarea, use `street-address` as the autocomplete value.

Here is an example of a form that demonstrates the use of a single `textarea` for address:

{% Glitch {
  id: 'address-form',
  path: 'index.html',
  height: 980
} %}

#### Internationalize and localize your address forms {: #internationalization-localization}

It's especially important for address forms to consider [internationalization and localization](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites/), depending
on where your users are located.

Be aware that the naming of address parts varies as well as address formats, even within the same
language.

```text
    ZIP code: US
 Postal code: Canada
    Postcode: UK
     Eircode: Ireland
         PIN: India
```

It can be irritating or puzzling to be presented with a form that doesn't fit your address or that
doesn't use the words you expect.

Customizing address forms [for multiple locales](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites#determining-user-s-language-and-region) may be necessary for your site, but using techniques
to maximize form flexibility (as described above) may be adequate. If you don't localize your address
forms, make sure to understand the key priorities to cope with a range of address formats:
* Avoid being over-specific about address parts, such as insisting on a street name or house number.
* Where possible avoid making fields `required`. For example, addresses in many countries don't
have a postal code, and rural addresses may not have a street or road name.
* Use inclusive naming: 'Country/region' not 'Country'; 'ZIP/postal code' not 'ZIP'.

Keep it flexible! The [simple address form example above](#address-textarea) can be adapted to work
'well enough' for many locales.

#### Consider avoiding postal code address lookup {: #postal-code-address-lookup}

Some websites use a service to look up addresses based on postal code or ZIP. This may be sensible
for some use cases, but you should be aware of the potential downsides.

Postal code address suggestion doesn't work for all countries—and in some regions, post codes can
include a large number of potential addresses.

<figure class="w-figure">
   <video controls autoplay loop muted class="w-screenshot">
     <source src="https://samdutton.com/long-list-of-addresses.mp4" type="video/mp4">
   </video>
  <figcaption class="w-figcaption">ZIP or postal codes may include a lot of addresses!</figcaption>
</figure>

It's difficult for users to select from a long list of addresses—especially on mobile if they're
rushed or stressed. It can be easier and less error prone to let users take advantage of autofill,
and enter their complete address filled with a single tap or click.

<figure class="w-figure">
   <video controls autoplay loop muted class="w-screenshot">
     <source src="https://samdutton.com/full-name-autofill.mp4" type="video/mp4">
   </video>
  <figcaption class="w-figcaption">A single name input enables one-tap (one-click) address entry.</figcaption>
</figure>


## Simplify payment forms {: #general-guidelines}

Payment forms are the single most critical part of the checkout process. Poor payment form design is
a [common cause of shopping cart abandonment](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs). The [devil's in the details](https://en.wikipedia.org/wiki/The_devil_is_in_the_detail#cite_note-Titelman-1): small
glitches can tip users towards abandoning a purchase, particularly on mobile. Your job is to design
forms to make it as easy as possible for users to enter data.

### Help users avoid re-entering payment data {: #payment-form-autocomplete}

Make sure to add appropriate `autocomplete` values in payment card forms, including the payment card
number, name on the card, and the expiry month and year:
* `cc-number`
* `cc-name`
* `cc-exp-month`
* `cc-exp-year`

This enables browsers to help users by securely storing payment card details and correctly entering form
data. Without autocomplete, users may be more likely to keep a physical record of payment card details,
or store payment card data insecurely on their device.

{% Aside 'caution' %}
Don't add a selector for payment card type, since this can always be inferred from the payment card
number.
{% endAside %}

### Avoid using custom elements for payment card dates

If not properly designed, [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
can interrupt payment flow by breaking autofill, and won't work on older browsers. If all other
payment card details are available from autocomplete but a user is forced to find their physical
payment card to look up an expiry date because autofill didn't work for a custom element, you're
likely to lose a sale. Consider using standard HTML elements instead, and style them accordingly.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1LIQm2Jt5PHxN0I7tni3.jpg", alt="Screenshot of payment form showing custom elements for card expiry date that interrupt autofill.", width="800", height="916" %}
  <figcaption class="w-figcaption">Autocomplete filled all the fields—except the expiry date!</figcaption>
</figure>

### Use a single input for payment card and phone numbers {: #single-number-input}

For payment card and phone numbers use a single input: don't split the number into parts. That makes
it easier for users to enter data, makes validation simpler, and enables browsers to autofill.
Consider doing the same for other numeric data such as PIN and bank codes.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7cUwamPstwSQTlbmQ4CT.jpg", alt="Screenshot of payment form showing a credit card field split into four input elements.", width="800", height="833" %}
  <figcaption class="w-figcaption">Don't use multiple inputs for a credit card number.</figcaption>
</figure>

### Validate carefully {: #validate}

You should validate data entry both in realtime and before form submission. One way to do this is by
adding a `pattern` attribute to a payment card input. If the user attempts to submit the payment form
with an invalid value, the browser displays a warning message and sets focus on the input. No
JavaScript required!

{% Glitch {
  id: 'payment-card-input',
  path: 'index.html',
  height: 170
} %}

However, your `pattern` regular expression must be flexible enough to handle [the range of payment card
number lengths](https://github.com/jaemok/credit-card-input/blob/master/creditcard.js#L35): from 14
digits (or possibly less) to 20 (or more). You can find out more about payment card number structuring
from [LDAPwiki](https://ldapwiki.com/wiki/Bank%20Card%20Number).

Allow users to include spaces when they're entering a new payment card number, since this is how
numbers are displayed on physical cards. That's friendlier to the user (you won't have to tell them
"they did something wrong"), less likely to interrupt conversion flow, and it's straightforward to
remove spaces in numbers before processing.

{% Aside %}
You may want to use a one-time passcode for identity or payment verification. However, asking users
to manually enter a code or copy it from an email or an SMS text is error-prone and a source of friction.
Learn about better ways to enable one-time passcodes in [SMS OTP form best practices](/sms-otp-form).
{% endAside %}


## Test on a range of devices, platforms, browsers and versions {: #test-platforms}

It's particularly important to test address and payment forms on the platforms most common for
your users, since form element functionality and appearance may vary, and differences in viewport
size can lead to problematic positioning. BrowserStack enables [free testing for open source projects](https://www.browserstack.com/open-source) on a range of devices and browsers.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uk7WhpDMuHtvjmWlFnJE.jpg", alt="Screenshots of a payment form, payment-form.glitch.me, on iPhone 7 and 11. The Complete Payment button is shown on iPhone 11 but not 7", width="800", height="707" %}
  <figcaption class="w-figcaption">The same page on iPhone 7 and iPhone 11.<br>Reduce padding for
    smaller mobile viewports to ensure the <strong>Complete payment</strong> button isn't hidden.</figcaption>
</figure>


## Implement analytics and RUM {: #analytics-rum}

Testing usability and performance locally can be helpful, but you need real-world data to properly
understand how users experience your payment and address forms.

For that you need analytics and Real User Monitoring—data for the experience of actual users, such
as how long checkout pages take to load or how long payment takes to complete:

* **Page analytics**: page views, bounce rates and exits for every page with a form.
* **Interaction analytics**: [goal funnels](https://support.google.com/analytics/answer/6180923?hl=en)
and [events](https://developers.google.com/analytics/devguides/collection/gtagjs/events)
indicate where users abandon your checkout flow and what actions do they take when interacting
with your forms.
* **Website performance**: [user-centric metrics](/user-centric-performance-metrics) can tell you if your
checkout pages are slow to load and, if so—what's the cause.

Page analytics, interaction analytics, and real user performance measurement become especially
valuable when combined with server logs, conversion data, and A/B testing, enabling you to answer
questions such as whether discount codes increase revenue, or whether a change in form layout
improves conversions.

That, in turn, gives you a solid basis for prioritizing effort, making changes, and rewarding success.


## Keep learning {: #resources}

* [Sign-in form best practices](/sign-in-form-best-practices)
* [Sign-up form best practices](/sign-up-form-best-practices)
* [Verify phone numbers on the web with the WebOTP API](/web-otp)
* [Create Amazing Forms](https://developers.google.com/web/fundamentals/design-and-ux/input/forms)
* [Best Practices For Mobile Form Design](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
* [More capable form controls](/more-capable-form-controls)
* [Creating Accessible Forms](https://webaim.org/techniques/forms/)
* [Streamlining the Sign-up Flow Using Credential Management API](https://developers.google.com/web/updates/2016/04/credential-management-api)
* [Frank's Compulsive Guide to Postal Addresses](http://www.columbia.edu/~fdc/postal/) provides
useful links and extensive guidance for address formats in over 200 countries.
* [Countries Lists](http://www.countries-list.info/Download-List) has a tool for downloading country
codes and names in multiple languages, in multiple formats.


Photo by [@rupixen](https://unsplash.com/@rupixen) on [Unsplash](https://unsplash.com/photos/Q59HmzK38eQ).
