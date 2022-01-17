---
layout: post-old
title: Используйте пассивные прослушиватели для повышения производительности при прокрутке
description: Узнайте, как улучшить отзывчивость страницы при прокрутке, используя пассивные прослушиватели событий.
web_lighthouse:
  - uses-passive-event-listeners
date: 2019-05-02
updated: 2019-08-28
---

Прослушиватели событий касания и колеса мыши полезны для отслеживания действий пользователя и создания настраиваемых возможностей прокрутки, но они также могут задерживать прокрутку страницы. В настоящее время браузеры не могут знать, предотвратит ли прослушиватель событий прокрутку, поэтому они всегда ждут, пока завершится выполнение прослушивателя событий, прежде чем прокручивать страницу. Пассивные прослушиватели событий решают эту проблему, позволяя указать, что прослушиватель событий никогда не будет препятствовать прокрутке.

## Совместимость с браузером

Большинство браузеров поддерживают пассивные прослушиватели событий. См. [совместимость с браузером](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Browser_compatibility).

## Причины плохих результатов проверки пассивных прослушивателей событий в Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) отмечает прослушиватели событий, которые могут задерживать прокрутку страницы:

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a59Rk7aCUDvyKNqqoYRJ.png", alt="Проверка Lighthouse показывает, что страница не использует пассивные прослушиватели событий для повышения производительности при прокрутке (Does not use passive event listeners to improve scrolling performance)", width="800", height="213", class="w-screenshot" %}</figure>

Lighthouse использует следующий процесс для определения прослушивателей событий, которые могут повлиять на производительность при прокрутке:

1. Сбор всех прослушивателей событий на странице.
2. Фильтрация прослушивателей, не имеющих отношения к сенсорному вводу и колесу мыши.
3. Фильтрация прослушивателей, которые вызывают `preventDefault()`.
4. Фильтрация прослушивателей, которые находятся на хосте, отличном от хоста страницы.

Lighthouse отфильтровывает прослушивателей с разных хостов, потому что вы, вероятно, не контролируете эти скрипты. Могут существовать сторонние скрипты, которые снижают производительность при прокрутке вашей страницы, но они не будут указаны в отчете Lighthouse.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Как сделать прослушиватели событий пассивными, чтобы повысить производительность при прокрутке

Добавьте флаг `passive` к каждому прослушивателю событий, идентифицированному Lighthouse.

Если вы поддерживаете только браузеры с поддержкой пассивного прослушивателя событий, просто добавьте флаг. Например:

```js
document.addEventListener('touchstart', onTouchStart, {passive: true});
```

Если вы поддерживаете [старые браузеры, которые не поддерживают пассивные прослушиватели событий](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Browser_compatibility), вам необходимо использовать обнаружение функций или полизаполнение. Для получения дополнительной информации см. раздел [«Обнаружение функций»](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection) в документе WICG [«Пассивные прослушиватели событий»](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md).

## Ресурсы

- [Исходный код для проверки **Does not use passive listeners to improve scrolling performance (Пассивные прослушиватели событий не используются для улучшения производительности при прокрутке)**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-passive-event-listeners.js).
- [Повышение производительности при прокрутке с помощью пассивных прослушивателей событий](https://developers.google.com/web/updates/2016/06/passive-event-listeners).
- [Объяснение пассивных прослушивателей событий](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md).
- [EventTarget.addEventListener ()](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener).
