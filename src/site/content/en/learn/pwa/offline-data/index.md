---
title: Offline data
description: >
  To build a solid offline experience you need to implement storage management. Tools like IndexedDB, Cache, Storage Manager, Persistent Storage, and Content Indexing can help.
authors:
  - firt
date: 2022-01-10
---

To build a solid offline experience, your PWA needs some kind of storage management. In the [caching chapter](/learn/pwa/caching) you learned that cache storage is one option to save data on a device. In this chapter, we'll expand on how you can manage offline data, including data persistence, limits, and the available tools.

## Storage 
Storage is not just about files and assets, but can include other types of data. On all browsers that support PWA, the following APIs are available for on device storage:

- IndexedDB: A NoSQL object storage for structured data and blobs (binary data).
- WebStorage: A way to store key/value string pairs, using Local Storage or Session Storage. It's not available within a service worker context. This API is synchronous so it's not recommended for complex data storage.
- Cache Storage: As covered in the [Caching module](/learn/pwa/caching).

{% Aside %}
On supported platforms, you can also use the [FileSystem Access API](/file-system-access/) to read and write to and from the user's local filesystem, with permission. Since you are writing files directly to the filesystem the browser won't assign the data to your origin's quota, and any other application can interact with those files, if the user allows it.
{% endAside %}

You can manage all the on-device storage with the [Storage Manager API](https://developer.mozilla.org/docs/Web/API/StorageManager) on supported platforms.
The Cache Storage API and IndexedDB provide asynchronous access to persistent storage for PWAs and can be accessed from the main thread,web workers, and service workers. Both play essential roles in making PWAs work reliably when the network is flaky or non-existent. But when should you use each one?

The *Cache Storage API* should be used for network resources, things you'd access by requesting them via a URL, like your HTML, CSS, and JavaScript. It's the storage that your PWA can use for images, videos, and audio.

*IndexedDB* should be used to store structured data. This includes data that needs to be searchable or combinable in a NoSQL-like manner, or other data such as user-specific data that doesn't necessarily match a URL request. However, it's important to note that IndexedDB isn't designed for full-text search.

{% Aside 'caution' %}
All storage, no matter how you use it, is tied not just to the PWA it is used for, but to the PWA's origin, too. Therefore, if you deploy more than one PWA to an origin (which is not recommended), keep in mind IndexedDB databases, cache storage, and the other browser storage will share quotas across all service workers and PWAs.
{% endAside %}

## IndexedDB
To start using IndexedDB, you first open a database. This will create a new database if one does not exist.
IndexedDB is an asynchronous API, but it has a callback interface instead of a Promise interface.The following example uses Jake Archibald's [idb library](https://github.com/jakearchibald/idb), which is a tiny, Promise wrapper for IndexedDB. Helper libraries are not required to use IndexedDB, but if you want to use the Promise syntax the `idb` library is an option.

The following example creates a database to hold cooking recipes.

### Creating and opening a database

To open a database:

1. Use the `openDB` function to create a new IndexedDB database called `recipes`. Because IndexedDB databases are versioned,  you need to increase the version whenever you make changes to a database. The second parameter is the database version, in the example is set to 1.
1. An initialization object containing an `upgrade` function is passed to `openDB`. This function will be called when the database is installed for the first time or when it upgrades to a newer version. This function is the only place where actions can happen. Actions might include creating new Object Stores (the structures IndexedDB uses to organize data), or indexes (that you'd like to search on). This is also where data migration should happen. Typically, the `upgrade` function contains a `switch` statement, without breaks, to allow each step to happen in order based on what the old version of the database is.

```js
import { openDB } from 'idb';

async function createDB() {
  // Using https://github.com/jakearchibald/idb
  const db = await openDB('recipes', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.  
    switch(oldVersion) {
     case 0:
       // Placeholder to execute when database is created (oldVersion is 0)
     case 1:
       // Create a store of objects
       const store = db.createObjectStore('desserts', {
         // The `id` property of the object will be the key, and be incremented automatically
           autoincrement: true,
keyPath: 'id'
       });
       // Create an index called `name` based on the `name` property of objects in the store
       store.createIndex('name', 'name');
     }
   }
  });
}
```

The example creates an Object Store inside the `recipes` database called `desserts`, with the `id` property set as the store's index key and creates another index called `name`, based on the `name` property.

Let's take a look at the Object Store that's just been created. After adding some recipes into the Object Store and opening up DevTools on Chromium-based browsers or Safari Web Inspector, this is what you should expect to see.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/0lugXC1vJqDuRlrwF01l.png", alt="Safari and Chrome showing IndexedDB contents.", width="800", height="538" %}

### Adding data

IndexedDB works with transactions. Transactions group actions together, so they happen as a unit. They help ensure the database is always in a consistent state. They're also critical, if you have multiple copies of your app running, at preventing simultaneous writing to the same data.
To add data:

1. Start a transaction again, but this time set the mode to `readwrite`.
1. Get the object store.
1. Call `add` with the data you are saving. The method receives data with a dictionary structure (such as key/value pairs) and adds it to the object store.  The dictionary must be cloneable using [Structured Cloning](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). If you wanted to update an existing object, you'd use `put` instead.


Transactions have a `.done` promise which resolves when the transaction completes successfully, and otherwise rejects with the [transaction error](https://developer.mozilla.org/docs/Web/API/IDBTransaction/error). 

As the [IDB library documentation](https://www.npmjs.com/package/idb?activeTab=readme) explains, if you're writing to the database, `tx.done` is the signal that everything was successfully committed to the database. However, it's still beneficial to await the individual operations, as you'll see the error that caused the transaction to fail.

```js
// Using https://github.com/jakearchibald/idb
async function addData() {
  const cookies = {
      name: Chocolate chips cookies,
	cook_time_minutes: 25
  };
  const tx = await db.transaction('desserts', 'readwrite');
  const store = tx.objectStore('desserts');
  store.add(cookies);
  await tx.done;
}
```

Once you've added the cookies, the recipe will be in the database with other desserts. The ID is automatically set and incremented by indexedDB, if you run this code twice you will have two identical cookie entries.

{% Glitch 'learn-pwa-offline-data-saving' %}

### Retrieving data

Here is how you get data from IndexedDB: 

1. Start a transaction and specify the object store or stores, and optionally transaction type, to work from.
1. Use the method `objectStore` from that transaction, you have to specify again the object store name.
1. Call object store's `get` method, passing in the key you want to get. By default the store uses its key as an index.

```js
// Using https://github.com/jakearchibald/idb
async function getData() {
  const tx = await db.transaction('desserts', 'readonly')
  const store = tx.objectStore('desserts');
// Check for an existing id to get the record
  const value = await store.get([id]);
}
```

{% Glitch 'learn-pwa-offline-data-get' %}

{% Aside 'codelab' %}
[Progressive Web Apps: IndexedDB](https://developers.google.com/codelabs/pwa-training/pwa03--indexeddb#0).
{% endAside %}

## The Storage Manager 

Knowing how to manage your PWA's storage is particularly important to store and stream network responses correctly. 

Storage is shared between all storage options, including Cache Storage, IndexedDB, Web Storage, and even the service worker file and its dependencies. 
However, the amount of storage available varies from browser to browser. You're not likely to run out; sites could store megabytes and even gigabytes of data on some browsers. Chrome, for instance, allows the browser to use up to 80% of the total disk space, and an individual origin can use up to 60% of the entire disk space. For browsers that support the Storage API, you can know how much storage is still available for your app, its quota, and its use.
The following example uses the Storage API to get an estimate of quota and usage, then  calculates percentage of used, and remaining number of bytes.

```js
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> Number of bytes used.
  // quota.quota -> Maximum number of bytes available.
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`You've used ${percentageUsed}% of the available storage.`);
  const remaining = quota.quota - quota.usage;
  console.log(`You can write up to ${remaining} more bytes.`);
} 
```

{% Glitch 'learn-pwa-offline-data-storage' %}

In Chromium DevTools, you can see your site's quota and how much storage is used, broken down by what's using it, by opening the **Storage** section in the **Application** tab.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/NAXXvUU099wqtSbzvt9m.png", alt="Chrome DevTools in Application, Clear Storage section", width="800", height="567" %}

Firefox and Safari don't offer a summary screen for seeing all storage quota and usage for the current origin. 

### Data persistence

We can ask the browser for persistent storage on compatible platforms to avoid automatic data eviction after inactivity or on storage pressure. In this case, if granted, the browser will never evict the storage automatically, including service worker registration, IndexedDB databases, and files in cache storage. Users are always in charge, and they can delete the storage at any time through a setting, even if the browser has granted persistent storage.

To ask for persistent storage, call the `persist` method on the `storage` interface.

```js
async function persistData() {
  if (navigator.storage && navigator.storage.persist) {
    const result = await navigator.storage.persist();
    console.log(`Data persisted: ${result}`);
}

```

You can also check if persistent storage is already granted in the current origin using the `persisted` function of the `navigator.storage` interface. Firefox asks the user with a permission dialog if the browser should grant persistent storage. Chromium-based browsers give or deny persistence based on a [heuristic](/persistent-storage/#chrome-and-other-chromium-based-browsers) to determine the importance of the content for the user. One criteria for Google Chrome is, for example, PWA installation: if the user has installed an icon for the PWA in the operating system, the browser may grant persistent storage as one of the important metrics.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/W89sHSgKqkh9xV8nVD0C.png", alt="Mozilla Firefox asking the user for storage persistence permission.", width="800", height="279" %}

{% Aside 'caution' %}
The `navigator.storage` interface has `persist` and `persisted` methods that both return a Promise that resolves to  a boolean. The `persist` function asks for enabling persistent storage and returns the result, and `persisted` returns the current state without affecting it.
{% endAside %}

{% Aside %}
[Content Indexing API](/content-indexing-api/) is an experimental ability available in some Chromium browsers that lets your PWA expose the pieces of content that you have indexed offline. 
If you register your offline-ready content using this API, the user will see them in Downloads within the browser when there is no network connection. 
{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/b1o5a6iCgjqOVMVfcbuj.png", alt="The Content Indexing API results available in Chrome for Android.", width="800", height="1480" %}
{% endAside %}

##  Resources

- [Storage on the Web](/storage-for-the-web/)
- [FileSystem Access API](/file-system-access/)
- [Persistent Storage](/persistent-storage/)
- [MDN: Storage API](https://developer.mozilla.org/docs/Web/API/Storage_API)
- [MDN: Client-side storage](https://developer.mozilla.org/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage)
- [Content Indexing](/content-indexing-api/)
