---
layout: post
title: Use CDNs de imagem para otimizar imagens
authors:
  - katiehempenius
description: |-
  Os CDNs de imagem são excelentes para otimizar imagens.

  Mudar para um CDN de imagem pode gerar uma economia de 40 a 80% em bytes de imagens.
date: 2019-08-14
codelabs:
  - install-thumbor
tags:
  - performance
---

## Por que usar um CDN de imagem?

As redes de entrega de conteúdo de imagem (CDNs) são excelentes na otimização de imagens. Mudar para um CDN de imagem pode [resultar em uma economia de 40 a 80%](https://www.youtube.com/watch?v=YJGCZCaIZkQ&t=1010s) no tamanho do arquivo de imagem. Em teoria, é possível obter os mesmos resultados usando apenas scripts de construção, mas isso é raro na prática.

## O que é um CDN de imagem?

Os CDNs de imagens são especializados na transformação, otimização e entrega de imagens. Você também pode pensar neles como APIs para acessar e manipular as imagens usadas em seu site. Para imagens carregadas de um CDN de imagem, um URL de imagem indica não apenas qual imagem carregar, mas também parâmetros como tamanho, formato e qualidade. Isso facilita a criação de variações de uma imagem para diferentes casos de uso.

<figure>{% Img src="image/admin/OIF2VcXp8P6O7tQvw53B.jpg", alt="Mostra o fluxo de solicitação / resposta entre o CDN da imagem e o cliente. Parâmetros como tamanho e formato são usados para solicitar variações da mesma imagem.", width="800", height="408" %} <figcaption> Exemplos de transformações de CDNs de imagem podem ser executados com base em parâmetros em URLs de imagem.</figcaption></figure>

Os CDNs de imagem são diferentes dos scripts de otimização de imagem em tempo de criação, pois eles criam novas versões de imagens conforme necessário. Como resultado, os CDNs geralmente são mais adequados para criar imagens altamente customizadas para cada cliente individual do que os scripts de construção.

## Como os CDNs de imagem usam URLs para indicar opções de otimização

Os URLs de imagem usados por CDNs de imagem transmitem informações importantes sobre uma imagem e as transformações e otimizações que devem ser aplicadas a ela. Os formatos de URL variam de acordo com o CDN da imagem, mas, em geral, todos têm recursos semelhantes. Vamos examinar alguns dos recursos mais comuns.

<figure>{% Img src="image/admin/GA4udXeYUEjHSY4N0Qew.jpg", alt="URLs de imagem normalmente consistem nos seguintes componentes: origem, imagem, chave de segurança e transformações.", width="800", height="127" %}</figure>

### Origem

Um CDN de imagem pode residir em seu próprio domínio ou no domínio de seu CDN de imagem. Os CDNs de imagens de terceiros geralmente oferecem a opção de usar um domínio personalizado mediante o pagamento de uma taxa. Usar seu próprio domínio facilita a troca de CDNs de imagem posteriormente, porque nenhuma alteração de URL será necessária.

O exemplo acima usa o domínio do CDN de imagem ("example-cdn.com") com um subdomínio personalizado em vez de um domínio personalizado.

### Imagem

Os CDNs de imagem geralmente podem ser configurados para recuperar automaticamente imagens de seus locais existentes quando necessário. Esse recurso geralmente é obtido incluindo o URL completo da *imagem existente* dentro do URL para a imagem gerada pelo CDN de imagem. Por exemplo, você pode ver um URL parecido com este: `https://my-site.example-cdn.com/https://flowers.com/daisy.jpg/quality=auto` . Este URL recuperaria e otimizaria a imagem em `https://flowers.com/daisy.jpg`.

Outra forma amplamente aceita de enviar imagens para um CDN de imagem é enviá-las por meio de uma solicitação HTTP POST para a API do CDN de imagem.

### Chave de segurança

Uma chave de segurança impede que outras pessoas criem novas versões de suas imagens. Se esse recurso estiver ativado, cada nova versão de uma imagem exigirá uma chave de segurança exclusiva. Se alguém tentar alterar os parâmetros do URL da imagem mas não fornecer uma chave de segurança válida, não será possível criar uma nova versão. Seu CDN de imagem cuidará dos detalhes de geração e rastreamento das chaves de segurança para você.

### Transformações

Os CDNs de imagem oferecem dezenas, e em alguns casos centenas de diferentes transformações de imagem. Essas transformações são especificadas por meio da string de URL e não há restrições sobre o uso de várias transformações ao mesmo tempo. No contexto de desempenho na web, as transformações de imagem mais importantes são tamanho, densidade de pixels, formato e compactação. Essas transformações são o motivo pelo qual alternar para um CDN de imagem normalmente resulta em uma redução significativa no tamanho da imagem.

Tende a ser uma configuração objetivamente melhor para transformações de desempenho, portanto, alguns CDNs de imagem suportam um modo "automático" para essas transformações. Por exemplo, em vez de especificar que as imagens sejam transformadas no formato WebP, você pode permitir que o CDN selecione automaticamente e forneça o formato ideal. Os sinais que um CDN de imagem pode usar para determinar a melhor maneira de transformar uma imagem incluem:

- [Dicas do cliente](https://developer.chrome.com/blog/automating-resource-selection-with-client-hints/) (por exemplo, largura da janela de visualização, DPR e largura da imagem)
- O cabeçalho [`Save-Data`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Save-Data)
- O cabeçalho da solicitação [User-Agent](https://developer.mozilla.org/docs/Web/HTTP/Headers/User-Agent)
- A [API de informações de rede](https://developer.mozilla.org/docs/Web/API/Network_Information_API)

Por exemplo, a imagem CDN pode servir JPEG XR para um navegador Edge, WebP para um navegador Chrome e JPEG para um navegador muito antigo. As configurações automáticas são populares porque permitem que você aproveite a experiência significativa dos CDNs de imagem na otimização de imagens sem a necessidade de alterações de código para adotar novas tecnologias, uma vez que são suportadas pelo CDN de imagem.

## Tipos de CDNs de imagem

Os CDNs de imagem podem ser divididos em duas categorias: autogerenciados e gerenciados por terceiros.

### CDNs de imagem autogerenciados

Os CDNs autogerenciados podem ser uma boa escolha para sites com uma equipe de engenharia que se sente confortável em manter sua própria infraestrutura.

[Thumbor](https://github.com/thumbor/thumbor) é o único CDN de imagem autogerenciado disponível atualmente. Embora seja de código aberto e de uso gratuito, geralmente tem menos recursos do que a maioria dos CDNs comerciais e sua documentação é um tanto limitada. [Wikipedia](https://wikitech.wikimedia.org/wiki/Thumbor) , [Square](https://medium.com/square-corner-blog/dynamic-images-with-thumbor-a430a1cfcd87) e [99designs](https://99designs.com/tech-blog/blog/2013/07/01/thumbnailing-with-thumbor/) são três sites que usam o Thumbor. Consulte o artigo [Como instalar o CDN da imagem Thumbor](/install-thumbor) para obter instruções sobre como configurá-lo.

### CDNs de imagem de terceiros

Os CDNs de imagem de terceiros fornecem CDNs de imagem como um serviço. Assim como os provedores de nuvem fornecem servidores e outras infraestruturas mediante uma taxa. Os CDNs de imagens fornecem otimização e entrega de imagens mediante o pagamento de uma taxa. Como os CDNs de imagem de terceiros mantêm a tecnologia subjacente, o início é bastante simples e geralmente pode ser realizado em 10 a 15 minutos, embora uma migração completa para um site grande possa demorar muito mais. Os CDNs de imagem de terceiros são normalmente cobrados com base nas camadas de uso, com a maioria dos CDNs de imagem fornecendo uma camada gratuita ou uma avaliação gratuita para dar a você a oportunidade de experimentar seu produto.

## Escolhendo um CDN de imagem

Existem muitas opções boas para CDNs de imagem. Alguns contam com mais recursos do que outros, mas todos provavelmente irão ajudar você a economizar bytes em suas imagens e, portanto, carregar suas páginas mais rápido. Além dos conjuntos de recursos, outros fatores a serem considerados ao escolher um CDN de imagem são custo, suporte, documentação e facilidade de configuração ou migração.

Experimentá-los antes de tomar uma decisão também pode ser útil. Abaixo você pode encontrar codelabs com instruções sobre como começar rapidamente com vários CDNs de imagem.
