---
layout: post
title: Предварительная загрузка ключевых запросов
description: Узнайте о проверке предварительной загрузки ключевых запросов.
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
  - uses-rel-preload
---

В разделе Opportunities (Возможности) отчета Lighthouse запросы третьего уровня в критической цепочке запросов помечаются в качестве кандидатов на предварительную загрузку:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fvwBQLvwfogd6ukq4vTZ.png", alt="Скриншот проверки Preload key requests (Предварительная загрузка ключевых запросов) в Lighthouse", width="800", height="214" %}</figure>

## Как Lighthouse определяет кандидатов на предварительную загрузку

Предположим, [цепочка критических запросов](/critical-request-chains) вашей страницы выглядит так:

```html
index.html
|--app.js
   |--styles.css
   |--ui.js
```

В ваш файл `index.html` включен `<script src="app.js">`. Когда запускается `app.js`, он вызывает `fetch()` для загрузки `styles.css` и `ui.js`. Пока 2 последние ресурса не будут загружены, проанализированы и запущены, страница будет выглядеть неполной. В приведенном выше примере в качестве кандидатов Lighthouse отметил бы `styles.css` styles.css и `ui.js`.

При настроенной предварительной загрузке потенциальная экономия будет зависеть от того, насколько раньше браузер сможет запускать запросы. Например, если `app.js` требует 200 мс для загрузки, анализа и выполнения, то потенциальная экономия для каждого ресурса составляет 200 мс, поскольку `app.js` больше не является узким местом для каждого из запросов.

Предварительная загрузка запросов может ускорить загрузку страниц сайта.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OiT1gArpZxNliikhBgx7.png", alt="Если предварительная загрузка не настроена, styles.css и ui.js запрашиваются только после загрузки, анализа и выполнения app.js.", width="800", height="486" %} <figcaption> Если предварительная загрузка не настроена, <code>styles.css</code> и <code>ui.js</code> запрашиваются только после загрузки, анализа и выполнения <code>app.js</code>. </figcaption></figure>

Проблема здесь в том, что браузер узнает об этих 2 последних ресурсах только после загрузки, анализа и выполнения `app.js`. Но вам известно, что эти ресурсы важны и их следует загрузить как можно скорее.

## Объявите для атрибута rel тега link значение preload

Настройте предварительную загрузку в HTML-коде страницы, чтобы браузер загружал ключевые ресурсы как можно скорее.

```html
<head>
  ...
  <link rel="preload" href="styles.css" as="style">
  <link rel="preload" href="ui.js" as="script">
  ...
</head>
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tJLJXH2qXcrDBUfsSAK5.png", alt="Если предварительная загрузка настроена, styles.css и ui.js запрашиваются одновременно с app.js.", width="800", height="478" %} <figcaption> Если предварительная загрузка настроена, <code>styles.css</code> и <code>ui.js</code> запрашиваются одновременно с <code>app.js</code>. </figcaption></figure>

Более подробная информация приведена в статье [«Настройте предварительную загрузку критически важных ресурсов для повышения скорости загрузки»](/preload-critical-assets).

### Совместимость с браузером

По состоянию на июнь 2020 года предварительная загрузка поддерживалась в браузерах на основе Chromium. Актуальность информации проверяйте по ссылке [«Совместимость с браузером»](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility).

### Поддержка предварительной загрузки в системах сбора проектов {: #tools}

См. страницу [Preloading Assets (Предварительная загрузка ресурсов) на сайте Tooling.Report](https://bundlers.tooling.report/non-js-resources/html/preload-assets/?utm_source=web.dev&utm_campaign=lighthouse&utm_medium=uses-rel-preload).

## Руководство по стекам

### Angular

[Предварительно загружайте маршруты](/route-preloading-in-angular/), чтобы ускорить навигацию.

### Magento

[Измените макет своей темы](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html) и добавьте теги `<link rel=preload>`.

## Ресурсы

- [Исходный код для проверки **предварительной загрузки ключевых запросов**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preload.js).
