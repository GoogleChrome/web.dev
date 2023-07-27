---
title: Payment forms
description: >
  Improve conversion rates by building better payment forms.
authors:
  - michaelscharnagl
date: 2021-11-03
---

{% Aside %}
This module is about payment forms and doesn't explain how to implement transactions on your site. 
You can add payment functionality by implementing [Web Payments](/payments/), 
or using a third-party payment platform.  
{% endAside %}

The payment form is often the last step before completing a purchase. 
To maximize conversions, ensure your payment form is user-friendly and secure.

{% Codepen {  
  user: 'web-dot-dev',  
  id: '0f0da240784a36da7fa958018af29f3f',  
  height: 500  
} %}

## Ensure users know what to fill in

Keep your payment form as simple as possible, 
showing only required fields.

{% Aside %}
You don't need to add a selector for the card type—that's worked out automatically by the payment processor from the card number. 
However, you may want to enhance your card number field by indicating the card type based on the entered number. 
You can use a [regex](https://gist.github.com/michaelkeevildown/9096cd3aac9029c4e6e05588448a8841) to test the card type, 
and show the brand logo next to the card number `<input>`.  
{% endAside %}

Indicate the payment amount. 
The **Submit** button is ideal for that.

```html  
<button>Pay $300.00</button>  
```

Use self-explanatory wordings for your `<label>` elements. 
For example, use 'Security code', 
instead of an acronym like 'CVV' that's only used by some brands.

{% Aside %}
Use a single `<input>` for each of the name and card number fields. Keep the user in typing mode, 
and don't waste their time by forcing them to jump between multiple name or card number fields.  
{% endAside %}

## Help users enter their payment details

To maximize conversions, ensure users can fill out your payment form as quickly as possible.

Use `inputmode="numeric"` for the card number and security code fields 
to show an optimized on-screen keyboard for entering numbers.

{% Aside 'caution' %}  
Use `type="number"` only for incremental fields, 
for example, the quantity of a product. 
Browsers show an up/down arrow for `type="number"` 
which makes no sense for payment card numbers.   
{% endAside %}

Add appropriate `autocomplete` values for your payment form controls to ensure browsers offer autofill. 
Use `autocomplete="cc-name"` for the name, 
`autocomplete="cc-number"` for the card number, and `autocomplete="cc-exp"` for the expiry date.

{% Aside %}
You can help users fill in the correct format for expiry date by using an 
[input mask](https://css-tricks.com/input-masking/). 
Test with real users, using only your keyboard, 
and a screen reader such as [VoiceOver](https://www.youtube.com/watch?v=5R-6WvAihms&list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g&index=6) 
on Mac or [NVDA](https://www.nvaccess.org/) on Windows to ensure the input is still accessible.  
{% endAside %}

## Ensure users enter data in the correct format

Use the `required` attribute for every `<input>` to ensure users fill out the complete form. 

Payment card security codes can be three or four digits. 
Use `minlength="3"` and `maxlength="4"` to only allow three and four digits.

Ensure users only enter numbers for the card number and security code. 
Use `pattern="[0-9 ]+"` to allow users to include spaces when entering a card number, 
since this is how the numbers are displayed on the physical cards. 

{% Aside %}
Payment card brands use different formats, 
for example, for card numbers and security codes. 
Always test your payment form with every card type you support. 
Ensure your validation rules consider every possible format.  
{% endAside %}

## Resources

-  [Payment and address forms best practices](/payment-and-address-form-best-practices).
-  [Web Payments](/payments/).
