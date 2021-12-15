---
layout: post-old
title: Os elementos da imagem não têm atributos `[alt]`
description: |2

  Aprenda como garantir que os usuários de tecnologia assistiva possam acessar o seu

  imagens, fornecendo texto alternativo.
date: '2019-05-02'
updated: '2019-09-19'
web_lighthouse:
  - imagem-alt
---

Os elementos informativos devem ter como objetivo um texto alternativo curto e descritivo. Os elementos decorativos podem ser ignorados com um atributo alt vazio.

## How the Lighthouse image alternative text audit fails

Elementos de sinalizadores de farol `<img>` que não têm atributos `alt`

<figure class="w-figure">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hb8ypHK5xwmtUZwdxyQG.png", alt="Lighthouse audit showing <img> elements do not have alt attributes", width="800", height="206", class="w-screenshot" %} </figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como adicionar texto alternativo às imagens

Provide an `alt` attribute for every `<img>` element. If the image fails to load, the `alt` text is used as a placeholder so users have a sense of what the image was trying to convey. (See also [Include text alternatives for images and objects](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects).)

A maioria das imagens deve ter um texto curto e descritivo:

```html
<img alt="Audits set-up in Chrome DevTools" src="...">
```

Se a imagem atuar como decoração e não fornecer nenhum conteúdo útil, atribua a ela um `alt=""` vazio para removê-la da árvore de acessibilidade:

```html
<img src="background.png" alt="">
```

{% Aside 'note' %} You can also use ARIA labels to describe your images, for example, `<img aria-label="Audits set-up in Chrome DevTools" src="...">` See also [Using the aria-label attribute](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) and [Using the aria-labelledby attribute](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute). {% endAside %}

## Dicas para escrever um texto `alt`

- `alt` text should give the intent, purpose, and meaning of the image.
- Os usuários cegos devem obter tanta informação do texto alternativo quanto um usuário vidente obtém da imagem.
- Evite palavras não específicas como "gráfico", "imagem" ou "diagrama".

Saiba mais no [guia de texto alternativo do WebAIM](https://webaim.org/techniques/alttext/) .

## Recursos

- [Source code for **Image elements do not have `[alt]` attributes** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/image-alt.js)
- [As imagens devem ter um texto alternativo (Universidade Deque)](https://dequeuniversity.com/rules/axe/3.3/image-alt)
