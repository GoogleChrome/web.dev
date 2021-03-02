---
layout: course
title: Box Model
subhead: This post highlights a few powerful lines of CSS that do some serious heavy lifting and help you build robust modern layouts.
authors:
  - andybell
tags:
  - css
---

## Learn CSS - Box Model

Say you have this bit of HTML:

```html
<p>I am a paragraph of text that has a few words in it.</p>
```

Then say you wrote this CSS for it:

```css
p {
  width: 100px;
  height: 50px;
  padding: 20px;
  border: 1px solid;
}
```

The content would break out of your element and it would be 140px wide, rather than 100px. Why is that? The box model is a core foundation of CSS and understanding how it works, how it is affected by other aspects of CSS and importantly, how you can control it will help you to write more predictable CSS.

<iframe height="500" style="width: 100%;" scrolling="no" title="Learn CSS - Box model intro" src="https://codepen.io/piccalilli/embed/0c03f5dc8a83ccaa2f48fcc115e1ec54?height=500&theme-id=38982&default-tab=result," frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/piccalilli/pen/0c03f5dc8a83ccaa2f48fcc115e1ec54'>Learn CSS - Box model intro</a> by Piccalilli
  (<a href='https://codepen.io/piccalilli'>@piccalilli</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

---

A really important thing to remember when writing CSS—or working on the web as a whole—is that everything in the browser is a box. Whether that’s a box that uses `border-radius` to look like a circle, or even just some text: the key thing to remember is that it’s all boxes.

## Content and sizing

Boxes have different behaviour based on their `display` value, their set dimensions, and the content that lives within them. This content could be even more boxes—like child elements—or plain text content. Either way, **this content will affect the size of the box by default**.

You can control this by using **extrinsic sizing**, or, you can continue to let the browser make decisions for us, using **intrinsic sizing**.

Let’s quickly look at the difference, using a demo to help us.

<iframe height="500" style="width: 100%;" scrolling="no" title="Learn CSS - Box model intro" src="https://codepen.io/piccalilli/embed/5cbda8499e19245d7b48cac8d796dda5?height=500&theme-id=38982&default-tab=result," frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/piccalilli/pen/0c03f5dc8a83ccaa2f48fcc115e1ec54'>Learn CSS - Box model intro</a> by Piccalilli
  (<a href='https://codepen.io/piccalilli'>@piccalilli</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

[CAPTION: Notice that when the box is using **extrinsic sizing**, there’s a limit of how much content you can add before it overflows out of the box’s bounds. This makes the word, “awesome”, overflow.]

The demo has the words, “CSS is awesome” in a box with fixed dimensions, with a thick border. The box has a width, so is **extrinsically sized**, so it tries to control the sizing of its child content. The problem with this though, is that the word “awesome” is **too large for the box**, so it overflows outside of the parent box’s **border box** (more on this later in the lesson). To mitigate this overflow, you allow the box to be **intrinsically sized** by either unsetting the width, or in this case, setting the `width` to be `max-content`, which tells the box to only be as wide as the intrinsic maximum width of its content (the word "awesome"). This allows the box to fit around “CSS is awesome”, perfectly.

Let’s look at something more complex to see the impact of different sizing on real content:

<iframe height="500" style="width: 100%;" scrolling="no" title="Learn CSS - Box model intro" src="https://codepen.io/piccalilli/embed/5cbda8499e19245d7b48cac8d796dda5?height=500&theme-id=38982&default-tab=result," frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/piccalilli/pen/cdd8b9e93b8e90e9e8e432aea596ec55'>Learn CSS - Box model intro</a> by Piccalilli
  (<a href='https://codepen.io/piccalilli'>@piccalilli</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

_Toggle intrinsic sizing on and off to see how you can gain more control with **extrinsic sizing** and let the content have more control with intrinsic sizing. To see the effect that intrinsic and extrinsic sizing has, add a few sentences of content to the card. When this element is using **extrinsic sizing**, there’s a limit of how much content you can add before it overflows out of the element’s bounds, but this isn’t the case when **intrinsic sizing** is toggled on_.

By default, this element has a set `width` and `height`—both `400px`. These dimensions give **strict bounds to everything inside the element**, which will be honoured by default _only_ if those child elements don’t have set or calculated dimensions that are **greater than 400px**. If these dimensions exceed `400px`, there will likely be **overflow**. You can see this in action by changing the content of the caption, under the flower picture to something that **exceeds the height of the box**, which is a few lines of content.

{% Aside "key-term" %}

When content is too big for the box it is in, we call this **overflow**. You can manage how an element handles **overflow **content, using the [`overflow` property](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow).

{% endAside %}

When you switch to **intrinsic sizing**, we’re letting the browser make decisions for us, based on the box’s display value, content sizes, padding and border. It’s much more difficult for there to be overflow with **intrinsic sizing** because our box will **resize with its content**, rather than try to size the content. It’s important to remember that this is the default, flexible behaviour of a browser and although **extrinsic sizing** gives more control on the surface, **intrinsic sizing** provides the most flexibility, most of the time.

## The layers of the box model

Our boxes are made up of distinct box model layers that all do a specific job for us.

![The four main sections of the box model: content box, padding box, border box and margin box](https://assets.codepen.io/174183/bm-1.jpg)

You start with **content box**, which is the layer that our content lives in. As you learned before: this content can control the size of its parent, so is usually the most variably sized layer.

The **padding box** surrounds the **content box** and is where the space created by the [`padding` property](https://developer.mozilla.org/en-US/docs/Web/CSS/padding). Because padding is **inside the box**, the background of the box will be visible in the space that it creates. If our box has overflow rules set, such as `overflow: auto` or `overflow: scroll` set, the scrollbars will occupy this space too.

<iframe height="500" style="width: 100%;" scrolling="no" title="Learn CSS - Box model intro" src="https://codepen.io/argyleink/embed/bGNmgGW?height=500&theme-id=38982&default-tab=result," frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/argyleink/pen/bGNmgGW'>Learn CSS - Box model intro</a> by Piccalilli
  (<a href='https://codepen.io/piccalilli'>@piccalilli</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

The **border box** surrounds the **padding box** and its space is occupied by the `border` value. The **border box** is the bounds of your box and the **border edge** is the limit of what you can visually see. The [`border` property](https://developer.mozilla.org/en-US/docs/Web/CSS/border) is used to visually frame an element.

The final layer, the **margin box**, is the space around your box, defined by the `margin` rule on your box, or by parent-defined space, [such as `gap`](https://developer.mozilla.org/en-us/docs/Web/CSS/gap). Properties such as [`outline`](https://developer.mozilla.org/en-US/docs/Web/CSS/outline) and [`box-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) occupy this space too because they are **painted**, so they don’t affect the size of our box. You could have an `outline-width` of `200px` on our box and everything **inside and including the border box would be exactly the same size**.

<iframe height="500" style="width: 100%;" scrolling="no" title="Learn CSS - Box model intro" src="https://codepen.io/piccalilli/embed/5cbda8499e19245d7b48cac8d796dda5?height=500&theme-id=38982&default-tab=result," frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/piccalilli/pen/3a29b4a7d35ef7e1bd205be9ac65e25e'>Learn CSS - Box model intro</a> by Piccalilli
  (<a href='https://codepen.io/piccalilli'>@piccalilli</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## A useful analogy

The box model is complex to understand, so let’s recap what we’ve learned with an analogy.

![A group of photo frames, labelled with box model sections](https://assets.codepen.io/174183/bm-2.jpg)

In this diagram, you have three photo frames, mounted to a wall, next to each other. The diagram has labels that associate elements of the frame with the box model.

To break this analogy down:

1. The **content box** is the artwork
2. The **padding box** is the white matte, between the frame and the artwork
3. The **border box** is the the frame, providing a literal border for the artwork
4. The **margin box** is the space between each frame
5. The shadow occupies the same space as the **margin box**

## Debugging the box model

Browser DevTools provide a visualisation of a selected box’s box model calculations, which can help you understand how the box model works and importantly, how it is affecting the website you’re working on.

Go ahead and try this in your own browser by [opening DevTools](https://developers.google.com/web/tools/chrome-devtools/open), [selecting an element](https://developers.google.com/web/tools/chrome-devtools/css/reference#select), then showing the box model debugger.

[VIDEO: The inspect element, element selection, opening the box model debugger flow in chrome]

## Controlling the box model

To understand how to control the box model, you first need to understand what happens in your browser.

By default, your browser has user agent styles. These are default styles that are applied to every single website. These styles vary between each browser, but they provide sensible defaults to make content easier to read. They define how elements should look and behave if there’s no CSS defined. It is in the user agent styles where a box’s default `display` is set, too. For example, a `<div>` element’s default `display` is `block`, a `<li>` has a default `display` value of `list-item` and a `<span>` has a default `display` value of `inline`.

An `inline` element has no block margin, whereas a `block` and `list-item` do. A `block` item will, by default, fill the available **inline space**, whereas an `inline` element will only be as large as its content.

Alongside an understanding of how user agent styles affect each box, you also need to understand `box-sizing`, which tells our box **how to calculate its box size**. By default, all elements have the following user agent style: `box-sizing: content-box;`.

Having `content-box` as the value of `box-sizing` means that when you set dimensions, such as a `width` and `height`, they will be applied to the **content box**. If you then set `padding` and `border`, these values will be **added to the content box’s size**.

Let’s take a look at some example code:

```css
.my-box {
  width: 200px;
  border: 10px solid;
  padding: 20px;
}
```

[SELF ASSESSMENT: “How wide do you think this box will be?”. OPTIONS: 200px or 260px] \

The actual width of this box will be 260px. As the CSS uses the default `box-sizing: content-box`, the applied width is the width of the content, `padding` and `border` on both sides are added to that. So 200px for the content + 40px of padding + 20px of border makes a total visible width of 260px.

You _can_ control this, though, by making the following modification to use the alternative box model, `border-box`:

```css/1
.my-box {
  box-sizing: border-box;
  width: 200px;
  border: 10px solid;
  padding: 20px;
}
```

This alternative box model tells CSS to apply the `width` to the **border box instead of the content box **. This means that our `border` and `padding` get _pushed in_, and as a , when you set `.my-box` to be `200px` wide: it actually renders at `200px` wide.

Check out how this works in the following interactive demo. Notice that when you toggle the `box-sizing` value: it shows— via a blue background—which CSS is being applied _inside_ our box.

<iframe height="500" style="width: 100%;" scrolling="no" title="Learn CSS - Box model intro" src="https://codepen.io/piccalilli/embed/1caa55efb0ee6a6b3ed48196b9c36d52?height=500&theme-id=38982&default-tab=result," frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/piccalilli/pen/0c03f5dc8a83ccaa2f48fcc115e1ec54'>Learn CSS - Box model intro</a> by Piccalilli
  (<a href='https://codepen.io/piccalilli'>@piccalilli</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

If you think back to the extrinsically versus intrinsically sized flower demo, it had a predictable `width` and `height` _because_ it inherited `box-sizing: border-box` from a [reset style](https://piccalil.li/blog/a-modern-css-reset) because the demo authors added a reset style in their stylesheet:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

This CSS rule selects every element in the document and every `::before` and `::after` pseudo element and applies `box-sizing: border-box`. The means that every element will now have this alternative box model.

Because the alternative box model can be more predictable, developers often add this rule to resets and normalisers, like this one.

CSS resets or normalizers are frequently used by developers to help provide a bit more predictability because until you understand how the box model works—which you do now—it can be quite confusing when your boxes are larger than you thought they would be.

## Resources

- [Introduction to the box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [What are browser developer tools?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools)

## User agent stylesheets

- [Chromium](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
- [Firefox](https://searchfox.org/mozilla-central/source/layout/style/res/html.css)
- [Webkit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
