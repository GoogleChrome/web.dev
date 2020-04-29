---
title: Signin form best practice
subhead: Use cross-platform browser features to build signin forms that are secure, accessible and easy to use.
authors:
  - samdutton
date: 2020-04-24
updated: 2020-04-29
description: Use cross-platform browser features to build signin forms that are secure, accessible and easy to use.
hero: hero.jpg
alt: Closeup photo of a man holding a phone showing a login page
thumbnail: thumbnail.jpg
tags:
  - post
  - identity
  - login
  - privacy
  - security
  - trust and safety
codelabs:
  - codelab-signup-form
  - codelab-signin-form
---


If users ever need to log in to your site, then good signin form design is critical.

This is especially true for people on poor connections, on mobile, in a hurry, or under stress.

Poorly designed signin forms get high bounce rates. Each bounce means a lost and disgruntled user—not just a missed signin opportunity.

[Stats for signup/signin bounce rates.]


## Checklist

* Use meaningful HTML elements: form, input, label and button.
* Label every input with a &lt;label&gt;.
* Use element attributes to access built-in browser features: type, name, autocomplete, required, autofocus.
* Use `name="new-password"` for a signup password input.
* Use `autocomplete="current-password"` for a signin password input.
* Provide **Show password** functionality.
* Use **aria-label** and **aria-describedby** for password inputs.
* Don't double up email  inputs.
* Design forms so the mobile keyboard doesn't obscure inputs or buttons.
* Ensure forms are usable on mobile: legible text, inputs and buttons large enough to work as touch targets.
* Display links to your Terms of Service and privacy policy documents.
* Include branding (logo and name) on your signup and signin form pages. 
* Build page analytics, interaction analytics and user-centric performance measurement into your signup and signin flow.
* Test across browsers and devices: form behaviour varies significantly across platforms.


{% Aside %}
This article is about front-end best practice. It does not explain how to build back-end services to authenticate users, store their credentials or manage their accounts.

[12 best practices for user account, authorization and password management](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account) outlines core principles for running your own back-end.

If you have users in different parts of the world, you need to consider localizing your site's use of third party identity services as well as its content.
{% endAside %}



## Use meaningful HTML

The basic principle here is to use elements built for the job: `<form>`, `<label>` and `<button>`. These enable built-in browser functionality, improve accessibility, and add meaning to your markup.

### Use &lt;form&gt;

You might be tempted to wrap inputs in a `<div>` and input data submission purely with JavaScript. It's generally better to use a plain old `<form>`. This makes your site accessible to screenreaders and other assistive devices, and enables a range of built-in browser features (see below).

An HTML form makes it simpler to build basic functional signin for older browsers, and to enable signin even if JavaScript fails.

### Use &lt;label&gt;
To label an input, use a `<label>`!

```html
<label for="email">Email</label>
<input id="email" …>
```

Two reasons:
* A tap or click on a label moves focus to its input. Associate a label with an input by using the label's `for` attribute with the input's `name` or `id`.
* Screenreaders announce label text when the label or the label's input gets focus.

Don't use placeholders as input labels. People are liable to forget what the input was for once they've started entering text, especially if they get distracted. (Was I entering an email address or a phone number, or something else?) There are lots of other potential problems with placeholders: see [Don't Use The Placeholder Attribute](https://www.smashingmagazine.com/2018/06/placeholder-attribute/) and [Placeholders in Form Fields Are Harmful](https://www.nngroup.com/articles/form-design-placeholders/) if you're unconvinced.

It's probably best to put your labels above your inputs. This enables consistent design across mobile and desktop and, according to [Google AI research](https://ai.googleblog.com/2014/07/simple-is-better-making-your-web-forms.html), enables quicker scanning by users. You get full width labels and inputs, and you don't need to adjust label and input width to fit the label text.

{% Aside  %}
Try out the example at [glitch.com/edit/#!/label-position](https://glitch.com/edit/#!/label-position) on mobile.
{% endAside %}

<figure class="w-figure">
  <img src="./label-position.png" alt="Screenshot showing form input label position on mobile: next to input and above input." width="500">
  <figcaption class="w-figcaption">Label and input width is limited when both are on the same line.</figcaption>
</figure>

[Add information about `aria-describedby`?]

### Use &lt;button&gt;

Use button elements for button behaviour, to improve accessibility and enable built-in browser functionality. 

Consider disabling the signin button once the user has tapped or clicked it. [Many users click buttons multiple times](https://baymard.com/blog/users-double-click-online) even on sites that are fast and responsive. That just slows things down and adds to server load.

Conversely, don't disable form submission awaiting user input. Users may miss out something in the form, then try repeatedly tapping the (disabled) signin button and think it's not working. At the very least, if you must disable form submission, tell them what's missing.

{% Aside 'caution' %}
The default type for a button in a form is `submit`.

If you want to add another button in a form (for **Show password**, for example) add `type="button"`. Otherwise clicking or tapping on it will submit the form.
{% endAside %}


### Don't double up your inputs

Some sites force users to enter emails or passwords twice.

That might reduce errors for a few users, but causes extra work for *all* users, and [increases abandonment rates](https://uxmovement.com/forms/why-the-confirm-password-field-must-die/). Better to enable users to confirm their email address (you'll need to do that anyway) and make it easy for them to reset their password.

[Do we stats for this?]


## Make the most of element attributes

This is where the magic really happens!

Browsers have multiple helpful built-in features that use input element attributes.


### Help users start faster

Add an `autofocus` attribute to the first input in your login form. That makes it clear where to start and, on desktop at least, means users don't have to select the input to start typing.

<figure class="w-figure">
  <img src="./autofocus.png" alt="Screenshot showing form input with autofocus." width="500">
  <figcaption class="w-figcaption">Autofocus provides clear visual focus on desktop.</figcaption>
</figure>

## Keep passwords private—but enable users to see them if they want

Passwords inputs should have `type="password"` to hide password text. (Sounds obvious, but some sites miss this.)

Using `<input type="password">` also means that browsers such as Firefox offer to save your password when a form is submitted (along with using the `name` and `id` attributes to guess the meaning of form inputs).

However, you should add a **Show password** icon or button to enable users to check the text they've entered—and don't forget to add a **Forgot password** link. (See [Enable password display](#enable-password-display).)

<figure class="w-figure">
  <img src="./show-password.png" alt="Google signin form showing Show password icon." width="300">
  <figcaption class="w-figcaption">Google signin form: with <strong>Show password</strong> icon and <strong>Forgot password</strong> link.</figcaption>
</figure>

## Give mobile users the right keyboard

Use `<input type="email">` to give mobile users an appropriate keyboard and enable basic built-in email address validation by the browser (no JavaScript required!)

If you need to use a telephone number instead of an email address, `<input type="tel">` enables a telephone keypad on mobile. You can also use the `inputmode` attribute where necessary: `inputmode="numeric"` is ideal for PIN numbers. [Everything You Ever Wanted to Know About inputmode](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/) has more detail.

{% Aside 'caution' %}
`type="number"` adds an up/down arrow to increment numbers, so don't use it for numbers that aren't meant to be incremented, such as ID and account numbers.
{% endAside %}

### Avoid the mobile keyboard covering the Submit button

Unfortunately, if you're not careful, mobile keyboards may cover your form or, worse, partially obscure the Submit button. Users may give up before realizing what has happened.

<figure class="w-figure">
  <img src="./keyboard-not-ok.png" alt="Two screenshots of signin form on an Android phone: one showing how the Submit button is obscured by the phone keyboard." width="400">
  <figcaption class="w-figcaption">The <strong>Sign in</strong> button: now you see it, now you don't.</figcaption>
</figure>

Where possible, avoid this by displaying only the email/phone and password inputs and submit button at the top of your signin page. Put other content below.

<figure class="w-figure">
  <img src="./keyboard-ok.png" alt="Screenshot of signin form on an Android phone: the Submit button is not obscured by the phone keyboard." width="200">
  <figcaption class="w-figcaption">The keyboard doesn't obscure the <strong>Sign in</strong> button.</figcaption>
</figure>

You'll need to test on a range of devices for your target audience, and adjust accordingly.

<figure class="w-figure">
  <img src="./iphone-keyboard.png" alt="Screenshots of signin form on iPhone 7, 8 and 11. On iPhone 7 and 8 the Submit button is obscured by the phone keyboard, but not on iPhone 11">
  <figcaption class="w-figcaption">The <strong>Sign in</strong> button: obscured on iPhone 7 and 8, but not on iPhone 11.</figcaption>
</figure>



Some sites (including Amazon and eBay) avoid the problem by asking for email/phone and password on two 'pages'. This approach also simplifies the experience: the user is only tasked with one thing at a time.

<figure class="w-figure">
  <img src="./amazon-signin-mobile.png" alt="Screenshot of signin form on Amazon website: email/phone and password on two separate 'pages'." width="400">
  <figcaption class="w-figcaption">Two-stage signin: email or phone, then password.</figcaption>
</figure>


### Help users avoid re-entering data

You can help browsers help users by autofilling inputs. This is particularly important for email inputs, which get [high abandonment rates](https://www.formisimo.com/blog/conversion-rate-increases-57-with-form-analytics-case-study/).

[Add something to refute warnings **against** autocomplete?]

There are two parts to this:
1. The input `name` attribute helps browsers store data for email and other input types for use with `autcomplete`. Some browsers, including Firefox, also take note of the `id` and `type` attributes.
2. The `autocomplete` attribute enables browsers to autofill inputs using data stored using the `name` attribute.

Remember that you need different behaviour for inputs in signup and signin forms. In particular, passwords shouldn't be autofilled on signup.

To avoid this problem, use: 
* `name="new-password"` for the password input in a signup form, or the new password in a change-password form.
* `name="current-password"` for a signin form, or the old password in a change-password form.

For a signup form, password input code should look like this:

```html
<input name="new-password" type="password" …>
```

For signin:

```html
<input name="current-password" type="password" autocomplete="current-password" …>
```

Different browsers handle the email autofill and password suggestion somewhat differently, but the effect is much the same.

On Safari on desktop, for example, the password manager is displayed, then biometric authentication (fingerprint or facial recognition) is used if available.

<figure class="w-figure">
  <img src="./safari-signin-desktop.png" alt="Screenshots of three stages of signin process in Safari on desktop: password manager, biometric authentication, autofill.">
  <figcaption class="w-figcaption">Signin with autocomplete—no text entry required!</figcaption>
</figure>

Chrome on desktop displays email suggestions depending on what you type, shows the password manager, then autofills the password.

<figure class="w-figure">
  <img src="./chrome-signin-desktop.png" alt="Screenshots of four stages of signin process in Chrome on desktop: email completion, email suggestion, password manager, autofill on selection.">
  <figcaption class="w-figcaption">Autocomplete signin flow in Chrome.</figcaption>
</figure>

{% Aside 'caution' %}

Browser password and autofill systems are not simple.

The algorithms for guessing, storing and displaying values are not standardized, and vary from platform to platform.

For example, as pointed out by [Hidde de Vries](https://hiddedevries.nl/en/blog/2018-01-13-making-password-managers-play-ball-with-your-login-form): "Firefox's password manager complements [its heuristics](https://dxr.mozilla.org/firefox/source/toolkit/components/passwordmgr/src/nsLoginManager.js#626) with a [recipe system](https://bugzilla.mozilla.org/show_bug.cgi?id=1119454).
{% endAside %}

[Autofill: What web devs should know, but don't](https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont) has a lot more information about using `name` and `autocomplete`. The [HTML spec](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#inappropriate-for-the-control) lists all 59 possible values.


### Enable the browser to suggest a strong password

Modern browsers suggest a strong password if `autocomplete="new-password"` is included for the password input in a signup form.

Here's how Safari does it on desktop.

<figure class="w-figure">
  <img src="./safari-password-suggestion.png" alt="Screenshot of Firefox password manager on desktop.">
  <figcaption class="w-figcaption">Password suggestion flow in Safari.</figcaption>
</figure>

Using built in browser password generators means users and developers don't need to work out what a 'strong password' is. Since browsers can securely store passwords and autofill them as necessary, there's no need for users to remember or enter passwords.

{% Aside %}
The downside with this approach is that there's no way to share passwords across platforms.

For example, a user may use Safari on their iPhone and Chrome on their Windows laptop.

[So what's our advice?]
{% endAside %}


### Help save users from accidentally missing input fields

Add the `required` attribute to both email and password fields.

Modern browsers automatically prompt and set focus for missing data. 

No JavaScript required!

<figure class="w-figure">
  <img src="./missing-field-firefox-android.png" alt="Screenshot of desktop Firefox and Chrome for Android showing 'Please fill out this field' prompt for missing data." width="600">
  <figcaption class="w-figcaption">Prompt and focus for missing data, desktop Firefox and Chrome for Android.</figcaption>
</figure>


## Design for fingers and thumbs

[Do we have any stats for form filling on mobile versus desktop?]

The default browser size for just about everything relating to input elements and buttons is too small, especially on mobile. 

This may seem obvious, but it's a common problem with signin forms on many sites.


### Make sure inputs and buttons are large enough

The default size and padding for inputs and buttons is too small on desktop and even worse on mobile.

<figure class="w-figure">
  <img src="./unstyled-form.png" alt="Screenshot of unstyled form in Chrome on desktop and on Android.">
  <figcaption class="w-figcaption">Default styling on desktop and mobile: inputs and buttons are too small.</figcaption>
</figure>


According to [Android accessibility guidance](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB) the recommended target size for touchscreen objects is 7–10 mm. Apple interface guidelines suggest 48x48 px, and the W3C suggest [at least 44x44 CSS pixels](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html). On that basis, add (at least) about 15 px of padding to input elements and buttons for mobile, and around 10 px on desktop. Try this out with a real mobile device and a real finger or thumb. You should comfortably be able to tap each of your inputs and buttons.

{% Aside 'gotchas' %}
Design for thumbs.

Search for [touch target](https://www.google.com/search?q=touch+target) and you'll see lots of pictures of forefingers. However, in the real world, many people use their thumbs to interact with phones.

Thumbs are bigger than forefingers, and control is less precise. All the more reason for adequately sized touch targets.
{% endAside %}

### Make text big enough

As with size and padding, the default browser font size for input elements and buttons is too small, particularly on mobile.

<figure class="w-figure">
  <img src="./unstyled-form-text.png" alt="Screenshot of unstyled form in Chrome on desktop and on Android.">
  <figcaption class="w-figcaption">Default styling on desktop and mobile: input text is too small to be legible for many users.</figcaption>
</figure>

Browsers on different platforms size fonts differently, so it's difficult to specify a particular font size that works well everywhere. A quick survey of popular websites shows sizes of 13–16 px on desktop: matching that physical size is a good minimum for text on mobile.

This means you need to use a larger pixel size on mobile: 16 px on Chrome on desktop is quite legible, but even with 20/20 vision it's difficult to read 16 px text on Chrome on Android. You can set different font pixel sizes for different viewport sizes using [media queries](https://developers.google.com/web/fundamentals/design-and-ux/responsive#apply_media_queries_based_on_viewport_size). 20 px is about right on mobile—but you should test this out with friends or colleagues who don't have 20/20 vision.

{% Aside 'caution' %}
Unfortunately, autofill text (on Chrome for Android, at least) is small, and can't be sized with CSS.

There's a bug for this at [crbug.com/953689](crbug.com/953689). If you think this is important, star it!
{% endAside %}


### Provide enough space between inputs

Sounds obvious, but many sites get this wrong.

Add enough margin to make inputs work well as touch targets. In other words, aim for about a finger width of margin.


### Make sure your inputs are clearly visible

The default border styling for inputs makes them hard to see. They're almost invisible on some platforms such as Chrome for Android.

As well as padding, add a border (#ccc or darker is a start).

<figure class="w-figure">
  <img src="./styled-signin-form.png" alt="Screenshot of styled form in Chrome on Android." width="250">
  <figcaption class="w-figcaption">Legible text, visible input borders, adequate padding and margins.</figcaption>
</figure>


### Use built-in browser features to warn of invalid input values

Browsers have built-in features to do basic form validation for inputs with a `type` attribute.

Browsers warn when you submit a form with an invalid value, and set focus on the problematic input.

<figure class="w-figure">
  <img src="./invalid-email.png" alt="Screenshot of a signin form in Chrome on desktop showing browser prompt and focus foor an invalid email value." width="300">
  <figcaption class="w-figcaption">Basic built-in validation by the browser.</figcaption>
</figure>

You can use the :invalid CSS selector to highlight invalid data. The `:not(:placeholder-shown)` is used to avoid selecting inputs with no content. 

```css
input[type=email]:not(:placeholder-shown):invalid {
  color: red;
  outline-color: red;
}
```


## Use JavaScript where necessary

### Toggle password display

You should add a **Show password** icon or button to enable users to check the text they've entered. [Usability suffers](https://www.nngroup.com/articles/stop-password-masking/) when users can't see the text they've entered. Currently there's no built-in way to do this, though [there are plans for implementation](https://twitter.com/sw12/status/1251191795377156099). You'll need to use JavaScript instead: you can see this in action in [step 4](https://glitch.com/edit/#!/signin-form-codelab-4) of the codelab for this article.

<figure class="w-figure">
  <img src="./show-password-google.png" alt="Google signin form showing Show password icon." width="350" style="border: 1px solid #eee; padding: 20px;">
  <figcaption class="w-figcaption">Google signin form: with <strong>Show password</strong> icon and <strong>Forgot password</strong> link.</figcaption>
</figure>

Code to add **Show password** functionality is straightforward. This example uses text, not an icon.

HTML:
```html/2
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="current-password" required>
</section>
```

CSS (so the button looks like plain text):
```css
button#toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  /* Media query isn't shown here. */
  font-size: var(--mobile-font-size); 
  font-weight: 300;
  padding: 0;
  /* Display at the top right of the container */
  position: absolute;
  top: 0;
  right: 0;
}
```

JavaScript:
```javascript
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');

togglePasswordButton.addEventListener('click', togglePassword);

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Hide password';
    togglePasswordButton.setAttribute('aria-label',
      'Hide password.');
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show password';
    togglePasswordButton.setAttribute('aria-label',
      'Show password as plain text. ' +
      'Warning: this will display your password on the screen.');
  }
}
```

Here's the end result:

<figure class="w-figure">
  <img src="./show-password.png" alt="Screenshots of signin form with Show password text 'button', in Safari on Mac and on iPhone 7." width="800" style="border: 1px solid #999;>
  <figcaption class="w-figcaption">Signin form with <strong>Show password</strong> text 'button', in Safari on Mac and iPhone 7.</figcaption>
</figure>


### Make password inputs accessible

Use `aria-describedby` to explain password constraints, using the element that describes the constraints for your password input. Screenreaders read the label text, the input type (password), and then the description. 

```html
<input type="password" aria-describedby="password-constraints" ...>
<div id="password-constraints">Eight or more characters with a mix of letters, numbers and symbols.</div>
```

When you add **Show password** functionality, make sure to include an`aria-label` to warn that the password will be displayed. Otherwise users may inadvertently reveal passwords.

```html
<button id="toggle-password" aria-label="Show password as plain text.
Warning: this will display your password on the screen.">Show password</button>
```

You can see both these `aria` features in action at [glitch.com/#!/signup-form](https://glitch.com/edit/#!/signup-form).

[Creating Accessible Forms](https://webaim.org/techniques/forms/) has more tips to help make forms accessible.


### Validate in realtime and before submission

HTML form elements and attributes have built-in features for basic validation, but you should also use JavaScript to do more robust validation while users are entering data and when they attempt to submit the form. 

{% Aside 'caution' %}
Client-side validation helps users enter data and can avoid unnecessary server load, but you must always validate and sanitize data on your back-end.
{% endAside %}

[Step 5](https://glitch.com/edit/#!/signin-form-codelab-5) of the signin form codelab uses the [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints) (which is [widely supported](https://caniuse.com/#search=constraint%20validation)) to add custom validation using built-in browser UI to set focus and display prompts.

Find out more: [Use JavaScript for more complex real-time validation](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation).


### Analytics and RUM

"What you cannot measure, you cannot improve" is particularly true for signup and signin forms. You need to set goals, measure success, improve your site—and repeat.

[Discount usability testing](https://www.nngroup.com/articles/discount-usability-20-years/) can be helpful for trying out changes, but you'll need real-world data to really understand how your users experience your signup and signin forms:

* **Page analytics**: including signup and signin page views, bounce rates, and exits.
* **Interaction analytics**: such as [goal funnels](https://support.google.com/analytics/answer/6180923?hl=en) (where do users abandon your signin or signin flow?) and [events](https://developers.google.com/analytics/devguides/collection/gtagjs/events) (what actions do users take when interacting with your forms?)
* **Website performance**: [user-centric metrics](/user-centric-performance-metrics) to understand the real experience of your users (are your signup and signin forms slow for some reason and, if so, what is the cause?).

You may also want to consider implementing A/B testing in order to try out different approaches to signup and signin, and staged rollouts to 'test the water' before releasing changes to all your users.



## …and finally

Some general guidelines to help reduce signin form abandonment:

* Don't make users hunt for signin. It's surprising how many sites get this wrong! Put a link to the signin form at the top of the page, using well-understood wording such as **Sign In**, **Create Account** or **Register**.
* Keep it focused! Signup forms are not the place to distract people with offers and other site features.
* Minimize signup complexity. Collect other user data (such as addresses or credit card details) only when users see a clear benefit from providing that data.
* Before users start on your signup form, make it clear what the value proposition is. How do they benefit from signing in? Give users concrete incentives to complete signup.
* If possible allow users to identify themselves with a mobile phone number instead of an email address.
* Make it easy for users to reset their password, and make the **Forgot your password?** link obvious.
* Link to your Terms of Service and privacy policy documents: make it clear to users from the start how you safeguard their data.
* Include the logo and name of your company or organization on your signup and signin pages, and make sure that visual styles match the rest of your site. This may sound obvious, but many sites present users with forms that don't feel like they belong to the same site as other content.

[Something about (re)CAPTCHA?]


## Find out more

* [Create Amazing Forms](https://developers.google.com/web/fundamentals/design-and-ux/input/forms)
* [Best Practices For Mobile Form Design](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
* [More capable form controls](/more-capable-form-controls)
* [Creating Accessible Forms](https://webaim.org/techniques/forms/)
* 

Photo by [Katka Pavlickova](https://unsplash.com/@katerinapavlickova) on [Unsplash](https://unsplash.com).