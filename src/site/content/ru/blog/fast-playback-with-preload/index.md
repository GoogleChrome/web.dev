---
layout: post
title: Быстрое воспроизведение с предварительной загрузкой аудио и видео
subhead: Как ускорить воспроизведение мультимедиа за счет активной предварительной загрузки ресурсов.
authors:
  - beaufortfrancois
description: Чем быстрее начнется воспроизведение, тем больше людей посмотрят ваше видео или послушают аудиофайл. Это известно всем. В этой статье я рассмотрю методы, которые можно применять для ускорения воспроизведения мультимедиа за счет активной предварительной загрузки ресурсов в зависимости от сценария использования.
date: 2017-08-17
updated: 2020-11-16
tags:
  - media
  - performance
  - network
---

Чем быстрее начнется воспроизведение, тем больше людей посмотрят ваше видео или послушают аудиофайл. [Это известно всем](https://www.digitaltrends.com/web/buffer-rage/). В этой статье я рассмотрю методы, которые можно применять для ускорения воспроизведения мультимедиа за счет активной предварительной загрузки ресурсов в зависимости от сценария использования.

<figure>
  <video controls muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.webm#t=1.1" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.mp4#t=1.1" type="video/mp4">
  </source></source></video>
  <figcaption>
    <p>Авторские права принадлежат Blender Foundation | <a href="http://www.blender.org">www.blender.org</a>.</p>
  </figcaption></figure>

Я опишу три метода предварительной загрузки медиафайлов, начиная с их плюсов и минусов.

<table>
  <tbody>
    <tr>
      <th></th>
      <th>Это прекрасно…</th>
      <th>Но…</th>
    </tr>
    <tr>
      <td rowspan="3" style="white-space: nowrap"><a href="#video_preload_attribute">Атрибут предварительной загрузки видео</a></td>
      <td rowspan="3">Легко использовать для уникальных файлов, размещенных на веб-сервере.</td>
      <td>Браузеры могут полностью игнорировать атрибут.</td>
    </tr>
<tr>
      <td>Получение ресурсов начинается, когда HTML-документ полностью загружен и проанализирован.</td>
    </tr>
    <tr>
      <td>Расширения источников мультимедиа (MSE) игнорируют атрибут <code>preload</code> в элементах мультимедиа, поскольку за предоставление медиафайлов MSE отвечает приложение.</td>
    </tr>
    <tr>
      <td rowspan="2" style="white-space: nowrap"><a href="#link_preload">Предварительная загрузка ссылки</a></td>
      <td>Заставляет браузер запросить видеоресурс, не блокируя событие документа <code>onload</code>.</td>
      <td>Несовместима с запросами HTTP Range.</td>
    </tr>
<tr>
      <td>Совместима с MSE и файловыми сегментами.</td>
      <td>Следует использовать только для небольших медиафайлов (&lt;5 МБ) при извлечении полных ресурсов.</td>
    </tr>
    <tr>
      <td><a href="#manual_buffering">Ручная буферизация</a></td>
      <td>Полный контроль</td>
      <td>Ответственность за комплексную обработку ошибок несет сайт.</td>
    </tr>
  </tbody>
</table>

## Атрибут предварительной загрузки видео

Если источником видео является уникальный файл, размещенный на веб-сервере, вы можете использовать атрибут видео `preload`, чтобы указать браузеру, [сколько информации или контента необходимо предварительно загрузить](/video-and-source-tags/#preload). Это означает, что [расширения источников мультимедиа (MSE)](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API) несовместимы с `preload`.

Выборка ресурсов начнется только тогда, когда исходный HTML-документ будет полностью загружен и проанализирован (например, при срабатывании события `DOMContentLoaded`), в то время как совершенно другое событие `load` будет запущено, когда ресурс действительно будет извлечен.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/De8tMHJUn3XyzFfosVLb.svg", alt="", width="800", height="234" %}</figure>

Установка для атрибута `preload` значения `metadata` указывает на то, что пользователю скорее всего не понадобится видео, однако желательно получить его метаданные (размеры, список дорожек, продолжительность и т. д.). Обратите внимание, что начиная с [Chrome 64](https://developers.google.com/web/updates/2017/12/chrome-63-64-media-updates#media-preload-defaults-metadata) значением `preload` по умолчанию является `metadata`. (Раньше это было `auto`).

```html
<video id="video" preload="metadata" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`Число секунд видео, готовых к воспроизведению: ${bufferedSeconds}.`);
  });
</script>
```

Установка для атрибута `preload` значения `auto` указывает, что браузер может кэшировать достаточно данных, чтобы было возможно полное воспроизведение без необходимости остановки для дальнейшей буферизации.

```html
<video id="video" preload="auto" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`Число секунд видео, готовых к воспроизведению: ${bufferedSeconds}.`);
  });
</script>
```

Однако есть некоторые оговорки. Поскольку это всего лишь подсказка, браузер может полностью игнорировать атрибут `preload`. На момент написания в Chrome применялись следующие правила:

- Когда включен [Data Saver](https://support.google.com/chrome/answer/2392284), Chrome принудительно устанавливает для `preload` значение `none`.
- В Android 4.3 Chrome принудительно устанавливает для `preload` значение `none` из-за [ошибки Android](https://bugs.chromium.org/p/chromium/issues/detail?id=612909).
- При подключении к сотовой сети (2G, 3G и 4G) Chrome принудительно устанавливает для `preload` значение `metadata`.

### Советы

Если ваш веб-сайт содержит много видеоресурсов в одном домене, я бы порекомендовал вам установить для `preload` значение `metadata` или определить атрибут `poster` и установить для `preload` значение `none`. Таким образом максимальное количество HTTP-соединений с одним и тем же доменом (6 согласно спецификации HTTP 1.1), из-за которого загрузка ресурсов может зависнуть, не будет достигнуто. Обратите внимание, что таким образом можно также улучшить скорость страницы, если видео не лежат в основе вашего взаимодействия с пользователем.

## Предварительная загрузка ссылки

Как [описано](https://developers.google.com/web/updates/2016/03/link-rel-preload) в других [статьях](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/), [предварительная загрузка ссылок](https://w3c.github.io/preload/) — это декларативная выборка, которая позволяет заставить браузер запросить ресурс без блокировки события `load` и во время загрузки страницы. Ресурсы, загруженные через `<link rel="preload">`, хранятся локально в браузере и фактически инертны до тех пор, пока на них не будут явным образом ссылаться в DOM, JavaScript или CSS.

Предварительная загрузка отличается от предварительной выборки тем, что фокусируется на текущей навигации и извлекает ресурсы с приоритетом в зависимости от их типа (сценарий, стиль, шрифт, видео, аудио и т. д.). Ее следует использовать для разогрева кэша браузера для текущих сеансов.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g5fQKJMivvcsHajmMmi2.svg", alt="", width="800", height="234" %}</figure>

### Предварительная загрузка полного видео

Далее показано, как предварительно загрузить полное видео на ваш веб-сайт, чтобы видеоконтент считывался из кэша, когда JavaScript запросит его получение, поскольку ресурс может быть уже кэширован браузером. Если запрос предварительной загрузки еще не завершен, произойдет обычная выборка из сети.

```js
<link rel="preload" as="video" href="https://cdn.com/small-file.mp4">

<video id="video" controls></video>

<script>
  // Позже, после выполнения некоторых условий, устанавливаем в качестве
  // источника URL-адрес предварительно загруженного видео.
  video.src = 'https://cdn.com/small-file.mp4';
  video.play().then(() => {
    // Если URL предварительно загруженного видео уже кэширован, воспроизведение начинается сразу же.
  });
</script>
```

{% Aside %} Я бы рекомендовал использовать это только для небольших медиафайлов (менее 5 МБ). {% endAside %}

Поскольку в примере предварительно загруженный ресурс используется видеоэлементом, значение `as` предварительно загружаемой ссылки равно `video`. Если бы это был аудиоэлемент, значение было бы `as="audio"`.

### Предварительная загрузка первого сегмента

В приведенном ниже примере показано, как предварительно загрузить первый сегмент видео с помощью `<link rel="preload">` и использовать его с расширениями источников мультимедиа. Если вы не знакомы с MSE JavaScript API, см. [Основы MSE](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API).

Для простоты предположим, что все видео было разделено на файлы меньшего размера, например, `file_1.webm`, `file_2.webm`, `file_3.webm` и т. д.

```html
<link rel="preload" as="fetch" href="https://cdn.com/file_1.webm">

<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // Если видео уже предварительно загружено, выборка немедленно
    // вернет ответ из кэша браузера (кэш-память). В противном случае
    // будет выполнена стандартная выборка из сети.
    fetch('https://cdn.com/file_1.webm')
    .then(response => response.arrayBuffer())
    .then(data => {
      // Добавляем данные к новому объекту sourceBuffer.
      sourceBuffer.appendBuffer(data);
      // Сделать: Извлечь file_2.webm, когда пользователь начинает проигрывать видео.
    })
    .catch(error => {
      // Сделать: Показать пользователю сообщение "Видео недоступно".
    });
  }
</script>
```

{% Aside 'warning' %} Для ресурсов из разных источников убедитесь, что заголовки CORS заданы правильно. Поскольку мы не можем создать буфер массива из непрозрачного ответа, полученного с помощью `fetch(videoFileUrl, { mode: 'no-cors' })`, мы не сможем передать какой-либо видео- или аудиоэлемент. {% endAside %}

### Поддержка

См. [таблицу совместимости браузеров](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility) MDN, чтобы узнать, какие браузеры поддерживают предварительную загрузку. Вы можете определить ее доступность с помощью приведенных ниже фрагментов, чтобы настроить показатели производительности.

```js
function preloadFullVideoSupported() {
  const link = document.createElement('link');
  link.as = 'video';
  return (link.as === 'video');
}

function preloadFirstSegmentSupported() {
  const link = document.createElement('link');
  link.as = 'fetch';
  return (link.as === 'fetch');
}
```

## Ручная буферизация

Прежде чем мы углубимся в [Cache API](https://developer.mozilla.org/docs/Web/API/Cache) и сервис-воркеры, давайте посмотрим, как вручную буферизовать видео с помощью MSE. В приведенном ниже примере предполагается, что ваш веб-сервер поддерживает запросы HTTP [`Range`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Range), хотя это очень похоже на работу с файловыми сегментами. Обратите внимание, что некоторые библиотеки промежуточного ПО, такие как [Google Shaka Player](https://github.com/google/shaka-player), [JW Player](https://developer.jwplayer.com/) и [Video.js](http://videojs.com/), созданы для того, чтобы выполнить эту работу за вас.

```html
<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // Извлекаем начало видео, задавая заголовок Range HTTP-запроса.
    fetch('file.webm', { headers: { range: 'bytes=0-567139' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
      sourceBuffer.addEventListener('updateend', updateEnd, { once: true });
    });
  }

  function updateEnd() {
    // Видео готово к воспроизведению!
    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`Число секунд видео, готовых к воспроизведению: ${bufferedSeconds}.`);

    // Извлекаем следующий сегмент видео, когда пользователь начинает воспроизведение.
    video.addEventListener('playing', fetchNextSegment, { once: true });
  }

  function fetchNextSegment() {
    fetch('file.webm', { headers: { range: 'bytes=567140-1196488' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      const sourceBuffer = mediaSource.sourceBuffers[0];
      sourceBuffer.appendBuffer(data);
      // Сделать: Извлечь и присоединить следующий сегмент.
    });
  }
</script>
```

### Учет особенностей

Поскольку теперь вы целиком управляете процессом буферизации мультимедиа, я рекомендую учитывать уровень заряда батареи устройства, пользовательские настройки режима экономии данных и информацию о сети, когда вы планируете предварительную загрузку.

#### Учет заряда батареи

Прежде чем планировать предварительную загрузку видео, примите во внимание уровень заряда батареи устройства пользователя. Это продлит срок службы батареи при низком уровне заряда.

Отключите предварительную загрузку или хотя бы предварительно загрузите видео с более низким разрешением, когда устройство разряжается.

```js
if ('getBattery' in navigator) {
  navigator.getBattery()
  .then(battery => {
    // Если батарея заряжается или уровень заряда достаточно высок
    if (battery.charging || battery.level > 0.15) {
      // Сделать: Предварительная загрузка первого сегмента видео.
    }
  });
}
```

#### Обнаружение экономии данных

Используйте подсказку клиента (заголовок запроса) `Save-Data`, чтобы передавать быстрые и легкие приложения пользователям, которые выбрали режим экономии данных в своем браузере. Распознавая этот заголовок, ваше приложение может настроить и обеспечить улучшенное взаимодействие с пользователями, у которых есть ограничения расходов и производительности.

Чтобы узнать больше, см. раздел «[Доставка быстрых и легких приложений с экономией данных](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data)».

#### Умная загрузка на основе сетевой информации

Перед предварительной загрузкой может понадобиться проверка `navigator.connection.type`. Когда значение этого параметра равно `cellular`, вы можете предотвратить предварительную загрузку и сообщить пользователям, что их оператор мобильной сети может взимать дополнительную плату за пропускную способность, и запускать автоматическое воспроизведение только ранее кэшированного контента.

```js
if ('connection' in navigator) {
  if (navigator.connection.type == 'cellular') {
    // Сделать: Спросить пользователя перед предварительной загрузкой видео
  } else {
    // Сделать: Предварительная загрузка первого сегмента видео.
  }
}
```

Ознакомьтесь с [образцом сетевой информации](https://googlechrome.github.io/samples/network-information/), чтобы узнать, как реагировать на изменения в сети.

### Предварительное кэширование нескольких первых сегментов

А что, если мне гипотетически нужно предварительно загрузить некоторый медиаконтент, не зная, что именно в конечном итоге выберет пользователь? Если пользователь находится на веб-странице, содержащей 10 видео, у нас, вероятно, достаточно памяти, чтобы получить по одному файлу сегмента из каждого, но определенно не стоит создавать 10 скрытых элементов `<video>` и 10 объектов `MediaSource` и начинать передавать эти данные.

В приведенном ниже примере из двух частей показано, как предварительно кэшировать несколько первых сегментов видео с помощью эффективного и простого в использовании [Cache API](/cache-api-quick-guide/). Обратите внимание, что чего-то похожего можно достичь и с помощью IndexedDB. Мы пока не используем сервис-воркеры, так как Cache API также доступен из объекта `window`.

#### Получение и кэширование

```js
const videoFileUrls = [
  'bat_video_file_1.webm',
  'cow_video_file_1.webm',
  'dog_video_file_1.webm',
  'fox_video_file_1.webm',
];

// Создадим предварительный кэш видео и сохраним в нем все первые сегменты видеофайлов.
window.caches.open('video-pre-cache')
.then(cache => Promise.all(videoFileUrls.map(videoFileUrl => fetchAndCache(videoFileUrl, cache))));

function fetchAndCache(videoFileUrl, cache) {
  // Сначала проверяем, есть ли видео в кэше.
  return cache.match(videoFileUrl)
  .then(cacheResponse => {
    // Вернем кэшированный ответ, если видео в кэше.
    if (cacheResponse) {
      return cacheResponse;
    }
    // В противном случае получаем видео из сети.
    return fetch(videoFileUrl)
    .then(networkResponse => {
      // Добавляем ответ в кэш и параллельно возвращаем ответ сети.
      cache.put(videoFileUrl, networkResponse.clone());
      return networkResponse;
    });
  });
}
```

Обратите внимание, что если бы я должен был использовать запросы HTTP `Range`, мне бы пришлось вручную воссоздать объект `Response`, поскольку Cache API не поддерживает ответы `Range` — по крайней мере, [пока что](https://github.com/whatwg/fetch/issues/144). Помните, что вызов `networkResponse.arrayBuffer()` извлекает все содержимое ответа сразу в память средства визуализации, поэтому стоит использовать небольшие диапазоны.

Для справки, я изменил часть приведенного выше примера, чтобы сохранить запросы HTTP Range в предварительном кэше видео.

```js
    ...
    return fetch(videoFileUrl, { headers: { range: 'bytes=0-567139' } })
    .then(networkResponse => networkResponse.arrayBuffer())
    .then(data => {
      const response = new Response(data);
      // Добавляем ответ в кэш и параллельно возвращаем ответ сети.
      cache.put(videoFileUrl, response.clone());
      return response;
    });
```

#### Воспроизведение видео

Когда пользователь нажимает кнопку воспроизведения, мы получаем первый сегмент видео, доступный в Cache API, так что воспроизведение начинается немедленно, если оно доступно. В противном случае мы просто получим видео из сети. Имейте в виду, что браузеры и пользователи могут решить очистить [кэш](/storage-for-the-web/#eviction).

Как было показано ранее, мы используем MSE для передачи этого первого сегмента видео в видеоэлемент.

```js
function onPlayButtonClick(videoFileUrl) {
  video.load(); // Дает возможность проиграть видео позже.

  window.caches.open('video-pre-cache')
  .then(cache => fetchAndCache(videoFileUrl, cache)) // Определено выше.
  .then(response => response.arrayBuffer())
  .then(data => {
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

    function sourceOpen() {
      URL.revokeObjectURL(video.src);

      const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');
      sourceBuffer.appendBuffer(data);

      video.play().then(() => {
        // Сделать: Получить остальную часть видео при начале воспроизведения.
      });
    }
  });
}
```

{% Aside 'warning' %} Для ресурсов из разных источников убедитесь, что заголовки CORS заданы правильно. Поскольку мы не можем создать буфер массива из непрозрачного ответа, полученного с помощью `fetch(videoFileUrl, { mode: 'no-cors' })`, мы не сможем передать какой-либо видео- или аудиоэлемент. {% endAside %}

### Создание ответов Range с помощью сервис-воркера

Что делать, если вы получили весь видеофайл и сохранили его в Cache API? Когда браузер посылает запрос HTTP `Range`, вам совсем не нужно, чтобы видео целиком загружалось в память визуализатора, поскольку Cache API не поддерживает ответы `Range` — по крайней мере, [пока что](https://github.com/whatwg/fetch/issues/144).

Итак, позвольте мне показать, как перехватывать эти запросы и возвращать настроенный ответ `Range` от сервис-воркера.

```js
addEventListener('fetch', event => {
  event.respondWith(loadFromCacheOrFetch(event.request));
});

function loadFromCacheOrFetch(request) {
  // Выполняем поиск по всем доступным для этого запроса кэшам.
  return caches.match(request)
  .then(response => {

    // Если не нашли в кэше, получаем из сети.
    if (!response) {
      return fetch(request);
      // Примечание: возможно, понадобится добавить ответ в кэш и
      // параллельно вернуть ответ сети.
    }

    // Браузер посылает запрос HTTP Range. Реконструируем его
    // вручную из кэша.
    if (request.headers.has('range')) {
      return response.blob()
      .then(data => {

        // Получаем стартовую позицию из заголовка Range запроса.
        const pos = Number(/^bytes\=(\d+)\-/g.exec(request.headers.get('range'))[1]);
        const options = {
          status: 206,
          statusText: 'Partial Content',
          headers: response.headers
        }
        const slicedResponse = new Response(data.slice(pos), options);
        slicedResponse.setHeaders('Content-Range': 'bytes ' + pos + '-' +
            (data.size - 1) + '/' + data.size);
        slicedResponse.setHeaders('X-From-Cache': 'true');

        return slicedResponse;
      });
    }

    return response;
  }
}
```

Важно отметить, что для воссоздания этого нарезанного ответа я использовал `response.blob()`, поскольку он просто дает мне дескриптор файла, в то время как `response.arrayBuffer()` переносит весь файл в память визуализатора.

Мой собственный HTTP-заголовок `X-From-Cache` можно использовать, чтобы узнать, пришел ли этот запрос из кэша или из сети. Его может использовать такой плеер, как [ShakaPlayer](https://github.com/google/shaka-player/blob/master/docs/tutorials/service-worker.md), чтобы игнорировать время отклика как индикатор скорости сети.

{% YouTube 'f8EGZa32Mts' %}

В официальном [приложении Sample Media](https://github.com/GoogleChrome/sample-media-pwa) и, в частности, в его файле [ranged-response.js](https://github.com/GoogleChrome/sample-media-pwa/blob/master/src/client/scripts/ranged-response.js) вы можете найти готовое решение для обработки запросов `Range`.
