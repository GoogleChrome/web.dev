---
layout: post
title: Use imagens WebP
authors:
  - katiehempenius
description: |-
  As imagens WebP são menores do que seus similares JPEG e PNG, geralmente na
  magnitude de uma redução de 25–35% no tamanho do arquivo. Isso diminui o tamanho da página e melhora o desempenho.
date: 2018-11-05
updated: 2020-04-06
codelabs:
  - codelab-serve-images-webp
tags:
  - performance
feedback:
  - api
---

## Por que você deveria se importar?

As imagens WebP são menores do que suas similares JPEG e PNG, geralmente na magnitude de uma redução de 25 a 35% no tamanho do arquivo. Isso diminui o tamanho da página e melhora o desempenho.

- O YouTube descobriu que mudar para miniaturas WebP resultou em [carregamentos de página 10% mais rápidos](https://www.youtube.com/watch?v=rqXMwLbYEE4).
- O Facebook [experimentou](https://code.fb.com/android/improving-facebook-on-android/) economias de tamanho do arquivo de 25 a 35% para JPEGs e 80% de economia de tamanho de arquivos PNGs quando passou a usar WebP.

WebP é um excelente substituto para imagens JPEG, PNG e GIF. Além disso, o WebP oferece compactação com e sem perdas. Na compactação sem perdas, nenhum dado é perdido. A compactação com perdas reduz o tamanho do arquivo, mas possivelmente reduz a qualidade da imagem.

## Converta imagens para WebP

As pessoas geralmente usam uma das seguintes abordagens para converter suas imagens em WebP: a [ferramenta de linha de comando cwebp](https://developers.google.com/speed/webp/docs/using) ou o [plugin Imagemin WebP](https://github.com/imagemin/imagemin-webp) (pacote npm). O plugin Imagemin WebP é geralmente a melhor escolha se seu projeto usa scripts de construção ou ferramentas de construção (por exemplo, Webpack ou Gulp), enquanto o CLI é uma boa escolha para projetos simples ou se você só precisa converter imagens uma vez.

Ao converter imagens para WebP, você tem a opção de definir uma ampla variedade de configurações de compactação. No entanto, para a maioria das pessoas, a única coisa com a qual você precisa se preocupar é a configuração de qualidade. Você pode especificar um nível de qualidade de 0 (pior) a 100 (melhor). Vale a pena tentar descobrir qual nível é a compensação certa entre a qualidade da imagem e o tamanho do arquivo para suas necessidades.

### Use o cwebp

Converta um único arquivo, usando as configurações de compactação padrão do cwebp:

```bash
cwebp images/flower.jpg -o images/flower.webp
```

Converta um único arquivo, usando um nível de qualidade de `50` :

```bash
cwebp -q 50 images/flower.jpg -o images/flower.webp
```

Converta todos os arquivos em um diretório:

```bash
for file in images/*; do cwebp "$file" -o "${file%.*}.webp"; done
```

### Use o Imagemin

O plugin Imagemin WebP pode ser usado sozinho ou com sua ferramenta de construção favorita (Webpack/Gulp/Grunt/etc.). Ele geralmente envolve adicionar cerca de 10 linhas de código a um script de construção ou ao arquivo de configuração para sua ferramenta de construção. Aqui estão alguns exemplos de como fazer isso para [Webpack](https://glitch.com/~webp-webpack), [Gulp](https://glitch.com/~webp-gulp) e [Grunt](https://glitch.com/~webp-grunt).

Se você não estiver usando uma dessas ferramentas de construção, pode usar a própria Imagemin como um script do Node. Este script irá converter os arquivos no `images` e salvá-los no diretório `compressed_images`

```js
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['images/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 50})]
}).then(() => {
  console.log('Done!');
});
```

## Forneça imagens WebP

Se o seu site oferece suporte apenas a [navegadores](https://caniuse.com/#search=webp) compatíveis com WebP, você pode parar de ler. Caso contrário, forneça WebP para navegadores mais recentes e uma imagem substituta para navegadores mais antigos:

**Antes:**

```html
<img src="flower.jpg" alt="">
```

**Depois:**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

As etiquetas [`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture) , [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) e `<img>`, incluindo como são ordenadas em relação umas às outras, interagem para atingir este resultado final.

### picture

A `<picture>` fornece um wrapper para zero ou mais `<source>` tag e uma tag `<img>`

### source

Uma etiqueta `<source>` especifica um recurso de mídia.

O navegador usa a primeira fonte listada em um formato compatível. Se o navegador não suportar nenhum dos formatos listados nas tags `<source>`, ele voltará a carregar a imagem especificada pela tag `<img>`

{% Aside 'gotchas' %}

- Uma tag `<source>` para o formato de imagem "preferencial" (neste caso, WebP) deve ser listada primeiro, antes de outras tags `<source>`

- O valor do atributo `type` deve ser o tipo MIME correspondente ao formato da imagem. [O tipo MIME](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types) de uma imagem e sua extensão de arquivo costumam ser semelhantes, mas não são necessariamente a mesma coisa (por exemplo, `.jpg` x `image/jpeg` ).

{% endAside %}

### img

A tag `<img>` é o que faz este código funcionar em navegadores que não suportam a tag `<picture>`. Se um navegador não suportar a tag `<picture>`, ele irá ignorar as tags que não suporta. Portanto, ele apenas "vê" a tag `<img src="flower.jpg" alt="">` e carrega essa imagem.

{% Aside 'gotchas' %}

- A `<img>` sempre deve ser incluída e sempre deve ser listada por último, depois de todas as tags `<source>`
- O recurso especificado pela `<img>` deve estar em um formato com suporte universal (por exemplo, JPEG), para que possa ser usado como fallback. {% endAside %}

## Verifique o uso do WebP

O Lighthouse pode ser usado para verificar se todas as imagens em seu site estão sendo fornecidas através de WebP. Execute a Auditoria de Desempenho do Farol ( **Lighthouse &gt; Opções &gt; Desempenho** ) e procure os resultados das imagens da auditoria **Servir imagens em formatos de próxima geração.** O Lighthouse listará todas as imagens que não estão sendo servidas em WebP.
