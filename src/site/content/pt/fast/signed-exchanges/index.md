---
layout: post
title: Trocas assinadas (SXGs)
subhead: |2-

  Uma SXG é um mecanismo de entrega que torna possível autenticar o

  origem de um recurso, independentemente de como ele foi entregue.
authors:
  - katiehempenius
date: 2020-10-14
updated: 2021-04-21
hero: image/admin/6ll3P8MYWxvtb1ZjXIzb.jpg
alt: Uma pilha de envelopes.
description: |2-

  Uma SXG é um mecanismo de entrega que torna possível autenticar o

  origem de um recurso, independentemente de como ele foi entregue.
tags:
  - blog
  - performance
---

Uma troca assinada (SXG) é um mecanismo de entrega que permite autenticar a origem de um recurso independentemente de como foi entregue. Essa dissociação avança uma variedade de casos de uso, como pré-busca para preservação de privacidade, experiências de internet offline e serviço de caches de terceiros. Além disso, a implementação de SXGs pode melhorar o Largest Contentful Paint (LCP) para alguns sites.

Este artigo fornece uma visão geral abrangente das SXGs: como funcionam, casos de uso e ferramentas.

## Compatibilidade do navegador {: #browser-compatibility }

SXGs são [suportados](https://caniuse.com/#feat=sxg) por navegadores baseados em Chromium (começando com as versões: Chrome 73, Edge 79 e Opera 64).

## Visão geral

As trocas assinadas (SXGs) permitem que um site assine com criptografia um par de solicitação/resposta (uma "troca HTTP") de forma que possibilite ao navegador verificar a origem e integridade do conteúdo, independentemente de como o conteúdo foi distribuído. Como resultado, o navegador pode exibir o URL do site de origem na barra de endereço, em vez do URL do servidor que entregou o conteúdo.

A implicação mais ampla das SXGs é que elas tornam o conteúdo portátil: o conteúdo entregue por meio de uma SXG pode ser facilmente distribuído por terceiros, mantendo total garantia e atribuição de sua origem. Historicamente, a única maneira de um site usar terceiros para distribuir seu conteúdo, mantendo a atribuição, é o site compartilhar seus certificados SSL com o distribuidor. Isso tem desvantagens de segurança; além disso, está muito longe de tornar o conteúdo verdadeiramente portátil.

No longo prazo, o conteúdo verdadeiramente portátil pode ser utilizado para alcançar casos de uso como experiências totalmente offline. No prazo imediato, o principal caso de uso de SXGs é a entrega de experiências de usuário mais rápidas, fornecendo conteúdo em um formato facilmente armazenável em cache. Especificamente, a [Pesquisa Google](#google-search) armazenará em cache e, às vezes, pré-buscará SXGs. Para sites que recebem uma grande parte do tráfego da Pesquisa Google, as SXGs podem ser uma ferramenta importante para fornecer carregamentos de página mais rápidos aos usuários.

### O formato SXG

Uma SXG é encapsulada em um [arquivo codificado](https://cbor.io/) em binário que possui dois componentes principais: uma troca HTTP e uma [assinatura](https://developer.mozilla.org/docs/Glossary/Signature/Security). A troca HTTP consiste em um URL de solicitação, informações de negociação de conteúdo e uma resposta HTTP.

Aqui está um exemplo de arquivo SXG decodificado:

```html
format version: 1b3
request:
  method: GET
  uri: https://example.org/
  headers:
response:
  status: 200
  headers:
    Cache-Control: max-age=604800
    Digest: mi-sha256-03=kcwVP6aOwYmA/j9JbUU0GbuiZdnjaBVB/1ag6miNUMY=
    Expires: Mon, 24 Aug 2020 16:08:24 GMT
    Content-Type: text/html; charset=UTF-8
    Content-Encoding: mi-sha256-03
    Date: Mon, 17 Aug 2020 16:08:24 GMT
    Vary: Accept-Encoding
signature:
    label;cert-sha256=*ViFgi0WfQ+NotPJf8PBo2T5dEuZ13NdZefPybXq/HhE=*;
    cert-url="https://test.web.app/ViFgi0WfQ-NotPJf8PBo2T5dEuZ13NdZefPybXq_HhE";
    date=1597680503;expires=1598285303;integrity="digest/mi-sha256-03";sig=*MEUCIQD5VqojZ1ujXXQaBt1CPKgJxuJTvFlIGLgkyNkC6d7LdAIgQUQ8lC4eaoxBjcVNKLrbS9kRMoCHKG67MweqNXy6wJg=*;
    validity-url="https://example.org/webpkg/validity"
header integrity: sha256-Gl9bFHnNvHppKsv+bFEZwlYbbJ4vyf4MnaMMvTitTGQ=

The exchange has a valid signature.
payload [1256 bytes]:
<!doctype html>
<html>
<head>
    <title>SXG example</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
    }
    </style>
</head>
<body>
<div>
    <h1>Hello</h1>
</div>
</body>
</html>
```

O `expires` na assinatura indica a data de expiração de uma SXG. Uma SXG pode ser válida por no máximo 7 dias. Se a data de validade de uma SXG for mais de 7 dias, o navegador irá rejeitá-la. Leia mais informações sobre o cabeçalho da assinatura nas [especificações de Trocas HTTP assinadas](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-3.1).

### Empacotamento da Web

As SXGs fazem parte de uma família mais ampla de propostas de especificações de [empacotamento da Web.](https://github.com/WICG/webpackage) Além das SXGs, o outro componente principal da especificação do empacotamento da Web são os [pacotes da Web](/web-bundles/) ("trocas HTTP agrupadas"). Pacotes da Web são uma coleção de recursos HTTP e os metadados necessários para interpretar o pacote.

A relação entre SXGs e pacotes da Web é um ponto comum de confusão. SXGs e pacotes da Web são duas tecnologias distintas que não dependem uma da outra — pacotes da Web podem ser usados com trocas assinadas e não assinadas. O objetivo comum avançado por SXGs e pacotes da Web é a criação de um formato de "pacote da web" que permite que os sites sejam compartilhados em sua totalidade para consumo off-line.

As SXGs são a primeira parte da especificação do empacotamento da Web que os navegadores baseados em Chromium irão implementar.

## Carregar as SXGs

Inicialmente, o principal caso de uso de SXGs provavelmente será como um mecanismo de entrega para o documento principal de uma página. Para este caso de uso, uma SXG poderia ser referenciada usando as `<link>` ou `<a>`, bem como o [cabeçalho `Link`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link). Como outros recursos, uma SXG pode ser carregada inserindo seu URL na barra de endereços do navegador.

```html
<a href="https://example.com/article.html.sxg">
```

```html
<link rel="prefetch" as="document" href="https://example.com/article.html.sxg">
```

As SXGs também podem ser usadas para fornecer sub-recursos. Para obter mais informações, consulte [Substituição de sub-recursos da troca assinada](https://github.com/WICG/webpackage/blob/main/explainers/signed-exchange-subresource-substitution.md).

## Servir as SXGs

### Negociação de conteúdo

A [negociação de conteúdo](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation) é um mecanismo para servir diferentes representações do mesmo recurso no mesmo URL, dependendo dos recursos e preferências de um cliente - por exemplo, servir a versão gzip de um recurso para alguns clientes, mas a versão Brotli para outros. A negociação de conteúdo torna possível servir representações SXG e não SXG do mesmo conteúdo, dependendo dos recursos do navegador.

Os navegadores da Web usam o cabeçalho da solicitação [`Accept` para comunicar os](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept)[tipos de MIME](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) que eles suportam. Se um navegador oferecer suporte a SXGs, o `application/signed-exchange` tipo MIME será incluído automaticamente nesta lista de valores.

Por exemplo, este é o `Accept` enviado pelo Chrome 84:

```json
accept:
text/html,
application/xhtml+xml,
application/xml;q=0.9,
image/webp,image/apng,
\*/\*;q=0.8,
application/signed-exchange;v=b3;q=0.9
```

O `application/signed-exchange;v=b3;q=0.9` parte dessa string informa ao servidor da Web que o Chrome oferece suporte a SXGs - especificamente, a versão `b3`. A última parte `q=0.9` indica o [valor q](https://developer.mozilla.org/docs/Glossary/Quality_values).

O `q-value` expressa a preferência relativa de um navegador por um formato específico usando uma escala decimal de `0` a `1`, com `1` representando a prioridade mais alta. Quando um `q-value` não é fornecido para um formato, `1` é o valor implícito.

### Melhores práticas

Os servidores devem servir SXGs quando o `Accept` indica que o `q-value` para `application/signed-exchange` é maior ou igual ao `q-value` para `text/html`. Na prática, isso significa que um servidor de origem servirá SXGs aos rastreadores, mas não aos navegadores.

As SXGs podem oferecer desempenho superior quando usados com cache ou pré-busca. No entanto, para conteúdo que é carregado diretamente do servidor de origem sem o benefício dessas otimizações, `text/html` oferece melhor desempenho do que SXGs. Servir conteúdo como SXG permite que os rastreadores e outros intermediários armazenem SXGs em cache para entrega mais rápida aos usuários.

A seguinte expressão regular pode ser usada para corresponder ao `Accept` de solicitações que devem ser atendidas como SXG:

```regex
Accept: /(^|,)\s\*application\/signed-exchange\s\*;\s\*v=[[:alnum:]\_-]+\s\*(,|$)/
```

Observe que a subexpressão `(,|$)` corresponde aos cabeçalhos onde o `q-value` para SXG foi omitido; esta omissão implica um `q-value` de `1` para SXG. Embora um `Accept` possa teoricamente conter a substring `q=1`, [na prática](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation/List_of_default_Accept_values) os navegadores não listam explicitamente o `q-value` um formato quando ele tem o valor padrão `1`.

## Depurar SXGs com Chrome DevTools {: #debugging}

As trocas assinadas podem ser identificadas procurando por `signed-exchange` na coluna **Tipo** do painel **Rede** no Chrome DevTools.

<figure>{% Img src="image/admin/cNdohSaeXqGHFBwD7L3B.png", alt="Captura de tela mostrando uma solicitação de SXG dentro do painel 'Rede' em DevTools", width="696", height="201" %} <figcaption>O painel <b>Rede</b> no DevTools</figcaption></figure>

A guia **Visualização** fornece mais informações sobre o conteúdo de uma SXG.

<figure>{% Img src="image/admin/E0rBwuxk4BxFmLJ3gXhP.png", alt="Captura de tela da guia 'Visualização' para uma SXG", width="800", height="561" %} <figcaption>A guia <b>Visualização</b> no DevTools</figcaption></figure>

Para ver uma SXG em primeira mão, visite esta [demonstração](https://signed-exchange-testing.dev/) em [um dos navegadores compatíveis com SXGs](#browser-compatibility)

## Casos de uso

As SXGs podem ser usadas para entregar conteúdo diretamente de um servidor de origem para um usuário - mas isso iria contra a finalidade das SXGs. Em vez disso, o uso pretendido e os benefícios das SXGs são alcançados principalmente quando as SXGs geradas por um servidor de origem são armazenadas em cache e servidas aos usuários por um intermediário.

Embora esta seção discuta principalmente o armazenamento em cache e a exibição de SXGs pela Pesquisa Google, é uma técnica válida para qualquer site que deseja fornecer seus links externos com uma experiência de usuário mais rápida ou maior resiliência ao acesso limitado à rede. Isso não inclui apenas mecanismos de pesquisa e plataformas de mídia social, mas também portais de informações que fornecem conteúdo para consumo off-line.

### Pesquisa do Google

{% Img src = "image/j2RDdG43oidUy6AL6LovThjeX9c2/oMtUUAVj5hAGwBZMDwct.png", alt = "Diagrama mostrando um SXG pré-buscado sendo servido de um cache.", width="800", height="396" %}

A Pesquisa Google usa SXGs para fornecer aos usuários uma experiência de carregamento de página mais rápida para páginas carregadas da página de resultados de pesquisa. Os sites que recebem tráfego significativo da Pesquisa Google podem ter melhorias de desempenho significativas ao fornecer conteúdo como SXG.

A Pesquisa Google agora rastreará, armazenará em cache e pré-buscará SXGs quando aplicável. O Google e outros mecanismos de pesquisa às vezes buscam [previamente](https://developer.mozilla.org/docs/Web/HTTP/Link_prefetching_FAQ) o conteúdo que o usuário provavelmente visitará - por exemplo, a página correspondente ao primeiro resultado da pesquisa. As SXGs são particularmente adequadas para pré-busca por causa de seus benefícios de privacidade em relação aos formatos não SXG.

{% Aside %} Há uma certa quantidade de informações do usuário inerentes a todas as solicitações de rede, independentemente de como ou por que foram feitas: isso inclui informações como endereço IP, a presença ou ausência de cookies e o valor de cabeçalhos como `Accept-Language`. Essas informações são "divulgadas" ao servidor de destino quando uma solicitação é feita. Como as SXGs são pré-buscadas de um cache, em vez do servidor de origem, o interesse de um usuário em um site só será divulgado ao servidor de origem quando o usuário navegar até o site, e não no momento da pré-busca. Além disso, o conteúdo pré-buscado via SXG não define cookies ou acessa `localStorage`, a menos que o conteúdo seja carregado pelo usuário. Além disso, isso não revela nenhuma nova informação do usuário ao referenciador de SXG. O uso de SXGs para pré-busca é um exemplo do conceito de pré-busca para preservação de privacidade. {% endAside %}

#### Rastreamento

O [`Accept`](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation) enviado pelo rastreador da Pesquisa Google expressa uma preferência igual por `text/html` e `application/signed-exchange`. Conforme descrito na [seção anterior](#best-practices), os sites que desejam usar SXGs devem servi-los quando o `Accept` de uma solicitação expressa uma preferência igual ou maior por SXGs em vez de `text/html`. Na prática, apenas os rastreadores expressarão preferência por SXGs em vez de `text/html`.

#### Indexação

As representações SXG e não SXG de uma página não são classificadas ou indexadas separadamente pela Pesquisa Google. A SXG é, em última análise, um mecanismo de entrega - ela não altera o conteúdo subjacente. Diante disso, não faria sentido para a Pesquisa Google indexar ou classificar separadamente o mesmo conteúdo fornecido de maneiras diferentes.

#### Web Vitals

Para sites que recebem uma parte significativa de seu tráfego da Pesquisa Google, os SXGs podem ser usados para melhorar o [Web Vitals](/vitals/) - como a [LCP](/lcp/). As SXGs em cache e pré-estendidos podem ser entregues aos usuários de forma incrivelmente rápida e isso produz uma LCP mais rápida. Embora as SXGs possam ser uma ferramenta poderosa, elas funcionam melhor quando combinados com outras otimizações de desempenho, como o uso de CDNs e a redução de sub-recursos de bloco de renderização.

### AMP

O conteúdo AMP pode ser entregue usando SXG. A SXG permite que o conteúdo AMP seja pré-buscado e exibido usando seu URL canônico, em vez de seu URL deAMP.

Todos os conceitos descritos neste documento ainda se aplicam ao caso de uso de AMP, no entanto, AMP tem suas próprias [ferramentas](https://github.com/ampproject/amppackager) separadas para gerar SXGs.

{% Aside%} Saiba como veicular AMP usando trocas assinadas em [amp.dev](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/signed-exchange/). {% endAside %}

## Ferramental

A implementação de SXGs consiste em gerar a SXG correspondente a um determinado URL e, em seguida, servir essa SXG aos solicitantes (geralmente rastreadores). Para gerar uma SXG, você precisará de um certificado que possa assinar as SXGs.

### Certificados

O uso de produção de SXGs exige um certificado com suporte para a extensão `CanSignHttpExchanges`. De acordo com as [especificações](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-4.2), os certificados com esta extensão devem ter um período de validade não superior a 90 dias e exigem que o domínio solicitante tenha um [registro CAA de DNS](https://en.wikipedia.org/wiki/DNS_Certification_Authority_Authorization) configurado.

[Esta página](https://github.com/google/webpackager/wiki/Certificate-Authorities) lista as autoridades de certificação que podem emitir esse tipo de certificado. Os certificados para SXGs estão disponíveis apenas por meio de uma autoridade de certificação comercial.

### Ferramentas SXG específicas da plataforma

Essas ferramentas oferecem suporte a pilhas de tecnologia específicas. Se você já estiver usando uma plataforma com suporte por uma dessas ferramentas, pode achar mais fácil de configurar do que uma ferramenta de uso geral.

- [`sxg-rs/cloudflare_worker`](https://github.com/google/sxg-rs/tree/main/cloudflare_worker) é executado em [Cloudflare Workers](https://workers.cloudflare.com/).

- [`sxg-rs/fastly_compute`](https://github.com/google/sxg-rs/tree/main/fastly_compute) é executado em [Fastly Compute @ Edge](https://www.fastly.com/products/edge-compute/serverless).

- [Trocas assinadas automáticas](https://blog.cloudflare.com/automatic-signed-exchanges/) são um recurso do Cloudflare que adquire certificados automaticamente e gera trocas assinadas.

- [O módulo NGINX SXG](https://github.com/google/nginx-sxg-module) gera e atende SXGs para sites que usam [nginx](https://nginx.org/). As instruções de configuração podem ser encontradas [aqui](/how-to-set-up-signed-http-exchanges/).

- [O Envoy SXG Filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/sxg_filter) gera e fornece SXGs para sites que usam o [Envoy](https://www.envoyproxy.io/).

### Ferramentas SXG de uso geral

#### CLI do Web Packager

A [CLI do Web Packager](https://github.com/google/webpackager) gera uma SXG correspondente a um determinado URL.

```shell
webpackager \
    --private\_key=private.key \
    --cert\_url=https://example.com/certificate.cbor \
    --url=https://example.com
```

Uma vez que o arquivo SXG foi gerado, carregue-o em seu servidor e sirva-o com o tipo MIME `application/signed-exchange;v=b3`. Além disso, você precisará fornecer o certificado SXG como `application/cert-chain+cbor`.

#### Servidor Web Packager

O [servidor Web Packager](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md), `webpkgserver`, atua como um [proxy reverso](https://en.wikipedia.org/wiki/Reverse_proxy) para servir SXGs. Dado um URL, o `webpkgserver` buscará o conteúdo do URL, empacotá-lo como uma SXG e servir a SXG em resposta. Para obter instruções sobre como configurar o servidor do Web Packager, consulte [Como configurar trocas assinadas usando o Web Packager](/signed-exchanges-webpackager).

### Bibliotecas SXG

Essas bibliotecas podem ser usadas para construir seu próprio gerador SXG:

- A [`sxg_rs`](https://github.com/google/sxg-rs/tree/main/sxg_rs) é uma biblioteca Rust para gerar SXGs. É a biblioteca SXG com mais recursos e é usada como base para as ferramentas `cloudflare_worker` e `fastly_compute`.

- A [`libsxg`](https://github.com/google/libsxg) é uma biblioteca C mínima para gerar as SXGs. É usado como base para o módulo NGINX SXG e o filtro Envoy SXG.

- A [`go/signed-exchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange) é uma biblioteca Go mínima fornecida pela especificação do pacote da Web como uma [implementação](https://en.wikipedia.org/wiki/Reference_implementation) de referência da geração de SXGs. É usado como base para sua ferramenta CLI de referência, [`gen-signedexchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange) e as ferramentas de Web Packager com mais recursos.

## Conclusão

As trocas assinadas são um mecanismo de entrega que permite verificar a origem e validade de um recurso independentemente de como o recurso foi entregue. Como resultado, as SXGs podem ser distribuídas por terceiros, mantendo a atribuição total do editor.

## Leitura adicional

- [Rascunho da especificação para trocas de HTTP assinadas](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)
- [Explicadores de empacotamento da Web](https://github.com/WICG/webpackage/tree/main/explainers)
- [Comece com trocas assinadas na Pesquisa Google](https://developers.google.com/search/docs/advanced/experience/signed-exchange)
- [Como configurar as trocas assinadas usando o Web Packager](/signed-exchanges-webpackager)
- [Demonstração de trocas assinadas](https://signed-exchange-testing.dev/)
