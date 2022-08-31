---
title: Os elementos `<frame>` ou `<iframe>` não têm um título
layout: post
description: Saiba como garantir que as tecnologias de assistência possam apresentar corretamente o conteúdo do frame em sua página da web, dando títulos a todos os elementos do frame.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - frame-title
---

Os usuários de leitores de tela e outras tecnologias de assistência contam com títulos de frames para descrever o conteúdo dos frames. Navegar por frames e frames embutidos pode rapidamente se tornar difícil e confuso para usuários de tecnologia assistiva se os frames não estiverem marcados com um atributo de título.

## Como a auditoria do título do frame do Lighthouse falha

O Lighthouse sinaliza os elementos `<frame>` e `<iframe>` que não têm títulos:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vlHxWKrB3ESjPfmLbuwL.png", alt = "Auditoria do Lighthouse mostrando que frame ou iframe não tem um elemento de título", width = "800", height = "185"%}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como adicionar títulos a frames e iframes

Fornecer atributos únicos e descritivos `title` para todos os elementos de `frame` e `iframe`.

Além disso, a prática recomendada é dar ao documento fechado um elemento de título com conteúdo idêntico ao atributo title. Por exemplo:

```html
<iframe title="My Daily Marathon Tracker" src="https://www.mydailymarathontracker.com/"></iframe>
```

## Dicas para criar títulos de frames descritivos

- Conforme mencionado anteriormente, dê ao documento fechado um elemento de título com conteúdo idêntico ao atributo de título.
- Substitua os títulos de espaço reservado, como "frame sem título", por uma frase mais apropriada.
- Torne cada título único. Não duplique títulos, mesmo que sejam semelhantes.

Saiba mais em [Escrever títulos descritivos, descrições e texto de link para cada página](/write-descriptive-text) .

## Recursos

- [O código-fonte dos **elementos `<frame>` ou `<iframe>` não tem** auditoria de título](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/frame-title.js)
- [Rotular documentos e frames](/labels-and-text-alternatives#label-documents-and-frames)
- [Os frames devem ter o atributo title (Deque University)](https://dequeuniversity.com/rules/axe/3.3/frame-title)
