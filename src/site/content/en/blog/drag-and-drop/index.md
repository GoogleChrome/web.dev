---
title: Using the HTML5 Drag and Drop API
authors:
  - ericbidelman
  - rachelandrew
date: 2010-09-30
updated: 2020-07-29
description: >
  The HTML5 Drag and Drop (DnD) API means that we can make
  almost any element on our page draggable. In this post we’ll explain
  the basics of Drag and Drop.
tags:
  - blog
  - html
  - javascript
  - file-system
---

The HTML5 Drag and Drop (DnD) API means that we can make almost any element on our page draggable.
In this post we'll explain the basics of Drag and Drop.

## Creating draggable content

It's worth noting that in most browsers, text selections, images, and links are draggable by default.
For example, if you drag the Google logo on [Google Search](https://google.com) you will see the ghost image.
The image can then be dropped in the address bar, an `<input type="file" />` element, or even the desktop.
To make other types of content draggable you need to use the HTML5 DnD APIs.

To make an object draggable set `draggable=true` on that element.
Just about anything can be drag-enabled, images, files, links, files, or any markup on your page.

In our example we're creating an interface to rearrange some columns,
which have been laid out with CSS Grid.
The basic markup for my columns looks like this,
with each column having the `draggable` attribute set to `true`.

```html
<div class="container">
  <div draggable="true" class="box">A</div>
  <div draggable="true" class="box">B</div>
  <div draggable="true" class="box">C</div>
</div>
```

Here's the CSS for my container and box elements.
Note that the only CSS related to DnD functionality is the [`cursor: move`](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) property.
The rest of the code just controls the layout and styling of the container and box elements.

```css/11
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.box {
  border: 3px solid #666;
  background-color: #ddd;
  border-radius: .5em;
  padding: 10px;
  cursor: move;
}
```

At this point you will find that you can drag the items,
however nothing else will happen.
To add the DnD functionality we need to use the JavaScript API.

## Listening for dragging events

There are a number of different events to attach to for monitoring the entire drag and drop process.

* [`dragstart`](https://developer.mozilla.org/en-US/docs/Web/API/Document/dragstart_event)
* [`drag`](https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event)
* [`dragenter`](https://developer.mozilla.org/en-US/docs/Web/API/Document/dragenter_event)
* [`dragleave`](https://developer.mozilla.org/en-US/docs/Web/API/Document/dragleave_event)
* [`dragover`](https://developer.mozilla.org/en-US/docs/Web/API/Document/dragover_event)
* [`drop`](https://developer.mozilla.org/en-US/docs/Web/API/Document/drop_event)
* [`dragend`](https://developer.mozilla.org/en-US/docs/Web/API/Document/dragend_event)

To handle the DnD flow, you need some kind of source element (where the drag originates),
the data payload (what you're trying to drop),
and a target (an area to catch the drop).
The source element can be an image, list, link, file object, block of HTML, etc.
The target is the drop zone (or set of drop zones) that accepts the data the user is trying to drop.
Keep in mind that not all elements can be targets, for example an image can't be a target.

## Starting and ending a drag and drop sequence

Once you have `draggable="true"` attributes defined on your content,
attach a `dragstart` event handler to kick off the DnD sequence for each column.

This code will set the column's opacity to 40% when the user begins dragging it,
then return it to 100% when the dragging event ends.

```js
function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragend', handleDragEnd, false);
  });
```

The result can be seen in the Glitch demo below. Drag an item and it becomes opaque.
As the `dragstart` event's target is the source element,
setting `this.style.opacity` to 40% gives the user visual feedback that the element is the current selection being moved.
Once you drop the item,
although the drop functionality is not in place,
 the source element returns to 100% opacity.

{% Glitch {
  id: 'simple-drag-and-drop-1',
  path: 'style.css'
} %}

## Add additional visual cues with `dragenter`, `dragover`, and `dragleave`

To help the user understand how to interact with your interface,
use the `dragenter`, `dragover` and `dragleave` event handlers.
In this example the columns are drop targets in addition to being draggable.
Help the user to understand this by making the border dashed as they hold a dragged item over a column.
For example, in your CSS you might create an `over` class to represent elements that are drop targets:

```css
.box.over {
  border: 3px dotted #666;
}
```

Then, in your JavaScript set up the event handlers,
add the `over` class when the column is dragged over,
and remove it when we leave.
In the `dragend` handler we also make sure to remove the classes at the end of the drag.

```js/9-11,14-28,34-36
document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('dragend', handleDragEnd, false);
  });
});
```

{% Glitch {
  id: 'simple-drag-drop2',
  path: 'dnd.js'
} %}

There are a couple of points worth covering in this code:

* In the case of dragging something like a link,
you need to prevent the browser's default behavior,
which is to navigate to that link.
To do this, call `e.preventDefault()` in the `dragover` event.
Another good practice is to return `false` in that same handler.
* The `dragenter` event handler is used to toggle the `over` class instead of `dragover`.
If you use `dragover`,
the CSS class would be toggled many times as the event `dragover` continued to fire on a column hover.
Ultimately, that would cause the browser's renderer to do a large amount of unnecessary work.
Keeping redraws to a minimum is always a good idea.
If you need to use the `dragover` event for something,
consider [throttling or debouncing your event listener](https://css-tricks.com/debouncing-throttling-explained-examples/).

## Completing the drop

To process the actual drop,
add an event listener for the `drop` event.
In the `drop` handler,
you'll need to prevent the browser's default behavior for drops,
which is typically some sort of annoying redirect.
You can prevent the event from bubbling up the DOM by calling `e.stopPropagation()`.

```js
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  return false;
}
```

If you run the code at this point,
the item will not drop to the new location.
To achieve this you need to use the [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object.

The `dataTransfer` property is where all the DnD magic happens.
It holds the piece of data sent in a drag action.
`dataTransfer` is set in the `dragstart` event and read/handled in the drop event.
Calling `e.dataTransfer.setData(mimeType, dataPayload)` lets you set the object's MIME type and data payload.

In this example, we're going to allow users to rearrange the order of the columns.
To do that, first you need to store the source element's HTML when the drag starts:

  <figure class="w-figure">
    <video controls autoplay loop muted class="w-screenshot">
      <source src="https://storage.googleapis.com/web-dev-assets/drag-and-drop/webdev-dnd.mp4" type="video/mp4">
    </video>
  </figure>

```js/3-6
function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
```

In the `drop` event you process the column drop,
setting the source column's HTML to the HTML of the target column that you dropped on,
first checking that the user is not dropping back onto the same column they dragged from.

```js/5-8
function handleDrop(e) {
  e.stopPropagation();

    if (dragSrcEl !== this) {
      dragSrcEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
  }

```

You can see the result in the following demo.
Drag and release the A column on top of the B column and notice how they change places:

{% Glitch {
  id: 'simple-drag-drop',
  path: 'dnd.js'
} %}

## More dragging properties

The `dataTransfer` object exposes properties to provide visual feedback to the user during the drag process.
These properties can also be used to control how each drop target responds to a particular data type.

* [`dataTransfer.effectAllowed`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed) restricts what 'type of drag' the user can perform on the element.
It is used in the drag-and-drop processing model to initialize the `dropEffect` during the `dragenter` and `dragover` events.
The property can be set to the following values: `none`, `copy`, `copyLink`, `copyMove`, `link`, `linkMove`, `move`, `all`, and `uninitialized`.
* [`dataTransfer.dropEffect`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect) controls the feedback that the user is given during the `dragenter` and `dragover` events.
When the user hovers over a target element,
the browser's cursor will indicate what type of operation is going to take place (e.g. a copy, a move, etc.).
The effect can take on one of the following values:  `none`, `copy`, `link`, `move`.
* [`e.dataTransfer.setDragImage(imgElement, x, y)`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage)
means that instead of using the browser's default 'ghost image' feedback,
you can optionally set a drag icon.

## File upload with drag and drop

This simple example uses a column as both the drag source and drag target.
This might be seen in a UI where the user is asked to rearrange the items.
In some situations the drag target and source may be different,
such as an interface where the user needs to select one image to be the main image for a product by dragging the selected image onto a target.

Drag and Drop is frequently used to allow users to drag items from their desktop into an application.
The main difference is in your `drop` handler.
Instead of using `dataTransfer.getData()` to access the files,
their data will be contained in the `dataTransfer.files` property:

```js
function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();

  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    // Read the File objects in this FileList.
  }
}
```

You can find more information about this in [Custom drag-and-drop](/read-files/#select-dnd).

## More resources

* [The Drag and Drop Specification](https://html.spec.whatwg.org/multipage/dnd.html#dnd)
* [MDN HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
* [How To Make A Drag-and-Drop File Uploader With Vanilla JavaScript](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/)
* [Creating a Parking Game With the HTML Drag and Drop API](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
* [How To Use The HTML Drag-and-Drop API In React](https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/)
