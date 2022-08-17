---
layout: post
title: Otimizando Web Vitals usando o Lighthouse
subhead: Encontrando oportunidades para melhorar a experiência do usuário com as ferramentas da web do Chrome.
authors:
  - addyosmani
description: |2

  Hoje, abordaremos novos recursos de ferramentas no Lighthouse, PageSpeed e DevTools para ajudar a identificar como seu site pode melhorar no Web Vitals.
date: 2021-05-11
hero: image/1L2RBhCLSnXjCnSlevaDjy3vba73/6GPqQDYxZnVq8qF6DJ02.jpeg
alt: Um farol iluminando o mar
tags:
  - blog
  - performance
  - web-vitals
---

Hoje, abordaremos novos recursos de ferramentas no Lighthouse, PageSpeed e DevTools para ajudar a identificar como seu site pode melhorar no [Web Vitals](/vitals) .

Para relembrar as ferramentas, o [Lighthouse](https://github.com/GoogleChrome/lighthouse) é uma ferramenta automatizada de código aberto para melhorar a qualidade das páginas da web. Você pode encontrá-lo no pacote [Chrome DevTools](https://developer.chrome.com/docs/devtools/) de ferramentas de depuração e executá-lo em qualquer página da web, pública ou que exija autenticação. Você também pode encontrar o Lighthouse em [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fstore.google.com) , [CI](https://github.com/GoogleChrome/lighthouse-ci) e [WebPageTest](https://www.webpagetest.org/easy) .

O Lighthouse 7.x inclui novos recursos, como capturas de tela do elemento, para facilitar a inspeção visual de partes de sua IU que afetam as métricas de experiência do usuário (por exemplo, quais nós estão contribuindo para a mudança de layout).

<figure><video muted autoplay loop><source type="video/mp4" src="https://storage.googleapis.com/web-dev-uploads/video/1L2RBhCLSnXjCnSlevaDjy3vba73/3G0x4Z1dmOcsusG7j1LE.mp4" width="1920" height="1080"></source></video></figure>

Também fornecemos suporte para capturas de tela de elemento no PageSpeed Insights, permitindo uma maneira de identificar problemas com mais facilidade para execuções únicas de desempenho de páginas.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/mfkWFzyfO9XlJLYS80DE.png", alt = "Capturas de tela do elemento destacando o nó DOM contribuindo para a mudança de layout na página", width="800", height="483" %}</figure>

## Medição das Core Web Vitals

O Lighthouse pode medir [sinteticamente](/vitals-measurement-getting-started/#measuring-web-vitals-using-lab-data) as [métricas do Core Web Vitals,](/vitals/) incluindo [Largest Contentful Paint (LCP), ou Maior Renderização de Conteúdo](/lcp/), [Cumulative Layout Shift (CLS), ou Mudança Cumulativa de Layout](/cls/) e [Total Blocking Time (TBT), ou Tempo Total de Bloqueio](/tbt/) (um proxy de laboratório para o [First Input Delay (FID), ou Atraso da Primeira Entrada](/fid/) ). Essas métricas refletem o carregamento, a estabilidade do layout e a prontidão da interação. Outras métricas, como o [First Contentful Paint (FCP), ou Primeira Renderização de Conteúdo](/fcp/) destacado no [futuro do Core Web Vitals (CWV)](https://developer.chrome.com/devsummit/sessions/future-of-core-web-vitals/), também estão lá.

A seção "Métricas" do relatório Lighthouse inclui versões de laboratório dessas métricas. Você pode usar isso como uma visão resumida de quais aspectos da experiência do usuário requerem sua atenção.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/VkLhdNb3fxtfttFZ1S6E.png", alt = "Métricas de desempenho do Lighthouse", width = "800", height = "485"%}</figure>

{% Aside %} O Lighthouse se concentra em medir a experiência do usuário durante o carregamento da página inicial em um ambiente de laboratório, emulando um telefone lento ou computador desktop. Se houver algum comportamento em sua página que possa causar mudanças de layout ou longas tarefas de JavaScript após o carregamento da página, as métricas do laboratório não refletirão isso. Experimente o painel DevTools Performance, o [Search Console](https://search.google.com/search-console/about) , a [extensão Web Vitals](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en) ou [RUM](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data) para uma visualização pós-carregamento das métricas. {% endAside %}

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/PLMoiQpi12jT7BJUvlOJ.png", alt = "trilha Web Vitals no painel performance do devtools", width = "800", height = "476"%}<figcaption> A nova opção Web Vitals no painel DevTools Performance exibe uma trilha que destaca os momentos métricos, como Layout Shift (LS) mostrado acima.</figcaption></figure>

[As métricas de campo](/vitals-field-measurement-best-practices/) , como as encontradas no [Chrome UX Report](https://developer.chrome.com/docs/crux/) ou [RUM](https://developer.mozilla.org/docs/Web/Performance/Rum-vs-Synthetic) , não têm essa limitação e são um complemento valioso para os dados de laboratório, pois refletem a experiência dos usuários reais. Os dados de campo não podem oferecer os tipos de informações de diagnóstico que você obtém no laboratório, então os dois andam de mãos dadas.

## Identifique onde você pode melhorar no Web Vitals

### Identifique o elemento Largest Contentful Paint

LCP é uma medida da experiência de carregamento percebida. Ele marca o ponto durante o carregamento da página quando o conteúdo principal - ou "maior" - foi carregado e está visível para o usuário.

O Lighthouse tem uma auditoria de "elemento Largest Contentful Paint" que identifica qual elemento tinha a maior renderização de conteúdo. Passe o mouse sobre o elemento para destacá-lo na janela principal do navegador.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/qeNJwYAVxysRV0okWmf4.png", alt = "elemento Largest Contentful Paint", width="800", height="505" %}</figure>

Se este elemento for uma imagem, esta informação é uma dica útil de que você pode querer otimizar o carregamento desta imagem. O Lighthouse inclui várias auditorias de otimização de imagem para ajudá-lo a entender se suas imagens poderiam ser melhor compactadas, redimensionadas ou entregues em um formato de imagem moderno mais ideal.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/8RVIyj6NiMfx7VDVbQmI.png", alt = "Auditoria do tamanho adequado de imagens", width="800", height="468" %}</figure>

Você também pode achar [LCP Bookmarklet](https://gist.github.com/anniesullie/cf2982342337fd1b2be95c2d5fe5ea06) de Annie Sullivan útil para identificar rapidamente o elemento LCP com um retângulo vermelho com apenas um clique.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/eZJdYsdfsNniDW1KRJkE.png", alt = "Destacando o elemento LCP com um bookmarklet", width = "800", height = "509"%}</figure>

### Pré-carregar imagens descobertas recentemente para melhorar o LCP

Para melhorar o LCP, [pré-carregue](/preload-responsive-images/) suas imagens críticas de herói se elas estão sendo descobertas tardiamente pelo navegador. Uma descoberta tardia pode acontecer se um pacote JavaScript precisar ser carregado antes que a imagem seja detectável.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/K9EPBZdSFoyXVDHoDjTx.png", alt = "Pré-carregue a imagem LCP", width = "800", height = "489"%}</figure>

{% Aside %} O **pré-carregamento deve ser usado com moderação** . A largura de banda inicial da rede é um recurso escasso e o uso da pré-carga pode custar outro recurso. Para usar o pré-carregamento com eficácia, certifique-se de que os recursos estão sendo ordenados corretamente para evitar a regressão de outras métricas quando outros recursos na página também são considerados importantes (por exemplo, CSS, JS, fontes críticas). O [custo da pré-carga](https://docs.google.com/document/d/1ZEi-XXhpajrnq8oqs5SiW-CXR3jMc20jWIzN5QRy1QA/edit) cobre isso com mais detalhes. {% endAside %}

O Lighthouse 6.5 e superior agora sugere oportunidades para aplicar essa otimização.

Existem algumas perguntas comuns que nos fazem sobre o pré-carregamento de imagens LCP que também podem valer a pena abordar brevemente.

Você pode pré-carregar imagens responsivas? [Sim](/preload-responsive-images/#imagesrcset-and-imagesizes). Digamos que temos uma imagem de herói responsiva conforme especificado usando `srcset` e `sizes` abaixo:

```html
<img src="lighthouse.jpg"
          srcset="lighthouse_400px.jpg 400w,
                  lighthouse_800px.jpg 800w,
                  lighthouse_1600px.jpg 1600w" sizes="50vw" alt="A helpful
Lighthouse">
```

Graças aos atributos `imagesrcset` e `imagesizes` adicionados ao atributo `link`, podemos pré-carregar uma imagem responsiva usando a mesma lógica de seleção de imagem usada por `srcset` e `sizes`:

```html
<link rel="preload" as="image" href="lighthouse.jpg"
           imagesrcset="lighthouse_400px.jpg 400w,
                        lighthouse_800px.jpg 800w,
                        lighthouse_1600px.jpg 1600w"
imagesizes="50vw">
```

A auditoria também destacará as oportunidades de pré-carregamento se a imagem LCP for definida por meio de um plano de fundo CSS? Sim.

Qualquer imagem sinalizada como a imagem LCP, seja por meio de CSS de fundo ou `<img>` é uma candidata se for descoberta na fase três ou superior no modelo de cascata.

### Identifique as contribuições do CLS

Cumulative Layout Shift (CLS) é uma medida de estabilidade visual. Ela quantifica quanto o conteúdo de uma página muda visualmente. O Lighthouse tem uma auditoria para depurar CLS chamada "Evite grandes mudanças de layout".

Esta auditoria destaca os elementos DOM que mais contribuem para as mudanças da página. Na coluna Elemento à esquerda, você verá a lista desses elementos DOM e, à direita, sua contribuição geral para o CLS.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/X31lkLFtfjDZdO2O7ytV.png", alt = "Evite a auditoria de grandes mudanças de layout no Lighthouse destacando os nós DOM relevantes que contribuem para o CLS", width = "800", height = "525"%}</figure>

Graças ao novo recurso de Capturas de tela de Elementos do Lighthouse, podemos ter uma pré-visualização dos principais elementos observados na auditoria, bem como clicar para ampliar para uma visão mais clara:

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/L9geZVvkATRlAVcZA6dx.png", alt = "Clicar em uma captura de tela de Elemento irá expandi-la", width = "800", height = "525"%}</figure>

Para o CLS pós-carregamento, pode haver valor em visualizar *persistentemente*, com retângulos, quais elementos contribuíram mais para o CLS. Este é um recurso que você encontrará em ferramentas de terceiros, como o [Core Web Vitals dashboard](https://speedcurve.com/blog/web-vitals-user-experience/) da SpeedCurve e o que eu adoro usar: [Defaced's Layout Shift GIF Generator](https://defaced.dev/tools/layout-shift-gif-generator/)

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/ju6XjKBYzF6G537myjUW.gif", alt = "o  layout shift generator destacando mudanças", width="800", height="450" %}</figure>

Para uma visão de todos os problemas de mudança de layout do site, aproveito bastante o [Search Console's Core Web Vitals report](https://support.google.com/webmasters/answer/9205520?hl=en). Isso me permite ver os tipos de páginas em meu site com um alto CLS (neste caso, ajudando-me a identificar em quais modelos parciais preciso gastar meu tempo):

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/2Ihb2GYkbpGzYLYoZEDP.png", alt = "Search Console exibindo problemas CLS", width = "800", height = "506"%}</figure>

{% Aside %} Para reduzir as mudanças de layout causadas por Web Fonts, fique de olho no novo descritor de [ajuste de tamanho](https://groups.google.com/a/chromium.org/g/blink-dev/c/1PVr94hZHjU/m/J0xT8-rlAQAJ) `@font-face` . É possível ajustar o tamanho das fontes substitutas para reduzir o CLS. {% endAside %}

### Identificar CLS a partir de imagens sem dimensões

Para [limitar](/optimize-cls/#images-without-dimensions) o Cumulative Layout Shift causado por imagens sem dimensões, inclua os atributos de largura e altura em suas imagens e elementos de vídeo. Essa abordagem garante que o navegador possa alocar a quantidade correta de espaço no documento enquanto a imagem está sendo carregada.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/fZRkmM18rvfy6y7LB1Qx.png", alt = "Auditoria para elementos de imagem sem largura e altura explícitas", width = "800", height = "489"%}</figure>

Consulte [Definir a altura e a largura nas imagens é importante novamente](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/) para um bom artigo sobre a importância de se pensar nas dimensões e proporção da imagem.

### Identificar CLS de anúncios

[O Publisher Ads for Lighthouse](https://developers.google.com/publisher-ads-audits) permite que você encontre oportunidades para melhorar a experiência de carregamento de anúncios em sua página, incluindo contribuições para mudança de layout e tarefas longas que podem atrasar o uso de sua página pelos usuários. No Lighthouse, você pode habilitar isso por meio dos Plug-ins da Comunidade.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/kR3jgctso6Hg0OxD8xwi.png", alt = "Auditorias relacionadas a anúncios destacando oportunidades para reduzir o tempo de solicitação e mudança de layout", width = "800", height = "527"%}</figure>

Lembre-se de que os anúncios são um dos [maiores](/optimize-cls/#ads-embeds-and-iframes-without-dimensions) contribuintes para as mudanças de layout na web. É importante:

- Tomar cuidado ao posicionar anúncios não fixos próximos à parte superior da janela de visualização
- Eliminar as mudanças reservando o maior tamanho possível para o local do anúncio

### Evite animações não compostas

As animações que não são compostas podem se apresentar com baixa qualidade em dispositivos de baixo custo se tarefas pesadas de JavaScript estão mantendo o thread principal ocupado. Essas animações podem introduzir mudanças de layout.

Se o Chrome descobrir que uma animação não pode ser composta, ele a reporta a uma leitura do Lighthouse DevTools, permitindo listar quais elementos com animações não foram compostos e por qual motivo. Você pode encontrá-los na auditoria [Evitar animações não compostas.](/non-composited-animations/)

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/heGuYXKeMrUftMvfrDU7.png", alt = "Auditoria para evitar animações não compostas", width = "800", height = "528"%}</figure>

### Depurar First Input Delay / Total Blocking Time / Tarefas longas

A Primeira entrada mede o tempo desde quando um usuário interage pela primeira vez com uma página (por exemplo, quando ele clica em um link, toca em um botão ou usa um controle personalizado baseado em JavaScript) até o momento em que o navegador é realmente capaz de começar a processar os manipuladores de evento em resposta a essa interação. Tarefas JavaScript longas podem impactar esta métrica e o proxy para esta métrica, Total Blocking Time.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/LqBCtAXdByd4fBzoNc1K.png", alt = "Auditoria para evitar longas tarefas no thread principal", width = "800", height = "485"%}</figure>

O Lighthouse inclui uma auditoria para [Evitar tarefas longas do thread principal](/long-tasks-devtools/), que lista as tarefas mais longas do thread principal. Isso pode ser útil para identificar os piores contribuintes para o atraso de entrada. Na coluna da esquerda, podemos ver a URL dos scripts responsáveis por longas tarefas do thread principal.

À direita podemos ver a duração dessas tarefas. Como um lembrete, Tarefas Longas são tarefas executadas por mais de 50 milissegundos. Isso é considerado para bloquear o thread principal por tempo suficiente para impactar a taxa de quadros ou latência de entrada.

Se estiver considerando serviços de terceiros para monitoramento, também gosto bastante do visual da [linha do tempo de execução do thread principal](https://calibreapp.com/docs/features/main-thread-execution-timeline) que o Caliber tem para visualizar esses custos, que destaca as tarefas pai e filho contribuindo para tarefas longas que afetam a interatividade.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/IGENqHBjC97pHslOQYc6.png", alt = "O visual da linha de tempo de execução do thread principal do Calibre", width = "800", height = "155"%}</figure>

### Bloqueie solicitações de rede para ver o impacto antes/depois no Lighthouse

O Chrome DevTools suporta o [bloqueio de solicitações de rede](https://developer.chrome.com/docs/devtools/network/#block) para ver o impacto de recursos individuais sendo removidos ou indisponíveis. Isso pode ser útil para entender o custo de scripts individuais (por exemplo, como incorporadores ou rastreadores de terceiros) em métricas como Total Blocking Time (TBT) e Time to Interactive.

O bloqueio de solicitação de rede também funciona com o Lighthouse! Vamos dar uma olhada rápida no relatório do Lighthouse para um site. A pontuação de desempenho é de 63/100 com um TBT de 400 ms. Explorando o código, descobrimos que este site carrega um Intersection Observer polyfill no Chrome que não é necessário. Vamos bloquear!

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/DPXEXhOZL0Czjm10lBox.png", alt = "Bloqueio de solicitação de rede", width="800", height="508" %}</figure>

Podemos clicar com o botão direito em um script no painel DevTools Network e clicar em `Block Request URL` para bloqueá-lo. Aqui, faremos isso para o Intersection Observer polyfill.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/iWB0jAtL0PKpwkmecOPf.png", alt = "Bloquear solicitação de URLs em DevTools", width = "800", height = "354"%}</figure>

Em seguida, podemos executar o Lighthouse novamente. Desta vez, podemos ver que nossa pontuação de desempenho melhorou (70/100), assim como o Total Blocking Time (400ms =&gt; 300ms).

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/LiaMMxvy4prpFBIuSgfo.png", alt = "A visão posterior do bloqueio de solicitações de rede dispendiosas", width = "800", height = "508"%}</figure>

### Substitua as dispendiosas incorporações de terceiros por uma fachada

É comum usar recursos de terceiros para incorporar vídeos, postagens de mídia social ou widgets em páginas. Por padrão, a maioria das incorporações carrega rapidamente e pode vir com cargas caras que impactam negativamente a experiência do usuário. Isso é um desperdício se o terceiro não for crítico (por exemplo, se o usuário precisar rolar antes de vê-lo).

Um padrão para melhorar o desempenho de tais widgets é [carregá-los lentamente na interação do usuário](https://addyosmani.com/blog/import-on-interaction/). Isso pode ser feito renderizando uma visualização leve do widget (uma fachada) e apenas carregar a versão completa se um usuário interagir com ela. O Lighthouse tem uma auditoria que recomendará recursos de terceiros que podem ser [carregados lentamente com uma fachada](/third-party-facades/), como incorporações de vídeo do YouTube.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/iciXy3oVlPH7VuwN7toy.png", alt = "Auditoria destacando que alguns recursos caros de terceiros podem ser substituídos", width = "800", height = "483"%}</figure>

Como um lembrete, o Lighthouse [destacará o código de terceiros](/third-party-summary/) que bloqueia o thread principal por mais de 250ms. Isso pode revelar todos os tipos de scripts de terceiros (incluindo aqueles criados pelo Google) que podem valer a pena adiar ou carregar lentamente se o que eles renderizam exigir rolagem para visualizá-lo.

<figure>{% Img src = "image/1L2RBhCLSnXjCnSlevaDjy3vba73/K0Oxmu1XEN2P3NQIknyH.png", alt = "Reduza o custo da auditoria de JavaScript de terceiros", width = "800", height = "556"%}</figure>

### Além do Core Web Vitals

Além de destacar o Core Web Vitals, as versões recentes do Lighthouse e do PageSpeed Insights também tentam fornecer uma orientação concreta que você pode seguir para melhorar a rapidez com que os aplicativos da web pesados, em JavaScript, podem ser carregados se os mapas de origem estiverem ativados.

Isso inclui uma coleção crescente de auditorias para reduzir o custo de JavaScript em sua página, bem como reduzir a dependência de polyfills e duplicatas que podem não ser necessários para a experiência do usuário.

Para obter mais informações sobre as ferramentas Core Web Vitals, fique de olho na conta do Twitter da [equipe do Lighthouse](https://twitter.com/____lighthouse) e [No que há de novo no DevTools](https://developers.google.com/web/updates/2020/05/devtools) .

[Imagem de herói](https://unsplash.com/photos/7I9aCavB8RI) por [Mercedes Mehling](https://unsplash.com/@mrs80z) no [Unsplash](https://unsplash.com) .
