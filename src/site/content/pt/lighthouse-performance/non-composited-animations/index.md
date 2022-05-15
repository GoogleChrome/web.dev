---
layout: post
title: Evite animações não compostas
description: Como passar na auditoria Lighthouse "Evitar animações não compostas".
date: 2020-08-12
web_lighthouse:
  - non-composited-animations
---

Animações não compostas podem parecer irregulares (ou seja, não suaves) em telefones de baixo custo ou quando tarefas de alto desempenho estiverem sendo executadas no thread principal. As animações Janky podem aumentar o [Cumulative Layout Shift](/cls/) (CLS) da sua página. Reduzir o CLS melhorará sua pontuação de desempenho do Lighthouse.

## Fundo

Os algoritmos do navegador para converter HTML, CSS e JavaScript em pixels são conhecidos coletivamente como *pipeline de renderização*.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/68xt0KeUvOpB8kA1OH0a.jpg", alt="O pipeline de renderização consiste nas seguintes etapas sequenciais: JavaScript, Estilo, Layout, Pintura, Composto.", width="800", height="122" %} <figcaption>O pipeline de renderização.</figcaption></figure>

Tudo bem se você não entender o que significa cada etapa do pipeline de renderização. O principal a ser entendido agora é que, em cada etapa do pipeline de renderização, o navegador usa o resultado da operação anterior para criar novos dados. Por exemplo, se o seu código faz algo que acione o Layout, as etapas de pintura e composição precisam ser executadas novamente. Uma animação não composta é qualquer animação que acione uma das etapas anteriores no pipeline de renderização (Estilo, Layout ou Pintura). As animações não compostas têm pior desempenho porque forçam o navegador a trabalhar mais.

Confira os seguintes recursos para aprender mais sobre o pipeline de renderização:

- [Visão interna dos navegadores da web modernos (parte 3)](https://developer.chrome.com/blog/inside-browser-part3/)
- [Simplifique a complexidade da pintura e reduza as áreas de pintura](/simplify-paint-complexity-and-reduce-paint-areas/)
- [Atenha-se às propriedades somente do compositor e gerencie a contagem de camadas](/stick-to-compositor-only-properties-and-manage-layer-count/)

## Como o Lighthouse detecta animações não compostas

Quando uma animação não pode ser composta, o Chrome relata os motivos da falha para o rastreamento do DevTools, que é o que o Lighthouse lê. O Lighthouse lista os nós DOM que têm animações que não foram compostas junto com o(s) motivo(s) da falha para cada animação.

## Como garantir que as animações sejam compostas

Consulte [Atenha-se às propriedades somente do compositor e gerencie a contagem de camadas](/stick-to-compositor-only-properties-and-manage-layer-count/) e [animações de alto desempenho](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/) .

## Recursos

- [Código-fonte para a auditoria de *evitar animações não compostas*](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/non-composited-animations.js)
- [Atenha-se às propriedades somente do compositor e gerencie a contagem de camadas](/stick-to-compositor-only-properties-and-manage-layer-count/)
- [Animações de alto desempenho](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [Simplifique a complexidade da pintura e reduza as áreas de pintura](/simplify-paint-complexity-and-reduce-paint-areas/)
- [Visão interna dos navegadores da web modernos (parte 3)](https://developer.chrome.com/blog/inside-browser-part3/)
