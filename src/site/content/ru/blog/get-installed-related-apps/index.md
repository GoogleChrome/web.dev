---
layout: post
title: Установлено ли ваше приложение? getInstalledRelatedApps() покажет!
subhead: Метод getInstalledRelatedApps() позволяет вашему веб-сайту проверять, установлено ли ваше приложение для iOS/Android/десктопа или PWA на устройстве пользователя.
authors:
  - petelepage
description: API getInstalledRelatedApps() — это API веб-платформы, который позволяет проверить, установлено ли ваше приложение для iOS/Android/десктопа или PWA на устройстве пользователя.
date: 2018-12-20
updated: 2021-09-16
tags:
  - blog
  - capabilities
hero: image/admin/v9t93rXITPqFe3L0qlTN.jpg
alt: мобильное устройство с открытой панелью приложения
feedback:
  - api
---

## Что такое API getInstalledRelatedApps()? {: #what }

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vjamv2uyz6NxBPxPIm11.jpg", alt="", width="550", height="486" %} <figcaption> Веб-сайт, использующий <code>getInstalledRelatedApps()</code>, чтобы определить, установлено ли его приложение для Android. </figcaption></figure>

[`getInstalledRelatedApps()`](https://wicg.github.io/get-installed-related-apps/spec/) позволяет *вашей* странице проверять, установлено ли *ваше* мобильное или десктопное приложение или, в некоторых случаях, прогрессивное веб-приложение (PWA) на устройстве пользователя, и позволяет настраивать взаимодействие с пользователем, когда приложение установлено.

Например, если ваше приложение уже установлено:

- Перенаправление пользователя с маркетинговой страницы продукта прямо в ваше приложение.
- Централизация некоторых функций, например, уведомлений, в другом приложении для предотвращения дублирования.
- Прекращение [рекламы установки](/customize-install/) PWA, если другое ваше приложение уже установлено.

Чтобы использовать API `getInstalledRelatedApps()`, вам необходимо сообщить своему приложению о своем сайте, а затем сообщить своему сайту о своем приложении. Определив связь между ними, вы можете проверить, установлено ли приложение.

### Поддерживаемые типы приложений, которые можно проверить

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>Тип приложения</th>
        <th>Проверяется с</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#check-android">Приложение для Android</a></td>
        <td>Только Android<br> Chrome 80 или новее</td>
      </tr>
      <tr>
        <td><a href="#check-windows">Приложение для Windows (UWP)</a></td>
        <td>Только Windows<br> Chrome 85 или новее<br> Edge 85 или новее</td>
      </tr>
      <tr>
        <td>Прогрессивное веб-приложение<br> Установлено в <a href="#check-pwa-in-scope">той же</a> или <a href="#check-pwa-out-of-scope">другой области определения</a>.</td>
        <td>Только Android<br> Chrome 84 или новее</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} API `getInstalledRelatedApps()` позволяет только проверять, установлены ли *ваши* приложения. Вы не можете получить список всех установленных приложений или проверить, установлены ли другие сторонние приложения. {% endAside %}

<!--  Android App -->

## Проверка, установлено ли ваше приложение для Android {: #check-android }

Ваш веб-сайт может проверить, установлено ли ваше приложение для Android.

{% Compare 'better', 'Поддерживается для' %} Android: Chrome 80 или новее {% endCompare %}

### Сообщите своему Android-приложению о своем веб-сайте

Во-первых, необходимо обновить приложение Android, чтобы определить взаимосвязь между вашим веб-сайтом и приложением Android с помощью системы [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started). Это гарантирует, что только ваш веб-сайт сможет проверить, установлено ли ваше приложение для Android.

В `AndroidManifest.xml` вашего Android-приложения добавьте запись `asset_statements`:

```xml
<manifest>
  <application>
   …
    <meta-data android:name="asset_statements" android:resource="@string/asset_statements" />
   …
  </application>
</manifest>
```

Затем в `strings.xml` добавьте следующую инструкцию ресурса, обновляя `site` со своим доменом. Не забудьте добавить escape-символы.

```xml
<string name="asset_statements">
  [{
    \"relation\": [\"delegate_permission/common.handle_all_urls\"],
    \"target\": {
      \"namespace\": \"web\",
      \"site\": \"https://example.com\"
    }
  }]
</string>
```

После завершения опубликуйте обновленное приложение для Android в магазине Play.

### Сообщите своему сайту о своем приложении для Android

Затем сообщите своему веб-сайту о своем приложении для Android, добавив на свою страницу [манифест веб-приложения](/add-manifest/). Манифест должен включать свойство `related_applications`, массив, который предоставляет подробную информацию о вашем приложении, в том числе `platform` и `id`.

- Значение `platform` должно быть `play`
- `id` — это идентификатор приложения GooglePlay для вашего Android-приложения

```json
{
  "related_applications": [{
    "platform": "play",
    "id": "com.android.chrome",
  }]
}
```

### Проверка, установлено ли ваше приложение

Наконец, вызовите [`navigator.getInstalledRelatedApps()`](#use) чтобы проверить, установлено ли ваше приложение для Android.

Попробуйте [демонстрацию](https://get-installed-apps.glitch.me/)

<!--  Windows App -->

## Проверка, установлено ли ваше приложение для Windows (UWP) {: #check-windows }

Ваш веб-сайт может проверить, установлено ли ваше приложение для Windows (созданное с использованием UWP).

{% Compare 'better', 'Поддерживается для' %} Windows: Chrome 85 или новее, Edge 85 или новее {% endCompare %}

### Сообщите приложению Windows о своем веб-сайте

Необходимо обновить приложение Windows, чтобы определить связь между вашим веб-сайтом и приложением Windows с помощью [обработчиков URI](https://docs.microsoft.com/en-us/windows/uwp/launch-resume/web-to-app-linking). Это гарантирует, что только ваш веб-сайт сможет проверить, установлено ли ваше приложение для Windows.

Добавьте расширение `Windows.appUriHandler` в файл манифеста вашего приложения `Package.appxmanifest`. Например, если адрес вашего веб-сайта — `example.com`, нужно добавить следующую запись в манифест приложения:

```xml
<Applications>
  <Application Id="App" ... >
      ...
      <Extensions>
         <uap3:Extension Category="windows.appUriHandler">
          <uap3:AppUriHandler>
            <uap3:Host Name="example.com" />
          </uap3:AppUriHandler>
        </uap3:Extension>
      </Extensions>
  </Application>
</Applications>
```

Обратите внимание, что может потребоваться добавить [пространство имен `uap3`](https://docs.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-uap3-extension-manual#examples) к атрибуту `<Package>`.

Затем создайте файл JSON (без расширения `.json`) с именем `windows-app-web-link` и укажите имя семейства пакетов вашего приложения. Поместите этот файл либо в корень вашего сервера, либо в каталог `/.well-known/`. Имя семейства пакетов можно найти в разделе «Упаковка» в конструкторе манифеста приложения.

```json
[{
  "packageFamilyName": "MyApp_9jmtgj1pbbz6e",
  "paths": [ "*" ]
}]
```

См. [Включение приложений для веб-сайтов с помощью обработчиков URI приложений](https://docs.microsoft.com/en-us/windows/uwp/launch-resume/web-to-app-linking) для получения полной информации о настройке обработчиков URI.

### Сообщите своему сайту о своем приложении для Windows

Затем сообщите своему веб-сайту о своем приложении для Windows, добавив на свою страницу [манифест веб-приложения](/add-manifest/). Манифест должен включать свойство `related_applications`, массив, который предоставляет подробную информацию о вашем приложении, в том числе `platform` и `id`.

- Значение `platform` должно быть `windows`
- `id` — это имя семейства пакетов вашего приложения, добавленное значением `<Application>` `Id` в файл `Package.appxmanifest`.

```json
{
  "related_applications": [{
    "platform": "windows",
    "id": "MyApp_9jmtgj1pbbz6e!App",
  }]
}
```

### Проверка, установлено ли ваше приложение

Наконец, вызовите [`navigator.getInstalledRelatedApps()`](#use) чтобы проверить, установлено ли ваше приложение для Windows.

<!--  PWA - in scope -->

## Проверка, установлено ли ваше прогрессивное веб-приложение (в области определения) {: #check-pwa-in-scope }

Ваше PWA может проверить, установлено ли оно. В этом случае страница, отправляющая запрос, должна находиться в том же домене и в [области определения](/add-manifest/#scope) вашего PWA, как обозначено в манифесте веб-приложения.

{% Compare 'better', 'Поддерживается для' %} Android: Chrome 84 или новее {% endCompare %}

### Сообщите своему PWA о нем

Сообщите своему PWA о нем, добавив запись `related_applications` в [манифест веб-приложения](/add-manifest/) PWA.

- Значение `platform` должно быть `webapp`
- `url` — это полный путь к манифесту веб-приложения вашего PWA

```json
{
  …
  "scope": "/",
  "start_url": "/",
  "related_applications": [{
    "platform": "webapp",
    "url": "https://example.com/manifest.json",
  }],
  …
}
```

### Проверка, установлено ли ваше PWA

Наконец, вызовите [`navigator.getInstalledRelatedApps()`](#use) из [области определения](/add-manifest/#scope) вашего PWA, чтобы проверить, установлено ли оно. Если `getInstalledRelatedApps()` вызывается вне области определения вашего PWA, метод вернет false. См. подробности в следующем разделе.

Попробуйте [демонстрацию](https://gira-same-domain.glitch.me/pwa/)

<!--  PWA - NOT in scope -->

## Проверка, установлено ли ваше прогрессивное веб-приложение (вне области определения) {: #check-pwa-out-of-scope }

Ваш сайт может проверить, установлено ли ваше PWA, даже если страница находится вне [области определения](/add-manifest/#scope) вашего PWA. Например, целевая страница, обслуживаемая с `/landing/`, может проверять, установлено ли PWA, обслуживаемое с `/pwa/`, или же ваша целевая страница обслуживается с `www.example.com`, а PWA — с `app.example.com`.

{% Compare 'better', 'Поддерживается для' %} Android: Chrome 84 или новее {% endCompare %}

### Сообщите своему PWA о своем веб-сайте

Во-первых, нужно добавить ссылки на цифровые ресурсы на сервер, с которого обслуживается ваше PWA. Это поможет определить взаимосвязь между вашим веб-сайтом и вашим PWA и гарантирует, что только ваш веб-сайт сможет проверить, установлено ли ваше PWA.

Добавьте файл `assetlinks.json` в каталог [`/.well-known/`](https://tools.ietf.org/html/rfc5785) домена, где находится PWA, например, `app.example.com`. В свойстве `site` укажите полный путь к манифесту веб-приложения, которое будет выполнять проверку (а не к манифесту веб-приложения вашего PWA).

```json
// Обслуживается с https://app.example.com/.well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.query_webapk"],
    "target": {
      "namespace": "web",
      "site": "https://www.example.com/manifest.json"
    }
  }
]
```

{% Aside %} Перепроверьте имя файла при создании `assetlinks.json`. Я потратил много часов на отладку и только потом понял, что добавил лишнюю букву «s» в имя файла. {% endAside %}

### Сообщите своему сайту о своем PWA

Затем сообщите своему веб-сайту о своем PWA, добавив на свою страницу [манифест веб-приложения](/add-manifest/). Манифест должен включать свойство `related_applications`, массив, который предоставляет подробную информацию о вашем PWA, в том числе `platform` и `url`.

- Значение `platform` должно быть `webapp`
- `url` — это полный путь к манифесту веб-приложения вашего PWA

```json
{
  "related_applications": [{
    "platform": "webapp",
    "url": "https://app.example.com/manifest.json",
  }]
}
```

### Проверка, установлено ли ваше PWA

Наконец, вызовите [`navigator.getInstalledRelatedApps()`](#use), чтобы проверить, установлено ли ваше PWA.

Попробуйте [демонстрацию](https://gira-same-domain.glitch.me/)

<!--  Use the API-->

## Вызов getInstalledRelatedApps() {: #use }

Вызов `navigator.getInstalledRelatedApps()` возвращает обещание, которое разрешается с массивом ваших приложений, установленных на устройстве пользователя.

```js
const relatedApps = await navigator.getInstalledRelatedApps();
relatedApps.forEach((app) => {
  console.log(app.id, app.platform, app.url);
});
```

Чтобы сайты не тестировали слишком широкий набор собственных приложений, во внимание будут приниматься только первые три приложения, объявленные в манифесте веб-приложения.

Как и большинство других мощных веб-API, API `getInstalledRelatedApps()` доступен только при обслуживании по **HTTPS**.

## Остались вопросы? {: #questions }

Остались вопросы? Поищите записи с тегом [`getInstalledRelatedApps` на StackOverflow](https://stackoverflow.com/search?q=getinstalledrelatedapps), чтобы узнать, были ли у кого-нибудь похожие вопросы. Если нет, задайте там свой [вопрос](https://stackoverflow.com/questions/tagged/progressive-web-apps) и обязательно пометьте его тегом [`progressive-web-apps`](https://stackoverflow.com/questions/tagged/progressive-web-apps). Наша команда часто отслеживает этот тег и старается ответить на ваши вопросы.

## Отзывы {: #feedback}

Вы нашли ошибку в реализации Chrome? Реализация отличается от спецификации?

- Сообщите об ошибке на [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Mobile%3EWebAPKs). Обязательно укажите как можно больше подробностей, простые инструкции по воспроизведению ошибки и введите `Mobile>WebAPKs` в поле «**Components**». [Glitch](https://glitch.com) отлично подходит для быстрого и легкого воспроизведения ошибок.

## Поддержите API

Собираетесь использовать API `getInstalledRelatedApps()`? Ваша публичная поддержка помогает команде Chrome расставлять функции в порядке приоритетности и показывает другим поставщикам браузеров, насколько важно их поддерживать.

- Расскажите, как вы планируете использовать API, в [ветке обсуждения WICG](https://discourse.wicg.io/t/proposal-get-installed-related-apps-api/1602) .
- Отправьте твит на [@ChromiumDev](https://twitter.com/chromiumdev) с хэштегом [`#getInstalledRelatedApps`](https://twitter.com/search?q=%23getInstalledRelatedApps&src=typed_query&f=live) и сообщите нам, где и как вы его используете.

## Полезные ссылки {: #helpful }

- [Общедоступное объяснение API `getInstalledRelatedApps()`](https://github.com/WICG/get-installed-related-apps/blob/main/EXPLAINER.md)
- [Черновая спецификация](https://wicg.github.io/get-installed-related-apps/spec/)
- [Отслеживание ошибок](https://bugs.chromium.org/p/chromium/issues/detail?id=895854)
- [Запись на ChromeStatus.com](https://www.chromestatus.com/feature/5695378309513216)
- Компонент Blink: [`Mobile>WebAPKs`](https://chromestatus.com/features#component%3A%20Mobile%3EWebAPKs)

## Благодарности

Особая благодарность Сунггуку Чу из Microsoft за помощь с тонкостями тестирования приложений для Windows и Райану Кансо за помощь с тонкостями Chrome.
