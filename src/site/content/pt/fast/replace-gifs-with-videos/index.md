---
layout: post
title: Substitua GIFs animados por vídeos para carregar as páginas mais rapidamente
authors:
  - houssein
description: Você já viu um GIF animado em um serviço como o Imgur ou o Gfycat, fez a inspeção nas ferramentas de desenvolvedor e descobriu que, na verdade, era um vídeo? Há um bom motivo para isso. Os GIFs animados podem ser enormes! Ao converter GIFs grandes em vídeos, é possível economizar muito na largura de banda dos usuários.
date: 2018-11-05
updated: 2019-08-29
codelabs:
  - codelab-replace-gifs-with-video
tags:
  - performance
feedback:
  - api
---

Você já viu um GIF animado em um serviço como o Imgur ou o Gfycat, fez a inspeção nas ferramentas de desenvolvedor e descobriu que, na verdade, era um vídeo? Há um bom motivo para isso. Os GIFs animados podem ser *enormes*.

{% Img src="image/admin/3UZ0b9dDotVIXWQT5Auk.png", alt="Painel de rede do DevTools mostrando um GIF de 13,7 MB.", width="800", height="155" %}

Felizmente, fazendo muito pouco você pode melhorar muito o desempenho do carregamento. **Ao converter GIFs grandes em vídeos, é possível economizar muito na largura de banda dos usuários**.

## Meça primeiro

Use o Lighthouse para verificar se há GIFs no seu site que podem ser convertidos em vídeos. No DevTools, clique na guia "Audits" (Auditorias) e marque a caixa de seleção "Performance" (Desempenho). Em seguida, execute o Lighthouse e verifique o relatório. Se tiver GIFs que possam ser convertidos, você verá uma sugestão para "Usar formatos de vídeo para conteúdo animado":

{% Img src="image/admin/KOSr9IivnkyaFk6RJ5u1.png", alt="Uma auditoria do Lighthouse reprovada, use formatos de vídeo para conteúdo animado.", width="800", height="173" %}

## Crie vídeos MPEG

Há várias maneiras de converter GIFs em vídeos. Neste guia, é usada a ferramenta **[FFmpeg](https://www.ffmpeg.org/)**. Para usar o FFmpeg para converter o GIF `my-animation.gif` em um vídeo MP4, execute o seguinte comando no seu console:

```bash
ffmpeg -i my-animation.gif -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

Isso informa ao FFmpeg para considerar `my-animation.gif` como a **entrada**, representada pela sinalização `-i`, e fazer a conversão para um vídeo chamado `my-animation.mp4`.

O codificador libx264 funciona apenas com arquivos de dimensões pares, como 320 px por 240 px. Se o GIF de entrada tiver dimensões ímpares, é possível incluir um filtro de corte para evitar que o FFmpeg lance um erro de 'altura/largura não divisível por 2':

```bash
ffmpeg -i my-animation.gif -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

## Crie vídeos WebM

Enquanto o MP4 existe desde 1999, o WebM é um formato de arquivo relativamente novo, lançado em 2010. Os vídeos WebM são muito menores do que os vídeos MP4, mas nem todos os navegadores são compatíveis com o WebM, portanto, faz sentido gerar os dois.

Para usar o FFmpeg para converter `my-animation.gif` em um vídeo WebM, execute o seguinte comando no seu console:

```bash
ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm
```

## Compare a diferença

A economia de custos entre um GIF e um vídeo pode ser bastante significativa.

{% Img src="image/admin/LWzvOWaOdMnNLTPWjayt.png", alt="Comparação de tamanho dos arquivos mostrando 3,7 MB para o GIF, 551 KB para o MP4 e 341 KB para o WebM.", width="800", height="188" %}

Nesse exemplo, o GIF inicial tem 3,7 MB, em comparação com a versão MP4, que tem 551 KB, e a versão WebM, que tem apenas 341 KB!

## Substitua a imagem do GIF por um vídeo

Os GIFs animados têm três características principais que precisam ser replicadas no vídeo:

- Eles são reproduzidos automaticamente.
- Eles repetem em loop (geralmente, mas é possível evitar o loop).
- Eles não têm áudio.

Felizmente, é possível recriar esses comportamentos usando o elemento `<video>`.

```bash
<video autoplay loop muted playsinline></video>
```

Um elemento `<video>` com esses atributos é reproduzido automaticamente, fica em loop infinito, não têm áudio e é exibido inline (e não em tela cheia): todos os comportamentos característicos esperados dos GIFs animados! 🎉

Por fim, o elemento `<video>` requer um ou mais elementos filhos `<source>` apontando para diferentes arquivos de vídeo que podem ser escolhidos pelo navegador, dependendo da compatibilidade com os formatos. Forneça ambos os vídeos WebM e MP4, de modo que, se um navegador não for compatível com WebM, ele pode usar o MP4.

```html
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

{% Aside 'codelab' %} [Substitua um GIF animado por um vídeo](/codelab-replace-gifs-with-video). {% endAside %}

{% Aside %} Os navegadores não conseguem definir qual `<source>` é ideal, então a ordem das tags `<source>` é importante. Por exemplo, se você especificar um vídeo MP4 primeiro e o navegador for compatível com WebM, ele ignorará o `<source>` do WebM e usará o MPEG-4 em vez disso. Se você preferir que o `<source>` do WebM seja usado primeiro, especifique-o primeiro! {% endAside %}
