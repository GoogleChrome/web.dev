---
layout: post
title: Отложенная загрузка изображений
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2022-08-11
description: В этой статье объясняется отложенная загрузка и приводятся доступные варианты ее реализации.
tags:
  - performance
  - images
feedback:
  - api
---

Изображения могут появляться на веб-странице вследствие встраивания в HTML-код с помощью тега `<img>` или как фоновые изображения CSS. В этом статье вы узнаете, как отложить загрузку обоих типов изображений.

## Встроенные изображения {: #images-inline }

Наиболее распространенные кандидаты на отложенную загрузку — это изображения, используемые в элементах `<img>`. Для встроенных изображений имеется три варианта отложенной загрузки, которые можно сочетать между собой для лучшей кроссбраузерной совместимости:

- [Использование отложенной загрузки на уровне браузера](#images-inline-browser-level).
- [Использование Intersection Observer](#images-inline-intersection-observer).

### Использование отложенной загрузки на уровне браузера {: #images-inline-browser-level }

Chrome и Firefox поддерживают отложенную загрузку с атрибутом `loading`. Этот атрибут можно добавить к `<img>`, а также к элементам `<iframe>`. Значение `lazy` указывает браузеру, что нужно немедленно загрузить изображение, если оно находится в области просмотра, и получить другие изображения, когда пользователь при прокрутке страницы приблизится к их расположению.

{% Aside %} Примечание. Атрибут `<iframe loading="lazy">` в настоящее время нестандартизован. Хотя он реализован в Chromium, он еще не имеет спецификации и может быть изменен в будущем. Мы рекомендуем не использовать атрибут `loading` для отложенной загрузки iframe, пока этот атрибут не станет частью спецификации. {% endAside %}

Чтобы узнать о поддержке атрибута браузерами на текущий момент, взгляните на строку `loading` в таблице MDN [«Поддержка браузерами»](https://developer.mozilla.org/docs/Web/HTML/Element/img#Browser_compatibility). Если браузер не поддерживает отложенную загрузку, то атрибут будет проигнорирован, и изображения будут загружаться сразу, как обычно.

Для большинства веб-сайтов добавление этого атрибута к встроенным изображениям повысит производительность и избавит пользователей от загрузки изображений, до которых они никогда не докрутят страницу. Если у вас есть большое количество изображений и вы хотите быть уверены, что пользователи браузеров без поддержки отложенной загрузки смогут воспользоваться ее преимуществами, объедините этот метод с одним из описанных ниже.

Чтобы узнать больше, ознакомьтесь со статьей [«Отложенная загрузка изображений для веб-сайтов на уровне браузера»](/browser-level-image-lazy-loading/).

### Использование Intersection Observer {: #images-inline-intersection-observer }

Чтобы реализовать полизаполнение для отложенной загрузки элементов `<img>`, мы с помощью JavaScript проверяем, находятся ли эти элементы в области просмотра. Если это так, их атрибуты `src` (а иногда и `srcset`) заполняются URL-адресами с нужными изображениями.

Если вы уже писали код с отложенной загрузкой, вы могли воспользоваться обработчиками событий, такими как `scroll` или `resize`. Хотя этот подход имеет наибольшую кроссбарузерную совместимость, современные браузеры предлагают более производительный и эффективный способ проверки видимости элементов с помощью [API Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/).

Intersection Observer легче использовать и читать, чем код, основанный на различных обработчиках событий, потому что вам нужно только зарегистрировать наблюдателя (observer) для наблюдения за элементами, а не писать утомительный код обнаружения видимости элементов. Осталось только решить, что делать, когда элемент виден. Давайте примем следующий базовый шаблон разметки для элементов `<img>` с отложенной загрузкой:

```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="I'm an image!">
```

Вам следует сосредоточить внимание на трех важных составляющих этой разметки:

1. Атрибут `class`, с помощью которого вы будете выбирать элемент в JavaScript.
2. Атрибут `src`, ссылающийся на изображение-заполнитель, которое появится при первой загрузке страницы.
3. Атрибуты `data-src` и `data-srcset`, которые представляют собой атрибуты-заполнители, содержащие URL-адрес изображения, которое будет загружено, когда элемент окажется в области просмотра.

Теперь давайте посмотрим, как использовать Intersection Observer в JavaScript для отложенной загрузки изображений с помощью этого шаблона разметки:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});
```

При обнаружении события `DOMContentLoaded` этот сценарий запрашивает DOM для всех элементов `<img>` с классом `lazy`. Если Intersection Observer доступен, создайте нового наблюдателя, который запускает обратный вызов, когда элементы `img.lazy` входят в область просмотра.

{% Glitch { id: 'lazy-intersection-observer', path: 'index.html', previewSize: 0 } %}

Intersection Observer поддерживается почти всеми современными браузерами. Поэтому использование его в качестве полизаполнения для `loading="lazy"` сделает отложенную загрузку доступной для большинства посетителей.

## Изображения в CSS {: #images-css }

Хотя теги `<img>` являются наиболее распространенным способом размещения изображений на веб-страницах, изображения также можно вызывать с помощью свойства CSS [`background-image`](https://developer.mozilla.org/docs/Web/CSS/background-image) (и других свойств). Отложенная загрузка на уровне браузера не применяется к фоновым изображениям CSS. Если вам нужно использовать отложенную загрузку для фоновых изображений, рассмотрите другие способы.

В отличие от элементов `<img>`, которые загружаются независимо от их видимости, загрузка изображений в CSS выполняется с большим количеством предположений. Когда [объектные модели документа и CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model), а также [дерево рендеринга](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction) уже построены, браузер перед запросом внешних ресурсов проверяет, как CSS-код применяется к документу. Если браузер определяет, что правило CSS, связанное с внешним ресурсом, не применимо к документу в его текущем виде, браузер не запрашивает его.

Это упреждающее поведение можно использовать для отсрочки загрузки изображений в CSS. С помощью JavaScript можно определить, когда элемент находится в области просмотра. Затем нужно применить класс к элементу, который применяет стили, вызывая фоновое изображение. В результате изображение будет загружено в нужный момент, а не при первоначальной загрузке. Например, возьмем элемент, содержащий большое главное фоновое изображение:

```html
<div class="lazy-background">
  <h1>Here's a hero heading to get your attention!</h1>
  <p>Here's hero copy to convince you to buy a thing!</p>
  <a href="/buy-a-thing">Buy a thing!</a>
</div>
```

Элемент `div.lazy-background` обычно содержит главное фоновое изображение, вызываемое CSS-кодом. Однако в этом примере с отложенной загрузкой можно изолировать свойство `background-image` элемента `div.lazy-background` с помощью класса `visible`, добавляемого к элементу, когда он находится в области просмотра:

```css
.lazy-background {
  background-image: url("hero-placeholder.jpg"); /* Placeholder image */
}

.lazy-background.visible {
  background-image: url("hero.jpg"); /* The final image */
}
```

Далее с помощью JavaScript проверьте, находится ли элемент в области просмотра (примените Intersection Observer!), и добавьте класс `visible` к элементу `div.lazy-background`, который загружает изображение:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});
```

{% Glitch { id: 'lazy-background', path: 'index.html', previewSize: 0 } %}

## Библиотеки для отложенной загрузки {: #libraries }

Следующие библиотеки можно использовать для отложенной загрузки изображений.

- [lazysizes](https://github.com/aFarkas/lazysizes) — это полнофункциональная библиотека отложенной загрузки изображений и iframe. Шаблон библиотеки похож на примеры кода, показанные в статье. Дело в том, что шаблон автоматически привязывается к классу `lazyload` в элементах `<img>`, и требует, чтобы вы указали URL-адреса изображений в атрибутах `data-src` и/или `data-srcset`, содержимое которых подменяется в атрибутах `src` и/или `srcset` соответственно. Шаблон использует Intersection Observer, для которого можно применить полизаполнение. Кроме того, шаблон можно расширить [множеством плагинов](https://github.com/aFarkas/lazysizes#available-plugins-in-this-repo), например, для отложенной загрузки видео. [Узнайте больше об использовании lazysizes](/use-lazysizes-to-lazyload-images/).
- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) — это упрощенный вариант библиотеки для отложенной загрузки изображений, фоновых изображений, видео, востренных фреймов и скриптов. Библиотека использует Intersection Observer, поддерживает адаптивные изображения и обеспечивает отложенную загрузку на уровне браузера.
- [lozad.js](https://github.com/ApoorvSaxena/lozad.js) — еще один упрощенный вариант библиотеки, которая использует только Intersection Observer. Таким образом, она очень эффективна, но ее необходимо сочетать с полизаполнениями, чтобы применять в старых версиях браузеров.
- Если вам нужна библиотека для отложенной загрузки на React, подумайте о [response-lazyload](https://github.com/jasonslyvia/react-lazyload). Несмотря на то, что она не использует Intersection Observer, она *предоставляет* уже знакомый метод отложенной загрузки изображений для тех, кто привык к разработке приложений на React.
