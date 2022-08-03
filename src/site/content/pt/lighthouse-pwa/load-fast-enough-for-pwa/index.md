---
layout: post
title: O carregamento da página não é rápido o suficiente em redes móveis
description: Aprenda como fazer sua página da web carregar rapidamente em redes móveis.
web_lighthouse:
  - load-fast-enough-for-pwa
date: 2019-05-04
updated: 2020-06-10
---

Muitos usuários acessam sua página através de uma conexão de rede celular lenta. Fazer sua página carregar rapidamente numa rede móvel ajuda a garantir uma experiência positiva para seus usuários móveis.

{% Aside 'note' %}Um carregamento de página rápido numa rede móvel é um requisito básico para um site ser considerado um Progressive Web App. Veja a [checklist do Core Progressive Web App](/pwa-checklist/#core). {% endAside %}

## Como a auditoria de velocidade de carregamento de página do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca páginas que não carregam rápido o suficiente em dispositivos móveis:

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cg0UJ1Lykj672ygYYeXo.png", alt="Auditoria Lighthouse mostrando que página não carrega rápido o suficiente em dispositivos móveis", width="800", height="98" %}</figure>

Duas métricas principais afetam a forma como os usuários percebem o tempo de carregamento:

- [First Meaningful Paint - FMP](/first-meaningful-paint) (primeira renderização significativa), que mede quando o conteúdo principal da página parece visualmente completo
- [Time to Interactive - TTI](/tti/) (tempo até a interatividade), que mede quando a página é totalmente interativa

Por exemplo, se uma página parecer visualmente completa depois de um segundo, mas o usuário não puder interagir com ela por 10 segundos, os usuários provavelmente perceberão o tempo de carregamento da página como sendo 10 segundos.

O Lighthouse calcula qual seria o valor do TTI numa conexão de rede 4G lenta. Se o tempo de interação for superior a 10 segundos, a auditoria falhará.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como melhorar o tempo de carregamento da sua página

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fonte para auditoria **Carregamento da página não é rápido o suficiente en dispositivos móveis**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/load-fast-enough-for-pwa.js)
- [Checkout básico do Progressive Web App](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
- [Caminho de renderização crítico](/critical-rendering-path/)
- [Comece a analisar o desempenho do tempo de execução](https://developer.chrome.com/docs/devtools/evaluate-performance/)
- [Registre o desempenho de carga](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#record-load)
- [Otimizando a eficiência do conteúdo](/performance-optimizing-content-efficiency/)
- [Desempenho da renderização](/rendering-performance/)
