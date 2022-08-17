---
layout: post
title: Отложенная загрузка видео
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-05
description: В этой статье объясняется отложенная загрузка видео и доступные при ней параметры.
tags:
  - performance
feedback:
  - api
---

Аналогично [элементам изображений](/lazy-loading-images) вы можете отложить загрузку видео. Видео обычно загружаются с помощью элемента `<video>` (хотя появился [альтернативный метод с использованием `<img>`](https://calendar.perfplanet.com/2017/animated-gif-without-the-gif/) с ограниченной реализацией). Однако *способ* отложенной загрузки `<video>` зависит от варианта использования. Рассмотрим несколько сценариев, каждый из которых требует собственного решения.

## Видео без автовоспроизведения {: #video-no-autoplay }

Для видео, воспроизведение которых инициируется пользователем (т. е. видео, которые *не* воспроизводятся автоматически), может быть желательно указать [атрибут `preload`](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-preload) в элементе `<video>`:

```html
<video controls preload="none" poster="one-does-not-simply-placeholder.jpg">
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

В приведенном выше примере используется атрибут `preload` со значением `none`, чтобы запретить браузерам предварительно загружать *любые* видеоданные. Атрибут `poster` создает для элемента `<video>` заполнитель, который будет занимать место во время загрузки видео. Причина в том, что поведение по умолчанию для загрузки видео может отличаться в разных браузерах:

- В Chrome значение `preload` по умолчанию было `auto`, но начиная с Chrome 64 теперь по умолчанию используется `metadata`. Даже в этом случае в десктопной версии Chrome часть видео может быть предварительно загружена с помощью заголовка `Content-Range`/ Firefox, Edge и Internet Explorer 11 ведут себя аналогичным образом.
- Как и в случае с Chrome, версии Safari 11.0 для десктопов предварительно загружают ряд видео. Начиная с версии 11.2, предварительно загружаются только метаданные видео. [В Safari на iOS видео никогда не загружаются предварительно](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html#//apple_ref/doc/uid/TP40009523-CH2-SW9).
- Когда включен [режим Data Saver](https://support.google.com/chrome/answer/2392284), значение `preload` по умолчанию равно `none`.

Поскольку поведение браузера по умолчанию в отношении `preload` не является фиксированным, лучшим выходом будет явное указание значения. Когда пользователь инициирует воспроизведение, проще всего отложить загрузку видео на всех платформах, указав `preload="none"`. Атрибут `preload` — не единственный способ отложить загрузку видеоконтента. Статья «[*Быстрое воспроизведение с предварительной загрузкой видео*](/fast-playback-with-preload/)» поможет вам понять принципы работы с воспроизведением видео в JavaScript.

К сожалению, этот пример бесполезен, если вы планируете использовать видео в качестве замены анимированных GIF-файлов. О них будет рассказано далее.

## Видео, заменяющее анимированный GIF {: #video-gif-replacement }

Хотя анимированные GIF-файлы широко используются, они не соответствуют видеоэквивалентам во многих отношениях, особенно по размеру файла. Анимированные GIF-файлы могут занимать несколько мегабайт данных. Видео с похожим визуальным качеством обычно намного меньше.

Использование элемента `<video>` в качестве замены анимированного GIF не так просто, как элемента `<img>`. Анимированные GIF-файлы имеют три характеристики:

1. Они автоматически воспроизводятся при загрузке.
2. Они зацикливаются непрерывно ([хотя и не всегда](https://davidwalsh.name/prevent-gif-loop)).
3. У них нет звуковой дорожки.

Реализация этого с помощью элемента `<video>` выглядит примерно так:

```html
<video autoplay muted loop playsinline>
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

Атрибуты `autoplay`, `muted` и `loop` отвечают соответственно за автовоспроизведение, беззвучный режим и зацикливание. [`playsinline` необходим для автоматического воспроизведения в iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/). Теперь у вас есть исправная замена видео в формате GIF, которая работает на всех платформах. Но как реализовать ее отложенную загрузку? Для начала измените разметку `<video>` соответствующим образом:

```html
<video class="lazy" autoplay muted loop playsinline width="610" height="254" poster="one-does-not-simply.jpg">
  <source data-src="one-does-not-simply.webm" type="video/webm">
  <source data-src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

Вы заметите добавление [атрибута `poster`](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster), позволяющего задать заполнитель, который будет занимать пространство элемента `<video>` до тех пор, пока видео не будет загружено. Как и с [примерами отложенной загрузки `<img>`](/lazy-loading-images/), поместите URL-адрес видео в атрибут `data-src` каждого элемента `<source>`. Затем используйте код JavaScript, аналогичный примерам отложенной загрузки изображений на основе Intersection Observer:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
```

При отложенной загрузке элемента `<video>` необходимо перебрать все дочерние элементы `<source>` и преобразовать их атрибуты `data-src` в `src`. После этого нужно запустить загрузку видео, вызвав метод элемента `load`, после чего мультимедиа начнет воспроизводиться автоматически в соответствии с атрибутом `autoplay`.

Используя этот метод, вы получите видео решение, которое имитирует поведение анимированного GIF, но не требует такого же интенсивного использования данных, как анимированные GIF. Таким образом вы сможете осуществлять отложенную загрузку этого контента.

## Библиотеки для отложенной загрузки {: #libraries }

Следующие библиотеки могут помочь вам с отложенной загрузкой видео:

- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) и [lozad.js](https://github.com/ApoorvSaxena/lozad.js) — сверхлегкие варианты, которые используют только Intersection Observer. Таким образом, они обладают высокой производительностью, но для них необходимо будет применить полизаполнение, прежде чем вы сможете использовать их в старых браузерах.
- [yall.js](https://github.com/malchata/yall.js) — это библиотека, которая использует Intersection Observer и обращается к обработчикам событий. Она совместима с IE11 и основными браузерами.
- Если вам нужна библиотека для отложенной загрузки на React, рассмотрите [response-lazyload](https://github.com/jasonslyvia/react-lazyload). Несмотря на то, что она не использует Intersection Observer, она *предоставляет* уже знакомую методику отложенной загрузки изображений для тех, кто привык к разработке приложений на React.

Каждая из этих библиотек для отложенной загрузки хорошо документирована и содержит множество шаблонов разметки для различных задач, связанных с отложенной загрузкой.
