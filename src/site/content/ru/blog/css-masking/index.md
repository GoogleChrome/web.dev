---
title: Применение эффектов к изображениям с помощью CSS-свойства «mask-image»
subhead: |2-

  CSS-маски позволяют использовать изображение в качестве слоя маски.
  Например, можно использовать изображение, SVG или градиент в качестве маски
  и создать интересный эффект без графического редактора.
description: |2-

  CSS-маски позволяют использовать изображение в качестве слоя маски.
  Например, можно использовать изображение, SVG или градиент в качестве маски
  и создать интересный эффект без графического редактора.
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/uNWkHLVFNcTDk09OplrA.jpg
alt: A teddy bear wearing a facemask.
tags:
  - blog
  - css
feedback:
  - api
---

Если [обрезать элемент](/css-clipping) с помощью свойства `clip-path`, то обрезанная область становится невидимой. Чтобы сделать часть изображения непрозрачной или применить к ней другой эффект, нужно использовать маску. В этой статье рассказывается, как использовать свойство [`mask-image`](https://developer.mozilla.org/docs/Web/CSS/mask-image) в CSS и указать изображение в качестве слоя маски. Есть три варианта: в качестве маски можно использовать файл изображения, SVG или градиент.

## Совместимость с браузерами

Большинство браузеров поддерживают стандартное свойство CSS-маски лишь частично. Для наилучшей совместимости в дополнение к стандартному свойству нужно использовать префикс `-webkit-`. Подробнее о поддержке в браузерах см. страницу [Can I use о CSS-масках](https://caniuse.com/#feat=css-masks).

Поддержка в браузере с использованием префиксного свойства — это, конечно, хорошо, но при использовании маски для показа текста поверх изображения нужно будет позаботиться о случае, если маскирование окажется недоступно. Прежде чем добавлять версию изображения с маской, стоить сделать запросы функций, которые укажут на поддержку `mask-image` или `-webkit-mask-image`, и дать читаемую альтернативу на случай, если маски не поддерживаются.

```css
@supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
  /* Код, требующий mask-image. */
}
```

## Маска с использованием изображения

Свойство `mask-image` работает аналогично `background-image`: для передачи изображения нужно использовать `url()`. На изображении для маски должна быть прозрачная или полупрозрачная область.

Фрагмент исходного изображения под прозрачной областью будет невидим, под полупрозрачной будет видим частично. Разницу можно увидеть во фрагменте на Glitch ниже. Первое фото воздушных шаров — это исходное изображение без маски. Ко второму фото применена маска с белой звездой на полностью прозрачном фоне. Маска на третьем изображении — белая звезда на фоне с градиентом прозрачности.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image?path=index.html&amp;previewSize=100" title="mask-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

В этом примере я также использую свойство `mask-size` со значением `cover`, которое работает так же, как [`background-size`](https://developer.mozilla.org/docs/Web/CSS/background-size). Вы можете использовать ключевые слова `cover` и `contain` или указать размер фона в единицах длины или в виде процентного значения.

Кроме того, маску, как и фоновое изображение, можно повторять: так из маленькой картинки можно сделать повторяющийся узор.

## Маска с использованием SVG

В качестве маски можно использовать SVG. Здесь есть несколько вариантов. Во-первых, можно вставить элемент `<mask>` в SVG и указать его идентификатор в свойстве `mask-image`.

```html
<svg width="0" height="0" viewBox="0 0 400 300">
  <defs>
    <mask id="mask">
      <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
      <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
      <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
    </mask>
  </defs>
</svg>

<div class="container">
    <img src="balloons.jpg" alt="Воздушные шары">
</div>
```

```css
.container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  -webkit-mask-image: url(#mask);
  mask-image: url(#mask);
}
```

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3HnPhISiVazDTwezxfcy.jpg", alt="Пример использования маски SVG", width="699", height="490" %}</figure>

Здесь преимущество в том, что маску можно применить к любому элементу HTML, а не только к изображению. К сожалению, такой подход поддерживается только в Firefox.

Однако не всё потеряно: чаще всего нужно применить маску именно к изображению, и в этом случае мы можем включить изображение в SVG.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image-svg-image?path=README.md&amp;previewSize=100" title="mask-image-svg-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Маска с использованием градиента

Использование CSS-градиента в качестве маски — это элегантный способ получить замаскированную область, не создавая специальное изображение или SVG.

Используя простой линейный градиент в качестве маски, можно сделать так, чтобы нижняя часть изображения была не слишком тёмной (например, если на ней находится подпись).

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-linear-gradient?path=README.md&amp;previewSize=100" title="mask-linear-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Использовать можно любой из поддерживаемых типов градиента — есть где развернуться! В следующем примере с помощью радиального градиента формируется круглая маска для выделения подписи.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-radial-gradient?path=README.md&amp;previewSize=100" title="mask-radial-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Использование нескольких масок

Как и в случае с фоновыми изображениями, для достижения желаемого эффекта можно указать несколько источников макси. Особенно это удобно, если в качестве маски нужно использовать узор, созданный CSS-градиентами. Обычно в них используется несколько фоновых изображений, поэтому из них можно легко сделать маску.

В качестве примера — красивый узор в виде шахматной доски из [этой статьи](https://cssgradient.io/blog/gradient-patterns/). Код с фоновыми изображениями выглядит так:

```css
background-image:
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size:20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Чтобы превратить этот (и любой другой узор для фона) в маску, нужно заменить свойства `background-*` соответствующими свойствами `mask`, включая те, что с префиксом `-webkit`.

```css
-webkit-mask-image:
  linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
  linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
-webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Используя градиентные узоры на изображениях, можно получить классные эффекты — попробуйте переделать этот код и посмотрите, что получится.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-checkers?path=README.md&amp;previewSize=100" title="mask-checkers on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

CSS-маски позволяют сделать изображения и другие элементы HTML более интересными, не используя графический редактор.

*<span>Автор фото — <a href="https://unsplash.com/@juliorionaldo">Хулио Риональдо</a>, платформа Unsplash</span>.*
