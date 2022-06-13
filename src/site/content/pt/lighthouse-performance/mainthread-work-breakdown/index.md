---
layout: post
title: Minimize o trabalho do thread principal
description: Aprenda sobre o thread principal do navegador e como você pode otimizar sua página web para reduzir a carga do thread principal e melhorar o desempenho.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - mainthread-work-breakdown
---

O [processo de renderização](https://developer.chrome.com/blog/inside-browser-part3/) do navegador é o que transforma seu código numa página web com a qual seus usuários podem interagir. Por default, o [thread principal](https://developer.mozilla.org/docs/Glossary/Main_thread) do processo de renderização normalmente lida com a maioria do código: ele processa o HTML e constrói o DOM, processa o CSS e aplica os estilos especificados e processa, computa e executa o JavaScript.

O thread principal também processa eventos do usuário. Portanto, sempre que o thread principal estiver ocupado fazendo outra coisa, sua página web poderá não responder às interações do usuário, trazendo uma experiência ruim.

## Como falha a auditoria do trabalho do thread principal do Lighthouse

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas que mantêm o thread principal ocupado por mais de 4 segundos durante o carregamento:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kcHYoy1vfoJX76JVyM9T.png", alt="Uma captura de tela da auditoria Lighthouse Minimize main thread work audit", width="800", height="408" %}</figure>

Para ajudá-lo a identificar as fontes de carregamento do thread principal, o Lighthouse mostra uma análise de onde o tempo da CPU foi gasto enquanto o navegador carregava sua página.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como minimizar o trabalho do thread principal

As seções abaixo são organizadas com base nas categorias que o Lighthouse relata. Veja [The anatomy of a frame](https://aerotwist.com/blog/the-anatomy-of-a-frame/) para ter uma visão geral de como o Chromium renderiza páginas web.

Veja [Faça menos trabalho no thread principal](https://developer.chrome.com/docs/devtools/speed/get-started/#main) para aprender como usar o Chrome DevTools para investigar exatamente o que seu thread principal está fazendo enquanto a página carrega.

### Computação de scripts

- [Otimize o JavaScript de terceiros](/fast/#optimize-your-third-party-resources)
- [Rode seus handlers de entradas em paralelo](/debounce-your-input-handlers/)
- [Use web workers](/off-main-thread/)

### Estilo e layout

- [Reduza o escopo e a complexidade dos cálculos de estilo](/reduce-the-scope-and-complexity-of-style-calculations/)
- [Evite layouts grandes e complexos e alterações de layout](/avoid-large-complex-layouts-and-layout-thrashing/)

### Renderização

- [Atenha-se apenas às propriedades do compositor e gerencie a contagem de camadas](/stick-to-compositor-only-properties-and-manage-layer-count/)
- [Simplifique a complexidade da pintura e reduza as áreas de pintura](/simplify-paint-complexity-and-reduce-paint-areas/)

### Processamento de HTML e CSS

- [Extraia o CSS crítico](/extract-critical-css/)
- [Minifique o CSS](/minify-css/)
- [Adie CSS não crítico](/defer-non-critical-css/)

### Processamento e compilação de scripts

- [Reduza payloads JavaScript com divisão de código](/reduce-javascript-payloads-with-code-splitting/)
- [Remova o código não utilizado](/remove-unused-code/)

### Coleta de lixo

- [Monitore o uso de memória total de sua página da web com `measureMemory()`](/monitor-total-page-memory-usage/)

## Recursos

- [Código fonte para a auditoria **Minimize main thread work**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/mainthread-work-breakdown.js)
- [Thread principal (MDN)](https://developer.mozilla.org/docs/Glossary/Main_thread)
- [Visão interna de um navegador da web moderno (parte 3)](https://developer.chrome.com/blog/inside-browser-part3/)
