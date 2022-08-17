---
layout: post
title: Orçamentos de desempenho 101
authors:
  - mihajlija
description: |2

  O bom desempenho raramente é um efeito colateral. Saiba mais sobre orçamentos de desempenho e

  como eles podem colocá-lo no caminho do sucesso.
date: 2018-11-05
tags:
  - performance
---

O desempenho é uma parte importante da experiência do usuário e [afeta as métricas de negócios](https://wpostats.com/). É tentador pensar que, se você for um bom desenvolvedor, terá um site de alto desempenho, mas a verdade é que o bom desempenho raramente é um efeito colateral. Como acontece com a maioria das outras coisas, para atingir uma meta, você deve defini-la com clareza. Comece a jornada definindo um **orçamento de desempenho**.

## Definição

Um orçamento de desempenho é um conjunto de limites impostos às métricas que afetam o desempenho do site. Pode ser o tamanho total de uma página, o tempo que leva para carregar em uma rede móvel ou até mesmo o número de solicitações HTTP enviadas. Definir um orçamento ajuda a iniciar a conversa sobre desempenho na web. Ele serve como um ponto de referência para a tomada de decisões sobre design, tecnologia e adição de recursos.

Ter um orçamento permite que os designers pensem nos efeitos das imagens de alta resolução e no número de fontes da web que eles escolhem. Também ajuda os desenvolvedores a comparar diferentes abordagens para um problema e avaliar estruturas e bibliotecas com base em seu tamanho e [custo de análise](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4).

## Escolha as métricas

### Métricas baseadas em quantidade ⚖️

Essas métricas são úteis nos estágios iniciais de desenvolvimento porque destacam o impacto da inclusão de imagens e scripts pesados. Eles também são fáceis de serem comunicados a designers e desenvolvedores.

Já mencionamos algumas coisas que você pode incluir em um orçamento de desempenho, como o peso da página e o número de solicitações HTTP, mas você pode dividi-los em limites mais granulares, como:

- Tamanho máximo das imagens
- Número máximo de fontes da web
- Tamanho máximo de scripts, incluindo estruturas
- Número total de recursos externos, como scripts de terceiros

No entanto, esses números não dizem muito sobre a experiência do usuário. Duas páginas com o mesmo número de solicitações ou mesmo peso podem ser renderizadas de maneira diferente dependendo da ordem em que os recursos são solicitados. Se um [recurso crítico,](/critical-rendering-path/) como uma imagem principal ou uma folha de estilo em uma das páginas, for carregado no final do processo, os usuários irão esperar mais para ver algo útil e perceber a página como mais lenta. Se na outra página as partes mais importantes carregarem rapidamente, eles podem nem perceber se o resto da página carregou ou não.

<figure>{% Img src="image/admin/U0QhA82KFyED4r1y3tAq.png", alt="Imagem de renderização progressiva de página com base no caminho crítico", width="611", height="300" %}</figure>

É por isso que é importante controlar outro tipo de métrica.

### Cronometragem dos marcos ⏱️

Os tempos de marcos marcam eventos que acontecem durante o carregamento da página, como [DOMContentLoaded](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded) ou evento de [carregamento.](https://developer.mozilla.org/docs/Web/Events/load) Os tempos mais úteis são [métricas de desempenho centradas no usuário](/user-centric-performance-metrics/) que informam algo sobre a experiência de carregar uma página. Essas métricas estão disponíveis por meio de [APIs de navegador](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#measuring_these_metrics_on_real_users_devices) e como parte dos relatórios do [Lighthouse.](https://developer.chrome.com/docs/lighthouse/overview/)

[First Contentful Paint (FCP)](/fcp/) mede quando o navegador exibe o primeiro bit de conteúdo do DOM, como texto ou imagens.

[O Time to Interactive (TTI)](/tti/) mede quanto tempo leva para uma página se tornar totalmente interativa e responder de forma confiável à entrada do usuário. É uma métrica muito importante a ser acompanhada se você espera qualquer tipo de interação do usuário na página, como clicar em links, botões, digitar ou usar elementos de formulário.

### Métricas baseadas em regras 💯

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) e o [WebPageTest](https://www.webpagetest.org/) calculam [as pontuações de desempenho](https://developers.google.com/web/tools/lighthouse/scoring#perf-scoring) com base nas regras de melhores práticas gerais, que podem ser usadas como diretrizes. Como bônus, o Lighthouse também oferece dicas para otimizações simples.

Você obterá os melhores resultados se acompanhar uma combinação de métricas de desempenho baseadas em quantidade e centradas no usuário. Concentre-se nos tamanhos dos ativos nas fases iniciais de um projeto e comece a acompanhar o FCP e o TTI o mais rápido possível.

## Estabeleça uma linha de base

A única maneira de saber realmente o que funciona melhor para o seu site é experimentando: pesquise e teste suas descobertas. Analise a competição para ver como você se sai. 🕵️

Se você não tem tempo para isso, aqui estão alguns bons números padrão para você começar:

- Menos de **5 segundos** de Time to Interactive
- Menos de **170 KB** de [recursos de caminho crítico](/critical-rendering-path/) (compactado/reduzido)

Esses [números](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/) são calculados com base em dispositivos de linha de base do mundo real e na **velocidade da rede 3G** . [Mais da metade do tráfego da Internet](https://www.statista.com/statistics/277125/share-of-website-traffic-coming-from-mobile-devices/) hoje acontece em redes móveis, então você deve usar a velocidade da rede 3G como ponto de partida.

### Exemplos de orçamentos

Você deve ter um orçamento adequado para diferentes tipos de páginas em seu site, pois o conteúdo pode variar. Por exemplo:

- Nossa página de produto deve ser enviada com menos de 170 KB de JavaScript para redes celulares
- Nossa página de pesquisa deve incluir menos de 2 MB de imagens para computadores desktop
- Nossa página inicial deve carregar e estar interativa em &lt; 5 s em 3G lento em um telefone Moto G4
- Nosso blog deve ter uma pontuação &gt; 80 em auditorias de desempenho do Lighthouse

## Adicione orçamentos de desempenho ao seu processo de construção

{% Img src="image/admin/YKJcgI9Yd8qEZM0nzPuv.png", alt="Logotipos Webpack, bundlesize e Lighthouse", width="800", height="267" %}

A escolha de uma ferramenta para isso dependerá muito da escala do seu projeto e dos recursos que você pode dedicar à tarefa. Existem algumas ferramentas de código aberto que podem ajudá-lo a adicionar orçamento ao seu processo de criação:

- [Recursos de desempenho do Webpack](https://webpack.js.org/configuration/performance/)
- [bundlesize](https://github.com/siddharthkp/bundlesize)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

Se algo ultrapassar um limite definido, você pode:

- Otimizar um recurso ou ativo existente 🛠️
- Remover um recurso ou ativo existente 🗑️
- Não adicionar o novo recurso ou ativo ✋⛔

## Acompanhe o desempenho

Garantir que seu site seja rápido o suficiente significa que você deve continuar avaliando após o lançamento inicial. O monitoramento dessas métricas ao longo do tempo e a [obtenção de dados de usuários reais](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) mostrarão como as mudanças no desempenho afetam as principais métricas para os negócios.

## Para finalizar

O objetivo de um orçamento de desempenho é garantir que você se concentre no desempenho ao longo de um projeto e defini-lo no início ajudará a evitar retrocessos mais tarde. Ele deve ser o ponto de referência para ajudá-lo a descobrir o que incluir em seu site. A ideia principal é definir metas para que você possa equilibrar melhor o desempenho sem prejudicar a funcionalidade ou a experiência do usuário.🎯

O próximo guia orientará você na definição de seu primeiro orçamento de desempenho em algumas simples etapas.
