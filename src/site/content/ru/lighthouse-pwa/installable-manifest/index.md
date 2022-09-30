---
layout: post
title: Аудит "Web app manifest does not meet the installability requirements"
description: |2-

  Узнайте, как сделать прогрессивное веб-приложение пригодным для установки.
web_lighthouse:
  - installable-manifest
codelabs:
  - codelab-make-installable
date: 2019-05-04
updated: 2019-09-19
---

Возможность установки — основное требование для [прогрессивных веб-приложений (PWA)](/discover-installable). Предлагая пользователям установить прогрессивное веб-приложение, вы предоставляете им возможность добавить его на начальный экран. Если пользователь добавит приложение на начальный экран, он будет чаще использовать это приложение.

В [манифесте веб-приложения](/add-manifest/) содержатся ключевые сведения, необходимые для того чтобы можно было устанавливать приложение.

## Почему не удается пройти аудит манифеста веб-приложения в Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) помечает страницы, у которых нет [манифеста веб-приложения](/add-manifest/), отвечающего минимальным требованиям для возможности установки приложения:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/039DlaixA4drrswBzSra.png", alt="Результаты аудита Lighthouse, в которых сказано, что пользователю не удастся установить веб-приложение на начальный экран", width="800", height="98" %}</figure>

Если в манифесте страницы нет указанных ниже свойств, она не пройдет аудит.

- Свойство [`short_name`](https://developer.mozilla.org/docs/Web/Manifest/short_name) или [`name`](https://developer.mozilla.org/docs/Web/Manifest/name)
- Свойство [`icons`](https://developer.mozilla.org/docs/Web/Manifest/icons), содержащее значок размером 192 x 192 пикселей и значок размером 512 x 512 пикселей.
- Свойство [`start_url`](https://developer.mozilla.org/docs/Web/Manifest/start_url)
- Свойство [`display`](https://developer.mozilla.org/docs/Web/Manifest/display) со значением `fullscreen`, `standalone` или `minimal-ui`
- Свойство [`prefer_related_applications`](https://developer.chrome.com/blog/app-install-banners-native/) со значением, отличным от `true`.

{% Aside 'caution' %} Манифест веб-приложения *необходим*, чтобы можно было устанавливать приложение, но его *недостаточно*. Сведения о том, как выполнить все требования, чтобы приложение поддерживало установку, см. в публикации [о том, что нужно, чтобы приложение поддерживало установку](/discover-installable). {% endAside %}

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Как сделать, чтобы прогрессивное приложение (PWA) поддерживало установку

Убедитесь, что у вашего приложения есть манифест, соответствующий указанным выше критериям. Дополнительные сведения о создании прогрессивных приложений (PWA) см. в коллекции [Installable](/installable/).

## Как проверить, поддерживает ли прогрессивное приложение (PWA) установку

### В браузере Chrome

Если прогрессивное веб-приложение соответствует минимальным требованиям для установки, Chrome запускает событие `beforeinstallprompt`, с помощью которого можно предлагать пользователям установить это приложение.

{% Aside 'codelab' %} Узнайте, как сделать приложение поддерживающим установку в Chrome, с помощью codelab «[Добавление возможности установки](/codelab-make-installable)». {% endAside %}

### В других браузерах

В других браузерах применяются разные критерии установки и запуска события `beforeinstallprompt`. Полные сведения см. на соответствующих перечисленных ниже сайтах.

- [Edge](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)
- [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
- [UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

## Ресурсы

- [Исходный код аудита **Web app manifest does not meet the installability requirements**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/installable-manifest.js)
- [Добавление манифеста веб-приложения](/add-manifest/)
- [Узнайте, что нужно, чтобы приложение поддерживало установку](/discover-installable)
- [Манифест веб-приложения](https://developer.mozilla.org/docs/Web/Manifest)
- Аудит [Does not use HTTPS](/is-on-https/)
