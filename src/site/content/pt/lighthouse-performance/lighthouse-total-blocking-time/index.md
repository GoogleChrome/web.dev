---
layout: post
title: Tempo Total de Bloqueio
description: Saiba mais sobre a métrica de tempo total de bloqueio do Lighthouse e como medi-lo e otimizá-lo.
web_lighthouse:
  - tempo de bloqueio total
date: 2019-10-09
updated: 2021-06-04
---

O Tempo Total de Bloqueio (TBT - Total Blocking Time) é uma das métricas monitorada na seção **Desempenho** do relatório Lighthouse. Cada métrica captura algum aspecto da velocidade de carregamento da página.

O Lighthouse apresenta a métrica TBT em segundos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5mK1Vac6rk9cJHMNfZh2.jpg", alt="Uma captura de tela da auditoria do Tempo Total de Bloqueio do Lighthouse", width="800", height="556" %}</figure>

## O que o TBT mede

O TBT mede a quantidade total de tempo que uma página fica bloqueada para responder à entrada do usuário, como cliques do mouse, toques na tela ou pressionar de teclas. A soma é calculada adicionando a *parte* do bloqueio de todas [as tarefas longas](/long-tasks-devtools) entre [First Contentful Paint](/fcp/), renderização do primeiro conteúdo, e [Time to Interactive](/tti/), tempo até interativa. Qualquer tarefa executada por mais de 50 ms é uma tarefa longa. A quantidade de tempo após 50 ms é a parte do bloqueio. Por exemplo, se o Lighthouse detecta uma tarefa de 70 ms, a porção de bloqueio seria de 20 ms.

## Como o Lighthouse determina sua pontuação TBT

Sua pontuação TBT é uma comparação entre o tempo TBT de sua página e os tempos TBT para os 10.000 principais sites quando carregados em dispositivos móveis. Os principais dados do site incluem páginas 404.

Esta tabela mostra como interpretar sua pontuação TBT:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Tempo TBT<br> (em milissegundos)</th>
        <th>Codificação por cores</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–300</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>300-600</td>
        <td>Laranja (moderado)</td>
      </tr>
      <tr>
        <td>Mais de 600</td>
        <td>Vermelho (lento)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como melhorar sua pontuação TBT

Veja [O que está causando minhas longas tarefas?](/long-tasks-devtools/#what-is-causing-my-long-tasks) para aprender a diagnosticar a causa raiz de tarefas longas com o painel Desempenho do Chrome DevTools.

Em geral, as causas mais comuns das tarefas longas são:

- Carregamento, análise ou execução desnecessária de JavaScript. Ao analisar seu código no painel Desempenho, você pode descobrir que o thread principal está fazendo um trabalho que não é realmente necessário para carregar a página. [Reduzir as cargas úteis do JavaScript com divisão de código](/reduce-javascript-payloads-with-code-splitting/), [remover código não utilizado](/remove-unused-code/) ou [carregar de forma eficiente o JavaScript de terceiros](/efficiently-load-third-party-javascript/) deve melhorar sua pontuação TBT.
- Declarações de JavaScript ineficientes. Por exemplo, depois de analisar seu código no painel Desempenho, suponha que você veja uma chamada para `document.querySelectorAll('a')` que retorna 2.000 nós. Refatorar seu código para usar um seletor mais específico que retorna apenas 10 nós deve melhorar sua pontuação TBT.

{% Aside %} Carregamento, análise ou execução desnecessários de JavaScript costumam ser uma oportunidade muito maior para melhorias na maioria dos sites. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fonte para auditoria de **Total Blocking Time** (tempo total de bloqueio)](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/total-blocking-time.js)
- [As longas tarefas de JavaScript estão atrasando seu Time to Interactive (tempo até interativa)?](/long-tasks-devtools)
- [First Contentful Paint (primeira renderização de conteúdo)](/fcp/)
- [Time to Interactive (tempo até interativa)](/tti/)
- [Reduza os payloads do JavaScript com divisão de código](/reduce-javascript-payloads-with-code-splitting/)
- [Remova o código não utilizado](/remove-unused-code/)
- [Carregue com eficiência recursos de terceiros](/efficiently-load-third-party-javascript/)
- [Carregue com eficiência recursos de terceiros](/efficiently-load-third-party-javascript/)
