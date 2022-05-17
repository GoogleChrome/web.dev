---
title: Estabeleça conexões de rede com antecedência para melhorar a velocidade percebida da página
subhead: |2

  Saiba mais sobre dicas de recursos rel = preconnect e rel = dns-prefetch e como usá-los.
date: 2019-07-30
hero: image/admin/Dyccd1RLN0fzhjPXswmL.jpg
alt: Criação de Adão por Michelangelo no teto da Capela Sistina
authors:
  - mihajlija
description: |2

  Saiba mais sobre dicas de recursos rel = preconnect e rel = dns-prefetch e como usá-los.
tags:
  - blog
  - performance
---

Antes que o navegador possa solicitar um recurso de um servidor, ele deve estabelecer uma conexão. Estabelecer uma conexão segura envolve três etapas:

- Procurar o nome de domínio e resolvê-lo para um endereço IP.

- Configurar uma conexão com o servidor.

- Criptografar a conexão para ter segurança.

Em cada uma dessas etapas, o navegador envia uma parte dos dados a um servidor e o servidor envia de volta uma resposta. Essa viagem, da origem ao destino e de volta, é chamada de [ida e volta](https://developer.mozilla.org/docs/Glossary/Round_Trip_Time_(RTT)).

Dependendo das condições da rede, uma única viagem de ida e volta pode levar um tempo significativo. O processo de configuração da conexão pode envolver até três viagens de ida e volta, e até mais em casos não otimizados.

Cuidar de tudo isso com antecedência torna os aplicativos muito mais rápidos. Esta postagem explica como conseguir isso com duas dicas de recursos: `<link rel=preconnect>` e `<link rel=dns-prefetch>` .

## Estabeleça conexões iniciais com `rel=preconnect`

Os navegadores modernos [fazem o melhor que podem para prever](https://www.igvita.com/posa/high-performance-networking-in-google-chrome/#tcp-pre-connect) quais conexões uma página precisará, mas não podem prever todas com segurança. A boa notícia é que você pode dar a eles uma dica do (recurso 😉).

Adicionar `rel=preconnect` a um `<link>` informa ao navegador que sua página pretende estabelecer uma conexão com outro domínio e que você gostaria que o processo fosse iniciado o mais rápido possível. Os recursos serão carregados mais rapidamente porque o processo de configuração já foi concluído no momento em que o navegador os solicita.

As dicas de recursos recebem esse nome porque não são instruções obrigatórias. Eles fornecem as informações sobre o que você gostaria que acontecesse, mas, em última análise, cabe ao navegador decidir se deseja executá-los. Configurar e manter uma conexão aberta dá muito trabalho, então o navegador pode escolher ignorar dicas de recursos ou executá-las parcialmente, dependendo da situação.

Informar o navegador da sua intenção é tão simples quanto adicionar uma `<link>` à sua página:

```html
<link rel="preconnect" href="https://example.com">
```

{% Img src="image/admin/988BgvmiVEAp2YVKt2jq.png", alt="Um diagrama mostrando como o download não começa por um tempo depois que a conexão é estabelecida.", width="800", height="539" %}

Você pode acelerar o tempo de carregamento em 100–500 ms estabelecendo conexões antecipadas com origens de terceiros importantes. Esses números podem parecer pequenos, mas fazem diferença na forma como os [usuários percebem o desempenho da página web](/rail/#focus-on-the-user).

{% Aside %} chrome.com [melhorou o tempo de interação](https://twitter.com/addyosmani/status/1090874825286000640) em quase 1 s ao conectar-se previamente a origens importantes. {% endAside %}

## Casos de uso para `rel=preconnect`

### Saber de *onde*, mas não o *que* você está buscando

Devido às dependências com versão, às vezes você acaba em uma situação em que sabe que estará solicitando um recurso de um CDN específico, mas não o caminho exato até ele.

<figure>{% Img src="image/admin/PsP4qymb1gIp8Ip2sD9W.png", alt="Um url de um script com o nome da versão.", width="450", height="50" %} <figcaption>Um exemplo de URL com versão.</figcaption></figure>

O outro caso comum é carregar imagens de um [CDN de imagem](/image-cdns), em que o caminho exato para uma imagem depende de consultas de mídia ou verificações de recurso de tempo de execução no navegador do usuário.

<figure>{% Img src="image/admin/Xx4ai7tzSq12DJsQXaL1.png", alt="Um URL de CDN de imagem com os parâmetros size = 300x400 e quality = auto.", width="800", height="52" %} <figcaption>Um exemplo de URL de CDN de imagem.</figcaption></figure>

Nessas situações, se o recurso que você busca for importante, você deseja economizar o máximo de tempo possível conectando-se previamente ao servidor. O navegador não fará o download do arquivo até que sua página o solicite, mas pelo menos pode lidar com os aspectos de conexão com antecedência, evitando que o usuário espere várias viagens de ida e volta.

### Streaming de mídia

Outro exemplo em que você pode querer economizar algum tempo na fase de conexão, mas não necessariamente começar a recuperar o conteúdo imediatamente, é ao fazer streaming de mídia de uma origem diferente.

Dependendo de como sua página lida com o conteúdo transmitido, você pode esperar até que seus scripts sejam carregados e estejam prontos para processar o fluxo. A pré-conexão ajuda a reduzir o tempo de espera para uma única viagem de ida e volta quando você estiver pronto para começar a buscar.

## Como implementar `rel=preconnect`

Uma forma de iniciar uma `preconnect` é adicionar uma tag `<link>` ao `<head>` do documento.

```html
<head>
    <link rel="preconnect" href="https://example.com">
</head>
```

A pré-conexão só é eficaz para domínios diferentes do domínio de origem, portanto, você não deve usá-la em seu site.

{% Aside 'caution' %} Faça a pré-conexão apenas a domínios críticos que você usará em breve, porque o navegador fecha qualquer conexão que não seja usada em 10 segundos. A pré-conexão desnecessária pode atrasar outros recursos importantes, portanto, limite o número de domínios pré-conectados e [teste o impacto da pré-conexão](https://andydavies.me/blog/2019/08/07/experimenting-with-link-rel-equals-preconnect-using-custom-script-injection-in-webpagetest/). {% endAside %}

Você também pode iniciar uma pré-conexão por meio do [cabeçalho HTTP `Link`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link):

`Link: <https://example.com/>; rel=preconnect`

{% Aside %} Um benefício de especificar uma dica de pré-conexão no cabeçalho HTTP é que ele não depende da análise de marcação e pode ser acionado por solicitações de folhas de estilo, scripts e muito mais. Por exemplo, o Google Fonts envia um `Link` na resposta da folha de estilo para se conectar ao domínio que hospeda os arquivos de fontes. {% endAside %}

Alguns tipos de recursos, como fontes, são carregados no [modo anônimo](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements). Para aqueles, você deve definir o `crossorigin` com a dica de `preconnect`

```html
<link rel="preconnect" href="https://example.com/ComicSans" crossorigin>
```

Se você omitir o `crossorigin`, o navegador executará apenas a consulta DNS.

## Resolva o nome de domínio antecipadamente com `rel=dns-prefetch`

Você se lembra dos sites por seus nomes, mas os servidores se lembram deles por endereços IP. É por isso que existe o sistema de nomes de domínio (DNS). O navegador usa DNS para converter o nome do site em um endereço IP. Esse processo [- resolução de nome de domínio](https://hacks.mozilla.org/2018/05/a-cartoon-intro-to-dns-over-https/) - é a primeira etapa para estabelecer uma conexão.

Se uma página precisa fazer conexões com muitos domínios de terceiros, pré-conectar todos eles é contraproducente. A dica `preconnect` é melhor usada apenas para as conexões mais críticas. Para todo o resto, use `<link rel=dns-prefetch>` para economizar tempo na primeira etapa, a pesquisa de DNS, que geralmente leva cerca de [20-120 ms](https://www.keycdn.com/support/reduce-dns-lookups).

A resolução de DNS é iniciada de forma semelhante à `preconnect`: adicionando uma tag `<link>` ao `<head>` do documento.

```html
<link rel="dns-prefetch" href="http://example.com">
```

[O suporte do navegador para `dns-prefetch`](https://caniuse.com/#search=dns-prefetch) é um pouco diferente do [suporte](https://caniuse.com/#search=preconnect) [`preconnect`](https://caniuse.com/#search=preconnect), então `dns-prefetch` pode servir como um substituto para navegadores que não oferecem suporte para `preconnect`.

{% Compare 'better' %}

```html
<link rel="preconnect" href="http://example.com">
<link rel="dns-prefetch" href="http://example.com">
```

{% CompareCaption %} Para implementar com segurança a técnica de fallback, use tags de link separadas. {% endCompareCaption %}

{% endCompare %}

{% Compare 'worse' %}

```html
<link rel="preconnect dns-prefetch" href="http://example.com">
```

{% CompareCaption %} Implementar um fallback `dns-prefetch` na mesma `<link>` causa um bug no Safari em que a `preconnect` é cancelada. {% endCompareCaption %}

{% endCompare %}

## Conclusão

Essas duas dicas de recursos são úteis para melhorar a velocidade da página quando você sabe que fará o download de algo de um domínio de terceiros em breve, mas não sabe o URL exato do recurso. Os exemplos incluem CDNs que distribuem bibliotecas, imagens ou fontes JavaScript. Esteja atento às restrições, use a `preconnect` apenas para os recursos mais importantes, conte com `dns-prefetch` para o resto e sempre meça o impacto no mundo real.
