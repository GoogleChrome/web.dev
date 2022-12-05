---
layout: post
title: O documento não tem uma meta description
description: |2-

  Saiba mais sobre a auditoria Lighthouse "O documento não tem uma meta description".
date: 2019-05-02
updated: 2021-04-08
web_lighthouse:
  - meta-description
---

O elemento `<meta name="description">` fornece um resumo do conteúdo de uma página que os mecanismos de pesquisa incluem nos resultados da busca. Uma descrição meta exclusiva e de alta qualidade torna sua página mais relevante e pode aumentar o tráfego de pesquisa.

## Como a auditoria de meta description do Lighthouse falha

O Lighthouse sinaliza páginas que não têm uma meta description:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dtMQ12xujHMJGuEwZ413.png", alt="Auditoria Lighthouse mostrando que o documento não tem uma meta description", width="800", height="74" %}</figure>

A auditoria falha se:

- Sua página não tiver um elemento `<meta name=description>` .
- O atributo `content` do elemento `<meta name=description>` estiver vazio.

O Lighthouse não avalia a qualidade da sua descrição.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Como adicionar uma meta description

Adicione um elemento `<meta name=description>` ao `<head>` de cada uma de suas páginas:

```html
<meta name="description" content="Put your description here.">
```

Se for apropriado, inclua fatos marcados com clareza nas descrições. Por exemplo:

```html
<meta name="description" content="Author: A.N. Author,
    Illustrator: P. Picture, Category: Books, Price: $17.99,
    Length: 784 pages">
```

## Práticas recomendadas para uso da meta description

- Use uma descrição única para cada página.
- Faça descrições claras e concisas. Evite descrições vagas como "Casa".
- Evite o [excesso de palavras-chave](https://support.google.com/webmasters/answer/66358). Isto não ajuda os usuários e os mecanismos de pesquisa podem marcar a página como spam.
- As descrições não precisam ser frases completas; elas podem conter dados estruturados.

Aqui estão alguns exemplos de descrições boas e ruins:

{% Compare 'worse' %}

```html
<meta name="description" content="A donut recipe.">
```

{% CompareCaption %} Vaga demais. {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```html
<meta
  name="description"
  content="Mary's simple recipe for maple bacon donuts
           makes a sticky, sweet treat with just a hint
           of salt that you'll keep coming back for.">
```

{% CompareCaption %} Descritiva e concisa. {% endCompareCaption %} {% endCompare %}

Veja o artigo do Google [Crie bons títulos e snippets em resultados de pesquisa](https://support.google.com/webmasters/answer/35624#1) para mais dicas.

## Recursos

- [O código-fonte da auditoria **Documento não tem meta description**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/meta-description.js)
- [Crie bons títulos e snippets em resultados de pesquisa](https://support.google.com/webmasters/answer/35624#1)
- [Palavras-chave irrelevantes](https://support.google.com/webmasters/answer/66358)
