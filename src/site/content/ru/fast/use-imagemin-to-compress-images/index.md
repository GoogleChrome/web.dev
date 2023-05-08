---
layout: post
title: Сжатие изображений с помощью средства Imagemin
authors:
  - katiehempenius
date: 2018-11-05
updated: 2020-04-06
description: Несжатые изображения увеличивают размер страниц. С помощью Lighthouse можно находить возможности для сжатия изображений, чтобы ускорить загрузку страниц.
codelabs:
  - codelab-imagemin-webpack
  - codelab-imagemin-gulp
  - codelab-imagemin-grunt
tags:
  - performance
---

## Зачем это нужно?

Несжатые изображения увеличивают размер страниц. У фотографии справа размер файла на 40% меньше, чем у фотографии слева, но большинство пользователей, вероятно, не заметят различий между этими фотографиями.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
<p>{% Img src="image/admin/LRE2JJAuShXTjQF5ZSaR.jpg", alt="", width="376", height="250" %}</p> 20 КБ</th>
        <th>
<p>{% Img src="image/admin/u9hncwN4TsT7zw2ObU10.jpg", alt="", width="376", height="250" %}</p> 12 КБ</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

## Измерение

Запустите Lighthouse и проверьте, нет ли возможностей сжать изображения и тем самым ускорить загрузку страницы. Такие возможности будут указаны в разделе Efficiently encode images (Эффективное кодирование изображений):

{% Img src="image/admin/LnIukPEZHuVJwBtuJ7mc.png", alt="Изображение", width="800", height="552" %}

{% Aside %} В настоящее время Lighthouse проверяет, можно ли сжать изображения, только для формата JPEG. {% endAside %}

## Imagemin

Imagemin — отличное средство для сжатия изображений. Оно поддерживает широкий спектр форматов изображений и его легко интегрировать со сценариями и инструментами сборки. Средство Imagemin доступно как в виде [программы командной строки](https://github.com/imagemin/imagemin-cli), так и в виде [модуля npm](https://www.npmjs.com/package/imagemin). Как правило, лучше всего работать с модулем npm, так как в нем больше параметров конфигурации. Программа командной строки — достойная альтернатива, если вы хотите попробовать использовать Imagemin, не имея дела с кодом.

### Подключаемые модули

Средство Imagemin разработано для использования подключаемых модулей. Подключаемый модуль — это пакет npm, который сжимает изображения определенного формата (например, подключаемый модуль mozjpeg сжимает JPEG-файлы). Для популярных форматов изображений может быть доступно несколько подключаемых модулей.

Самое важное, что нужно учитывать при выборе подключаемого модуля, — метод сжатия («с потерями» или «без потерь»). При сжатии без потерь данные изображения не теряются. При сжатии с потерями размер файла уменьшается, но за счет возможного снижения качества изображения. Если для подключаемого модуля не указан используемый метод сжатия («с потерями» или «без потерь»), его можно определить по API подключаемого модуля: если можно указать качество изображения на выходе, то используется метод сжатия «с потерями».

Большинству людей лучше всего подходят подключаемые модули для сжатия с потерями. Они позволяют значительно уменьшать размеры файлов. Кроме того, можно настроить уровни сжатия в соответствии с вашими потребностями. В таблице ниже перечислены популярные подключаемые модули Imagemin. Это не все доступные подключаемые модули, но они хорошо подойдут для ваших проектов.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Формат изображения</th>
        <th>Подключаемые модули для сжатия с потерями</th>
        <th>Подключаемые модули для сжатия без потерь</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>JPEG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-mozjpeg">imagemin-mozjpeg</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-jpegtran">imagemin-jpegtran</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-pngquant">imagemin-pngquant</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-optipng">imagemin-optipng</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="https://www.npmjs.com/package/imagemin-giflossy">imagemin-giflossy</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-gifsicle">imagemin-gifsicle</a></td>
      </tr>
      <tr>
        <td>SVG</td>
        <td><a href="https://www.npmjs.com/package/imagemin-svgo">imagemin-svgo</a></td>
        <td></td>
      </tr>
      <tr>
        <td>WebP</td>
        <td><a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a></td>
        <td><a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Программа командной строки Imagemin

Программа командной строки Imagemin работает с пятью различными подключаемыми модулями: imagemin-gifsicle, imagemin-jpegtran, imagemin-optipng, imagemin-pngquant и imagemin-svgo. Средство Imagemin использует соответствующий подключаемый модуль в зависимости от формата изображения входных данных.

Чтобы сжать изображения в каталоге images/ и сохранить их в том же каталоге, выполните следующую команду (при этом исходные файлы будут перезаписаны):

```bash
$ imagemin images/* --out-dir=images
```

### Модуль npm Imagemin

Если вы применяете одно из средств сборки, попробуйте использовать codelabs для Imaginemin с [webpack](/codelab-imagemin-webpack), [gulp](/codelab-imagemin-gulp) или [grunt](/codelab-imagemin-grunt).

Кроме того, можно использовать само средство Imagemin в качестве сценария Node. В этом коде используется подключаемый модуль imagemin-mozjpeg для сжатия JPEG-файлов до уровня качества 50 (где 0 — самое низкое, а 100 — самое высокое качество):

```js
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      {
        destination: 'destination_dir',
        plugins: [imageminMozjpeg({quality: 50})]
      }
  );
  console.log(files);
})();
```
