---
layout: codelab
title: Pré-carregar fontes da web para melhorar a velocidade de carregamento
authors:
  - gmimani
description: |2

  Neste codelab, aprenda como melhorar o desempenho de uma página pré-carregando

  fontes da web.
date: 2018-04-23
glitch: web-dev-preload-webfont?path=index.html
related_post: pré-carregar-ativos-críticos
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

Este codelab mostra como pré-carregar fontes da web usando `rel="preload"` para remover qualquer flash de texto não estilizado (FOUT).

## Medir

Avalie primeiro o desempenho do site antes de adicionar qualquer otimização. {% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

O relatório Lighthouse gerado mostrará a sequência de busca de recursos em **Latência máxima do caminho crítico**.

{% Img src="image/admin/eperh8ZUnjhsDlnJdNIG.png", alt="Fontes da web estão presentes na cadeia de solicitação crítica.", width="704", height="198" %}

Na auditoria acima, as fontes da web fazem parte da cadeia de solicitação crítica e são buscadas por último. A [**cadeia de solicitação crítica**](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/) representa a ordem dos recursos que são priorizados e buscados pelo navegador. Neste aplicativo, as fontes da web (Pacfico e Pacifico-Bold) são definidas usando a regra [@font-face](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#defining_a_font_family_with_font-face) e são o último recurso buscado pelo navegador na cadeia de solicitação crítica. Normalmente, as fontes da web são carregadas lentamente, o que significa que não são carregadas até que os recursos críticos sejam baixados (CSS, JS).

Aqui está a sequência dos recursos buscados no aplicativo:

{% Img src="image/admin/9oBNjZORrBj6X8RVlr9t.png", alt="Webfonts carregados lentamente.", width="583", height="256" %}

## Pré-carregamento de fontes da web

Para evitar FOUT, você pode pré-carregar fontes da web que são necessárias imediatamente. Adicione o `Link` para este aplicativo no cabeçalho do documento:

```html
<head>
 <!-- ... -->
 <link rel="preload" href="/assets/Pacifico-Bold.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

Os `as="font" type="font/woff2"` dizem ao navegador para baixar este recurso como uma fonte e ajuda na priorização da fila de recursos.

O `crossorigin` indica se o recurso deve ser buscado com uma solicitação CORS, pois a fonte pode vir de um domínio diferente. Sem este atributo, a fonte pré-carregada é ignorada pelo navegador.

Como a Pacifico-Bold é usada no cabeçalho da página, adicionamos uma tag de pré-carregamento para buscá-la ainda mais cedo. Não é importante pré-carregar a fonte Pacifico.woff2 porque ela estiliza o texto que está abaixo da dobra.

Recarregue o aplicativo e execute o lighthouse novamente. Verifique a seção **Latência máxima do caminho crítico.**

{% Img src="image/admin/lC85s7XSc8zEXgtwLsFu.png", alt="Pacifico-Bold webfont é pré-carregada e removida da cadeia de solicitação crítica", width="645", height="166" %}

Observe como a `Pacifico-Bold.woff2` é removida da cadeia de solicitação crítica. Ela é obtida anteriormente no aplicativo.

{% Img src="image/admin/BrXidcKZfCbbUbkcSwas.png", alt="A fonte da web Pacifico-Bold está pré-carregada", width="553", height="254" %}

Com o pré-carregamento, o navegador sabe que precisa fazer o download desse arquivo mais cedo. É importante observar que, se não for usado corretamente, o pré-carregamento pode prejudicar o desempenho, fazendo solicitações desnecessárias de recursos que não são usados.
