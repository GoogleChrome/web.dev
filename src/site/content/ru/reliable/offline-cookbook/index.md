---
layout: post
title: 'Офлайн-приложения: сборник рекомендаций'
description: Распространенные советы о том, как обеспечить работу приложения в офлайн-режиме.
authors:
  - jakearchibald
date: 2014-12-09
updated: 2020-09-28
---

Когда мы оставили попытки решить проблему работы приложений в офлайн-режиме и решили дать инструменты для этого самим разработчикам, то на свет появились [сервис-воркеры](/service-workers-cache-storage/). Они позволяют управлять кешированием и обработкой запросов, тем самым открывая возможности для реализации собственных паттернов. Мы рассмотрим несколько возможных паттернов по отдельности, но на практике вы, вероятно, будете комбинировать их друг с другом в зависимости от URL-адреса и контекста.

Увидеть эти паттерны в действии можно в демонстрации [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/), а в [этом видео](https://www.youtube.com/watch?v=px-J9Ghvcx4) показано их влияние на производительность.

## Кеширование: когда сохранять ресурсы

[Сервис-воркеры](/service-workers-cache-storage/) позволяют обрабатывать запросы независимо от кеширования, поэтому я продемонстрирую каждый из этих аспектов по отдельности. Во-первых, что касается кеширования: когда его следует выполнять?

### При установке: в качестве зависимости {: #on-install-as-dependency }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CLdlCeKfoOPfpYDx1s0p.png", alt="При установке: в качестве зависимости.", width="800", height="498" %} <figcaption>При установке: в качестве зависимости.</figcaption></figure>

Сервис-воркеры поддерживают событие `install`, при помощи которого можно подготовить все необходимое для обработки других событий. Во время его обработки предыдущая версия сервис-воркера продолжает работать и выдавать страницы, так что не делайте ничего, что могло бы этому помешать.

**Подходит для:** CSS, изображений, шрифтов, JS, шаблонов… словом, для любого контента, который остается неизменным в рамках одной «версии» сайта.

Речь идет о контенте, без которого сайт не сможет работать и который в аналогичном нативном приложении был бы включен в файл для начальной загрузки.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function (cache) {
      return cache.addAll([
        '/css/whatever-v3.css',
        '/css/imgs/sprites-v6.png',
        '/css/fonts/whatever-v8.woff',
        '/js/all-min-v4.js',
        // etc.
      ]);
    }),
  );
});
```

`event.waitUntil` принимает обещание для определения продолжительности и успеха установки. В случае отклонения обещания установка считается неудачной и сервис-воркер не сохраняется (если работает более старая версия, она останется нетронутой). `caches.open()` и `cache.addAll()` возвращают обещания. Если загрузка какого-либо из ресурсов завершится неудачей, вызов `cache.addAll()` будет отклонен.

В демонстрации [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) этот метод используется для [кеширования статических ресурсов](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L3).

### При установке: не в качестве зависимости {: #on-install-not }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/S5L9hw95GKGWS1l0ImGl.png", alt="При установке: не в качестве зависимости.", width="800", height="500" %} <figcaption>При установке: не в качестве зависимости.</figcaption></figure>

Этот пример похож на предыдущий, но в данном случае загрузка ресурсов не задерживает окончание установки и не является обязательной для успешного завершения установки.

**Подходит для:** объемных ресурсов, которые не требуется загружать сразу, например ресурсов для поздних уровней игры.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function (cache) {
      cache
        .addAll
        // уровни 11–20
        ();
      return cache
        .addAll
        // основные ресурсы и уровни 1–10
        ();
    }),
  );
});
```

В примере выше обещание `cache.addAll` не передается в `event.waitUntil` для уровней 11–20, поэтому даже если оно будет отклонено, то игра будет работать в офлайн-режиме. Разумеется, вы должны будете учесть возможное отсутствие этих уровней и повторить попытку кеширования в случае их отсутствия.

После окончания обработки событий сервис-воркер может быть завершен, в результате чего скачивание уровней 11–20 прервется и они не попадут в кеш. В будущем в подобных случаях, а также при скачивании более крупных файлов, таких как фильмы, можно будет использовать [Web Periodic Background Synchronization API](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API). Сейчас этот API поддерживается только в форках Chromium.

### При активации {: #on-activate }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUH91vKtMTLXNgpHmID2.png", alt="При активации.", width="800", height="500" %} <figcaption>При активации.</figcaption></figure>

**Подходит для:** очистки и миграции данных.

После того как новый сервис-воркер установлен и старый больше не используется, происходит активация нового сервис-воркера, сопровождающаяся событием `activate`. Поскольку старая версия нам больше не мешает, самое время выполнить [миграцию схемы в IndexedDB](/indexeddb-best-practices/) и удалить неиспользуемые кеши.

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Для удаления кеша необходимо вернуть true.
            // Помните, что кеши являются общими
            // для всего источника
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});
```

Во время активации другие события, такие как `fetch`, помещаются в очередь, поэтому длительная активация потенциально может заблокировать загрузку страницы. Не перегружайте процесс активации и используйте его только для операций, которые *невозможно* выполнить во время работы старой версии.

В демонстрации [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) этот метод используется для [удаления старых кешей](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L17).

### В ответ на действие пользователя {: #on-user-interaction }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/q5uUUHvxb3Is8N5Toxja.png", alt="В ответ на действие пользователя.", width="800", height="222" %} <figcaption>В ответ на действие пользователя.</figcaption></figure>

**Подходит для:** ситуаций, когда перевести весь сайт в офлайн невозможно и вы разрешили пользователю выбирать контент для офлайн-просмотра, такой как видео с YouTube, статьи из Википедии, отдельные галереи с Flickr и т. д.

Предоставьте пользователю кнопку «Прочитать позже» или «Сохранить для офлайн-просмотра». Когда пользователь нажимает на кнопку, загружайте из сети соответствующий ресурс и помещайте его в кеш.

```js
document.querySelector('.cache-article').addEventListener('click', function (event) {
  event.preventDefault();

  var id = this.dataset.articleId;
  caches.open('mysite-article-' + id).then(function (cache) {
    fetch('/get-article-urls?id=' + id)
      .then(function (response) {
        // /get-article-urls возвращает JSON-массив
        // URL-адресов ресурсов, от которых зависит статья
        return response.json();
      })
      .then(function (urls) {
        cache.addAll(urls);
      });
  });
});
```

[API-интерфейс кеширования](https://developer.mozilla.org/docs/Web/API/Cache) доступен как из сервис-воркера, так и со страниц, поэтому для сохранения контента в кеш не обязательно использовать сервис-воркер.

### При получении ответа по сети {: #on-network-response }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/86mv3BK2kjWi8Dm1KWpr.png", alt="При получении ответа по сети.", width="800", height="390" %} <figcaption>При получении ответа по сети.</figcaption></figure>

**Подходит для:** часто обновляемых ресурсов, таких как почтовый ящик пользователя или содержание статьи. Также подходит для необязательного контента, такого как аватары, однако в этом случае проявляйте осторожность.

Если запрашиваемый ресурс отсутствует в кеше, он загружается из сети, отправляется на страницу и одновременно записывается в кеш.

При загрузке большого числа URL-адресов, например аватаров, избегайте чрезмерного увеличения хранилища вашего источника (origin). Если пользователю понадобится освободить место на диске, нежелательно, чтобы ваш сайт стал первым кандидатом. Старайтесь удалять из кеша ресурсы, которые вам больше не нужны.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});
```

В целях экономии памяти тело запроса или ответа можно прочитать только один раз. Приведенный выше код создает при помощи [`.clone()`](https://fetch.spec.whatwg.org/#dom-request-clone) дополнительные копии, которые можно читать по отдельности.

В демонстрации [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) этот метод используется для [кеширования изображений из Flickr](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L109).

### При проверке устаревшего ресурса {: #stale-while-revalidate }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6GyjQkG2pI5tV1xirXSX.png", alt="При проверке устаревшего ресурса.", width="800", height="388" %} <figcaption>При проверке устаревшего ресурса.</figcaption></figure>

**Подходит для:** частого обновления ресурсов, для которых наличие самой последней версии не является критичным. К таким ресурсам относятся аватары пользователей.

При наличии используется кешированная версия, но для дальнейшего использования загружается новая.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
```

Аналогичным образом работает стратегия [stale-while-revalidate](https://www.mnot.net/blog/2007/12/12/stale) в HTTP.

### При получении push-уведомления {: #on-push-message }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bshuBXOyD2A4zveXQMul.png", alt="При получении push-уведомления.", width="800", height="498" %} <figcaption>При получении push-уведомления.</figcaption></figure>

Интерфейс [Push API](/push-notifications/) — еще одна функция, реализованная на основе сервис-воркеров. Она позволяет запускать сервис-воркер (и только его) в ответ на сообщение от службы уведомлений ОС, и это происходит даже в том случае, если у пользователя нет открытых вкладок с вашим сайтом. Для использования этой функциональности страница должна запросить разрешение пользователя.

**Подходит для:** контента, связанного с уведомлениями: сообщений в чате, срочных новостей или электронных писем. Также подходит для немедленной синхронизации редко изменяющегося контента, такого как списки задач или события в календаре.

{% YouTube '0i7YdSEQI1w' %}

Наиболее распространенный конечный результат — уведомление, при нажатии открывающее соответствующую страницу. К моменту нажатия *крайне важно*, чтобы нужные ресурсы уже находились в кеше. Хотя при получении push-уведомления пользователь находится в сети, в момент нажатия на него ситуация может быть иной, поэтому важно сделать контент доступным в офлайн-режиме.

Приведенный ниже код обновляет кеш перед отображением уведомления:

```js
self.addEventListener('push', function (event) {
  if (event.data.text() == 'new-email') {
    event.waitUntil(
      caches
        .open('mysite-dynamic')
        .then(function (cache) {
          return fetch('/inbox.json').then(function (response) {
            cache.put('/inbox.json', response.clone());
            return response.json();
          });
        })
        .then(function (emails) {
          registration.showNotification('New email', {
            body: 'From ' + emails[0].from.name,
            tag: 'new-email',
          });
        }),
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.notification.tag == 'new-email') {
    // Предположим, что все ресурсы, необходимые для
    // рендеринга /inbox/, были кешированы ранее, например
    // в рамках обработчика install.
    new WindowClient('/inbox/');
  }
});
```

### При фоновой синхронизации {: #on-background-sync }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tojpjg0cvZZVvZWStG81.png", alt="При фоновой синхронизации.", width="800", height="219" %} <figcaption>При фоновой синхронизации.</figcaption></figure>

[Фоновая синхронизация](https://developer.chrome.com/blog/background-sync/) — еще одна функция, реализованная на основе сервис-воркеров. Она позволяет запрашивать синхронизацию в фоновом режиме как единоразово, так и с (крайне неточным) интервалом. Запускается только код сервис-воркера, и это происходит даже в том случае, если у пользователя нет открытой вкладки с вашим сайтом. Для использования этой функциональности страница должна запросить разрешение пользователя.

**Подходит для:** обновлений, не требующих срочности, особенно если они происходят слишком часто, чтобы генерировать push-уведомление для каждого из них. Это могут быть посты в лентах соцсетей, новостные статьи и т. д.

```js
self.addEventListener('sync', function (event) {
  if (event.id == 'update-leaderboard') {
    event.waitUntil(
      caches.open('mygame-dynamic').then(function (cache) {
        return cache.add('/leaderboard.json');
      }),
    );
  }
});
```

## Сохранение кеша {: #cache-persistence }

Вашему источнику доступно определенное количество свободного места, которым он может распоряжаться по своему усмотрению. Это место распределяется между всеми хранилищами: [локальным хранилищем](https://developer.mozilla.org/docs/Glossary/IndexedDB), [IndexedDB](https://developer.mozilla.org/docs/Web/API/Storage), [File System Access](/file-system-access/) и, разумеется, [кешем](https://developer.mozilla.org/docs/Web/API/Cache).

Объем не является фиксированным и зависит от устройства, а также от условий хранения данных. Узнать его можно следующим образом:

```js
navigator.storageQuota.queryInfo('temporary').then(function (info) {
  console.log(info.quota);
  // Результат: <квота в байтах>
  console.log(info.usage);
  // Результат: <используемые данные в байтах>
});
```

Однако, как и в случае с любым другим браузерным хранилищем, в случае нехватки места на устройстве ваши данные могут в любой момент быть удалены. К сожалению, браузер не сможет отличить фильмы, которые ни в коем случае нельзя удалять, от игры, до которой пользователю нет дела.

Чтобы обойти это ограничение, используйте интерфейс [StorageManager](https://developer.mozilla.org/docs/Web/API/StorageManager):

```js
// Со страницы:
navigator.storage.persist()
.then(function(persisted) {
  if (persisted) {
    // Ура, данные сохранятся!
  } else {
   // Гарантировать сохранение данных не получится.
});
```

Разумеется, пользователь должен будет предоставить разрешение. Для этого используйте Permissions API.

Важно, чтобы пользователь участвовал в этом процессе, поскольку теперь он сможет управлять удалением данных. Если на устройстве начнет заканчиваться место и удаление необязательных данных не поможет решить проблему, то именно пользователь будет решать, какие данные удалить, а какие оставить.

Для этого необходимо, чтобы при анализе расхода пространства операционные системы отображали «защищенные» хранилища наравне с нативными приложениями, а не объединяли все пространство, используемое браузером, в один пункт.

## Советы по выдаче ресурсов: как обрабатывать запросы {: #serving-suggestions }

Неважно, сколько ресурсов вы храните в кеше: они не будут использоваться сервис-воркером, пока вы не определите условия для их использования. Вот несколько паттернов для обработки запросов:

### Только кеш {: #cache-only }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ppXImAnXW7Grk4igLRTj.png", alt="Только кеш.", width="800", height="272" %} <figcaption>Только кеш.</figcaption></figure>

**Подходит для:** любого контента, который остается неизменным в рамках одной «версии» сайта. Такие ресурсы должны кешироваться во время события install, поэтому должны быть доступны в кеше.

```js
self.addEventListener('fetch', function (event) {
  // Если в кеше не будет найдено совпадение, то ответ
  // будет выглядеть как ошибка соединения
  event.respondWith(caches.match(event.request));
});
```

…однако обычно этот случай не требуется обрабатывать отдельно, поскольку для него подходит стратегия [Кеш, в случае неудачи — сеть](#cache-falling-back-to-network).

### Только сеть {: #network-only }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5piPzi4NRGcgy1snmlEW.png", alt="Только сеть.", width="800", height="272" %} <figcaption>Только сеть.</figcaption></figure>

**Подходит для:** запросов, не имеющих офлайн-эквивалента, таких как оповещения аналитики или запросы, отличные от GET.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
  // или вообще не вызывайте event.respondWith; в этом
  // случае используется стандартное поведение браузера
});
```

…однако обычно этот случай не требуется обрабатывать отдельно, поскольку для него подходит стратегия [Кеш, в случае неудачи — сеть](#cache-falling-back-to-network).

### Кеш, в случае неудачи — сеть {: #cache-falling-back-to-network }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMXq6ya5HdjkNeGjTlAN.png", alt="Кеш, в случае неудачи — сеть.", width="800", height="395" %} <figcaption>Кеш, в случае неудачи — сеть.</figcaption></figure>

**Походит для:** приложений, ориентированных в первую очередь на офлайн-работу. В таких случаях именно эта стратегия будет использоваться для большинства запросов. Другие паттерны будут применяться в порядке исключения на основании типа входящего запроса.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

Для кешированных ресурсов будет применяться паттерн «только кеш», а для некешированных — «только сеть» (сюда относятся все запросы, отличные от GET, поскольку они не допускают кеширование).

### Приоритизация по скорости {: #cache-and-network-race }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/j6xbmOpm4GbayBJHChNW.png", alt="Приоритизация по скорости.", width="800", height="427" %} <figcaption>Приоритизация по скорости.</figcaption></figure>

**Подходит для:** небольших ресурсов, при загрузке которых очень важна скорость на устройствах с медленным доступом к диску.

При использовании некоторых сочетаний устаревших жестких дисков, антивирусного ПО и широкополосных интернет-соединений загрузка ресурсов по сети происходит быстрее, чем обращение к диску. Однако имейте в виду, что загрузка по сети контента, который уже сохранен локально, может повысить расход трафика.

```js
// Promise.race нам не подходит, так как отклоняется при
// отклонении невыполненного обещания. Давайте напишем
// свою функцию для одновременного выполнения:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // проверяем переданные promises
    promises = promises.map((p) => Promise.resolve(p));
    // если одно из обещаний выполняется, выполняем текущее
    promises.forEach((p) => p.then(resolve));
    // если все обещания отклонены, то отклоняем текущее
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(promiseAny([caches.match(event.request), fetch(event.request)]));
});
```

### Сеть, в случае неудачи — кеш {: #network-falling-back-to-cache }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/efLECR7ZqNiPjmAzvEzO.png", alt="Сеть, в случае неудачи — кеш.", width="800", height="388" %} <figcaption>Сеть, в случае неудачи — кеш.</figcaption></figure>

**Подходит для:** ресурсов, которые часто обновляются независимо от версии сайта: статей, аватаров, лент в социальных сетях и таблиц рекордов в играх (в качестве временного решения).

При наличии сетевого подключения пользователи получают свежий контент, тогда как пользователи, находящиеся офлайн, получают кешированную версию. Если сетевой запрос завершается успешно, вероятно, следует [обновить запись в кеше](#on-network-response).

Однако у такого подхода есть недостаток. Пользователи с нестабильным или медленным соединением будут вынуждены ожидать завершения запроса, вместо того чтобы сразу увидеть контент, сохраненный на устройстве. Чрезмерно долгое ожидание будет вызывать у пользователей раздражение. Для более оптимального решения см. следующий паттерн: [Кеш, затем сеть](#cache-then-network).

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
```

### Кеш, затем сеть {: #cache-then-network }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BjxBlbCf14ed9FBQRS6E.png", alt="Кеш, затем сеть.", width="800", height="478" %} <figcaption>Кеш, затем сеть.</figcaption></figure>

**Подходит для:** контента, который необходимо часто обновлять: статей, лент в социальных сетях и таблиц рекордов в играх.

Страница запрашивает контент сразу из двух источников: из кеша и из сети. Сначала отображаются данные из кеша, а затем при получении данных из сети страница обновляется.

В некоторых случаях (таких, как таблицы рекордов в играх) текущие данные можно безболезненно заменить новыми, но замена крупных фрагментов контента может приводить к проблемам. Не следует изменять контент в тот момент, когда пользователь читает его или взаимодействует с ним.

Twitter добавляет новый контент над существующим и корректирует положение прокрутки, чтобы пользователь не замечал изменений. Это возможно благодаря тому, что Twitter в основном придерживается линейного порядка контента. В демонстрации [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) я скопировал этот паттерн, для того чтобы как можно быстрее отображать контент на экране и в то же время обеспечить его оперативное обновление.

**Код на странице:**

```js
var networkDataReceived = false;

startSpinner();

// загрузка свежих данных
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    updatePage(data);
  });

// загрузка кешированных данных
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    // не перезаписываем новые данные из сети
    if (!networkDataReceived) {
      updatePage(data);
    }
  })
  .catch(function () {
    // данные из кеша не получены; сеть - наша последняя надежда:
    return networkUpdate;
  })
  .catch(showErrorMessage)
  .then(stopSpinner);
```

**Код сервис-воркера:**

Всегда следует обращаться к сети и одновременно с этим обновлять кеш.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }),
  );
});
```

В демонстрации [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) я использовал для обхода ограничений [XHR вместо fetch](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/utils.js#L3) и приспособил заголовок Accept, чтобы сообщать сервис-воркеру, откуда следует загружать ресурс ([код страницы](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/index.js#L70), [код сервис-воркера](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L61)).

### Резервные ресурсы {: #generic-fallback }

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URF7IInbQtWL6GZK9GW3.png", alt="Резервные ресурсы.", width="800", height="389" %} <figcaption>Резервные ресурсы.</figcaption></figure>

Когда загрузить ресурс из кеша или из сети не удается, есть смысл предоставить резервный вариант.

**Подходит для:** второстепенных изображений, таких как аватары; неудачных запросов POST; страниц, сообщающих о недоступности данных в офлайн-режиме.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Пробуем загрузку из кеша
    caches
      .match(event.request)
      .then(function (response) {
        // В случае неудачи обращаемся к сети
        return response || fetch(event.request);
      })
      .catch(function () {
        // Если оба запроса завершились неудачно,
        // показываем резервный ресурс:
        return caches.match('/offline.html');
        // У вас может быть много резервных ресурсов,
        // выбираемых на основе URL-адреса и заголовков,
        // например картинка силуэта лица для аватаров.
      }),
  );
});
```

В качестве резервных следует указывать ресурсы, являющиеся [зависимостями при установке](#on-install-as-dependency).

Если ваша страница отправляет письмо, то в случае неудачи сервис-воркер может сохранить его в папке «Исходящие» в IndexDB и уведомить об этом пользователя.

### Разметка на стороне сервис-воркера {: #Service Worker-side-templating }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o5SqtDczlvhw6tPJkr2z.png", alt="Разметка на стороне сервис-воркера", width="800", height="463" %} <figcaption>Разметка на стороне сервис-воркера.</figcaption></figure>

**Подходит для:** страниц, для которых невозможно кешировать ответ с сервера.

[Рендеринг страниц на сервере ускоряет работу сайта](https://jakearchibald.com/2013/progressive-enhancement-is-faster/), однако страницы могут включать динамические данные, для которых кеширование неуместно, такие как имя текущего пользователя. Если страница контролируется сервис-воркером, вы можете запрашивать данные в виде JSON и выполнять рендеринг локально, используя шаблон.

```js
importScripts('templating-engine.js');

self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);

  event.respondWith(
    Promise.all([
      caches.match('/article-template.html').then(function (response) {
        return response.text();
      }),
      caches.match(requestURL.path + '.json').then(function (response) {
        return response.json();
      }),
    ]).then(function (responses) {
      var template = responses[0];
      var data = responses[1];

      return new Response(renderTemplate(template, data), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }),
  );
});
```

## Объединение паттернов

Вам не обязательно ограничиваться каким-то одним методом. Вероятнее всего, вы будете комбинировать их в зависимости от URL-адреса запроса. Например, в [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) используются следующие методы:

- [кеширование при установке](#on-install-as-dependency) для статических элементов интерфейса и логики;
- [кеширование при получении ответа по сети](#on-network-response) для изображений и данных Flickr;
- [загрузка из кеша, а в случае неудачи — из сети](#cache-falling-back-to-network) для большинства запросов;
- [загрузка из кеша, а затем из сети](#cache-then-network) для результатов поиска Flickr.

Стратегию следует выбирать исходя из типа запроса:

```js
self.addEventListener('fetch', function (event) {
  // Разбор URL-адреса:
  var requestURL = new URL(event.request.url);

  // Обработка запросов к конкретному домену особым образом
  if (requestURL.hostname == 'api.example.com') {
    event.respondWith(/* комбинация паттернов */);
    return;
  }
  // Маршрутизация для локальных URL-адресов
  if (requestURL.origin == location.origin) {
    // Обработка URL-адресов статей
    if (/^\/article\//.test(requestURL.pathname)) {
      event.respondWith(/* другая комбинация паттернов */);
      return;
    }
    if (/\.webp$/.test(requestURL.pathname)) {
      event.respondWith(/* другая комбинация паттернов */);
      return;
    }
    if (request.method == 'POST') {
      event.respondWith(/* другая комбинация паттернов */);
      return;
    }
    if (/cheese/.test(requestURL.pathname)) {
      event.respondWith(
        new Response('Очень страшная ошибка', {
          status: 512,
        }),
      );
      return;
    }
  }

  // Паттерн по умолчанию
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

…и так далее.

### Благодарности

Авторы иконок:

- [Код](http://thenounproject.com/term/code/17547/): buzzyrobot
- [Календарь](http://thenounproject.com/term/calendar/4672/): Скотт Льюис
- [Сеть](http://thenounproject.com/term/network/12676/): Бен Риццо
- [SD-карта](http://thenounproject.com/term/sd-card/6185/): Томас Ле Бас
- [Процессор](http://thenounproject.com/term/cpu/72043/): iconsmind.com
- [Корзина для мусора](http://thenounproject.com/term/trash/20538/): trasnik
- [Уведомление](http://thenounproject.com/term/notification/32514/): @daosme
- [Макет сайта](http://thenounproject.com/term/layout/36872/): Mister Pixel
- [Облако](http://thenounproject.com/term/cloud/2788/): П. Дж. Онори

Кроме того, спасибо [Джеффу Поснику](https://twitter.com/jeffposnick) за исправление множества ошибок в статье.

### Материалы для дальнейшего чтения

- [Сервис-воркеры: введение](/service-workers-cache-storage/)
- [Is Service Worker ready?](https://jakearchibald.github.io/isserviceworkerready/) — отслеживание состояния реализации в основных браузерах
- [Обещания JavaScript: введение](/promises) — руководство по обещаниям
