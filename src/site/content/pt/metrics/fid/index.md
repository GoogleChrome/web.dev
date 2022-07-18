---
layout: post
title: First Input Delay (FID)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: Este artigo apresenta a métrica First Input Delay (FID) e explica como medi-la
tags:
  - performance
  - metrics
---

{% Aside %} First Input Delay (FID), ou Atraso da Primeira Entrada, é uma métrica importante e centrada no usuário para medir a [responsividade do carregamento](/user-centric-performance-metrics/#types-of-metrics) porque quantifica a experiência que os usuários sentem ao tentar interagir com páginas que não respondem: uma FID baixa ajuda a garantir que a página seja [utilizável](/user-centric-performance-metrics/#questions). {% endAside %}

Todos nós sabemos como é importante causar uma boa primeira impressão. É importante ao conhecer novas pessoas e também ao construir experiências na web.

Na web, uma boa primeira impressão pode fazer a diferença entre alguém se tornar um usuário fiel ou sair e nunca mais voltar. A questão é: o que causa uma boa impressão e como você mede o tipo de impressão que provavelmente está causando nos usuários?

Na web, as primeiras impressões podem assumir muitas formas diferentes: temos as primeiras impressões sobre o design e o apelo visual de um site, bem como as primeiras impressões sobre sua velocidade e capacidade de resposta.

Embora seja difícil medir o quanto os usuários gostam do design de um site com APIs da web, medir sua velocidade e capacidade de resposta não é!

A primeira impressão que os usuários têm de quão rápido seu site carrega pode ser medida com a [First Contentful Paint (FCP)](/fcp/). Mas a rapidez com que seu site pode renderizar pixels na tela é apenas parte da história. Igualmente importante é a capacidade de resposta do seu site quando os usuários tentam interagir com esses pixels!

A métrica First Input Delay (FID) ajuda a medir a primeira impressão do usuário sobre a interatividade e capacidade de resposta do seu site.

## O que é FID?

A FID mede o tempo desde quando um usuário interage pela primeira vez com uma página (ou seja, quando clica num link, toca num botão ou usa um controle personalizado baseado em JavaScript) até o momento em que o navegador é realmente capaz de começar a processar manipuladores de eventos em resposta a essa interação.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="Bons valores fid são 2,5 segundos, valores fracos são maiores que 4,0 segundos e qualquer coisa entre precisa de melhorias", width="400", height="300" %}
</picture>

### O que é uma boa pontuação da FID?

Para fornecer uma boa experiência ao usuário, os sites devem se esforçar para ter uma First Input Delay de **100 milissegundos** ou menos. Para garantir que você está atingindo essa meta para a maioria de seus usuários, um bom limite para medir é o **75º percentil** de carregamentos de página, segmentado em dispositivos móveis e desktop.

{% Aside %} Para saber mais sobre a pesquisa e a metodologia por trás dessa recomendação, veja: [Definindo os limites das Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

## FID em detalhes

Como desenvolvedores que escrevem código que responde a eventos, geralmente presumimos que nosso código será executado imediatamente - assim que o evento acontecer. Mas, como usuários, todos nós frequentemente experimentamos o oposto - carregamos uma página web em nosso telefone, tentamos interagir com ela e ficamos frustrados quando nada acontece.

Em geral, o atraso de entrada (também conhecido como latência de entrada) acontece porque o thread principal do navegador está ocupado fazendo outra coisa, então ele não pode (ainda) responder ao usuário. Um motivo comum para isto é o navegador estar ocupado analisando e executando um grande arquivo JavaScript carregado pelo seu aplicativo. Enquanto está ocupado com isso, ele não pode executar nenhum ouvinte de evento porque o JavaScript que está carregando pode instruí-lo a fazer outra coisa.

{% Aside 'gotchas' %} A FID mede apenas o "atraso" no processamento do evento. Ela não mede o tempo de processamento do evento em si, nem o tempo que o navegador leva para atualizar a IU após a execução dos manipuladores de eventos. Embora esse tempo afete a experiência do usuário, incluí-lo como parte da FID incentivaria os desenvolvedores a responder aos eventos de forma assíncrona, o que melhoraria a métrica, mas provavelmente tornaria a experiência pior. Veja [por que considerar apenas o atraso de entrada](#why-only-consider-the-input-delay) abaixo, para mais detalhes. {% endAside %}

Considere a seguinte linha do tempo de um carregamento de página web típico:

{% Img src="image/admin/9tm3f6pwlHMqNKuFvaP0.svg", alt="Exemplo de rastreamento de carregamento de página", width="800", height="260", linkTo=true %}

A visualização acima mostra uma página que está fazendo algumas solicitações de rede para recursos (provavelmente arquivos CSS e JS) e, depois que o download desses recursos termina, eles são processados no thread principal.

Isso resulta em períodos em que o thread principal fica momentaneamente ocupado, o que é indicado pelos blocos de [tarefas](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) de cor bege.

Atrasos longos na primeira entrada normalmente ocorrem entre a [First Contentful Paint (FCP)](/fcp/) e a [Time to Interactive (TTI)](/tti/) porque a página renderizou parte de seu conteúdo, mas ainda não é interativa de forma confiável. Para ilustrar como isso pode acontecer, FCP e TTI foram adicionadas à linha do tempo:

{% Img src="image/admin/24Y3T5sWNuZD9fKhkuER.svg", alt="Exemplo de rastreamento de carregamento de página com FCP e TTI", width="800", height="340", linkTo=true %}

Você deve ter notado que há uma boa quantidade de tempo (incluindo três [tarefas longas](/custom-metrics/#long-tasks-api)) entre a FCP e a TTI. Se um usuário tentar interagir com a página durante esse tempo (por exemplo, clicar num link), haverá um atraso entre quando o clique é recebido e quando o thread principal será capaz de responder.

Considere o que aconteceria se um usuário tentasse interagir com a página próximo ao início da tarefa mais longa:

{% Img src="image/admin/krOoeuQ4TWCbt9t6v5Wf.svg", alt="Exemplo de rastreamento de carregamento de página com FCP, TTI e FID", width="800", height="380", linkTo=true %}

Como a entrada ocorre enquanto o navegador está no meio da execução de uma tarefa, ele precisa esperar até que a tarefa seja concluída para poder responder à entrada. O tempo de espera é o valor FID para este usuário nesta página.

{% Aside %} Neste exemplo, o usuário acabou de interagir com a página no início do período mais ocupado da thread principal. Se o usuário tivesse interagido com a página apenas um momento antes (durante o período ocioso), o navegador poderia ter respondido imediatamente. Essa variação no atraso de entrada ressalta a importância de olhar para a distribuição dos valores FID ao relatar a métrica. Você pode ler mais sobre isto na seção abaixo sobre como analisar e relatar os dados da FID. {% endAside %}

### E se uma interação não tiver um ouvinte de eventos?

O FID mede o delta entre o momento em que um evento de entrada é recebido e a próxima vez que o thread principal fica ocioso. Isto significa que a FID é medida **mesmo nos casos em que um ouvinte de evento não foi registrado.** A razão é porque muitas interações do usuário não requerem um ouvinte de evento, mas *exigem* que o thread principal esteja ocioso, para que possa executar.

Por exemplo, todos os elementos HTML a seguir precisam aguardar a conclusão das tarefas em andamento no thread principal antes de responder às interações do usuário:

- Campos de texto, caixas de seleção e botões de opção ( `<input>`, `<textarea>` )
- Menus dropdown com Select ( `<select>` )
- Links ( `<a>` )

### Por que considerar apenas a primeira entrada?

Embora um atraso de qualquer entrada possa levar a uma experiência ruim do usuário, recomendamos medir o primeiro atraso de entrada por alguns motivos:

- O primeiro atraso de entrada será a primeira impressão do usuário sobre a capacidade de resposta do seu site, e as primeiras impressões são críticas para moldar nossa impressão geral da qualidade e confiabilidade de um site.
- Os maiores problemas de interatividade que vemos na web hoje ocorrem durante o carregamento da página. Portanto, acreditamos que o foco inicial em melhorar a primeira interação do usuário com o site terá o maior impacto na melhoria da interatividade geral da web.
- As soluções recomendadas sobre como sites devem corrigir grandes atrasos na primeira entrada (dividir o código, carregar menos JavaScript no início, etc.) não são necessariamente as mesmas soluções para corrigir atrasos de entrada lentos após o carregamento da página. Separando essas métricas, poderemos fornecer diretrizes de desempenho mais específicas para os desenvolvedores web.

### O que conta como uma primeira entrada?

A FID é uma métrica que mede a capacidade de resposta de uma página durante o carregamento. Como tal, ela se concentra apenas nos eventos de entrada causados por ações discretas como cliques, toques e pressionamentos de tecla.

Outras interações, como rolagem e zoom, são ações contínuas e têm restrições de desempenho completamente diferentes (além disso, os navegadores são geralmente capazes de ocultar sua latência executando-as em um thread separado).

Em outras palavras, a FID se concentra no R (responsividade) do [modelo de desempenho RAIL](/rail/) , enquanto que a rolagem e o zoom estão mais relacionados ao A (animação), e suas qualidades de desempenho devem ser avaliadas separadamente.

### E se um usuário nunca interagir com seu site?

Nem todos os usuários irão interagir com o seu site sempre que o visitarem. E nem todas as interações são relevantes para a FID (conforme mencionamos na seção anterior). Além disso, as primeiras interações de alguns usuários serão em momentos ruins (quando o thread principal está ocupado por um longo período de tempo), e as primeiras interações de outros usuários serão em momentos bons (quando o thread principal está completamente ocioso).

Isto significa que alguns usuários não terão valores FID, alguns usuários terão valores FID baixos e alguns usuários provavelmente terão valores FID altos.

A maneira como você rastreia, relata e analisa o FID provavelmente será um pouco diferente de outras métricas com as quais você pode estar acostumado. A próxima seção explica a melhor maneira de fazer isso.

### Por que considerar apenas o atraso de entrada?

Conforme mencionado acima, o FID mede apenas o "atraso" durante o processamento de eventos. Ele não mede o tempo de processamento do evento em si, nem o tempo que o navegador leva para atualizar a IU após a execução dos manipuladores de eventos.

Mesmo que esse tempo seja importante para o usuário e *afete* sua experiência, ele não está incluído nesta métrica, pois isto poderia incentivar os desenvolvedores a adicionar soluções que realmente poderiam tornar a experiência pior, ou seja, eles poderiam encapsular a lógica de manipulação de eventos num callback assíncrono (via `setTimeout()` ou `requestAnimationFrame()`) para separá-lo da tarefa associada ao evento. O resultado seria uma melhoria na pontuação da métrica, mas a resposta percebida pelo usuário seria mais lenta.

No entanto, enquanto a FID mede apenas a parte do "atraso" da latência do evento, os desenvolvedores que desejam controlar mais o ciclo de vida do evento podem fazer isso usando a [API de temporização de eventos](https://wicg.github.io/event-timing/). Consulte o guia sobre [métricas personalizadas](/custom-metrics/#event-timing-api) para mais detalhes.

## Como medir a FID

A FID é uma métrica que só pode ser medida [em campo](/user-centric-performance-metrics/#in-the-field), pois exige que um usuário real interaja com sua página. Você pode medir a FID com as seguintes ferramentas.

{% Aside %} A FID requer um usuário real e, portanto, não pode ser medida no laboratório. No entanto, a métrica [Total Blocking Time (TBT)](/tbt/) é mensurável em laboratório, se correlaciona bem com a FID em campo e também captura problemas que afetam a interatividade. As otimizações que melhoram a TBT no laboratório também devem melhorar a FID para seus usuários. {% endAside %}

### Ferramentas de campo

- [Relatório de experiência do usuário Chrome](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Console de Busca (relatório Core Web Vitals)](https://support.google.com/webmasters/answer/9205520)
- [Biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Medição da FID em JavaScript

Para medir a FID em JavaScript, você pode usar a [API Event Timing](https://wicg.github.io/event-timing). O exemplo a seguir mostra como criar um [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) que escuta as entradas [`first-input`](https://wicg.github.io/event-timing/#sec-performance-event-timing) e as registra no console:

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID candidate:', delay, entry);
  }
}).observe({type: 'first-input', buffered: true});
```

{% Aside 'warning' %} Este código mostra como registrar as entradas `first-input` no console e calcular seu atraso. No entanto, medir a FID em JavaScript é mais complicado. Veja detalhes abaixo: {% endAside %}

No exemplo acima, o valor do atraso `first-input` é medido tomando o delta entre os timestamps `startTime` e `processingStart` da entrada. Na maioria dos casos, esse será o valor FID; entretanto, nem todas as entradas `first-input` são válidas para medir a FID.

A seção a seguir lista as diferenças entre o que a API informa e como a métrica é calculada.

#### Diferenças entre a métrica e a API

- A API despachará `first-input` para páginas carregadas numa aba de plano de fundo, mas essas páginas devem ser ignoradas ao calcular a FID.
- A API também despachará as entradas `first-input` se a página estiver em segundo plano antes da ocorrência da primeira entrada, mas essas páginas também devem ser ignoradas ao calcular a FID (entradas são consideradas apenas se a página estava em primeiro plano o tempo todo).
- A API não relata `first-input` quando a página é restaurada do [cache back/forward](/bfcache/#impact-on-core-web-vitals), mas a FID deve ser medida nesses casos, pois os usuários as experimentam como visitas de página distintas.
- A API não considera elementos dentro de iframes, mas para medir corretamente a FID, você deve considerá-los. Os subquadros podem usar a API para relatar suas entradas `first-input` ao quadro pai para agregação.

Em vez de memorizar todas essas diferenças sutis, os desenvolvedores podem usar a [biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir a FID, que já lida com essas diferenças (onde for possível):

```js
import {getFID} from 'web-vitals';

// Measure and log FID as soon as it's available.
getFID(console.log);
```

Para um exemplo completo de como medir a FID em JavaScript, consulte [o código-fonte de `getFID()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFID.ts).

{% Aside %} Em alguns casos (como iframes de origem cruzada), não é possível medir a FID em JavaScript. Consulte a seção de [limitações](https://github.com/GoogleChrome/web-vitals#limitations) da biblioteca `web-vitals` para mais detalhes. {% endAside %}

### Analisando e relatando dados da FID

Devido à variação esperada nos valores da FID, é fundamental que, ao relatar a FID, você observe a distribuição dos valores e se concentre nos percentis mais altos.

Embora a [escolha do percentil](/defining-core-web-vitals-thresholds/#choice-of-percentile) para todos os limites do Core Web Vitals seja o 75º, para a FID em particular, ainda recomendamos olhar para os percentis 95 a 99, pois eles corresponderão às primeiras experiências particularmente ruins que os usuários estão tendo com o seu site. E isto irá revelar as áreas que mais precisam de melhorias.

Isto vale mesmo se você segmentar seus relatórios por categoria ou tipo de dispositivo. Por exemplo, se você executa relatórios separados para desktop e celular, o valor de FID que deve lhe interessar em desktops deve ser o percentil 95 a 99 dos usuários de desktop, e o valor FID com que deve lhe interessar em dispositivos móveis deve ser o percentil 95 a 99 dos usuários móveis.

## Como melhorar a FID

Para aprender como melhorar a FID para um site específico, você pode executar uma auditoria de desempenho do Lighthouse e prestar atenção a quaisquer [oportunidades](/lighthouse-performance/#opportunities) específicas que a auditoria sugerir.

Embora o FID seja uma métrica de campo (e o Lighthouse seja uma ferramenta de métrica de laboratório), a orientação para melhorar a FID é a mesma indicada para melhorar a métrica de laboratório [Total Blocking Time (TBT)](/tbt/).

Para saber como melhorar a FID, veja [Otimize a FID](/optimize-fid/). Para obter orientações adicionais sobre técnicas de desempenho individual que também podem melhorar a FID, consulte:

- [Reduza o impacto do código de terceiros](/third-party-summary/)
- [Reduza o tempo de execução do JavaScript](/bootup-time/)
- [Minimize o trabalho da thread principal](/mainthread-work-breakdown/)
- [Mantenha as contagens de solicitações baixas e os tamanhos de transferência pequenos](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
