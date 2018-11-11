---
title: Avoid flash of invisible text
author: khempenius
page_type: glitch
glitch: font-observer
---

This code lab shows you how to display text immediately using [Font Face Observer](https://github.com/bramstein/fontfaceobserver).

## 1. Add Font Face Observer

[Font Face Observer](https://github.com/bramstein/fontfaceobserver) is a script
that detects when a font loads. The
[`fontfaceobserver.js`](https://github.com/bramstein/fontfaceobserver/blob/master/fontfaceobserver.js)
file has already been saved to the project directory, so you don't need to add it
separately. However, you do need to add a script tag for it.

- Add a script tag for `fontfaceobserver.js` to `index.html`:
 
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
  const pacificoObserver = new FontFaceObserver('Pacifico');
  const robotoObserver = new FontFaceObserver('Roboto');
</script>
```

If you're ever unsure what font face observers you need to create, just look for
the `font-family` declarations in your CSS. Pass the `font-family` name of these declarations to
`FontFaceObserver()`. There is no need to create a font observer for
[fallback fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#%3Cgeneric-name%3E).

For example, if your CSS was `font-family: "Times New Roman", Times, serif;` you would add `FontFaceObserver(‘Times New Roman')`. Times and serif are fallback fonts, so you would not need to declare FontFaceObservers for them.

### Detect font load

The code for detecting a font load looks like this:

    robotoObserver.load().then(function(){
      console.log("Hooray! Font loaded.");
    });

`robotoObserver.load()` is a promise that resolves when the font loads.

The demo site uses two different fonts, so you need to use [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
to wait until both fonts have loaded.

- Add this promise to your script, right below the FontFaceObservers that you
just declared:

```
    Promise.all([
      pacificoObserver.load(),
      robotoObserver.load()
    ]).then(function(){
      /* Do things */
    });
```

#### ✔️Check-in

Your script should now look like this:

```html
<script type="text/javascript">
  const pacificoObserver = new FontFaceObserver('Pacifico');
  const robotoObserver = new FontFaceObserver('Roboto');

  Promise.all([
    pacificoObserver.load(),
    robotoObserver.load()
  ]).then(function(){
    /* Do things */
  });
</script>
```

### Apply `fonts-loaded` class

- Replace the `/* Do things */` comment in the script with this line:

```
document.documentElement.className += " fonts-loaded";
```

This adds the `fonts-loaded` class to the document's root element (i.e. the <html> tag) once both fonts have loaded.

(Note: The trailing space before `fonts-loaded` isn't a typo. It prevents
`fonts-loaded` from being appended to another class. If it wasn't there you
could end up with a class like `your-existing-classfonts-loaded`.)

#### ✔️Check-in

Your completed script should look like this:

```html
<script type="text/javascript">
  const pacificoObserver = new FontFaceObserver('Pacifico');
  const robotoObserver = new FontFaceObserver('Roboto');

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
the `fonts-loaded` class has been applied.

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
