---
title: 'Prática com a Portals: navegação perfeita na Web'
subhead: |2-

  Aprenda como a API Portals proposta pode melhorar sua experiência de navegação.
date: 2019-05-06
updated: 2021-02-15
authors:
  - uskay
hero: image/admin/7hJbSWnhhE1lRVHJOWI9.png
alt: Um logotipo da Portals
description: |2-

  A recém-proposta API Portals ajuda a manter seu front-end simples, permitindo uma navegação perfeita

  com transições personalizadas. Neste artigo, obtenha experiência prática usando

  Portais para melhorar a experiência do usuário em seu site.
tags:
  - blog
  - ux
feedback:
  - api
---

Garantir que suas páginas carreguem rapidamente é a chave para proporcionar uma boa experiência do usuário. Mas uma área que geralmente esquecemos são as transições de página - o que nossos usuários veem quando se movem entre as páginas.

Uma nova proposta de API de plataforma da Web, chamada [Portals](https://github.com/WICG/portals), visa ajudar nisso, simplificando a experiência conforme os usuários navegam *em* seu site.

Veja a Portals em ação:

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/hands-on-portals/portals_vp9.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/hands-on-portals/portals_h264.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>Integrações e navegação perfeitas com a Portals. Criado por <a href="https://twitter.com/argyleink">Adam Argyle</a>.</figcaption></figure>

## O que a Portals possibilita fazer

Os aplicativos de página única (SPAs) oferecem ótimas transições, mas têm um custo de construção mais complexo. Aplicativos de várias páginas (MPAs) são muito mais fáceis de construir, mas você acaba com telas em branco entre as páginas.

Os portais oferecem o melhor dos dois mundos: a baixa complexidade de um MPA com as transições perfeitas de um SPA. Pense neles como um `<iframe>`, pois permitem a incorporação, mas, ao contrário de um `<iframe>`, eles também vêm com recursos para navegar até seu conteúdo.

Ver para crer: primeiro confira o que apresentamos no Chrome Dev Summit 2018:

{% YouTube id = 'Ai4aZ9Jbsys', startTime = '1081'%}

Com as navegações clássicas, os usuários precisam esperar com uma tela em branco até que o navegador termine de renderizar o destino. Com a Portals, os usuários podem experimentar uma animação, enquanto o `<portal>` pré-renderiza o conteúdo e cria uma experiência de navegação contínua.

Antes da Portals, poderíamos ter renderizado outra página usando um `<iframe>`. Também poderíamos ter adicionado animações para mover o quadro pela página. Mas um `<iframe>` não permite que você navegue em seu conteúdo. A Portals fecham essa lacuna, permitindo casos de uso interessantes.

## Experimente a Portals

### Ativando por meio de about: // flags {: # enable-flags}

Experimente a Portals no Chrome 85 e versões posteriores lançando um sinalizador experimental:

- Habilite o `about://flags/#enable-portals` para navegações da mesma origem.
- Para testar navegações entre origens, habilite o `about://flags/#enable-portals-cross-origin` adicionalmente.

Durante essa fase inicial de testes da Portals, também recomendamos o uso de um diretório de dados do usuário completamente separado para seus testes, definindo a sinalização de linha de comando [`--user-data-dir`](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md#command-line) Assim que a Portals estiver habilitada, confirme no DevTools se você possui o novo `HTMLPortalElement` brilhante.

{% Img src="image/admin/aUrrqhzMxaEX865Fk5zX.png", alt="Uma captura de tela do console DevTools mostrando o HTMLPortalElement", width="800", height="252" %}

## Implementar a Portals

Vamos examinar um exemplo básico de implementação.

```javascript
// Create a portal with the wikipedia page, and embed it
// (like an iframe). You can also use the <portal> tag instead.
portal = document.createElement('portal');
portal.src = 'https://en.wikipedia.org/wiki/World_Wide_Web';
portal.style = '...';
document.body.appendChild(portal);

// When the user touches the preview (embedded portal):
// do fancy animation, e.g. expand …
// and finish by doing the actual transition.
// For the sake of simplicity, this snippet will navigate
// on the `onload` event of the Portals element.
portal.addEventListener('load', (evt) => {
   portal.activate();
});
```

É simples assim. Tente este código no console do DevTools, a página da wikipedia deve abrir.

{% Img src="image/admin/rp6i8ngGJkvooXJ9WmLK.gif", alt="Um gif da demonstração do estilo do portal de prévia", width="800", height="557" %}

Se você quiser construir algo como mostramos no Chrome Dev Summit, que funciona exatamente como a demo acima, o seguinte snippet será de seu interesse.

```javascript
// Adding some styles with transitions
const style = document.createElement('style');
style.innerHTML = `
  portal {
    position:fixed;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 20px 10px #999;
    transform: scale(0.4);
    transform-origin: bottom left;
    bottom: 20px;
    left: 20px;
    animation-name: fade-in;
    animation-duration: 1s;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }
  .portal-transition {
    transition: transform 0.4s;
  }
  @media (prefers-reduced-motion: reduce) {
    .portal-transition {
      transition: transform 0.001s;
    }
  }
  .portal-reveal {
    transform: scale(1.0) translateX(-20px) translateY(20px);
  }
  @keyframes fade-in {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
`;
const portal = document.createElement('portal');
// Let's navigate into the WICG Portals spec page
portal.src = 'https://wicg.github.io/portals/';
// Add a class that defines the transition. Consider using
// `prefers-reduced-motion` media query to control the animation.
// https://developers.google.com/web/updates/2019/03/prefers-reduced-motion
portal.classList.add('portal-transition');
portal.addEventListener('click', (evt) => {
  // Animate the portal once user interacts
  portal.classList.add('portal-reveal');
});
portal.addEventListener('transitionend', (evt) => {
  if (evt.propertyName == 'transform') {
    // Activate the portal once the transition has completed
    portal.activate();
  }
});
document.body.append(style, portal);
```

Também é fácil fazer a detecção de recursos para aprimorar progressivamente um site usando a Portals.

```javascript
if ('HTMLPortalElement' in window) {
  // If this is a platform that have Portals...
  const portal = document.createElement('portal');
  ...
}
```

Se você quiser experimentar rapidamente como é a Portals, tente usar [uskay-portals-demo.glitch.me](https://uskay-portals-demo.glitch.me). Certifique-se de acessá-lo com o Chrome 85 ou versões posteriores e ative o [sinalizador experimental](#enable-flags)!

1. Insira um URL que deseja visualizar.
2. A página será então incorporada como um elemento `<portal>`
3. Clique na visualização.
4. A visualização será ativada após uma animação.

{% Img src="image/admin/Y4Vv6v3DAAC32IsiWS7g.gif", alt="Um gif do uso da demonstração de falha do uso da Portals", width="800", height="547" %}

## Confira as especificações

Estamos discutindo ativamente [a especificação da Portals](https://wicg.github.io/portals/) no Web Incubation Community Group (WICG). Para começar a trabalhar rapidamente, dê uma olhada em alguns dos [principais cenários](https://github.com/WICG/portals/blob/master/key-scenarios.md). Estes são os três recursos importantes com os quais você deve se familiarizar:

- [O elemento `<portal>`](https://wicg.github.io/portals/#the-portal-element): o próprio elemento HTML. A API é muito simples. Consiste no `src`, a `activate` e uma interface para mensagens (`postMessage`). `activate` recebe um argumento opcional para passar dados para o `<portal>` na ativação.
- [A interface `portalHost`](https://wicg.github.io/portals/#the-portalhost-interface): Adiciona um objeto `portalHost` ao objeto `window` Isso permite que você verifique se a página está incorporada como um elemento `<portal>` Ele também fornece uma interface para mensagens (`postMessage`) de volta ao host.
- [A interface PortalActivateEvent:](https://wicg.github.io/portals/#the-portalactivateevent-interface) Um evento que dispara quando o `<portal>` é ativado. Há uma função `adoptPredecessor` chamada adoptPredecessor que você pode usar para recuperar a página anterior como um elemento `<portal>` Isso permite que você crie navegações contínuas e experiências compostas entre duas páginas.

Vamos olhar além do padrão básico de uso. Aqui está uma lista não exaustiva do que você pode conseguir com a Portals, juntamente com o código de amostra.

### Personalize o estilo quando incorporado como um elemento `<portal>`

```javascript
// Detect whether this page is hosted in a portal
if (window.portalHost) {
  // Customize the UI when being embedded as a portal
}
```

### Mensagens entre o elemento `<portal>` `portalHost`

```javascript
// Send message to the portal element
const portal = document.querySelector('portal');
portal.postMessage({someKey: someValue}, ORIGIN);

// Receive message via window.portalHost
window.portalHost.addEventListener('message', (evt) => {
  const data = evt.data.someKey;
  // handle the event
});
```

### Ativando o `<portal>` e recebendo o evento `portalactivate`

```javascript
// You can optionally add data to the argument of the activate function
portal.activate({data: {somekey: 'somevalue'}});

// The portal content will receive the portalactivate event
// when the activate happens
window.addEventListener('portalactivate', (evt) => {
  // Data available as evt.data
  const data = evt.data;
});
```

### Recuperando o predecessor

```javascript
// Listen to the portalactivate event
window.addEventListener('portalactivate', (evt) => {
  // ... and creatively use the predecessor
  const portal = evt.adoptPredecessor();
  document.querySelector('someElm').appendChild(portal);
});
```

### Saber que sua página foi adotada como predecessora

```javascript
// The activate function returns a Promise.
// When the promise resolves, it means that the portal has been activated.
// If this document was adopted by it, then window.portalHost will exist.
portal.activate().then(() => {
  // Check if this document was adopted into a portal element.
  if (window.portalHost) {
    // You can start communicating with the portal element
    // i.e. listen to messages
    window.portalHost.addEventListener('message', (evt) => {
      // handle the event
    });
  }
});
```

Ao combinar todos os recursos suportados pela Portals, você pode criar experiências de usuário realmente fantásticas. Por exemplo, a demonstração abaixo demonstra como os Portais podem permitir uma experiência do usuário perfeita entre um site e o conteúdo incorporado de terceiros.

{% YouTube '4JkipxFVE9k' %}

{% Aside %} Interessado nesta demonstração? [Faça um fork no GitHub](https://github.com/WICG/portals/tree/master/demos/portal-embed-demo) e crie sua própria versão! {% endAside %}

## Casos de uso e planos

Esperamos que você tenha gostado deste breve tour pela Portals! Mal podemos esperar para ver o que você pode fazer. Por exemplo, você pode querer começar a usar a Portals para navegações não triviais, como: pré-renderizar a página de seu produto mais vendido a partir de uma página de lista de categorias de produtos.

Outra coisa importante a saber é que a Portals pode ser usada em navegações de origem cruzada, assim como um `<iframe>`. Portanto, se você tiver vários sites que se cruzam, também pode usar a Portals para criar navegações contínuas entre dois sites diferentes. Este caso de uso de origem cruzada é muito exclusivo para a Portals e pode até melhorar a experiência do usuário de SPAs.

## Compartilhe o seu feedback

Os portais estão prontos para experimentação no Chrome 85 e versões posteriores. O feedback da comunidade é crucial para o design de novas APIs, então experimente e diga-nos o que você acha! Se você tiver solicitações de recursos ou comentários, acesse o [repositório WICG GitHub](https://github.com/WICG/portals/issues).
