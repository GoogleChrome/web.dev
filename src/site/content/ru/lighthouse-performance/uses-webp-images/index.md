---
layout: post
title: Используйте современные форматы изображений
description: Узнайте о проверке использования современных форматов изображений.
date: 2019-05-02
updated: 2020-05-29
codelabs:
  - codelab-serve-images-webp
web_lighthouse:
  - uses-webp-images
---

В разделе Opportunities (Возможности) отчета Lighthouse перечислены все изображения в более старых форматах и показана потенциальная экономия, полученная при использовании AVIF-версий этих изображений.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/VmK3YIRiXNjbzEXxx1Ix.png", alt="Скриншот проверки Lighthouse «Используйте современные форматы изображений»", width="800", height="306" %}</figure>

## Зачем использовать изображения в формате WebP

AVIF и WebP — это форматы изображений, которые обладают превосходными характеристиками сжатия и качества по сравнению со своими более старыми аналогами JPEG и PNG. Если использовать для кодирования изображений новые форматы, а не JPEG или PNG, это приведет к тому, что изображения будут загружаться быстрее и потреблять меньше мобильного трафика.

AVIF поддерживается в Chrome, Firefox и Opera и обеспечивает меньший размер файлов по сравнению с другими форматами при одинаковых настройках качества. Подробнее об AVIF см. [Codelab по использованию изображений в формате AVIF](https://codelabs.developers.google.com/codelabs/avif).

Формат WebP поддерживается в последних версиях Chrome, Firefox, Safari, Edge и Opera и обеспечивает лучшее сжатие с потерями и без потерь для изображений в Интернете. Подробнее о WebP см. в статье [«Новый формат изображений для Интернета»](https://developers.google.com/speed/webp/).

{% Aside 'codelab' %} [Создание изображений WebP с помощью командной строки](/codelab-serve-images-webp) {% endAside %}

## Как Lighthouse рассчитывает потенциальную экономию

Lighthouse собирает каждое изображение BMP, JPEG и PNG на странице, а затем конвертирует их в WebP, сообщая о потенциальной экономии на основе коэффициентов конвертации.

{% Aside 'note' %} Lighthouse исключает изображение из отчета, если потенциальная экономия составляет менее 8 КБ. {% endAside %}

## Совместимость с браузером

Не все браузеры поддерживают WebP, но аналогичная возможность экономии доступна в большинстве основных браузеров при использовании альтернативного формата нового поколения. Для браузеров, где поддержка ещё не реализована, рекомендуется использовать резервные изображение PNG или JPEG. См. материал [«Как определить, поддерживает ли браузер WebP?»](https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp), чтобы ознакомиться с альтернативными методами. См. также приведенный ниже список поддержки браузерами форматов изображений.

Чтобы узнать о текущей поддержке браузерами каждого формата нового поколения, перейдите по приведенным ниже ссылкам.

- [AVIF](https://caniuse.com/#feat=avif)
- [WebP](https://caniuse.com/#feat=webp)

## Рекомендации по стекам

### AMP

Рассмотрите возможность отображения всех [`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites) в формате WebP, [указав соответствующий резервный вариант](https://amp.dev/documentation/components/amp-img/#specify-a-fallback-image) для других браузеров.

### Drupal

Рассмотрите возможность установки и настройки [модуля для использования форматов изображений WebP](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=webp&solrsort=iss_project_release_usage+desc&op=Search) на вашем сайте. Такие модули автоматически генерируют WebP-версию загруженных изображений для оптимизации времени загрузки.

### Joomla

Подумайте об использовании [плагина](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=webp) или сервиса, который автоматически конвертирует загруженные вами изображения в оптимальные форматы.

### Magento

Рассмотрите возможность поиска на [Magento Marketplace](https://marketplace.magento.com/catalogsearch/result/?q=webp) различных сторонних расширений, чтобы использовать новые форматы изображений.

### WordPress

Подумайте об использовании [плагина](https://wordpress.org/plugins/search/convert+webp/) или сервиса, который автоматически конвертирует загруженные вами изображения в оптимальные форматы.

## Ресурсы

-  [Исходный код для проверки **использования современных форматов изображений**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/modern-image-formats.js).
- [Используйте изображения в формате WebP](/serve-images-webp).

<!-- https://www.reddit.com/r/webdev/comments/gspjwe/serve_images_in_nextgen_formats/ -->
