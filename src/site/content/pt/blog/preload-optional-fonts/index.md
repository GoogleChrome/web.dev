---
title: Impedindo o deslocamento de layout e flashes de texto invisível (FOIT) ao carregar fontes opcionais
subhead: 'A partir do Chrome 83, o link rel="preload" e font-display: optional podem ser combinados para remover completamente o erro do layout'
authors:
  - houssein
date: 2020-03-18
hero: image/admin/wv5DLtYiAhHm4lNemN1E.jpg
alt: Uma grande letra A de um tipo definido sobre uma mesa branca.
description: 'Ao otimizar os ciclos de renderização, o Chrome 83 elimina o deslocamento de layout quando pré-carregar fontes opcionais. Combinando <link rel="preload"> com font-display: opcional é o maneira mais eficaz de garantir a renderização livre de falhas de fontes personalizadas.'
tags:
  - blog
  - performance
  - fonts
feedback:
  - api
---

{% Aside %} No Chrome 83, novas melhorias no carregamento de fontes foram feitas para eliminar completamente o deslocamento de layout e flash de texto invisível (FOIT) quando fontes opcionais forem pré-carregadas. {% endAside %}

Ao otimizar os ciclos de renderização, o Chrome 83 elimina o deslocamento de layout ao pré-carregar fontes opcionais. Combinando `<link rel="preload">` com `font-display: optional` é a maneira mais eficaz de garantir que não haja erros de layout ao renderizar fontes personalizadas.

## Compatibilidade do navegador  {: #compatibility }

Verifique os dados do MDN para obter informações atualizadas de suporte para vários navegadores:

- [`<link rel="preload">`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)
- [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#Browser_compatibility)

## Renderização de fonte

O deslocamento de layout, ou re-layout, ocorre quando um recurso em uma página da web muda dinamicamente, resultando em um "deslocamento" de conteúdo. Buscar e renderizar fontes da web pode causar deslocamentos de layout diretamente de duas maneiras:

- Uma fonte de fallback foi trocada por uma nova fonte ("flash de texto sem estilo")
- O texto "invisível" é mostrado até que uma nova fonte seja renderizada na página ("flash de texto invisível")

A propriedade CSS [`font-display`](https://font-display.glitch.me/) fornece uma maneira de modificar o comportamento de renderização de fontes personalizadas por meio de uma variedade de diferentes valores suportados (`auto`, `block`, `swap`, `fallback`, e `optional`). A escolha de qual valor usar depende do comportamento preferido para fontes carregadas de forma assíncrona. No entanto, cada um desses valores suportados pode acionar o re-layout de uma das duas maneiras listadas acima, até o momento!

{% Aside %} A métrica [Cumulative Layout Shift](/cls/) torna possível medir a instabilidade do layout em uma página da web. {% endAside %}

## Fontes opcionais

A `font-display` usa uma linha do tempo de três períodos para lidar com as fontes que precisam ser baixadas antes de serem renderizadas:

- **Block:** renderiza o texto "invisível", mas muda para a fonte da web assim que terminar de carregar.
- **Swap:** renderize o texto usando uma fonte de fallback do sistema, mas mude para a fonte da web assim que terminar de carregar.
- **Fail:** renderiza o texto usando uma fonte do sistema de fallback.

Anteriormente, as fontes designadas com `font-display: optional` tinham um período de block de 100 ms e nenhum período de swap. Isso significa que o texto "invisível" é exibido rapidamente antes de mudar para uma fonte de fallback. Se a fonte não for baixada em 100 ms, a fonte de fallback será usada e nenhuma mudança ocorrerá.

<figure>{% Img src = "image/admin/WHLORYEu864QRRveFQUz.png", alt = "Diagrama mostrando o comportamento da fonte opcional anterior quando a fonte falha no carregamento", width = "800", height = "340"%}<figcaption> <code>font-display: optional</code> anterior: comportamento opcional no Chrome quando a fonte é baixada <b>após</b> o período de block de 100 ms</figcaption></figure>

No entanto, no caso de a fonte ser baixada antes de o período de bloco de 100 ms terminar, a fonte personalizada é renderizada e usada na página.

<figure>{% Img src="image/admin/mordYRjmCCDtlMcNXEOU.png", alt="Diagrama mostrando o comportamento da fonte opcional anterior quando a fonte carrega no tempo", width = "800", height = "318"%}<figcaption> <code>font-display: optional</code> anterior: comportamento opcional no Chrome quando a fonte é baixada <b>antes</b> do período de bloco de 100 ms</figcaption></figure>

O Chrome renderiza novamente a página **duas vezes** em ambos os casos, independentemente de a fonte de fallback ser usada ou se a fonte personalizada terminar de carregar a tempo. Isso causa uma leve cintilação do texto invisível e, nos casos em que uma nova fonte é renderizada, um erro de layout que move parte do conteúdo da página. Isso ocorre mesmo se a fonte estiver armazenada no cache de disco do navegador e puder ser carregada bem antes de o período de block terminar.

As [otimizações](https://bugs.chromium.org/p/chromium/issues/detail?id=1040632) chegaram ao Chrome 83 para remover totalmente o primeiro ciclo de renderização para fontes opcionais que são pré-carregadas com [`<link rel="preload'>`](/codelab-preload-web-fonts/). Em vez disso, a renderização é bloqueada até que a fonte personalizada termine de carregar ou um determinado período de tempo tenha passado. Esse período de tempo limite está definido atualmente em 100 ms, mas pode mudar em um futuro próximo para otimizar o desempenho.

<figure>{% Img src="image/admin/zLldiq9J3duBTaeRN88e.png", alt="Diagrama mostrando o comportamento da nova fonte opcional pré-carregada quando a fonte falha ao carregar", width="800", height="353" %} <figcaption>Novo comportamento <code>font-display: optional</code> no Chrome quando as fontes são pré-carregadas e a fonte é baixada <b>após</b> o período de block de 100 ms (sem flash de texto invisível)</figcaption></figure>

<figure>{% Img src="image/admin/OEHClGFMFspaWjb3xXLY.png", alt="Diagrama mostrando o comportamento da nova fonte opcional pré-carregada quando a fonte carrega no tempo", width="800", height="346" %} <figcaption>Novo comportamento <code>font-display: optional</code> no Chrome quando as fontes são pré-carregadas e a fonte é baixada <b>antes</b> do período de block de 100 ms (sem flash de texto invisível)</figcaption></figure>

O pré-carregamento de fontes opcionais no Chrome remove a possibilidade de erros de layout e flashes de texto sem estilo. Isso corresponde ao comportamento necessário, conforme especificado no [Módulo de Fontes CSS Nível 4,](https://drafts.csswg.org/css-fonts-4/#valdef-font-face-font-display-optional) onde as fontes opcionais nunca devem causar um novo layout e os agentes do usuário podem, em vez disso, atrasar a renderização por um período de tempo adequado.

Embora não seja necessário pré-carregar uma fonte opcional, melhora muito a chance de carregar antes do primeiro ciclo de renderização, especialmente se ainda não estiver armazenada no cache do navegador.

## Conclusão

A equipe do Chrome está interessada em ouvir suas experiências de pré-carregamento de fontes opcionais com essas novas otimizações em vigor! Caso tenha alguma [dúvida](https://bugs.chromium.org/p/chromium/issues/entry) ou se quiser apresentar alguma sugestão de recursos, entre em contato.
