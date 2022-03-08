---
title: Herança
description: >
  Algumas propriedades CSS são herdadas se você não especificar um valor para elas.
  Descubra como isso funciona e como usar a seu favor neste módulo.
audio:
  title: 'The CSS Podcast - 005: Inheritance'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_005_v1.2.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-02
---

Digamos que você acabou de escrever algum CSS para fazer com que os elementos pareçam um botão.

```html
<a href="http://example.com" class="my-button">Eu sou um link botão</a>
```

```css
.my-button {
  display: inline-block;
  padding: 1rem 2rem;
  text-decoration: none;
  background: pink;
  font: inherit;
  text-align: center;
}
```

Então você adiciona um link em um `article`,
com uma classe `.my-button`. No entanto, há um problema,
o texto não tem a cor que você esperava. Como isso aconteceu?

Algumas propriedades CSS são herdadas se você não especificar um valor para elas.
No caso desse botão, ele **herdou** a `color` deste CSS:

```css
article a {
  color: maroon;
}
```

Nesta lição, você aprenderá por que isso acontece e
como a herança é um recurso poderoso para ajudá-lo a escrever menos CSS.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'zYNGEbg',
  height: 400
} %}
</figure>

## Fluxo da Herança

Vamos dar uma olhada em como a herança funciona,
usando este trecho de HTML:

```html
<html>
  <body>
    <article>
      <p>Lorem ipsum dolor sit amet.</p>
    </article>
  </body>
</html>
```

O elemento raiz (`<html>`) não herdará nada porque é o primeiro elemento do documento.
Adicione um pouco de CSS no elemento HTML,
e ele começará a se propagar pelo documento.

```css
html {
  color: lightslategray;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEKgBX',
  height: 200
} %}
</figure>

A propriedade `color` é herdada por outros elementos.
O elemento `html` tem `color: lightslategray`,
portanto, todos os elementos que podem herdar cores agora terão a cor `lightslategray`.

```css
body {
  font-size: 1.2em;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'VwPLrLP',
  height: 200
} %}
</figure>

{% Aside %}
Como essa demonstração define o tamanho da fonte no elemento `body`,
o elemento `html` ainda terá o tamanho da fonte inicial definido pelo navegador (user agent stylesheet),
mas o `article` e `p` herdarão o tamanho da fonte declarado no `body`.
Isso ocorre porque a herança propaga apenas para baixo.
{% endAside %}

```css
p {
  font-style: italic;
}
```

Apenas o `<p>` terá texto em itálico porque é o elemento aninhado mais profundo.
A herança propaga apenas para baixo, e não para cima, para os elementos pai.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEKgmK',
  tab: 'css,result',
  height: 400
} %}
</figure>

## Quais propriedades são herdáveis?

Nem todas as propriedades CSS são herdáveis,
mas há muitas que são.
Para referência, aqui está a lista completa de propriedades herdáveis,
retirado da referência W3 de todas as propriedades CSS:

- [azimuth](https://developer.mozilla.org/docs/Web/SVG/Attribute/azimuth)
- [border-collapse](https://developer.mozilla.org/docs/Web/CSS/border-collapse)
- [border-spacing](https://developer.mozilla.org/docs/Web/CSS/border-spacing)
- [caption-side](https://developer.mozilla.org/docs/Web/CSS/caption-side)
- [color](https://developer.mozilla.org/docs/Web/CSS/color)
- [cursor](https://developer.mozilla.org/docs/Web/CSS/cursor)
- [direction](https://developer.mozilla.org/docs/Web/CSS/direction)
- [empty-cells](https://developer.mozilla.org/docs/Web/CSS/empty-cells)
- [font-family](https://developer.mozilla.org/docs/Web/CSS/font-family)
- [font-size](https://developer.mozilla.org/docs/Web/CSS/font-size)
- [font-style](https://developer.mozilla.org/docs/Web/CSS/font-style)
- [font-variant](https://developer.mozilla.org/docs/Web/CSS/font-variant)
- [font-weight](https://developer.mozilla.org/docs/Web/CSS/font-weight)
- [font](https://developer.mozilla.org/docs/Web/CSS/font)
- [letter-spacing](https://developer.mozilla.org/docs/Web/CSS/letter-spacing)
- [line-height](https://developer.mozilla.org/docs/Web/CSS/line-height)
- [list-style-image](https://developer.mozilla.org/docs/Web/CSS/list-style-image)
- [list-style-position](https://developer.mozilla.org/docs/Web/CSS/list-style-position)
- [list-style-type](https://developer.mozilla.org/docs/Web/CSS/list-style-type)
- [list-style](https://developer.mozilla.org/docs/Web/CSS/list-style)
- [orphans](https://developer.mozilla.org/docs/Web/CSS/orphans)
- [quotes](https://developer.mozilla.org/docs/Web/CSS/quotes)
- [text-align](https://developer.mozilla.org/docs/Web/CSS/text-align)
- [text-indent](https://developer.mozilla.org/docs/Web/CSS/text-indent)
- [text-transform](https://developer.mozilla.org/docs/Web/CSS/text-transform)
- [visibility](https://developer.mozilla.org/docs/Web/CSS/visibility)
- [white-space](https://developer.mozilla.org/docs/Web/CSS/white-space)
- [widows](https://developer.mozilla.org/docs/Web/CSS/widows)
- [word-spacing](https://developer.mozilla.org/docs/Web/CSS/word-spacing)

## Como a herença funciona

Cada elemento HTML tem propriedades CSS definidas com um valor inicial por padrão.
Um valor inicial é uma propriedade que não é herdada e aparece como padrão
caso a cascata não compute um valor para esse elemento.

<figure>
{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/OvoYqOMcdFZL7wJQIL2C.mp4" %}
</figure>

Propriedades podem ser herdadas em sua propagação para baixo,
e os elementos filho obterão um valor computado que representa o valor de seu pai.
Isso significa que, se um pai tiver `font-weight` definido como `bold`, todos os elementos filho estarão em negrito,
a menos que o `font-weight` seja definido com um valor diferente,
ou o `user agent stylesheet` tenha um valor de `font-weight` para esse elemento.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'xxgGPOZ'
} %}
</figure>

## Como herdar e controlar explicitamente a herança

A herança pode afetar os elementos de maneiras inesperadas, então o CSS tem ferramentas para ajudar nisso.

### A palavra-chave `inherit`

Você pode fazer qualquer propriedade herdar o valor computado de seu pai com a palavra-chave `inherit`.
Uma maneira útil de usar essa palavra-chave é criar exceções.

```css
strong {
  font-weight: 900;
}
```

Esse trecho CSS define para todos os elementos `<strong>` ter um `font-weight` de `900`,
em vez do valor padrão `bold`, que seria o equivalente a `font-weight: 700`.

```css
.my-component {
  font-weight: 500;
}
```

A classe `.my-component` define o `font-weight` como 500.
Para definir os elementos `<strong>` dentro de `.my-component` como `font-weight: 500`, adicione:

```css
.my-component strong {
  font-weight: inherit;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'eYgNedO',
  height: 400
} %}
</figure>

Agora, os elementos `<strong>` dentro de `.my-component` terão um `font-weight` de `500`.

Você pode definir explicitamente esse valor,
mas se você usar `inherit` e o CSS de `.my-component` mudar futuramente,
você pode garantir que seu `<strong>` automaticamente se manterá atualizado.

### A palavra-chave `initial`

A herança pode causar problemas com seus elementos e `initial` fornece uma poderosa opção de reset.

Você aprendeu anteriormente que toda propriedade CSS tem um valor padrão.
A palavra-chave `initial` define o valor inicial padrão de uma propriedade.

```css
aside strong {
  font-weight: initial;
}
```

Esse trecho removerá o negrito de todos os elementos `<strong>` dentro de um elemento `<aside>` e, em vez disso,
tornará todos em normal, que é o valor inicial.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'OJWVORZ',
  tab: 'css,result',
  height: 300
} %}
</figure>

### A palavra-chave `unset`

A propriedade `unset` se comporta de forma diferente se uma propriedade é herdável ou não.
Se uma propriedade é herdável,
a palavra-chave `unset` será a mesma que `inherit`.
Se a propriedade não for herdável, `unset` será igual a `initial`.

Lembrar quais propriedades CSS são herdáveis pode ser difícil,
`unset` pode ser útil nesse contexto.
Por exemplo, `color` é herdável,
mas `margin` não é, então você pode escrever isso:

```css
/* Estilos de cores globais para parágrafo em CSS autoral */
p {
  margin-top: 2em;
  color: goldenrod;
}

/* O p precisa ser resetado nos asides, então você pode usar unset */
aside p {
  margin: unset;
  color: unset;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEdpjw',
  tab: 'css,result',
  height: 400
} %}
</figure>

Agora, o `margin` é removido e a `color` volta a ser o valor computado herdado.

Você também pode usar o valor `unset` com a propriedade `all`.
Voltando ao exemplo acima,
o que acontece se os estilos globais `p` obtiverem algumas propriedades adicionais?
Apenas a regra que foi definida para `margin` e `color` será aplicada.

```css/5-6
/* Estilos de cores globais para parágrafo em CSS autoral */
p {
	margin-top: 2em;
	color: goldenrod;
	padding: 2em;
	border: 1px solid;
}

/* Nem todas as propriedades são computadas */
aside p {
	margin: unset;
	color: unset;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'bGgdLNB',
  tab: 'css,result'
} %}
</figure>

Se você alterar a regra `aside p` para `all: unset`,
não importa quais estilos globais serão aplicados a `p` no futuro,
eles sempre serão unset.

```css/2-3
aside p {
	margin: unset;
	color: unset;
	all: unset;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'XWpbZbB',
  tab: 'css,result'
} %}
</figure>

{% Assessment 'conclusion' %}

## Referências

- [Referência MDN para valores computados](https://developer.mozilla.org/docs/Web/CSS/computed_value)
- [Um artigo sobre como a herança pode ser útil em front-ends modulares](https://www.smashingmagazine.com/2016/11/css-inheritance-cascade-global-scope-new-old-worst-best-friends/)
