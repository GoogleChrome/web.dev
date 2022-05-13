---
layout: post
title: Case Study - HTML5 MathBoard
authors:
  - jeremychone
date: 2011-10-28
tags:
  - blog
  - case-study
---

## Introduction

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/TmDqcNJ9pDwoXKNl55jV.png", alt="MathBoard application", width="126", height="175" %}
</figure>

[MathBoard on iPad](http://itunes.apple.com/us/app/mathboard/id373909837?mt=8),
a [PalaSoftware](http://www.palasoftware.com/MathBoard.html) application,
is a highly polished application with many subtle but
natural animations and a unique realistic look and feel. The goal was to do the
highest fidelity port of the iPad application to HTML5.

N2N-Apps is a Software Development company focusing on building next generation
of Web and Mobile application with HTML5 technology. The company was funded in
2010 by Jeremy Chone whom, after 11 years of engineering and management
experience from Netscape, Oracle, and Adobe, decided to share its expertise with
businesses to build high-quality Web and Mobile applications. N2N-Apps focuses
on quality and speed of delivery.

[Download MathBoard for the Chrome Web Store](https://chrome.google.com/webstore/detail/elcilkmmbpmchojdmdohhoalmfmkcklk)
[Download MathBoard for the Chrome Web Store](https://chrome.google.com/webstore/detail/ocjpbdojdmdmnoijibadlmpiamcmmmcj) (free version)

## Requirements

The key requirements for this HTML5 porting project were the following:

1. High fidelity port of the original iPad application look and feel and user interface.
1. Adapt to the target form factor (i.e. PC/Mac with keyboard/mouse vs touch screen).
1. Implement 100% of the applicable features.
1. Target principally HTML5 browsers.
1. Make the application "server-less" so that the application runs entirely on the client and could be hosted on a static server or Google Chrome packaged application.
1. Make a 1.0 version with all the features but the problem solver in less than a month.

## Architecture

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/ioBgfDSe8lwlCBr71gqw.png", alt="Architecture", width="161", height="206" %}
</figure>

Given the requirements, we decided to go with the following architecture:


1. HTML5: Since we do not have any HTML4 support requirements, we decided to go with HTML5 as the base.
1. jQuery: While HTML5 has many of the advanced selectors that make jQuery so
  great, we decided to stick with jQuery anyway as it gave us a very robust and
  mature way to manipulate the DOM and related events. jQuery also has the
  benefit of being more DOM centric, which tends to make the
  design and implementation of an application closer to HTML.
1. [SnowUI](https://github.com/jeremychone/snowUI): jQuery provides
  a great API and best practice to work with the DOM,
  however, for the HTML5 MathBoard application we needed an MVC or MVP style
  framework to orchestrate all of the different views. SnowUI
  is a simple yet powerful MVC framework on top of jQuery. It provides a DOM
  centric MVC mechanism and a flexible way to build custom components while
  leaving the opportunity for the application developer to use any widget/controls
  library or custom code he or she deems optimal.

## iPad to PC considerations

When porting the application to HTML5 for PC usage, we had to make several
modifications to the design and user-interaction of the application.

### Screen orientation

The iPad MathBoard is exclusively vertically oriented, which was not optimal
for PC displays as they are generally used in a horizontal fashion. Consequently,
we reorganized the UI design and moved the settings panel to the right side, on a
sliding view (animated by CSS3 transitions).

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/PQW1aE8WZqc3gibulDCM.png", alt="Screen Orientation", width="500", height="276" %}
    <figcaption>iPad vs. HTML5 screen orientation</figcaption>
</figure>

### Input: keyboard/mouse vs. touch

Another key difference between the iPad and Web version is the
input interface. On the iPad you have only the touch interface, on the PC
you need take into consideration both mouse and keyboard.

The MathBoard input controls on the iPad are highly polished. We wanted the
same high fidelity representation in the Web interface. The solution
was adding support for keyboard shortcuts and replicating UI controls
using CSS positioning. The port to HTML5 was pixel perfect:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/egAf6O9gsAUf3HVvq1KB.png", alt="UI Controls", width="500", height="275" %}
  <figcaption>iPad vs. HTML5 Version Settings</figcaption>
</figure>

As in the iPad interface, we allow the user to click on the left and right
arrow to change the value of a control. The vertical line can also be dragged to
quickly change values. A repeat behavior was implemented for `click`
and `keydown` so that users can accelerate the value change when the
mouse or the keyboard is pressed.

TAB support was added to move from one input field to another and the
← and → arrows cycles through values.

One feature in the iPad version that didn't make much sense for the PC
interface was the drawing board. While it could have been fancy to implement it,
drawing numbers with a mouse is not very practical. Instead, we decided to spend more
time polishing the keyboard interface than implementing the drawing board.

## HTML5 features

In the Web version of MathBoard, we use many HTML5 features:

### Local storage

MathBoard allow users to save their quiz to later replay them. HTML5 MathBoard
implements this feature using HTML5 `localStorage` using the
SnowUI DAO interface.

`localStorage` was a natural choice since the data was simple
enough and did not require advanced indexing. We store all quizzes
in one JSON format that we `JSON.stringify` as text.

The snowUI DAO is a simple CRUD interface wrapper which allows the UI to
fetch data without having to worry about how it's actually stored. The DAO
implementation takes care of the storage particulars.

In MathBoard, the storage requirements were very simple. We needed to
store only the user settings and the quiz data. Both where stored as JSON
strings in `localStorage`.

So, for example, the DAO for the setting value looked like this:

```js
snow.dm.registerDao('settingValue', (function() {

  var _settingValues = null;

  function SettingValueDao() {};

  // ------ DAO CRUD Interface ------ //
  // get
  SettingValueDao.prototype.get = function(objectType, id) {
    return $.extend({},getSettingValues()[id]);
  };

  // find, remove

  // save
  SettingValueDao.prototype.save = function(objectType, data) {
    var storeValue = getSettingValues('settingValue')[data.id];
    if (!storeValue) {
      storeValue = {};
      getSettingValues()[data.id] = storeValue;
    }

    $.extend(storeValue, data);
    saveSettingValues();
  };
  // ------ /DAO CRUD Interface ------ //

  function getSettingValues() {
    if (_settingValues == null) {
      var settingValuesString = localStorage.getItem('settingValues');
      if (settingValuesString) {
        _settingValues = JSON.parse(settingValuesString);
      } else{
        _settingValues = {};
      }
    }

    return _settingValues;
  }

  function saveSettingValues(){
    var settingValues = getSettingValues();
    if (settingValues != null) {
      localStorage.removeItem('settingValues');
      localStorage.setItem('settingValues', JSON.stringify(settingValues)); 
    }
  }

  return new SettingValueDao();
})());
```

Once this DAO is registered for the `settingValue`, the UI can
make the following call without needing to worry about the store logic:

```js
var addition = snow.dm.get('settingValue', 'operator_addition');
addition.value = true; // to check the addition checkbox
snow.dm.save('settingValue', addition);
```

### CSS3 fonts
 
MathBoard uses custom fonts. Thanks to CSS3 font support, it was trivial
to include the 'Chalkduster' true type font into our application:

```css
@font-face {
  font-family: Chalkduster;
  src: url(Chalkduster.ttf);
}
```

And, since this font was the default for almost all the text in the
application, we made it the default for body.

```css
body {
  background: #333333;
  font-family: Chalkduster;
  color: #ffffff;
}
```

### CSS3 gradient, shadow, rounded corners

All gradient, shadow, transparency, and rounded corners are done with CSS3.
This was a real game saver compared to the traditional .png way of doing user interfaces.

We also used advanced CSS3 properties to customize the look and feel of the
scrollbar to make it more subtle (see
[http://webkit.org/blog/363/styling-scrollbars/](http://webkit.org/blog/363/styling-scrollbars/)
for styling scroll bars on WebKit browsers).

### CSS3 transitions

For HTML5 MathBoard, we replicated all of the iPad's animations
and even added a new one for the sliding right panel. Thanks to CSS3 transitions,
adding animations was trivial and allowed for the best performance.

We had three main animations in the applications.

#### 1.) The sliding right pane

The first animation is on the right pane (`#rightPane`), which slides
closed when the user starts a new quiz and slides open when the user ends a quiz.
To create this effect, we used the following CSS transition and triggered it
via JavaScript. The default style of the rightPane is open:

```css
#rightPane {
  /* look and feel, and layout property */
  position: absolute;
  width: 370px;
  height: 598px;
  top: 28px;
  left: 720px; /* open */
  -webkit-transition: all .6s ease-in-out;
}
```

When the user starts a quiz, our JavaScript logic moves the panel:

```js
var $rightPane = $('#rightPane');
var left = $rightPane.position().left - 400;
setTimeout(function() {
  $rightPane.css('left', left + 'px');
}, 0);
```

A few notes on this implementation:

1. Given that the application sizes are fixed, we could have used a CSS
class '.close' and hardcode the close position the same way we hardcode the open one.
1. We could also have used CSS 'translate', which would have been more
performant than animating the pane's 'left' property. This is especially true
for mobile devices (such as iOS) where 3D transforms are hardware accelerated.
1. The `setTimeout` is not strictly necessary in this case since the original
position was set prior to the modification. However, it allows the browser
to make the animation smoother by displaying the quiz just before sliding the rightPane in.

#### 2.) Settings dialog box animation

When the user clicks on a setting in the right, the settings dialog appears
from the bottom of the screen and scrolls down to the appropriate section.

To accomplish this, we had a similar transition to the right pane. The only thing that
took some time was to resolve the jerkiness on first appearance of the dialog.
To instruct the browser to cache the dialog UI, we ended up displaying it
once and scrolling to it. At first, we tried with `display: none`.
This approach was wrong because the browser assumed the dialog does not need to be shown.
The solution was to display the settings with a `z-index: -1` at initialization,
making it invisible to the user but visible to the browser.

#### 3.) Quiz success or incorrect message animation

The third animation is actually two in one. When the 'success' or 'incorrect'
message appears, first scale to a point, wait for a little, and finally
scale even bigger and disappear. For this, we have two CSS3 animation styles,
and orchestrate it via JavaScript on a `webkitTransitionEnd` event.

```css
.quiz-result > div.anim1 {
  opacity: 0.8;
  -webkit-transform: scale(6,6);
}
.quiz-result > div.anim2{
  opacity: 0;
  -webkit-transform: scale(9,9);
}
```

```js
setTimeout(function() {
  $msg.addClass("anim1");
  $msg.bind("webkitTransitionEnd", function(){
    if ($msg.hasClass("anim1")) {
      setTimeout(function() {
        $msg.removeClass("anim1");
        $msg.addClass("anim2");
      }, 300);
    } else {
      $msg.remove();
      displayNextItem();
      freezeInput = false;
    }
  });
}, 0);
```

### Audio tag

When users answer a quiz, the application makes a success or fail sound.
The simple choice was to use the audio tag and call `play()` on them.
These audio bits are added to the main page of the application:

```html
<audio id="audioCorrect" src="correct.mp3" preload="auto" autobuffer></audio>
<audio id="audioWrong" src="wrong.mp3" preload="auto" autobuffer></audio>
```

## Conclusion

HTML5 is truly enabling a new breed of Web, desktop, and mobile applications.
CSS3 was instrumental in customizing the look and feel of the application to
closely match the high sophistication of MathBoard for iPad, HTML5 storage was
a perfect fit for our data persistence, and the simplicity of HTML5 audio allowed
us to closely replicate the iPad app.
