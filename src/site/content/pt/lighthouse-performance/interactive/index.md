---
layout: post
title: Time to Interactive
description: Aprenda sobre a métrica Time to Interactive (tempo até interatividade) da Lighthouse e como medir e otimizá-la.
date: 2019-05-02
updated: 2019-10-10
web_lighthouse:
  - interactive
---

Time to Interactive (TTI), ou tempo até interatividade, é uma das métricas monitoradas na seção **Desempenho** do relatório Lighthouse. Cada métrica captura algum aspecto da velocidade de carregamento da página.

Medir o TTI é importante porque alguns sites otimizam a visibilidade do conteúdo em detrimento da interatividade. Isto pode criar uma experiência frustrante para o usuário: o site parece estar pronto, mas quando o usuário tenta interagir com ele, nada acontece.

O Lighthouse apresenta a métrica TTI em segundos:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MOXhGOQxWpolq6nhBleq.png", alt="Uma captura de tela da auditoria Lighthouse Time to Interactive", width="800", height="588" %}</figure>

## O que mede o TTI

O TTI mede quanto tempo leva para uma página se tornar *totalmente* interativa. Uma página é considerada totalmente interativa quando:

- A página exibe conteúdo útil, que é medido pela métrica [First Contentful Paint](/fcp/),
- Os handlers de eventos estão registrados para a maioria dos elementos visíveis da página e
- A página responde às interações do usuário dentro de 50 milissegundos.

{% Aside %} Tanto a [First CPU Idle](/first-cpu-idle) quanto a TTI medem quando a página está pronta para entrada do usuário. A métrica First CPU Idle ocorre quando o usuário pode *começar* a interagir com a página; A métrica TTI ocorre quando o usuário *pode interagir totalmente* com a página. Veja o documento do Google [First Interactive And Consistently Interactive](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit) se tiver interesse no cálculo exato de cada métrica. {% endAside %}

## Como o Lighthouse determina sua pontuação TTI

Sua pontuação TTI é uma comparação entre o TTI da sua página e os TTI para sites reais, com base nos [dados do HTTP Archive](https://httparchive.org/reports/loading-speed#ttci). Por exemplo, sites com desempenho situado no nonagésimo nono percentil renderizam o TTI em cerca de 2,2 segundos. Se o TTI do seu site for 2,2 segundos, sua pontuação TTI é 99.

A tabela abaixo mostra como interpretar sua pontuação TTI:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Métrica TTI<br> (em segundos)</th>
        <th>Codificação por cores</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–3.8</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>3.9–7.3</td>
        <td>Orange (moderate)</td>
      </tr>
      <tr>
        <td>Over 7.3</td>
        <td>Red (slow)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como melhorar sua pontuação TTI

Uma melhoria que pode ter um efeito particularmente grande na TTI é adiar ou remover o trabalho desnecessário do JavaScript. Procure oportunidades para [otimizar seu JavaScript](/fast#optimize-your-javascript). Em particular, considere [reduzir as payloads do JavaScript com divisão de código](/reduce-javascript-payloads-with-code-splitting) e [aplicação do padrão PRPL](/apply-instant-loading-with-prpl). [Otimizar o JavaScript de terceiros](/fast/#optimize-your-third-party-resources) também produz melhorias significativas para alguns sites.

Essas duas auditorias de diagnóstico fornecem oportunidades adicionais para reduzir o trabalho do JavaScript:

- [Minimize o trabalho do thread principal](/mainthread-work-breakdown)
- [Reduza o tempo de execução do JavaScript](/bootup-time)

## Rastreando a TTI em dispositivos de usuários reais

Para saber como medir quando a TTI ocorre nos dispositivos dos seus usuários, consulte a página Google [Métricas de desempenho centradas no usuário](/user-centric-performance-metrics/). A [seção Tracking TTI](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_tti) descreve como acessar programaticamente os dados do TTI e enviá-los ao Google Analytics.

{% Aside %} TTI pode ser difícil de rastrear em campo. Rastrear o [First Input Delay](https://developers.google.com/web/updates/2018/05/first-input-delay) pode ser um bom proxy para TTI. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fonte para a auditoria **Time to Interactive**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/interactive.js)
- [Guia de pontuação do Lighthouse](/performance-scoring)
- [First Interactive And Consistently Interactive](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Otimização de inicialização de JavaScript](/optimizing-content-efficiency-javascript-startup-optimization/)
- [Reduza payloads JavaScript com tree shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)
- [Otimize recursos de terceiros](/fast/#optimize-your-third-party-resources)
