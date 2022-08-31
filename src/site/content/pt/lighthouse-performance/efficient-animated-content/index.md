---
layout: post
title: Use formatos de vídeo para conteúdos animados
description: |2

  Aprenda sobre a auditoria eficiente de conteúdo animado.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - efficient-animated-content
---

A seção Oportunidades de seu relatório Lighthouse lista todos os GIFs animados, junto com a economia estimada em segundos obtida pela conversão desses GIFs em vídeo:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MTfWMspCIMjREn2rpwlG.png", alt="Uma captura de tela da auditoria do Lighthouse Usar formatos de vídeo para conteúdo animado", width="800", height="235" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Por que você deveria substituir GIFs animados por vídeos

GIFs grandes são ineficientes para entregar conteúdo animado. Ao converter grandes GIFs em vídeos, você pode economizar muito na largura de banda dos usuários. Considere o uso de vídeos MPEG4/WebM para animações e PNG/WebP para imagens estáticas em vez de GIF para economizar bytes na rede.

## Crie vídeos MPEG

Existem várias maneiras de converter GIFs em vídeo. [FFmpeg](https://ffmpeg.org/) é a ferramenta usada neste guia. Para usar o FFmpeg para converter o GIF, `my-animation.gif` em um vídeo MP4, execute o seguinte comando em seu console:

`ffmpeg -i my-animation.gif my-animation.mp4`

Isso diz ao FFmpeg para pegar o `my-animation.gif` como entrada, representado pelo `-i` , e convertê-lo em um vídeo chamado `my-animation.mp4`.

## Crie vídeos WebM

Os vídeos WebM são muito menores do que os vídeos MP4, mas nem todos os navegadores oferecem suporte ao WebM, portanto, faz sentido gerar ambos.

Para usar o FFmpeg para converter `my-animation.gif` em um vídeo WebM, execute o seguinte comando em seu console:

`ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm`

## Substitua a imagem GIF por um vídeo

Os GIFs animados têm três características principais que um vídeo precisa para replicar:

- Eles são reproduzidos automaticamente.
- Eles fazem loop continuamente (no geral, entretanto é possível evitar o loop).
- Eles são silenciosos

Felizmente, você pode recriar esses comportamentos usando o elemento `<video>`

```html
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

## Use um serviço que converte GIFs em vídeos HTML5

Muitos [CDNs de imagem](/image-cdns/) oferecem suporte à conversão de vídeo de GIF para HTML5. Você carrega um GIF para o CDN da imagem, e o CDN da imagem retorna um vídeo HTML5.

## Orientação específica para pilhas

### AMP

Para conteúdo animado, use [`amp-anim`](https://amp.dev/documentation/components/amp-anim/) para minimizar o uso da CPU quando o conteúdo estiver fora da tela.

## Recursos

- [Código-fonte para a auditoria **Use formatos de vídeo conteúdo animado**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/efficient-animated-content.js)
- [Substitua GIFs animados por vídeo para carregamentos de página mais rápidos](/replace-gifs-with-videos)
- [Codelab Substitua GIFs por vídeo](/codelab-replace-gifs-with-video)
