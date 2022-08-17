---
layout: post
title: Redimensione imagens corretamente
description: Saiba mais sobre a auditoria uses-responsive-images.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-responsive-images
---

A seção Oportunidades de seu relatório Lighthouse lista todas as imagens em sua página que não têm o tamanho adequado, junto com a economia potencial em [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte). Redimensione essas imagens para economizar dados e melhorar o tempo de carregamento da página:

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GK6XQhAJcjZsYJe8myka.png", alt="Uma captura de tela da auditoria Lighthouse Redimensione imagens corretamente", width="800", height="264" %}</figure>

## Como o Lighthouse calcula imagens superdimensionadas

Para cada imagem na página, o Lighthouse compara o tamanho da imagem renderizada com o tamanho da imagem real. O tamanho renderizado também leva em consideração a proporção de pixels do dispositivo. Se o tamanho renderizado for pelo menos 4 KB menor do que o tamanho real, a imagem será reprovada na auditoria.

## Estratégias para dimensionar imagens adequadamente

O ideal é que sua página nunca sirva imagens maiores do que a versão renderizada na tela do usuário. Qualquer coisa maior do que apenas resulta em bytes perdidos e diminui o tempo de carregamento da página.

A principal estratégia para servir imagens de tamanhos adequados é chamada de "imagens responsivas". Com imagens responsivas, você gera várias versões de cada imagem e, a seguir, especifica qual versão usar em seu HTML ou CSS usando media queries, dimensões da viewport e assim por diante. Veja [Sirva imagens responsivas](/serve-responsive-images) para saber mais.

[Os CDNs de imagem](/image-cdns/) são outra boa estratégia para servir imagens de tamanho apropriado. Você pode pensar em CDNs de imagem como APIs de serviços web para transformar imagens.

Outra estratégia é usar formatos de imagem vetoriais, como SVG. Com uma quantidade finita de código, uma imagem SVG pode ser redimensionada para qualquer tamanho. Veja [Substitua ícones complexos por SVG](/responsive-images/#replace-complex-icons-with-svg) para saber mais.

Ferramentas como [gulp-responsive](https://www.npmjs.com/package/gulp-responsive) ou [responsive-images-generator](https://www.npmjs.com/package/responsive-images-generator) podem ajudar a automatizar o processo de conversão de uma imagem em múltiplos formatos. Existem também CDNs de imagem que permitem gerar múltiplas versões, seja ao fazer upload de uma imagem ou ao solicitá-la em sua página.

## Orientações para pilhas específicas

### AMP

Use o suporte ao componente [`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites) [`srcset`](/use-srcset-to-automatically-choose-the-right-image/) para especificar quais ativos de imagem usar com base no tamanho da tela. Veja também [Imagens responsivas com srcset, sizes e heights](https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/art_direction/) .

### Angular

Considere o uso do [utilitário `BreakpointObserver`](https://material.angular.io/cdk/layout/overview) do Component Dev Kit (CDK) para gerenciar pontos de interrupção de imagem.

### Drupal

Use o recurso integrado [Responsive Image Styles](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) (disponível no Drupal 8 e superior) ao renderizar campos de imagem por meio de modos de visualização, visualizações ou imagens carregadas através do editor WYSIWYG.

### Gatsby

Use o plugin [gatsby-image](https://www.gatsbyjs.com/plugins/gatsby-image/) para gerar várias imagens menores para smartphones e tablets. Ele também pode criar placeholders de imagem SVG para carregamento lazy e eficiente.

### Joomla

Considere o uso de um [plugin para imagens responsivas](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=responsive%20images) .

### WordPress

Carregue imagens diretamente pela [biblioteca de mídia](https://wordpress.org/support/article/media-library-screen/) para garantir que os tamanhos de imagem necessários estejam disponíveis e, em seguida, insira-as da biblioteca de mídia ou use o widget de imagem para garantir que os tamanhos de imagem ideais sejam usados (incluindo aqueles para os breakpoints responsivos). Evite usar imagens `Full Size` a menos que as dimensões sejam adequadas para seu uso. Veja [Inserindo imagens em postagens e páginas](https://wordpress.org/support/article/inserting-images-into-posts-and-pages/).

## Recursos

- [Código fonte para a auditoria **Redimensione imagens corretamente**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-responsive-images.js)
- [Sirva imagens com dimensões corretas](/serve-images-with-correct-dimensions)
