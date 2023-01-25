---
layout: post
title: Otimize o carregamento e a renderização do WebFont
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: |2

  Esta postagem explica como carregar WebFonts para evitar mudanças de layout e páginas em branco quando WebFonts não estão disponíveis quando a página é carregada.
tags:
  - performance
  - fonts
feedback:
  - api
---

Um WebFont "completo" que inclui todas as variantes estilísticas, das quais você pode não precisar, além de todos os glifos, que podem não ser usados, pode facilmente resultar em um download de vários megabytes. Neste artigo, você descobrirá como otimizar o carregamento de WebFonts para que os visitantes baixem apenas o que usarão.

Para resolver o problema de arquivos grandes contendo todas as variantes, a `@font-face` foi projetada especificamente para permitir que você divida a família de fontes em uma coleção de recursos. Por exemplo, subconjuntos Unicode e variantes de estilo distintas.

Dadas essas declarações, o navegador descobre os subconjuntos e variantes necessários e baixa o conjunto mínimo necessário para renderizar o texto, o que é muito conveniente. No entanto, se você não tiver cuidado, isso também pode criar um gargalo de desempenho no caminho de renderização crítica e atrasar a renderização do texto.

### O comportamento padrão

O carregamento lento de fontes carrega uma implicação oculta importante que pode atrasar a renderização do texto: o navegador deve [construir a árvore de renderização](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction), que depende das árvores DOM e CSSOM, antes de saber quais recursos de fonte precisa para renderizar o texto. Como resultado, as solicitações de fonte são atrasadas muito depois de outros recursos críticos e o navegador pode ser impedido de renderizar o texto até que o recurso seja obtido.

{% Img src="image/admin/NgSTa9SirmikQAq1G5fN.png", alt="Caminho de renderização crítica da fonte", width="800", height="303" %}

1. O navegador solicita o documento HTML.
2. O navegador começa a analisar a resposta HTML e a construir o DOM.
3. O navegador descobre CSS, JS e outros recursos e despacha solicitações.
4. O navegador constrói o CSSOM depois que todo o conteúdo CSS é recebido e o combina com a árvore DOM para construir a árvore de renderização.
    - As solicitações de fonte são despachadas depois que a árvore de renderização indica quais variantes de fonte são necessárias para renderizar o texto especificado na página.
5. O navegador executa o layout e pinta o conteúdo na tela.
    - Se a fonte ainda não estiver disponível, o navegador pode não renderizar nenhum pixel de texto.
    - Depois que a fonte está disponível, o navegador pinta os pixels do texto.

A "corrida" entre a primeira pintura do conteúdo da página, que pode ser feita logo após a construção da árvore de renderização, e a solicitação do recurso de fonte é o que cria o "problema de texto em branco" em que o navegador pode renderizar o layout da página, mas omite qualquer texto.

Pré-carregando WebFonts e usando `font-display` para controlar como os navegadores se comportam com fontes indisponíveis, você pode evitar páginas em branco e mudanças de layout devido ao carregamento de fontes.

### Pré-carregue seus recursos WebFont

Se houver grande probabilidade de sua página precisar de um WebFont específico hospedado em um URL que você conhece com antecedência, você pode aproveitar a [priorização](https://developers.google.com/web/fundamentals/performance/resource-prioritization) de recursos. O uso de `<link rel="preload">` acionará uma solicitação para o WebFont no início do caminho de renderização crítica, sem ter que esperar a criação do CSSOM.

### Personalize o atraso de renderização do texto

Embora o pré-carregamento torne mais provável que um WebFont esteja disponível quando o conteúdo de uma página for renderizado, ele não oferece garantias. Você ainda precisa considerar como os navegadores se comportam ao renderizar texto que usa uma `font-family` que ainda não está disponível.

Na postagem [Evite texto invisível durante o carregamento da fonte,](/avoid-invisible-text/) você pode ver que o comportamento padrão do navegador não é consistente. No entanto, você pode dizer aos navegadores modernos como deseja que eles se comportem usando [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) .

Semelhante aos comportamentos de tempo limite de fonte existentes que alguns navegadores implementam, `font-display` segmenta a vida útil do download de uma fonte em três períodos principais:

1. O primeiro período é o **período do bloco** da fonte. Durante este período, se a face da fonte não for carregada, qualquer elemento que tentar usá-la deverá renderizar com uma face de fonte fallback invisível. Se a face da fonte for carregada com sucesso durante o período do bloco, a face da fonte será então usada normalmente.
2. O **período de troca de fonte** ocorre imediatamente após o período de bloco de fonte. Durante este período, se a face da fonte não for carregada, qualquer elemento que tentar usá-la deverá renderizar com uma face da fonte substituta. Se a face da fonte for carregada com sucesso durante o período de troca, a face da fonte será então usada normalmente.
3. O **período de falha de fonte** ocorre imediatamente após o período de troca de fonte. Se a face da fonte ainda não tiver sido carregada quando este período começar, ela será marcada como um carregamento com falha, causando o fallback normal da fonte. Caso contrário, a face da fonte é usada normalmente.

Compreender esses períodos significa que você pode usar `font-display` para decidir como sua fonte deve ser renderizada, dependendo de quando foi baixada ou não.

Para trabalhar com a `font-display`, adicione-a às suas regras `@font-face`

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  font-display: auto; /* or block, swap, fallback, optional */
  src: local('Awesome Font'),
       url('/fonts/awesome-l.woff2') format('woff2'), /* will be preloaded */
       url('/fonts/awesome-l.woff') format('woff'),
       url('/fonts/awesome-l.ttf') format('truetype'),
       url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

`font-display` atualmente suporta o seguinte intervalo de valores:

- `auto`
- `block`
- `swap`
- `fallback`
- `optional`

Para obter mais informações sobre o pré-carregamento de fontes e a `font-display`, consulte as seguintes postagens:

- [Evite texto invisível durante o carregamento da fonte](/avoid-invisible-text/)
- [Controle do desempenho da fonte usando a exibição de fontes](https://developers.google.com/web/updates/2016/02/font-display)
- [Evite mudanças de layout e flashes de texto invisível (FOIT) pré-carregando fontes opcionais](/preload-optional-fonts/)

### A API de carregamento de fontes

Usados juntos, `<link rel="preload">` e o CSS `font-display` oferecem um grande controle sobre o carregamento e a renderização de fontes, sem adicionar muito overhead. Mas se você precisar de personalizações adicionais e estiver disposto a incorrer na sobrecarga introduzida pela execução de JavaScript, há outra opção.

A [API Font Loading](https://www.w3.org/TR/css-font-loading/) fornece uma interface de script para definir e manipular as faces das fontes CSS, rastrear o andamento do download e substituir o comportamento padrão do lazyload. Por exemplo, se você tiver certeza de que uma determinada variante de fonte é necessária, você pode defini-la e dizer ao navegador para iniciar uma busca imediata do recurso de fonte:

```javascript
var font = new FontFace("Awesome Font", "url(/fonts/awesome.woff2)", {
  style: 'normal', unicodeRange: 'U+000-5FF', weight: '400'
});

// don't wait for the render tree, initiate an immediate fetch!
font.load().then(function() {
  // apply the font (which may re-render text and cause a page reflow)
  // after the font has finished downloading
  document.fonts.add(font);
  document.body.style.fontFamily = "Awesome Font, serif";

  // OR... by default the content is hidden,
  // and it's rendered after the font is available
  var content = document.getElementById("content");
  content.style.visibility = "visible";

  // OR... apply your own render strategy here...
});
```

Além disso, como você pode verificar o status da fonte (por meio do [`check()`](https://www.w3.org/TR/css-font-loading/#font-face-set-check)) e acompanhar o andamento do download, você também pode definir uma estratégia personalizada para renderizar texto em suas páginas:

- Você pode manter a renderização de todo o texto até que a fonte esteja disponível.
- Você pode implementar um tempo limite personalizado para cada fonte.
- Você pode usar a fonte substituta para desbloquear a renderização e injetar um novo estilo que use a fonte desejada depois que a fonte estiver disponível.

O melhor de tudo é que você também pode misturar e combinar as estratégias acima para diferentes conteúdos na página. Por exemplo, você pode atrasar a renderização do texto em algumas seções até que a fonte esteja disponível, usar uma fonte reserva e, a seguir, renderizar novamente após o término do download da fonte.

{% Aside %} A API de carregamento de fonte [não está disponível em navegadores mais antigos](http://caniuse.com/#feat=font-loading). Considere usar o [polyfill FontLoader](https://github.com/bramstein/fontloader) ou a [biblioteca WebFontloader](https://github.com/typekit/webfontloader) para fornecer funcionalidade semelhante, embora com ainda mais sobrecarga de uma dependência JavaScript adicional. {% endAside %}

### O armazenamento em cache adequado é obrigatório

Os recursos de fonte são, normalmente, recursos estáticos que não veem atualizações frequentes. Como resultado, eles são ideais para uma expiração de idade máxima longa - certifique-se de especificar um [cabeçalho ETag condicional](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#validating-cached-responses-with-etags) e uma [política de controle de cache ideal](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control) para todos os recursos de fonte.

Se o seu aplicativo da web usa um [service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/), disponibilizar recursos de fonte com uma [estratégia de cache primeiro](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-then-network) é apropriado para a maioria dos casos de uso.

Você não deve armazenar fontes usando [`localStorage`](https://developer.mozilla.org/docs/Web/API/Window/localStorage) ou [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API); cada um deles tem seu próprio conjunto de problemas de desempenho. O cache HTTP do navegador oferece o melhor e mais robusto mecanismo para fornecer recursos de fonte ao navegador.

## Lista de verificação de carregamento da WebFont

- **Personalize o carregamento e a renderização de fontes usando `<link rel="preload">`, `font-display` ou a API de carregamento de fontes:** o comportamento de carregamento lento padrão pode resultar em atrasos na renderização de texto. Esses recursos da plataforma da web permitem que você substitua esse comportamento para fontes específicas e especifique a renderização customizada e as estratégias de tempo limite para diferentes conteúdos na página.
- **Especifique a revalidação e as políticas de cache ideais**: as fontes são recursos estáticos que raramente são atualizados. Certifique-se de que seus servidores forneçam um timestamp de idade máxima de longa duração e um token de revalidação para permitir a reutilização eficiente de fontes entre páginas diferentes. Se estiver usando um service worker, uma estratégia de primeiro cache é apropriada.

## Teste automatizado para comportamento de carregamento de WebFont com Lighthouse

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) pode ajudar a automatizar o processo de garantir que você esteja seguindo as melhores práticas de otimização de fontes da web.

As auditorias a seguir podem ajudá-lo a garantir que suas páginas continuem a seguir as práticas recomendadas de otimização de fontes da web ao longo do tempo:

- [Solicitações de chave de pré-carregamento](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/)
- [Usa política de cache ineficiente em ativos estáticos](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/)
- [Todo o texto permanece visível durante o carregamento do WebFont](https://developer.chrome.com/docs/lighthouse/performance/font-display/)
