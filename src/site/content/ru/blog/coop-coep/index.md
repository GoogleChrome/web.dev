---
layout: post
title: Как настроить межсайтовую изоляцию с помощью COOP и COEP
subhead: |-
  Используйте COOP и COEP, чтобы настроить изолированную среду с несколькими источниками и включить мощные функции, такие как SharedArrayBuffer,
  performance.measureUserAgentSpecificMemory() и таймер высокой точности.
description: Некоторые веб-API повышают риск атак по сторонним каналам, например, Spectre. Чтобы уменьшить этот риск, браузеры предлагают изолированную среду на основе согласия, называемую межсайтовой изоляцией. Используйте COOP и COEP, чтобы создать такую среду и включить мощные функции, такие как SharedArrayBuffer, performance.measureUserAgentSpecificMemory() или таймер высокой точности.
authors:
  - agektmr
hero: image/admin/Rv8gOTwZwxr2Z7b13Ize.jpg
alt: Иллюстрация человека, просматривающего веб-сайт со всплывающим окном, встроенным фреймом и изображением.
date: 2020-04-13
updated: 2021-11-26
tags:
  - blog
  - security
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/register_trial/2780972769901281281"
feedback:
  - api
---

{% Aside 'caution' %}

`SharedArrayBuffer` в десктопной версии Chrome требует межсайтовой изоляции, начиная с Chrome 92. Подробнее [читайте в обновлениях SharedArrayBuffer в Android Chrome 88 и Desktop Chrome 92](https://developer.chrome.com/blog/enabling-shared-array-buffer/).

{% endAside %}

**Обновления**

- **5 августа 2021 г.**: JS Self-Profiling API был упомянут как один из API-интерфейсов, требующих межсайтовой изоляции, но из-за [недавнего изменения направления](https://github.com/shhnjk/shhnjk.github.io/tree/main/investigations/js-self-profiling#conclusion) он был удален.
- **6 мая 2021 г.**: Основываясь на отзывах и сообщениях о проблемах, мы решили скорректировать временную шкалу для того, чтобы ограничить использование `SharedArrayBuffer` на сайтах без изоляции между источниками в Chrome M92.
- **16 апреля 2021 г.**: добавлены примечания о [новом режиме без учетных данных COEP](https://github.com/mikewest/credentiallessness/) и [всплывающих окнах COOP same-origin-allow-popups, которые будут смягченным условием](https://github.com/whatwg/html/issues/6364) для межсайтовой изоляции.
- **5 марта 2021 г.**: Удалены ограничения для `SharedArrayBuffer`, `performance.measureUserAgentSpecificMemory()` и функций отладки, которые теперь полностью включены в Chrome 89. Добавлены новые возможности, `performance.now()` и `performance.timeOrigin`, которые будут иметь более высокую точность.
- **19 февраля 2021 г.**: добавлено примечание о политике функций `allow="cross-origin-isolated"` и функциях отладки в DevTools.
- **15 октября 2020 г.**: Свойство `self.crossOriginIsolated` доступно в Chrome 87. В связи с этим, `document.domain` является неизменным, когда `self.crossOriginIsolated` возвращает `true`. Метод `performance.measureUserAgentSpecificMemory()` завершает испытания Origin Trial и по умолчанию включен в Chrome 89. Shared Array Buffer в Chrome для Android будет доступен начиная с Chrome 88.

{% YouTube 'XLNJYhjA-0c' %}

Некоторые веб-API повышают риск атак по сторонним каналам, например Spectre. Чтобы снизить этот риск, браузеры предлагают изолированную среду на основе согласия, называемую межсайтовой изоляцией. В состоянии межсайтовой изоляции веб-страница сможет использовать привилегированные функции, в том числе:

<div>
  <table>
    <thead>
      <tr>
        <th>API</th>
        <th>Описание</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer">
          <code>SharedArrayBuffer</code></a>
        </td>
        <td>Требуется для потоков WebAssembly. Доступен в Android Chrome 88. Версия для десктопов в настоящее время включена по умолчанию с помощью <a href="https://www.chromium.org/Home/chromium-security/site-isolation">Site Isolation</a>, но для нее требуется состояние межсайтовой изоляции, и она <a href="https://developer.chrome.com/blog/enabling-shared-array-buffer/">будет отключена по умолчанию в Chrome 92</a>.</td>
      </tr>
      <tr>
        <td>
          <a href="/monitor-total-page-memory-usage/">
          <code>performance.measureUserAgentSpecificMemory()</code></a>
        </td>
        <td>Доступно в Chrome 89.</td>
      </tr>
      <tr>
        <td><a href="https://crbug.com/1180178"><code>performance.now()</code>, <code>performance.timeOrigin</code></a></td>
        <td>В настоящее время доступно во многих браузерах с разрешением до 100 микросекунд или выше. При межсайтовой изоляции разрешение может составлять 5 микросекунд или выше.</td>
      </tr>
    </tbody>
    <caption>Функции, которые будут доступны в состоянии межсайтовой изоляции.</caption>
  </table>
</div>

Состояние межсайтовой изоляции также предотвращает модификации `document.domain`. (Возможность изменять `document.domain` позволяет взаимодействовать между документами одного и того же сайта и считается лазейкой в политике одного и того же источника.)

Чтобы выбрать состояние межсайтовой изоляции, необходимо отправить следующие HTTP-заголовки в основной документ:

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

Эти заголовки инструктируют браузер блокировать загрузку ресурсов или фреймов, которые не были загружены документами из разных источников, и предотвращают непосредственное взаимодействие окон из разных источников с вашим документом. Это также означает, что загружаемые ресурсы из разных источников требуют согласия.

Вы можете определить, находится ли веб-страница в состоянии межсайтовой изоляции, проверив значение [`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated).

В данной статье показано, как использовать эти новые заголовки. В [следующей статье](/why-coop-coep) я предоставлю больше информации и контекста.

{% Aside %}

Эта статья предназначена для тех, кто хотел бы подготовить свои веб-сайты для использования `SharedArrayBuffer`, потоков WebAssembly, `performance.measureUserAgentSpecificMemory()` или таймера высокой точности на всех браузерных платформах с большей надежностью.

{% endAside %}

{% Aside 'key-term' %} В этой статье используется много похожей терминологии. Чтобы было понятнее, давайте сначала определим эти термины:

- [COEP: Политика встраивания из разных источников (Cross Origin Embedder Policy)](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP: Политика открытия из разных источников (Cross Origin Opener Policy)](https://github.com/whatwg/html/pull/5334/files)
- [CORP: Политика ресурсов из разных источников (Cross Origin Resource Policy)](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS: Совместное использование ресурсов между источниками (Cross Origin Resource Sharing)](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB: Блокировка чтения из разных источников (Cross Origin Read Blocking)](https://www.chromium.org/Home/chromium-security/corb-for-developers) {% endAside %}

## Развертывание COOP и COEP для межсайтовой изоляции

{% Aside %} Изучите практические шаги в [Руководстве по включению межсайтовой изоляции](/cross-origin-isolation-guide/). {% endAside %}

### Интеграция COOP и COEP

#### 1. Задайте заголовок `Cross-Origin-Opener-Policy: same-origin` в документе верхнего уровня

Если включить `COOP: same-origin` в документе верхнего уровня, окна с одинаковым источником и окна, открытые из документа, будут иметь отдельную группу контекста просмотра, если они не находятся в одном источнике с одинаковыми настройками COOP. Таким образом, для открытых окон принудительно включена изоляция, а взаимодействие между обоими окнами отключено.

{% Aside 'caution' %}

Это нарушит те интеграции, которым требуется взаимодействие между окнами из разных источников, например, OAuth и платежные формы. Чтобы хотя бы частично решить эту проблему, мы [изучаем возможность ослабления условия](https://github.com/whatwg/html/issues/6364) включения межсайтовой изоляции для `Cross-Origin-Opener-Policy: same-origin-allow-popups`, что позволит сохранить связь с окном, которое открылось самостоятельно.

Если вам не удается включить межсайтовую изоляцию из-за этой проблемы, рекомендуем [зарегистрироваться для испытаний Origin Trial](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial) и подождать, пока не станет доступно новое условие. Мы не планируем завершать испытания до тех пор, пока эта проблема не будет разрешена.

{% endAside %}

Группа контекста просмотра — это группа вкладок, окон или фреймов, которые используют один и тот же контекст. Например, если веб-сайт (`https://a.example`) открывает всплывающее окно (`https://b.example`), открывающее и всплывающее окна используют один и тот же контекст просмотра, и они имеют доступ друг к другу через DOM API, такие как `window.opener`.

{% Img src="image/admin/g42eZMpIKNbUL0cN6yjC.png", alt="Группа контекста просмотра", width="470", height="469" %}

Вы можете проверить, находятся ли открывающее и открытое окна в отдельных группах контекста просмотра [в DevTools](#devtools-coop).

{% Aside 'codelab' %} [Посмотрите эффект различных параметров COOP](https://cross-origin-isolation.glitch.me/coop). {% endAside %}

#### 2. Убедитесь, что для ресурсов включены CORP или CORS

Убедитесь, что все ресурсы на странице загружены с заголовками CORP или CORS HTTP. Этот шаг необходим для [четвертого шага, включающего COEP](#enable-coep).

Вот что нужно сделать в зависимости от характера ресурса:

- Если ожидается, что ресурс будет загружен **только из того же источника**, установите заголовок `Cross-Origin-Resource-Policy: same-origin`.
- Если ожидается, что ресурс будет загружен **только с того же сайта, но из другого источника**, установите заголовок `Cross-Origin-Resource-Policy: same-site`.
- Если ресурс **загружается из перекрестных источников под вашим контролем**, установите заголовок `Cross-Origin-Resource-Policy: cross-origin`, если это возможно.
- Для ресурсов из разных источников, которые вы не контролируете:
    - Используйте атрибут `crossorigin` в теге загрузки HTML, если ресурс обслуживается с помощью CORS. (Например, `<img src="***" crossorigin>`.)
    - Попросите владельца ресурса о поддержке CORS или CORP.
- Для окон iframe используйте заголовки CORP и COEP следующим образом: `Cross-Origin-Resource-Policy: same-origin` (или `same-site`, `cross-origin` в зависимости от контекста) и `Cross-Origin-Embedder-Policy: require-corp`.

{% Aside 'gotchas' %} Вы можете включить межсайтовую изоляцию для документа, встроенного в iframe, применив политику функции `allow="cross-origin-isolated"` к тегу `<iframe>` и соблюдая аналогичные условия, описанные в этом документе. Обратите внимание, что вся цепочка документов, включая родительские фреймы и дочерние фреймы, также должна быть изолирована от разных источников. {% endAside %}

{% Aside 'key-term' %} Важно понимать разницу между «одинаковым сайтом» (same-site) и «одинаковым источником» (same-origin). Узнайте о различиях в разделе «[Понятия same-site и same-origin](/same-site-same-origin)». {% endAside %}

#### 3. Используйте HTTP-заголовок COEP Report-Only для оценки встроенных ресурсов

Перед тем, как полностью включить COEP, вы можете выполнить формальный прогон, используя заголовок `Cross-Origin-Embedder-Policy-Report-Only`, чтобы проверить, действительно ли работает политика. Вы будете получать отчеты без блокировки встроенного контента. Рекурсивно примените это ко всем документам. Информацию о HTTP-заголовке только для отчетов см. в разделе [Наблюдение за проблемами с помощью Reporting API](#observe-issues-using-the-reporting-api).

#### 4. Включите COEP {: #enable-coep }

Убедившись, что все работает и все ресурсы могут быть успешно загружены, примените HTTP-заголовок `Cross-Origin-Embedder-Policy: require-corp` ко всем документам, включая те, которые встроены через iframe.

{% Aside 'codelab' %} [Посмотрите эффект различных параметров COEP/CORP](https://cross-origin-isolation.glitch.me/coep). {% endAside %}

{% Aside %} [Squoosh](https://squoosh.app) (PWA для оптимизации изображений) [теперь использует COOP/COEP](https://github.com/GoogleChromeLabs/squoosh/pull/829/files#diff-316f969413f2d9a065fcc08c7a5589c088dd1e21deebadccfc5a4372ac5e0cbbR22-R23) для получения доступа к потокам Wasm (и Shared Array Buffer), а также в Android Chrome. {% endAside %}

{% Aside 'caution' %}

Мы изучали разные способы масштабирования `Cross-Origin-Resource-Policy`, поскольку межсайтовая изоляция требует явного разрешения на загрузку для всех вспомогательных ресурсов. В итоге было решено пойти от обратного и ввести [новый «безучетный» (credentialless) режим COEP](https://github.com/mikewest/credentiallessness/), который позволяет загружать ресурсы без заголовка CORP, удаляя все их учетные данные. Мы еще окончательно не определились с тем, как это должно работать, но надеемся, что данный режим снизит для вас трудоемкость проверки того, что вспомогательные ресурсы отправляют заголовок `Cross-Origin-Resource-Policy`.

Если вам не удается включить межсайтовую изоляцию из-за этой проблемы, рекомендуем [зарегистрироваться для испытаний Origin Trial](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial) и подождать, пока не появится новый режим. Мы не планируем завершать испытания до тех пор, пока новый режим не будет доступен.

{% endAside %}

### Определение, удалась ли изоляция, с помощью `self.crossOriginIsolated`

Свойство `self.crossOriginIsolated` возвращает `true`, когда веб-страница находится в состоянии межсайтовой изоляции и все ресурсы и окна изолированы в одной и той же группе контекста просмотра. Вы можете использовать этот API, чтобы определить, успешно ли вы изолировали группу контекста просмотра и получили ли доступ к мощным функциям, таким как `performance.measureUserAgentSpecificMemory()`.

### Отладка с помощью Chrome DevTools

{% YouTube 'D5DLVo_TlEA'%}

Для ресурсов, которые отображаются на экране, таких как изображения, довольно легко обнаружить проблемы COEP, поскольку запрос будет заблокирован, а на странице будет указано отсутствующее изображение. Однако для ресурсов, которые не обязательно имеют визуальный эффект, например, сценарии или стили, проблемы COEP могут остаться незамеченными. Для них используйте панель «Сеть» в DevTools. Если есть проблема с COEP, вы должны увидеть `(blocked:NotSameOriginAfterDefaultedToSameOriginByCoep)` в столбце «**Статус**».

<figure>{% Img src="image/admin/iGwe4M1EgHzKb2Tvt5bl.jpg", alt="Проблемы с COEP в столбце «Статус» на панели «Сеть».", width="800", height="444" %}</figure>

Затем вы можете нажать на запись, чтобы увидеть более подробную информацию.

<figure>{% Img src="image/admin/1oTBjS9q8KGHWsWYGq1N.jpg", alt="Подробная информация о проблеме COEP отображается на вкладке «Заголовки» после щелчка по сетевому ресурсу на панели «Сеть».", width="800", height="241" %}</figure>

Вы также можете определить статус iframe и всплывающих окон через панель «**Приложения**». Перейдите в раздел «Фреймы» слева и разверните «верх», чтобы увидеть разбор структуры ресурсов.

<span id="devtools-coep-iframe">Вы можете проверить статус iframe, например, доступность SharedArrayBuffer и т. д.</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/9titfaieIs0gwSKnkL3S.png", alt="Chrome DevTools iframe Inspector", width="800", height="480" %}</figure>

<span id="devtools-coop">Вы также можете проверить статус всплывающих окон, например, изолированы ли они от разных источников.</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/kKvPUo2ZODZu8byK7gTB.png", alt="Инспектор всплывающих окон Chrome DevTools", width="800", height="480" %}</figure>

### Наблюдение за проблемами с помощью Reporting API

[Reporting API](/reporting-api) — еще один механизм, с помощью которого вы можете обнаруживать различные проблемы. Вы можете настроить Reporting API так, чтобы браузер ваших пользователей отправлял отчет всякий раз, когда COEP блокирует загрузку ресурса или COOP изолирует всплывающее окно. Chrome поддерживает Reporting API с версии 69 для различных целей, включая COEP и COOP.

{% Aside %}

Уже используете Reporting API с заголовком `Report-To`? Chrome переходит на новую версию Reporting API, которая заменяет `Report-To` на `Reporting-Endpoints`; подумайте о переходе на новую версию. Подробности см. в статье «[Переход на Reporting API v1](/reporting-api-migration)».

{% endAside %}

Чтобы узнать, как настроить Reporting API и сервер для получения отчетов, перейдите в раздел «[Использование Reporting API](/reporting-api/#using-the-reporting-api)».

#### Пример отчета COEP

Пример полезной нагрузки [отчета COEP](https://html.spec.whatwg.org/multipage/origin.html#coep-report-type), когда ресурс из другого источника заблокирован, выглядит следующим образом:

```json
[{
  "age": 25101,
  "body": {
    "blocked-url": "https://third-party-test.glitch.me/check.svg?",
    "blockedURL": "https://third-party-test.glitch.me/check.svg?",
    "destination": "image",
    "disposition": "enforce",
    "type": "corp"
  },
  "type": "coep",
  "url": "https://cross-origin-isolation.glitch.me/?coep=require-corp&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4249.0 Safari/537.36"
}]
```

{% Aside 'caution' %} `blocked-url` используется только для обратной совместимости и в [конечном итоге будет удален](https://github.com/whatwg/html/pull/5848). {% endAside %}

#### Пример отчета COOP

Пример полезной нагрузки [отчета COOP](https://html.spec.whatwg.org/multipage/origin.html#reporting) при изолированном открытии всплывающего окна выглядит так:

```json
[{
  "age": 7,
  "body": {
    "disposition": "enforce",
    "effectivePolicy": "same-origin",
    "nextResponseURL": "https://third-party-test.glitch.me/popup?report-only&coop=same-origin&",
    "type": "navigation-from-response"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

Когда разные группы контекста просмотра пытаются получить доступ друг к другу (в режиме «только отчет»), COOP также отправляет отчет. Например, отчет при `postMessage()` будет выглядеть так:

```json
[{
  "age": 51785,
  "body": {
    "columnNumber": 18,
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "lineNumber": 83,
    "property": "postMessage",
    "sourceFile": "https://cross-origin-isolation.glitch.me/popup.js",
    "type": "access-from-coop-page-to-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
},
{
  "age": 51785,
  "body": {
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "property": "postMessage",
    "type": "access-to-coop-page-from-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

## Заключение

Используйте комбинацию заголовков HTTP COOP и COEP, чтобы перевести веб-страницу в особое состояние межсайтовой изоляции. Вы можете проверить значение `self.crossOriginIsolated`, чтобы определить, находится ли веб-страница в состоянии межсайтовой изоляции.

Мы будем обновлять этот пост, поскольку в этом состоянии межсайтовой изоляции будут доступны новые функции, а также будут внесены дальнейшие улучшения в DevTools, связанные с COOP и COEP.

## Ресурсы

- [Зачем вам нужна межсайтовая изоляция для мощных функций](/why-coop-coep/)
- [Руководство по включению межсайтовой изоляции](/cross-origin-isolation-guide/)
- [Обновления SharedArrayBuffer в Android Chrome 88 и Desktop Chrome 92](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
- [Отслеживание общего использования памяти веб-страницей с помощью метода `measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/)
