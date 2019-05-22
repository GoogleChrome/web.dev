---
layout: codelab
title: "Macro Layout v2 (refactor): Intrinsic Grids"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-macro-v2
path: app/css/layouts/body.css
previewSize: 70
related_post: intrinsic-layout-macro
---

In this refactor I want to try and reduce our selector specificity, reduce the amount of code in media queries, and move away from defining explicit boxes.

In case you missed Macro Layout v1, ramp up here:
<a class="w-button w-button--primary w-button--with-icon" data-icon="code" href="/codelab-intrinsic-layout-macro-v1">
  Codelab: A Slotted Layout
</a>

<br>

#### Let's break it down
## 1. `<body>` Layout
Our **most macro grid** is placed on the body. It's **creating directionality** for the highest level elements (`<nav>`, `<header>`, `<main>`, etc) and the **spacing between** them. This grid is minimal and doesn't know anything about what it's laying out except that there should be some healthy space applied via gap.

{% Aside 'gotchas' %}
  The Glitch on the right is editable but you need to click "remix" first
{% endAside %}

<br>

#### The CSS
```css
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;
}
```
#### Grid in Plain Speak:
I want a **grid** of **rows** with a **2rem gap**

<figure style="text-align:center; margin: 2rem 0;">
  <img src="macro – body rows.png" alt="Showing simplified grid of only rows" class="screenshot">
</figure>

No magic is that grid, in fact, we practically don't even need the grid here! They're laying out like block level elements naturally do, or would, without grid, BUT, we get gap, and I like gap.


## Macro intrinsic layout pros 👍
1. Just rows
1. Just gaps
1. Add more elements and layout continues to work great
1. Respectful rows that don't enforce a height
1. Fallback is straight forward
1. **Just flow and spacing**

## Macro intrinsic layout cons 👎
1. **No more rails** (not really a con, but doesn't match the mental model my design brain had)
1. **Dinky**, it's barely doing anything (this a con? lol, perhaps to some?)




<br><br><br>

#### Let's break it down
## 2. `<main>` Layout

We've spaced our big elements vertically, now we have **1 more large macro layout to create**. In our first version we had rails with placed elements, **I'd like to not place elements this time**.

**CSS**
```css
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
}
```
#### Grid in Plain Speak:
I want a **grid** with **2 columns**, the **first at a fixed width** and the **2nd filling** the remaining space.

Instead of rails we **use margin** 🤯 and then just have **2 columns**:

<figure style="text-align:center; margin: 2rem 0;">
  <img src="macro – main.png" alt="Main grid simplified to 2 columns" class="screenshot">
</figure>

## Pros 👍
1. **Cut** the amount of **columns** to manage **in half**
1. **Cut** down the **complexity**
1. **Cut** the **LoC** down to 3
1. Media queries need to **know much less**

## Cons
1. No more rails (I dont know why, but I liked them, and they're gone lol)

<br>

## Responsive Final Touches
Our tasks at a high level are to remove the heavy left margin and stack our aside and articles in our mobile layout.

I prefer parent containers holding as much spacing logic as possible, so our first order of business is approach this [mobile first](https://www.lukew.com/ff/entry.asp?933), and only have left margin when we're not mobile. AKA, only when we're at a tablet or above viewport should there be a left margin:

```css/9-13
body {
  display: grid;
  gap: 2rem;
  grid-auto-flow: row;

  & > .greeting {
    margin: 0 1rem;
  }

  @media (width > 768px) {
    & > :matches(.greeting, main) {
      margin-left: var(--body-rails);
    }
  }
}
```

#### CSS in plain speak:
When the viewport is greater than 768px, then select any direct descendants of the `body` that match `.greeting` or `main` and give them some left margin.

<br>

```css/4-6
main {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;

  @media (width <= 768px) {
    display: contents;
  }
}
```

#### CSS in plain speak:
When the viewport is less than or equal to 768px, act as if the `main` tag didn't exist. This has the effect of hoisting the aside and article up to the body, therefore inheriting the grid styles we placed there, which is just rows and gaps. We piggy back onto the intrinsic and unassuming grid that's managing the spacing of our top most layout. Kinda neat!

<br>

#### Incoming Chaos!!
Ready to write some code and **simulate some chaos?** Incoming change from the design team:

{% Aside 'objective' %}
  Remix the codelab to the right and uncomment the `<footer>` in `app/index.html`. Finish / author new CSS in `app/css/layouts/body.css` to put the `<footer>` into the proper place in the grid.

  Compare this with the work needed in Macro Layout v1.
{% endAside %}

<br>

## Conclusion
why was this refactor better? how did the footer prove anything?
