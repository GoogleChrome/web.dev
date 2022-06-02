---
layout: post
title: Убедитесь, что текст остается видимым во время загрузки веб-шрифта
description: Узнайте, как использовать API font-display, чтобы убедиться, что текст вашей веб-страницы всегда виден пользователям.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - font-display
---

Шрифты часто представляют собой большие файлы, загрузка которых требует времени. Некоторые браузеры скрывают текст до загрузки шрифта, вызывая побочный эффект, известный как [мигание невидимого текста (FOIT)](/avoid-invisible-text).

## Причины плохих результатов проверки отображения шрифтов в Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) отмечает URL-адреса любых шрифтов, которые могут мигать невидимым текстом:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/251Gbh9tn89GDJY289zZ.png", alt="Скриншот проверки Lighthouse «Убедитесь, что текст остается видимым во время загрузки веб-шрифтов»", width="800", height="430" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как избежать отображения невидимого текста

Самый простой способ избежать отображения невидимого текста при загрузке пользовательских шрифтов — это временно отобразить системный шрифт. Включив `font-display: swap` в свой `@font-face`, вы можете избежать FOIT в большинстве современных браузеров:

```css
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
}
```

[API font-display](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) определяет способ отображения шрифта. `swap` сообщает браузеру, что текст, использующий шрифт, должен немедленно отображаться с использованием системного шрифта. Когда пользовательский шрифт готов, он заменяет системный шрифт. (Для получения дополнительной информации см. статью [«Избегайте невидимого текста во время загрузки шрифта».)](/avoid-invisible-text)

### Предварительно загрузите веб-шрифты

Используйте `<link rel="preload" as="font">`, чтобы получить файлы шрифтов раньше. Дополнительные материалы:

- [Предварительная загрузка веб-шрифтов для повышения скорости загрузки (codelab)](/codelab-preload-web-fonts/).
- [Предотвращение смещения макета и мигания невидимого текста (FOIT) путем предварительной загрузки дополнительных шрифтов](/preload-optional-fonts/).

### Шрифты Google

Добавьте [параметр](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#Basics_anatomy_of_a_URL) `&display=swap` в конце вашего URL-адреса Google Fonts:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
```

## Поддержка браузера

Стоит отметить, что не все основные браузеры поддерживают `font-display: swap`, поэтому вам может потребоваться приложить больше усилий, чтобы исправить проблему с невидимым текстом.

{% Aside 'codelab' %} Ознакомьтесь с codelab [«Избегайте мигания невидимого текста»](/codelab-avoid-invisible-text), чтобы узнать, как избежать FOIT во всех браузерах. {% endAside %}

## Рекомендации по стекам

### Drupal

Укажите `@font-display` при определении пользовательских шрифтов в вашей теме.

### Magento

Укажите `@font-display` при [определении пользовательских шрифтов](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/css-topics/using-fonts.html).

## Ресурсы

- [Исходный код проверки **Ensure text remains visible during webfont** (Убедитесь, что текст остается видимым во время загрузки веб-шрифтов)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/font-display.js).
- [Избегайте невидимого текста во время загрузки шрифта](/avoid-invisible-text).
- [Управление производительностью шрифтов с помощью отображения шрифтов](https://developers.google.com/web/updates/2016/02/font-display).
- [Предварительная загрузка веб-шрифтов для повышения скорости загрузки (codelab)](/codelab-preload-web-fonts/).
- [Предотвращение смещения макета и мигания невидимого текста (FOIT) путем предварительной загрузки дополнительных шрифтов](/preload-optional-fonts/).
