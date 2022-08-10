---
layout: post
title: Элементам формы не сопоставлены ярлыки (Form elements do not have associated labels)
description: |2-

  Как сделать элементы формы удобными для пользователей технологий специальных возможностей

  с помощью указания ярлыков
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - label
---

Благодаря ярлыкам элементы управления на форме должным образом объявляются технологиями специальных возможностей (например, программами чтения с экрана). Пользователи специальных возможностей с помощью этих ярлыков перемещаются по элементам формы. Они полезны и при использовании мыши и сенсорных экранов: текст ярлыка увеличивает цель для нажатия.

## Когда этот аудит Lighthouse считается непройденным

Lighthouse помечает элементы формы, которым не сопоставлены ярлыки:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMWt5UyiUUskhKHUcYoN.png", alt="Аудит Lighthouse «Элементам формы не сопоставлены ярлыки» (Form elements do not have associated labels)", width="800", height="185" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Добавление ярлыков к элементам формы

Связать ярлык с элементом формы можно двумя способами. Во-первых, можно поместить элемент ввода в элемент ярлыка:

```html
<label>
  Получать рекламные предложения?
  <input type="checkbox">
</label>
```

Во-вторых, можно использовать атрибут ярлыка `for` и обратиться к идентификатору элемента:

```html
<input id="promo" type="checkbox">
<label for="promo">Получать рекламные предложения?</label>
```

Если надлежащим образом назначать флажкам ярлыки, то функции специальных возможностей сообщат, что у элемента роль флажка, он отмечен и называется «Получать рекламные предложения?» См. также [Ярлыки для элементов формы](/labels-and-text-alternatives#label-form-elements).

## Материалы

- [Исходный код аудита **Элементам формы не сопоставлены ярлыки** (Form elements do not have associated labels)](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/label.js).
- [У элементов `<input>` форм должны быть ярлыки (Deque University)](https://dequeuniversity.com/rules/axe/3.3/label).
