---
layout: post
title: First Contentful Paint (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: Este artigo apresenta a métrica First Contentful Paint (FCP) e explica como medi-la
tags:
  - performance
  - metrics
---

{% Aside %}A First Contentful Paint (FCP), ou primeira renderização de conteúdo, é uma métrica importante e centrada no usuário para medir [a velocidade de carregamento percebida](/user-centric-performance-metrics/#types-of-metrics) porque marca o primeiro ponto na linha do tempo de carregamento da página onde o usuário pode ver alguma coisa na tela: uma FCP rápida ajuda a tranquilizar o usuário que algo está [acontecendo](/user-centric-performance-metrics/#questions). {% endAside %}

## O que é FCP?

A métrica First Contentful Paint (FCP) mede o tempo desde o início do carregamento da página até o momento em que qualquer parte do conteúdo da página é renderizada na tela. Para esta métrica, "conteúdo" se refere a texto, imagens (incluindo imagens de fundo), `<svg>` ou elementos `<canvas>` não-vazios.

{% Img src="image/admin/3UhlOxRc0j8Vc4DGd4dt.png", alt="Timeline FCP do google.com", width="800", height="311", linkTo=true %}

Na linha do tempo de carregamento acima, a FCP acontece no segundo quadro, pois é quando os primeiros elementos de texto e imagem são renderizados na tela.

Você notará que embora parte do conteúdo tenha sido renderizado, nem todo ele foi renderizado. Esta é uma distinção importante a ser feita entre a *First Contentful Paint (FCP)* e a *[Largest Contentful Paint (LCP)](/lcp/)*, que tem como objetivo medir quando o conteúdo principal da página terminou de carregar.

<picture>
  <source srcset="{{ "image/eqprBhZUGfb8WYnumQ9ljAxRrA72/V1mtKJenViYAhn05WxqR.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vQKpz0S2SGnnoXHMDidj.svg", alt="Bons valores de FCP são 1,8 segundos ou menos, valores baixos são maiores que 3,0 segundos e qualquer coisa entre as necessidades de melhoria", width="400", height="300" %}
</picture>

### O que é uma boa pontuação de FCP?

Para fornecer uma boa experiência ao usuário, os sites devem se esforçar para ter uma First Contentful Paint de **1,8 segundos** ou menos. Para garantir que você esteja atingindo essa meta para a maioria de seus usuários, um bom limite para medir é o **75º percentil** de carregamentos de página, segmentado através de dispositivos móveis e desktop.

## Como medir a FCP

A FCP pode ser medida [em laboratório](/user-centric-performance-metrics/#in-the-lab) ou [em campo](/user-centric-performance-metrics/#in-the-field) e está disponível nas seguintes ferramentas:

### Ferramentas de campo

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Relatório de experiência do usuário Chrome](https://developer.chrome.com/docs/crux/)
- [Console de Busca (relatório de velocidade)](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
- [Biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Ferramentas de laboratório

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Medição da FCP em JavaScript

Para medir a FCP em JavaScript, você pode usar a [API Paint Timing](https://w3c.github.io/paint-timing/). O exemplo a seguir mostra como criar um [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) que escuta uma entrada `paint` com o nome `first-contentful-paint` e a registra no console.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

{% Aside 'warning' %}

Este código mostra como registrar a entrada `first-contentful-paint` no console, mas medir a FCP em JavaScript é mais complicado. Veja os detalhes abaixo :

{% endAside %}

No exemplo acima, a entrada registrada `first-contentful-paint` informará quando o primeiro elemento de conteúdo foi renderizado. No entanto, em alguns casos, essa entrada não é válida para medir a FCP.

A seção a seguir lista as diferenças entre o que a API informa e como a métrica é calculada.

#### Diferenças entre a métrica e a API

- A API enviará uma entrada de `first-contentful-paint` para páginas carregadas numa aba em segundo plano, mas essas páginas devem ser ignoradas ao calcular a FCP (os tempos de primeira renderização só devem ser considerados se a página estiver em primeiro plano o tempo todo).
- A API não relata `first-contentful-paint` quando a página é restaurada do [cache back/forward](/bfcache/#impact-on-core-web-vitals), mas a FCP deve ser medida nesses casos, pois os usuários as experimentam como visitas de página distintas.
- A API [pode não relatar tempos de pintura de iframes de origem cruzada](https://w3c.github.io/paint-timing/#:~:text=cross-origin%20iframes) , mas para medir corretamente a FCP, você deve considerar todos os quadros. Subquadros podem usar a API para relatar seus tempos de pintura ao quadro pai para agregação.

Em vez de memorizar todas essas diferenças sutis, os desenvolvedores podem usar a [biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir a FCP, que já lida com essas diferenças (onde for possível):

```js
import {getFCP} from 'web-vitals';

// Measure and log FCP as soon as it's available.
getFCP(console.log);
```

Para um exemplo completo de como medir a FCP em JavaScript, consulte [o código-fonte de `getFCP()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFCP.ts).

{% Aside %} Em alguns casos (como iframes de origem cruzada), não é possível medir a FCP em JavaScript. Consulte a seção de [limitações](https://github.com/GoogleChrome/web-vitals#limitations) da biblioteca `web-vitals` para mais detalhes. {% endAside %}

## Como melhorar a FCP

Para aprender como melhorar a FCP para um site específico, você pode executar uma auditoria de desempenho do Lighthouse e prestar atenção a quaisquer [oportunidades](/lighthouse-performance/#opportunities) específicas ou [diagnósticos](/lighthouse-performance/#diagnostics) que a auditoria sugerir.

Para saber como melhorar a FCP em geral (para qualquer site), consulte os seguintes guias de desempenho:

- [Elimine recursos que causam bloqueio de renderização](/render-blocking-resources/)
- [Minifique o CSS](/unminified-css/)
- [Remova o CSS não utilizado](/unused-css-rules/)
- [Pré-conecte a origens necessárias](/uses-rel-preconnect/)
- [Reduza os tempos de resposta do servidor (TTFB)](/ttfb/)
- [Evite múltiplos redirecionamentos de página](/redirects/)
- [Pré-carregue solicitações importantes](/uses-rel-preload/)
- [Evite enormes cargas de rede](/total-byte-weight/)
- [Sirva ativos estáticos com uma política de cache eficiente](/uses-long-cache-ttl/)
- [Evite um tamanho excessivo do DOM](/dom-size/)
- [Minimize a profundidade de solicitações críticas](/critical-request-chains/)
- [Certifique-se que o texto permanece visível durante o carregamento de webfonts](/font-display/)
- [Mantenha as contagens de solicitações baixas e os tamanhos de transferência pequenos](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
