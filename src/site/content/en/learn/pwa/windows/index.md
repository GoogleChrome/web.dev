---
title: Window management
Authors:
  -
description: >
  A PWA outside of the browser manages its own window. In this chapter, you will understand the APIs and capabilities for managing a window within the operating system.

date: 2022-04-15
---

## The PWA window

Running on your own window, managed by your PWA, has all the advantages and responsibilities of any window in that operating system, such as:

* The ability to resize and move the window around on multi-window operating systems, like Windows or ChromeOS.
* Sharing the screen with other app windows, as in iPadOS split mode or Android split-screen mode.
* Appearing in docks, taskbars, and in the alt-tab menu on desktop, and multi-task window lists on mobile devices.
* The ability to minimize, move the window across screens and desktops, and close it at any time.

### Moving and resizing the window

Your PWA window can be of any size and positioned anywhere on the screen on desktop operating systems. By default, when the user opens the PWA for the first time after installation, the PWA gets a default window size of a percentage of the current screen, with a maximum resolution of 1920x1080 positioned at the top-left corner of the screen.

The user can move and resize the window, and the browser will remember the last preference, so the next time the user opens the app, the window will retain the size and position from the previous usage.

There is no way to define your PWA's preferred size and position within the manifest. You can only reposition and resize the window using the JavaScript API. From your code, you can move and resize your own PWA window using the [`moveTo(x, y)`](https://developer.mozilla.org/docs/Web/API/Window/moveTo) and [`resizeTo(x, y)`](https://developer.mozilla.org/docs/Web/API/Window/resizeTo) functions of the `window` object.

For example, you can resize and move your PWA window when the PWA loads using:

```js
document.addEventListener("DOMContentLoaded", event => {
   // we can move only if we are not in a browser's tab
   isBrowser = matchMedia("(display-mode: browser)").matches;
   if (!isBrowser) {
      window.moveTo(16, 16);
      window.resizeTo(800, 600);
   }
});
```

You can query the current screen size and position using the `window.screen` object; you can detect when the window is resized using the `resize` event from the `window` object. There is no event for capturing the window move, so your option is to query the position frequently.

{% Aside %}
Instead of moving and resizing the window absolutely, you can move relatively and resize using `moveBy()` and `resizeBy()`.
{% endAside %}


{% Aside %}
On mobile devices, moving or resizing your window won't make any changes on the screen.
{% endAside %}

### Browsing to other sites
If you want to send the user to an external site that is out of the scope of your PWA, you can do so with a standard `<a href>` HTML element, using `location.href` or opening a new window on compatible platforms.

Currently on all browsers, if your PWA is installed, when you browse to a URL that is out of the [scope of your manifest](/learn/pwa/web-app-manifest/#recommended-fields), the browser engine of your PWA will render an in-app browser within the context of your window.

Some features of the in-app browsers are:

* They appear on top of your content.
* They have a static URL bar showing the current origin, the window's title, and a menu. Typically, they're themed with the `theme_color` of your manifest.
* From the contextual menu, you can open that URL in the browser.
* Users can close the browser or go back.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/0SsThiNz4GDkJy6OiTHj.png", alt="An in-app browser on a desktop PWA when browsing a URL that is out-of-scope.", width="800", height="497" %}

{% Aside %}
While the in-app browser is on the screen, your PWA is waiting in the background, as if another window is obscuring it.
{% endAside %}

{% Aside 'gotchas' %}
On iOS and iPadOS, the in-app browser uses SafariViewController, a Safari-rendering engine isolated from your PWA storage. Therefore, if the user has a session in Safari, it won't appear in your PWA, but it will appear within an in-app browser in your PWA.
{% endAside %}

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/Gr4qJUx6hAFMyPLPyfQY.png", alt="An in-app browser on an iPhone when browsing a URL that is out-of-scope within a standalone PWA.", width="800", height="370" %}

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/UyohW4R5Sy79ffHri8cz.png", alt="An in-app browser on Android when browsing a URL that is out-of-scope within a standalone PWA.", width="800", height="1644" %}


#### Authorization flows

Many web authentication and authorization flows involve redirecting the user to a different URL in a different origin to acquire a token that will return to your PWA's origin, such as using [OAuth 2.0](https://oauth.net/2/).

In these cases, the in-app browser follows the following process:

1. The user opens your PWA and clicks login.
1. Your PWA redirects the user to a URL that is out of the scope of the PWA so that the rendering engine will open an in-app browser within your PWA.
1. The user can cancel the in-app browser and go back to your PWA at any time.
1. The user logs into the in-app browser. The authentication server redirects the user to your PWA origin, sending the token as an argument.
1. The in-app browser closes itself when it detects a URL that is part of the scope of the PWA.
1. The engine redirects the main PWA window navigation to the URL that the authentication server went to while in the in-app browser.
1. Your PWA gets the token, stores the token, and renders the PWA.

#### Forcing a browser's navigation

If you want to force open the browser with a URL and not an in-app browser, you can use the `_blank` target of `<a href>` elements. This works only on desktop PWAs; on mobile devices, there is no option to open a browser with a URL.

```js
function openBrowser(url) {
	window.open("url", "_blank", "");
}
```

### Opening new windows

On desktop, users can open more than one window of the same PWA. Each window will be a different navigation to the same `start_url`, as if you were opening two browser tabs of the same URL.
From the menu in the PWA, users can select File then New window, and from your PWA code, you can open a new window with the `open()` function. Check the [documentation](https://developer.mozilla.org/docs/Web/API/Window/open) for details.

```js
function openNewWindow() {
	window.open("/", "new-window", "width=600,height=600");
}
```
{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/CURym4RD66CqcTw4iPl5.png", alt="The same installed PWA with several windows opened on a desktop operating system.", width="800", height="580" %}

Calling `open()` within a PWA window on iOS or iPadOS returns `null` and doesn't open a window. Opening new windows on Android creates a new in-app browser for the URL—even if the URL is within the scope of your PWA—that typically doesn't trigger an external browsing experience.

{% Aside 'warning' %}
The second argument of `open()` is the window's name. If the name you used is already opened, the engine will replace the opened window with that name with a new navigation. If you always want to open a new window, you must use different string values for a name.
{% endAside %}


{% Glitch 'mlearn-pwa-windows-basic' %}


{% Aside 'gotchas' %}
The functions `open()`, `moveTo()`, and `resizeTo()` don't need the `window.` prefix when writing JavaScript because `window` is the global object. You can just call `moveTo(0, 0)`. However, calling `window.moveTo(0, 0)` makes the code easier to understand.
{% endAside %}

### Window title

The `<title>` element was primarily used for SEO purposes as the space within a browser tab is limited. When you move from the browser to your window in a PWA, all the title bar space is available to you.

You can define the contents of the title bar:

* Statically in your HTML `<title>` element.
* Dynamically changing the `document.title` string property at any time.

On desktop PWAs, the title is essential, and it's used in the title bar of the window and sometimes in the task manager or multi-task selection. If you have a single-page application, you may want to update your title on every route.

{% Aside %}
To reduce phishing within PWAs, some desktop browsers may have additional measures on the window's title. For example, if you don't use your app's name in the title, the browser may add a prefix with your PWA's name on it. Other browsers may render the current origin in the title bar for a few seconds when you change the title to highlight where the user navigated.
{% endAside %}

### Tabbed mode

An experimental capability, known as *tabbed mode*​ will let your PWA have a tab-based design similar to a web browser. In this case, the user can have several tabs opened from the same PWA but all tied together in the same operating system window, as you can see in the following video:

{% Video src="video/W3z1f5ZkBJSgL1V1IfloTIctbIF3/b1SL9QwJcgRXrVDeLKmK.mp4",
loop="true",
muted="true",
playsinline="true",
controls="true",
poster="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/emg7quu4DyvYwlyzgDE1.png"
%}

You can read more about this experimental capability at [Tabbed application mode for PWA](/tabbed-application-mode/).

{% Aside %}
In the [Experimental chapter](/learn/pwa/experimental), you will see how you can start using experimental capabilities.
{% endAside %}

### Window controls overlay

We've mentioned that you can change the window's title by defining the value of the `<title>` element or the `document.title` property. But it's always a string value. What if we could design the title bar as we wish, with HTML, CSS, and images?
That's where Window Controls Overlay comes in, a new experimental capability in Microsoft Edge and Google Chrome for desktop PWAs.

{% Aside %}
Tabbed mode and window controls overlay capabilities define new values for the manifest's `display` member. To create compatibility with all devices, the manifest group has created a way to replace the [fallback `display` chain](/learn/pwa/app-design/#display-modes), so you can specify what `display` value to use if your first option is not available. Read more about it at [Preparing for the display modes of tomorrow](/display-override/).
{% endAside %}

You can read more about this capability at [Customize the window controls overlay of your PWA's title bar](/window-controls-overlay/).

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/B5UDAJzKTqCRdSy6B5is.png", alt="With window controls overlay, you can render content in the title bar.", width="800", height="544" %}

## Multi-screen window placement

With multiple screens, users will want to use all the space available to them. Users may:

* Open a presentation on an external monitor.
* Restore an opened window's position on the screen.
* Favor screens that support touch.

The [Multi-Screen Window Placement API](/multi-screen-window-placement/) allows PWAs to do just that and more.

### Getting screen details

The Multi-Screen Window Placement API adds a new method, `window.getScreenDetails()`, that returns an object with screens as an immutable array of attached screens. There's also a live object accessible from `ScreenDetails.currentScreen`, corresponding to the current `window.screen`.

{% Aside 'gotchas' %}
On some browsers, calling `window.getScreenDetails()` requires the user to grant permission to your PWAs.
{% endAside %}

The returned object also fires a [`screenschange` event](/multi-screen-window-placement/#the-screenschange-event) when the `screens` array changes. (This does not happen when attributes on individual screens are changed.) Individual screens, either `window.screen` or a screen in the `screens` array, also fire a `change` event when their attributes change.

```js
// Request an object with a screen objects
const screenDetails = await window.getScreenDetails();
screenDetails.screens[0].isPrimary;  // e.g. true
screenDetails.screens[0].isInternal;  // e.g. true
screenDetails.screens[0].pointerTypes;  // e.g. ["touch"]
screenDetails.screens[0].label;  // e.g. 'Samsung Electric Company 28"'

// Access the live object corresponding to the current `window.screen`.
// The object is updated on cross-screen window placements or device changes.
screenDetails.currentScreen;
screenDetails.addEventListener('screenschange', function() {
 // NOTE: Does not fire on changes to attributes of individual screens.
  const screenCount = screenDetails.screens.length;
  const currentScreen screenDetails.currentScreen.id;
});
```

If the user or the operating system moves your PWA's window from one screen to another, a [`currentscreenchange` event](/multi-screen-window-placement/#the-currentscreenchange-event) will also be fired from the screen details object.

{% Aside %}
You may also want to check the [Presentation API](https://developer.mozilla.org/docs/Web/API/Presentation_API) to display web content through large presentation devices such as projectors and network-connected televisions.
{% BrowserCompat 'api.Presentation' %}
{% endAside %}

{% Glitch 'mlearn-pwa-windows-screens' %}


## Screen wake lock

Imagine this: you're in the kitchen following a recipe on your tablet. You've just finished prepping your ingredients. Your hands are a mess, and you turn back to your device to read the next step. Disaster! The screen's gone black! The [Screen Wake Lock API](https://developer.mozilla.org/docs/Web/API/Screen_Wake_Lock_API) is here for you and lets a PWA prevent screens from dimming, sleeping, or locking, allowing users to stop, start, leave, and return without worry.

```js
// Request a screen wake lock
const wakeLock = await navigator.wakeLock.request();

// Listen for wake lock release
wakeLock.addEventListener('release', () => {
 console.log(`Screen Wake Lock released: ${wakeLock.released}`);
});
// Manually release the wake lock
wakeLock.release();
```

## Virtual keyboard

Touch-based devices, such as phones and tablets, offer a virtual on-screen keyboard so the user can type when form elements of your PWA are in focus.

Thanks to the [VirtualKeyboard API](/virtualkeyboard/), your PWA can now have more control of the keyboard on compatible platforms using the `navigator.virtualKeyboard` interface, including:

* Showing and hiding the virtual keyboard with the functions `navigator.virtualKeyboard.show()` and `navigator.virtualKeyboard.hide()`.
* Telling the browser that you are taking care of closing the virtual keyboard yourself by setting `navigator.virtualKeyboard.overlaysContent` equal to `true`.
* Knowing when the keyboard appears and disappears with the event `geometrychange` of `navigator.virtualKeyboard`.
* Setting the virtual keyboard policy on editing host elements (using `contenteditable`) with the `virtualkeyboardpolicy` HTML attribute. A policy lets you decide if you want the virtual keyboard to be handled automatically by the browser using the `auto` value, or handled by your script using the `manual` value.
* Using CSS environmental variables for getting information about the virtual keyboard appearance, such as `keyboard-inset-height` and `keyboard-inset-top`.

You can read more about this API on [Full control with the VirtualKeyboard API](/virtualkeyboard/).

##  Resources

- [Managing several displays with the Multi-Screen Window Placement API](/multi-screen-window-placement/)
- [Tabbed application mode for PWAs](/tabbed-application-mode/)
- [Stay awake with the Screen Wake Lock API](/wake-lock/)
- [Full control with the VirtualKeyboard API](/virtualkeyboard/)
- [Customize the window controls overlay of your PWA's title bar](/window-controls-overlay/)
- [Display content in the title bar](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/window-controls-overlay)
