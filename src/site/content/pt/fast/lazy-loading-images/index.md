---
layout: post
title: Imagens de carregamento lento
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2022-08-11
description: |2-

  Esta publicação explica o carregamento lento e as opções disponíveis para você ao fazer o carregamento lento.
tags:
  - performance
  - images
feedback:
  - api
---

As imagens podem aparecer em uma página da web por estarem embutidas no HTML como `<img>` ou como imagens de fundo CSS. Nesta publicação, você descobrirá como fazer o carregamento lento de ambos os tipos de imagem.

## Imagens inline {: #images-inline }

Os candidatos de carregamento lento mais comuns são as imagens usadas nos elementos `<img>`. Com imagens embutidas, temos três opções para carregamento lento, que podem ser usadas em combinação para a melhor compatibilidade entre os navegadores:

- [Usando o carregamento lento no nível do navegador](#images-inline-browser-level)
- [Usando o observador de interseção](#images-inline-intersection-observer)
- [Usando manipuladores de eventos de rolagem e redimensionamento](#images-inline-event-handlers)

### Usando carregamento lento no nível do navegador {: #images-inline-browser-level }

O Chrome e o Firefox oferecem suporte ao carregamento lento com o atributo de `loading`. Este atributo pode ser adicionado aos `<img>` e também aos elementos `<iframe>`. Um valor `lazy` informa ao navegador para carregar a imagem imediatamente se ela estiver na janela de visualização e para buscar outras imagens quando o usuário rolar próximo a elas.

{% Aside %} Observe que `<iframe loading="lazy">` atualmente não é padrão. Embora implementado no Chromium, ele ainda não possui uma especificação e está sujeito a alterações futuras quando isso acontecer. Sugerimos não fazer o carregamento lento de iframes usando o `loading` até que ele se torne parte da especificação. {% endAside %}

Consulte o campo de `loading` da tabela de [compatibilidade do navegador](https://developer.mozilla.org/docs/Web/HTML/Element/img#Browser_compatibility) do MDN para obter detalhes sobre o suporte do navegador. Se o navegador não suportar o carregamento lento, o atributo será ignorado e as imagens serão carregadas imediatamente, normalmente.

Para a maioria dos sites, adicionar este atributo a imagens embutidas aumentará o desempenho e salvará os usuários de imagens para as quais eles podem nunca rolar. Se você tiver um grande número de imagens e quiser ter certeza de que os usuários de navegadores sem suporte para o benefício de carregamento lento, você precisará combinar isso com um dos métodos explicados a seguir.

Para saber mais, verifique o [carregamento lento no nível do navegador para a web](/browser-level-image-lazy-loading/).

### Usando o observador de intersecção {: #images-inline-intersection-observer }

Para preencher o carregamento lento de `<img>`, usamos JavaScript para verificar se eles estão na janela de visualização. Se estiverem, seus `src` (e às vezes `srcset` ) são preenchidos com URLs para o conteúdo de imagem desejado.

Se você já escreveu código de carregamento lento antes, pode ter realizado sua tarefa usando manipuladores de eventos, como `scroll` ou `resize`. Embora essa abordagem seja a mais compatível entre os navegadores, os navegadores modernos oferecem uma maneira mais eficiente e performante de fazer o trabalho de verificação da visibilidade do elemento por meio da [API Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/).

O Intersection Observer é mais fácil de usar e ler do que o código que depende de vários manipuladores de eventos, porque você só precisa registrar um observador para observar os elementos, em vez de escrever um tedioso código de detecção de visibilidade do elemento. Tudo o que resta fazer é decidir o que fazer quando um elemento estiver visível. Vamos supor este padrão de marcação básico para seus elementos `<img>`

```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="Sou uma imagem!">
```

Existem três partes relevantes dessa marcação nas quais você deve se concentrar:

1. O `class`, com o qual você selecionará o elemento em JavaScript.
2. O `src`, que faz referência a uma imagem de espaço reservado que aparecerá quando a página for carregada pela primeira vez.
3. Os `data-src` e `data-srcset`, que são atributos de espaço reservado contendo a URL para a imagem que você carregará assim que o elemento estiver na janela de visualização.

Agora vamos ver como usar o Intersection Observer em JavaScript para carregar lentamente imagens usando este padrão de marcação:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});
```

No `DOMContentLoaded` do documento, este script consulta o DOM para todos os `<img>` com uma classe de `lazy`. Se o observador de intersecção estiver disponível, crie um novo observador que execute um retorno de chamada quando os `img.lazy` entrarem na janela de visualização.

{% Glitch {id: 'lazy-intersection-observer', path: 'index.html', previewSize: 0}%}

O Intersection Observer está disponível em todos os navegadores modernos. Portanto, usá-lo como um polyfill para o `loading="lazy"` garantirá que o carregamento lento esteja disponível para a maioria dos visitantes.

## Imagens em CSS {: #images-css }

Embora as `<img>` sejam a maneira mais comum de usar imagens em páginas da web, as imagens também podem ser chamadas por meio da propriedade CSS [`background-image`](https://developer.mozilla.org/docs/Web/CSS/background-image) (e outras propriedades). O carregamento lento no nível do navegador não se aplica às imagens de fundo CSS, portanto, você precisa considerar outros métodos se tiver imagens de fundo para carregar lentamente.

Ao contrário dos `<img>` que carregam independentemente de sua visibilidade, o comportamento de carregamento de imagens em CSS é feito com mais especulação. Quando [o documento e os modelos de objeto CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model) e [a árvore de renderização](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction) são construídos, o navegador examina como o CSS é aplicado a um documento antes de solicitar recursos externos. Se o navegador determinou que uma regra CSS envolvendo um recurso externo não se aplica ao documento como ele está construído no momento, o navegador não a solicita.

Esse comportamento especulativo pode ser usado para adiar o carregamento de imagens em CSS usando JavaScript para determinar quando um elemento está na janela de visualização e, subsequentemente, aplicando uma classe a esse elemento que aplica um estilo que invoca uma imagem de fundo. Isso faz com que o download da imagem seja feito no momento necessário, em vez de no carregamento inicial. Por exemplo, vamos pegar um elemento que contém uma grande imagem de fundo de herói:

```html
<div class="lazy-background">
  <h1>Here's a hero heading to get your attention!</h1>
  <p>Here's hero copy to convince you to buy a thing!</p>
  <a href="/buy-a-thing">Buy a thing!</a>
</div>
```

O `div.lazy-background` normalmente conteria a imagem de fundo do herói invocada por algum CSS. Neste exemplo de carregamento lento, no entanto, você pode isolar a `background-image` do elemento `div.lazy-background` por meio de uma `visible` adicionada ao elemento quando ele está na janela de visualização:

```css
.lazy-background {
  background-image: url("hero-placeholder.jpg"); /* Placeholder image */
}

.lazy-background.visible {
  background-image: url("hero.jpg"); /* The final image */
}
```

A partir daqui, use JavaScript para verificar se o elemento está na janela de visualização (com Intersection Observer!) E adicione a classe `visible` `div.lazy-background` naquele momento, que carrega a imagem:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});
```

{% Glitch {id: 'lazy-background', caminho: 'index.html', previewSize: 0}%}

## Bibliotecas de carregamento lento {: #libraries }

As seguintes bibliotecas podem ser usadas para imagens de carregamento lento.

- [lazysizes](https://github.com/aFarkas/lazysizes) é uma biblioteca de carregamento lento com todos os recursos que carrega lentamente imagens e iframes. O padrão que ele usa é bastante semelhante aos exemplos de código mostrados aqui, pois se liga automaticamente a uma classe `lazyload` `<img>` e requer que você especifique URLs de imagem nos `data-src` e/ou `data-srcset` , o conteúdo de que são trocados em `src` e/ou `srcset`, respectivamente. Ele usa o Intersection Observer (que você pode preencher com polyfill) e pode ser estendido com [vários plug](https://github.com/aFarkas/lazysizes#available-plugins-in-this-repo) -ins para fazer coisas como carregamento lento de vídeo. [Saiba mais sobre como usar lazysizes](/use-lazysizes-to-lazyload-images/).
- [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) é uma opção leve para imagens de carregamento lento, imagens de fundo, vídeos, iframes e scripts. Aproveita o Intersection Observer, oferece suporte a imagens responsivas e permite o carregamento lento no nível do navegador.
- [lozad.js](https://github.com/ApoorvSaxena/lozad.js) é uma outra opção leve que usa apenas observador de intersecção. Como tal, tem alto desempenho, mas precisará ser polyfilled antes de poder ser usado em navegadores mais antigos.
- Se você precisar de uma biblioteca de carregamento lento específico do React, considere o [react-lazyload](https://github.com/jasonslyvia/react-lazyload). Enquanto ele não usa Intersection Observer, *ele* fornece um método familiar de imagens carregamento lento para aqueles acostumados a desenvolver aplicações com React.
