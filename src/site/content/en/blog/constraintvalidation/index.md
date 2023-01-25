---
layout: post
title: Constraint validation
subhead: Native client side validation for web forms
authors:
  - tjvantoll
date: 2012-10-17
tags:
  - blog
---

## Introduction

Validating forms has notoriously been a painful development experience.  Implementing client side validation in a user-friendly, developer-friendly, and accessible way is hard.  Before HTML5 there was no means of implementing validation natively; therefore, developers have resorted to a variety of JavaScript based solutions.

To help ease the burden on developers, HTML5 introduced a concept known as [constraint validation](http://www.whatwg.org/specs/web-apps/current-work/#constraint-validation) - a native means of implementing client side validation on web forms.

Yet, despite being available in the latest version of all major browsers, constraint validation is a topic largely relegated to presentations and demos.  My goal in writing this is to shed some light on the new APIs to help developers make better web forms for everyone.

In this tutorial I will:

- Present a comprehensive overview of what constraint validation is.
- Dig into the current limitations of the spec and browser implementations.
- Discuss how you can use HTML5 constraint validation in your forms now.

## What is Constraint Validation?

The core of constraint validation is an algorithm browsers run when a form is submitted to determine its validity.  To make this determination, the algorithm utilizes new HTML5 attributes [`min`](http://www.whatwg.org/specs/web-apps/current-work/#attr-input-min), [`max`](http://www.whatwg.org/specs/web-apps/current-work/#attr-input-max), [`step`](http://www.whatwg.org/specs/web-apps/current-work/#attr-input-step), [`pattern`](http://www.whatwg.org/specs/web-apps/current-work/#the-pattern-attribute), and [`required`](http://www.whatwg.org/specs/web-apps/current-work/#attr-input-required) as well as existing attributes [`maxlength`](http://www.whatwg.org/specs/web-apps/current-work/#attr-fe-maxlength) and [type](http://www.whatwg.org/specs/web-apps/current-work/#attr-input-type).

As an example take this form with an empty `required` text input:

```html
<form>
    <input type="text" required value="" />
    <input type="submit" value="Submit" />
</form>
```

[Try It](http://jsfiddle.net/tj_vantoll/HdSqt/)

If you attempt to submit this form as is, [supporting browsers](http://caniuse.com/#feat=form-validation) will prevent the submission and display the following:

<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ekp28U4piwCMR0PGkbHG.png", alt="Chrome 21 display", width="217", height="102" %}
    <figcaption>
      Chrome 21
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/q4gt3tHHFcmHPsi3pu34.png", alt="Firefox 15 display", width="266", height="116" %}
    <figcaption>
      Firefox 15
    </figcaption>
  </figure>
</div>

<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/xlIqApbAwTJkg4hzwB4C.png", alt="IE10 display", width="235", height="106" %}
    <figcaption>
      Internet Explorer 10
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/oPwZBCPKHkoDQ9cFphDi.png", alt="Opera 12 display", width="216", height="90" %}
    <figcaption>
      Opera 12
    </figcaption>
  </figure>
</div>


<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/zGA5baPJ7dY8EwZ0z2Kn.png", alt="Opera Mobile display", width="330", height="119" %}
    <figcaption>
      Opera Mobile
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Fry6WD1dsy9RHtnJgWUn.png", alt="Chrome for Android display", width="430", height="160" %}
    <figcaption>
      Chrome for Android
    </figcaption>
  </figure>
</div>


<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/X12SZPt4gXHC3KokWrOm.png", alt="Firefox for Android display", width="391", height="134" %}
    <figcaption>
      Firefox for Android
    </figcaption>
  </figure>
</div>

Per the spec how errors are presented to the user is left up to the browser itself.  However, the spec does provide a full DOM API, new HTML attributes, and CSS hooks authors can use to customize the experience.

## DOM API

The [constraint validation API](http://www.whatwg.org/specs/web-apps/current-work/#constraint-validation-api) adds the following properties / methods to DOM nodes.

### willValidate

{% BrowserCompat 'api.ElementInternals.willValidate' %}

The `willValidate` property indicates whether the node is a candidate for constraint validation.  For [submittable elements](http://www.whatwg.org/specs/web-apps/current-work/#category-submit) this will be set to `true` unless for some reason the node is [barred from constraint validation](http://www.whatwg.org/specs/web-apps/current-work/#barred-from-constraint-validation), such as possessing the `disabled` attribute.

```html
<div id="one"></div>
<input type="text" id="two" />
<input type="text" id="three" disabled />
<script>
    document.getElementById('one').willValidate; //undefined
    document.getElementById('two').willValidate; //true
    document.getElementById('three').willValidate; //false
</script>
```

### validity

{% BrowserCompat 'api.ElementInternals.validationMessage' %}

The [`validity`](http://www.whatwg.org/specs/web-apps/current-work/#dom-cva-validity) property of a DOM node returns a [`ValidityState`](http://www.whatwg.org/specs/web-apps/current-work/#validitystate) object containing a number of boolean properties related to the validity of the data in the node.


- `customError`: `true` if a custom validity message has been set per a call to `setCustomValidity()`.
    ```html
    <input id="foo" />
    <input id="bar" />
    <script>
        document.getElementById('foo').validity.customError; //false
        document.getElementById('bar').setCustomValidity('Invalid');
        document.getElementById('bar').validity.customError; //true
    </script>
    </pre>
    ```
- `patternMismatch`: `true` if the node's `value` does not match its `pattern` attribute.
    ```html
    <input id="foo" pattern="[0-9]{4}" value="1234" />
    <input id="bar" pattern="[0-9]{4}" value="ABCD" />
    <script>
        document.getElementById('foo').validity.patternMismatch; //false
        document.getElementById('bar').validity.patternMismatch; //true
    </script>
    ```
- `rangeOverflow`: `true` if the node's `value` is greater than its `max` attribute.
    ```html
    <input id="foo" type="number" max="2" value="1" />
    <input id="bar" type="number" max="2" value="3" />
    <script>
        document.getElementById('foo').validity.rangeOverflow; //false
        document.getElementById('bar').validity.rangeOverflow; //true
    </script>
    ```
- `rangeUnderflow`: `true` if the node's `value` is less than its `min` attribute.
    ```html
    <input id="foo" type="number" min="2" value="3" />
    <input id="bar" type="number" min="2" value="1" />
    <script>
        document.getElementById('foo').validity.rangeUnderflow; //false
        document.getElementById('bar').validity.rangeUnderflow; //true
    </script>
    ```
-  `stepMismatch`: `true` if the node's `value` is invalid per its `step` attribute.
    ```html
    <input id="foo" type="number" step="2" value="4" />
    <input id="bar" type="number" step="2" value="3" />
    <script>
        document.getElementById('foo').validity.stepMismatch; //false
        document.getElementById('bar').validity.stepMismatch; //true
    </script>
    ```
- `tooLong`: `true` if the node's `value` exceeds its `maxlength` attribute.  All browsers prevent this from realistically occurring by preventing users from inputting values that exceed the maxlength.  Although rare it is possible to have this property be `true` in some browsers; I've written about how that's possible [here](http://tjvantoll.com/2012/10/17/maxlength-constraint-validation-oddities/).
- `typeMismatch`: `true` if an input node's `value` is invalid per its `type` attribute.
    ```html
    <input id="foo" type="url" value="http://foo.com" />
    <input id="bar" type="url" value="foo" />

    <input id="foo2" type="email" value="foo@foo.com" />
    <input id="bar2" type="email" value="bar" />

    <script>
        document.getElementById('foo').validity.typeMismatch; //false
        document.getElementById('bar').validity.typeMismatch; //true

        document.getElementById('foo2').validity.typeMismatch; //false
        document.getElementById('bar2').validity.typeMismatch; //true
    </script>
    ```
- `valueMissing`: `true` if the node has a `required` attribute but has no value.
    ```html
    <input id="foo" type="text" required value="foo" />
    <input id="bar" type="text" required value="" />
    <script>
        document.getElementById('foo').validity.valueMissing; //false
        document.getElementById('bar').validity.valueMissing; //true
    </script>
    ```
-  `valid`: `true` if all of the validity conditions listed above are `false`.
    ```html
    <input id="valid-1" type="text" required value="foo" />
    <input id="valid-2" type="text" required value="" />
    <script>
        document.getElementById('valid-1').validity.valid; //true
        document.getElementById('valid-2').validity.valid; //false
    </script>
    ```

### validationMessage

{% BrowserCompat 'api.ElementInternals.validationMessage' %}

The `validationMessage` property of a DOM node contains the message the browser displays to the user when a node's validity is checked and fails.

The browser provides a default localized message for this property.  If the DOM node is not a candidate for constraint validation or if the node contains valid data `validationMessage` will be set to an empty string.

{% Aside %}
As of this writing Opera does not fill in this property by default.  It will show the user a correct error message, it just doesn't fill in the property.
{% endAside %}


```html
<input type="text" id="foo" required />
<script>
    document.getElementById('foo').validationMessage;
    //Chrome  --> 'Please fill out this field.'
    //Firefox --> 'Please fill out this field.'
    //Safari  --> 'value missing'
    //IE10    --> 'This is a required field.'
    //Opera   --> ''
</script>
```

### checkValidity()

{% BrowserCompat 'api.ElementInternals.checkValidity' %}

The `checkValidity` method on a form element node (e.g. input, select, textarea) returns `true` if the element contains valid data.

On form nodes it returns `true` if all of the form's children contain valid data.

```html
<form id="form-1">
    <input id="input-1" type="text" required />
</form>
<form id="form-2">
    <input id="input-2" type="text" />
</form>
<script>
    document.getElementById('form-1').checkValidity();  //false
    document.getElementById('input-1').checkValidity(); //false

    document.getElementById('form-2').checkValidity();  //true
    document.getElementById('input-2').checkValidity(); //true
</script>
```

Additionally, every time a form element's validity is checked via `checkValidity` and fails, an `invalid` event is fired for that node.  Using the example code above if you wanted to run something whenever the node with id `input-1` was checked and contained invalid data you could use the following:

```js
document.getElementById('input-1').addEventListener('invalid', function() {
    //...
}, false);
```

There is no valid event, however, you can use the `change` event for notifications of when a field's validity changes.

```js
document.getElementById('input-1').addEventListener('change', function(event) {
    if (event.target.validity.valid) {
        //Field contains valid data.
    } else {
        //Field contains invalid data.
    }
}, false);
```

### setCustomValidity()

{% BrowserCompat 'api.HTMLObjectElement.setCustomValidity' %}

The `setCustomValidity` method changes the `validationMessage` property as well as allows you to add custom validation rules.

Because it is setting the `validationMessage` passing in an empty string marks the field as valid and passing any other string marks the field as invalid.  Unfortunately there is no way of setting the `validationMessage` without also changing the validity of a field.

For example, if you had two password fields you wanted to enforce be equal you could use the following:

```js
if (document.getElementById('password1').value != document.getElementById('password2').value) {
    document.getElementById('password1').setCustomValidity('Passwords must match.');
} else {
    document.getElementById('password1').setCustomValidity('');
}
```

## HTML Attributes

We've already seen that the `maxlength`, `min`, `max`, `step`, `pattern`, and `type` attributes are used by the browser to constrain data.  For constraint validation there are two additional relevant attributes - `novalidate` and `formnovalidate`.

### novalidate

The boolean `novalidate` attribute can be applied to form nodes.  When present this attribute indicates that the form's data should not be validated when it is submitted.

```html
<form novalidate>
    <input type="text" required />
    <input type="submit" value="Submit" />
</form>
```

Because the above form has the `novalidate` attribute it will submit even though it contains an empty required input.

### formnovalidate

The boolean `formnovalidate` attribute can be applied to button and input nodes to prevent form validation.  For example:

```html
<form>
    <input type="text" required />
    <input type="submit" value="Validate" />
    <input type="submit" value="Do NOT Validate" formnovalidate />
</form>
```

[Try It](http://jsfiddle.net/tj_vantoll/5nD83/)

When the "Validate" button is clicked form submission will be prevented because of the empty input.  However, when the "Do NOT Validate" button is clicked the form will submit despite the invalid data because of the `formnovalidate` attribute.

## CSS Hooks

Writing effective form validation is not just about the errors themselves; it's equally important to show the errors to the user in a usable way, and supporting browsers give you CSS hooks to do just that.

### :invalid and :valid

In supporting browsers the `:valid` pseudo-classes will match form elements that meet their specified constraints and the `:invalid` pseudo-classes will match those that do not.

```html
<form>
    <input type="text" id="foo" required />
    <input type="text" id="bar" />
</form>
<script>
    document.querySelectorAll('input[type="text"]:invalid'); //Matches input#foo
    document.querySelectorAll('input[type="text"]:valid');   //Matches input#bar
</script>
```

### Resetting Default Styling

By default Firefox places a red `box-shadow` and IE10 places a red `outline` on `:invalid` fields.

<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/q4gt3tHHFcmHPsi3pu34.png", alt="Firefox default erred field display", width="266", height="116" %}
    <figcaption>
      Firefox 15
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/xlIqApbAwTJkg4hzwB4C.png", alt="IE10 default erred field display", width="235", height="106" %}
    <figcaption>
      Internet Explorer 10
    </figcaption>
  </figure>
</div>

WebKit based browsers and Opera do nothing by default.  If you would like a consistent starting point you can use the following to suppress the defaults.

```css
:invalid {
    box-shadow: none; /* FF */
    outline: 0;       /* IE 10 */
}
```

I have a pending [pull request](https://github.com/necolas/normalize.css/pull/124) to discuss whether this normalization belongs in [normalize.css](https://github.com/necolas/normalize.css).

## Inline Bubbles

A larger display discrepancy is the look of the inline validation bubbles the browser displays on invalid fields.  However, WebKit is the only rendering engine that gives you any means of customizing the bubble.  In WebKit you can experiment with the following 4 pseduoclasses in order to get a more custom look.

```css
::-webkit-validation-bubble {}
::-webkit-validation-bubble-message {}
::-webkit-validation-bubble-arrow {}
::-webkit-validation-bubble-arrow-clipper {}
```

### Removing the Default Bubble

Because you can only customize the look of the bubbles in WebKit, if you want a custom look across all supporting browsers your only option is to suppress the default bubble and implement your own. The following will disable the default inline validation bubbles from all forms on a page.

```js
var forms = document.getElementsByTagName('form');
for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('invalid', function(e) {
        e.preventDefault();
        //Possibly implement your own here.
    }, true);
}
```

If you do suppress the default bubbles make sure that you do something to show errors to users after invalid form submissions.  Currently the bubbles are the only means by which browsers indicate something went wrong.

## Current Implementation Issues and Limitations

While these new APIs bring a lot of power to client side form validation, there are some limitations to what you are able to do.

### setCustomValidity

For simply setting the `validationMessage` of a field `setCustomValidity` works, but as forms get more complex a number of limitations of the `setCustomValidity` method become apparent.

**Problem #1**: Handling multiple errors on one field

Calling `setCustomValidity` on a node simply overrides its `validationMessage`.  Therefore, if you call `setCustomValidity` on the same node twice the second call will simply overwrite the first.  There is no mechanism to handle for an array of error messages or a way of displaying multiple error messages to the user.

One way of handling this is to append additional messages to the node's `validationMessage` as such.

```js
var foo = document.getElementById('foo');
foo.setCustomValidity(foo.validationMessage + ' An error occurred');
```

You cannot pass in HTML or formatting characters so unfortunately concatenating strings can leave you with something like this:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/wjOeoy8ZyTSurFyYAueX.png", alt="Chrome display of an error message with concatenated strings", width="345", height="107" %}
</figure>

**Problem #2**: Knowing when to check the validity of a field

To illustrate this issue consider the example of a form with two password input fields that must match:

```html
<form>
    <fieldset>
        <legend>Change Your Password</legend>
        <ul>
            <li>
                <label for="password1">Password 1:</label>
                <input type="password" required id="password1" />
            </li>
            <li>
                <label for="password2">Password 2:</label>
                <input type="password" required id="password2" />
            </li>
        </ul>
        <input type="submit" />
    </fieldset>
</form>
```

My suggestion earlier was to use the `change` event to implement the validation, which looks something like this:

```js
var password1 = document.getElementById('password1');
var password2 = document.getElementById('password2');

var checkPasswordValidity = function() {
    if (password1.value != password2.value) {
        password1.setCustomValidity('Passwords must match.');
    } else {
        password1.setCustomValidity('');
    }
};

password1.addEventListener('change', checkPasswordValidity, false);
password2.addEventListener('change', checkPasswordValidity, false);
```

[Try It](http://jsfiddle.net/tj_vantoll/8g8Nz/0/)

Now, whenever the value of either password field is changed by the user the validity will be reevaluated.  However, consider a script that automatically fills in the passwords, or even a script that changes a constraint attribute such as `pattern`, `required`, `min`, `max`, or `step`.  This could absolutely affect the validity of the password fields, yet, there is no event to know that this has happened.

Bottom Line: We need a means of running code whenever a field's validity __might have__ changed.

**Problem #3**: Knowing when a user attempts to submit a form

Why not use the form's `submit` event for the problem described above?  The `submit` event is not fired until after the browser has determined a form contains valid data given all of its specified constraints.  Therefore, there is no way of knowing when a user attempts to submit a form and it is prevented by the browser.

It can be very useful to know when a submission attempt occurs.  You may want to show the user a list of error messages, change focus, or display help text of some sort.  Unfortunately, you'll need a workaround to make this happen.

One way to accomplish this is by adding the `novalidate` attribute to the form and use its `submit` event.  Because of the `novalidate` attribute the form submission will not be prevented regardless of the validity of the data.  Therefore, the client script will have to explicitly check whether the form contains valid data in a `submit` event and prevent submission accordingly.  Here's an extension of the password match example that enforces that the validation logic will run before the form is submitted.

```html
<form id="passwordForm" novalidate>
    <fieldset>
        <legend>Change Your Password</legend>
        <ul>
            <li>
                <label for="password1">Password 1:</label>
                <input type="password" required id="password1" />
            </li>
            <li>
                <label for="password2">Password 2:</label>
                <input type="password" required id="password2" />
            </li>
        </ul>
        <input type="submit" />
    </fieldset>
</form>
<script>
    var password1 = document.getElementById('password1');
    var password2 = document.getElementById('password2');

    var checkPasswordValidity = function() {
        if (password1.value != password2.value) {
            password1.setCustomValidity('Passwords must match.');
        } else {
            password1.setCustomValidity('');
        }
    };

    password1.addEventListener('change', checkPasswordValidity, false);
    password2.addEventListener('change', checkPasswordValidity, false);

    var form = document.getElementById('passwordForm');
    form.addEventListener('submit', function() {
        checkPasswordValidity();
        if (!this.checkValidity()) {
            event.preventDefault();
            //Implement you own means of displaying error messages to the user here.
            password1.focus();
        }
    }, false);
</script>
```

[Try It](http://jsfiddle.net/tj_vantoll/8g8Nz/)

The major disadvantage of this approach is that adding the `novalidate` attribute to a form prevents the browser from displaying the inline validation bubble to the user.  Therefore, if you use this technique you must implement your own means of presenting error messages to the user. [Here is a simple example](http://jsfiddle.net/tj_vantoll/a533m/) showing one way of accomplishing this.

Bottom Line: We need a `forminvalid` event that would be fired whenever a form submission was prevented due to invalid data.

### Safari

Even though Safari supports the constraint validation API, as of this writing (version 6), Safari will not prevent submission of a form with constraint validation issues.  To the user Safari will behave no differently than a browser that doesn't support constraint validation at all.

The easiest way around this is to use the same approach as the workaround described above, give all forms the `novalidate` attribute and manually prevent form submissions using `preventDefault`.  The following code adds this behavior to all forms.

```js
var forms = document.getElementsByTagName('form');
for (var i = 0; i < forms.length; i++) {
    forms[i].noValidate = true;

    forms[i].addEventListener('submit', function(event) {
        //Prevent submission if checkValidity on the form returns false.
        if (!event.target.checkValidity()) {
            event.preventDefault();
            //Implement you own means of displaying error messages to the user here.
        }
    }, false);
}
```

[Try It](http://jsfiddle.net/tj_vantoll/rFLxt/)

Note: There are several documented bugs where the `checkValidity` method returns false positives (see [here](https://bugs.webkit.org/show_bug.cgi?id=48491) and [here](https://github.com/aFarkas/webshim/issues/134) for examples).  False positives are especially dangerous with the above workaround because the user will be stuck on a form with valid data, so use caution.

### Declarative Error Messages

While you have the ability to change a field's error message by setting its `validationMessage` through `setCustomValidity`, it can be a nuisance to continuously setup the JavaScript boilerplate to make this happen, especially on large forms.

To help make this process easier, Firefox introduced a custom `x-moz-errormessage` attribute that can be used to automatically set a field's `validationMessage`.

```html
<form>
    <input type="text" required x-moz-errormessage="Fill this out." />
    <input type="submit" value="Submit" />
</form>
```

[Try It](http://jsfiddle.net/tj_vantoll/CCZNp/)

When the above form is submitted in Firefox the user will see the custom message instead of the browser's default.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Vnin4jQbl61uVOG5Vapd.png", alt="Firefox display of the x-moz-errormessage attribute", width="255", height="115" %}
</figure>

This feature was [proposed to the W3C](https://www.w3.org/Bugs/Public/show_bug.cgi?id=10923) but was rejected.  Therefore, at the moment Firefox is the only browser where you can declaratively specify error messages.

<h4>Title Attribute</h4>

While it doesn't change the `validationMessage`, in the case of a `patternMismatch` browsers do display the contents of the `title` attribute in the inline bubble if it's provided.

{% Aside %}
Chrome will actually display the `title` attribute when provided for any type of error, not just `patternMismatch`es.
{% endAside %}

For example if you try to submit the following form:

```html
<form>
    <label for="price">Price: $</label>
    <input type="text" pattern="[0-9].[0-9][0-9]"
        title="Please enter the price in x.xx format (e.g. 3.99)"
        id="price" value="3" />
    <input type="submit" value="Submit" />
</form>
```

[Try It](http://jsfiddle.net/tj_vantoll/SVWXw/)

Here's a sampling of what browsers will display:

<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/qapvv9VvWsFoBTmTgjsW.png", alt="Chrome display of the title attribute", width="368", height="105" %}
    <figcaption>
       Chrome 21
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/rIGul4TiLn77trfgON81.png", alt="Firefox display of the title attribute", width="373", height="134" %}
    <figcaption>
      Firefox 15
    </figcaption>
  </figure>
</div>

<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/JHOes0YwOkUugwiF5PNE.png", alt="Opera display of the title attribute", width="271", height="114" %}
    <figcaption>
      Opera 12
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/r53BkiDvxravU1sLH4C3.png", alt="IE10 display of the title attribute", width="391", height="135" %}
    <figcaption>
      IE 10
    </figcaption>
  </figure>
</div>

### :invalid and :valid

As discussed earlier the `:valid` pseudo-class will match form elements that meet all specified constraints and the `:invalid` pseudo-class will match those that do not.  Unfortunately these pseudo-classes will be matched immediately, before the form is submitted and before the form is interacted with.  Consider the following example:

```html
<style>
    :invalid {
        border: 1px solid red;
    }
    :valid {
        border: 1px solid green;
    }
</style>
<form>
    <input type="text" required />
    <input type="text" />
</form>
```

[Try It](http://jsfiddle.net/tj_vantoll/6sygE/)

The goal here is to simply place a red border around invalid fields and a green border around valid ones, which it does immediately as the form is rendered.  However, [usability tests of inline form validation](http://www.alistapart.com/articles/inline-validation-in-web-forms/) have shown that the best time to give user feedback is immediately **after** they interact with  a field, not before.

One way to accomplish this with the example above is to add a class to the inputs after they have been interacted with and only apply the borders when the class is present.

```html
<style>
    .interacted:invalid {
        border: 1px solid red;
    }
    .interacted:valid {
        border: 1px solid green;
    }
</style>
<form>
    <input type="text" required />
    <input type="text" />
    <input type="submit" />
</form>
<script>
    var inputs = document.querySelectorAll('input[type=text]');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('blur', function(event) {
            event.target.classList.add('interacted');
        }, false);
    }
</script>
```

[Try It](http://jsfiddle.net/tj_vantoll/WLHDY/)

Firefox has seen these issues and [implemented two additional pseudo-classes](http://blog.oldworld.fr/index.php?post/2011/05/Improving-HTML5-Forms-user-experience-with-moz-ui-invalid-and-moz-ui-valid-pseudo-classes) - `:-moz-ui-invalid` and `:-moz-ui-valid`.  Unlike `:invalid` and `:valid`, `:-moz-ui-invalid` and `:-moz-ui-valid` will not match a field until the field is modified or the user tries to submit the form with invalid input.

Based on this work the [CSS selectors level 4 specification](http://www.w3.org/TR/selectors4/#user-pseudos) contains a `:user-error` pseudo-class that functions much like `:-moz-ui-invalid`.  It has yet to be implemented by any browsers.

One final note.  Be aware that `:valid` and `:invalid` should match `<form>` nodes in addition to form elements.  Currently this has only been implemented in Firefox, but be careful when applying global rules to `:valid` and `:invalid`.

### Unsupported Browsers

While browser support for constraint validation is quite good, there are still some major players in which it is not present, most notably IE <= 9, iOS Safari, and the default Android browser.

## Dealing with Unsupported Browsers

If you intend to use the new constraint validation APIs in a production web form you have to do __something__ about unsupported browsers.  In my experience there are two primary options:

**Option 1** - Rely on Server Side Validation Alone

It's important to remember that even with these new APIs client side validation does not remove the need for server side validation.  Malicious users can easily workaround any client side constraints, and, HTTP requests don't have to originate from a browser.

Therefore client side validation should always be treated as a progressive enhancement to the user experience; all forms should be usable even if client side validation is not present.

Since you have to have server side validation anyways, if you simply have your server side code return reasonable error messages and display them to the end user you have a built in fallback for browsers that don't support any form of client side validation.

**Option 2** - Polyfill

While relying on server side validation is reasonable for some applications, for many throwing away the usability advantages of client side validation for users in non-supporting browsers is simply not an option.

If you want to write code with the new APIs and want it to work anywhere the best way to accomplish this is with a [polyfill](http://remysharp.com/2010/10/08/what-is-a-polyfill/).  In addition to making the APIs work in non-supporting browsers, many polyfills take an extra step and workaround some of the issues in the native implementations.

## Polyfilling

There are a [number of polyfills](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) that allow use of the constraint validation API in any browser.  I will discuss two of the more popular options available.

### Webshims

[Webshims](http://afarkas.github.com/webshim/demos/index.html) is collection of polyfills including one for HTML5 forms and the constraint validation API.

To show how to use Webshims let's return to our original example of a form with a single `required` text input.

```html
<form>
    <input type="text" required value="" />
    <input type="submit" value="Submit" />
</form>
```

To make this work consistently across all browsers you need to include Webshims and its dependencies then call `$.webshims.polyfill('forms')`.

```html
<!-- Webshims' dependencies -->
<script src="js/jquery-1.8.2.js"></script>
<script src="js/modernizr-yepnope-custom.js"></script>

<!-- Webshims base -->
<script src="js-webshim/minified/polyfiller.js"></script>

<script>jQuery.webshims.polyfill('forms');</script>

<form>
    <input type="text" required value="" />
    <input type="submit" value="Submit" />
</form>
```

[Try It](http://jsfiddle.net/tj_vantoll/YsBNt/)

In supporting browsers there will be no difference in the result.  However, browsers that don't support constraint validation natively will now prevent invalid form submissions and display an error message in a custom bubble.  For example here's what the user will see in Safari and IE8.

<div class="switcher">
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/udGyHe7JX62xxr0Zj8he.png", alt="Display of an invalid form submission in Safari using Webshims", width="248", height="133" %}
    <figcaption>
      Safari 6
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/jnM7KzmdgPJkOs88JZH1.png", alt="Display of an invalid form submission in IE8 using Webshims", width="244", height="116" %}
    <figcaption>
      Internet Explorer 8
    </figcaption>
  </figure>
</div>

In addition to polyfilling, Webshims also provides solutions for many of the limitations of constraint validation discussed earlier.

- Declaratively specify error messages through a `data-errormessage` attribute.
- Provides classes `form-ui-valid` and `form-ui-invalid` which work similarly to `:-moz-ui-valid` and `:-moz-ui-invalid`.
- Provides custom events `firstinvalid`, `lastinvalid`, `changedvalid`, and `changedinvalid`.
- Includes workarounds for WebKit false positives on form submission.

For more information on what Webshims provides refer to its [HTML5 forms docs](http://afarkas.github.com/webshim/demos/demos/webforms.html).

### H5F

H5F is a lightweight, dependency free polyfill that implements the full constraint validation API as well as a number of the new attributes.

To see how to use H5F let's add it to our basic example of a form with a single `required` text input.

```html
<script src="H5F.js"></script>

<form>
    <input type="text" required value="" />
    <input type="submit" value="Submit" />
</form>
<script>
    H5F.setup(document.getElementsByTagName('form'));
</script>
```

[Try It](http://jsfiddle.net/tj_vantoll/63YAy/)

H5F will prevent the submission of the form in all browsers, but the user will only see an inline validation bubble in browsers that support it natively.  Since H5F polyfills the full constraint validation API you can use it to implement your own UI to do whatever you'd like.

If you're looking for some examples of how to leverage the API, [H5F's demo page](http://www.alistapart.com/d/forward-thinking-form-validation/enhanced_2.html) has an implementation that shows the messages in a bubble on the right hand side of the inputs.  I also have an example that shows how you can [show all error messages in a list](http://tjvantoll.com/2012/08/05/html5-form-validation-showing-all-error-messages/) at the top of forms.

In addition to polyfilling the constraint validation API, H5F also provides classes to mimic `:-moz-ui-valid` and `:-moz-ui-invalid`.  By default these classes are `valid` and `error` although they can be customized by passing in a second parameter to `H5F.setup`.

```js
H5F.setup(document.getElementById('foo'), {
    validClass: 'valid',
    invalidClass: 'invalid'
});
```

For more information on H5F [check it out on Github](https://github.com/ryanseddon/H5F).

## Conclusion

HTML5's constraint validation APIs make adding client side validation to forms quick while providing a JavaScript API and CSS hooks for customization.

While there are still some issues with the implementations and old browsers to deal with, with a good polyfill or server-side fallback you can utilize these APIs in your forms today.
