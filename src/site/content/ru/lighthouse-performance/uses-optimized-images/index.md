---
layout: post
title: Аудит Efficiently encode images
description: |2-

  Узнайте об аудите uses-optimized-images.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-optimized-images
---

В разделе «Возможности» отчета Lighthouse перечислены все неоптимизированные изображения, а также указано, на сколько [кибибайтов (КиБ)](https://en.wikipedia.org/wiki/Kibibyte) можно уменьшить их размер. Оптимизируйте такие изображения, чтобы страница загружалась быстрее и на ее передачу уходило меньше трафика:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZbPSZtjpa7j4I1k8DylI.png", alt="Снимок экрана с результатами работы аудита Efficiently encode images в Lighthouse", width="800", height="263" %}</figure>

## Как Lighthouse определяет изображения, которые можно оптимизировать

Lighthouse находит все изображения в формате JPEG или BMP на странице, задает для каждого изображения уровень сжатия 85, а затем сравнивает исходную версию со сжатой. Если потенциальная экономия составляет 4 КиБ или больше, Lighthouse делает пометку, что изображение можно оптимизировать.

## Как оптимизировать изображения

Оптимизировать изображения можно многими способами, в том числе указанными ниже.

- [Использование сетей доставки контента (CDN) для изображений](/image-cdns/)
- [Сжатие изображений](/use-imagemin-to-compress-images)
- [Замена анимированных GIF-файлов видеофайлами](/replace-gifs-with-videos)
- [Отложенная загрузка изображений](/use-lazysizes-to-lazyload-images)
- [Передача адаптивных изображений](/serve-responsive-images)
- [Передача изображений с правильными размерами](/serve-images-with-correct-dimensions)
- [Использование изображений WebP](/serve-images-webp)

## Оптимизация изображений с помощью средств с графическим пользовательским интерфейсом

Еще один подход — обрабатывать изображения оптимизатором, который можно установить на компьютер и использовать с помощью графического интерфейса. Например, работая с [ImageOptim](https://imageoptim.com/mac), можно перетаскивать изображения в пользовательский интерфейс этого средства, и оно будет автоматически сжимать изображения без заметного ухудшения качества. Если у вас небольшой сайт и вы можете вручную оптимизировать все изображения, этого варианта, вероятно, будет достаточно.

Еще один вариант — [Squoosh](https://squoosh.app/). Это средство поддерживается командой разработчиков Google Web DevRel.

## Рекомендации для разных стеков

### Drupal

Используйте [модуль](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=optimize+images&solrsort=iss_project_release_usage+desc&op=Search), который автоматически оптимизирует изображения, отправляемые через сайт, уменьшает их размер и не ухудшает их качество. Кроме того, используйте встроенные в Drupal [стили адаптивных изображений](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) (доступные в Drupal 8 и более поздних версий) для всех изображений, отображаемых на сайте.

### Joomla

Используйте [подключаемый модуль оптимизации изображений](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance), который сжимает изображения, сохраняя при этом их качество.

### Magento

Используйте [стороннее расширение Magento, оптимизирующее изображения](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image).

### WordPress

Используйте [подключаемый модуль WordPress для оптимизации изображений](https://wordpress.org/plugins/search/optimize+images/), который сжимает изображения, сохраняя при этом их качество.

## Ресурсы

- [Исходный код аудита **Efficiently encode images**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-optimized-images.js)
