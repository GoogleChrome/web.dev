---
layout: post
title: Не установлен цвет темы для адресной строки (Does not set a theme color for the address bar)
description: |2-

  Из статьи вы узнаете, как установить цвет темы для адресной строки в современном веб-приложении.
web_lighthouse:
  - themed-omnibox
date: 2019-05-04
updated: 2020-06-17
---

Установив тему для адресной строки браузера согласно брендовым цветам своего [современного веб-приложения](/discover-installable) (Progressive Web App, PWA), вы сделаете интерфейс более единообразным.

## Совместимость с браузерами

На момент написания этой статьи темы для адресной строки браузера поддерживаются в браузерах на базе Android. В разделе [совместимости](https://developer.mozilla.org/docs/Web/Manifest/theme_color#Browser_compatibility) можно отслеживать состояние поддержки в различных браузерах.

## Аудит цвета темы в Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) помечает страницы, которые не применяют тему к адресной строке:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YadFSuw8denjl1hhnvFs.png", alt="Аудит Lighthouse показывает, что для адресной строки не установлена тема согласно цветам страницы", width="800", height="98" %}</figure>

Аудит считается непройденным, если Lighthouse не находит метатег `theme-color` в HTML-коде страницы или свойство `theme_color` в [манифесте веб-приложения](/add-manifest).

При этом Lighthouse не проверяет, являются ли найденные значения допустимыми цветами CSS.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Как установить цвет темы для адресной строки

### Шаг 1. Добавьте метатег `theme-color` на страницы, которые нужно оформить в стиле бренда

Метатег `theme-color` оформляет адресную строку в стиле бренда, когда пользователь заходит на сайт как на обычную веб-страницу. Установите для атрибута `content` тега любое допустимое значение цвета CSS:

```html/4
<!DOCTYPE html>
<html lang="en">
<head>
  …
  <meta name="theme-color" content="#317EFB"/>
  …
</head>
…
```

Подробнее о метатеге `theme-color` — в статье Google о <a href="https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android" data-md-type="link">поддержке `theme-color` в Chrome 39 для Android</a>.

### Шаг 2. Добавьте свойство `theme_color` в манифест веб-приложения

Свойство `theme_color` в манифесте веб-приложения оформляет адресную строку в стиле бренда, когда пользователь запускает PWA с главного экрана. В отличие от метатега `theme-color`, это свойство нужно определить только один раз — в [манифесте](/add-manifest). Установите для свойства любое допустимое значение цвета CSS:

```html/1
{
  "theme_color": "#317EFB"
  …
}
```

Браузер установит цвет адресной строки для всех страниц приложения согласно `theme_color` в манифесте.

## Материалы

- [Исходный код для аудита **Не установлен цвет темы для адресной строки** (Does not set a theme color for the address bar)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/themed-omnibox.js).
- [Как добавить манифест веб-приложения](/add-manifest).
- [Поддержка `theme-color` в Chrome 39 для Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android).
