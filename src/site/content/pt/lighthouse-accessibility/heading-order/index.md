---
layout: post
title: Os elementos de título não estão em ordem decrescente sequencial
description: |2-

  Aprenda a garantir que os usuários de tecnologia adaptativa podem navegar facilmente na sua página da web estruturando corretamente seus elementos de título.
date: 2019-10-17
updated: 2020-05-07
web_lighthouse:
  - heading-order
---

{% include 'content/lighthouse-accessibility/why-headings.njk' %}

## Como a auditoria dos níveis de título do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza as páginas cujos títulos pulam um ou mais níveis:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4dd4TvMxSF6tYJ0wGM64.png", alt="Auditoria do Lighthouse mostrando cabeçalhos que pulam níveis", width="800", height="206" %}</figure>

Por exemplo, usar um elemento `<h1>` para o título da sua página e, em seguida, usar elementos `<h3>` para as seções principais fará com que a auditoria falhe porque o nível `<h2>` foi ignorado:

```html
<h1>Page title</h1>
  <h3>Section heading 1</h3>
  …
  <h3>Section heading 2</h3>
  …
```

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como corrigir títulos mal estruturados

- Faça com que todos os elementos do título sigam uma ordem numérica lógica que reflita a estrutura do seu conteúdo.
- Certifique-se de que o texto do título transmite claramente o conteúdo da seção associada.

Por exemplo:

```html
<h1>Page title</h1>
<section>
  <h2>Section Heading</h2>
  …
    <h3>Sub-section Heading</h3>
</section>
```

Uma maneira de verificar a estrutura do título é perguntar: "Se alguém criasse um esboço da minha página usando apenas os títulos, faria sentido?"

Você também pode usar ferramentas como a <a href="https://accessibilityinsights.io/" rel="noopener">extensão Accessibility Insights</a> da Microsoft para visualizar a estrutura de sua página e detectar elementos de título fora de ordem.

{% Aside 'caution' %} Às vezes, os desenvolvedores pulam níveis de título para obter o estilo visual desejado. Por exemplo, podem usar um elemento `<h3>` porque acham que o texto `<h2>` é muito grande. Isso é considerado um **antipadrão**. Em vez disso, use uma estrutura de título corretamente sequenciada e o CSS para estilizar visualmente os títulos conforme desejado. {% endAside %}

Consulte a postagem [títulos e pontos de referência](/headings-and-landmarks) para obter mais informações.

## Recursos

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/heading-order.js" rel="noopener">Código-fonte para auditoria de <strong>níveis de salto de títulos</strong></a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/heading-order" rel="noopener">Os níveis de título devem aumentar apenas em um (Deque University)</a>
