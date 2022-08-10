---
layout: post
title: Os links não têm um nome discernível
description: |2-

  Saiba como tornar os links em sua página da web mais acessíveis por

  certificando-se de que eles têm nomes que podem ser interpretados por tecnologias assistivas.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - nome do link
---

O texto do link que é discernível, exclusivo e focalizável melhora a experiência de navegação para usuários de leitores de tela e outras tecnologias de assistência.

## Como esta auditoria Lighthouse falha

O Lighthouse sinaliza links que não têm nomes discerníveis:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6enCwSloHJSyylrNIUF4.png", alt="Auditoria do Lighthouse mostrando que os links não têm nomes discerníveis", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como adicionar nomes acessíveis a links

Semelhante aos botões, os links obtêm seu nome acessível principalmente de seu conteúdo de texto. Evite palavras de preenchimento como "Aqui" ou "Leia mais"; em vez disso, coloque o texto mais significativo no próprio link:

```html
Confira <a href="…">nosso guia sobre como criar páginas da web acessíveis</a>.
</html>
```

Saiba mais em [Rotule botões e links](/labels-and-text-alternatives#label-buttons-and-links) .

## Recursos

- [O código-fonte para **links não tem uma** auditoria de nome discernível](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/link-name.js)
- [Os links devem ter texto discernível (Deque University)](https://dequeuniversity.com/rules/axe/3.3/link-name)
