---
layout: post
title: Total Blocking Time (TBT)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: Este artigo apresenta a métrica Total Blocking Time (TBT) e explica como medi-la.
tags:
  - performance
  - metrics
---

{% Aside %}

O Total Blocking Time (TBT), ou tempo total de bloqueio, é uma [métrica de laboratório](/user-centric-performance-metrics/#in-the-lab) importante para medir a [responsividade da carga](/user-centric-performance-metrics/#types-of-metrics) porque ajuda a quantificar o nível de não-interatividade de uma página antes que ela se torne interativa de forma confiável. Um baixo valor de TBT ajuda a garantir que a página seja [utilizável](/user-centric-performance-metrics/#questions).

{% endAside %}

## O que é TBT?

A métrica Total Blocking Time (TBT) mede a quantidade total de tempo entre a [First Contentful Paint (FCP)](/fcp/) e a [Time to Interactive (TTI)](/tti/) em que a thread principal foi bloqueado por tempo suficiente para evitar a responsividade da entrada.

A thread principal é considerada "bloqueada" sempre que houver uma [tarefa longa](/custom-metrics/#long-tasks-api) rodando, ou seja, uma tarefa que é executada na thread principal por mais de 50 milissegundos (ms). Dizemos que a thread principal está "bloqueada" porque o navegador não pode interromper uma tarefa em andamento. Assim, no caso em que um usuário *interage* com a página no meio de uma tarefa longa, o navegador precisa aguardar que a tarefa termine antes que ele possa responder.

Se a tarefa for longa o suficiente (por exemplo, qualquer coisa acima de 50 ms), é provável que o usuário sinta o atraso e perceba a página como lenta ou instável.

O *tempo* de bloqueio de uma determinada tarefa longa é sua duração superior a 50 ms. E o *tempo total de bloqueio* de uma página é a soma dos *tempos de bloqueio* de cada tarefa longa que ocorre entre a FCP e a TTI.

Por exemplo, considere o seguinte diagrama da thread principal do navegador durante o carregamento da página:

{% Img src="image/admin/clHG8Yv239lXsGWD6Iu6.svg", alt="Uma linha do tempo de tarefas na thread principal", width="800", height="156", linkTo=true %}

A linha do tempo acima possui cinco tarefas, três das quais são Tarefas Longas porque sua duração excede 50 ms. O diagrama a seguir mostra o tempo de bloqueio para cada uma das tarefas longas:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xKxwKagiz8RliuOI2Xtc.svg", alt="Um cronograma de tarefas no thread principal mostrando o tempo de bloqueio", width="800", height="156", linkTo=true %}

Portanto, embora o tempo total gasto na execução de tarefas na thread principal seja de 560 ms, apenas 345 ms desse tempo são considerados tempo de bloqueio.

<table>
  <tr>
    <th></th>
    <th>Duração da tarefa</th>
    <th>Tempo de bloqueio da tarefa</th>
  </tr>
  <tr>
    <td>Tarefa um</td>
    <td>250 ms</td>
    <td>200 ms</td>
  </tr>
  <tr>
    <td>Tarefa dois</td>
    <td>90 ms</td>
    <td>40 ms</td>
  </tr>
  <tr>
    <td>Tarefa três</td>
    <td>35 ms</td>
    <td>0 ms</td>
  </tr>
  <tr>
    <td>Tarefa quatro</td>
    <td>30 ms</td>
    <td>0 ms</td>
  </tr>
  <tr>
    <td>Tarefa cinco</td>
    <td>155 ms</td>
    <td>105 ms</td>
  </tr>
  <tr>
    <td colspan="2"><strong>Tempo Total de Bloqueio</strong></td>
    <td><strong>345 ms</strong></td>
  </tr>
</table>

### Como a TBT se relaciona com a TTI?

A TBT é uma ótima métrica complementar para a TTI porque ajuda a quantificar o nível de não-interatividade de uma página antes que ela se torne interativa de forma confiável.

A TTI considera uma página "confiavelmente interativa" se a thread principal estiver livre de tarefas longas por pelo menos cinco segundos. Isto significa que três tarefas de 51 ms espalhadas por 10 segundos podem atrasar a TTI em até uma única tarefa de 10 segundosmas esses dois cenários seriam percebidos de forma muito diferente para um usuário tentando interagir com a página.

No primeiro caso, três tarefas de 51 ms teriam uma TBT de **3 ms**. Enquanto uma tarefa única de 10 segundos de duração teria uma TBT de **9.950 ms**. O maior valor da TBT no segundo caso quantifica a experiência pior.

## Como medir a TBT

TBT é uma métrica que deve ser medida [em laboratório](/user-centric-performance-metrics/#in-the-lab). A melhor maneira de medir a TBT é executar uma auditoria de desempenho do Lighthouse no seu site. Consulte a [documentação do Lighthouse sobre TBT](/lighthouse-total-blocking-time) para obter detalhes de uso.

### Ferramentas de laboratório

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %} Embora seja possível medir o TBT em campo, isto não é recomendado, pois a interação com o usuário pode afetar a TBT da sua página de maneiras que podem levar a muitas variações nos seus relatórios. Para entender a interatividade de uma página em campo, você deve medir a [First Input Delay (FID)](/fid/). {% endAside %}

## O que é uma boa pontuação TBT?

Para fornecer uma boa experiência ao usuário, os sites devem se esforçar para ter uma Total Blocking Time de menos de **300 milissegundos** quando testados em **um hardware móvel típico**.

Para obter detalhes sobre como a TBT da sua página afeta sua pontuação de desempenho no Lighthouse, consulte [Como o Lighthouse determina sua pontuação TBT](/lighthouse-total-blocking-time/#how-lighthouse-determines-your-tbt-score)

## Como melhorar a TBT

Para aprender como melhorar a TBT para um site específico, você pode executar uma auditoria de desempenho do Lighthouse e prestar atenção a quaisquer [oportunidades](/lighthouse-performance/#opportunities) específicas que a auditoria sugerir.

Para aprender como melhorar a TBT em geral (para qualquer site), consulte os seguintes guias de desempenho:

- [Reduza o impacto do código de terceiros](/third-party-summary/)
- [Reduza o tempo de execução do JavaScript](/bootup-time/)
- [Minimize o trabalho da thread principal](/mainthread-work-breakdown/)
- [Mantenha as contagens de solicitações baixas e os tamanhos de transferência pequenos](/resource-summary/)
