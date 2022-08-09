---
layout: post
title: Os elementos da imagem não têm atributos `[alt]`
description: |2

  Aprenda como garantir que os usuários de tecnologia assistiva possam acessar o seu

  imagens, fornecendo texto alternativo.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - imagem-alt
---

Os elementos informativos devem ter como objetivo um texto alternativo curto e descritivo. Os elementos decorativos podem ser ignorados com um atributo alt vazio.

## Como a auditoria do Lighthouse de texto alternativo de imagem falha

Elementos de sinalizadores de farol `<img>` que não têm atributos `alt`

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hb8ypHK5xwmtUZwdxyQG.png", alt="Auditoria do farol mostrando<img> os elementos não têm atributos alt", width="800", height="206"%}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como adicionar texto alternativo às imagens

Fornece um `alt` para cada elemento `<img>` Se a imagem não carregar, o `alt` é usado como um espaço reservado para que os usuários tenham uma ideia do que a imagem estava tentando transmitir. (Consulte também [Incluir alternativas de texto para imagens e objetos](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects).)

A maioria das imagens deve ter um texto curto e descritivo:

```html
<img alt="Audits set-up in Chrome DevTools" src="...">
```

Se a imagem atuar como decoração e não fornecer nenhum conteúdo útil, atribua a ela um `alt=""` vazio para removê-la da árvore de acessibilidade:

```html
<img src="background.png" alt="">
```

{% Aside 'note' %} Você também pode usar rótulos ARIA para descrever suas imagens, por exemplo, `<img aria-label="Audits set-up in Chrome DevTools" src="...">` Consulte também [Usando o atributo aria-label](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) e [Usando o atributo aria-labelledby](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute). {% endAside %}

## Dicas para escrever um texto `alt`

- `alt` o texto alternativo deve fornecer a intenção, o propósito e o significado da imagem.
- Os usuários cegos devem obter tanta informação do texto alternativo quanto um usuário vidente obtém da imagem.
- Evite palavras não específicas como "gráfico", "imagem" ou "diagrama".

Saiba mais no [guia de texto alternativo do WebAIM](https://webaim.org/techniques/alttext/) .

## Recursos

- [Código fonte para **Elementos de imagem não possui auditoria de atributos `[alt]`**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/image-alt.js)
- [As imagens devem ter um texto alternativo (Universidade Deque)](https://dequeuniversity.com/rules/axe/3.3/image-alt)
