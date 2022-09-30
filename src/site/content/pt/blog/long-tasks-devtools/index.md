---
title: As longas tarefas de JavaScript estão atrasando seu Time to Interactive (tempo até interativa)?
subhead: Aprenda a diagnosticar trabalhos caros que impedem a interação do usuário.
authors:
  - addyosmani
date: 2019-05-29
hero: image/admin/QvWXvBSXsRKtpGOcakb5.jpg
alt: Uma ampulheta com areia escorrendo
description: |2-

  Tarefas longas podem manter o thread principal ocupado, atrasando a interação do usuário. O Chrome DevTools agora pode visualizar tarefas longas, facilitando a visualização das tarefas a serem otimizadas.
tags:
  - blog
  - performance
---

**tl;dr: Tarefas longas podem manter o thread principal ocupado, atrasando a interação do usuário. O Chrome DevTools agora pode visualizar tarefas longas, facilitando a visualização das tarefas a serem otimizadas.**

Se você usa o Lighthouse para auditar suas páginas, pode estar familiarizado com o [Time to Interactive](/tti/), uma métrica que representa quando os usuários podem interagir com sua página e obter uma resposta. Mas você sabia que Tarefas Longas (JavaScript) podem contribuir muito para um TTI ruim?

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4XCzYI9gaUJDTTJu9JxH.png", alt="Tempo para interativo exibido no relatório Lighthouse", width="800", height="169" %}

## O que são Tarefas Longas?

Uma [tarefa longa](https://developer.mozilla.org/docs/Web/API/Long_Tasks_API) é um código JavaScript que monopoliza o thread principal por longos períodos de tempo, fazendo com que a IU "congele".

Enquanto uma página da web está sendo carregada, as Tarefas Longas podem bloquear o tópico principal e fazer com que a página não responda às entradas do usuário, mesmo se parecer estar pronta. Cliques e toques geralmente não funcionam porque ouvintes de eventos, manipuladores de cliques etc. ainda não foram anexados.

Tarefas longas com uso intenso de CPU ocorrem devido a um trabalho complexo que leva mais de 50 ms. Por que 50ms? [O modelo RAIL](/rail/) sugere que você processe eventos de entrada do usuário em [50 ms](/rail/#response-process-events-in-under-50ms) para garantir uma resposta visível em 100 ms. Do contrário, a conexão entre ação e reação é rompida.

## Há tarefas longas em minha página que podem atrasar a interatividade?

Até agora, você precisava procurar manualmente "longos blocos amarelos" de script com mais de 50 ms no [Chrome DevTools](https://developer.chrome.com/docs/devtools/) ou usar a [API de tarefas longas](https://calendar.perfplanet.com/2017/tracking-cpu-with-long-tasks-api/) para descobrir quais tarefas estavam atrasando a interatividade. Isso pode ser um pouco complicado.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mSKnMWBcEBHWkXzTGCAH.png", alt="Uma captura de tela do painel DevTools Performance mostrando as diferenças entre tarefas curtas e longas", width="800", height="450" %}

Para ajudar a facilitar seu fluxo de trabalho de auditoria de desempenho, [DevTools agora visualiza Tarefas Longas](https://developers.google.com/web/updates/2019/03/devtools#longtasks) . As tarefas (mostradas em cinza) têm sinalizadores vermelhos se forem Tarefas Longas.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fyDPyO4XbSINMVpSSY9E.png", alt="DevTools visualizando Tarefas Longas como barras cinza no Painel de Desempenho com uma bandeira vermelha para tarefas longas", width="800", height="450" %}

- Grave um traço no [painel Desempenho](https://developer.chrome.com/docs/devtools/evaluate-performance/) ao carregar uma página da web.
- Procure uma bandeira vermelha na visualização do tópico principal. Você deve ver que as tarefas agora estão cinza ("Tarefa").
- Passar o mouse sobre uma barra permitirá que você saiba a duração da tarefa e se ela foi considerada "longa".

## O que está causando minhas Tarefas Longas?

Para descobrir o que está causando uma tarefa longa, selecione a barra de **tarefas cinza.** Na gaveta abaixo, selecione **Bottom-Up** (de baixo para cima) e **Group by Activity** (agrupar por atividade). Isso permite que você veja quais atividades contribuíram mais (no total) para a tarefa que demorou tanto para ser concluída. Abaixo, parece ser um conjunto caro de consultas DOM.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7irBiePkFJRmzKMlcJUV.png", alt="Selecionar uma tarefa longa (rotulada 'Tarefa') no DevTools nos permite detalhar as atividades que foram responsáveis por ela.", width=" 800", height="450"%}

## Quais são as maneiras comuns de otimizar Tarefas Longas?

Scripts grandes costumam ser uma das principais causas de Tarefas Longas, portanto, considere [dividi-los](/reduce-javascript-payloads-with-code-splitting). Além disso, fique de olho nos scripts de terceiros; as Tarefas Longas podem atrasar o conteúdo principal de se tornar interativo.

Divida todo o seu trabalho em pequenos pedaços (que rodem em &lt;50ms) e execute-os no lugar e na hora certa; o lugar certo pode até ser fora do thread principal, em um worker. [Idle Until Urgent](https://philipwalton.com/articles/idle-until-urgent/), de Phil Walton, é uma boa leitura sobre esse tópico.

Mantenha suas páginas responsivas. Minimizar tarefas longas é uma ótima maneira de garantir que seus usuários tenham uma experiência agradável ao visitar seu site. Para obter mais informações sobre Tarefas longas, consulte [Métricas de desempenho centradas no usuário](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_long_tasks).
