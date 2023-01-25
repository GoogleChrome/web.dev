---
title: Доступ к буферу обмена без блокировки
subhead: Безопасный доступ к буферу обмена для текста и изображений без блокировки страницы
authors:
  - developit
  - thomassteiner
description: Async Clipboard API упрощает копирование и вставку, рассчитанные на получение разрешения.
date: 2020-07-31
updated: 2021-07-29
tags:
  - blog
  - capabilities
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: Буфер обмена со списком покупок
feedback:
  - api
---

В последние годы для взаимодействия с буфером обмена в браузерах использовался метод [`document.execCommand()`](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands). Несмотря на широкую поддержку, цена этого метода вырезания и вставки была высока: доступ к буферу обмена был синхронным и позволял только чтение и запись в DOM.

Это нормально для небольших фрагментов текста, но во многих случаях блокировка страницы для передачи из буфера обмена неэффективна. Прежде чем содержимое можно будет безопасно вставить, может потребоваться длительная очистка или декодирование изображения. Браузеру может потребоваться загрузить или встроить связанные ресурсы из вставленного документа. Это заблокирует страницу во время ожидания диска или сети. Представьте себе добавление разрешений к комбинации, требующей, чтобы браузер блокировал страницу при запросе доступа к буферу обмена. В то же время разрешения, установленные для `document.execCommand()` для взаимодействия с буфером обмена, определены слабо и различаются в зависимости от браузера.

[Async Clipboard API](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api) решает эти проблемы, предоставляя четко определенную модель разрешений, которая не блокирует страницу. Safari недавно объявил о его [поддержке в версии 13.1](https://webkit.org/blog/10855/). При этом основные браузеры имеют базовый уровень поддержки. На момент написания этой статьи Firefox поддерживает только текст, а в некоторых браузерах поддержка изображений ограничена PNG. Если вы собираетесь использовать API, [обратитесь к таблице поддержки браузеров](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility), прежде чем продолжить.

{% Aside %} Async Clipboard API ограничен обработкой текста и изображений. Chrome 84 вводит экспериментальную функцию, которая позволяет буферу обмена обрабатывать данные произвольного типа. {% endAside %}

## Копирование: запись данных в буфер обмена

### writeText ()

Чтобы скопировать текст в буфер обмена, вызовите `writeText()`. Поскольку этот API является асинхронным, функция `writeText()` возвращает обещание, которое разрешается или отклоняется в зависимости от того, успешно ли скопирован переданный текст:

```js
async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('URL страницы скопирован в буфер обмена');
  } catch (err) {
    console.error('Не удалось скопировать: ', err);
  }
}
```

### write()

На самом деле `writeText()` — это просто удобный вариант универсального метода `write()`, который также позволяет копировать изображения в буфер обмена. Как и `writeText()`, он асинхронный и возвращает обещание.

Чтобы записать изображение в буфер обмена, вам понадобится передать его в виде [`blob`](https://developer.mozilla.org/docs/Web/API/blob). Один из способов это сделать — запросить изображение с сервера с помощью `fetch()`, а затем вызвать [`blob()`](https://developer.mozilla.org/docs/Web/API/Body/blob) в ответе.

Запрос изображения с сервера может быть нежелательным или невозможным по ряду причин. К счастью, вы также можете перенести изображение на элемент canvas и вызвать его метод [`toBlob()`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob).

Затем передайте массив объектов `ClipboardItem` в качестве параметра методу `write()`. На данный момент вы можете передавать только одно изображение за раз, но в будущем мы надеемся добавить поддержку нескольких изображений. `ClipboardItem` принимает объект с MIME-типом изображения в качестве ключа и большого двоичного объекта в качестве значения. Для объектов Blob, полученных из `fetch()` или `canvas.toBlob()`, свойство `blob.type` автоматически определяет верный MIME-тип изображения.

```js
try {
  const imgURL = '/images/generic/file.png';
  const data = await fetch(imgURL);
  const blob = await data.blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
  console.log('Изображение скопировано.');
} catch (err) {
  console.error(err.name, err.message);
}
```

{% Aside 'warning' %} Safari (WebKit) обрабатывает активацию пользователя иначе, чем Chromium (Blink) (см. [ошибку WebKit №222262](https://bugs.webkit.org/show_bug.cgi?id=222262)). Для Safari нужно выполнить все асинхронные операции в обещании, результат которого вы присваиваете `ClipboardItem`:

```js
new ClipboardItem({
  'foo/bar': new Promise(async (resolve) => {
      // Prepare `blobValue` of type `foo/bar`
      resolve(new Blob([blobValue], { type: 'foo/bar' }));
    }),
  })
```

{% endAside %}

### Событие копирования

В случае, когда пользователь инициирует копирование в буфер обмена, нетекстовые данные предоставляются в виде Blob-объекта. Событие [`copy`](https://developer.mozilla.org/docs/Web/API/Document/copy_event) включает свойство `clipboardData` с элементами уже в правильном формате, поэтому создавать Blob вручную не нужно. Вызовите `preventDefault()`, чтобы предотвратить поведение по умолчанию, руководствуясь приоритетом вашей собственной логики, затем скопируйте содержимое в буфер обмена. В этом примере не рассматривается, как вернуться к более ранним API, когда Clipboard API не поддерживается. Я расскажу об этом в разделе «[Обнаружение функций](#feature-detection)» далее в этой статье.

```js
document.addEventListener('copy', async (e) => {
    e.preventDefault();
    try {
      let clipboardItems = [];
      for (const item of e.clipboardData.items) {
        if (!item.type.startsWith('image/')) {
          continue;
        }
        clipboardItems.push(
          new ClipboardItem({
            [item.type]: item,
          })
        );
        await navigator.clipboard.write(clipboardItems);
        console.log('Изображение скопировано.');
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
```

## Вставка: чтение данных из буфера обмена

### readText ()

Чтобы прочитать текст из буфера обмена, вызовите `navigator.clipboard.readText()` и дождитесь разрешения возвращенного обещания:

```js
async function getClipboardContents() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Вставленное содержимое: ', text);
  } catch (err) {
    console.error('Не удалось прочитать содержимое буфера обмена: ', err);
  }
}
```

### read()

Метод `navigator.clipboard.read()` также является асинхронным и возвращает обещание. Чтобы прочитать изображение из буфера обмена, получите список объектов [`ClipboardItem`](https://developer.mozilla.org/docs/Web/API/ClipboardItem), а затем выполните их перебор.

Каждый `ClipboardItem` может хранить свое содержимое в разных типах, поэтому вам придется перебирать список типов, снова используя цикл `for...of`. Для каждого типа вызовите метод `getType()` с текущим типом в качестве аргумента, чтобы получить соответствующий Blob. Аналогично вышеуказанному, этот код не привязан к изображениям и будет работать с другими будущими типами файлов.

```js
async function getClipboardContents() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        console.log(URL.createObjectURL(blob));
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

### Работа со вставленными файлами

Пользователям удобно, когда есть возможность использовать сочетания клавиш для буфера обмена, такие как <kbd>ctrl</kbd>+<kbd>c</kbd> и <kbd>ctrl</kbd>+<kbd>v</kbd>. Chromium предоставляет файлы *только для чтения* в буфере обмена, как показано ниже. Это срабатывает, когда пользователь нажимает на ярлык вставки операционной системы по умолчанию или при нажатии «**Правка**», а затем «**Вставить**» в строке меню браузера. Никакого дополнительного связующего кода не требуется.

```js
document.addEventListener("paste", async e => {
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  // Читаем содержимое файла, предполагая, что это текстовый файл.
  // Запись в файл недоступна.
  console.log(await file.text());
});
```

### Событие вставки

Как отмечено выше, есть планы ввести события для работы с Clipboard API, а пока вы можете использовать существующее событие `paste`. Оно прекрасно работает с новыми асинхронными методами чтения текста из буфера обмена. Как и в случае с событием `copy`, не забудьте вызвать `preventDefault()`.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const text = await navigator.clipboard.readText();
  console.log('Вставленный текст: ', text);
});
```

Как и для события `copy`, возврат к более ранним API, когда Clipboard API не поддерживается, будет рассмотрен в разделе «[Обнаружение функций](#feature-detection)».

## Работа с несколькими типами файлов

Большинство реализаций помещают в буфер обмена несколько форматов данных для одной операции вырезания или копирования. На это есть две причины: будучи разработчиком приложений, вы никак не можете знать возможности приложения, в которое пользователь хочет скопировать текст или изображения, а многие приложения поддерживают вставку структурированных данных в виде простого текста. Пользователям это доступно в пунктах меню «**Правка**» под названием «**Вставить и согласовать стиль**» или «**Вставить без форматирования**».

В следующем примере показано, как это сделать. В этом примере для получения данных изображения используется `fetch()`, но эти данные также можно получить из [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas) или [File System Access API](/file-system-access/).

```js
async function copy() {
  const image = await fetch('kitten.png');
  const text = new Blob(['Cute sleeping kitten'], {type: 'text/plain'});
  const item = new ClipboardItem({
    'text/plain': text,
    'image/png': image
  });
  await navigator.clipboard.write([item]);
}
```

## Безопасность и разрешения

Доступ к буферу обмена всегда создавал проблемы безопасности в браузерах. Без надлежащих разрешений страница могла незаметно копировать всевозможный вредоносный контент в буфер обмена пользователя, что могло обернуться катастрофой при вставке. Только представьте веб-страницу, которая молча копирует в ваш буфер обмена `rm -rf /` или изображение, являющееся [архивной бомбой](http://www.aerasec.de/security/advisories/decompression-bomb-vulnerability.html).

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dt4QpuEuik9ja970Zos1.png", alt="Диалоговое окно браузера, запрашивающее у пользователя разрешение на буфер обмена.", width="800", height="338" %} <figcaption> Запрос разрешения для Clipboard API. </figcaption></figure>

Предоставление веб-страницам неограниченного доступа к буферу обмена для чтения еще более проблематично. Пользователи обычно копируют конфиденциальную информацию, такую как пароли и личные данные, в буфер обмена, который затем может быть прочитан любой страницей без ведома пользователя.

Как и многие новые API, Clipboard API поддерживается только для страниц, обслуживаемых через HTTPS. Чтобы предотвратить нарушения, доступ к буферу обмена разрешается, только когда страница открыта на активной вкладке. Страницы на активных вкладках могут записывать данные в буфер обмена без запроса разрешения, но для чтения из буфера обмена разрешение требуется всегда.

Разрешения на копирование и вставку были добавлены в [Permissions API](https://developers.google.com/web/updates/2015/04/permissions-api-for-the-web). Разрешение `clipboard-write` автоматически предоставляется страницам, когда они открыты на активной вкладке. Разрешение `clipboard-read` должно быть запрошено — это можно реализовать при попытке прочитать данные из буфера обмена. Последнее показано в коде ниже::

```js
const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const permissionStatus = await navigator.permissions.query(queryOpts);
// Примет значение 'granted', 'denied' или 'prompt':
console.log(permissionStatus.state);

// Прослушиваем изменения состояния разрешения
permissionStatus.onchange = () => {
  console.log(permissionStatus.state);
};
```

Вы также можете указать, требуется ли жест пользователя для вызова вырезания или вставки, используя параметр `allowWithoutGesture`. Значение по умолчанию для этого параметра зависит от браузера, поэтому включать его нужно всегда.

Здесь как раз пригодится асинхронный характер Clipboard API буфера обмена: при попытке чтения или записи данных буфера обмена у пользователя автоматически запрашивается разрешение, если оно еще не было предоставлено. Поскольку API основан на обещаниях, такое поведение полностью прозрачно, и отказ пользователя в разрешении буфера обмена приводит к отклонению обещания, так что страница может отреагировать соответствующим образом.

Поскольку Chrome разрешает доступ к буферу обмена, только когда страница открыта на активной вкладке, вы увидите, что некоторые из приведенных здесь примеров не работают, если вставить их непосредственно в DevTools, поскольку сами DevTools являются активной вкладкой. Это можно обойти: отложите доступ к буферу обмена с помощью `setTimeout()`, а затем быстро кликните внутри страницы, чтобы передать ей фокус перед вызовом функций:

```js
setTimeout(async () => {
  const text = await navigator.clipboard.readText();
  console.log(text);
}, 2000);
```

## Интеграция политики разрешений

Чтобы использовать API в элементах iframe, необходимо включить его с помощью [политики разрешений](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/), которая определяет механизм, позволяющий выборочно включать и отключать различные функции браузера и API. Конкретно нужно передать `clipboard-read`, `clipboard-write` или оба значения в зависимости от потребностей вашего приложения.

```html/2
<iframe
    src="index.html"
    allow="clipboard-read; clipboard-write"
>
</iframe>
```

## Обнаружение функций

Чтобы использовать Async Clipboard API с поддержкой всех браузеров, проверьте `navigator.clipboard` и вернитесь к более ранним методам. Например, вот как можно реализовать вставку, чтобы включить другие браузеры.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  let text;
  if (navigator.clipboard) {
    text = await navigator.clipboard.readText();
  }
  else {
    text = e.clipboardData.getData('text/plain');
  }
  console.log('Получен вставленный текст: ', text);
});
```

Это еще не все. До появления Async Clipboard API в браузерах использовалось сочетание различных реализаций копирования и вставки. В большинстве браузеров собственное копирование и вставка браузера могут быть запущены с помощью `document.execCommand('copy')` и `document.execCommand('paste')`. Если копируемый текст представляет собой строку, отсутствующую в DOM, она должна быть вставлена в DOM и выбрана:

```js
button.addEventListener('click', (e) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  const result = document.execCommand('copy');
  if (result === 'unsuccessful') {
    console.error('Не удалось скопировать текст.');
  }
});
```

В Internet Explorer также можно получить доступ к буферу обмена через `window.clipboardData`. При доступе в рамках жеста пользователя, такого как событие клика — это часть разумного подхода к запросу разрешения — запрос разрешений не отображается.

## Демонстрации

Вы можете пощупать Async Clipboard API в демонстрациях ниже или [прямо на Glitch](https://async-clipboard-api.glitch.me/).

Первый пример демонстрирует перемещение текста в буфер обмена и из него.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-text.glitch.me/" title="async-clipboard-text on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Чтобы протестировать работу API с изображениями, используйте эту демонстрацию. Напомним, что поддерживаются только PNG и только в [некоторых браузерах](https://developer.mozilla.org/docs/Web/API/Clipboard_API#browser_compatibility).

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-api.glitch.me/" title="async-clipboard-api on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Дальнейшие шаги

Chrome активно работает над расширением Asynchronous Clipboard API с помощью упрощенных событий, согласованных с [Drag and Drop API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API). Из-за потенциальных рисков Chrome действует осторожно. Чтобы быть в курсе хода работ, следите за обновлениями этой статьи и нашего [блога](/blog/).

На данный момент поддержка Clipboard API доступна во [многих браузерах](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility).

Удачного копирования и вставки!

## Ссылки по теме

- [MDN](https://developer.mozilla.org/docs/Web/API/Clipboard_API)

## Благодарности

Asynchronous Clipboard API был реализован [Дарвином Хуангом](https://www.linkedin.com/in/darwinhuang/) и [Гари Качмарчиком](https://www.linkedin.com/in/garykac/). Дарвин также предоставил демонстрации. Спасибо [Ярославу Кукицяку](https://github.com/kyarik) и еще раз Гари Качмарчику за рецензирование параграфов этой статьи.

Главное изображение взято у [Маркуса Винклера](https://unsplash.com/@markuswinkler) на [Unsplash](https://unsplash.com/photos/7iSEHWsxPLw).
