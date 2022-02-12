---
layout: codelab
title: Создание изображений WebP при помощи командной строки
authors:
  - katiehempenius
description: В этом интерактивном уроке вы узнаете о выдаче оптимизированных изображений с использованием WebP.
date: 2018-11-05
glitch: webp-cli
related_post: serve-images-webp
tags:
  - performance
---

В интерактивном уроке уже установлен инструмент <a href="https://developers.google.com/speed/webp/docs/precompiled">webp</a> для командной строки, поэтому никаких подготовительных действий не требуется. Этот инструмент преобразует изображения из форматов JPG, PNG и TIFF в формат WebP.

## Преобразование изображений в WebP

{% Instruction 'remix', 'ol' %} {% Instruction 'console', 'ol' %}

1. Введите следующую команду:

```bash
cwebp -q 50 images/flower1.jpg -o images/flower1.webp
```

Эта команда преобразует `images/flower1.jpg` с уровнем качества `50` (`0` — худшее, `100` — лучшее) и сохраняет его под именем `images/flower1.webp`.

{% Aside %} Возможно, вам интересно, почему команда называется `cwebp`, а не `webp`. Дело в том, что для кодирования и декодирования WebP-изображений используются две разные команды: `cwebp` и `dwebp` соответственно. {% endAside %}

После выполнения команды вы увидите в консоли примерно следующее:

```bash
Saving file 'images/flower1.webp'
File:      images/flower1.jpg
Dimension: 504 x 378
Output:    29538 bytes Y-U-V-All-PSNR 34.57 36.57 36.12   35.09 dB
           (1.24 bpp)
block count:  intra4:        750  (97.66%)
              intra16:        18  (2.34%)
              skipped:         0  (0.00%)
bytes used:  header:            116  (0.4%)
             mode-partition:   4014  (13.6%)
 Residuals bytes  |segment 1|segment 2|segment 3|segment 4|  total
    macroblocks:  |      22%|      26%|      36%|      17%|     768
      quantizer:  |      52 |      42 |      33 |      24 |
   filter level:  |      16 |       9 |       6 |      26 |
```

Это означает, что изображение успешно преобразовано в WebP.

Однако если выполнять команду `cwebp` для каждого изображения по отдельности, то преобразование большого числа изображений займет много времени. В таких случаях можно использовать скрипт.

- Запустите в консоли следующий скрипт (не забудьте обратные кавычки):

```bash
`for file in images/*; do cwebp -q 50 "$file" -o "${file%.*}.webp"; done`
```

Скрипт преобразует все файлы в каталоге `images/`, используя уровень качества `50`, и сохраняет их в том же каталоге под тем же именем, но с другим расширением.

### ✔︎ Итог

В результате у вас в каталоге `images/` должно быть 6 файлов:

```shell
flower1.jpg
flower1.webp
flower2.jpg
flower2.webp
flower3.png
flower3.webp
```

Теперь мы можем обновить код данного Glitch, чтобы загружать WebP-изображения в браузерах, которые их поддерживают.

## Добавление WebP-изображений при помощи тега `<picture>`

Тег `<picture>` позволяет загружать WebP-изображения в новых браузерах, при этом сохраняя поддержку старых браузеров.

- В файле `index.html` замените `<img src="images/flower1.jpg"/>` следующим HTML-кодом:

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
```

- Затем замените теги `<img>` на `<picture>` для файлов `flower2.jpg` и `flower3.png`.

### ✔︎ Итог

В результате теги `<picture>` в файле `index.html` должны выглядеть следующим образом:

```html
<picture>
  <source type="image/webp" srcset="images/flower1.webp">
  <source type="image/jpeg" srcset="images/flower1.jpg">
  <img src="images/flower1.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower2.webp">
  <source type="image/jpeg" srcset="images/flower2.jpg">
  <img src="images/flower2.jpg">
</picture>
<picture>
  <source type="image/webp" srcset="images/flower3.webp">
  <source type="image/png" srcset="images/flower3.png">
  <img src="images/flower3.png">
</picture>
```

Теперь вы можете воспользоваться Lighthouse, чтобы убедиться, что WebP-изображения добавлены на сайт надлежащим образом.

## Проверка использования WebP при помощи Lighthouse

При помощи проверки производительности **Serve images in next-gen formats** («Выдача изображений в форматах следующего поколения») в Lighthouse вы можете узнать, все ли изображения на вашем сайте используют современные форматы, такие как WebP.

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. Убедитесь, что сайт успешно проходит проверку **Serve images in next-gen formats**.

{% Img src="image/admin/Y8x0FLWs1Xsf32DX20DG.png", alt="Успешное прохождение проверки «Serve images in next-gen formats» в Lighthouse", width="701", height="651" %}

Готово! Теперь ваш сайт использует изображения в формате WebP.
