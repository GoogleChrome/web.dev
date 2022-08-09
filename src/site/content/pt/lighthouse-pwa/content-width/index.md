---
layout: post
title: O conteúdo não está dimensionado corretamente para a janela de visualização
description: |2

  Aprenda como dimensionar o conteúdo da sua página da web para caber em telas de dispositivos móveis.
web_lighthouse:
  - largura do conteúdo
date: 2019-05-04
updated: 2019-09-19
---

A janela de visualização é a parte da janela do navegador na qual o conteúdo da sua página é visível. Quando a largura do conteúdo da sua página é menor ou maior do que a largura da janela de visualização, ela pode não ser renderizada corretamente nas telas de dispositivos móveis. Por exemplo: se a largura do conteúdo for muito grande, o conteúdo pode ser reduzido para caber, tornando o texto difícil de ler.

## Como a auditoria de largura de conteúdo do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza páginas cuja largura não é igual à largura da janela de visualização:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y8JKlbJTu7ERetHUGuaA.png", alt="Auditoria do Lighthouse mostrando conteúdo não dimensionado corretamente para a janela de visualização", width="800", height="98" %}</figure>

A auditoria falhará se `window.innerWidth` não for igual a `window.outerWidth` .

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como ajustar sua página em telas de celular

Esta auditoria é uma forma indireta de determinar se sua página está otimizada para dispositivos móveis. Consulte os [Princípios básicos do design responsivo da Web](/responsive-web-design-basics/) do Google para obter uma visão geral de como criar uma página compatível com dispositivos móveis.

Você pode ignorar esta auditoria se:

- Seu site não precisa ser otimizado para telas de dispositivos móveis.
- A largura do conteúdo da sua página é intencionalmente menor ou maior do que a largura da janela de visualização.

## Recursos

- [O código-fonte do **conteúdo não está dimensionado corretamente para a** auditoria da janela de visualização](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/content-width.js)
- [Noções básicas de web design responsivo](/responsive-web-design-basics/)
