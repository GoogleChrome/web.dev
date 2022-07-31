---
layout: post
title: '`[user-scalable =" no "]` é usado no elemento `<meta name =" viewport ">` ou o atributo `[maximum-scale]` é menor que `5`'
description: |2

  Saiba como tornar sua página da web mais acessível, certificando-se de que o navegador

  o zoom não está desabilitado.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - meta-viewport
---

O `user-scalable="no"` para o elemento `<meta name="viewport">` desativa o zoom do navegador em uma página da web. O `maximum-scale` limita o quanto o usuário pode aplicar zoom. Ambos são problemáticos para usuários com baixa visão que dependem do zoom do navegador para ver o conteúdo de uma página da web.

## Como a auditoria de zoom do navegador Lighthouse falha

O farol sinaliza as páginas que desabilitam o zoom do navegador:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/84cMMpBDm0rDl6hQISci.png", alt="A auditoria do Lighthouse mostrando a janela de visualização desativa o dimensionamento e o zoom do texto", width="800", height="227" %}</figure>

Uma página falha na auditoria se contiver uma `<meta name="viewport">` com um dos seguintes:

- Um atributo de `content` com um parâmetro `user-scalable="no"`
- Um atributo de `content` `maximum-scale` definido para menos de `5`

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como evitar a desativação do zoom do navegador

Remova o `user-scalable="no"` da metatag da janela de visualização e certifique-se de que o `maximum-scale` esteja definido como `5` ou mais.

## Recursos

- [O código-fonte para a auditoria **`[user-scalable="no"]` é usado no elemento `<meta name="viewport">` ou o `[maximum-scale]` é inferior a 5**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/meta-viewport.js)
- [O zoom e o dimensionamento não devem ser desativados (Deque University)](https://dequeuniversity.com/rules/axe/3.3/meta-viewport)
