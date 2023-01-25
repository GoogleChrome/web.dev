---
layout: post
title: Vídeo de carregamento lento
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-05
description: |2

  Esta postagem explica o carregamento lento e as opções disponíveis para você durante o carregamento lento.
tags:
  - performance
feedback:
  - api
---

Assim como acontece com os [elementos de imagem](/lazy-loading-images), você também pode carregar o vídeo lentamente. Os vídeos são comumente carregados com o `<video>` (embora [um método alternativo usando `<img>`](https://calendar.perfplanet.com/2017/animated-gif-without-the-gif/) tenha surgido com implementação limitada). *Porém, como* fazer o lazy-load `<video>` depende do caso de uso. Vamos discutir alguns cenários em que cada um exige uma solução diferente.

## Para vídeo que não é reproduzido automaticamente {: #video-no-autoplay}

Para vídeos em que a reprodução é iniciada pelo usuário (ou seja, vídeos que *não são* reproduzidos automaticamente), pode ser desejável [especificar o atributo `preload`](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-preload) no `<video>`

```html
<video controls preload="none" poster="one-does-not-simply-placeholder.jpg">
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

O exemplo acima usa um `preload` com um valor `none` para evitar que os navegadores pré-carreguem *quaisquer* dados de vídeo. O `poster` fornece ao `<video>` um espaço reservado que ocupará o espaço enquanto o vídeo carrega. A razão para isso é que os comportamentos padrão de carregamento de vídeo podem variar de navegador para navegador:

- No Chrome, o padrão para `preload` costumava ser `auto`, mas a partir do Chrome 64, agora o padrão é `metadata` . Mesmo assim, na versão desktop do Chrome, uma parte do vídeo pode ser pré-carregada usando o cabeçalho `Content-Range` Firefox, Edge e Internet Explorer 11 se comportam de maneira semelhante.
- Tal como acontece com o Chrome no desktop, as versões 11.0 do Safari para desktop vão pré-carregar uma série de vídeos. A partir da versão 11.2, apenas os metadados do vídeo são pré-carregados. [No Safari no iOS, os vídeos nunca são pré-carregados](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html#//apple_ref/doc/uid/TP40009523-CH2-SW9).
- Quando o [modo Economia de dados](https://support.google.com/chrome/answer/2392284) está ativado, o `preload` padronizado como `none`.

Como os comportamentos padrão do navegador em relação ao `preload` não são gravados em pedra, ser explícito é provavelmente sua melhor aposta. Nestes casos em que o usuário inicia a reprodução, usar `preload="none"` é a maneira mais fácil de adiar o carregamento do vídeo em todas as plataformas. O `preload` não é a única maneira de adiar o carregamento do conteúdo de vídeo. [*A reprodução rápida com pré-carregamento de vídeo*](/fast-playback-with-preload/) pode lhe dar algumas ideias e insights sobre como trabalhar com a reprodução de vídeo em JavaScript.

Infelizmente, isso não é útil quando você deseja usar vídeo no lugar de GIFs animados, o que é abordado a seguir.

## Para vídeo que atua como um substituto de GIF animado {: #video-gif-replacement}

Embora os GIFs animados sejam amplamente utilizados, eles são inferiores aos equivalentes de vídeo de várias maneiras, principalmente no tamanho do arquivo. Os GIFs animados podem atingir a faixa de vários megabytes de dados. Vídeos com qualidade visual semelhante tendem a ser bem menores.

Usar o `<video>` como um substituto para GIF animado não é tão simples quanto o elemento `<img>`. Os GIFs animados têm três características:

1. Eles tocam automaticamente quando carregados.
2. Eles fazem loop continuamente ([embora nem sempre seja o caso](https://davidwalsh.name/prevent-gif-loop)).
3. Eles não têm uma faixa de áudio.

Conseguir isso com o `<video>` é mais ou menos assim:

```html
<video autoplay muted loop playsinline>
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

Os `autoplay` , `muted` e `loop` são autoexplicativos. [`playsinline` é necessário para que a reprodução automática ocorra no iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/). Agora você tem uma substituição de vídeo como GIF que pode ser usada em todas as plataformas. Mas como fazer o carregamento lento? Para começar, modifique sua `<video>` acordo:

```html
<video class="lazy" autoplay muted loop playsinline width="610" height="254" poster="one-does-not-simply.jpg">
  <source data-src="one-does-not-simply.webm" type="video/webm">
  <source data-src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

Você notará a adição do[atributo `poster`](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster), que permite especificar um espaço reservado para ocupar o `<video>` até que o vídeo seja carregado lentamente. Tal como acontece com os [exemplos de carregamento lento `<img>`](/lazy-loading-images/), armazene a URL do vídeo no `data-src` em cada elemento `<source>`. A partir daí, use o código JavaScript semelhante aos exemplos de carregamento lento de imagem baseada no observador de intersecção:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
```

Quando você carrega lentamente um `<video>`, precisa iterar por todos os `<source>` filhos e transformar seus atributos `data-src` `src`. Depois de fazer isso, você precisa acionar o carregamento do vídeo chamando o `load` do elemento, após o qual a mídia começará a ser reproduzida automaticamente de acordo com o atributo `autoplay`

Usando esse método, você tem uma solução de vídeo que emula o comportamento do GIF animado, mas não incorre no mesmo uso intensivo de dados que os GIFs animados e pode carregar esse conteúdo lentamente.

## Bibliotecas de carregamento lento {: #libraries}

As seguintes bibliotecas podem ajudá-lo a carregar vídeos lentamente:

- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) e [lozad.js](https://github.com/ApoorvSaxena/lozad.js) são opções superleves que usam apenas o Intersection Observer. Como tal, eles têm alto desempenho, mas precisarão ser polyfilled antes de serem usados em navegadores mais antigos.
- [yall.js](https://github.com/malchata/yall.js) é uma biblioteca que usa o Intersection Observer e usa manipuladores de eventos. É compatível com o IE11 e os principais navegadores.
- Se você precisar de uma biblioteca de carregamento lento específico do React, pode considerar o [recurso react-lazyload](https://github.com/jasonslyvia/react-lazyload). Enquanto ele não usa Intersection Observer, *ele* fornece um método familiar de imagens carregamento lento para aqueles acostumados a desenvolver aplicações com Reagir.

Cada uma dessas bibliotecas de carregamento lento é bem documentada, com muitos padrões de marcação para seus vários esforços de carregamento lento.
