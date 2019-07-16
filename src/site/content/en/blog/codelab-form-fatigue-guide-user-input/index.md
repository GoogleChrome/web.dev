---
title: Codelab - Reduce form fatigue: validate user input
author: gmimani
alt: codelab
layout: codelab
glitch: form-validation-webdev

description: |
  Codelab to validate user input
related_post: form-fatigue-validate-user-input
tags:
  - codelab
  - forms

 ---

When a user fills out a form it is very important that the data is filled in a correct format. For a good user experience, you should provide feedback to the user (in real time) if an input is invalid.

We will create real time validation for a user signup page by:
- Leveraging the browser's built-in validation attributes  pattern, required, min, max, etc.)
- Using JavaScript and the Constraints Validation API for more complex validation requirements.
- Showing custom validation errors in real time, and if the user tries to submit an invalid form, showing all fields they need to fix.

This codelab shows the validation necessary for a sign-up page. To see the codelab in action:
1. Click on the **Show Live** button to view the live version of the sample app.
2. Click on the **Remix to Edit** button to make changes in the sample app .

Lets walk through the validations step by step:
##Leverage Browser's built-in validation
In the Sign up page add the browser's built in validation attributes.
<pre class="prettyprint">
&lt;form action=&quot;/HomePage.html&quot; autocomplete=&quot;on&quot; method=&quot;post&quot;
aria-label=&quot;Create an account&quot; &gt;
   &lt;input type=&quot;text&quot; name=&quot;your-name&quot; id=&quot;your-name&quot;
      autocomplete=&quot;your name&quot; required /&gt;
   &lt;input type=&quot;submit&quot; value=&quot;Sign Up&quot; /&gt;
&lt;/form>
</pre>
Have a look at the various validation attributes that have been used for the different fields in the html page. When you click the **Submit** button you will see the browser alert.

The validation message is generic and not user friendly.  Also there are no helpers to aid the users on the requested formats. We will now leverage javascript and Constraint validation API to achieve this.

##Using JavaScript  and CSS to show custom validation errors in real time
To add the additional features you should first disable the browser's in-built validation. You can do so by adding the `novalidate` attribute to the form.
<pre class="prettyprint">
&lt;form action=&quot;/HomePage.html&quot; autocomplete=&quot;on&quot; method=&quot;post&quot; aria-label=&quot;Create an account&quot; novalidate /&gt;
&lt;/form/&gt;
</pre>

Now navigate to the `script.js` file in the codelab and review the code there.
- Get the state of all the input elements using the following code:
<pre class="prettyprint">
let formInputs = document.querySelectorAll('input');
let form = document.querySelector('form');
</pre>
These statements provide information about the form fields such as validity, typemismatch, patternmismatch, valuemissing, etc.
- Add Event listeners to validate the field when the user leaves a field.
The following events/properties are important when validating a form
`blur, focusin` - To show the error message when a user moves the focus out of an input
<pre class="prettyprint">
formInputs.forEach(input => {
input.addEventListener('blur', e => {
e.srcElement.classList.add('dirty');
// add activelabel class to adjust label position unless no value set
if (e.srcElement.value == "")
e.srcElement.parentNode.classList.remove('activelabel');
else
e.srcElement.parentNode.classList.add('activelabel');
// check if input is valid
if (e.srcElement.checkValidity()) {
e.srcElement.parentNode.classList.remove('error');
}
else
inputInvalidEvent(e);
});
});
</pre>

- Check if a field is valid using **Invalid** - If an event is invalid, show the error message in the **data-error** attribute in real time to aid the user to provide valid input
<pre class="prettyprint">
formInputs.forEach(input => {
input.addEventListener('invalid', e => {
inputInvalidEvent(e);
});
});
InputInvalidEvent - This method displays the error message for an invalid input
function inputInvalidEvent(e) {
let srcElm = e.srcElement;
let validationMessage;
if (!srcElm.parentNode.hasAttribute('data-error')) {
// log('here2');
srcElm.parentNode.setAttribute('data-error', srcElm.validationMessage);
validationMessage = srcElm.validationMessage;
} else {
validationMessage = e.srcElement.parentNode.getAttribute('data-error');
}
srcElm.parentNode.classList.add('error');
}
Submit - Since we have removed the browser’s built in validation we will need to add validation for all inputs when the submit button is clicked
form.addEventListener("submit", function(evt) {
if (form.checkValidity() === false) {
evt.preventDefault();
return false;
} else {
form.querySelectorAll('input').forEach(input => {
input.setAttribute("disabled", "true");
});
return false;
}
});
</pre>

**Style.css**
The CSS plays an important role in indicating to the users that an error has occurred on a particular input. For this codelab, the css file contains several classes that indicate when an error has occurred. Have a look at the various styles to show/hide the error messages.








