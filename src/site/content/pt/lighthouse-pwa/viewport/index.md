---
layout: post
title: Não tem uma `<meta name =" viewport ">` tag com `largura` ou` escala inicial`
description: |2-

  Saiba mais sobre a tag "não tem uma <meta name =" viewport "> tag com largura ou
  escala inicial" Auditoria Lighthouse.
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - viewport
---

Muitos mecanismos de pesquisa classificam as páginas com base no grau de compatibilidade com dispositivos móveis. Sem uma [viewport meta tag](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) , os dispositivos móveis renderizam as páginas em larguras de tela típicas de desktops e, em seguida, reduzem as páginas, tornando-as difíceis de ler.

Definir a viewport meta tag permite controlar a largura e a escala da janela de visualização para que ela seja dimensionada corretamente em todos os dispositivos.

## Como a auditoria da meta tag viewport do Lighthouse falha

[O Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza as páginas sem uma meta tag da janela de visualização:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g9La56duNlpHZntDnzY9.png", alt = "A auditoria lighthouse mostra que a página está sem janela de visualização", width = "800", height = "76" %}</figure>

Uma página falha na auditoria, a menos que todas essas condições sejam atendidas:

- `<head>` do documento contém uma tag `<meta name="viewport">`
- A meta tag do viewport contém um atributo `content`
- O valor do atributo `content` inclui o texto `width=`.

O Lighthouse *não* verifica se `width` é igual a `device-width`. Também não verifica se há um par de valores-chave de `initial-scale`. No entanto, você ainda precisa incluir ambos para que sua página seja processada corretamente em dispositivos móveis.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como adicionar uma meta tag viewport

Adicione um viewport `<meta>` com os pares de valores-chave apropriados ao `<head>` de sua página:

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …
```

Aqui está o que cada par de valores-chave faz:

- `width=device-width` define o viewport com a largura do dispositivo.
- `initial-scale=1` define o nível de zoom inicial quando o usuário visita a página.

## Recursos

- [Source code for **Has a `<meta name="viewport">` tag with `width` or `initial-scale`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/viewport.js)
- [Noções básicas de web design responsivo](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#set-the-viewport)
- [Usando a meta tag viewport para controlar o layout em navegadores de celular](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)
