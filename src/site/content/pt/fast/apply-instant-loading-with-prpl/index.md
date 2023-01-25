---
layout: post
title: Aplique carregamento instantâneo com o padrão PRPL
authors:
  - houssein
description: O PRPL é um acrônimo que descreve um padrão usado para carregar as páginas da web deixá-las mais interativas e mais rápidas. Neste guia, aprenda como cada uma dessas técnicas trabalham juntas, mas ainda podem ser usadas independentemente para alcançar resultados de desempenho.
date: 2018-11-05
tags:
  - performance
---

O PRPL é um acrônimo que descreve um padrão usado para fazer as páginas da web carregarem e se tornarem interativas com mais rapidez:

- Carregue os recursos mais importantes via **push** (ou **préload**.
- **Renderize** a rota inicial o mais rápido possível.
- Faça um **cache prévio** dos ativos restantes.
- Use **lazy loading** para as outras rotas e ativos menos críticos.

Neste guia, aprenda como cada uma dessas técnicas trabalham juntas, mas ainda podem ser usadas independentemente para alcançar resultados de desempenho.

## Audite sua página com o Lighthouse

Execute o Lighthouse para identificar oportunidades de melhoria alinhadas com as técnicas PRPL:

{% Instruction 'devtools-lighthouse', 'ol' %}

1. Marque as caixas de seleção **Desempenho** e **Progressive Web App**.
2. Clique em **Executar auditorias** para gerar um relatório.

Para mais informações, veja [Descubra oportunidades de desempenho com o Lighthouse](/discover-performance-opportunities-with-lighthouse).

## Pré-carga de ativos críticos

O Lighthouse mostra a seguinte auditoria com falha se um determinado recurso for processado e baixado posteriormente:

{% Img src="image/admin/tgcMfl3HJLmdoERFn7Ji.png", alt="Auditoria Lighthouse: Pré-carregue requisições importantes", width="745", height="97" %}

O [**preload**](https://developer.mozilla.org/docs/Web/HTML/Preloading_content) (pré-carregamento) é uma solicitação de busca declarativa que informa ao navegador para solicitar um recurso o mais rápido possível. Pré-carregue recursos críticos adicionando uma tag `<link>` com `rel="preload"` no cabeçalho do seu documento HTML:

```html
<link rel="preload" as="style" href="css/style.css">
```

O navegador define um nível de prioridade mais apropriado para o recurso, a fim de tentar baixá-lo antes, sem atrasar o evento `window.onload`.

Para mais informações sobre o pré-carregamento de recursos críticos, veja o guia [Pré-carregue ativos críticos](/preload-critical-assets).

## Renderize a rota inicial o mais rápido possível

O Lighthouse avisa se há recursos que atrasam o [**First Paint**](/user-centric-performance-metrics/#important-metrics-to-measure) (primeira renderização), o momento em que seu site renderiza pixels na tela:

{% Img src="image/admin/gvj0jlCYbMdpLNtHu0Ji.png", alt="Auditoria Lighthouse: Elimine recursos bloqueantes", width="800", height="111" %}

Para melhorar a métrica First Paint, o Lighthouse recomenda integrar na página o JavaScript crítico e adiar o resto usando [`async`](/critical-rendering-path-adding-interactivity-with-javascript/), bem como também integrar o CSS crítico usado acima da dobra. Isso tudo melhora o desempenho, eliminando viagens de ida e volta ao servidor para buscar ativos de renderização bloqueantes. No entanto, o código inline é mais difícil de manter do ponto de vista do desenvolvimento e não pode ser armazenado em cache separadamente pelo navegador.

Outra abordagem para melhorar o First Paint é **renderizar do lado do servidor** o HTML inicial da sua página. Isto permite mostrar o conteúdo imediatamente para o usuário enquanto os scripts ainda estão sendo buscados, processados e executados. No entanto, isto pode aumentar a carga útil do arquivo HTML significativamente, o que pode prejudicar a métrica [**Time to Interactive**](/tti/) ou seja, o tempo que leva para seu aplicativo se tornar interativo e responder à entrada do usuário.

Não existe uma única solução perfeita para reduzir a métrica First Paint na sua aplicação e você só deve considerar os estilos inline e a renderização lado-servidor se as vantagens compensarem as desvantagens para sua aplicação. Você pode aprender mais sobre esses dois conceitos com os recursos a seguir.

- [Otimize a entrega de CSS](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)
- [O que é renderização do lado do servidor?](https://www.youtube.com/watch?v=GQzn7XRdzxY)

<figure data-float="right">   {% Img src="image/admin/xv1f7ZLKeBZD83Wcw6pd.png", alt="Solicitações/respostas com o service worker", width="800", height="1224" %}</figure>

## Faça cache prévio de ativos

Atuando como um proxy, os **service workers** podem buscar ativos diretamente do cache, em vez de fazer acessos repetidos ao servidor. Isto não apenas permite que os usuários usem seu aplicativo quando estão offline, mas também resulta em tempos de carregamento de página mais rápidos em visitas repetidas.

Use uma biblioteca de terceiros para simplificar o processo de geração de um service worker, a menos que você tenha requisitos de cache muito complexos que as bibliotecas disponíveis não conseguem fornecer. Por exemplo, o [Workbox](/workbox) fornece uma coleção de ferramentas que permitem criar e manter um service worker para armazenar ativos em cache. Para mais informações sobre service workers e confiabilidade offline, veja o [guia do service worker](/service-workers-cache-storage) no programa de aprendizado de confiabilidade.

## Carregamento lazy

O Lighthouse exibirá uma auditoria com falha se você enviar um excesso de dados pela rede.

{% Img src="image/admin/Ml4hOCqfD4kGWfuKYVTN.png", alt="Auditoria Lighthouse: Tem payloads de rede muito grandes", width="800", height="99" %}

Isto inclui todos os tipos de ativos, mas grandes payloads de JavaScript são especialmente caras devido ao tempo que o navegador leva para processá-las e compilá-las. O Lighthouse também fornece um aviso sobre isto, quando apropriado.

{% Img src="image/admin/aKDCV8qv3nuTVFt0Txyj.png", alt="Auditoria Lighthouse: Tempo de inicialização do JavaScript", width="797", height="100" %}

Para enviar uma payload de JavaScript menor que contenha apenas o código necessário quando um usuário carrega inicialmente sua aplicação, divida o pacote inteiro e os blocos de [carregamento lazy](/reduce-javascript-payloads-with-code-splitting) sob demanda.

Uma vez que você conseguiu dividir seu pacote, pré-carregue os pedaços que são mais importantes (consulte o guia [Pré-carregue de ativos críticos](/preload-critical-assets)). O pré-carregamento garante que os recursos mais importantes sejam buscados e baixados mais cedo pelo navegador.

Além de dividir e carregar diferentes blocos de JavaScript sob demanda, o Lighthouse também fornece uma auditoria para carregar de forma lazy imagens não críticas.

{% Img src="image/admin/sEgLhoYadRCtKFCYVM1d.png", alt="Auditoria Lighthouse: Adie a carga de imagens offscreen", width="800", height="90" %}

Se você carrega muitas imagens em sua página da web, adie todas as que estiverem abaixo da dobra ou fora da janela de visualização do dispositivo quando uma página for carregada (veja [Usar lazysizes para carregar imagens de forma lazy](/use-lazysizes-to-lazyload-images)).

## Próximos passos

Agora que você entende alguns dos conceitos básicos por trás do padrão PRPL, continue no próximo guia desta seção para aprender mais. É importante lembrar que nem todas as técnicas precisam ser aplicadas em conjunto. Quaisquer esforços feitos com qualquer um dos itens a seguir vão trazer melhorias de desempenho perceptíveis.

- Use **push** ou **preload** para carregar recursos críticos.
- **Renderize** a rota inicial o mais rápido possível.
- Faça um **cache prévio** dos ativos restantes.
- Use **lazy loading** para as outras rotas e ativos menos críticos.
