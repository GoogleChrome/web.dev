---
layout: post
title: Utilice Imagemin para comprimir imágenes
authors:
  - katiehempenius
date: 2018-11-05
updated: 2020-04-06
description: Las imágenes sin comprimir inflan sus páginas con bytes innecesarios. Ejecute Lighthouse para buscar oportunidades para mejorar la carga de las páginas al comprimir las imágenes.
codelabs:
  - codelab-imagemin-webpack
  - codelab-imagemin-gulp
  - codelab-imagemin-grunt
tags:
  - performance
---

## ¿Por qué debería preocuparse?

Las imágenes sin comprimir inflan sus páginas con bytes innecesarios. La foto de la derecha es un 40% más pequeña que la de la izquierda, pero probablemente lucirá idéntica para el usuario medio.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>
<p>{% Img src="image/admin/LRE2JJAuShXTjQF5ZSaR.jpg", alt="", width="376", height="250" %}</p> 20 KB</th>
        <th>
<p>{% Img src="image/admin/u9hncwN4TsT7zw2ObU10.jpg", alt="", width="376", height="250" %}</p> 12 KB</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

## Medición

Ejecute Lighthouse en búsqueda de oportunidades para mejorar la carga de la página al comprimir las imágenes. Estas oportunidades se enumeran en "Codificar imágenes de manera eficiente":

{% Img src="image/admin/LnIukPEZHuVJwBtuJ7mc.png", alt="imagen", width="800", height="552" %}

{% Aside %} Lighthouse actualmente informa sobre las oportunidades para comprimir imágenes solo en formato JPEG. {% endAside %}

## Imagemin

Imagemin es una excelente opción para la compresión de imágenes porque admite una amplia variedad de formatos de imagen y se integra fácilmente con scripts de compilación y herramientas de compilación. Imagemin está disponible como una  [CLI](https://github.com/imagemin/imagemin-cli) y como [módulo npm](https://www.npmjs.com/package/imagemin). Generalmente, el módulo npm es la mejor opción porque ofrece más opciones de configuración, pero la CLI puede ser una alternativa decente si quiere probar Imagemin sin tocar ningún código.

### Complementos

Imagemin se basa en "complementos". Un complemento es un paquete npm que comprime un formato de imagen particular (por ejemplo, "mozjpeg" comprime archivos JPEG). Los formatos de imagen populares pueden tener varios complementos para elegir.

Lo más importante a considerar al elegir un complemento es si presenta "pérdidas" o es "sin pérdidas". En la compresión sin pérdidas, no se pierden datos. La compresión con pérdidas reduce el tamaño del archivo, pero a costa de posiblemente reducir la calidad de la imagen. Si un complemento no menciona si presenta "pérdidas" o es "sin pérdidas", puede saberlo por su API: si puede especificar la calidad de imagen del resultado, entonces presenta "pérdidas".

Para la mayoría de las personas, los complementos con pérdidas son la mejor opción. Ofrecen ahorros significativamente mayores y se pueden personalizar los niveles de compresión para satisfacer sus necesidades. La siguiente tabla enumera los complementos populares de Imagemin. Estos no son los únicos complementos disponibles, pero todos serían buenas opciones para su proyecto.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Formato de imagen</th>
        <th>Complementos con pérdidas</th>
        <th>Complementos sin pérdidas</th>
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

### CLI de Imagemin

La CLI de Imagemin funciona con 5 complementos diferentes: imagemin-gifsicle, imagemin-jpegtran, imagemin-optipng, imagemin-pngquant e imagemin-svgo. Imagemin utiliza el complemento apropiado según el formato de imagen de la entrada.

Para comprimir las imágenes en el directorio "images/" y guardarlas en el mismo directorio, ejecute el siguiente comando (sobrescribe los archivos originales):

```bash
$ imagemin images/* --out-dir=images
```

### Módulo npm de Imagemin

Si usa una de estas herramientas de compilación, consulte los laboratorios de código para Imaginemin con [webpack](/codelab-imagemin-webpack), [gulp](/codelab-imagemin-gulp) o [grump](/codelab-imagemin-grunt).

También puede utilizar Imagemin por sí mismo como un script de nodo. Este código utiliza el complemento "imagemin-mozjpeg" para comprimir archivos JPEG a una calidad de 50 ("0" es lo peor; "100" es lo mejor):

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
