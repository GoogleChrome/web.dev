---
layout: post
title: Speed Index
description: Aprenda sobre a métrica Speed Index do Lighthouse e como otimizá-la.
date: 2019-05-02
updated: 2021-06-04
web_lighthouse:
  - speed-index
---

O Speed Index (índice de velocidade) é uma das seis métricas monitoradas na seção **Desempenho** do relatório Lighthouse. Cada métrica captura algum aspecto da velocidade de carregamento da página.

O Lighthouse apresenta a métrica Speed Index em segundos:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ksKnQH9tGEzIXsrVoUHR.png", alt="Uma captura de tela da auditoria do Lighthouse Speed Index", width="800", height="588" %}</figure>

## O que mede o Speed Index

O Speed Index mede a rapidez com que o conteúdo é exibido visualmente durante o carregamento da página. O Lighthouse primeiro captura um vídeo do carregamento da página no navegador e calcula a progressão visual entre os quadros. O Lighthouse depois usa o [módulo Speedline Node.js](https://github.com/paulirish/speedline) para gerar a pontuação Speed Index.

{% Aside %} O Speedline é baseado nos mesmos princípios do [índice de velocidade original introduzido pelo WebpageTest.org](https://github.com/WPO-Foundation/webpagetest-docs/blob/master/user/Metrics/SpeedIndex.md), mas calcula a progressão visual entre os quadros usando o [índice de similaridade estrutural (SSIM) em](https://en.wikipedia.org/wiki/Structural_similarity) vez da distância de histograma. {% endAside %}

## Como o Lighthouse determina sua pontuação Speed Index

Sua pontuação Speed Index (índice de velocidade) é uma comparação do índice de velocidade da sua página e os índices de velocidade de sites reais, com base nos [dados do HTTP Archive](https://bigquery.cloud.google.com/table/httparchive:lighthouse.2019_03_01_mobile?pli=1) .

A tabela abaixo mostra como interpretar sua pontuação Speed Index:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Speed Index<br>(em segundos)</th>
        <th>Codificação por cores</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–3.4</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>3.4–5.8</td>
        <td>Laranja (moderado)</td>
      </tr>
      <tr>
        <td>Over 5.8</td>
        <td>Vermelho (lento)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como melhorar sua pontuação Speed Index

Embora qualquer coisa que você faça para melhorar a velocidade de carregamento da página melhore sua pontuação Speed Index, lidar com quaisquer problemas descobertos por as auditorias de diagnóstico a seguir deve ter um impacto particularmente grande:

- [Minimize o trabalho do thread principal](/mainthread-work-breakdown)
- [Reduza o tempo de execução do JavaScript](/bootup-time)
- [Garanta que o texto permanece visível durante o carregamento das fontes web](/font-display)

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fonte para a auditoria **Speed Index**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/speed-index.js)
- [Guia de pontuação do Lighthouse](/performance-scoring)
- [Speedline](https://github.com/paulirish/speedline)
- [WebPagetest Speed Index](https://github.com/WPO-Foundation/webpagetest-docs/blob/main/src/metrics/SpeedIndex.md)
