---
title:  Internationalization and localization
description: >
  Be prepared for international data formats, and learn how to plan your form for localization.
authors:
  - michaelscharnagl
date: 2021-11-03
---

If you're reading this, you're using the World Wide Web.
Your forms may be used by people speaking different languages,
people from different countries, and people with different cultural backgrounds.
Learn how to prepare your form for internationalization and localization.

## Ensure your form works in different languages

Let's see how you can make sure your form works with different languages.

The first step to make your site localization-ready is to define the language attribute `lang` on the `<html>` element.
This attribute enables screen readers to invoke the correct pronunciation,
and helps browsers offer a translation of the page if the defined language is not the default browser language.

```html
<html lang="en-us">
```

Learn more about the [`lang`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang) attribute.

Say you translated a form to German.
How can you make sure search engines and browsers know about the translated version?
You can add `<link>` elements in your site's  `<head>` describing the alternate versions.

```html
<link rel="alternate" title="The form element" 
  href="https://example.com/en/form" hreflang="en">
<link rel="alternate" title="Das Formularelement" 
  href="https://example.com/de/form" hreflang="de">
```

## Help users who speak another language to use your form

You can't translate your form into every language,
but you can ensure translation tools can translate it for you.

{% Aside %}
Try it out! Enter the URL of your form in
[Google Translate](https://translate.google.com),
choose a language, and translate it.
All visible content of your site will be translated.
This is a good test to see if every text is translatable.
{% endAside %}

To ensure translation tools translate all the text on your form,
make sure all text is defined in HTML and is visible.
Some tools also work with content defined in JavaScript, but to improve compatibility,
try to include as much text as possible in HTML.

{% Aside %}
Avoid using the `aria-label` attribute to describe elements.
Many translation tools aren't able to translate the `aria-label` attribute.

Learn more why `aria-label` [doesn't translate](https://adrianroselli.com/2019/11/aria-label-does-not-translate.html).
{% endAside %}

## Ensure your form works with different writing systems

Different languages use different writing systems and character sets.
Some scripts are written from left to right, and some from right to left.

### Make spacing independent of writing systems

To ensure your form works for different writing systems,
you can use [CSS logical properties](https://developer.mozilla.org/docs/Web/CSS/CSS_Logical_Properties).

{% Codepen {
  user: 'web-dot-dev',
  id: '043b19ee429ea0834022967e2207d6b9',
  height: 300
} %}

The input has a border thickness of `1px` on all sides,
except on the left side, where the border is `4px` thick.
Now, edit the [CodePen](https://codepen.io/web-dot-dev/pen/043b19ee429ea0834022967e2207d6b9) and change the writing system to right to left
by adding `dir="rtl"` to the `<main>` element

{% Aside %}
The `dir` attribute indicates the direction of an element's text.
If the complete site uses the same writing system,
define the `dir` attribute on the `<html>` element.
In CodePen you don't have access to the `<html>` element,
which is why you need to add it to `<main>`.

You can also use the CSS `direction` property to achieve the same result.
{% endAside %}

The thick border is now on the right side.
That's because we defined the border using a logical property.

```css
input {
  border-inline-start-width: 4px;
}
```

Learn more about [logical properties](/learn/css/logical-properties/).

## Ensure your form can handle different name formats

Say you have a form where the user should fill in their name.
How would you add the field to your form?

You could add one field for the first name and one for the surname. However, names are different 
around the world: for example, some people don't have a surname—so how should they fill in the 
surname field?

To make it quick and easy to enter names—and to ensure everybody can enter their name, whatever the 
format—use a single form field for names wherever possible.

Learn more about [personal names](https://www.w3.org/International/questions/qa-personal-names).

If you have a name with [non-Latin characters](/payment-and-address-form-best-practices/#unicode-matching),
you may have encountered the issue that your name is reported as `invalid` in some forms. When you 
build forms, make sure to allow all possible characters—and do not assume that a name only consists 
of Latin characters.

## Allow a variety of address formats

The headquarters of Google is at 1600 Amphitheatre Parkway, Mountain View, CA 94043, United States.

This address includes the street number, street, city, state, postal code, and country.
In your country, the address format may be totally different.
How can you ensure everybody can enter their address in your form?

One way is to use generic inputs. 

{% Codepen {
  user: 'web-dot-dev',
  id: '4d4096f67fe84bc2a8c7640974a0fb21',
  height: 700
} %}

Learn more about other ways to work with
[international address fields](https://www.uxmatters.com/mt/archives/2008/06/international-address-fields-in-web-forms.php).

{% Assessment 'internationalization' %}

## Resources

- [W3C Internationalization articles and tutorials](https://www.w3.org/International/articlelist)
- [Frank's Compulsive Guide to Postal Addresses](http://www.columbia.edu/~fdc/postal/) provides useful links and extensive guidance for address formats in over 200 countries.
- [DataHub.io](https://datahub.io/core/country-list) is a tool for downloading country codes and names.
