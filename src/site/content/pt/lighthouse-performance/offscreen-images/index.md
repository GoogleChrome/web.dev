---
layout: post
title: Adie imagens offscreen
description: Aprenda sobre a auditoria imagens fora da tela.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - offscreen-images
---

A seção Oportunidades de seu relatório Lighthouse lista todas as imagens offscreen ou ocultas em sua página junto com a economia potencial em [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte). Considere o carregamento lazy dessas imagens depois que todos os recursos críticos terminarem de carregar para reduzir a métrica [Time to Interactive](/tti/) (tempo até interação):

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/agMyJtIarLruD8iuz0Mt.png", alt="Uma captura de tela da auditoria Lighthouse Defer offscreen images", width="800", height="416" %}</figure>

Veja também [Carregamento lazy de imagens offscreen com o codelab lazysizes](/codelab-use-lazysizes-to-lazyload-images).

## Orientações para pilhas específicas

### AMP

Carregue imagens automaticamente usando lazy loading com [`amp-img`](https://amp.dev/documentation/components/amp-img/). Veja o guia [Imagens](https://amp.dev/documentation/guides-and-tutorials/develop/media_iframes_3p/#images).

### Drupal

Instale [um módulo Drupal](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A67&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=%22lazy+load%22&solrsort=iss_project_release_usage+desc&op=Search) que possa carregar imagens usando carregamento lazy. Esses módulos fornecem a capacidade de adiar a carga de qualquer imagem offscreen para melhorar o desempenho.

### Joomla

Instale um [plugin Joomla de carregamento lazy](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=lazy%20loading) que forneça a capacidade de adiar qualquer imagem offscreen ou alterne para um modelo que forneça essa funcionalidade. A partir do Joomla 4.0, um plugin de carregamento lazy dedicado pode ser habilitado usando o plugin "Content - Lazy Loading Images". Considere também o uso de[um plug-in AMP](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=amp).

### Magento

Considere modificar seus modelos de produto e catálogo para usar o recurso de [carregamento lazy](/browser-level-image-lazy-loading/) da plataforma web.

### WordPress

Instale um [plug-in WordPress de lazy-loading](https://wordpress.org/plugins/search/lazy+load/) que forneça a capacidade de adiar qualquer imagem offscreen ou mude para um tema que forneça essa funcionalidade. Considere também o uso [do plug-in AMP](https://wordpress.org/plugins/amp/).

## Recursos

- [Código fonte para auditoria **Defer offscreen images**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/offscreen-images.js)
