---
layout: post
title: Sirva imagens em formatos modernos
description: Saiba mais sobre a auditoria uses-webp-images.
date: 2019-05-02
updated: 2020-05-29
codelabs:
  - codelab-serve-images-webp
web_lighthouse:
  - uses-webp-images
---

A seção Oportunidades de seu relatório Lighthouse lista todas as imagens em formatos mais antigos, mostrando a economia potencial obtida servindo versões AVIF dessas imagens:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/VmK3YIRiXNjbzEXxx1Ix.png", alt="Uma captura de tela da auditoria Lighthouse Sirva imagens em formatos modernos", width="800", height="306" %}</figure>

## Por que servir imagens no formato AVIF ou WebP?

AVIF e WebP são formatos de imagem que têm características de compressão e qualidade superiores em comparação com seus equivalentes JPEG e PNG mais antigos. Codificar suas imagens nesses formatos em vez de JPEG ou PNG significa que elas carregarão mais rápido e consumirão menos dados de celular.

O formato AVIF é suportado no Chrome, Firefox e Opera e oferece tamanhos de arquivo menores em comparação com outros formatos com as mesmas configurações de qualidade. Veja o [Codelab Servindo imagens AVIF](https://codelabs.developers.google.com/codelabs/avif) para mais informações sobre AVIF.

O WebP é suportado nas versões mais recentes do Chrome, Firefox, Safari, Edge e Opera e oferece melhor compactação com e sem perdas para imagens na web. Veja [Um novo formato de imagem para a Web](https://developers.google.com/speed/webp/) para mais informações sobre WebP.

{% Aside 'codelab' %} [Crie imagens WebP com a linha de comando](/codelab-serve-images-webp) {% endAside %}

## Como o Lighthouse calcula a economia potencial

O Lighthouse coleta cada imagem BMP, JPEG e PNG da página, converte cada uma em WebP e estima o tamanho do arquivo AVIF, relatando a economia potencial com base nos números de conversão.

{% Aside 'note' %} O Lighthouse omite a imagem de seu relatório se a economia potencial for inferior a 8 KiB. {% endAside %}

## Compatibilidade de navegadores

O formato WebP é suportado pelas versões mais recentes do Chrome, Firefox, Safari, Edge e Opera, enquanto o suporte para AVIF é mais limitado. Você precisará servir uma imagem PNG ou JPEG de fallback para suporte a navegadores mais antigos. Veja [Como posso detectar o suporte do navegador a WebP?](https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp) para uma visão geral das técnicas de fallback e a lista abaixo para suporte de navegador de formatos de imagem.

Para conhecer o suporte atual de navegadores para cada formato moderno, verifique os links abaixo:

- [AVIF](https://caniuse.com/#feat=avif)
- [WebP](https://caniuse.com/#feat=webp)

## Orientações para pilhas específicas

### AMP

Considere exibir todos os componentes [`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites) em formatos WebP enquanto [especifica um fallback apropriado](https://amp.dev/documentation/components/amp-img/#specify-a-fallback-image) para outros navegadores.

### Drupal

Considere instalar e configurar [um módulo para aproveitar os formatos de imagem WebP](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=webp&solrsort=iss_project_release_usage+desc&op=Search) em seu site. Esses módulos geram automaticamente uma versão WebP de suas imagens carregadas para otimizar os tempos de carregamento.

### Joomla

Considere o uso de um [plugin](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=webp) ou serviço que irá converter automaticamente suas imagens carregadas para os formatos ideais.

### Magento

Considere pesquisar no [Magento Marketplace](https://marketplace.magento.com/catalogsearch/result/?q=webp) por uma variedade de extensões de terceiros para aproveitar os formatos de imagem mais recentes.

### WordPress

Considere o uso de um [plugin](https://wordpress.org/plugins/search/convert+webp/) ou serviço que irá converter automaticamente suas imagens carregadas para os formatos ideais.

## Recursos

- [Código-fonte para a auditoria **Sirva imagens em formatos modernos**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/modern-image-formats.js)
- [Use imagens WebP](/serve-images-webp)

<!-- https://www.reddit.com/r/webdev/comments/gspjwe/serve_images_in_nextgen_formats/ -->
