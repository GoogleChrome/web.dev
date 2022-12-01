---
layout: post
title: Pré-carregue ativos críticos para melhorar a velocidade de carregamento
authors:
  - houssein
  - mihajlija
description: |2

  Assim que você abre qualquer página da web, o navegador solicita um documento HTML de um

  servidor, analisa o conteúdo do arquivo HTML e envia solicitações separadas

  para quaisquer outras referências externas. A cadeia de solicitação crítica representa o

  ordem dos recursos que são priorizados e buscados pelo navegador.
date: 2018-11-05
updated: 2020-05-27
codelabs:
  - codelab-preload-critical-assets
  - codelab-preload-web-fonts
tags:
  - performance
feedback:
  - api
---

Quando você abre uma página da web, o navegador solicita o documento HTML de um servidor, analisa seu conteúdo e envia solicitações separadas para quaisquer recursos referenciados. Como desenvolvedor, você já conhece todos os recursos de que sua página precisa e quais deles são os mais importantes. Você pode usar esse conhecimento para solicitar os recursos críticos com antecedência e acelerar o processo de carregamento. Esta postagem explica como fazer isso com `<link rel="preload">`.

## Como funciona o pré-carregamento

O pré-carregamento é mais adequado para recursos normalmente descobertos mais tarde pelo navegador.

<figure>{% Img src="image/admin/Ad9PLq3DcQt9Ycp63z6O.png", alt="Captura de tela do painel Chrome DevTools Network.", width="701", height="509" %}<figcaption> Neste exemplo, a fonte Pacifico é definida na folha de estilo com uma regra <a href="/reduce-webfont-size/#defining-a-font-family-with-@font-face)"><code>@font-face</code></a>. O navegador carrega o arquivo de fonte somente após concluir o download e a análise da folha de estilo.</figcaption></figure>

Ao pré-carregar um determinado recurso, você está dizendo ao navegador que gostaria de buscá-lo antes do que o navegador iria descobri-lo, porque você tem certeza de que é importante para a página atual.

<figure>{% Img src="image/admin/PgRbERrxLGfF439yBMeY.png", alt="Captura de tela do painel Chrome DevTools Network após aplicar o pré-carregamento.", width="701", height="509" %} <figcaption> Neste exemplo, a fonte Pacifico é pré-carregada, portanto, o download ocorre em paralelo com a folha de estilo.</figcaption></figure>

A cadeia de solicitação crítica representa a ordem dos recursos que são priorizados e buscados pelo navegador. O Lighthouse identifica os ativos que estão no terceiro nível dessa cadeia como descobertos posteriormente. Você pode usar a [**auditoria de solicitações de chave**](/uses-rel-preload) de pré-carregamento para identificar quais recursos pré-carregar.

{% Img src="image/admin/BPUTHBNZFbeXqb0dVx2f.png", alt="A chave de pré-carregamento do farol solicita auditoria.", width="745", height="97" %}

Você pode pré-carregar recursos adicionando uma tag `<link>` `rel="preload"` ao cabeçalho do seu documento HTML:

```html
<link rel="preload" as="script" href="critical.js">
```

O navegador armazena em cache os recursos pré-carregados para que estejam disponíveis imediatamente quando necessário. Ele não executa os scripts nem aplica as folhas de estilo.

{% Aside %} Depois de implementar o pré-carregamento, muitos sites, incluindo [Shopify, Financial Times e Treebo, viram melhorias de 1 segundo](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf) em métricas centradas no usuário, como [Time to Interactive](/tti/) e [First Contentful Paint](/fcp/). {% endAside %}

Dicas de recursos, por exemplo, [`preconnect`](/preconnect-and-dns-prefetch) - [`prefetch`](/link-prefetch), são executadas conforme o navegador achar adequado. A `preload`, por outro lado, é obrigatória para o navegador. Os navegadores modernos já são muito bons em priorizar recursos, por isso é importante usar o `preload` com moderação e pré-carregar apenas os recursos mais críticos.

Pré-carregamentos não utilizados disparam um alerta de Console no Chrome, aproximadamente 3 segundos depois do evento `load`.

{% Img src="image/admin/z4FbCezjXHxaIhq188TU.png", alt="Aviso do Chrome DevTools Console sobre recursos pré-carregados não utilizados.", width="800", height="228" %}

{% Aside %} O [`preload` é suportado](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility) em todos os navegadores modernos. {% endAside %}

## Casos de uso

{% Aside 'caution' %} No momento da escrita, o Chrome tinha um [bug](https://bugs.chromium.org/p/chromium/issues/detail?id=788757) aberto para solicitações pré-carregadas que são buscadas antes de outros recursos de prioridade mais alta. Até que isso seja resolvido, desconfie de como os recursos pré-carregados podem "pular a fila" e ser solicitados mais cedo do que deveriam. {% endAside %}

### Recursos de pré-carregamento definidos em CSS

Fontes definidas com [`@font-face`](/reduce-webfont-size/#defining-a-font-family-with-@font-face) ou imagens de fundo definidas em arquivos CSS não são descobertas até que o navegador baixe e analise esses arquivos CSS. O pré-carregamento desses recursos garante que eles sejam buscados antes do download dos arquivos CSS.

### Pré-carregando arquivos CSS

Se estiver usando a [abordagem crítica de CSS{/a0 , você dividirá seu CSS em duas partes. O CSS crítico necessário para renderizar o conteúdo acima da dobra é embutido no `<head>` do documento e o CSS não crítico geralmente é carregado lentamente com JavaScript. Esperar que o JavaScript seja executado antes de carregar o CSS não crítico pode causar atrasos na renderização quando os usuários fazem a rolagem, então é uma boa ideia usar `<link rel="preload">` para iniciar o download mais cedo.](/extract-critical-css)

### Pré-carregando arquivos JavaScript

Como os navegadores não executam arquivos pré-carregados, o pré-carregamento é útil para separar a busca da [execuçãoo](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/), o que pode melhorar as métricas, como o tempo de interação. O pré-carregamento funciona melhor se você [dividir](/reduce-javascript-payloads-with-code-splitting) seus pacotes de JavaScript e pré-carregar apenas os blocos críticos.

## Como implementar rel=preload

A maneira mais simples de implementar o `preload` é adicionar uma tag `<link>` `<head>` do documento:

```html
<head>
  <link rel="preload" as="script" href="critical.js">
</head>
```

Fornecendo o `as` atributo ajuda o navegador definir a prioridade do recurso prefetched acordo com seu tipo, definir os cabeçalhos certas, e determinar se o recurso já existe no cache. Os valores aceitos para este atributo incluem: `script` , `style` , `font` , `image` e [outros](https://developer.mozilla.org/docs/Web/HTML/Element/link#Attributes) .

{% Aside %} Dê uma olhada no [documento de Agendamento e Prioridades de Recursos](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) do Chrome para saber mais sobre como o navegador prioriza diferentes tipos de recursos. {% endAside %}

{% Aside 'caution' %} Omitir o atributo `as` ou ter um valor inválido é equivalente a uma [solicitação XHR](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest), onde o navegador não sabe o que está buscando por isso não pode determinar a prioridade correta. Também pode fazer com que alguns recursos, como scripts, sejam buscados duas vezes. {% endAside %}

Alguns tipos de recursos, como fontes, são carregados no [modo anônimo](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements). Para aqueles, você deve definir o atributo `crossorigin` `preload`:

```html
<link rel="preload" href="ComicSans.woff2" as="font" type="font/woff2" crossorigin>
```

{% Aside 'caution' %} Fontes pré-carregadas sem o `crossorigin` serão buscadas duas vezes! {% endAside %}

Elementos `<link>` também aceitam um atributo [`type`](https://developer.mozilla.org/docs/Web/HTML/Element/link#attr-type), que contém o [tipo MIME](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) do recurso vinculado. Os navegadores usam o valor do `type` para garantir que os recursos sejam pré-carregados apenas se seu tipo de arquivo for compatível. Se um navegador não suportar o tipo de recurso especificado, ele ignorará o `<link rel="preload">`.

{% Aside 'codelab' %} [Melhore o desempenho de uma página pré-carregando fontes da web](/codelab-preload-web-fonts). {% endAside %}

Você também pode pré-carregar qualquer tipo de recurso por meio do [cabeçalho `Link`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link) HTTP:

`Link: </css/style.css>; rel="preload"; as="style"`

Um benefício de especificar o `preload` no cabeçalho HTTP é que o navegador não precisa analisar o documento para descobri-lo, o que pode oferecer pequenas melhorias em alguns casos.

### Pré-carregando módulos JavaScript com webpack

Se você estiver usando um empacotador de módulo que cria arquivos de construção de seu aplicativo, você precisa verificar se ele suporta a injeção de tags de pré-carregamento. Com o [webpack](https://webpack.js.org/) versão 4.6.0 ou posterior, o pré-carregamento é suportado através do uso de [comentários mágicos](https://webpack.js.org/api/module-methods/#magic-comments) dentro de `import()`:

```js
import(_/* webpackPreload: true */_ "CriticalChunk")
```

Se você estiver usando uma versão mais antiga do webpack, use um plug-in de terceiros, como [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin).

## Conclusão

Para melhorar a velocidade da página, pré-carregue recursos importantes que são descobertos posteriormente pelo navegador. Pré-carregar tudo seria contraproducente, portanto, use a `preload` com moderação e [meça o impacto no mundo real](/fast#measure-performance-in-the-field).
