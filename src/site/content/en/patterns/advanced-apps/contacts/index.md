---
layout: pattern
title: How to access contacts from the address book
date: 2022-08-03
authors:
  - thomassteiner
description: >
  Learn how to get contacts from the address book.
height: 800
---

```js
if ('contacts' in navigator) {
  button.addEventListener('click', async () => {
    const props = ['name', 'email', 'tel', 'address'];
    const opts = {multiple: false};
    try {
      const [contact] = await navigator.contacts.select(props, opts);
      // Do something with the contact.
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
}
```

{% BrowserCompat 'api.ContactsManager' %}

## Demo
