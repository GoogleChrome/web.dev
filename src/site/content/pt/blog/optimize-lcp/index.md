---
title: Otimização da Largest Contentful Paint
subhead: Como renderizar seu conteúdo principal mais rápido.
authors:
  - houssein
date: 2020-05-05
updated: 2020-08-20
hero: image/admin/qqTKhxUFqdLXnST2OFWN.jpg
alt: Otimize o banner LCP
description: A métrica Largest Contentful Paint (LCP) pode ser usada para determinar quando o conteúdo principal da página terminou a renderização na tela. Aprenda como otimizar a LCP ao melhorar tempos de resposta lentos do servidor, tempos de carregamento de recursos e renderização no lado do cliente.
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='1073' %}

<blockquote>
  <p>Não consigo ver nenhum conteúdo útil! Por que demora tanto para carregar? 😖</p>
</blockquote>

Um fator que contribui para uma experiência ruim do usuário é quanto tempo leva para um usuário ver qualquer conteúdo renderizado na tela. A métrica [First Contentful Paint](/fcp) - FCP (primeira renderização de conteúdo) mede quanto tempo leva para o conteúdo DOM inicial ser renderizado, mas não captura quanto tempo levou para o conteúdo maior (geralmente mais significativo) na página ser renderizado.

[Largest Contentful Paint](/lcp) - LCP (maior renderização de conteúdo) é uma métrica [Core Web Vitals](/vitals/) e mede quando o maior elemento de conteúdo na janela de visualização se torna visível. Ela pode ser usada para determinar quando o conteúdo principal da página terminou de ser renderizado na tela.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9trpfS9wruEPGekHqBdn.svg", alt="Bons valores de LCP são 2,5 segundos, valores baixos são maiores que 4,0 segundos e qualquer coisa entre precisa de melhorias", width="384", height="96" %}
</picture>


As causas mais comuns de uma LCP ruim são:

- [Tempos de resposta lentos do servidor](#slow-servers)
- [JavaScript e CSS que bloqueiam a renderização](#render-blocking-resources)
- [Tempos lentos de carregamento de recursos](#slow-resource-load-times)
- [Renderização do lado do cliente](#client-side-rendering)

## Tempos de resposta lentos do servidor {: #slow-servers }

Quanto mais tempo leva para um navegador receber conteúdo do servidor, mais tempo leva para processar qualquer coisa na tela. Um tempo de resposta mais rápido do servidor melhora diretamente cada métrica de carregamento de página, incluindo a LCP.

Antes de mais nada, melhore como e onde seu servidor lida com seu conteúdo. Use a métrica [**Time to First Byte**](/ttfb/) - TTFB (tempo até o primeiro byte) para medir os tempos de resposta do servidor. Você pode melhorar sua TTFB de várias maneiras:

- Otimizando seu servidor
- Direcionando os usuários para um CDN próximo
- Usando ativos de cache
- Servindo páginas HTML usando cache-first
- Estabelecendo conexões de terceiros antecipadamente
- Usando trocas assinadas

### Otimizando seu servidor

Você está realizando consultas caras que levam um tempo significativo para que sejam concluídas pelo seu servidor? Ou existem outras operações complexas acontecendo no lado do servidor que atrasam o processo de retorno do conteúdo da página? Analisar e melhorar a eficiência do seu código do lado do servidor irá melhorar diretamente o tempo que leva para o navegador receber os dados.

Em vez de apenas servir imediatamente uma página estática numa solicitação do navegador, muitos frameworks lado-servidor precisam criar a página web dinamicamente. Em outras palavras, em vez de apenas enviar um arquivo HTML completo que já está pronto quando o navegador o solicita, os frameworks precisam executar a lógica para construir a página. Isto pode ser devido a resultados pendentes de uma consulta de banco de dados ou até mesmo porque os componentes precisam ser transformados em marcação HTML por um framework de IU (como o [React](https://reactjs.org/docs/react-dom-server.html)). Muitos frameworks web que rodam no servidor possuem diretrizes de desempenho que você pode aplicar para acelerar esse processo.

{% Aside %} Dê uma olhada em [Conserte um servidor sobrecarregado](/overloaded-server/) para mais dicas. {% endAside %}

### Direcionando os usuários para um CDN próximo

Uma Content Delivery Network (CDN) é uma rede de servidores distribuídos em diversos locais diferentes. Se o conteúdo da sua página da web estiver hospedado num único servidor, o carregamento do seu site será mais lento para os usuários que estão geograficamente mais distantes já que as solicitações do navegador precisam literalmente dar uma volta ao mundo. Considere usar um CDN para garantir que seus usuários nunca tenham que esperar por solicitações de rede realizadas em servidores distantes.

### Usando ativos de cache

Se o seu HTML é estático e não precisa ser alterado a cada solicitação, o armazenamento em cache pode evitar que ele seja recriado desnecessariamente. Ao armazenar uma cópia do HTML gerado no disco, um cache do lado do servidor poderá reduzir a TTFB e minimizar o uso de recursos.

Há muitas alternativas diferentes de usar cache no servidor; a escolha depende do seu toolchain:

- Configuração de proxies reversos ([Varnish](https://varnish-cache.org/), [nginx](https://www.nginx.com/)) para servir conteúdo em cache ou atuar como um servidor de cache quando instalado na frente de um servidor de aplicação
- Configuração e gerenciamento do comportamento do cache do seu provedor de nuvem ([Firebase](https://firebase.google.com/docs/hosting/manage-cache), [AWS](https://aws.amazon.com/caching/), [Azure)](https://docs.microsoft.com/azure/architecture/best-practices/caching)
- Uso de um CDN que forneça servidores de edge para que seu conteúdo seja armazenado em cache e fique mais perto de seus usuários

### Servindo páginas HTML usando cache-first

Quando instalado, um [service worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) é executado em segundo plano do navegador e pode interceptar solicitações do servidor. Este nível de controle de cache programático permite armazenar em cache parte ou todo o conteúdo de uma página HTML e apenas atualizar o cache quando o conteúdo for alterado.

O gráfico a seguir mostra como as distribuições de LCP foram reduzidas em um site usando este padrão:

<figure>{% Img src="image/admin/uB0Sm56R88MRF16voQ1k.png", alt="Distribuições de Largest Contentful Paint antes e depois do uso de cache HTML", width="800", height="495" %} <figcaption> Distribuição de Largest Contentful Paint para carregamento de páginas com e sem service worker - <a href="https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/">philipwalton.com</a> </figcaption></figure>

O gráfico mostra a distribuição de LCP de um único site nos últimos 28 dias, segmentado pelo estado do service worker. Observe como aumentou o número de carregamentos de página com LCP mais rápido depois que o serviço de páginas HTML usando a estratégia cache-first foi introduzida no service worker (parte azul do gráfico).

{% Aside %} Para saber mais sobre as técnicas para veicular páginas HTML completas ou parciais usando cache-first, dê uma olhada em [Payloads HTML menores com Service Workers](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/) {% endAside %}

### Estabelecendo conexões de terceiros antecipadamente

As solicitações do servidor para origens de terceiros também podem afetar a LCP, especialmente se forem necessárias para exibir conteúdo crítico na página. Use `rel="preconnect"` para informar ao navegador que sua página pretende estabelecer uma conexão o mais rápido possível.

```html
<link rel="preconnect" href="https://example.com" />
```

Você também pode usar `dns-prefetch` para resolver consultas DNS mais rapidamente.

```html
<link rel="dns-prefetch" href="https://example.com" />
```

Embora as duas dicas funcionem de maneira diferente, considere o uso de `dns-prefetch` como um substituto para navegadores que não oferecem suporte à `preconnect`.

```html
<head>
  …
  <link rel="preconnect" href="https://example.com" />
  <link rel="dns-prefetch" href="https://example.com" />
</head>
```

{% Aside %} Saiba mais lendo [Estabeleça conexões de rede antecipadamente para melhorar a velocidade percebida da página](/preconnect-and-dns-prefetch/) {% endAside %}

### Usando trocas assinadas (SXGs)

As [trocas assinadas (Signed Exchanged - SXG)](/signed-exchanges) são um mecanismo de entrega que permite experiências mais rápidas do usuário ao fornecer conteúdo em um formato facilmente armazenável em cache. Especificamente, uma [Pesquisa Google](https://developers.google.com/search/docs/advanced/experience/signed-exchange) será armazenada em cache e, às vezes, fará uma busca antecipada de SXGs. Para sites que recebem uma grande parte de seu tráfego a partir das Pesquisas Google, os SXGs podem ser uma ferramenta importante para melhorar a LCP. Para mais informações, veja [Trocas Assinadas](/signed-exchanges).

## JavaScript e CSS que bloqueiam a renderização {: #render-blocking-resources }

Antes que um navegador possa renderizar qualquer conteúdo, ele precisa transformar a marcação HTML numa árvore DOM. O parser HTML irá pausar se encontrar alguma folha de estilo externa (`<link rel="stylesheet">`) ou tags JavaScript síncronas (`<script src="main.js">`).

Scripts e folhas de estilo são recursos que realizam bloqueio da renderização, que por sua vez atrasam a FCP e, conseqüentemente, a LCP. Adie qualquer JavaScript e CSS que não seja crítico para acelerar o carregamento do conteúdo principal de sua página web.

### Reduzindo o tempo de bloqueio de CSS

Certifique-se de que apenas a quantidade mínima de CSS necessária esteja bloqueando a renderização em seu site aplicando os procedimentos a seguir:

- Minificação de CSS
- Adiando o CSS que não for crítico
- Embutindo na página o CSS crítico

### Minificação de CSS

Para facilitar a legibilidade, os arquivos CSS podem conter caracteres como espaçamento, indentação ou comentários. Todos esses caracteres são desnecessários para o navegador e minimizar esses arquivos garantirá que eles sejam removidos. Em última análise, reduzir a quantidade de CSS de bloqueio sempre melhorará o tempo que leva para renderizar totalmente o conteúdo principal da página (LCP).

Se você usar um empacotador de módulos ou ferramenta de build, inclua um plug-in apropriado para minificar os arquivos CSS em cada build:

- Para webpack: [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)
- Para Gulp: [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- Para Rollup: [rollup-plugin-css-porter](https://www.npmjs.com/package/rollup-plugin-css-porter)

<figure>
  {% Img
    src="image/admin/vQXSKrY1Eq3CKkNbu9Td.png",
    alt="Exemplo de melhoria de LCP: antes e depois de minificar CSS",
    width="800",
    height="139"
  %}
  <figcaption>
    Exemplo de melhoria de LCP: antes e depois de minificar CSS
  </figcaption>
</figure>

{% Aside %} Para mais detalhes, consulte o guia [Minificação de CSS.](/minify-css/) {% endAside %}

### Adiando o CSS que não for crítico

Use a aba [Coverage](https://developer.chrome.com/docs/devtools/coverage/) no Chrome DevTools para localizar qualquer CSS não utilizado em sua página web.

{% Img src="image/admin/wjS4NrU5EsJeCuvK0zhn.png", alt="Aba Coverage no Chrome DevTools", width="800", height="559" %}

Para otimizar:

- Remova qualquer CSS não utilizado inteiramente ou mova-o para outra folha de estilo, se usado em uma página separada do seu site.
- Para qualquer CSS não necessário para renderização inicial, use [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md) para carregar arquivos de forma assíncrona, o que alavanca `rel="preload"` e `onload`.

```html
<link rel="preload" href="stylesheet.css" as="style" onload="this.rel='stylesheet'">
```

<figure>{% Img src="image/admin/2fcwrkXQRQrM8w1qyy3P.png", alt="Exemplo de melhoria da LCP: antes e depois de adiar CSS não crítico", width="800", height="139" %} <figcaption> Exemplo de melhoria da LCP: antes e depois de adiar CSS não crítico </figcaption></figure>

{% Aside %} Para mais detalhes, consulte o guia [Adiamento de CSS não crítico.](/defer-non-critical-css/) {% endAside %}

### Embutindo na página o CSS crítico

Embuta qualquer CSS essencial que é usado para conteúdo acima da dobra incluindo-o diretamente no `<head>`.

<figure>
  {% Img
    src="image/admin/m0n0JsLpH9JsNnXywSwz.png",
    alt="Critical CSS inlined",
    width="800", height="325"
  %}
  <figcaption>CSS crítico embutido</figcaption>
</figure>

Embutir estilos importantes elimina a necessidade de fazer uma solicitação de ida e volta para buscar CSS crítico. Adiar o restante minimiza o tempo de bloqueio do CSS.

Se você não pode adicionar manualmente estilos embutidos ao seu site, use uma biblioteca para automatizar o processo. Alguns exemplos:

- [Critical](https://github.com/addyosmani/critical) , [CriticalCSS](https://github.com/filamentgroup/criticalCSS) e [Penthouse](https://github.com/pocketjoso/penthouse) são pacotes que extraem e embutem CSS acima da dobra
- [Critters](https://github.com/GoogleChromeLabs/critters) é um plugin webpack que embute CSS crítico e carrega o resto de forma lazy

<figure>
  {% Img
    src="image/admin/L8sc51bd3ckxwnUfczC4.png",
    alt="Exemplo de melhoria da LCP: antes e depois de embutir CSS crítico",
    width="800",
    height="175"
  %}
  <figcaption>
    Exemplo de melhoria da LCP: antes e depois de embutir CSS crítico
  </figcaption>
</figure>

{% Aside %} Dê uma olhada no guia [Extração de CSS crítico](/extract-critical-css/) para saber mais. {% endAside %}

### Reduzindo o tempo de bloqueio de JavaScript

Baixe e forneça a quantidade mínima de JavaScript necessária aos usuários. Reduzir a quantidade de JavaScript bloqueante resulta numa renderização mais rápida e, conseqüentemente, numa LCP melhor.

Isto pode ser feito otimizando seus scripts de maneiras diferentes:

- [Minificando e comprimindo arquivos JavaScript](/reduce-network-payloads-using-text-compression/)
- [Adiando JavaScript não utilizado](/reduce-javascript-payloads-with-code-splitting/)
- [Minimizando polyfills não usados](/serve-modern-code-to-modern-browsers/)

{% Aside %} O guia [Otimize a First Input Delay](/optimize-fid/) explora todas as técnicas necessárias para reduzir o tempo de bloqueio do JavaScript em mais detalhes. {% endAside %}

## Tempos de carregamento de recursos lentos {: #slow-resource-load-times }

Embora um aumento no tempo de bloqueio do CSS ou JavaScript resulte diretamente em pior desempenho, o tempo que leva para carregar vários outros tipos de recursos também pode afetar os tempos de renderização. Os tipos de elementos que afetam a LCP são:

- Elementos `<img>`
- `<image>` dentro de um elemento `<svg>`
- `<video>` (a imagem [poster](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster) é usada para medir a LCP)
- Um elemento com uma imagem de plano de fundo carregada por meio da [`url()`](https://developer.mozilla.org/docs/Web/CSS/url()) (em oposição a um gradiente CSS)
- [Elementos de nível de bloco](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements) contendo nós de texto ou outros elementos de texto inline

O tempo que leva para carregar esses elementos, se renderizados acima da dobra, terá um efeito direto na LCP. Seguem algumas técnicas para garantir que esses arquivos sejam carregados o mais rápido possível:

- Otimização e compressão de imagens
- Pré-carregamento de recursos importantes
- Compactação de arquivos de texto
- Entrega de diferentes ativos com base na conexão de rede (serviço adaptável)
- Ativos de cache usando um service worker

### Otimização e compressão de imagens

Para muitos sites, as imagens são o maior elemento visualizado quando a página termina de carregar. Imagens de herói, carrosséis grandes ou imagens de banner são exemplos comuns.

<figure>
  {% Img
    src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/unWra6cq0hPJJJT7Y3ye.png",
    alt="",
    width="459",
    height="925"
  %}
  <figcaption>Imagem como o maior elemento da página: <a href="https://design.google/">design.google</a></figcaption>
</figure>

Melhorar o tempo que leva para carregar e renderizar esses tipos de imagens irá acelerar diretamente a LCP. Para isto:

- Considere a possibilidade de não usar uma imagem. Se não for relevante para o conteúdo, remova-a.
- Comprima imagens (com [Imagemin](/use-imagemin-to-compress-images) por exemplo)
- Converta imagens em formatos mais recentes (JPEG 2000, JPEG XR ou WebP)
- Use imagens responsivas
- Considere usar um CDN de imagens

{% Aside %} Dê uma olhada em [Otimize suas imagens](/fast/#optimize-your-images) para guias e recursos que explicam todas essas técnicas em detalhes. {% endAside %}

### Pré-carregamento de recursos importantes

Às vezes, recursos importantes que são declarados ou usados num determinado arquivo CSS ou JavaScript podem ser baixados mais tarde do que você gostaria, como uma fonte escondida num dos muitos arquivos CSS de uma aplicação.

Se você sabe que um determinado recurso deve ser priorizado, use `<link rel="preload">` para baixá-lo mais cedo. [Muitos tipos de recursos](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded) podem ser pré-carregados, mas primeiro você deve se concentrar no [pré-carregamento de ativos essenciais](/preload-critical-assets/), como fontes, imagens ou vídeos acima da dobra e CSS ou JavaScript de importância crítica.

```html
<link rel="preload" as="script" href="script.js" />
<link rel="preload" as="style" href="style.css" />
<link rel="preload" as="image" href="img.png" />
<link rel="preload" as="video" href="vid.webm" type="video/webm" />
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

Desde o Chrome 73, o pré-carregamento pode ser usado junto com [imagens responsivas](/preload-responsive-images/) para combinar os dois padrões e obter um carregamento muito mais rápido da imagem.

```html
<link
  rel="preload"
  as="image"
  href="wolf.jpg"
  imagesrcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w"
  imagesizes="50vw"
/>
```

### Compactação de arquivos de texto

Algoritmos de compactação, como [Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) e [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html), podem reduzir significativamente o tamanho dos arquivos de texto (HTML, CSS, JavaScript) à medida que são transferidos entre o servidor e o navegador. Gzip é efetivamente suportado em todos os navegadores e Brotli, que garante resultados de compressão ainda melhores, [pode ser usado em quase todos os navegadores mais recentes](https://caniuse.com/#feat=brotli).

Comprimir seus recursos minimizará seu tamanho de entrega, melhorando o tempo de carregamento e consequentemente a LCP.

1. Primeiro, verifique se o seu servidor já compacta os arquivos automaticamente. A maioria das plataformas de hospedagem, CDNs e servidores proxy reverso já faz compactação por default ou permite que você os configure facilmente para isto.
2. Se você precisar modificar seu servidor para compactar arquivos, considere o uso de Brotli em vez de gzip, pois ele pode fornecer melhores taxas de compactação.
3. Depois de escolher um algoritmo de compactação para usar, compacte os ativos durante o processo de build, em vez de durante o processo em que eles são solicitados pelo navegador. Isto minimiza a sobrecarga do servidor e evita atrasos quando as solicitações forem feitas, especialmente quando estiver usando altas taxas de compactação.

<figure>
  {% Img
    src="image/admin/Ckh2Jjkoh7ojLj5Wxeqc.png",
    alt="Exemplo de melhoria de LCP: antes e depois da compressão Brotli",
    width="800",
    height="139"
  %}
  <figcaption>
    Exemplo de melhoria de LCP: antes e depois da compressão Brotli
  </figcaption>
</figure>

{% Aside %} Para mais detalhes, consulte o guia [Minificação e compactação de payloads de rede.](/reduce-network-payloads-using-text-compression/) {% endAside %}

### Serviço adaptável

Ao carregar recursos que constituem o conteúdo principal de uma página, pode ser eficaz buscar condicionalmente diferentes ativos, dependendo do dispositivo do usuário ou das condições da rede. Isto pode ser feito usando as APIs [Network Information](https://wicg.github.io/netinfo/), [Device Memory](https://www.w3.org/TR/device-memory/) e  [HardwareConcurrency](https://html.spec.whatwg.org/multipage/workers.html#navigator.hardwareconcurrency).

Se você tiver grandes ativos que são críticos para a renderização inicial, você pode usar diferentes variações do mesmo recurso, dependendo da conexão ou dispositivo do usuário. Por exemplo, você pode exibir uma imagem em vez de um vídeo para qualquer velocidade de conexão inferior a 4G:

```js
if (navigator.connection && navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // Load video
  } else {
    // Load image
  }
}
```

Uma lista de propriedades úteis que você pode usar:

- `navigator.connection.effectiveType`: tipo de conexão efetiva
- `navigator.connection.saveData`: salvamento de dados ativado/desativado
- `navigator.hardwareConcurrency`: contagem de núcleos de CPU
- `navigator.deviceMemory` : memória do dispositivo

{% Aside %} Para mais informações, consulte o guia [Serviço adaptável com base na qualidade da rede](/adaptive-serving-based-on-network-quality/). {% endAside %}

### Ativos de cache usando um service worker

Os service workers podem ser usados para muitas tarefas úteis, incluindo a entrega de respostas HTML menores, conforme mencionado anteriormente neste artigo. Eles também podem ser usados para armazenar em cache qualquer recurso estático que possa ser servido ao navegador em vez de ser transferido pela rede em solicitações repetidas.

O pré-cache de recursos críticos usando um service worker pode reduzir seus tempos de carregamento significativamente, especialmente para usuários que recarregam a página web com uma conexão mais fraca (ou mesmo a acessam offline). Bibliotecas como a [Workbox](https://developer.chrome.com/docs/workbox/) podem deixar o processo de atualização de ativos pré-armazenados mais fácil do que escrever um service worker personalizado para lidar com isso você mesmo.

{% Aside %} Dê uma olhada em [Confiabilidade da rede](/reliable/) para aprender mais sobre service workers e o Workbox. {% endAside %}

## Renderização lado-cliente {: #client-side-rendering }

Muitos sites usam lógica JavaScript do lado do cliente para renderizar páginas diretamente no navegador. Frameworks e bibliotecas, como [React](https://reactjs.org/), [Angular](https://angular.io/) e [Vue](https://vuejs.org/), facilitaram a construção de aplicações de página única (SLA) que lidam com diferentes facetas de uma página web inteiramente no cliente, e não no servidor.

Se você estiver construindo um site que é renderizado principalmente no cliente, deve ser cauteloso quanto ao efeito que isto pode ter na LCP se for usado um grande pacote JavaScript. Se não houver otimizações para evitá-lo, os usuários poderão não conseguir ver ou interagir com o conteúdo da página até que todo o JavaScript crítico tenha terminado de baixar e tenha executado.

Ao construir um site renderizado do lado do cliente, considere a realização das seguintes otimizações:

- Minimizar o JavaScript crítico
- Usar renderização lado-servidor
- Usar pré-renderização

### Minimizar o JavaScript crítico

Se o conteúdo do seu site só se torna visível ou permite interações depois que uma certa quantidade de JavaScript é baixada, torna-se ainda mais importante reduzir o tamanho do seu pacote o máximo possível. Isto pode ser feito através das seguintes estratégias:

- Minificando JavaScript
- Adiando JavaScript não utilizado
- Minimizando polyfills não usados

Volte para a seção [Redução do tempo de bloqueio do JavaScript](#reduce-javascript-blocking-time) para ler mais sobre essas otimizações.

### Usar renderização lado-servidor

Minimizar a quantidade de JavaScript deve sempre ser a primeira coisa a se concentrar para sites que são principalmente renderizados pelo cliente. No entanto, você também deve considerar a combinação de uma experiência de renderização no servidor para melhorar a LCP tanto quanto for possível.

Esse conceito funciona usando o servidor para renderizar o aplicativo em HTML, onde o cliente depois "[hidrata](https://www.gatsbyjs.org/docs/react-hydration/)" todo o JavaScript e os dados necessários no mesmo conteúdo DOM. Isto pode melhorar a LCP, garantindo que o conteúdo principal da página seja renderizado primeiro no servidor, e não apenas no cliente, mas existem algumas desvantagens:

- Manter o mesmo aplicativo renderizado por JavaScript no servidor e no cliente pode aumentar a sua complexidade.
- Executar JavaScript para renderizar um arquivo HTML no servidor sempre aumentará os tempos de resposta do servidor (TTFB) em comparação com apenas servir páginas estáticas do servidor.
- Uma página renderizada pelo servidor pode parecer que é capaz de interagir, mas não será capaz de responder a nenhuma entrada do usuário até que todo o JavaScript do lado do cliente tenha sido executado. Resumindo, isto pode piorar a métrica [**Time to Interactive**](/tti/) (TTI).

### Usar pré-renderização

A pré-renderização é uma técnica separada que é menos complexa do que a renderização do lado do servidor e também fornece uma maneira de melhorar a LCP na sua aplicação. Um navegador sem cabeça (headless), que é um navegador sem interface de usuário, é usado para gerar arquivos HTML estáticos de cada rota durante o tempo de build. Esses arquivos podem ser enviados junto com os pacotes JavaScript necessários para a aplicação.

Com a pré-renderização, a TTI ainda é impactada negativamente, mas os tempos de resposta do servidor não são tão afetados como seriam com uma solução de renderização lado-servidor que renderiza dinamicamente cada página somente depois de solicitada.

<figure>
  {% Img
    src="image/admin/sm9s16UHfh8a5MDEWjxa.png",
    alt="Exemplo de melhoria de LCP: antes e depois da pré-renderização",
    width="800",
    height="139"
  %}
  <figcaption>
    Exemplo de melhoria de LCP: antes e depois da pré-renderização
  </figcaption>
</figure>

{% Aside %} Para um mergulho mais profundo em diferentes arquiteturas de renderização de servidor, dê uma olhada em [Renderização na web](/rendering-on-the-web/). {% endAside %}

## Ferramentas de desenvolvimento

Uma série de ferramentas estão disponíveis para medir e depurar LCP:

- O [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/) inclui suporte para medição de LCP em ambiente de laboratório.

    {% Img src="image/admin/Sar3Pa7TDe9ibny6sfq4.jpg", alt="Lighthouse 6.0", width="800", height="309" %}

- A seção de **intervalos** do painel [Performance](https://developer.chrome.com/docs/devtools/evaluate-performance/) no Chrome DevTools inclui um marcador de LCP e mostra qual elemento está associado com a LCP quando você passar o mouse sobre o campo **Related Node**.

    {% Img src="image/admin/sxczQPKH0cvMBsNCx5uH.png", alt="LCP no Chrome DevTools", width="800", height="509" %}

- O [Relatório de Experiência do Usuário Chrome](https://developer.chrome.com/docs/crux/) fornece valores de LCP do mundo real agregados no nível de origem

*Com agradecimentos a Philip Walton, Katie Hempenius, Kayce Basques e Ilya Grigorik por suas análises.*
