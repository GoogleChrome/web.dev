---
layout: post
title: Избегайте цепочек критических запросов
description: Узнайте, что такое цепочки критических запросов, как они влияют на производительность веб-страницы и как можно уменьшить этот эффект.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - critical-request-chains
---

[Цепочка критических запросов](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) — это последовательность зависимых друг от друга сетевых запросов, необходимых для рендеринга страницы. Чем длиннее цепочка и чем и больше размер скачиваемых данных, тем сильнее будет влияние на производительность при загрузке страницы.

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) оповещает о критических запросах, загружаемых с высоким приоритетом:

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/apWYFAWSuxf9tQHuogSN.png", alt="Скриншот проверки Minimize critical request depth («Минимизируйте глубину критических запросов») в Lighthouse", width="800", height="452" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как Lighthouse выявляет цепочки критических запросов

Lighthouse использует сетевой приоритет в качестве косвенного критерия для определения критических ресурсов, блокирующих рендеринг. Подробнее о том, как Chrome определяет сетевой приоритет, см. в статье [Chrome Resource Priorities and Scheduling](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) (Google).

Данные о цепочках критических запросов, размерах ресурсов и времени, затрачиваемом на их загрузку, извлекаются при помощи [Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol).

## Как уменьшить влияние цепочек критических запросов на производительность

Используйте результаты проверки цепочек критических запросов, чтобы сосредоточиться прежде всего на ресурсах, которые сильнее всего влияют на загрузку страницы:

- Сведите к минимуму количество критических ресурсов: удалите их, используйте для них отложенную загрузку, пометьте их как `async` и т. д.
- Сократите объем критических ресурсов в байтах, чтобы уменьшить время их загрузки (количество циклов обмена).
- Оптимизируйте порядок загрузки оставшихся критических ресурсов: загружайте все критические ресурсы как можно раньше, чтобы сократить длину критического пути.

Читайте подробнее об оптимизации [изображений](/use-imagemin-to-compress-images), [JavaScript](/apply-instant-loading-with-prpl), [CSS](/defer-non-critical-css) и [веб-шрифтов](/avoid-invisible-text).

## Рекомендации по стекам

### Magento

Если вы не объединяете JavaScript-ресурсы в бандлы, попробуйте использовать [baler](https://github.com/magento/baler).

## Ресурсы

[Исходный код проверки **Minimize critical request depth** («Минимизируйте глубину критических запросов»)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/critical-request-chains.js)
