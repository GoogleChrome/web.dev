---
layout: post
title: Cumulative Layout Shift (CLS)
authors:
  - philipwalton
  - mihajlija
date: '2019-06-11'
updated: '2021-06-01'
description: Este artigo apresenta a métrica Cumulative Layout Shift (CLS) e explica como medi-la.
tags:
  - performance
  - metrics
  - web-vitals
---

{% Banner 'caution', 'body' %} **1º de junho de 2021:** A implementação da CLS mudou. Para saber mais sobre os motivos por trás da mudança, veja [Evoluindo a métrica CLS](/evolving-cls) . {% endBanner %}

{% Aside 'key-term' %} Cumulative Layout Shift (CLS), ou Mudança Cumulativa de Layout, é uma métrica importante e centrada no usuário para medir a [estabilidade visual](/user-centric-performance-metrics/#types-of-metrics) porque ajuda a quantificar a frequência com que os usuários experimentam mudanças inesperadas de layout: uma CLS baixa ajuda a garantir que a página seja [agradável](/user-centric-performance-metrics/#questions). {% endAside %}

Já aconteceu de você estar lendo um artigo online quando algo muda repentinamente na página? Sem aviso, o texto se move e você perdeu o seu lugar. Ou ainda pior: você está prestes a tocar num link ou botão, mas um instante antes do seu dedo pousar - BOOM - o link se move e você acaba clicando noutra coisa!

Most of the time these kinds of experiences are just annoying, but in some cases, they can cause real damage.

<figure class="w-figure">
  <video autoplay controls loop muted class="w-screenshot" poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png" width="658" height="510">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">     A screencast illustrating how layout instability can negatively affect     users.   </figcaption></figure>

O movimento inesperado do conteúdo da página geralmente ocorre porque os recursos são carregados de forma assíncrona ou os elementos do DOM são adicionados dinamicamente à página acima do conteúdo existente. O culpado pode ser uma imagem ou vídeo com dimensões desconhecidas, uma fonte que fica maior ou menor que sua substituta ou um anúncio ou widget de terceiros que se redimensiona dinamicamente.

What makes this issue even more problematic is that how a site functions in development is often quite different from how users experience it. Personalized or third-party content often doesn't behave the same in development as it does in production, test images are often already in the developer's browser cache, and API calls that run locally are often so fast that the delay isn't noticeable.

The Cumulative Layout Shift (CLS) metric helps you address this problem by measuring how often it's occurring for real users.

## What is CLS?

CLS é uma medida da maior explosão de ocorrências de *mudança de layout* para cada mudança de layout [inesperada](/cls/#expected-vs.-unexpected-layout-shifts) que ocorre durante toda a existência de uma página.

A *layout shift* occurs any time a visible element changes its position from one rendered frame to the next. (See below for details on how individual [layout shift scores](#layout-shift-score) are calculated.)

Uma explosão de mudanças de layout, conhecida como [*janela de sessão*](evolving-cls/#why-a-session-window) (session window), ocorre quando uma ou mais mudanças de layout individuais acontecem em rápida sucessão com menos de 1 segundo entre cada mudança e um máximo de 5 segundos para a duração total da janela.

A maior explosão é a janela da sessão com a pontuação cumulativa máxima de todas as mudanças de layout dentro dessa janela.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot" width="658" height="452">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption class="w-figcaption">     Example of session windows. Blue bars represent the scores of each individual layout shift.   </figcaption></figure>

{% Aside 'caution' %} Anteriormente, a CLS media a soma total de *todas as pontuações de mudança de layout individuais* que ocorriam durante a existência da página. Para ver quais ferramentas ainda fornecem a capacidade de fazer benchmarks em relação à implementação original, dê uma olhada em [Evolução da Cumulative Layout Shift em ferramentas da web](/cls-web-tooling). {% endAside %}

### What is a good CLS score?

Para fornecer uma boa experiência ao usuário, os sites devem se esforçar para ter uma pontuação CLS de **0,1** ou menos. Para garantir que você esteja atingindo essa meta para a maioria de seus usuários, um bom limite para medir é o **75º percentil** de carregamentos de página, segmentado através de dispositivos móveis e desktop.

<picture>
  <source srcset="{{ " image imgix media="(min-width: 640px)" width="400" height="100">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="Good CLS values are under 0.1, poor values are greater than 0.25 and anything in between needs improvement", width="400", height="300", class="w-screenshot w-screenshot--filled width-full" %} </source></picture>

{% Aside %} Para saber mais sobre a pesquisa e a metodologia por trás dessa recomendação, veja: [Definindo os limites das Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

## Mudanças de layout em detalhes

As mudanças de layout são definidas pela [API de instabilidade de layout](https://github.com/WICG/layout-instability), que relata entradas `layout-shift` sempre que um elemento visível na viewport muda sua posição inicial (por exemplo, sua posição superior e esquerda no [modo de escrita](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode) default) entre dois quadros. Esses elementos são considerados *elementos instáveis* .

Observe que as mudanças de layout ocorrem apenas quando os elementos existentes mudam sua posição inicial. Se um novo elemento for adicionado ao DOM ou um elemento existente mudar de tamanho, isto não conta como uma mudança de layout - desde que a mudança não faça com que outros elementos visíveis mudem sua posição inicial.

### Layout shift score

Para calcular a *pontuação de mudança de layout* , o navegador observa o tamanho do viewport e o movimento dos *elementos instáveis* no viewport entre dois quadros renderizados. A pontuação de mudança de layout é um produto de duas medidas desse movimento: a *fração de impacto* e a *fração de distância* (ambas definidas abaixo).

```text
layout shift score = impact fraction * distance fraction
```

### Impact fraction

A [fração de impacto](https://github.com/WICG/layout-instability#Impact-Fraction) mede como os *elementos instáveis* afetam a área da janela de visualização (viewport) entre dois quadros.

The union of the visible areas of all *unstable elements* for the previous frame *and* the current frame—as a fraction of the total area of the viewport—is the *impact fraction* for the current frame.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BbpE9rFQbF8aU6iXN1U6.png", alt="Exemplo de fração de impacto com um *elemento instável*", width="800", height="600", linkTo=true %}

Na imagem acima, há um elemento que ocupa metade da janela de visualização em um quadro. Depois, no quadro seguinte, o elemento é deslocado para baixo em 25% da altura da janela de visualização. O retângulo pontilhado vermelho indica a união da área visível do elemento em ambos os quadros, que, neste caso, é 75% da janela de visualização total, portanto, sua *fração de impacto* é de `0.75` .

### Distance fraction

The other part of the layout shift score equation measures the distance that unstable elements have moved, relative to the viewport. The *distance fraction* is the greatest distance any *unstable element* has moved in the frame (either horizontally or vertically) divided by the viewport's largest dimension (width or height, whichever is greater).

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASnfpVs2n9winu6mmzdk.png", alt="Exemplo de fração de distância com um *elemento instável*", width="800", height="600", linkTo=true %}

No exemplo acima, a maior dimensão da janela de visualização é a altura, e o elemento instável foi movido em 25% da altura da janela de visualização, o que faz com que a *fração de distância* seja de 0,25.

Portanto, neste exemplo, a *fração de impacto* é `0.75` e a *fração de distância* é `0.25`, portanto, a *pontuação de mudança de layout* é `0.75 * 0.25 = 0.1875` .

{% Aside %} Inicialmente, a pontuação de mudança de layout era calculada com base apenas na *fração de impacto*. A *fração de distância* foi introduzida para evitar penalizar excessivamente os casos em que grandes elementos se deslocam por uma pequena distância. {% endAside %}

O próximo exemplo mostra como a adição de conteúdo a um elemento existente afeta a pontuação de mudança de layout:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xhN81DazXCs8ZawoCj0T.png", alt="Exemplo de mudança de layout com *elementos* estáveis e instáveis e recorte da janela de visualização", width="800", height="600", linkTo=true %}

O botão "Click Me!" é anexado à parte inferior da caixa cinza com texto preto, o que empurra a caixa verde com texto branco para baixo (e parcialmente para fora da janela de visualização).

In this example, the gray box changes size, but its start position does not change so it's not an *unstable element*.

O botão "Click Me!" não estava anteriormente no DOM, portanto, sua posição inicial também não muda.

A posição inicial da caixa verde, entretanto, muda, mas como ela foi movida parcialmente para fora da janela de visualização, a área invisível não é considerada ao calcular a *fração de impacto*. A união das áreas visíveis para a caixa verde em ambos os quadros (ilustrada pelo retângulo pontilhado vermelho) é a mesma que a área da caixa verde no primeiro quadro: 50% da janela de visualização. A *fração de impacto* é `0.5`.

The *distance fraction* is illustrated with the purple arrow. The green box has moved down by about 14% of the viewport so the *distance fraction* is `0.14`.

The layout shift score is `0.5 x 0.14 = 0.07`.

This last example illustrates multiple *unstable elements*:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FdCETo2dLwGmzw0V5lNT.png", alt="Exemplo de mudança de layout com vários *elementos* estáveis e instáveis", width="800", height="600", linkTo=true %}

No primeiro quadro acima, há quatro resultados de uma solicitação de API para animais, classificados em ordem alfabética. No segundo quadro, mais resultados são adicionados à lista ordenada.

The first item in the list ("Cat") does not change its start position between frames, so it's stable. Similarly, the new items added to the list were not previously in the DOM, so their start positions don't change either. But the items labelled "Dog", "Horse", and "Zebra" all shift their start positions, making them *unstable elements*.

Novamente, os retângulos pontilhados vermelhos representam a união dessas três áreas *instáveis* antes e depois das áreas, que neste caso é cerca de 38% da área da janela de visualização (*fração* de `0.38`).

As setas representam as distâncias que os *elementos instáveis* se moveram desde suas posições iniciais. O elemento "Zebra", representado pela seta azul, foi o que mais se moveu, cerca de 30% da altura da janela de visualização. Isto faz com que a *fração de distância* neste exemplo seja `0.3`.

The layout shift score is `0.38 x 0.3 = 0.1172`.

### Expected vs. unexpected layout shifts

Not all layout shifts are bad. In fact, many dynamic web applications frequently change the start position of elements on the page.

#### User-initiated layout shifts

Uma mudança de layout só é ruim se o usuário não a espera. Por outro lado, as mudanças de layout que ocorrem em resposta às interações do usuário (clicar num link, pressionar um botão, digitar numa caixa de pesquisa e similares) geralmente são aceitáveis, contanto que a mudança ocorra perto o suficiente da interação que o relacionamento esteja claro para o usuário.

Por exemplo, se uma interação do usuário disparar uma solicitação de rede que pode demorar um pouco para ser concluída, é melhor imediatamente alocar algum espaço e mostrar um indicador de carregamento para evitar uma mudança desagradável de layout quando a solicitação for concluída. Se o usuário não perceber que algo está sendo carregado ou não tiver noção de quando o recurso estará pronto, ele pode tentar clicar em outra coisa enquanto espera, algo que pode sair do lugar na hora do clique.

Layout shifts that occur within 500 milliseconds of user input will have the [`hadRecentInput`](https://wicg.github.io/layout-instability/#dom-layoutshift-hadrecentinput) flag set, so they can be excluded from calculations.

{% Aside 'caution' %} O `hadRecentInput` só será verdadeiro para eventos de entrada discretos, como toque, clique ou pressionamento de tecla. Interações contínuas como rolar, arrastar ou gestos de pinça e zoom não são consideradas "entrada recente". Consulte a [Especificação de Instabilidade de Layout](https://github.com/WICG/layout-instability#recent-input-exclusion) para mais detalhes. {% endAside %}

#### Animations and transitions

Animações e transições, quando bem feitas, são uma ótima maneira de atualizar o conteúdo da página sem surpreender o usuário. O conteúdo que muda abrupta e inesperadamente na página quase sempre cria uma experiência ruim para o usuário. Mas o conteúdo que se move de forma gradual e natural de uma posição para a seguinte pode, muitas vezes, ajudar o usuário a entender melhor o que está acontecendo e guiá-lo entre as mudanças de estado.

A propriedade [`transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) do CSS permite animar elementos sem acionar mudanças de layout:

- Em vez de alterar as propriedades `height` e `width`, use `transform: scale()`.
- Para mover os elementos, evite alterar as propriedades `top` , `right` , `bottom` ou `left` e, em vez disso, use `transform: translate()`.

## Como medir a CLS

A CLS pode ser medida [em laboratório](/user-centric-performance-metrics/#in-the-lab) ou [em campo](/user-centric-performance-metrics/#in-the-field) e está disponível nas seguintes ferramentas:

{% Aside 'caution' %} Lab tools typically load pages in a synthetic environment and are thus only able to measure layout shifts that occur during page load. As a result, CLS values reported by lab tools for a given page may be less than what real users experience in the field. {% endAside %}

### Field tools

- [Relatório de Experiência do Usuário Chrome](https://developers.google.com/web/tools/chrome-user-experience-report)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [Console de Busca (relatório Core Web Vitals)](https://support.google.com/webmasters/answer/9205520)
- [Biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Lab tools

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://webpagetest.org/)

### Medição da CLS em JavaScript

To measure CLS in JavaScript, you can use the [Layout Instability API](https://github.com/WICG/layout-instability). The following example shows how to create a [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) that listens for unexpected `layout-shift` entries, groups them into sessions, and logs the maximum session value any time it changes.

```js
let clsValue = 0;
let clsEntries = [];

let sessionValue = 0;
let sessionEntries = [];

new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // Only count layout shifts without recent user input.
    if (!entry.hadRecentInput) {
      const firstSessionEntry = sessionEntries[0];
      const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

      // If the entry occurred less than 1 second after the previous entry and
      // less than 5 seconds after the first entry in the session, include the
      // entry in the current session. Otherwise, start a new session.
      if (sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }

      // If the current session value is larger than the current CLS value,
      // update CLS and the entries contributing to it.
      if (sessionValue > clsValue) {
        clsValue = sessionValue;
        clsEntries = sessionEntries;

        // Log the updated value (and its entries) to the console.
        console.log('CLS:', clsValue, clsEntries)
      }
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

{% Aside 'warning' %}

Este código mostra a forma básica de calcular e registrar a CLS. No entanto, medir com precisão a CLS de uma forma que corresponda ao que é medido no [Relatório de Experiência do Usuário Chrome](https://developers.google.com/web/tools/chrome-user-experience-report) (CrUX) é mais complicado. Veja mais detalhes abaixo:

{% endAside %}

Na maioria dos casos, o valor CLS no momento em que a página está sendo descarregada é o valor CLS final para essa página, mas existem algumas exceções importantes:

The following section lists the differences between what the API reports and how the metric is calculated.

#### Differences between the metric and the API

- Se uma página for carregada em segundo plano, ou se estiver em segundo plano antes do navegador renderizar qualquer conteúdo, ela não deve relatar nenhum valor CLS.
- If a page is restored from the [back/forward cache](/bfcache/#impact-on-core-web-vitals), its CLS value should be reset to zero since users experience this as a distinct page visit.
- A API não relata entradas `layout-shift` para mudanças que ocorrem dentro de iframes, mas para medir corretamente a CLS, você deve considerá-las. Subquadros podem usar a API para relatar suas entradas `layout-shift` para o quadro pai para [agregação](https://github.com/WICG/layout-instability#cumulative-scores) .

Além dessas exceções, a CLS introduz uma complexidade adicional devido ao fato de que mede toda a vida útil de uma página:

- Os usuários podem manter uma aba aberta por *muito* tempo: dias, semanas, meses. Na verdade, um usuário pode nunca fechar uma aba.
- Em sistemas operacionais móveis, os navegadores normalmente não executam callbacks de descarregamento de página para abas em segundo plano, dificultando o relato do valor "final".

Para lidar com esses casos, a CLS deve ser relatada sempre que uma página entrar em segundo plano, além de quando for descarregada (o [evento `visibilitychange`](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#event-visibilitychange) cobre os dois cenários). E sistemas de análise que recebem esses dados precisarão calcular o valor da CLS final no back-end.

Em vez de memorizar e lidar com todos esses casos você mesmo, os desenvolvedores podem usar a [biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir a CLS, que é responsável por tudo o que foi mencionado acima:

```js
import {getCLS} from 'web-vitals';

// Measure and log CLS in all situations
// where it needs to be reported.
getCLS(console.log);
```

Para um exemplo completo de como medir a CLS em JavaScript, consulte [o código-fonte de `getCLS()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts).

{% Aside %} Em alguns casos (como iframes de origem cruzada), não é possível medir a CLS em JavaScript. Consulte a seção de [limitações](https://github.com/GoogleChrome/web-vitals#limitations) da biblioteca `web-vitals` para mais detalhes. {% endAside %}

## How to improve CLS

For most websites, you can avoid all unexpected layout shifts by sticking to a few guiding principles:

- **Sempre inclua atributos de tamanho em suas imagens e elementos de vídeo ou reserve o espaço necessário usando algo como [caixas de proporção de aspecto do CSS](https://css-tricks.com/aspect-ratio-boxes/).** Essa abordagem garante que o navegador possa alocar a quantidade correta de espaço no documento enquanto a imagem é carregada. Observe que você também pode usar a [política de recursos de mídia não dimensionada](https://github.com/w3c/webappsec-feature-policy/blob/master/policies/unsized-media.md) para forçar esse comportamento em navegadores que oferecem suporte a políticas de recursos.
- **Never insert content above existing content, except in response to a user interaction.** This ensures any layout shifts that occur are expected.
- **Prefer transform animations to animations of properties that trigger layout changes.** Animate transitions in a way that provides context and continuity from state to state.

Para obter informações detalhadas sobre como melhorar a CLS, veja [Otimize a CLS](/optimize-cls/) e [Depuração de mudanças de layout](/debug-layout-shifts) .

## Additional resources

- Orientação do Google para tags sobre como [minimizar a mudança de layout](https://developers.google.com/doubleclick-gpt/guides/minimize-layout-shift)
- [Understanding Cumulative Layout Shift (Compreendendo a mudança cumulativa de layout)](https://youtu.be/zIJuY-JCjqw) por [Annie Sullivan](https://anniesullie.com/) e [Steve Kobes](https://kobes.ca/) em [#PerfMatters](https://perfmattersconf.com/) (2020)

{% include 'content/metrics/metrics-changelog.njk' %}
