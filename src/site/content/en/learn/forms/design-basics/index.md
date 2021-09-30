---
title: Design basics
description: >
  Learn how to build user-friendly forms.
authors:
  - michaelscharnagl
date: 2021-09-23
---

In the first section, you learned how to build a basic form.
This section is all about best practices.
In this module, learn about user experience (UX),
and why a well-implemented user interface (UI) can make a big difference.

## Creating user-friendly interfaces

Filling out forms can be time-consuming and frustrating.
It doesn't have to be.
To guarantee a great UX, make sure the UI is intuitive to use.
Ensure you deliver optimal form structure and graphic design (layout, spacing, font size and color),
and logical UI (such as label wording and appropriate input types).
Let's have a look at how you can improve your form and make it easy to use.

## Labels

Do you remember what the `<label>` element is for?
A label describes a form control.
A visible and well-written label helps the user understand the purpose of a form control.

### Use a label for every form control

Do you want to add a new form control to your form?
Start by adding the label for the new field.
This way, you don't forget to add it.

Adding the labels first also helps you to focus on the form's goals–what data do I need here?
Once this is clear, you can focus on helping the user enter data and complete the form.

{% Aside %}
Never misuse the `placeholder` attribute as a label.
The placeholder is meant for giving a hint about the type of data you should enter,
not for describing a form control.

Learn more about why you should consider
[avoiding placeholders](https://www.smashingmagazine.com/2018/06/placeholder-attribute/).
{% endAside %}

### Label wording

Say that you want to describe an email field. You could do so as follows:

```html
<label for="email">Enter your email address</label>
```

Or you could describe it like this:

```html
<label for="email">Email address</label>
```

### Which description do you choose?

For our example, the wording 'Email address' is preferred,
since short labels are easier to scan, reduce visual clutter,
and help users to understand what data is needed faster.

## Label position

With [CSS](/learn/forms/css/styling),
you can position a label on the top, bottom, left, and right of a form control.
Where do you place it?

[Research shows](https://ai.googleblog.com/2014/07/simple-is-better-making-your-web-forms.html)
that best practice is to
[position the label above the form control](https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php),
so the user can scan a form quickly and see which label belongs to which form control.

## Designing forms

Good form design can
[significantly reduce form abandonment rates](https://baymard.com/blog/checkout-flow-average-form-fields).
Help users enter data by using the appropriate element and input type
There are various
[form elements and input types](/learn/forms/form-elements) you can choose from.
To offer the best UX, use the most suitable element and input type for your use case.
If the user should fill in multiple lines of text, use the `<textarea>` element.
Where they need to accept your site's terms and conditions, use `<input type="checkbox">`.

{% Aside %}
Depending on the `type` or `inputmode` attribute (more about this
[later](/learn/forms/attributes#inputmode))
a different on-screen keyboard is shown on touch devices.
If you use `type="tel"`, users on touch devices get a keyboard showing only the characters needed to enter a telephone number.
By using `type="email"` the mobile device displays a keyboard optimized for entering an email address.
{% endAside %}

You should also visually differentiate between different types of form controls.
A button should look like a button.
An input like an input.
Make it easy for users to recognize the purpose of a form control.
For example, If something looks like a link, clicking on it should open a new page,
and not submit a form.

{% Codepen {
  user: 'web-dot-dev',
  id: 'c369bda56ae3bc88aa0116614f79e40d',
  height: 450
} %}

### Help users navigate forms

An extravagant layout can be fun, but may get in the way of completing a form.

In particular,
[research shows](https://baymard.com/blog/avoid-multi-column-forms)
that it's best to use only a single column.
Users don't want to spend time searching where the next form control is.
By using one column, there is only one direction to follow.

{% Aside %}
Always ensure that forms are accessible for people who use only the keyboard to navigate websites—either through preference or circumstance.
Test your form by only using keyboard navigation.
The tab order should follow the visual order.
You can view the
[source order in Chrome DevTools](https://developer.chrome.com/blog/new-in-devtools-92/#source-order).
{% endAside %}

### Help users interact with forms

To avoid accidental taps and clicks,
and help users interact with your form, make your buttons big enough.
The recommended
[tap target size](/accessible-tap-targets/) of a button is at least 48px.
You should also add enough spacing between form controls using the `margin`
CSS property to help avoid accidental interactions.

The default size of form controls is too small to be really usable. You should increase the size by using `padding` and changing the default `font-size`.

{% Aside %}
Use at least `1rem` (which for most browsers has a default value of 16px)
as the `font-size` for your form controls.
This [prevents a page zoom](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/)
on iOS Safari when a form control is focused.
{% endAside %}

You can define different sizes for different pointing devices,
for example, a mouse, using the  `pointer` CSS media feature.

```css
// pointer device, for example, a mouse
@media (pointer: fine) {
  input[type="checkbox"] {
    width: 15px;
    height: 15px;
  }
}

// pointer device of limited accuracy, for example, a touch-based device
@media (pointer: coarse) {
  input[type="checkbox"] {
    width: 30px;
    height: 30px;
  }
}
```

Learn more about the
[`pointer` CSS media feature](https://developer.mozilla.org/docs/Web/CSS/@media/pointer).

### Show errors where they happen

To make it straightforward for users to find out which form control needs their attention,
display error messages next to the form control they refer to.
When displaying errors on form submission, make sure to navigate to the first invalid form control.

### Make it clear to users what data to enter

Make sure users understand how to enter valid data.
Do they need to enter at least eight characters? Tell them.

```html
<label for="password">Password (required)</label>
<input required minlength="8" type="password" id="password" name="password" aria-describedby="password-minlength">
<span id="password-minlength">Enter at least eight characters</span>
```

### Make it clear to users which fields are required

```html
<label for="name">Name (required)</label>
<input name="name" id="name">
```

Learn more about
[indicating required fields](https://www.deque.com/blog/anatomy-of-accessible-forms-required-form-fields/).

If most fields are required,
it's also
[an option to indicate the optional fields](https://www.lukew.com/ff/entry.asp?725).

How can you connect error messages to form controls to make them accessible for screen readers?
You can learn about this in [the next module](/learn/forms/accessibility).

{% Assessment 'design-basics' %}


## Resources

- [Create Amazing Forms](https://developers.google.com/web/fundamentals/design-and-ux/input/forms)
- [Best Practices For Mobile Form Design](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [Baymard Institute: E-Commerce UX Research](https://baymard.com/blog)
