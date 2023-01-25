---
layout: post
title: Use lazy-loading para melhorar a velocidade de carregamento
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-09
description: Esta postagem explica o lazy-loading  e por que você pode querer carregar  elementos no seu site usando lazy-loading.
tags:
  - performance
  - images
---

A porção de [imagens](http://beta.httparchive.org/reports/state-of-images?start=earliest&end=latest) e [vídeo](http://beta.httparchive.org/reports/page-weight#bytesVideo) na carga útil típica de um site pode ser significativa. Infelizmente, as partes interessadas do projeto podem não querer cortar quaisquer recursos de mídia de seus aplicativos existentes. Esses impasses são frustrantes, especialmente quando todas as partes envolvidas querem melhorar o desempenho do site, mas não conseguem chegar a um acordo sobre como chegar lá. Felizmente, o carregamento lazy é uma solução que reduz a carga útil da página inicial *e* o tempo de carregamento, sem economizar no conteúdo.

## O que é lazy-loading? {: #what }

O lazy-loading, ou carregamento adiado, é uma técnica que não carrega recursos não críticos no momento que a página é carregada. Em vez disso, esses recursos não críticos são carregados no momento em que são necessários. No que diz respeito às imagens, "não crítico" costuma ser sinônimo de "fora da tela". Se você usou o Lighthouse e examinou algumas oportunidades para melhoria, pode ter visto alguma orientação neste domínio na forma da [auditoria para adiar imagens fora da tela](https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/):

<figure>   {% Img src="image/admin/63NnMISWUUWD3mvAliwe.png", alt="Uma captura de tela da auditoria Adiar imagens fora da tela, do Lighthouse.", width="800", height="102" %}   <figcaption>Uma das auditorias de desempenho do Lighthouse é identificar imagens fora da tela, que são candidatas ao carregamento lazy.</figcaption></figure>

Você provavelmente já viu o carregamento lazy em ação, e é mais ou menos assim:

- Você chega numa página e começa a rolar à medida que lê o conteúdo.
- Em algum ponto, você rola uma imagem de placeholder para a viewport.
- A imagem de placeholder é repentinamente substituída pela imagem final.

Um exemplo de carregamento lazy de imagem pode ser encontrado na popular plataforma de publicação [Medium](https://medium.com/), que carrega imagens de placeholder leves no carregamento da página e as substitui por imagens carregadas de forma lazy à medida que são roladas para dentro da viewport.

<figure>   {% Img src="image/admin/p5ahQ67QtZ20bgto7Kpy.jpg", alt="Uma captura de tela do site Medium na navegação, demonstrando o carregamento lazy em ação. O placeholder desfocado está à esquerda e o recurso carregado está à direita.", width="800", height="493" %}   <figcaption>Um exemplo de carregamento lazy de imagem em ação. Uma imagem de placeholder é carregada junto com a página (à esquerda) e, quando rolada para a viewport, a imagem final é carregada no momento necessário.</figcaption></figure>

Se você não está familiarizado com o carregamento lazy, pode estar se perguntando qual a utilidade dessa técnica e quais são seus benefícios. Leia mais para descobrir!

## Por que carregar imagens e video usando lazy-loading em vez de simplesmente *carregá-los*? {: #why }

Porque é possível que você esteja carregando coisas que o usuário talvez nunca veja. Isto é problemático por vários motivos:

- Desperdiça dados. Em conexões ilimitadas, isto não é a pior coisa que poderia acontecer (embora você poderia estar usando aquela largura de banda preciosa para baixar outros recursos que de fato serão vistos pelo usuário). Em planos de dados limitados, no entanto, carregar coisas que o usuário nunca vê pode ser efetivamente uma perda de dinheiro.
- Desperdiça tempo de processamento, bateria e outros recursos do sistema. Depois que um recurso de mídia é baixado, o navegador precisa decodificá-lo e renderizar seu conteúdo na viewport.

O carregamento lazy de imagens e vídeos reduz o tempo de carregamento da página inicial, o peso da página inicial e o uso de recursos do sistema, tudo isso tendo impactos positivos no desempenho.

## Implementando lazy-loading {: #implementing }

Existem diversas maneiras de implementar o carregamento lazy. Sua escolha de solução deve levar em consideração os navegadores que você suporta e também o que você está tentando carregar de forma lazy.

Navegadores modernos implementam o [carregamento lazy no nível do navegador](/browser-level-image-lazy-loading/), que pode ser ativado usando o atributo `loading` em imagens e iframes. Para garantir a compatibilidade com navegadores mais antigos ou para realizar o carregamento lazy em elementos sem o carregamento lazy integrado, você pode implementar uma solução com seu próprio JavaScript. Existem também várias bibliotecas para ajudá-lo a fazer isso. Veja as postagens neste site para detalhes completos de todas essas abordagens:

- [Lazy-loading de imagens](/lazy-loading-images/)
- [Lazy-loading de vídeos](/lazy-loading-video/)

Além disso, compilamos uma lista de [possíveis problemas com o carregamento lazy](/lazy-loading-best-practices) e itens a serem observados em sua implementação.

## Conclusão

Se usado com cuidado, o carregamento lazy de imagens e vídeos pode reduzir significativamente o tempo de carregamento inicial e a carga útil da página em seu site. Os usuários não incorrerão em atividades de rede desnecessárias nem custos de processamento de recursos de mídia que talvez nunca vejam, mas ainda podem ver esses recursos, se quiserem.

No que diz respeito às técnicas de melhoria de desempenho, o carregamento lazy é razoavelmente incontroverso. Se você tiver muitas imagens embutidas no seu site, é uma maneira bastante eficaz de reduzir os downloads desnecessários. Os usuários do seu site e as partes interessadas no projeto irão apreciar isso!
