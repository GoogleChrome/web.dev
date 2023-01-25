---
title: Использование HTML5 Drag and Drop API
authors:
  - ericbidelman
  - rachelandrew
date: 2010-09-30
updated: 2021-08-30
description: "\nHTML5 Drag and Drop API (DnD) дает возможность сделать перетаскиваемым \nпрактически любой элемент на нашей странице. В этом посте мы объясним\nосновы перетаскивания."
tags:
  - blog
  - html
  - javascript
  - file-system
---

HTML5 Drag and Drop API (DnD) дает возможность сделать перетаскиваемым практически любой элемент на нашей странице. В этом посте мы объясним основы перетаскивания.

## Создание перетаскиваемого содержимого

Стоит отметить, что в большинстве браузеров выделенный текст, изображения и ссылки по умолчанию перетаскиваются. Например, если вы перетащите логотип Google [в поиске Google](https://google.com), вы увидите фантомное изображение. Это изображение можно поместить в адресную строку, в элемент `<input type="file" />` или даже на рабочий стол. Чтобы сделать перетаскиваемыми другие типы контента, необходимо использовать API-интерфейсы HTML5 DnD.

Чтобы сделать объект перетаскиваемым, установите для этого элемента `draggable=true`. Перетаскивание можно включить практически для чего угодно: изображений, файлов, ссылок или любой разметки на вашей странице.

В нашем примере мы создаем интерфейс для перестановки некоторых столбцов, размещенных с помощью CSS Grid. Базовая разметка для моих столбцов выглядит так: для каждого столбца атрибут `draggable` установлен в значение `true`.

```html
<div class="container">
  <div draggable="true" class="box">A</div>
  <div draggable="true" class="box">B</div>
  <div draggable="true" class="box">C</div>
</div>
```

Вот CSS для моих элементов container и box. Обратите внимание, что из всего CSS функциональности перетаскивания касается только свойство [`cursor: move`](https://developer.mozilla.org/docs/Web/CSS/cursor). Остальная часть кода просто управляет компоновкой и стилем элементов container и box.

```css/11
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.box {
  border: 3px solid #666;
  background-color: #ddd;
  border-radius: .5em;
  padding: 10px;
  cursor: move;
}
```

На этом этапе вы обнаружите, что можете перетаскивать элементы, но больше ничего не произойдет. Чтобы добавить функциональность опускания, придется использовать JavaScript API.

## Прослушивание перетаскивания событий

Существует ряд различных событий, к которым можно присоединиться для отслеживания всего процесса перетаскивания.

- [`dragstart`](https://developer.mozilla.org/docs/Web/API/Document/dragstart_event)
- [`drag`](https://developer.mozilla.org/docs/Web/API/Document/drag_event)
- [`dragenter`](https://developer.mozilla.org/docs/Web/API/Document/dragenter_event)
- [`dragleave`](https://developer.mozilla.org/docs/Web/API/Document/dragleave_event)
- [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event)
- [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)
- [`dragend`](https://developer.mozilla.org/docs/Web/API/Document/dragend_event)

Чтобы обрабатывать поток операции перетаскивания, нужен какой-то исходный элемент (откуда начинается перетаскивание), полезные данные (то, что вы пытаетесь перетащить) и цель (область, которая принимает перетаскиваемые данные). Исходный элемент может быть изображением, списком, ссылкой, файловым объектом, блоком HTML и т. д. Целью является зона буксировки (или набор зон буксировки), принимающая данные, которые пользователь в нее опускает. Имейте в виду, что не все элементы могут быть целями, например, изображение целью быть не может.

## Начало и завершение последовательности перетаскивания

После того, как вы определите атрибуты `draggable="true"` для своего контента, прикрепите обработчик событий `dragstart`, чтобы запустить последовательность перетаскивания для каждого столбца.

Этот код установит непрозрачность столбца на 40%, когда пользователь начнет его перетаскивать, а затем вернет ее на 100%, когда событие перетаскивания закончится.

```js
function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
```

Результат можно увидеть в демонстрации Glitch ниже. Перетащите элемент, и он станет непрозрачным. Поскольку целью события `dragstart` является исходный элемент, установка `this.style.opacity` на 40% визуально сообщает пользователю, что элемент является текущим перемещаемым выделением. Хотя функция опускания здесь отсутствует, если опустить элемент, исходный элемент вернется к 100% непрозрачности.

{% Glitch { id: 'simple-drag-and-drop-1', path: 'style.css' } %}

## Добавляем дополнительные визуальные подсказки с помощью `dragenter`, `dragover` и `dragleave`

Чтобы пользователь мог понять, как взаимодействовать с вашим интерфейсом, используйте обработчики событий `dragenter`, `dragover` и `dragleave`. В этом примере столбцы не только перетаскиваются, но и являются целями перетаскивания. Дайте пользователю это понять, сделав границу пунктирной, когда он удерживает перетаскиваемый элемент над столбцом. Например, вы можете создать класс `over` в своем CSS для представления элементов, которые являются целями перетаскивания:

```css
.box.over {
  border: 3px dotted #666;
}
```

Затем настройте обработчики событий в своем JavaScript, добавьте класс `over`, когда столбец перетаскивается, и удалите его по окончании. В обработчике `dragend` также уберем классы в конце перетаскивания.

```js/9-11,14-28,34-36
document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
});
```

{% Glitch { id: 'simple-drag-drop2', path: 'dnd.js' } %}

В этом коде есть пара моментов, на которые стоит обратить внимание:

- При перетаскивании ссылок или похожих объектов необходимо предотвратить поведение браузера по умолчанию, которое заключается в переходе по ссылке. Для этого вызовите `e.preventDefault()` в событии `dragover`. Также рекомендуется вернуть `false` в том же обработчике.
- Обработчик события `dragenter` используется для переключения класса `over` вместо `dragover`. Если использовать `dragover`, класс CSS будет переключаться постоянно, поскольку событие `dragover` продолжает срабатывать при наведении курсора на столбец. В итоге это заставит модуль визуализации браузера выполнять большой объем ненужной работы. Всегда имеет смысл сводить перерисовки к минимуму. Если для каких-то целей вам нужно использовать событие `dragover`, стоит [регулировать или отключать прослушиватель событий](https://css-tricks.com/debouncing-throttling-explained-examples/).

## Завершение опускания

Чтобы обработать фактическое опускание, добавьте прослушиватель для события `drop`. В обработчике `drop` нужно предотвратить поведение браузера по умолчанию для опускания, которое обычно заключается во всяких надоедливых перенаправлениях. Предотвратить всплытие события в DOM можно с помощью вызова `e.stopPropagation()`.

```js
function handleDrop(e) {
  e.stopPropagation(); // препятствует перенаправлению в браузере.
  return false;
}
```

Обязательно зарегистрируйте новый обработчик среди других обработчиков:

```js/7-7
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
```

Если запустить код на этом этапе, элемент не переместится в новое место. Для этого понадобится использовать объект [`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer).

Все чудеса процесса перетаскивания заключены в свойстве `dataTransfer`. Оно содержит фрагмент данных, отправленный при перетаскивании. `dataTransfer` задается в событии `dragstart`, а читается и обрабатывается в событии опускания. Вызов `e.dataTransfer.setData(mimeType, dataPayload)` позволяет установить MIME-тип и полезные данные для объекта.

В этом примере мы позволим пользователям изменять порядок столбцов. Для этого сначала нужно сохранить HTML-код исходного элемента при запуске перетаскивания:

  <figure>
    <video controls autoplay loop muted>
      <source src="https://storage.googleapis.com/web-dev-assets/drag-and-drop/webdev-dnd.mp4" type="video/mp4">
    </source></video>
  </figure>

```js/3-6
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
```

В `drop` вы обрабатываете опускание столбца, присваивая HTML-коду исходного столбца HTML целевого столбца, при этом сначала проверяя, не опускает ли пользователь столбец на то же место, из которого он был перетащен.

```js/5-8
function handleDrop(e) {
  e.stopPropagation();

  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}
```

Результат можно увидеть в следующей демонстрации. Перетащите и отпустите столбец A поверх столбца B, и обратите внимание, как они поменяются местами:

{% Glitch { id: 'simple-drag-drop', path: 'dnd.js' } %}

## Дополнительные свойства перетаскивания

Объект `dataTransfer` предоставляет свойства для обеспечения визуального отклика пользователю в процессе перетаскивания. Эти свойства также можно использовать для управления тем, как цели перетаскивания будут реагировать на определенные типы данных.

- [`dataTransfer.effectAllowed`](https://developer.mozilla.org/docs/Web/API/DataTransfer/effectAllowed) ограничивает «тип перетаскивания», которое пользователь может выполнять с элементом. Это свойство используется в модели обработки перетаскивания для инициализации `dropEffect` во время событий `dragenter` и `dragover`. Свойству можно задать следующие значения: `none`, `copy`, `copyLink`, `copyMove`, `link`, `linkMove`, `move`, `all` и `uninitialized`.
- [`dataTransfer.dropEffect`](https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect) управляет откликом, который получает пользователь во время событий `dragenter` и `dragover`. Когда пользователь наводит курсор на целевой элемент, курсор браузера указывает, какой тип операции будет выполняться (например, копирование, перемещение и т. д.). Свойство может принимать одно из следующих значений: `none`, `copy`, `link` и `move`.
- [`e.dataTransfer.setDragImage(imgElement, x, y)`](https://developer.mozilla.org/docs/Web/API/DataTransfer/setDragImage) означает, что вместо использования отклика браузера по умолчанию в виде фантомного изображения вы можете дополнительно установить значок перетаскивания.

## Загрузка файла с помощью перетаскивания

В этом простом примере столбец используется как в качестве источника, так и цели перетаскивания. Это можно увидеть в пользовательском интерфейсе, где пользователя просят переставить элементы. В некоторых ситуациях цель и источник перетаскивания могут быть разными, например, интерфейс, в котором пользователю нужно выбрать одно изображение для продукта в качестве основного, перетащив выбранное изображение на цель.

Перетаскивание часто используется, чтобы позволить пользователям перетаскивать элементы со своего рабочего стола в приложение. Основное отличие заключается в обработчике `drop`. Для доступа к файлам не будет применяться `dataTransfer.getData()` — вместо этого данные будут содержаться в свойстве `dataTransfer.files`:

```js
function handleDrop(e) {
  e.stopPropagation(); // Препятствует перенаправлению в некоторых браузерах.
  e.preventDefault();

  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    // Читаем объекты File в этом FileList.
  }
}
```

Дополнительную информацию об этом можно найти в разделе [«Пользовательское перетаскивание»](/read-files/#select-dnd).

## Дополнительные ресурсы

- [Спецификация перетаскивания](https://html.spec.whatwg.org/multipage/dnd.html#dnd)
- [HTML Drag and Drop API в MDN](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
- [Как написать загрузчик файлов перетаскиванием, используя базовый JavaScript](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/)
- [Создание игры «Парковка» с помощью HTML Drag and Drop API](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
- [Как использовать HTML Drag and Drop API в React](https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/)
