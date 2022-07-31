---
layout: post
title: Os botões não têm um nome acessível
description: |2

  Aprenda como melhorar a acessibilidade de sua página da web certificando-se de que

  todos os botões têm nomes que os usuários de tecnologia de assistência podem acessar.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - nome do botão
---

Quando um botão não tem um nome acessível, os leitores de tela e outras tecnologias de assistência o anunciam como um *botão*, que não fornece informações aos usuários sobre o que o botão faz.

## Como a auditoria do nome do botão Lighthouse falha

O Lighthouse sinaliza botões que não têm conteúdo de texto ou uma propriedade `aria-label`

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/evoQAq4c1CBchwNMl9Uq.png", alt="Auditoria do Lighthouse mostrando os botões de captura de tela não têm um nome acessível", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como adicionar nomes acessíveis aos botões

Para botões com rótulos visíveis, adicione conteúdo de texto ao elemento de `button` Faça do rótulo uma frase de chamariz clara. Por exemplo:

```html
<button>Book room</button>
```

Para botões sem rótulos visíveis, como botões de ícone, use o `aria-label` para descrever claramente a ação para qualquer pessoa que use uma tecnologia de assistência, por exemplo:

{% Glitch {id: 'lh-botão-nome', caminho: 'index.html', previewSize: 0, height: 480}%}

{% Aside %} Este aplicativo de amostra depende da [fonte de ícone](https://google.github.io/material-design-icons/) do Google Material, que usa [ligaduras](https://alistapart.com/article/the-era-of-symbol-fonts/) para converter o texto interno dos botões em glifos de ícone. As tecnologias assistivas se referem ao `aria-label` vez dos glifos do ícone ao anunciar os botões. {% endAside %}

Consulte também [Botões e links de rótulos](/labels-and-text-alternatives#label-buttons-and-links).

## Recursos

- [O código-fonte da auditoria **Botões não têm nome acessível**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/button-name.js)
- [Os botões devem ter texto discernível (Deque University)](https://dequeuniversity.com/rules/axe/3.3/button-name)
