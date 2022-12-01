---
title: Melhores práticas para medir as Web Vitals em campo
subhead: Como medir Web Vitals com sua ferramenta de análise atual
authors:
  - philipwalton
description: Como medir Web Vitals com sua ferramenta de análise atual
date: 2020-05-27
updated: 2020-07-21
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: Como medir Web Vitals com sua ferramenta de análise atual
tags:
  - blog
  - performance
  - web-vitals
---

Ter a capacidade de medir e relatar o desempenho de suas páginas no mundo real é fundamental para diagnosticar e melhorar o desempenho ao longo do tempo. Sem [dados de campo](/user-centric-performance-metrics/#in-the-field), é impossível saber com certeza se as alterações que você está fazendo ao seu site estão realmente alcançando os resultados desejados.

Muitos provedores de análises populares de [Real User Monitoring (RUM)](https://en.wikipedia.org/wiki/Real_user_monitoring) já oferecem suporte às [métricas Core Web Vitals](/vitals/#core-web-vitals) em suas ferramentas (assim como muitos [outros Web Vitals](/vitals/#other-web-vitals)). Se você está usando atualmente uma dessas ferramentas de análise RUM, está em ótima forma para avaliar como as páginas do seu site atendem aos [limites recomendados das métricas Core Web Vitals](/vitals/#core-web-vitals) e evitar regressões no futuro.

Embora recomendemos o uso de uma ferramenta de análises que ofereça suporte às métricas Core Web Vitals, se a ferramenta de análises que você está usando atualmente não oferece esse suporte, você não precisa necessariamente mudar. Quase todas as ferramentas de análises oferecem alguma maneira de definir e medir [métricas](https://support.google.com/analytics/answer/2709828) ou [eventos](https://support.google.com/analytics/answer/1033068) personalizados, o que significa que você provavelmente poderá usar seu provedor de análises atual para medir as métricas Core Web Vitals e adicioná-las aos seus relatórios e painéis de análise existentes.

Este guia discute as melhores práticas para medir as métricas Core Web Vitals (ou qualquer métrica personalizada) com uma ferramenta de análise nativa ou de terceiros. Ele também pode servir como um guia para fornecedores de análise que desejam adicionar suporte Core Web Vitals a seus serviços.

## Use métricas ou eventos personalizados

Conforme mencionado acima, a maioria das ferramentas de análise permite medir dados personalizados. Se sua ferramenta de análise suportar isso, você deverá ser capaz de medir cada uma das métricas Core Web Vitals usando este mecanismo.

Medir métricas ou eventos personalizados em uma ferramenta de análise geralmente é um processo de três etapas:

1. [Defina ou registre](https://support.google.com/analytics/answer/2709829?hl=en&ref_topic=2709827) a métrica personalizada na administração da ferramenta (se necessário). *(Observação: nem todos os provedores de análise exigem que as métricas personalizadas sejam definidas com antecedência.)*
2. Calcule o valor da métrica em seu código JavaScript de front-end.
3. Envie o valor da métrica para o back-end de análise, garantindo que o nome ou ID corresponda ao que foi definido na etapa 1 *(novamente, se necessário)*.

Para as etapas 1 e 3, você pode consultar a documentação da ferramenta de análise para obter instruções. Para a etapa 2, você pode usar a [biblioteca JavaScript web-vitals](https://github.com/GoogleChrome/web-vitals) para calcular o valor de cada uma das métricas Core Web Vitals.

O trecho de código a seguir mostra como é fácil rastrear essas métricas no código e enviá-las a um serviço de análise.

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics({name, value, id}) {
  const body = JSON.stringify({name, value, id});
  // Use `navigator.sendBeacon()` se disponível, usando `fetch()` como fallback.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## Garanta que você possa relatar uma distribuição

Depois de calcular os valores de cada métrica Core Web Vitals e enviá-los ao seu serviço de análise usando uma métrica ou evento customizado, o próximo passo é construir um relatório ou painel exibindo os valores que foram coletados.

Para garantir que você esteja atendendo aos [limites recomendados para as métricas Core Web Vitals](/vitals/#core-web-vitals), você precisará que seu relatório exiba o valor de cada métrica no 75º percentil.

Se sua ferramenta de análise não oferece relatórios de percentis como um recurso integrado, você provavelmente ainda poderá obter esses dados manualmente, gerando um relatório que lista cada valor de métrica classificado em ordem crescente. Depois de gerar esse relatório, o resultado que é 75% do caminho através da lista completa e classificada de todos os valores naquele relatório será o 75º percentil para essa métrica, e este será o caso, não importa como você segmente seus dados (por tipo de dispositivo, tipo de conexão, país, etc.).

Se sua ferramenta de análise não fornecer granularidade de relatório em nível de métrica por default, você provavelmente conseguirá o mesmo resultado se sua ferramenta analítica suportar [dimensões personalizadas](https://support.google.com/analytics/answer/2709828). Ao definir um valor de dimensão personalizado único para cada instância de métrica individual que você estiver rastreando, você deverá ser capaz de gerar um relatório, dividido por instâncias de métrica individuais, se incluir a dimensão personalizada na configuração do relatório. Já que cada instância terá um valor de dimensão único, não haverá agrupamento.

O [Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report) é um exemplo dessa técnica que usa o Google Analytics. O código do relatório é [open source](https://github.com/GoogleChromeLabs/web-vitals-report), portanto, os desenvolvedores podem fazer referência a ele como um exemplo das técnicas descritas nesta seção.

![Capturas de tela do Web Vitals Report](https://user-images.githubusercontent.com/326742/101584324-3f9a0900-3992-11eb-8f2d-182f302fb67b.png)

{% Aside %} Dica: a biblioteca JavaScript [`web-vitals`](https://github.com/GoogleChrome/web-vitals) fornece um ID para cada instância de métrica relatada, permitindo a construção de distribuições na maioria das ferramentas de análise. Consulte a documentação da interface [`Metric`](https://github.com/GoogleChrome/web-vitals#metric) para mais detalhes. {% endAside %}

## Envie seus dados na hora certa

Algumas métricas de desempenho podem ser calculadas quando a página termina de carregar, enquanto outras (como CLS) consideram toda a vida útil da página e só produzem um resultado final quando a página começa a ser descarregada.

Isto pode ser problemático, já que os eventos `beforeunload` e `unload` não são confiáveis (especialmente em dispositivos móveis) e seu uso [não](https://developer.chrome.com/blog/page-lifecycle-api/#legacy-lifecycle-apis-to-avoid) é recomendado (pois podem impedir que uma página seja elegível para o [Cache Back-Forward](https://developer.chrome.com/blog/page-lifecycle-api/#what-is-the-back-forward-cache) ).

Para métricas que rastreiam toda a vida útil de uma página, é melhor enviar qualquer que seja o valor atual da métrica durante o evento `visibilitychange`, sempre que o estado de visibilidade da página mudar para `hidden`. Isto ocorre porque, tão logo o estado de visibilidade da página mudar para `hidden`, não haverá garantia de que qualquer script nessa página poderá ser executado novamente. Isto é particularmente verdadeiro em sistemas operacionais móveis em que o próprio aplicativo do navegador pode ser fechado sem que nenhum callback de página seja disparado.

Observe que os sistemas operacionais móveis geralmente disparam o evento `visibilitychange` ao alternar entre abas, entre aplicações ou ao fechar o próprio aplicativo do navegador. Eles também disparam o evento `visibilitychange` ao fechar uma aba ou navegar para uma nova página. Isto deixa o evento `visibilitychange` muito mais confiável que os eventos `unload` ou `beforeunload`

{% Aside 'gotchas' %} Devido a [alguns bugs de navegador](https://github.com/w3c/page-visibility/issues/59#issue-554880545), existem algumas situações onde o evento `visibilitychange` não dispara. Se você estiver construindo sua própria biblioteca de análise, é importante estar ciente desses bugs. Observe que a biblioteca JavaScript [web-vitals](https://github.com/GoogleChrome/web-vitals) é responsável por todos esses bugs. {% endAside %}

## Monitore o desempenho ao longo do tempo

Depois de atualizar sua implementação de análise para rastrear e relatar as métricas Core Web Vitals, a próxima etapa é rastrear como as mudanças no seu site afetam o desempenho ao longo do tempo.

### Faça versionamento das suas alterações

Uma abordagem ingênua (e, em última análise, não confiável) para rastrear mudanças é implantar as alterações na produção e depois assumir que todas as métricas recebidas após a data de implantação correspondem ao novo site e todas as métricas recebidas antes da data de implantação correspondem ao site antigo. No entanto, vários fatores (incluindo cache de HTTP, service workers ou uma camada CDN) podem impedir que isto funcione.

Uma abordagem muito melhor é criar uma versão exclusiva para cada mudança implementada e, em seguida, rastrear essa versão na sua ferramenta de análise. A maioria das ferramentas de análise oferece suporte à configuração de uma versão. Se a sua não tiver esse recurso, você pode criar uma dimensão personalizada e definir essa dimensão como sendo sua versão implementada.

### Faça experimentos

Você pode levar o controle de versão um passo adiante, rastreando várias versões (ou experimentos) ao mesmo tempo.

Se sua ferramenta de análise permite definir grupos de experimentos, use esse recurso. Caso contrário, você pode usar dimensões personalizadas para garantir que cada um de seus valores de métrica possa ser associado a um grupo de experimentos específico em seus relatórios.

Com a experimentação implementada em suas análises, você pode implementar uma mudança experimental num subconjunto de seus usuários e comparar o desempenho dessa mudança com o desempenho dos usuários no grupo de controle. Depois de ter certeza de que uma mudança realmente melhora o desempenho, você pode então implementá-la para todos os usuários.

{% Aside %} Os grupos de experimentos devem sempre ser definidos no servidor. Evite realizar qualquer experimento ou qualquer ferramenta de teste A/B que rode no cliente. Essas ferramentas normalmente bloquearão a renderização até que o grupo de experimentos de um usuário seja determinado, o que pode prejudicar seus tempos de LCP. {% endAside %}

## Certifique-se de que a medição não afete o desempenho

Ao medir o desempenho em usuários reais, é absolutamente crítico que qualquer código de medição de desempenho que você esteja executando não afete negativamente o desempenho de sua página. Se isto acontecer, quaisquer conclusões que você tente obter sobre como seu desempenho afeta seus negócios não serão confiáveis, pois você nunca saberá se a presença do código de análise em si está causando o maior impacto negativo.

Sempre siga estes princípios ao implantar código de análise RUM em seu site de produção:

### Adie suas análises

O código analítico deve sempre ser carregado de forma assíncrona e sem bloqueio e, geralmente, deve ser carregado por último. Se você carregar seu código analítico de forma que cause bloqueio, ele poderá afetar negativamente a LCP.

Todas as APIs usadas para medir as métricas Core Web Vitals foram projetadas especificamente para suportar carregamento de scripts de forma assíncrona e adiada (por meio da flag [`buffered`](https://www.chromestatus.com/feature/5118272741572608)), portanto, não há necessidade de pressa para carregar seus scripts antecipadamente.

No caso de estar medindo uma métrica que não possa ser calculada posteriormente no cronograma de carregamento da página, você deve embutir *apenas* o código que precisa ser executado no início no bloco `<head>` do seu documento (para que não seja uma [solicitação que bloqueie a renderização](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/)) e adiar todo o resto. Não carregue todas as suas análises antecipadamente apenas porque uma única métrica exige.

### Não crie tarefas longas

O código de análise geralmente é executado em resposta à entrada do usuário, mas se seu código de análise está conduzindo muitas medições DOM ou usando outras APIs que demandam uso intensivo do processador, o próprio código de análise pode causar uma resposta de entrada insatisfatória. Além disso, se o arquivo JavaScript que contém o código analítico for grande, a execução desse arquivo pode bloquear o thread principal e afetar negativamente a FID.

### Use APIs não-bloqueantes

APIs como <code>[sendBeacon()](https://developer.mozilla.org/docs/Web/API/Navigator/sendBeacon)</code>
e
<code>[requestIdleCallback()](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)</code> são especificamente projetadas para executar tarefas não críticas de uma forma a não bloquear tarefas críticas para o usuário.

Essas APIs são ótimas ferramentas para usar numa biblioteca de análise RUM.

Em geral, todos os sinalizadores de análise devem ser enviados usando a API `sendBeacon()` (se disponível), e todos os códigos de medição analíticos passivos devem ser executados durante períodos ociosos.

{% Aside %} Para obter orientação sobre como maximizar o uso do tempo ocioso, garantindo ao mesmo tempo que o código possa ser executado com urgência quando necessário (como quando um usuário está descarregando a página), consulte o padrão [idle-until-urgent.](https://philipwalton.com/articles/idle-until-urgent/) {% endAside %}

### Não rastreie mais do que você precisa

O navegador expõe muitos dados de desempenho, mas só porque os dados estão disponíveis não significa necessariamente que você deve registrá-los e enviá-los aos seus servidores analíticos.

Por exemplo, a [Resource Timing API](https://w3c.github.io/resource-timing/) fornece dados de tempo detalhados para cada recurso carregado em sua página. No entanto, é improvável que todos esses dados sejam necessários ou úteis para melhorar o desempenho do carregamento de recursos.

Resumindo, não apenas rastreie os dados porque eles estão lá, certifique-se de que os dados serão usados antes de consumir recursos para rastreá-los.
