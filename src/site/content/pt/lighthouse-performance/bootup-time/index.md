---
layout: post
title: Reduza o tempo de execução do JavaScript
description: |2

  Aprenda como a execução de JavaScript pode diminuir o desempenho de sua página

  e como você pode acelerá-lo.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - tempo de inicialização
tags:
  - memory
---

Quando seu JavaScript leva muito tempo para ser executado, ele desacelera o desempenho da página de várias maneiras:

- **Custo de rede**

    Mais bytes equivalem a tempos de download mais longos.

- **Custo de análise e compilação**

    JavaScript é analisado e compilado no thread principal. Quando o thread principal está ocupado, a página não pode responder à entrada do usuário.

- **Custo de execução**

    JavaScript também é executado no thread principal. Se sua página executa muitos códigos antes de eles realmente serem necessários, isso também atrasa seu [Time to Interactive](/tti/) (tempo até interativa), que é uma das principais métricas relacionadas a como os usuários percebem a velocidade de sua página.

- **Custo de memória**

    Se o seu JavaScript retém muitas referências, ele pode potencialmente consumir muita memória. As páginas parecem irregulares ou lentas quando consomem muita memória. Vazamentos de memória podem fazer com que sua página congele completamente.

## Como a auditoria do tempo de execução de JavaScript do Lighthouse falha

[O Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) mostra um aviso quando a execução do JavaScript leva mais de 2 segundos. A auditoria falha quando a execução leva mais de 3,5 segundos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BoomMoQNycPXsy34DZZs.png", alt="Uma captura de tela da auditoria do Lighthouse Reduzir tempo de execução do JavaScriptt", width="800", height="321" %}</figure>

Para ajudá-lo a identificar os maiores contribuintes para o tempo de execução, o Lighthouse relata o tempo gasto na execução, avaliação e análise de cada arquivo JavaScript que sua página carrega.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como acelerar a execução do JavaScript

{% include 'content/lighthouse-performance/js-perf.njk' %}

## Recursos

[Código-fonte para auditoria **Reduzir o tempo de execução do JavaScript**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/bootup-time.js)
