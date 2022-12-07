---
layout: post
title: A Simple Trip Meter using the Geolocation API
authors:
  - mahemoff
date: 2010-05-24
tags:
  - blog
---

## Introduction

The [Geolocation API](http://dev.w3.org/geo/api/) lets you find out where the user is and keep tabs on them as they move around, always with the user's consent. This functionality could be used as part of user queries, e.g. to guide someone to a destination point. It could also be used for "geo-tagging" some content the user has created, e.g. to mark where a photo was taken. The API is device-agnostic; it doesn't care how the browser determines location, so long as clients can request and receive location data in a standard way. The underlying mechanism might be via GPS, wifi, or simply asking the user to enter their location manually. Since any of these lookups is going to take some time, the API is asynchronous; you pass it a callback method whenever you request a location.

The example here is a trip meter showing the initial location and maintaining a display of the distance they have travelled since the page was loaded.

## Step 1. Check for Compatibility

{% BrowserCompat 'api.Geolocation' %}

You can easily check for compatibility by testing for the presence of the geolocation object:

```js
// check for Geolocation support
if (navigator.geolocation) {
  console.log('Geolocation is supported!');
}
else {
  console.log('Geolocation is not supported for this Browser/OS version yet.');
}
```

## Step 2. Declare the Trip Meter HTML

In this example, you're building a trip meter, so declare the following HTML:

```html
<div id="tripmeter">
<p>
Starting Location (lat, lon):<br/>
<span id="startLat">???</span>°, <span id="startLon">???</span>°
</p>
<p>
Current Location (lat, lon):<br/>
<span id="currentLat">???</span>°, <span id="currentLon">???</span>°
</p>
<p>
Distance from starting location:<br/>
<span id="distance">0</span> km
</p>
</div>
```

The next few steps will use the Geolocation API to populate all those empty spans.

## Step 3. Determine the User's Current Location

`getCurrentPosition()` will asynchronously report on the user's current location. Call it as soon as the page loads, so that it will correctly populate - and save for later - the starting position:

```js
window.onload = function() {
var startPos;
navigator.geolocation.getCurrentPosition(function(position) {
startPos = position;
document.getElementById('startLat').innerHTML = startPos.coords.latitude;
document.getElementById('startLon').innerHTML = startPos.coords.longitude;
});
};
```

If this is the first time an application on this domain has requested permissions, the browser will
typically check for user consent. Depending on the browser, there may also be preferences to always
allow - or disallow - permission lookups, in which case the confirmation process will be bypassed.

Having run this code, you should now be able to see the starting position. Depending on the location
device your browser is using, the position object might actually contain a lot more than just latitude
and longitude, e.g. it could include an altitude or a direction. You can explore further by logging
the position variable to the console.

## Step 4. Handle Errors

Unfortunately, not all location lookups are successful. Perhaps a GPS could not be located or
the user has suddenly disabled location lookups. A second, optional, argument to `getCurrentPosition()`
will be called in the event of an error, so you can notify the user inside the callback:

```js
window.onload = function() {
var startPos;
navigator.geolocation.getCurrentPosition(function(position) {
// same as above
}, function(error) {
alert('Error occurred. Error code: ' + error.code);
// error.code can be:
//   0: unknown error
//   1: permission denied
//   2: position unavailable (error response from locaton provider)
//   3: timed out
});
};
```

## Step 5. Monitor the User's Location

The previous call to `getCurrentPosition()` was only executed once, on page load. To track changes,
use `watchPosition()`. It will automatically notify a callback function whenever the user moves:

```js
navigator.geolocation.watchPosition(function(position) {
document.getElementById('currentLat').innerHTML = position.coords.latitude;
document.getElementById('currentLon').innerHTML = position.coords.longitude;
});
```

## Step 6. Show Distance Travelled

This step isn't directly related to the Geolocation API, but rounds off the demo and provides an
example of how you might use location data. Add an extra line to the `watchPosition()` handler to populate the distance travelled:

```js
navigator.geolocation.watchPosition(function(position) {
// same as above
document.getElementById('distance').innerHTML =
    calculateDistance(startPos.coords.latitude, startPos.coords.longitude,
                    position.coords.latitude, position.coords.longitude);
});
```

The `calculateDistance()` function performs a geometric algorithm to determine
the distance between two co-ordinates. The Javascript implementation is adapted from [a script provided by Moveable Type](http://www.movable-type.co.uk/scripts/latlong.html)
under a [Creative Commons license](http://creativecommons.org/licenses/by/3.0/):

```js
function calculateDistance(lat1, lon1, lat2, lon2) {
var R = 6371; // km
var dLat = (lat2 - lat1).toRad();
var dLon = (lon2 - lon1).toRad();
var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
var d = R * c;
return d;
}
Number.prototype.toRad = function() {
return this * Math.PI / 180;
}
```
