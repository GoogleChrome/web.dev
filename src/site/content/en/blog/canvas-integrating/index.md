---
layout: post
title: Integrating Canvas into your Web App
date: 2011-08-05
updated: 2013-10-29
authors:
  - davidtong
tags:
  - blog
---

## Introduction

In this article, I am going to discuss how to use the HTML5  [canvas](https://developer.mozilla.org/docs/HTML/Canvas) element to create, edit, open and export images. I will also introduce several open-source tools that are relevant to this technology, and provide some tips on how these techniques can be applied to an existing web application. 

## Check for canvas support

The first thing to do is check that your browser fully supports HTML5 canvas. An easy way to do that is to use [Modernizr](http://www.modernizr.com) to check for a certain feature:

```js
if (Modernizr.canvas) {
  // Browser supports native HTML5 canvas.
} else {
  // Fallback to another solution, such as Flash, static image, download link, and so on.
}
```

## Creating a canvas element and importing an image as binary or data URI

First, you will need to have a canvas element in your page. 
Using JavaScript, you do the following: 

```js
var ctx = document.getElementById('new_canvas').getContext('2d');
var img = new Image();
img.src = "html5.gif"
img.onload = function () {
   ctx.drawImage(img,0,0);
}
```

In this code, the first step is to get the 2D context, which gives us access to the [API](http://dev.w3.org/html5/2dcontext/) that defines all the drawing methods and properties. Next, we create an image object and set the src property to the location of the binary image. When the image is loaded, we then use the drawImage() method to import the image into the canvas element. 
You can also use a data URI instead of the URL of an image. So instead of the URL above, you can do the following: 

```js
img.src="data:image/gif;base64,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"
```



You may ask, "Why would we use data URI instead of the binary image?" There are many [advantages](http://en.wikipedia.org/wiki/Data_URI_scheme#Advantages). And later in this article, you will see how easily we can export a canvas image as data URI. 
Here is [a tool to convert a binary image file to a data URI](http://boazsender.github.com/datauri/).

## Manipulating the canvas image

If you have ever done any sort of [Logo programming](http://en.wikipedia.org/wiki/Logo_(programming_language)), drawing on a canvas uses the same concept. 
Mark Pilgrim has a [chapter on canvas](http://diveintohtml5.info/canvas.html) in his book, Dive Into HTML5. Based on an example in the chapter, we can add a grid diagram to the image that we imported above by using the following:. 

```js
var img2 = new Image();
img2.onload = function () {
  var context2 = document.getElementById('new_canvas2').getContext('2d');
  /* vertical lines then horizontal ones */
  for (var x = 0.5; x < 800; x += 10) { context2.moveTo(x, 0); context2.lineTo(x, 500); } 
  for (var y = 0.5; y < 500; y += 10) { context2.moveTo(0, y); context2.lineTo(800, y); }
  context2.strokeStyle = "#bbb";
  context2.stroke();
  context2.drawImage(img2,0,0);
}
img2.src = "html5.gif";
```

You can be more creative than this, but I leave it to the other tutorials listed in the appendix of this article for additional instructions on that subject. 
We haven't seen anything very exciting yet, but the next section will change that.

## Exporting the canvas image as data URI

The canvas element has a `toDataURL()` method, which takes a MIME type as the parameter. With this, we can export the canvas we used above. 

```js
window.open(document.getElementById('ctx').toDataURL("image/png"));
```

This exports the canvas as a PNG image into a new browser window. The image, however, is not an ordinary binary image, but is instead a base64-encoded data URI that can be rendered by a browser. Thus, from the user's standpoint, there is no difference between that and the binary equivalent. 
Note that the line of code above needs to be run on a web server. Running `toDataURL()` on a local file would fail. See [this ticket](http://code.google.com/p/chromium/issues/detail?id=21847) for the status of this issue in Chrome. 

## Integrating into your web app
Canvas can be a very powerful add-on to any web applications that store user-uploaded images. 

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Xm0Z35ZmkZRdxNswrrAP.png", alt="Box canvas", width="460", height="155" %}
</figure>

For example, we have an online file storage application that stores user-uploaded images. We can add an edit button to open the image file in a canvas-based picture editor. 
If you don't want to write your own canvas editor, [Harmony](http://mrdoob.com/projects/harmony/) is one of the few canvas editors openly [available](https://github.com/mrdoob/harmony). It features easy addition of brushes, which can satisfy your artistic tastes. 
When you choose "edit image" in the menu illustrated above, a canvas editor should open, and it would make a call to a custom `read_file()` function in the editor's init() function as follows: 

```js
function read_file() {
   var url = file_id;
   // hide a copy of the original image if it is needed to load
   document.getElementById('editableImage').src = url; 
   image = new Image();
   image.src = url;
   image.onload = function() {
      context.drawImage(image,0,0); // context, defined above, as canvas.getContext('2d')
   }
}
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/hWOLKp6PgSNkOXkxt0XT.png", alt="Harmony", width="448", height="323" %}
</figure>

## Adding HTML5 LocalStorage

A little touchup that you should always consider--if you care about user experience--is applying LocalStorage. For example, if you have a big text area that requires the user to input a lot of information. When the user is about to submit the form, he accidentally closes the browser (or the browser crashes). The user might be frustrated and not bother rewriting the message again.
In the demo below, instead of saving the data onto the server, simply save the image onto LocalStorage as data URI:

```js
// Save Image
function saveToLocalStorage() {
    localStorage.setItem('canvas', canvas.toDataURL('image/png'));
}

// Load Image
function init() {
        // for demo purpose, all variables are declared in the parent scope
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');

        // Use Modernizr to detect whether localstorage is supported by the browser
        if (Modernizr.localstorage && localStorage.getItem('canvas'))
        {
            localStorageImage = new Image();
            localStorageImage.addEventListener("load", function (event) {
                //...
                context.drawImage(localStorageImage, 0, 0);
            }, false);
            localStorageImage.src = localStorage.getItem('canvas');
        }
//...
}
```


## Saving canvas as a binary file onto the server
You may want to save the canvas image as a binary file. There are many ways to do that. For example, you can perform a POST action to pass the data URI to your backend code. Using jQuery, it would look like this: 

```js
var url = '/api/write/' + file_id + '?data_url_to_binary=1';
var data_url = flattenCanvas.toDataURL('image/png');
var params = { contents: data_url };

$j.post(url, params, function(json){
   if (json.status == 'upload_ok')
   {
      //ok
   }
}, 'json');
```

This creates a XHR call with the content being the data URI. 
You then need to decode the base64 data URI on the server. In [PHP](http://ch2.php.net/base64_decode), for example, you can do the following: 

```js
if ($_GET['data_url_to_binary'])
{
   $contents_split = explode(',', $contents);
   $encoded = $contents_split[count($contents_split)-1];
   $decoded = "";
   for ($i=0; $i < ceil(strlen($encoded)/256); $i++) {
      $decoded = $decoded . base64_decode(substr($encoded,$i*256,256)); 
   }
   $contents = $decoded; // output
}
```

In the first two lines, the data URI ($contents) is split into two parts. `'data:image/png;base64'`, and `'VBORw0KGgoAAAANSUhEUgAAAWwAAAB+CAIAAACPlLzKAAAACXBIWXMAAC4jAAAuIwF4pT92...'` We will then use `base64_decode()` to decode the data URI string. The trick here is that there are issues decoding string greater than 5K, and this "divide-and-conquer" approach will be able to decode the string. 
Finally, using [fwrite()](http://php.net/manual/en/function.fwrite.php), you can save the binary file, $contents, onto your server. 

## Enabling "save image" in browser

Canvas is a HTML element. It looks pretty much like an image, but your browser does not provide a "Save Image As" option for it because it is not really an image element. 
To enable "Save Image As," you may dynamically create an Img element, and set the src to the data URI of the canvas element. 
You can also use the [canvas2image utility](http://www.nihilogic.dk/labs/canvas2image/).

## A more advanced canvas editor

If you are looking for a more advanced canvas editor, [PaintWeb](http://code.google.com/p/paintweb/) is probably worth a try. It was written by Mihai Sucan, a Romanian student, during the Google Summer of Code 2009. He also authored a few [tutorials](http://dev.opera.com/articles/view/html5-canvas-painting/) on writing your own online paint application. 

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/d8JqwEwFx7QMi8Bg1lZe.png", alt="Paint Web", width="771", height="706" %}
</figure>

For a more professional library, be sure to check out [Pixati](http://www.pixastic.com/lib/).

## More fun with canvas? 
Paul Irish combined Harmony and $1 Unistroke [Recognizer](http://depts.washington.edu/aimgroup/proj/dollar) to create a little [Easter Egg](http://paulirish.com/2010/my-harmonious-background-canvas/) on his website. 

You can also learn how to [inspect canvas](http://www.html5rocks.com/en/tutorials/canvas/inspection/) with the Chrome DevTools using our recent inspection features.

## Go deeper with additional tutorials on canvas

- [MDN: Canvas Tutorial](https://developer.mozilla.org/docs/Web/Guide/HTML/Canvas_tutorial?redirectlocale=en-US&redirectslug=Canvas_tutorial)
- [Dive into HTML5: Canvas](http://diveintohtml5.info/canvas.html)
- [HTML5 canvas - the basics](http://dev.opera.com/articles/view/html-5-canvas-the-basics/) on Dev.Opera covers the basic drawing primitives
- [Building a Breakout clone in canvas](http://billmill.org/static/canvastutorial/ball.html) includes basic motion, physics and interactivity