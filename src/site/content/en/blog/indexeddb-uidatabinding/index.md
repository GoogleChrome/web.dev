---
layout: post
title: Databinding UI elements with IndexedDB
authors:
  - raymondcamden
date: 2012-07-08
tags:
  - blog
---

## Introduction

{% Aside %}
At the time of publication, Chrome was not yet fully to spec in terms of IndexedDB support. The code in this article will work fine in the latest version of Firefox, but may not work in your version of Chrome. For details on why, please see the first section on my blog entry [here](http://www.raymondcamden.com/index.cfm/2012/6/12/Issues-with-IndexedDB-and-Chrome) that discusses "start up" issues in Chrome.
{% endAside %}

IndexedDB is a powerful way to store data on the client side. If you haven't looked at it yet, I'd encourage you to read the helpful [MDN tutorials](https://developer.mozilla.org/en/IndexedDB) on the topic. This article assumes some basic knowledge of the APIs and the features. Even if you haven't seen IndexedDB before though, hopefully the demo in this article will give you an idea of what can be done with it.

Our demo is a simple proof of concept Intranet application for a company. The application will allow employees to search for other employees. In order to provide a quicker, snappier experience, the employee database is copied to the client's machine and stored using IndexedDB. The demo simply provides an autocomplete-style search and display of a single employee record, but what's nice is that once this data is available on the client, we can use it in multiple other ways as well. Here is a basic outline of what our application needs to do.

1. We have to set up, and initialize, an instance of an IndexedDB. For the most part this is straightforward, but making it work in both Chrome and Firefox proves to be a bit tricky.
1. We need to see if we have any data, and if not, download it. Now typically this would be done via AJAX calls. For our demo we've created a simple utility class to quickly generate fake data. The application will need to recognize when it is creating this data and prevent the user from using the data until then. This is a one-time operation. The next time the user runs the application, it won't need to go through this process. A more advanced demo would handle sync operations between the client and the server, but this demo is focused more on the UI aspects.
1. When the application is ready, we can then use jQuery UI's Autocomplete control to sync up with the IndexedDB. While the Autocomplete control allows for basic lists and arrays of data, it has an API to allow for any data source. We'll demonstrate how we can use this to connect to our IndexedDB data.

## Getting Started

We've got multiple parts to this demo, so to start things off simply, let's look at the HTML portion.

```html
<form>
  <p>
    <label for="name">Name:</label> <input id="name" disabled> <span id="status"></span>
    </p>
</form>

<div id="displayEmployee"></div>
```

Not a lot, right? There are three main aspects to this UI that we care about. First is the field, "name" that will be used for autocomplete. It loads disabled and will be enabled later via JavaScript. The span next to it is used during the initial seed to provide updates to the user. Finally, the div with the id displayEmployee will be used when you select an employee from the autosuggest.

Now let's take a look at the JavaScript. There's a lot to digest here so we'll take it step by step. The full code will be available at the end so you can see it in it's entirety.

First off - there are some prefix issues we have to worry about among the browsers that support IndexedDB. Here's some code from the Mozilla documentation modified to provide simple aliases for the core IndexedDB components our application needs.

```js
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
```

Next, a few global variables we'll be using throughout the demo:

```js
var db;
var template;
```

Now we'll begin with the jQuery document ready block:

```js
$(document).ready(function() {
  console.log("Startup...");
  ...
});
```

Our demo makes use of [Handlebars.js](http://handlebarsjs.com/) to display the employee details. That isn't used till later, but we can go ahead and compile our template now and get it out of the way. We've got a script block set up as a Handlebars-recognized type. It isn't terribly fancy, but does make it easier to display the dynamic HTML.

```handlebars
<h2>{{lastname}}, {{firstname}}</h2>
Department: {{department}}<br/>
Email: <a href='mailto:{{email}}'>{{email}}</a>
```

This is then compiled back in our JavaScript like so:

```js
//Create our template
var source = $("#employeeTemplate").html();
template = Handlebars.compile(source);
```

Now let's start working with our IndexedDB. First - we open it.

```js
var openRequest = indexedDB.open("employees", 1);
```

Opening a connection to the IndexedDB gives us access to read and write data, but before we do so, we have to ensure we have an objectStore. An objectStore is like a database table. One IndexedDB may have many objectStores, each one holds a collection of related objects. Our demo is simple and only needs one objectStore we call “employee”. When the indexedDB is opened for the very first time, or when you change the version in the code, an event onupgradeneeded is run. We can use this to setup our objectStore.

```js
// Handle setup.
openRequest.onupgradeneeded = function(e) {

  console.log("running onupgradeneeded");
  var thisDb = e.target.result;

  // Create Employee
  if(!thisDb.objectStoreNames.contains("employee")) {
    console.log("I need to make the employee objectstore");
    var objectStore = thisDb.createObjectStore("employee", {keyPath: "id", autoIncrement: true});
    objectStore.createIndex("searchkey", "searchkey", {unique: false});
  }

};

openRequest.onsuccess = function(e) {
  db = e.target.result;

  db.onerror = function(e) {
    alert("Sorry, an unforseen error was thrown.");
    console.log("***ERROR***");
    console.dir(e.target);
  };

  handleSeed();
};
```

In the `onupgradeneeded` event handler block, we check objectStoreNames, an array of object stores, to see if it contains employee. If not, we simply make it do so. The createIndex call is important. We must tell IndexedDB what methods, outside of keys, we will use to retrieve data. We'll use one called searchkey. This is explained in a bit.

The `onungradeneeded` event will run automatically the first time we run the script. After it is executed, or skipped in the future runnings, the `onsuccess` handler is run. We've got a simple (and ugly) error handler defined and then we call `handleSeed`.

So before we go on, let's quickly review what's going on here. We open up the database. We check to see if our object store exists. If it doesn't, we create it. Finally, we call a function named handleSeed. Now let's turn our attention to the data seeding portion of our demo.

## Gimme Some Data!

As mentioned in the introduction of this article, this demo is recreating an Intranet style application that needs to store a copy of all known employees. Normally this would involve creating a server-based API that could return a count of employees and provide a way for us to retrieve batches of records. You can imagine a simple service that supports a start count and returns 100 people at a time. This could run asynchronously in the background while the user is off doing other things.

For our demo, we do something simple. We see how many objects, if any, we have in our IndexedDB. If below a certain number, we will simply create fake users. Otherwise we are considered done with the seed portion and can enable the autocomplete portion of the demo. Let's look at handleSeed.

```js
function handleSeed() {
  // This is how we handle the initial data seed. Normally this would be via AJAX.

  db.transaction(["employee"], "readonly").objectStore("employee").count().onsuccess = function(e) {
    var count = e.target.result;
    if (count == 0) {
      console.log("Need to generate fake data - stand by please...");
      $("#status").text("Please stand by, loading in our initial data.");
      var done = 0;
      var employees = db.transaction(["employee"], "readwrite").objectStore("employee");
      // Generate 1k people
      for (var i = 0; i < 1000; i++) {
         var person = generateFakePerson();
         // Modify our data to add a searchable field
         person.searchkey = person.lastname.toLowerCase();
         resp = employees.add(person);
         resp.onsuccess = function(e) {
           done++;
           if (done == 1000) {
             $("#name").removeAttr("disabled");
             $("#status").text("");
             setupAutoComplete();
           } else if (done % 100 == 0) {
             $("#status").text("Approximately "+Math.floor(done/10) +"% done.");
           }
         }
      }
    } else {
      $("#name").removeAttr("disabled");
      setupAutoComplete();
    }
  };
}
```

The very first line is a little complex as we've got multiple operations chained to each other, so let's break it down:

```js
db.transaction(["employee"], "readonly");
```

This creates a new read only transaction. All data operations with IndexedDB require a transaction of some sort.

```js
objectStore("employee");
```

Get the employee object store.

```js
count()
```

Run the count API - which as you can guess - performs a count.

```js
onsuccess = function(e) {
```

And when done - execute this callback. Inside the callback we can get the result value which is the number of objects. If the count was zero, we then begin our seed process.

We use that status div mentioned previously to give the user a message that we're going to start getting data. Because of the asynchronous nature of IndexedDB, we've set up a simple variable, done, that will track additions. We loop over and insert the fake people. The source of that function is available in the download, but it returns an object that looks like this:

```json
{
  firstname: "Random Name",
  lastname: "Some Random Last Name",
  department: "One of 8 random departments",
  email: "first letter of firstname+lastname@fakecorp.com"
}
```

By itself, this is enough to define a person. But we have a special requirement in order to be able to search our data. IndexedDB doesn't provide a way to look up items in a case-insensitive manner. Therefore, we make a copy of the lastname field into a new property, searchkey. If you remember, this is the key we said should be created as an index for our data.

```js
// Modify our data to add a searchable field
person.searchkey = person.lastname.toLowerCase();
```

As this is a client-specific modification, it's done here as opposed to on the back-end server (or in our case, the imaginary back-end server).

To perform the database additions in a performant fashion, you should reuse the transaction for all the batched writes. If you create a new transaction for each write, the browser may cause a disk write for each transaction, and that's going to make your performance terrible when adding a lot of items (think "1 minute to write a 1000 objects"-terrible).

Once the seed is done, the next portion of our application is fired - setupAutoComplete.

## Creating the Autocomplete

Now for the fun part - hooking up with the jQuery UI [Autocomplete](http://jqueryui.com/demos/autocomplete/) plugin. As with most of the jQuery UI, we begin with a basic HTML element and enhance it by calling a constructor method on it. We've abstracted out the entire process into a function called setupAutoComplete. Let's look at that code now.

```js
function setupAutoComplete() {

  //Create the autocomplete
  $("#name").autocomplete({
    source: function(request, response) {

      console.log("Going to look for "+request.term);

      $("#displayEmployee").hide();

      var transaction = db.transaction(["employee"], "readonly");
      var result = [];

      transaction.oncomplete = function(event) {
        response(result);
      };

      // TODO: Handle the error and return to it jQuery UI
      var objectStore = transaction.objectStore("employee");

      // Credit: http://stackoverflow.com/a/8961462/52160
      var range = IDBKeyRange.bound(request.term.toLowerCase(), request.term.toLowerCase() + "z");
      var index = objectStore.index("searchkey");

      index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
          result.push({
            value: cursor.value.lastname + ", " + cursor.value.firstname,
            person: cursor.value
          });
          cursor.continue();
        }
      };
    },
    minLength: 2,
    select: function(event, ui) {
      $("#displayEmployee").show().html(template(ui.item.person));
    }
  });

}
```

The most complex part of this code is the creation of the source property. The jQuery UI's Autocomplete control allows you to define a source property that can be customized to meet any possible need - even our IndexedDB data. The API provides you with the request (basically what was typed into the form field) and a response callback. You are responsible for sending an array of results back to that callback.

The first thing we do is hide the displayEmployee div. This is used to display an individual employee and if one is previously loaded up, to clear it out. Now we can start searching.

We begin by creating a read-only transaction, an array called result, and a oncomplete handler that simply passes the result to the autocomplete control.

In order to find items that match our input, let's make use of a tip by StackOverflow user Fong-Wan Chau: We use an index range based on the input as a lower end boundary and the input plus the letter z as an upper range boundary. Note too we lowercase the term to match the lowercase data we entered.

Once done - we can open up a cursor (think of it like running a database query) and iterate over the results. jQuery UI's autocomplete control allows you to return any type of data you want, but requires a value key at minimum. We set the value to a nicely formatted version of the name. We also return the entire person. You'll see why in a second. First, here is a screen shot of the autocomplete in action. We're using the Vader theme for jQuery UI.

By itself, this is enough to return the results of our IndexedDB matches to the autocomplete. But we also want to support showing a detail view of the match when one is selected. We specified a select handler when creating the autocomplete that makes use of the Handlebars template from earlier.
