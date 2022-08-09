---
layout: post
title: Web Vitals
description: Métricas essenciais para um site saudável
hero: image/admin/BHaoqqR73jDWe6FL2kfw.png
authors:
  - philipwalton
date: 2020-04-30
updated: 2020-07-21
tags:
  - metrics
  - performance
  - web-vitals
---

A otimização da qualidade da experiência do usuário é a chave para o sucesso no longo prazo de qualquer site na web. Seja você proprietário de uma empresa, comerciante ou desenvolvedor, as Web Vitals podem ajudá-lo a quantificar a experiência do seu site e identificar oportunidades de melhoria.

## Visão geral

As Web Vitals são uma iniciativa do Google para fornecer orientação unificada em relação a sinais de qualidade essenciais que visam proporcionar uma ótima experiência ao usuário na web.

O Google tem fornecido diversas ferramentas ao longo dos anos para medir e relatar desempenho. Alguns desenvolvedores são especialistas no uso dessas ferramentas, enquanto outros tem considerado um desafio acompanhar a abundância de ferramentas e métricas.

Os proprietários de sites não deveriam ter que ser gurus em desempenho para compreender a qualidade da experiência que estão proporcionando aos usuários. A iniciativa Web Vitals tem como objetivo simplificar esse cenário e ajudar os sites a focarem nas métricas que mais importam, as **Core Web Vitals** .

## Core Web Vitals

As Core Web Vitals são o subconjunto de Web Vitals que se aplica a todas as páginas da web, que devem ser medidos por todos os proprietários de sites e são revisadas por todas as ferramentas do Google. Cada uma das Core Web Vitals representa uma faceta distinta da experiência do usuário, é mensurável [em campo](/user-centric-performance-metrics/#how-metrics-are-measured) e reflete a experiência de mundo real de um resultado crítico [centrado no usuário](/user-centric-performance-metrics/#how-metrics-are-measured) .

As métricas que constituem as Core Web Vitals irão [evoluir](#evolving-web-vitals) com o tempo. O conjunto atual para 2020 se concentra em três aspectos da experiência do usuário: *carregamento* , *interatividade* e *estabilidade visual* e inclui as seguintes métricas (e seus respectivos limites):

<div class="auto-grid" style="--auto-grid-min-item-size: 200px;">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="Recomendações de limites para Largest Contentful Paint", width="400", height="350" %}   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="Recomendações de limites para First Input Delay", width="400", height="350" %}   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="Recomendações de limites para Cumulative Layout Shift", width="400", height="350" %}</div>

- **[Largest Contentful Paint (LCP)](/lcp/)**, ou Maior renderização de conteúdo, mede o desempenho do *carregamento.* Para fornecer uma boa experiência ao usuário, o LCP deve ocorrer dentro de **2,5 segundos** após o início do carregamento da página.
- **[First Input Delay (FID)](/fid/)**, ou Atraso da primeira entrada, mede a *interatividade* . Para fornecer uma boa experiência do usuário, as páginas devem ter um FID de **100 milissegundos** ou menos.
- **[Cumulative Layout Shift (CLS)](/cls/)**, ou Mudança cumulativa de layout: mede *a estabilidade visual* . Para fornecer uma boa experiência do usuário, as páginas devem manter um CLS de **0.1.** ou menos.

Para cada uma das métricas acima, para garantir que você está atingindo a meta recomendada para a maioria dos seus usuários, um bom limite a ser medido é o **75º percentil** de carregamentos de página, segmentado por dispositivos móveis e computadores desktop.

As ferramentas que avaliam a conformidade das Core Web Vitals devem considerar que uma página passa no teste se atender às metas recomendadas no 75º percentil para todas as três métricas acima.

{% Aside %} Para saber mais sobre a pesquisa e a metodologia por trás dessas recomendações, consulte: [Definindo os limites das Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

### Ferramentas para medir e relatar Core Web Vitals

O Google acredita que as Core Web Vitals são essenciais para todas as experiências na web. Como resultado, está empenhado em disponibilizar essas métricas [em todas as suas ferramentas populares](/vitals-tools/). As seções a seguir detalham quais ferramentas suportam as Core Web Vitals.

#### Ferramentas de campo para medir os Core Web Vitals

O [Relatório de experiência do usuário Chrome](https://developer.chrome.com/docs/crux/) coleta dados anônimos de medição de usuários reais para cada Core Web Vital. Esses dados permitem que os proprietários de sites avaliem rapidamente seu desempenho sem a necessidade de instrumentar manualmente as análises nas suas páginas, além de servir a ferramentas como o [PageSpeed Insights](https://pagespeed.web.dev/) e o [relatório Core Web Vitals do](https://support.google.com/webmasters/answer/9205520) Console de Busca.

<div class="table-wrapper">
  <table>
    <tr>
      <td> </td>
      <td>LCP</td>
      <td>FID</td>
      <td>CLS</td>
    </tr>
    <tr>
      <td><a href="https://developer.chrome.com/docs/crux/">Relatório de experiência do usuário Chrome</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://support.google.com/webmasters/answer/9205520">Console de Busca (relatório Core Web Vitals)</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
  </table>
</div>

{% Aside %} Para obter orientação sobre como usar essas ferramentas e qual ferramenta é a ideal para seu caso de uso, consulte: [Primeiros passos com medição de Web Vitals](/vitals-measurement-getting-started/) {% endAside %}

Os dados fornecidos pelo Relatório de experiência do usuário Chrome oferecem uma maneira rápida de avaliar o desempenho dos sites, mas não fornece a telemetria por pageview detalhada, que muitas vezes é necessária para diagnosticar, monitorar e reagir rapidamente a regressões com precisão. Como resultado, é altamente recomendável que os sites configurem seu próprio monitoramento de usuários reais.

#### Medição das Core Web Vitals em JavaScript

Cada uma das Core Web Vitals pode ser medida em JavaScript usando APIs padrão da web.

A maneira mais fácil de medir todas as Core Web Vitals é usar a biblioteca JavaScript [web-vitals](https://github.com/GoogleChrome/web-vitals): um pequeno adaptador, pronto para uso, que encapsula as APIs web subjacentes e que mede cada métrica de maneira a corresponder com precisão à forma como são relatadas por todas as Ferramentas Google listadas acima.

Com a biblioteca [web-vitals](https://github.com/GoogleChrome/web-vitals), medir cada métrica é tão simples quanto chamar uma função (consulte a documentação para detalhes completos sobre o [uso](https://github.com/GoogleChrome/web-vitals#usage) e sobre a [API](https://github.com/GoogleChrome/web-vitals#api)):

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

Depois que você configurar seu site para usar a biblioteca [web-vitals](https://github.com/GoogleChrome/web-vitals) para medir e enviar seus dados de Core Web Vitals para um endpoint de análises, a próxima etapa é agregar e relatar sobre esses dados para saber se suas páginas estão alcançando os limites recomendados para pelo menos 75% das visitas à página.

Embora alguns provedores de análise tenham suporte integrado para as métricas Core Web Vitals, mesmo aqueles que não têm esse suporte devem incluir recursos básicos de métricas customizadas que permitem medir o Core Web Vitals nas suas ferramentas.

Um exemplo é o [Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report), que permite aos proprietários de sites medir seus Core Web Vitals usando o Google Analytics. Para obter orientação sobre como medir os Core Web Vitals usando outras ferramentas analíticas, consulte [Melhores práticas para medir Web Vitals em campo](/vitals-field-measurement-best-practices/) .

Você também pode relatar sobre cada uma das Core Web Vitals sem escrever nenhum código através do uso da [Web Vitals Chrome Extension](https://github.com/GoogleChrome/web-vitals-extension). Esta extensão usa a biblioteca [web-vitals](https://github.com/GoogleChrome/web-vitals) para medir cada uma dessas métricas e mostrá-las aos usuários enquanto navegam na web.

Essa extensão pode ser útil para entender o desempenho de seus próprios sites, dos sites de seus concorrentes e da web em geral.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals-extension">Extensão Web Vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

Como alternativa, os desenvolvedores que preferem medir essas métricas diretamente por meio das APIs da web subjacentes podem consultar os guias de métricas a seguir, para obter detalhes de implementação:

- [Medição da LCP em JavaScript](/lcp/#measure-lcp-in-javascript)
- [Medição da FID em JavaScript](/fid/#measure-fid-in-javascript)
- [Medição da CLS em JavaScript](/cls/#measure-cls-in-javascript)

{% Aside %} Para orientações adicionais sobre como medir essas métricas usando serviços populares de análise (ou suas próprias ferramentas internas de análise), consulte: [Práticas recomendadas para medir Web Vitals em campo](/vitals-field-measurement-best-practices/) {% endAside %}

#### Ferramentas de laboratório para medir as Core Web Vitals

Embora todas as Core Web Vitals sejam, antes de mais nada, métricas de campo, muitas delas também podem ser medidas em laboratório.

A medição em laboratório é a melhor maneira de testar o desempenho dos recursos durante o desenvolvimento, antes de serem lançados aos usuários. É também a melhor maneira de detectar regressões de desempenho antes que elas aconteçam.

As seguintes ferramentas podem ser usadas para medir as Core Web Vitals num ambiente de laboratório:

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.chrome.com/docs/devtools/">Chrome DevTools</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a>)</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://developer.chrome.com/docs/lighthouse/overview/">Lighthouse</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a>)</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} Ferramentas como o Lighthouse que carregam páginas num ambiente simulado sem um usuário não podem medir a FID (não há entrada do usuário). No entanto, a métrica Total Blocking Time (TBT), ou Tempo total de bloqueio, é mensurável em laboratório e é um excelente proxy para a FID. As otimizações de desempenho que melhoram a TBT no laboratório devem melhorar a FID em campo (veja as recomendações de desempenho abaixo). {% endAside %}

Embora as medições em laboratório sejam uma parte essencial da entrega de ótimas experiências, elas não substituem as medições em campo.

O desempenho de um site pode variar drasticamente com base nos recursos do dispositivo do usuário, suas condições de rede, quais outros processos podem estar em execução no dispositivo e como esses processos estão interagindo com a página. Na verdade, cada uma das métricas das Core Web Vitals pode ter sua pontuação afetada pela interação do usuário. Somente a medição em campo é capaz de capturar com precisão o cenário completo.

### Recomendações para melhorar suas pontuações

Depois de medir as Core Web Vitals e identificar as áreas que podem ser melhoradas, a próxima etapa é otimizar. Os guias a seguir oferecem recomendações específicas sobre como otimizar suas páginas para cada uma das Core Web Vitals:

- [Otimizar a LCP](/optimize-lcp/)
- [Otimizar a FID](/optimize-fid/)
- [Otimizar a CLS](/optimize-cls/)

## Outras Web Vitals

Embora as Core Web Vitals sejam as métricas críticas para compreender e proporcionar uma ótima experiência ao usuário, também existem outras métricas vitais.

Essas outras Web Vitals geralmente servem como proxy ou métricas suplementares para as Core Web Vitals, para ajudar a capturar uma parte maior da experiência ou para ajudar no diagnóstico de um problema específico.

Por exemplo, as métricas [Time to First Byte (TTFB)](/ttfb/), ou Tempo até primeiro byte e [First Contentful Paint (FCP)](/fcp/) são ambas aspectos vitais da experiência de *carregamento* e são úteis no diagnóstico de problemas com LCP ([tempos de resposta](/overloaded-server/) lentos do servidor ou [recursos bloqueadores da renderização](/render-blocking-resources/), respectivamente) .

Da mesma forma, métricas como [Total Blocking Time (TBT)](/tbt/) e [Time to Interactive (TTI)](/tti/), ou Tempo até a interatividade são medidas de laboratório que são vitais para detectar e diagnosticar possíveis *problemas de interatividade* que afetarão a FID. No entanto, elas não fazem parte do conjunto Core Web Vitals porque não são mensuráveis em campo, nem refletem um resultado [centrado no usuário.](/user-centric-performance-metrics/#how-metrics-are-measured)

## Evolução das Web Vitals

As Web Vitals e as Core Web Vitals representam os melhores sinais que os desenvolvedores têm disponíveis hoje para medir a qualidade de uma experiência na web, mas esses sinais não são perfeitos e melhorias ou acréscimos futuros devem ser esperados.

As **Core Web Vitals** são relevantes para todas as páginas da web e presentes em ferramentas Google relevantes. Mudanças nessas métricas terão um impacto de largo alcance; como tal, os desenvolvedores devem esperar que as definições e limites das Core Web Vitals sejam estáveis e que as atualizações tenham um aviso prévio e uma cadência anual previsível.

As outras Web Vitals são frequentemente específicas a um determinado contexto ou ferramenta e podem ser mais experimentais do que as Core Web Vitals. Como tal, suas definições e limites podem mudar com mais frequência.

Para todas as Web Vitals, as alterações serão claramente documentadas neste [CHANGELOG](http://bit.ly/chrome-speed-metrics-changelog) público.
