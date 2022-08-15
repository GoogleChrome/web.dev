---
layout: post
title: Carregue recursos de terceiros de forma lazy com fachadas
description: Aprenda sobre as oportunidades de carregamento lazy de recursos de terceiros com fachadas.
date: 2020-12-01
web_lighthouse:
  - third-party-facades
---

[Recursos de terceiros](/third-party-javascript/) costumam ser usados para exibir anúncios ou vídeos e integrar-se a mídias socias. A abordagem default é carregar recursos de terceiros assim que a página for carregada, mas isto pode retardar desnecessariamente o carregamento da página. Se o conteúdo de terceiros não for crítico, esse custo de desempenho pode ser reduzido usando [carregamento lazy](/fast/#lazy-load-images-and-video).

Esta auditoria destaca incorporações de terceiros que podem ser carregadas de forma lazy durante a interação. Nesse caso, uma *fachada* é usada no lugar do conteúdo de terceiros até que o usuário interaja com ele.

{% Aside 'key-term' %}

Uma *fachada* é um elemento estático que parece com o componente de terceiros que é incorporado, mas não é funcional e, portanto, muito menos oneroso no carregamento da página.

{% endAside %}

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cvQ4fxFUG5MIXtUfi77Z.jpg", alt="Um exemplo de carregamento do player incorporado do YouTube com uma fachada. A fachada consome 3 KB e o player, que requer 540 KB, é carregado na interação.", width="800", height="521" %}   <figcaption>     Carregando um player incorporado do YouTube com uma fachada.  </figcaption></figure>

## Como o Lighthouse detecta incorporações de terceiros que podem ter o carregamento adiado

O Lighthouse procura produtos de terceiros que podem ser adiados, como widgets de botão social ou embeds de vídeo (por exemplo, um player incorporado do YouTube).

Os dados sobre produtos que podem ser adiados e fachadas disponíveis são [mantidos em uma web de terceiros](https://github.com/patrickhulce/third-party-web/).

A auditoria falhará se a página carregar recursos pertencentes a uma dessas incorporações de terceiros.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R0osncucBqYCIZfC85Hu.jpg", alt="Auditoria de fachada de terceiros do farol destacando o player incorporado do Vimeo e o bate-papo ao vivo do Drift.", width="800", height="517" %}   <figcaption>     Auditoria de fachada de terceiros do  Lighthouse.  </figcaption></figure>

## Como adiar componentes de terceiros com uma fachada

Em vez de incluir uma incorporação de componente de terceiros diretamente ao seu HTML, carregue a página com um elemento estático que se pareça com o embed de terceiros. O padrão de interação deve ser algo da seguinte forma:

1. No carregamento: adicione a fachada à página.

2. Ao passar o mouse: a fachada conecta-se previamente a recursos de terceiros.

3. Ao clicar: a fachada é substituida pelo produto de terceiros.

## Fachadas recomendadas

Em geral, incorporações de vídeo, widgets de botão social e widgets de bate-papo podem empregar o padrão fachada (facade). A lista abaixo oferece nossas recomendações de fachadas de código aberto. Ao escolher uma fachada, leve em consideração o equilíbrio entre o tamanho e o conjunto de recursos. Você também pode usar um carregador lazy de iframes como [vb/lazyframe](https://github.com/vb/lazyframe).

### YouTube player incorporado

- [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)

- [justinribeiro/lite-youtube](https://github.com/justinribeiro/lite-youtube)

- [Daugilas/lazyYT](https://github.com/Daugilas/lazyYT)

### Vimeo player incorporado

- [luwes/lite-vimeo-embed](https://github.com/luwes/lite-vimeo-embed)

- [slightlyoff/lite-vimeo](https://github.com/slightlyoff/lite-vimeo)

### Bate-papo ao vivo (Intercom, Drift, Help Scout, Facebook Messenger)

- [calibreapp/react-live-chat-loader](https://github.com/calibreapp/react-live-chat-loader) ([blog post](https://calibreapp.com/blog/fast-live-chat))

{% Aside 'caution' %}

Existem algumas desvantagens ao carregar componentes de terceiros com fachadas de forma lazy, pois elas não têm toda a gama de funcionalidades dos embeds originais. Por exemplo, a bolha do Drift Live Chat tem um ícone que indica o número de novas mensagens. Se o Live Chat for adiado com uma fachada, a bolha aparecerá quando o widget de bate-papo real for carregado depois que o navegador disparar `requestIdleCallback`. Para incorporações de vídeo, a reprodução automática (autoplay) poderá não funcionar de forma consistente se for carregada de forma lazy.

{% endAside %}

## Escrevendo sua própria fachada

Você pode preferir [construir uma solução de fachada personalizada](https://wildbit.com/blog/2020/09/30/getting-postmark-lighthouse-performance-score-to-100#:~:text=What%20if%20we%20could%20replace%20the%20real%20widget) que emprega o padrão de interação descrito acima. A fachada deve ser significativamente menor em comparação com o produto adiado de terceiros e incluir apenas o código mínimo necessário para imitar a aparência do produto.

Se você deseja que sua solução seja incluída na lista acima, dê uma olhada no [processo de submissão](https://github.com/patrickhulce/third-party-web/blob/master/facades.md).

## Recursos

Código-fonte para a auditoria [Carregue recursos de terceiros de forma lazy com fachadas](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/third-party-facades.js).
