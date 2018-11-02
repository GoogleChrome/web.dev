---
title: Avoid flash of invisible text
author: khempenius
page_type: glitch
glitch: font-observer
---

# Avoid flash of invisible text

This code lab shows you how to display text immediately using <a href="https://github.com/bramstein/fontfaceobserver" target="_blank">Font Face Observer</a>.

## 1. Add Font Face Observer

<a href="https://github.com/bramstein/fontfaceobserver" target="_blank">Font Face Observer</a> is a script
that detects when a font loads. The
<a href="https://github.com/bramstein/fontfaceobserver/blob/master/fontfaceobserver.js" target="_blank">fontfaceobserver.js</a>
file has been added to this project for you, so you don't need to add it
separately. But you do need to add a link to that file in your main page.

- Add a script tag for `fontfaceobserver.js` to the body of your `index.html`:
 
```html
<script src="fontfaceobserver.js" type="text/javascript"></script>
```

## 2. Use Font Face Observer

### Create Observers

Create an observer for each font family that it is used on the page.

- Add the following script after the `fontfaceobserver.js` script. This creates
observers for the "Pacifico" and "Roboto" font families:

```html
<script type="text/javascript">
  var pacificoObserver = new FontFaceObserver('Pacifico');
  var robotoObserver = new FontFaceObserver('Roboto');
</script>
```

If you're ever unsure what font face observers you need to create, just look for
the `font-family` declarations in your CSS. Pass the font-family name to
`FontFaceObserver()`. There is no need to create a font observer for <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#%3Cgeneric-name%3E" target="_blank">fallback fonts</a>.

<table>
<thead>
<tr>
<th>CSS</th>
<th>Corresponding Font Face Observer</th>
</tr>
</thead>
<tbody>
<tr>
<td><p><pre>
font-family: "Times New Roman", Times, serif;
</pre></p>

</td>
<td><p><pre>
FontFaceObserver(‘Times New Roman')
<br>
// Times and serif are fallback fonts.
</pre></p>

</td>
</tr>
</tbody>
</table>

### Detect font load

The code for detecting a font load looks like this:

    robotoObserver.load().then(function(){
      console.log("Hooray! Font loaded.");
    });

`robotoObserver.load()` is a promise that resolves when the font loads.

The demo site uses two different fonts, so you need to use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all" target="_blank">Promise.all()</a>
to wait until both fonts have loaded.

- Add this promise to your script, right below the FontFaceObservers that you
just declared:

    Promise.all([
      pacificoObserver.load(),
      robotoObserver.load()
    ]).then(function(){
      /* Do things */
    });

#### ✔️Checkin

Your script should now look like this:

```html
<script type="text/javascript">
  var pacificoObserver = new FontFaceObserver('Pacifico');
  var robotoObserver = new FontFaceObserver('Roboto');

  Promise.all([
    pacificoObserver.load(),
    robotoObserver.load()
  ]).then(function(){
    /* Do things */
  });
</script>
```

### Apply ‘fonts-loaded' class

- Replace the `/* Do things */` comment in the script with this line:

    document.documentElement.className += " fonts-loaded";

This adds the `fonts-loaded` class to the document's root element (i.e. the <html> tag) once both fonts have loaded.

(Note: The trailing space before ‘fonts-loaded' isn't a typo. It prevents
‘fonts-loaded' from being appended to another class. If it wasn't there you
could end up with a class like `your-existing-classfonts-loaded`.)

#### ✔️Checkin

Your completed script should look like this:

```html
<script type="text/javascript">
  var pacificoObserver = new FontFaceObserver('Pacifico');
  var robotoObserver = new FontFaceObserver('Roboto');

  Promise.all([
     pacificoObserver.load(),
     robotoObserver.load()
  ]).then(function(){
     document.documentElement.className += " fonts-loaded";
  });
</script>
```

## Update CSS

Your page should be styled to use a system font initially and custom fonts once
the "fonts-loaded" class has been applied.

- Update the CSS:

<table>
<thead>
<tr>
<th>Original code:</th>
<th>Change code to this:</th>
</tr>
</thead>
<tbody>
<tr>
<td>.header {<br>
&nbsp;&nbsp;font-family: 'Pacifico', cursive;<br>
}<br>
<br>
.text {<br>
&nbsp;&nbsp;font-family: 'Roboto', sans-serif;<br>
}</td>
<td>html.fonts-loaded .header {<br>
&nbsp;&nbsp;font-family: 'Pacifico', cursive;<br>
}<br>
<br>
html.fonts-loaded .text {<br>
&nbsp;&nbsp;font-family: 'Roboto', sans-serif;<br>
}</td>
</tr>
</tbody>
</table>

## Verify

- Click on the "Show Live" button to view the live version of the your Glitch.

If the page looks like this, then you've successfully implemented Font Face
Observer and gotten rid of the "Flash of Invisible Text."

![image](./fancy-header.png)
