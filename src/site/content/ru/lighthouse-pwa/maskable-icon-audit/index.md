---
layout: post
title: "Аудит Manifest doesn't have a maskable icon"
description: |2-

  Узнайте, как добавить поддержку маскируемых значков в прогрессивное веб-приложение (PWA).
web_lighthouse:
  - maskable-icon
date: 2020-05-06
---

[Маскируемые значки](/maskable-icon/) — это новый формат значков, благодаря которому значки прогрессивных веб-приложений (PWA) отлично выглядят на всех устройствах с ОС Android. На новых устройствах с ОС Android значки прогрессивных веб-приложений, которые не соответствуют формату маскируемых значков, имеют белый фон. При использовании маскируемого значка он занимает все пространство, отведенное для него ОС Android.

## Почему не удается пройти аудит маскируемых значков в Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) помечает страницы, не поддерживающие маскируемые значки:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0lXCcsZdOeLZuAw3wbY.jpg", alt="Аудит маскируемых значков в пользовательском интерфейсе отчетов Lighthouse.", width="800", height="110" %}</figure>

Для успешного прохождения аудита должны быть выполнены указанные ниже условия.

- Должен существовать манифест веб-приложения.
- В манифесте веб-приложения должен быть массив `icons`.
- В массиве `icons` должен быть один объект со свойством `purpose`. В свойстве `purpose` должно содержаться значение `maskable`.

{% Aside 'caution' %} Lighthouse не проверяет изображение, указанное в качестве маскируемого значка. Вам потребуется вручную проверить, хорошо ли оно отображается. {% endAside %}

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Добавление поддержки маскируемых значков в прогрессивное приложение (PWA)

1. Преобразуйте существующий значок в маскируемый значок с помощью [редактора Maskable.app](https://maskable.app/editor).

2. Добавьте свойство `purpose` в один из объектов `icons` в [манифесте веб-приложения](/add-manifest/). Задайте для свойства `purpose` значение `maskable` или `any maskable`. См. раздел «[Значения](https://developer.mozilla.org/docs/Web/Manifest/icons#Values)».

    ```json/8
    {
      …
      "icons": [
        …
        {
          "src": "путь/к/маскируемому_значку.png",
          "sizes": "196x196",
          "type": "image/png",
          "purpose": "any maskable"
        }
      ]
      …
    }
    ```

3. С помощью Chrome DevTools проверьте, правильно ли отображается маскируемый значок. См. раздел «[Готовы ли мои текущие значки?](/maskable-icon/#are-my-current-icons-ready)».

## Ресурсы

- [Исходный код аудита **Manifest doesn't have a maskable icon**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/maskable-icon.js)
- [Поддержка адаптивных значков в прогрессивных веб-приложениях (PWA) с маскируемыми значками](/maskable-icon/)
- [Редактор Maskable.app](https://maskable.app/editor)
- [Добавление манифеста веб-приложения](/add-manifest/)
- [Свойство `icons` в MDN](https://developer.mozilla.org/docs/Web/Manifest/icons)
