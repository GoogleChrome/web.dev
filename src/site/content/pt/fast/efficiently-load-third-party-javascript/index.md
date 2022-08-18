---
layout: post
title: Carregar JavaScript de terceiros com eficiência
subhead: Evite as armadilhas comuns de usar scripts de terceiros para melhorar o tempo de carregamento e a experiência do usuário.
authors:
  - mihajlija
date: 2019-08-14
description: |2

  Aprenda como evitar as armadilhas comuns do uso de scripts de terceiros para melhorar o tempo de carregamento e a experiência do usuário.
hero: image/admin/udp7L9LSo5mfI3F0tvNY.jpg
alt: Vista aérea de contêineres.
codelabs: codelab-optimize-third-party-javascript
tags:
  - performance
  - javascript
---

Se um script de terceiros está [retardando](/third-party-javascript/) o carregamento da página, você tem duas opções para melhorar o desempenho:

- Remova-o se não agregar valor ao seu site.

- Otimize o processo de carregamento.

Esta postagem explica como otimizar o processo de carregamento de scripts de terceiros com as seguintes técnicas:

1. Uso do atributo `async` ou `defer` nas tags `<script>`

2. Estabelecimento de conexões iniciais com as origens necessárias

3. Carregamento lento

4. Otimização de como você veicula scripts de terceiros

## Use `async` ou `defer`

Como os [scripts síncronos](/third-party-javascript/) atrasam a construção e a renderização do DOM, você sempre deve carregar scripts de terceiros de forma assíncrona, a menos que o script precise ser executado antes que a página possa ser renderizada.

Os atributos `async` e `defer` informam ao navegador que ele pode continuar analisando o HTML ao carregar o script em segundo plano e, em seguida, executar o script após o carregamento. Dessa forma, os downloads de script não bloqueiam a construção do DOM e a renderização da página. O resultado é que o usuário pode ver a página antes que todos os scripts tenham terminado de carregar.

```html
<script async src="script.js">

<script defer src="script.js">
```

A diferença entre `async` e `defer` é quando eles começam a executar os scripts.

### `async`

Scripts com o atributo `async` são executados na primeira oportunidade depois de concluírem o download e antes do evento de [carregamento da janela.](https://developer.mozilla.org/docs/Web/Events/load) Isso significa que é possível (e provável) que os scripts com `async` não sejam executados na ordem em que aparecem no HTML. Isso também significa que eles podem interromper a construção do DOM se concluírem o download enquanto o analisador ainda está em funcionamento.

{% Img src="image/admin/tCqsJ3E7m4lpKOprXu5B.png", alt="Diagrama do script de bloqueio do analisador com atributo assíncrono", width="800", height="252" %}

### `defer`

Scripts com o atributo `defer` são executados depois que a análise de HTML é completamente concluída, mas antes do evento [`DOMContentLoaded`](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded). `defer` garante que os scripts serão executados na ordem em que aparecem no HTML e não bloquearão o analisador.

{% Img src="image/admin/Eq0mcvDALKibHe15HspN.png", alt="Diagrama de fluxo do analisador com um script com atributo defer", width="800", height="253" %}

- Use `async` se for importante que o script seja executado no início do processo de carregamento.

- Use `defer` para recursos menos críticos. Um reprodutor de vídeo na metade inferior da página, por exemplo.

Usar esses atributos pode acelerar significativamente o carregamento da página. Por exemplo, o [Telegraph adiou recentemente todos os seus scripts](https://medium.com/p/a0a1000be5#4123), incluindo anúncios e análises, e melhorou o tempo de carregamento do anúncio em uma média de quatro segundos.

{% Aside %} Os scripts de análise geralmente são carregados cedo para que você não perca nenhum dado valioso de análise. Felizmente, existem [padrões para inicializar a análise lentamente,](https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/) enquanto retém os dados de carregamento de página iniciais. {% endAside %}

## Estabeleça conexões iniciais com as origens necessárias

Você pode economizar 100–500 ms [estabelecendo conexões antecipadas](/preconnect-and-dns-prefetch/) com origens importantes de terceiros.

Dois tipos de [`<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link) podem ser úteis aqui:

- `preconnect`

- `dns-prefetch`

### `preconnect`

`<link rel="preconnect">` informa ao navegador que sua página pretende estabelecer uma conexão com outra origem e que deseja que o processo seja iniciado o mais rápido possível. Quando a solicitação de um recurso da origem pré-conectada é feita, o download é iniciado imediatamente.

```html
<link rel="preconnect" href="https://cdn.example.com">
```

{% Aside 'caution' %} Faça a pré-conexão apenas a domínios críticos que você usará em breve, porque o navegador fecha qualquer conexão que não seja usada em 10 segundos. A pré-conexão desnecessária pode atrasar outros recursos importantes, portanto, limite o número de domínios pré-conectados e [teste o impacto da pré-conexão](https://andydavies.me/blog/2019/08/07/experimenting-with-link-rel-equals-preconnect-using-custom-script-injection-in-webpagetest/). {% endAside %}

### `dns-prefetch`

`<link rel="dns-prefetch>` lida com um pequeno subconjunto do que é tratado por `<link rel="preconnect">`. Estabelecer uma conexão envolve a pesquisa de DNS, o aperto de mãos de TCP e, para origens seguras, negociações de TLS. `dns-prefetch` instrui o navegador a resolver apenas o DNS de um domínio específico antes de ser explicitamente chamado.

A dica `preconnect` é melhor usada apenas para as conexões mais críticas. Para domínios de terceiros menos críticos, use `<link rel=dns-prefetch>`.

```html
<link rel="dns-prefetch" href="http://example.com">
```

O [suporte do navegador para `dns-prefetch`](https://caniuse.com/#search=dns-prefetch) é um pouco diferente do suporte para [`preconnect`](https://caniuse.com/#search=preconnect), então `dns-prefetch` pode servir como um substituto para navegadores que não oferecem suporte para `preconnect`. Use tags de link separadas para implementar isso com segurança:

```html
<link rel="preconnect" href="http://example.com">
<link rel="dns-prefetch" href="http://example.com">
```

## Recursos de terceiros de carregamento lento

Recursos de terceiros incorporados podem ser um grande contribuidor para diminuir a velocidade da página quando são mal construídos. Se não forem essenciais ou estiverem na parte inferior da página (ou seja, se os usuários tiverem que rolar para visualizá-los), o carregamento lento é uma boa maneira de melhorar a velocidade da página e as métricas de pintura. Dessa forma, os usuários obterão o conteúdo da página principal com mais rapidez e terão uma experiência melhor.

<figure data-float="left">{% Img src="image/admin/uzPZzkgzfrv2Oy3UQPrN.png", alt="Um diagrama de uma página da web mostrado em um dispositivo móvel com conteúdo rolável que se estende além da tela. O conteúdo na parte inferior está dessaturado porque não foi carregado ainda.", width="366", height="438" %}</figure>

Uma abordagem eficaz é carregar lentamente o conteúdo de terceiros após o carregamento do conteúdo da página principal. Os anúncios são um bom candidato para essa abordagem.

Os anúncios são uma importante fonte de renda para muitos sites, mas os usuários vêm pelo conteúdo. Ao carregar lentamente os anúncios e entregar o conteúdo principal com mais rapidez, você pode aumentar a porcentagem geral de visibilidade de um anúncio. Por exemplo, o MediaVine mudou para [anúncios de carregamento lento](https://www.mediavine.com/lazy-loading-ads-mediavine-ads-load-200-faster/) e observou uma melhoria de 200% na velocidade de carregamento da página. A DoubleClick tem orientações sobre como fazer o carregamento lento de anúncios em sua [documentação oficial](https://support.google.com/dfp_premium/answer/4578089#lazyloading).

Uma abordagem alternativa é carregar conteúdo de terceiros apenas quando os usuários rolar para baixo até essa seção da página.

[Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/) é uma API do navegador que detecta com eficiência quando um elemento entra ou sai da janela de visualização e pode ser usada para implementar essa técnica. [lazysizes](/use-lazysizes-to-lazyload-images/) é uma biblioteca de JavaScript famosa para imagens de carregamento lento e [`iframes`](http://afarkas.github.io/lazysizes/#examples). Suporta incorporações do YouTube e [widgets](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/unveilhooks). Também tem [suporte opcional](https://github.com/aFarkas/lazysizes/blob/097a9878817dd17be3366633e555f3929a7eaaf1/src/lazysizes-intersection.js) para IntersectionObserver.

{% Aside 'caution' %} Tenha cuidado ao carregar lentamente recursos com JavaScript. Se o JavaScript falhar ao carregar, talvez devido a condições de rede instáveis, seus recursos não serão carregados. {% endAside %}

Usar o atributo [`loading` para imagens de carregamento lento e iframes](/browser-level-image-lazy-loading/) é uma ótima alternativa às técnicas de JavaScript e recentemente se tornou disponível no Chrome 76!

## Otimize a forma como você veicula scripts de terceiros

### Hospedagem de CDN de terceiros

É comum que fornecedores terceirizados forneçam URLs de arquivos JavaScript que eles hospedam, geralmente em uma [rede de distribuição de conteúdo (CDN)](https://en.wikipedia.org/wiki/Content_delivery_network). Os benefícios dessa abordagem são que você pode começar rapidamente. Basta copiar e colar a URL, não há sobrecarga de manutenção. O fornecedor terceirizado cuida da configuração do servidor e das atualizações de script.

Mas, como eles não são da mesma origem do restante de seus recursos, o carregamento de arquivos de um CDN público tem um custo de rede. O navegador precisa realizar uma pesquisa de DNS, estabelecer uma nova conexão HTTP e, em origens seguras, realizar um aperto de mãos de SSL com o servidor do fornecedor.

Quando você usa arquivos de servidores de terceiros, raramente tem controle sobre o cache. Depender da estratégia de cache de outra pessoa pode fazer com que os scripts sejam recuperados desnecessariamente na rede com muita frequência.

### Scripts de terceiros para hospedagem própria

A auto-hospedagem de scripts de terceiros é uma opção que oferece mais controle sobre o processo de carregamento de um script. Ao hospedar por conta própria, você pode:

- Reduzir a consulta de DNS e os tempos de ida e volta.
- Melhorar os cabeçalhos de [cache HTTP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching).
- Aproveitar as vantagens do [push de servidor HTTP/2](/performance-http2/).

Por exemplo, Casper conseguiu [reduzir em 1,7 segundo o tempo de carregamento](https://medium.com/caspertechteam/we-shaved-1-7-seconds-off-casper-com-by-self-hosting-optimizely-2704bcbff8ec) ao hospedar por conta própria um script de teste A/B.

A auto-hospedagem vem com uma grande desvantagem: os scripts podem ficar desatualizados e não receberão atualizações automáticas quando houver uma alteração de API ou uma correção de segurança.

{% Aside 'caution' %}

Atualizar scripts manualmente pode adicionar muita sobrecarga ao seu processo de desenvolvimento e você pode perder atualizações importantes. Se não estiver usando a hospedagem de CDN para atender a todos os recursos, você também estará perdendo o [cache de borda](https://www.cloudflare.com/learning/cdn/glossary/edge-server/) e terá que otimizar a compactação do seu servidor. {% endAside%}

### Use trabalhos de serviço para armazenar scripts de servidores de terceiros

Uma alternativa à auto-hospedagem que permite maior controle sobre o armazenamento em cache e, ao mesmo tempo, obtém os benefícios de CDN de terceiros é [usar trabalhos de serviço para armazenar scripts de servidores de terceiros](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations). Isso dá a você controle sobre a frequência com que os scripts são buscados novamente na rede e torna possível criar uma estratégia de carregamento que limita as solicitações de recursos não essenciais de terceiros, até que a página alcance um momento-chave do usuário. Usar a `preconnect`, conexão para estabelecer conexões antecipadas, neste caso, também pode reduzir os custos de rede até certo ponto.
