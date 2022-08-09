---
layout: post
title: Garanta que o texto permanece visível durante o carregamento das fontes web
description: Aprenda a usar a API font-display para garantir que o texto da sua página web estará sempre visível para seus usuários.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - font-display
---

As fontes geralmente são arquivos grandes que demoram um pouco para carregar. Alguns navegadores ocultam o texto até que a fonte carregue, causando um [flash de texto invisível (Flash Of Invisible Text - FOIT)](/avoid-invisible-text) .

## Como falha a auditoria de exibição de fontes do Lighthouse

[O Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza todas as URLs de fonte que podem ocultar texto invisível:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/251Gbh9tn89GDJY289zZ.png", alt="Uma captura de tela da auditoria Lighthouse Garanta que o texto permanece visível durante a carga de fontes de web", width="800", height="430" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como evitar mostrar texto invisível

A maneira mais fácil de evitar a exibição de texto invisível durante o carregamento de fontes personalizadas é mostrar temporariamente uma fonte do sistema. Ao incluir `font-display: swap` no seu estilo `@font-face`, você pode evitar FOIT na maioria dos navegadores modernos:

```css
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
}
```

A API [font-display](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) especifica como uma fonte é exibida. `swap` informa ao navegador que o texto usando a fonte deve ser exibido imediatamente usando uma fonte do sistema. Assim que a fonte personalizada estiver pronta, ela substituirá a fonte do sistema. (Veja [Evite texto invisível durante o carregamento](/avoid-invisible-text) para mais informações.)

### Pré-carregue as fontes da web

Use `<link rel="preload" as="font">` para baixar seus arquivos de fonte com antecedência. Saiba mais:

- [Pré-carregue fontes da web para melhorar a velocidade de carregamento (codelab)](/codelab-preload-web-fonts/)
- [Evite mudanças de layout e flashes de texto invisível (FOIT) pré-carregando fontes opcionais](/preload-optional-fonts/)

### Google Fonts

Adicione o <a>parâmetro</a> <code>&amp;display=swap</code> ao final da URL do Google Fonts:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
```

## Suporte de navegador

Vale a pena mencionar que nem todos os principais navegadores suportam `font-display: swap`, então você poderá ter que trabalhar um pouco mais para consertar o problema do texto invisível.

{% Aside 'codelab' %} Confira o codelab [Evite flashes de texto invisível](/codelab-avoid-invisible-text) para aprender como evitar FOIT em todos os navegadores. {% endAside %}

## Orientações específicas para diferentes pilhas

### Drupal

Especifique `@font-display` ao definir fontes personalizadas em seu tema.

### Magento

Especifique `@font-display` ao [definir fontes personalizadas](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/css-topics/using-fonts.html) .

## Recursos

- [Código-fonte para a auditoria **Garanta que o texto permanece visível durante a carga de fontes da web**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/font-display.js)
- [Evite texto invisível durante o carregamento](/avoid-invisible-text)
- [Controlando o desempenho da fonte com font-display](https://developers.google.com/web/updates/2016/02/font-display)
- [Pré-carregue fontes da web para melhorar a velocidade de carregamento (codelab)](/codelab-preload-web-fonts/)
- [Evite mudanças de layout e flashes de texto invisível (FOIT) pré-carregando fontes opcionais](/preload-optional-fonts/)
