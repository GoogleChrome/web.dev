---
title: 'ResizeObserver: аналог document.onresize для элементов'
subhead: ResizeObserver позволяет узнать, когда изменяется размер элемента.
authors:
  - surma
  - joemedley
date: 2016-10-07
updated: 2020-05-26
hero: image/admin/WJ69aw9UMPwsc7ShYvif.jpg
alt: Растения, растущие в коробках.
description: ResizeObserver уведомляет об изменении размера прямоугольной области с содержимым элемента, чтобы можно было отреагировать соответствующим образом.
tags:
  - blog
  - dom
  - javascript
  - layout
  - rendering
feedback:
  - api
---

До появления `ResizeObserver` вам приходилось прикреплять прослушиватель к событию документа `resize`, чтобы получать уведомления обо всех изменениях размеров области просмотра. Затем нужно было понять, какие элементы были затронуты этим изменением, и вызвать конкретную подпрограмму в обработчике событий, чтобы отреагировать соответствующим образом. Если вам требовались новые размеры элемента после изменения размера, нужно было вызвать `getBoundingClientRect()` или `getComputedStyle()`, что могло вызвать сбой макета, если не позаботиться о пакетной обработке *всех* чтений и *всех* записей.

И все это не предусматривало случаи, когда меняется размер элементов без изменения размера главного окна. Например, добавление новых дочерних элементов, установка стиля элемента `display` в значение `none` или аналогичные действия могут изменить размер элемента, его предков или элементов одного с ним уровня.

Поэтому `ResizeObserver` — полезный примитив. Он реагирует на изменение размера любого из наблюдаемых элементов, независимо от того, что вызвало это изменение. Он также обеспечивает доступ к новому размеру наблюдаемых элементов.

## API

У всех API с суффиксом `Observer`, упомянутых выше, простой дизайн интерфейса. `ResizeObserver` — не исключение. Вы создаете объект `ResizeObserver` и передаете обратный вызов конструктору. Обратному вызову передается массив объектов `ResizeObserverEntry` — по одной записи на каждый наблюдаемый элемент — который содержит новые размеры элемента.

```js
var ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cr = entry.contentRect;
    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  }
});

// Наблюдаем один или несколько элементов
ro.observe(someElement);
```

## Некоторые подробности

### О чем сообщается?

Как правило, [`ResizeObserverEntry`](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry) сообщает о блоке содержимого элемента через свойство с именем `contentRect`, которое возвращает объект [`DOMRectReadOnly`](https://developer.mozilla.org/docs/Web/API/DOMRectReadOnly). Блок содержимого — это область внутри рамки с учетом внутреннего отступа.

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKxpe8LNq2CMPFdtLtVK.png", alt="Схема блочной модели CSS.", width="727", height="562" %}</figure>

Важно отметить, что, хотя `ResizeObserver` *сообщает* и размеры `contentRect`, и внутренние отступы, он *наблюдает* только `contentRect`. *Не путайте* `contentRect` с ограничивающей рамкой элемента. Ограничивающая рамка, как сообщает `getBoundingClientRect()`, представляет собой прямоугольник, который содержит весь элемент и его потомков. SVG являются исключением из правила, где `ResizeObserver` сообщает размеры ограничивающей рамки.

Начиная с Chrome 84, `ResizeObserverEntry` имеет три новых свойства для предоставления более подробной информации. Каждое из этих свойств возвращает объект `ResizeObserverSize`, содержащий свойства `blockSize` и `inlineSize`. Эта информация касается наблюдаемого элемента во время обратного вызова.

- `borderBoxSize`
- `contentBoxSize`
- `devicePixelContentBoxSize`

Все эти элементы возвращают массивы только для чтения, так как в будущем ожидается, что они смогут поддерживать элементы, имеющие несколько фрагментов, что встречается в сценариях с несколькими столбцами. На данный момент эти массивы будут содержать только один элемент.

Поддержка этих свойств платформой ограничена, но [Firefox уже поддерживает](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry#Browser_compatibility) первые два.

### Когда об этом сообщается?

В спецификации указано, что `ResizeObserver` должен обрабатывать все события изменения размера после макетирования и до отрисовки. Благодаря этому обратный вызов `ResizeObserver` становится идеальным местом для внесения изменений в макет вашей страницы. Поскольку обработка `ResizeObserver` происходит между макетированием и отрисовкой, такой подход аннулирует только макет, но не отрисовку.

### Подводные камни

Вы можете задаться вопросом: что произойдет, если изменить размер наблюдаемого элемента внутри обратного вызова `ResizeObserver`? Ответ такой — сразу же будет инициирован еще один обратный вызов. К счастью, в `ResizeObserver` есть механизм, позволяющий избежать бесконечных циклов обратного вызова и циклических зависимостей. Изменения будут обрабатываться в том же кадре только в том случае, если измененный элемент находится глубже в дереве DOM, чем *наименее глубоко расположенный* элемент, обработанный в предыдущем обратном вызове. В противном случае они будут отложены до следующего кадра.

## Применение

`ResizeObserver` позволяет реализовывать поэлементные медиазапросы. Наблюдая за элементами, вы можете императивно определять контрольные точки своего дизайна и изменять стили элемента. В следующем [примере](https://googlechrome.github.io/samples/resizeobserver/) второй блок изменит радиус границы в соответствии с его шириной.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_vp8.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_x264.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.style.borderRadius =
        Math.max(0, 250 - entry.contentRect.width) + 'px';
  }
});
// Наблюдаем только второй блок
ro.observe(document.querySelector('.box:nth-child(2)'));
```

Еще один интересный пример — окно чата. Проблема, которая возникает в типичном макете беседы, пролистываемой сверху вниз, заключается в расположении прокрутки. Чтобы не вводить пользователя в заблуждение, полезно оставлять окно остается в нижней части беседы, где появляются новые сообщения. Кроме того, любое изменение макета (представьте, что телефон переходит с альбомной ориентации на портретную или наоборот) должно приводить к тому же результату.

`ResizeObserver` позволяет написать *единственный* фрагмент кода, который обработает *оба* сценария. Изменение размера окна — это событие, которое `ResizeObserver` может захватить по определению, но вызов `appendChild()` также изменяет размер этого элемента (если не установлено `overflow: hidden`), потому что ему нужно освободить место для новых элементов. Учитывая это, для достижения желаемого эффекта потребуется всего несколько строк:

<figure class="w-figure">
 <video controls autoplay loop muted class="w-screenshot">
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_vp8.webm" type="video/webm; codecs=vp8">
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_x264.mp4" type="video/mp4; codecs=h264">
 </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  document.scrollingElement.scrollTop =
    document.scrollingElement.scrollHeight;
});

// Наблюдаем scrollingElement при изменении размеров окна
ro.observe(document.scrollingElement);
// Наблюдаем хронологию для обработки новых сообщений
ro.observe(timeline);
```

Лаконично, не правда ли?

Далее можно добавить дополнительный код для обработки случая, когда пользователь прокручивает окно вручную и хочет оставить фокус на *этом* сообщении, когда придет новое.

Еще один вариант использования — любой настраиваемый элемент, имеющий собственный макет. До `ResizeObserver` не было надежного способа получать уведомления об изменении его размеров, чтобы его дочерние элементы могли быть снова размещены.

## Вывод

`ResizeObserver` доступен в [большинстве основных браузеров](https://developer.mozilla.org/docs/Web/API/ResizeObserver#Browser_compatibility). В некоторых из них такая возможность появилась совсем недавно. Доступно [несколько вариантов полизаполнения](https://github.com/WICG/ResizeObserver/issues/3), но полностью дублировать функциональность `ResizeObserver` невозможно. Текущие реализации полагаются либо на периодическое обновление, либо на добавление контрольных элементов в DOM. Применение первого подхода будет разряжать батарею мобильного телефона, загружая ЦП, а использование второго модифицирует DOM и может испортить стили и другой DOM-зависимый код.

Фото [Маркуса Списке](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) c [Unsplash](https://unsplash.com/s/photos/observe-growth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).
