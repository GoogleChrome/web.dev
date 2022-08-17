---
layout: post
title: Codifique imagens de forma eficiente
description: |2

  Saiba mais sobre a auditoria de imagens otimizadas de uso.
date: 2019-05-02
updated: 2019-06-20
web_lighthouse:
  - usa imagens otimizadas
---

A seção Oportunidades no seu relatório Lighthouse lista todas as imagens não otimizadas, com economia potencial em [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte). Otimize essas imagens para que a página carregue mais rápido e consuma menos dados:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZbPSZtjpa7j4I1k8DylI.png", alt="Uma captura de tela da auditoria de codificação de imagens do Lighthouse com eficiência", width="800", height="263" %}</figure>

## Como o Lighthouse sinaliza imagens como otimizáveis

O Lighthouse coleta todas as imagens JPEG ou BMP da página, define o nível de compactação de cada imagem como 85 e compara a versão original com a versão compactada. Se a economia potencial for de 4 KB ou mais, o Lighthouse sinaliza a imagem como otimizável.

## Como otimizar imagens

Existem várias etapas que você pode seguir para otimizar suas imagens, incluindo:

- [Usar CDNs de imagem](/image-cdns/)
- [Compactar imagens](/use-imagemin-to-compress-images)
- [Substituir GIFs animados por vídeo](/replace-gifs-with-videos)
- [Remover imagens de carregamento lento](/use-lazysizes-to-lazyload-images)
- [Veicular imagens responsivas](/serve-responsive-images)
- [Veicular imagens com dimensões corretas](/serve-images-with-correct-dimensions)
- [Usar imagens WebP](/serve-images-webp)

## Otimize imagens usando ferramentas de GUI

Outra abordagem é executar suas imagens por meio de um otimizador que você instala em seu computador e executa como uma GUI. Por exemplo, com [ImageOptim,](https://imageoptim.com/mac) você arrasta e solta imagens em sua interface do usuário e, em seguida, ele as compacta automaticamente sem comprometer a qualidade de forma visível. Se você administra um site pequeno e pode otimizar manualmente todas as imagens, provavelmente essa opção é boa o bastante.

[Squoosh](https://squoosh.app/) é outra opção. Squoosh é mantido pela equipe do Google Web DevRel.

## Orientação específica para pilha

### Drupal

Considere o uso de [um módulo](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=optimize+images&solrsort=iss_project_release_usage+desc&op=Search) que otimiza e reduz automaticamente o tamanho das imagens carregadas pelo site, mantendo a qualidade. Além disso, use os [estilos de imagem responsivos](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) integrados do Drupal (disponível no Drupal 8 e mais recente), para todas as imagens renderizadas no site.

### Joomla

Considere o uso de um [plug-in de otimização de imagem](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance) que compacta suas imagens enquanto mantém a qualidade.

### Magento

Considere o uso de uma [extensão de terceiros para o Magento, que otimiza as imagens](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image).

### WordPress

Considere o uso de um [plug-in de otimização de imagem para o WordPress](https://wordpress.org/plugins/search/optimize+images/), que compacta suas imagens enquanto mantém a qualidade.

## Recursos

- [Código-fonte para auditoria de **imagens com codificação eficiente**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-optimized-images.js)
