---
layout: post
title: Откладывание закадровых изображений
description: |2

  Узнайте об аудите закадровых изображений.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - offscreen-images
---

В разделе «Возможности» вашего отчета Lighthouse перечислены все закадровые или скрытые изображения на вашей странице, а также потенциальная экономия в [кибибайтах (KiB)](https://en.wikipedia.org/wiki/Kibibyte). Рассмотрите возможность отложенной загрузки этих изображений после завершения загрузки всех критически важных ресурсов, чтобы сократить показатель [Time to Interactive (время до интерактивности)](/tti/):

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/agMyJtIarLruD8iuz0Mt.png", alt="Снимок экрана аудита откладывания закадровых изображений Lighthouse", width="800", height="416" %}</figure>

См. также раздел [«Отложенная загрузка закадровых изображений с помощью lazysizes codelab»](/codelab-use-lazysizes-to-lazyload-images).

## Руководство в зависимости от стека

### AMP

Настройте автоматическую отложенную загрузку изображений с помощью [`amp-img`](https://amp.dev/documentation/components/amp-img/). См. руководство [по изображениям](https://amp.dev/documentation/guides-and-tutorials/develop/media_iframes_3p/#images).

### Drupal

Установите [модуль Drupal](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A67&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=%22lazy+load%22&solrsort=iss_project_release_usage+desc&op=Search), который может отложить загрузку изображений. Такие модули предоставляют возможность откладывать любые закадровые изображения для повышения производительности.

### Joomla

Установите [плагин Joomla с отложенной загрузкой](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=lazy%20loading), который дает возможность откладывать любые закадровые изображения или переключаться на шаблон, который предоставляет эту функциональность. Начиная с Joomla 4.0, специальный плагин отложенной загрузки можно включить с помощью плагина «Контент - отложенная загрузка изображений». Также рассмотрите возможность использования [плагина AMP](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=amp).

### Magento

Рассмотрите возможность изменения шаблонов продуктов и каталогов, чтобы использовать функцию [отложенной загрузки](/browser-level-image-lazy-loading/) веб-платформы.

### WordPress

Установите [плагин WordPress с отложенной загрузкой](https://wordpress.org/plugins/search/lazy+load/), который дает возможность откладывать любые закадровые изображения или переключаться на тему, которая предоставляет эту функциональность. Также рассмотрите возможность использования [плагина AMP](https://wordpress.org/plugins/amp/).

## Ресурсы

- [Исходный код для аудита **откладывания закадровых изображений**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/offscreen-images.js)
