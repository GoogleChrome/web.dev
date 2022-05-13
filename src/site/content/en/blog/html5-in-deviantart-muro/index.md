---
layout: post
title: Case Study - HTML5 in deviantART muro
authors:
  - michaeldewey
date: 2010-09-28
tags:
  - blog
  - case-study
---

## Introduction
 
On August 7, 2010, deviantART celebrated its 10th birthday.
We celebrated our birthday by launching an HTML5 drawing tool called deviantART muro.
The tool can be used as a stand-alone web application as well as a lightweight drawing
tool for adding pictures to forum comments.

The deviantART community greeted this new drawing tool with great enthusiasm,
and the tool itself now sees as much traffic as some decent-sized web properties.
Since its launch, a new drawing is submitted using deviantART muro about once every 5 seconds.
These are just the numbers of drawings that are completed; many more had been started and not saved.

The following article gives some background on how we are using HTML5,
why we chose to use the technologies that we did, and things I discovered while writing
one of the first full-blown HTML5 applications for a major website.

## My Background

In late 2005, I was one of the developers responsible for the drawing tool used by
[Draw Here](http://drawhere.com/).  The tool was a 'web graffiti' tool launched by a bookmarklet.
It was used to draw pictures on any webpages.  Draw Here was initially created using
[SVG](http://www.w3.org/Graphics/SVG/) (Firefox 1.5 beta had just come out; it was one of the first browsers to support SVG).

On Internet Explorer, we were creating SVG in the background, but were rendering the drawing
using [VML](http://www.w3.org/TR/NOTE-VML).
WebKit did not support SVG at the time, so I ported our code to render the SVG using canvas
(which was a new technology seen only in WebKit at the time). At one point, I even made a port
so that our SVG code could be rendered on older browsers using a bunch of div elements pasted together.
(This, of course, was more of a joke to show it could be done and was painfully slow to use).

In its heyday, Draw Here was being used to make about 100 drawings per day.
It was complete enough to be called more than just an experiment, although it did not have
the final polish of a major web application. In mid-2006, the project was abandoned,
though the site is still limping along today - mostly just for grins.

## Technologies Used by deviantART muro

Because of my background using various HTML5 technologies in their early days,
I was asked to be the lead developer on deviantART muro. Anybody who is reading this article
can probably understand why we decided to go with HTML5, rather than a plug-in based technology
like Silverlight or Flash.  We wanted something that was robust and also something that used open standards.

### Deciding Between Canvas and SVG

We decided to do the drawing layer using canvas. Some people may wonder when they should use
canvas and when they should use SVG.  There is a lot of overlap in what can be done with the two
technologies - as Draw Here proved, both technologies can be used to create a drawing application.

I have found that SVG is great if you want to keep handles to objects you had drawn.
For example, if you want the user to be able to draw a line, and then be able to drag bits of
the line to change its shape, that would be fairly trivial using SVG. But the same thing is very awkward using canvas.

When you use canvas, you fire stuff onto the canvas, and then you forget about it.
A blank canvas and one that had been drawn on for an hour act exactly like the same in code,
and they have about the same memory footprint. While a raster drawing program usually works really well
with the fire and forgets technology, it does make certain things hard. For example, creating a fast undo
function is much harder in canvas than in SVG. In SVG, you can just keep a handle to the last several
lines that you placed, and undoing is just a matter of plucking those objects off.
With canvas, once a line has been painted, you don't know what was underneath it,
so removing the line requires redrawing the area that it was in.

Once we bit the bullet and decided that this was going to use HTML5 for canvas,
we decided to make use of little bits of other HTML5 goodies here and there.
An example of this is how we used localStorage to keep track of user's brush settings.
This way, once they have their various brushes set up just the way they like them,
they can come back to those settings the next time they use our tool.
localStorage means that we don't have to use up our cookie or make any server trips in order to get those preferences. 

### Using Canvas

Canvas has come a long way in the past five years. With Draw Here, we actually did not publish my canvas port,
because the performance was not good. Now, I think, it is safe to say that it probably performs better than you imagine.
Clearing a large section of canvas and redrawing complicated shapes can usually happen at speeds faster than human perception.
The only thing that I found to be occasionally too slow is using getImageData() to sample pixels.
The speed of the operation obviously depends on canvas size, but, on a large canvas,
doing a getImageData() at the wrong time can take long enough for a user to feel like the application is slow to respond.

After reading various canvas tutorials, I originally had the impression that it was a heavyweight thing
that should be used sparingly, maybe once or twice on a page. I don't know if everybody gets this sense, but I did,
so I was using it sparingly when we first started coding deviantART muro. After a while though,
I found that there are lots of little places where a canvas can save you a lot of effort.
For example, the mock-ups for our app specified that there should be a color picker that was
two overlapping triangles showing primary and secondary colors:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/x5MFLCTcD1P3j5Ra0S3w.png", alt="Color picker", width="93", height="92" %}
<figcaption>Color picker</figcaption>
</figure>

My first instinct was to start thinking of a way to create this little UI gizmo with traditional HTML and CSS.
People who are great at hacking CSS might point out how all this could be done over CSS,
but the triangle shape of the two parts that change color makes it not so obvious.

When it occurred to me to just use a canvas, I made the widget with a single DOM element and a couple lines of JavaScript.
deviantART muro uses canvas nodes all over the place. Each layer is a canvas, and changing layer ordering is
just a matter of switching z-index. The zoom 'navigator' palette that shows a reduced view of the drawing area
is just another canvas that occasionally calls drawImage() using the layer canvases as source images.
Even the drawing area cursor (a two-toned circle that adjusts size depending on brush size and zoom)
is a canvas that floats underneath the mouse.

The reason that we were more liberal with canvas than other HTML5 technologies is that
Google's [ExplorerCanvas](http://code.google.com/p/explorercanvas) library makes it
possible to simulate canvas in Internet Explorer. That leads me to my next section.

## Internet Explorer (IE)

The major reason that more major websites are not using HTML5 yet is that
they don't want to lose their Internet Explorer users. I am sure that the first question in most
developer's minds when they hear that deviantART made an HTML5 drawing application is,
'What was done about IE?' 

We decided at the beginning that we would make a best effort when it came to
making things work in Internet Explorer, but that we were through doing the least
common denominator style of web development.  Because the web community has taken the approach
that a site can't launch until it looks the same on every known browser, users cannot
tell when their browser is lacking. To the average user, speed issues are blamed on
their internet connection and every page renders more or less the same.
So they decide on their favorite browser based on arbitrary little user interface things,
like the color of their back button.

We decided that we would create any cool feature that came to mind using the HTML5 spec,
try to make it work in Internet Explorer, and if it could not work, we would just pop up
a modal explaining that the feature was not available because their browser did not yet implement a web standard.

We initially tried to make things work with Google's
[ExplorerCanvas](http://code.google.com/p/explorercanvas/) (exCanvas).
It is surprisingly good at mimicking canvas for most things. It does have one downside, though.
Every stroke made on the canvas is a DOM object in the underlying VML translation.
For most things that you might attempt with canvas, this is fine, but some of deviantART muro's brushes
create shapes from layering lots of strokes together. When Internet Explorer is faced with VML that has
thousands of nodes in it - even on a fast machine - it falls over and dies.
Because of this, for a lot of the drawing calls, we actually had to go in and code in actual VML,
and use tricks where we concatenated the nodes together and use the move command to specify where there should be gaps.
A lot of the little controls and whatnots in the interface use a canvas tag,
as those small little uses generally worked fine with exCanvas.

In addition to making some things work with exCanvas, we suggested to users that
they could continue using their version of Internet Explorer if they installed the
[Google Chrome Frame plug-in](http://code.google.com/chrome/chromeframe/).
Google Chrome Frame is a plug-in that embeds Google Chrome's rendering engine in Internet Explorer.
From the user's perspective, they are still using the browser that they are familiar with;
but, underneath the covers, our page gets rendered with Chrome's HTML5 capabilities and faster JavaScript.

I knew that it was supposed to be easy to port things to work with Chrome Frame,
but I didn't realize just how simple. You just put in an extra meta tag and… and that's it,
things start working in IE. 

## Summary

It is such a joy to work with the new technologies in the HTML5 specification,
and I would say that everything that I used is definitely ready for prime time.
Even if you need things to work flawlessly on IE, there is a surprising amount of stuff
you can do combining canvas and exCanvas. And writing a translation layer between SVG and VML
is surprisingly doable as well. Once you start using the technology, it is like stepping into a whole new world.

## References

- [deviantART muro](http://muro.deviantart.com)
- [deviantART's forum](http://forum.deviantart.com/devart/drawplz/) where you can draw (requires login) 
- [ExplorerCanvas](http://excanvas.sourceforge.net/)
- [Google Chrome Frame](http://code.google.com/chrome/chromeframe/)
