---
layout: post
title: Evite encadear solicitações críticas
description: |2

  Aprenda o que são cadeias de solicitações críticas, como elas afetam o desempenho da página da web,

  e como você pode reduzir o efeito.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - cadeias de solicitações críticas
---

[Cadeias de solicitações críticas](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) são séries de solicitações de rede dependentes importantes para a renderização de páginas. Quanto maior o comprimento das cadeias e quanto maiores os tamanhos de download, mais significativo é o impacto no desempenho do carregamento da página.

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) relata solicitações críticas carregadas com alta prioridade:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/apWYFAWSuxf9tQHuogSN.png", alt="Uma captura de tela da auditoria do Lighthouse Minimizar profundidade de solicitação crítica", width="800", height="452" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como o Lighthouse identifica cadeias de solicitações críticas

O Lighthouse usa a prioridade da rede como um proxy para identificar recursos críticos de bloqueio de renderização. Consulte [Prioridades e programação de recursos](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) do Google Chrome para obter mais informações sobre como o Chrome define essas prioridades.

Os dados sobre cadeias de solicitações críticas, tamanhos de recursos e tempo gasto no download de recursos são extraídos do [protocolo de depuração remota](https://github.com/ChromeDevTools/devtools-protocol) do Chrome.

## Como reduzir o efeito de cadeias de solicitações críticas no desempenho

Use os resultados de auditoria de cadeias de solicitação críticas para direcionar primeiro os recursos que têm o maior efeito no carregamento da página:

- Minimize o número de recursos críticos: elimine-os, adie seu download, marque-os como `async` e assim por diante.
- Otimize o número de bytes críticos para reduzir o tempo de download (número de viagens de ida e volta).
- Otimize a ordem em que os recursos críticos restantes são carregados: baixe todos os ativos críticos o quanto antes para encurtar o comprimento do caminho crítico.

Saiba mais sobre como otimizar suas [imagens](/use-imagemin-to-compress-images) , [JavaScript](/apply-instant-loading-with-prpl), [CSS](/defer-non-critical-css) e [fontes da web](/avoid-invisible-text) .

## Orientação específica de pilha

### Magento

Se você não estiver agrupando seus ativos JavaScript, considere usar o [baler](https://github.com/magento/baler).

## Recursos

[Código-fonte para a auditoria **Minimizar profundidade de solicitação crítica**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/critical-request-chains.js)
