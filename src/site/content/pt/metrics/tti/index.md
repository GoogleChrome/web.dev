---
layout: post
title: Time to Interactive (TTI)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: Este artigo apresenta a métrica Time to Interactive (TTI) e explica como medi-la
tags:
  - performance
  - metrics
---

{% Aside %} A Time to Interactive (TTI), ou tempo até interatividade, é uma importante [métrica de laboratório](/user-centric-performance-metrics/#in-the-lab) para medir a [responsividade da carga](/user-centric-performance-metrics/#types-of-metrics). Ela ajuda a identificar casos em que uma página *parece* interativa, mas na verdade não é. Uma TTI rápida ajuda a garantir que a página seja [utilizável](/user-centric-performance-metrics/#questions). {% endAside %}

## O que é TTI?

A métrica TTI mede o tempo desde o início do carregamento da página até o carregamento de seus principais sub-recursos e é capaz de responder de forma confiável e rápida à entrada do usuário.

Para calcular a TTI com base num [rastreamento de desempenho](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference) de uma página da web, siga as etapas a seguir:

1. Comece com a [First Contentful Paint (FCP)](/fcp/).
2. Pesquise para frente no tempo por uma janela silenciosa de pelo menos cinco segundos, onde a *janela silenciosa* é definida como: nenhuma [tarefa longa](/custom-metrics/#long-tasks-api) e não mais do que duas solicitações GET de rede durante a carga.
3. Pesquise para trás pela última tarefa longa antes da janela silenciosa, parando na FCP se nenhuma tarefa longa for encontrada.
4. A TTI é o tempo de término da última tarefa longa antes da janela silenciosa (ou o mesmo valor que a FCP se nenhuma tarefa longa for encontrada).

O diagrama a seguir deve ajudar a visualizar as etapas acima:

{% Img src="image/admin/WZM0n4aXah67lEyZugOT.svg", alt="Uma linha do tempo de carregamento da página mostrando como calcular a TTI", width="800", height="473", linkTo=true %}

Historicamente, os desenvolvedores otimizavam as páginas para tempos de renderização rápidos, muitas vezes às custas da TTI.

Técnicas como a renderização lado-servidor (SSR) podem levar a cenários em que uma página *parece* interativa (ou seja, links e botões são visíveis na tela), mas não é *de fato* interativa porque a thread principal está bloqueado ou porque o código JavaScript que controla esses elementos ainda não foi carregado.

Quando os usuários tentam interagir com uma página que parece interativa, mas na verdade não é, eles provavelmente responderão de uma destas duas maneiras:

- Na melhor das hipóteses, ficarão incomodados porque a página demora para responder.
- Na pior das hipóteses, eles presumirão que a página está quebrada e provavelmente irão embora. Eles podem até perder a confiança no valor da sua marca.

Para evitar esse problema, faça todos os esforços para minimizar a diferença entre a FCP e a TTI. E nos casos em que exista uma diferença perceptível, deixe claro por meio de indicadores visuais que os componentes de sua página ainda não são interativos.

## Como medir TTI

A TTI é uma métrica que é idealmente medida [em laboratório](/user-centric-performance-metrics/#in-the-lab). A melhor maneira de medir a TTI é executar uma auditoria de desempenho do Lighthouse no seu site. Consulte a [documentação do Lighthouse sobre TTI](/interactive/) para obter detalhes de uso.

### Ferramentas de laboratório

- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %} Embora seja possível medir a TTI em campo, isto não é recomendado, pois a interação com o usuário pode afetar a TTI de sua página de maneiras que podem levar a muitas variações em seus relatórios. Para entender a interatividade de uma página em campo, você deve medir a [First Input Delay (FID)](/fid/). {% endAside %}

## O que é uma boa pontuação de TTI?

Para garantir uma boa experiência ao usuário, os sites devem se esforçar para ter um tempo de interação de menos de **5 segundos** quando testados num **hardware móvel típico**.

Para obter detalhes sobre como a TTI da sua página afeta sua pontuação de desempenho no Lighthouse, consulte [Como o Lighthouse determina sua pontuação TTI](/interactive/#how-lighthouse-determines-your-tti-score)

## Como melhorar a TTI

Para aprender como melhorar a TTI para um site específico, você pode executar uma auditoria de desempenho do Lighthouse e prestar atenção a quaisquer [oportunidades](/lighthouse-performance/#opportunities) específicas que a auditoria sugerir.

Para saber como melhorar a TTI em geral (para qualquer site), consulte os seguintes guias de desempenho:

- [Minifique o JavaScript](/unminified-javascript/)
- [Pré-conecte a origens necessárias](/uses-rel-preconnect/)
- [Pré-carregue solicitações importantes](/uses-rel-preload/)
- [Reduza o impacto do código de terceiros](/third-party-summary/)
- [Minimize a profundidade de solicitações críticas](/critical-request-chains/)
- [Reduza o tempo de execução do JavaScript](/bootup-time/)
- [Minimize o trabalho da thread principal](/mainthread-work-breakdown/)
- [Mantenha as contagens de solicitações baixas e os tamanhos de transferência pequenos](/resource-summary/)
