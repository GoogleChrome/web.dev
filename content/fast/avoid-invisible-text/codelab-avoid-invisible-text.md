---
title: Avoid flash of invisible text
author: khempenius
page_type: glitch
glitch: font-observer
---

This code lab shows you how to display text immediately using [Font Face Observer](https://github.com/bramstein/fontfaceobserver).

## Add Font Face Observer

[Font Face Observer](https://github.com/bramstein/fontfaceobserver) is a script
that detects when a font loads. The
[`fontfaceobserver.js`](https://github.com/bramstein/fontfaceobserver/blob/master/fontfaceobserver.js)
file has already been saved to the project directory, so you don't need to add it
separately. However, you do need to add a script tag for it.

- Click the **Remix This** button to make the project editable.

<web-screenshot type="remix"></web-screenshot>

- Add a script tag for `fontfaceobserver.js` to `index.html`:
 
<pre class="prettyprint devsite-disable-click-to-copy">
    &lt;div class=&quot;text&quot;&gt;Some text.&lt;/div&gt;
    <strong>&lt;script src=&quot;fontfaceobserver.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;</strong>
&lt;/body&gt;
</pre>


## Use Font Face Observer

### Create Observers

Create an observer for each font family that it is used on the page.

- Add the following script after the `fontfaceobserver.js` script. This creates
observers for the "Pacifico" and "Roboto" font families:

<pre class="prettyprint devsite-disable-click-to-copy">
    &lt;script src=&quot;fontfaceobserver.js&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;
    <strong>&lt;script type=&quot;text/javascript&quot;&gt;</strong>
      <strong>const pacificoObserver = new FontFaceObserver('Pacifico');</strong>
      <strong>const robotoObserver = new FontFaceObserver('Roboto');</strong>
    <strong>&lt;/script&gt;</strong>
&lt;body&gt;
</pre>

If you're ever unsure what font face observers you need to create, just look for
the `font-family` declarations in your CSS. Pass the `font-family` name of these declarations to
`FontFaceObserver()`. There is no need to create a font observer for
[fallback fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#%3Cgeneric-name%3E).

For example, if your CSS was:

```css
font-family: "Times New Roman", Times, serif;
```

you would add `FontFaceObserver(‘Times New Roman')`. Times and serif are fallback fonts, so you would not need to declare FontFaceObservers for them.

### Detect font load

The code for detecting a font load looks like this:

```javascript
robotoObserver.load().then(function(){
    console.log("Hooray! Font loaded.");
});
```

`robotoObserver.load()` is a promise that resolves when the font loads.

The demo site uses two different fonts, so you need to use [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
to wait until both fonts have loaded.

- Add this promise to your script, right below the FontFaceObservers that you
just declared:

```javascript
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

```javascript
document.documentElement.className += " fonts-loaded";
```

This adds the `fonts-loaded` class to the document's root element (i.e. the <html> tag) once both fonts have loaded.

<div class="aside note">
The trailing space before <code>fonts-loaded</code> isn't a typo. It prevents
<code>fonts-loaded</code> from being appended to another class. If it wasn't there you could end up with a class like <code>your-existing-classfonts-loaded</code>.
</div>

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

<pre class="prettyprint devsite-disable-click-to-copy">
<s>.header {</s>
<strong>html.fonts-loaded .header {</strong>
  <strong>font-family: 'Pacifico', cursive;</strong>
<strong>}</strong>

<s>.text</s>
<strong>html.fonts-loaded .text {</strong>
  <strong>font-family: 'Roboto', sans-serif;</strong>
<strong>}</strong>
</pre>

## Verify

- Click the **Show Live** button to preview the app.

<web-screenshot type="show-live"></web-screenshot>

If the page looks like this, then you've successfully implemented Font Face
Observer and gotten rid of the "Flash of Invisible Text."

![image](./fancy-header.png)
