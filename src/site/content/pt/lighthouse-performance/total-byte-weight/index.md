---
layout: post
title: Evite enormes cargas de rede
description: |2

  Aprenda como melhorar o tempo de carregamento de sua página da web, reduzindo o arquivo total

  tamanho dos recursos que você atende aos seus usuários.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - peso total em bytes
---

Grandes cargas de rede são altamente correlacionadas com longos tempos de carregamento. Eles também custam dinheiro aos usuários; por exemplo, os usuários podem ter que pagar por mais dados de celular. Portanto, reduzir o tamanho total das solicitações de rede da sua página é bom para a experiência dos usuários no seu site *e* nas carteiras deles.

{% Aside %} Para ver quanto custa o acesso ao seu site em todo o mundo, consulte o [Quanto custa o meu site?](https://whatdoesmysitecost.com/) do WebPageTest. Você pode ajustar os resultados para levar em consideração o poder de compra. {% endAside %}

## Como a auditoria de carga útil da rede Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) mostra o tamanho total em [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) de todos os recursos solicitados por sua página. As maiores solicitações são apresentadas primeiro:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cCFb8MJkwnYquq3K9UmX.png", alt="Uma captura de tela da enorme auditoria de cargas úteis de rede do Lighthouse Avoid", width="800", height="518" %}</figure>

Com base nos [dados do arquivo HTTP](https://httparchive.org/reports/state-of-the-web?start=latest#bytesTotal), a carga útil média da rede está entre 1.700 e 1.900 KiB. Para ajudar a revelar as cargas úteis mais altas, o Lighthouse sinaliza páginas cujo total de solicitações de rede excede 5.000 KiB.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como reduzir o tamanho da carga útil

Tente manter o tamanho total de bytes abaixo de 1.600 KiB. Essa meta é baseada na quantidade de dados que podem ser baixados teoricamente em uma conexão 3G enquanto ainda atinge um [tempo de interação](/tti/) de 10 segundos ou menos.

Aqui estão algumas maneiras de manter o tamanho da carga útil baixo:

- Adie as solicitações até que sejam necessárias. Consulte o [padrão PRPL](/apply-instant-loading-with-prpl) para uma abordagem possível.
- Otimize as solicitações para serem o menor possível. As técnicas possíveis incluem:
    - [Minimize e comprima cargas úteis de rede](/reduce-network-payloads-using-text-compression).
    - [Use WebP em vez de JPEG ou PNG para suas imagens](/serve-images-webp).
    - [Defina o nível de compressão de imagens JPEG para 85](/use-imagemin-to-compress-images).
- Solicitações de cache para que a página não baixe novamente os recursos em visitas repetidas. Consulte a [página inicial de confiabilidade](/reliable) da rede para saber como o cache funciona e como implementá-lo.

## Orientação específica para pilha

### Angular

Aplique a [divisão de código no nível da rota](/route-level-code-splitting-in-angular/) para minimizar o tamanho de seus pacotes de JavaScript. Além disso, considere pré-armazenar em cache os ativos com o [trabalhador de serviço Angular](/precaching-with-the-angular-service-worker/).

### Drupal

Considere o uso de [estilos de imagem responsivos](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) para reduzir o tamanho das imagens carregadas em sua página. Se você estiver usando Visualizações para mostrar vários itens de conteúdo em uma página, considere implementar a paginação para limitar o número de itens de conteúdo mostrados em uma determinada página.

### Joomla

Considere mostrar trechos em suas categorias de artigo (por exemplo, por meio de um link "leia mais"), reduzindo o número de artigos exibidos em uma determinada página, dividindo suas postagens longas em várias páginas ou usando um plug-in para carregar lentamente os comentários.

### WordPress

Considere mostrar trechos em suas listas de postagens (por exemplo, por meio da tag "mais"), reduzindo o número de postagens mostradas em uma determinada página, dividindo suas postagens longas em várias páginas ou usando um plugin para carregar lentamente os comentários.

## Recursos

[Código-fonte para auditoria **Evitar enormes cargas úteis de rede**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/total-byte-weight.js)
