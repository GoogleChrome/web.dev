---
layout: pattern
title: How to access contacts from the address book
date: 2022-10-10
authors:
  - thomassteiner
description: >
  Learn how to get contacts from the address book.
height: 800
---

Sometimes you want to let users of your app select one of their contacts to message via an email or
chat application, or help them discover which of their contacts have already joined a social
platform.

## The modern way

### Using the Contact Picker API

To get contacts from the address book, you need to use the
[Contact Picker API](https://developer.mozilla.org/docs/Web/API/Contact_Picker_API), which allows
users to select entries from their contact list and share limited details of the selected entries
with your app. Several properties like `name`, `email`, `tel`, `address`, and `icon` are available.
To find out about the concretely supported properties, call `navigator.contacts.getProperties()`. To
allow the user to select multiple contacts, pass `{multiple: true}` as the second parameter of
`navigator.contacts.select()`.

{% BrowserCompat 'api.ContactsManager' %}

The Contact Picker API is available in the Android version of Chrome from version 80.

## The classic way

### Using a regular form

The fallback method is to use a regular form that lets the user enter the contact's details.

{% BrowserCompat 'html.elements.form' %}

## Progressive enhancement

If the Contact Picker API is supported, hide the static form fields and show a picker button
instead.

```js
const button = document.querySelector('button');
const name = document.querySelector('.name');
const address = document.querySelector('.address');
const email = document.querySelector('.email');
const tel = document.querySelector('.tel');
const pre = document.querySelector('pre');
const autofills = document.querySelectorAll('.autofill');

if ('contacts' in navigator) {
  button.hidden = false;
  for (const autofill of autofills) {
    autofill.parentElement.style.display = 'none';
  }
  address.parentElement.style.display = 'block';
  button.addEventListener('click', async () => {
    const props = ['name', 'email', 'tel', 'address'];
    const opts = { multiple: false };
    try {
      const [contact] = await navigator.contacts.select(props, opts);
      name.value = contact.name;
      address.value = contact.address;
      tel.value = contact.tel;
      email.value = contact.email;
    } catch (err) {
      pre.textContent = `${err.name}: ${err.message}`;
    }
  });
}
```

## Further reading

- [Contact Picker API](https://developer.mozilla.org/docs/Web/API/Contact_Picker_API)
- [A contact picker for the web](/contact-picker/)

## Demo
