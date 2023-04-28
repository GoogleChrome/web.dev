---
layout: post
title: Use Imagemin para comprimir imagens
authors:
  - katiehempenius
date: 2018-11-05
updated: 2020-04-06
description: |2-

  Imagens não compactadas incham suas páginas com bytes desnecessários. Execute o Lighthouse para verificar se há oportunidades de melhorar o carregamento da página compactando imagens.
codelabs:
  - codelab-imagemin-webpack
  - codelab-imagemin-gulp
  - codelab-imagemin-grunt
tags:
  - performance
---

## Por que você deveria se importar?

Imagens não compactadas incham suas páginas com bytes desnecessários. A foto à direita é 40% menor do que a da esquerda, mas provavelmente seria idêntica à do usuário comum.

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

## Medir

Execute o Lighthouse para verificar se há oportunidades de melhorar o carregamento da página compactando imagens. Essas oportunidades estão listadas em "Codificar imagens com eficiência":

{% Img src="image/admin/LnIukPEZHuVJwBtuJ7mc.png", alt="image", width="800", height="552" %}

{% Aside %} O Lighthouse atualmente relata sobre oportunidades de compactar imagens apenas no formato JPEG. {% endAside %}

## Imagemin

Imagemin é uma excelente escolha para compressão de imagem porque suporta uma ampla variedade de formatos de imagem e é facilmente integrado com scripts de construção e ferramentas de construção. Imagemin está disponível como [módulo CLI](https://www.npmjs.com/package/imagemin) e [npm](https://github.com/imagemin/imagemin-cli). Geralmente, o módulo npm é a melhor escolha porque oferece mais opções de configuração, mas o CLI pode ser uma alternativa decente se você quiser experimentar o Imagemin sem mexer em nenhum código.

### Plugins

Imagemin é construída em torno de "plugins". Um plugin é um pacote npm que compacta um formato de imagem específico (por exemplo, "mozjpeg" compacta JPEGs). Os formatos de imagem populares podem ter vários plug-ins para escolher.

A coisa mais importante a se considerar ao escolher um plug-in é se ele é "com perdas" ou "sem perdas". Na compactação sem perdas, nenhum dado é perdido. A compactação com perdas reduz o tamanho do arquivo, mas possivelmente reduza a qualidade da imagem. Se um plugin não menciona se é "com perdas" ou "sem perdas", você pode dizer por sua API: se você pode especificar a qualidade da imagem de saída, então é "com perdas".

Para a maioria das pessoas, plug-ins com perdas são a melhor escolha. Eles oferecem uma economia de tamanho de arquivo significativamente maior e você pode personalizar os níveis de compactação para atender às suas necessidades. A tabela abaixo lista os plug-ins populares da Imagemin. Esses não são os únicos plug-ins disponíveis, mas todos são boas opções para o seu projeto.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Formato de imagem</th>
        <th>Plugin (s) com perdas</th>
        <th>Plugin(s) sem perdas</th>
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

### Imagemin CLI

O Imagemin CLI funciona com 5 plugins diferentes: imagemin-gifsicle, imagemin-jpegtran, imagemin-optipng, imagemin-pngquant e imagemin-svgo. Imagemin usa o plugin apropriado baseado no formato de imagem da entrada.

Para compactar as imagens no diretório "images/" e salvá-las no mesmo diretório, execute o seguinte comando (sobrescreve os arquivos originais):

```bash
$ imagemin images/* --out-dir=images
```

### Módulo npm imagemin

Se você usar uma dessas ferramentas de construção, verifique os codelabs para Imaginemin com [webpack](/codelab-imagemin-webpack) , [gulp](/codelab-imagemin-gulp) ou [grunt](/codelab-imagemin-grunt).

Você também pode usar Imagemin por si só como um script de Node. Este código usa o plugin "imagemin-mozjpeg" para comprimir arquivos JPEG para uma qualidade de 50 ('0' sendo o pior; '100' sendo o melhor):

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
