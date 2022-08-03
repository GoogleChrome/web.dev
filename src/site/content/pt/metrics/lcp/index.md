---
layout: post
title: Largest Contentful Paint (LCP)
authors:
  - philipwalton
date: 2019-08-08
updated: 2022-07-18
description: Este artigo apresenta a métrica Largest Contentful Paint (LCP) e explica como medi-la
tags:
  - performance
  - metrics
---

{% Aside %} Largest Contentful Paint (LCP), ou Maior Renderização de Conteúdo, é uma métrica importante e centrada no usuário para medir [a velocidade de carregamento percebida](/user-centric-performance-metrics/#types-of-metrics) porque marca o ponto na linha do tempo de carregamento da página quando o conteúdo principal da página provavelmente já foi carregado. Uma LCP rápida ajuda a assegurar ao usuário que o página é [útil](/user-centric-performance-metrics/#questions). {% endAside %}

Historicamente, tem sido um desafio para os desenvolvedores web medir a rapidez com que o conteúdo principal de uma página web carrega e torna-se visível aos usuários.

Métricas mais antigas, como [load](https://developer.mozilla.org/docs/Web/Events/load) ou [DOMContentLoaded,](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded) não são boas porque não correspondem necessariamente ao que o usuário vê na tela. E as métricas de desempenho mais novas e centradas no usuário, como a [First Contentful Paint (FCP),](/fcp/) capturam apenas o início da experiência de carregamento. Se uma página mostra uma tela inicial ou exibe um indicador de carregamento, este momento não é muito relevante para o usuário.

No passado, recomendamos métricas de desempenho como [First Meaningful Paint (FMP)](/first-meaningful-paint/) e [Speed Index (SI)](/speed-index/) (ambas disponíveis no Lighthouse) para ajudar a capturar mais aspectos da experiência de carregamento após a renderização inicial, mas essas métricas são complexas, difíceis de explicar e muitas vezes incorretas, o que significa que ainda não identificam quando o conteúdo principal da página foi carregado.

Às vezes, o mais simples é o melhor. Com base em discussões no [W3C Web Performance Working Group](https://www.w3.org/webperf/) e em pesquisas feitas no Google, descobrimos que uma maneira mais precisa de medir quando o conteúdo principal de uma página é carregado é verificar quando o maior elemento foi renderizado.

## O que é LCP?

A métrica Largest Contentful Paint (LCP) informa o tempo de renderização da maior [imagem ou bloco de texto](#what-elements-are-considered) visível na janela de visualização (viewport), em relação a quando a página [começou a carregar pela primeira vez](https://w3c.github.io/hr-time/#timeorigin-attribute).

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/8ZW8LQsagLih1ZZoOmMR.svg", alt="Bons valores de LCP são 2,5 segundos, valores fracos são maiores que 4,0 segundos e qualquer coisa entre precisa de melhorias", width="400", height="300" %}
</picture>

### O que é uma boa pontuação de LCP?

Para fornecer uma boa experiência ao usuário, os sites devem se esforçar para ter uma Largest Contentful Paint de **2,5 segundos** ou menos. Para garantir que você esteja atingindo essa meta para a maioria de seus usuários, um bom limite para medir é o **75º percentil** de carregamentos de página, segmentado através de dispositivos móveis e desktop.

{% Aside %} Para saber mais sobre a pesquisa e a metodologia por trás dessa recomendação, veja: [Definindo os limites das Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

### Que elementos são considerados?

Conforme especificado atualmente na [API da Largest Contentful Paint](https://wicg.github.io/largest-contentful-paint/), os tipos de elementos considerados para a Largest Contentful Paint são:

- Elementos `<img>`
- `<image>` dentro de um elemento `<svg>`
- `<video>` (a imagem do pôster é usada)
- Um elemento com uma imagem de plano de fundo carregada por meio da [`url()`](https://developer.mozilla.org/docs/Web/CSS/url()) (em oposição a um [gradiente CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Images/Using_CSS_gradients) )
- [Elementos de bloco](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements) contendo nós de texto ou outros elementos-filho de texto inline.

Observe que restringir os elementos a este conjunto limitado foi intencional para manter as coisas simples no início. Elementos adicionais (por exemplo, `<svg>`, `<video>` ) podem ser adicionados no futuro, à medida em que mais pesquisas são realizadas.

### Como o tamanho de um elemento é determinado?

O tamanho do elemento relatado para a métrica Largest Contentful Paint é normalmente o tamanho que é visível para o usuário dentro da janela de visualização (viewport). Se o elemento se estender para fora da janela de visualização, ou se algum dos elementos for cortado ou tiver um [overflow](https://developer.mozilla.org/docs/Web/CSS/overflow) invisível, essas partes não serão contadas para o tamanho do elemento.

Para elementos de imagem que foram redimensionados de seu [tamanho intrínseco](https://developer.mozilla.org/docs/Glossary/Intrinsic_Size), o tamanho relatado é o tamanho visível ou o tamanho intrínseco, o que for menor. Por exemplo, imagens que são reduzidas a um tamanho muito menor do que seu tamanho intrínseco apenas relatam o tamanho em que são exibidas, enquanto imagens que são esticadas ou expandidas para um tamanho maior relatam apenas seus tamanhos intrínsecos.

Para elementos de texto, apenas o tamanho de seus nós de texto é considerado (o menor retângulo que abrange todos os nós de texto).

Para todos os elementos, qualquer margem externa (margin), margem interna (padding) ou borda (border) aplicada via CSS não é considerada.

{% Aside %} Determinar quais nós de texto pertencem a quais elementos às vezes pode ser complicado, especialmente para elementos cujos filhos incluem não apenas elementos inline e nós de texto simples, mas também elementos de bloco. A questão principal é que cada nó de texto pertence apenas ao seu elemento ancestral de bloco mais próximo. Nos [termos da especificação](https://wicg.github.io/element-timing/#set-of-owned-text-nodes): cada nó de texto pertence ao elemento que gera o [bloco que o contém](https://developer.mozilla.org/docs/Web/CSS/Containing_block). {% endAside %}

### Quando é relatada a renderização de maior conteúdo?

As páginas Web geralmente são carregadas em estágios e, como resultado, é possível que o maior elemento da página mude.

Para lidar com esse potencial de mudança, o navegador despacha um [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) do tipo `largest-contentful-paint` identificando o elemento de maior conteúdo assim que o navegador renderizar o primeiro quadro. Mas depois, após a renderização dos quadros subsequentes, ele despachará outro [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) sempre que o elemento de maior conteúdo mudar.

Por exemplo, numa página com texto e uma imagem principal, o navegador pode inicialmente apenas renderizar o texto, momento em que o navegador enviaria uma entrada de `largest-contentful-paint` cuja propriedade `element` provavelmente faria referência a um `<p>` ou `<h1>`. Posteriormente, quando a imagem herói terminar de carregar, uma segunda entrada `largest-contentful-paint` seria despachada e sua propriedade `element` faria referência ao elemento `<img>`.

É importante observar que um elemento só pode ser considerado o maior elemento com conteúdo depois de renderizado e estar visível para o usuário. Imagens que ainda não foram carregadas não são consideradas "renderizadas". Nem nós de texto que usam fontes da web durante o [período de bloqueio de fontes](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#The_font_display_timeline). Nesses casos, um elemento menor pode ser relatado como o maior elemento de conteúdo, mas assim que o elemento maior terminar sua renderização, ele será relatado por meio de outro objeto `PerformanceEntry`

Além de imagens e fontes de carregamento tardio, uma página pode adicionar novos elementos ao DOM conforme novo conteúdo se torna disponível. Se algum desses novos elementos for maior do que o maior elemento de conteúdo anterior, um novo `PerformanceEntry` também será relatado.

Se um elemento que atualmente é o maior elemento de conteúdo for removido da janela de visualização (ou mesmo removido do DOM), ele permanecerá sendo o maior elemento de conteúdo, a menos que um elemento maior seja renderizado.

{% Aside %} Antes do Chrome 88, os elementos removidos não eram considerados elementos de maior conteúdo e a remoção do candidato atual acionaria uma nova entrada de `largest-contentful-paint` a ser despachada. No entanto, devido a padrões populares de IU, como carrosséis de imagens que frequentemente removiam elementos DOM, a métrica foi atualizada para refletir com mais precisão a experiência do usuário. Veja o [CHANGELOG](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md) para mais detalhes. {% endAside %}

O navegador irá parar de relatar novas entradas assim que o usuário interagir com a página (por meio de um toque, rolagem de tela ou pressionamento de tecla), já que a interação do usuário frequentemente altera o que é visível para o usuário (principalmente com a rolagem).

Para fins de análise, você deve relatar apenas o `PerformanceEntry` despachado mais recentemente para seu serviço de análise.

{% Aside 'caution' %} Como os usuários podem abrir páginas numa aba de fundo, é possível que a renderização com maior conteúdo não aconteça até que o usuário focalize a aba, o que pode ocorrer muito depois do instante em que a página foi carregada pela primeira vez. {% endAside %}

#### Tempo de carregamento vs. tempo de renderização

Por questões de segurança, o timestamp de renderização das imagens não é exposto para imagens de origem cruzada que não possuem o cabeçalho [`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin) Em vez disso, apenas seu tempo de carregamento é exposto (uma vez que já é exposto via várias outras APIs da web).

O [exemplo de uso](#measure-lcp-in-javascript) abaixo mostra como lidar com elementos cujo tempo de renderização não está disponível. Mas, quando possível, é sempre recomendável definir o [`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin), para que suas métricas sejam mais precisas.

### Como são tratadas as alterações de layout e tamanho do elemento?

Para manter baixo o overhead de calcular e despachar novas entradas de desempenho, alterações no tamanho ou na posição de um elemento não geram novos candidatos a LCP. Apenas o tamanho inicial do elemento e a posição na janela de visualização (viewport) são considerados.

Isto significa que as imagens que são inicialmente renderizadas off-screen e, em seguida, fazem a transição para on-screen podem não ser relatadas. Também significa que os elementos inicialmente renderizados no viewport que, em seguida, são empurrados para baixo, para fora do viewport, ainda relatam seu tamanho inicial dentro do viewport.

### Exemplos

Aqui estão alguns exemplos de quando a Largest Contentful Paint ocorre em alguns sites populares:

{% Img src="image/admin/bsBm8poY1uQbq7mNvVJm.png", alt="Linha do tempo da Largest Contentful Paint de cnn.com", width="800", height="311" %}

{% Img src="image/admin/xAvLL1u2KFRaqoZZiI71.png", alt="Linha do tempo da Largest Contentful Paint de techcrunch.com", width="800", height="311" %}

Em ambas as linhas do tempo acima, o maior elemento muda conforme o conteúdo é carregado. No primeiro exemplo, novo conteúdo é adicionado ao DOM e isto muda o elemento que é o maior. No segundo exemplo, o layout muda e o conteúdo que era anteriormente o maior é removido do viewport.

Embora seja comum o conteúdo de carregamento tardio ser maior que o conteúdo que já está na página, esse não é necessariamente o caso. Os próximos dois exemplos mostram a Largest Contentful Paint ocorrendo antes da página carregar totalmente.

{% Img src="image/admin/uJAGswhXK3bE6Vs4I5bP.png", alt="Linha do tempo da Largest Contentful Paint do instagram.com", width="800", height="311" %}

{% Img src="image/admin/e0O2woQjZJ92aYlPOJzT.png", alt="Linha do tempo da Largest Contentful Paint do google.com", width="800", height="311" %}

No primeiro exemplo, o logotipo do Instagram é carregado relativamente cedo e continua sendo o maior elemento, mesmo quando outro conteúdo é mostrado progressivamente. No exemplo da página de resultados de pesquisa do Google, o maior elemento é um parágrafo de texto que é exibido antes que qualquer uma das imagens ou logotipo termine de carregar. Como todas as imagens individuais são menores do que este parágrafo, ele continua sendo o maior elemento em todo o processo de carregamento.

{% Aside %} No primeiro quadro da linha do tempo do Instagram, você pode perceber que o logotipo da câmera não tem uma caixa verde ao redor. Isto é porque é um elemento `<svg>` e elementos `<svg>` não são considerados candidatos LCP. O primeiro candidato LCP é o texto no segundo quadro. {% endAside %}

## Como medir a LCP

A LCP pode ser medida [em laboratório](/user-centric-performance-metrics/#in-the-lab) ou [em campo](/user-centric-performance-metrics/#in-the-field) e está disponível nas seguintes ferramentas:

### Ferramentas de campo

- [Relatório de Experiência do Usuário Chrome](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Console de Busca (relatório Core Web Vitals)](https://support.google.com/webmasters/answer/9205520)
- [Biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Ferramentas de laboratório

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://webpagetest.org/)

### Medição da LCP em JavaScript

Para medir o LCP em JavaScript, você pode usar a [API Largest Contentful Paint](https://wicg.github.io/largest-contentful-paint/). O exemplo a seguir mostra como criar um [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) que escuta as `largest-contentful-paint` e as registra no console.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

{% Aside 'warning' %}

Este código mostra como registrar `largest-contentful-paint` no console, mas medir a LCP em JavaScript é mais complicado. Veja detalhes abaixo:

{% endAside %}

No exemplo acima, cada `largest-contentful-paint` registrada representa o candidato LCP atual. Em geral, o `startTime` da última entrada emitida é o valor LCP. No entanto, nem sempre é esse o caso. Nem todas as `largest-contentful-paint` são válidas para medir a LCP.

A seção a seguir lista as diferenças entre o que a API informa e como a métrica é calculada.

#### Diferenças entre a métrica e a API

- A API despachará `largest-contentful-paint` para páginas carregadas numa aba de plano de fundo, mas essas páginas devem ser ignoradas ao calcular o LCP.
- A API continuará a despachar `largest-contentful-paint` depois que uma página for colocada em segundo plano, mas essas entradas devem ser ignoradas ao calcular a LCP (elementos só podem ser considerados se a página estiver em primeiro plano o tempo todo).
- A API não relata `largest-contentful-paint` quando a página é restaurada do [cache back/forward](/bfcache/#impact-on-core-web-vitals), mas a LCP deve ser medida nesses casos, pois os usuários as experimentam como visitas de página distintas.
- A API não considera elementos dentro de iframes, mas para medir corretamente a LCP, você deve considerá-los. Os subquadros podem usar a API para relatar suas `largest-contentful-paint` ao quadro pai para agregação.

Em vez de memorizar todas essas diferenças sutis, os desenvolvedores podem usar a [biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir a LCP, que já lida com essas diferenças (onde for possível):

```js
import {getLCP} from 'web-vitals';

// Measure and log LCP as soon as it's available.
getLCP(console.log);
```

Para um exemplo completo de como medir a LCP em JavaScript, consulte [o código-fonte de `getLCP()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts).

{% Aside %} Em alguns casos (como iframes de origem cruzada), não é possível medir a LCP em JavaScript. Consulte a seção de [limitações](https://github.com/GoogleChrome/web-vitals#limitations) da biblioteca `web-vitals` para mais detalhes. {% endAside %}

### E se o maior elemento não for o mais importante?

Em alguns casos, o elemento (ou elementos) mais importante na página não é o maior, e os desenvolvedores podem estar mais interessados em medir os tempos de renderização desses outros elementos. Isto é possível usando a [API Element Timing](https://wicg.github.io/element-timing/), da forma detalhada no artigo sobre [métricas personalizadas](/custom-metrics/#element-timing-api).

## Como melhorar a LCP

A LCP é afetada principalmente por quatro fatores:

- Tempos de resposta lentos do servidor
- JavaScript e CSS que bloqueiam a renderização
- Tempos de carregamento de recursos
- Renderização do lado do cliente

Para saber como melhorar a LCP, veja [Otimize a LCP](/optimize-lcp/). Para obter orientações adicionais sobre técnicas de desempenho individual que também podem melhorar a LCP, consulte:

- [Aplique carregamento instantâneo com o padrão PRPL](/apply-instant-loading-with-prpl)
- [Otimizando o Caminho de Renderização Crítico](/critical-rendering-path/)
- [Otimize seu CSS](/fast#optimize-your-css)
- [Otimize suas imagens](/fast#optimize-your-images)
- [Otimize fontes da web](/fast#optimize-web-fonts)
- [Otimize seu JavaScript](/fast#optimize-your-javascript) (para sites renderizados pelo cliente)

## Recursos adicionais

- [Lessons learned from performance monitoring in Chrome (Lições aprendidas com o monitoramento de desempenho no Chrome)](https://youtu.be/ctavZT87syI) por [Annie Sullivan](https://anniesullie.com/) em [performance.now()](https://perfnow.nl/) (2019)

{% include 'content/metrics/metrics-changelog.njk' %}
