---
title: Aplique efeitos às imagens com a propriedade mask-image do CSS
subhead: |2-

  O mascaramento CSS oferece a opção de usar uma imagem como camada de máscara.
  Isso significa que você pode usar uma imagem, um SVG ou um gradiente como sua máscara
  para criar efeitos interessantes sem um editor de imagens.
description: |2

  O mascaramento CSS oferece a opção de usar uma imagem como camada de máscara.
  Isso significa que você pode usar uma imagem, um SVG ou um gradiente como sua máscara,
  para criar efeitos interessantes sem um editor de imagens.
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/uNWkHLVFNcTDk09OplrA.jpg
alt: Um ursinho de pelúcia usando uma máscara.
tags:
  - blog
  - css
feedback:
  - api
---

Quando você [recorta um elemento](/css-clipping) usando a propriedade `clip-path`, a área recortada se torna invisível. Se, em vez disso, você quiser tornar parte da imagem opaca ou aplicar algum outro efeito a ela, será necessário usar o mascaramento. Esta postagem explica como usar a [`mask-image`](https://developer.mozilla.org/docs/Web/CSS/mask-image) em CSS, que permite especificar uma imagem para usar como camada de máscara. Ela oferece três opções. Você pode usar um arquivo de imagem como máscara, SVG ou gradiente.

## Compatibilidade do navegador

A maioria dos navegadores tem suporte parcial para a propriedade de mascaramento CSS padrão. Você precisará usar o `-webkit-` além da propriedade padrão para obter a melhor compatibilidade do navegador. Consulte [Posso usar máscaras CSS?](https://caniuse.com/#feat=css-masks) para obter informações completas de suporte do navegador.

Embora o suporte do navegador usando a propriedade prefixada seja bom, ao usar o mascaramento para tornar o texto na parte superior de uma imagem visível, tome cuidado com o que acontecerá se o mascaramento não estiver disponível. Pode valer a pena usar consultas de recursos para detectar suporte para `mask-image` ou `-webkit-mask-image` e fornecer um fallback legível antes de adicionar sua versão mascarada.

```css
@supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
  /* código que requer mask-image aqui. */
}
```

## Mascarando com uma imagem

A `mask-image` funciona de maneira semelhante à propriedade `background-image` Use um `url()` para passar uma imagem. Sua imagem de máscara precisa ter uma área transparente ou semitransparente.

Uma área totalmente transparente fará com que a parte da imagem sob essa área fique invisível. Usar uma área semitransparente, entretanto, permitirá que parte da imagem original apareça. Você pode ver a diferença no Glitch abaixo. A primeira imagem é a imagem original de balões sem máscara. A segunda imagem tem uma máscara aplicada que tem uma estrela branca em um fundo totalmente transparente. A terceira imagem tem uma estrela branca em um fundo com uma transparência gradiente.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image?path=index.html&amp;previewSize=100" title="mask-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Neste exemplo, também estou usando a `mask-size` com um valor de `cover`. Esta propriedade funciona da mesma maneira que o [`background-size`](https://developer.mozilla.org/docs/Web/CSS/background-size). Você pode usar as palavras-chave `cover` e `contain` ou dar ao fundo um tamanho usando qualquer unidade de comprimento válida ou uma porcentagem.

Você também pode repetir a máscara da mesma forma que faria com uma imagem de fundo para usar uma imagem pequena como padrão de repetição.

## Mascaramento com SVG

Em vez de usar um arquivo de imagem como máscara, você pode usar SVG. Existem algumas maneiras pelas quais isso pode ser alcançado. A primeira é ter um elemento `<mask>` dentro do SVG e fazer referência ao ID desse elemento na propriedade `mask-image`

```html
<svg width="0" height="0" viewBox="0 0 400 300">
  <defs>
    <mask id="mask">
      <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
      <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
      <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
    </mask>
  </defs>
</svg>

<div class="container">
    <img src="balloons.jpg" alt="Balões">
</div>
```

```css
.container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  -webkit-mask-image: url(#mask);
  mask-image: url(#mask);
}
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3HnPhISiVazDTwezxfcy.jpg", alt="Um exemplo de uso de máscara SVG", width="699", height="490" %}</figure>

A vantagem dessa abordagem é que a máscara pode ser aplicada a qualquer elemento HTML, não apenas a uma imagem. Infelizmente, o Firefox é o único navegador que oferece suporte a essa abordagem.

No entanto, nem tudo está perdido, pois para o cenário mais comum de mascaramento de uma imagem, podemos incluir a imagem no SVG.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image-svg-image?path=README.md&amp;previewSize=100" title="mask-image-svg-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Mascaramento com gradiente

Usar um gradiente CSS como máscara é uma maneira elegante de obter uma área mascarada sem a necessidade de se dar ao trabalho de criar uma imagem ou SVG.

Um gradiente linear simples usado como máscara pode garantir que a parte inferior de uma imagem não fique muito escura sob uma legenda, por exemplo.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-linear-gradient?path=README.md&amp;previewSize=100" title="mask-linear-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Você pode usar qualquer um dos tipos de gradiente suportados e ser o quão criativo quiser. Este próximo exemplo usa um gradiente radial para criar uma máscara circular para iluminar atrás da legenda.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-radial-gradient?path=README.md&amp;previewSize=100" title="mask-radial-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Usando várias máscaras

Tal como acontece com as imagens de fundo, você pode especificar várias fontes de máscara, combinando-as para obter o efeito desejado. Isso é particularmente útil se você deseja usar um padrão gerado com gradientes CSS como sua máscara. Normalmente, eles usam várias imagens de fundo e, portanto, podem ser traduzidos facilmente em uma máscara.

Por exemplo, encontrei um bom padrão xadrez [neste artigo](https://cssgradient.io/blog/gradient-patterns/). O código, usando imagens de fundo, tem a seguinte aparência:

```css
background-image:
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size:20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Para transformar isso, ou qualquer outro padrão projetado para imagens de fundo, em uma máscara, você precisará substituir as propriedades `background-*` `mask` relevantes, incluindo as `-webkit` prefixadas -webkit.

```css
-webkit-mask-image:
  linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
  linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
-webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Existem alguns efeitos realmente interessantes para serem feitos aplicando padrões de gradiente às imagens. Tente remixar o Glitch e testar algumas outras variações.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-checkers?path=README.md&amp;previewSize=100" title="mask-checkers on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Junto com o recorte, as máscaras CSS são uma forma de adicionar interesse a imagens e outros elementos HTML sem a necessidade de usar um aplicativo gráfico.

*<span>Foto de <a href="https://unsplash.com/@juliorionaldo">Julio Rionaldo</a> no Unsplash</span> .*
