---
title: "Novos seletores de pseudoclasse funcionais de CSS  `:is()` e `:where()`"
subhead: Essas adições aparentemente pequenas à sintaxe do seletor CSS terão um grande impacto.
authors:
  - adamargyle
description: Essas adições aparentemente pequenas à sintaxe do seletor CSS terão um grande impacto.
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/bFO3SPdt1bPIB8EylsB7.jpg
alt: Uma biblioteca brilhante e branca, fileiras e mais fileiras de livros, com uma única pessoa no meio tentando pegar um único livro.
tags:
  - blog
  - css
date: 2021-05-27
updated: 2021-05-27
---

Ao escrever CSS, às vezes você pode acabar com longas listas de seletores para direcionar vários elementos com as mesmas regras de estilo. Por exemplo, se você deseja ajustar a cor de quaisquer `<b>` encontradas dentro de um elemento de título, você pode escrever:

```css
h1 > b, h2 > b, h3 > b, h4 > b, h5 > b, h6 > b {
  color: hotpink;
}
```

Em vez disso, você pode usar `:is()` e melhorar a legibilidade, evitando um seletor longo:

```css
:is(h1,h2,h3,h4,h5,h6) > b {
  color: hotpink;
}
```

Legibilidade e conveniências mais curtas do seletor são apenas uma parte do valor que `:is()` e `:where()` trazem para o CSS. Nesta postagem, você descobrirá a sintaxe e o valor desses dois pseudo seletores funcionais.

<figure data-size="full">{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/mkyjox1HJNL0AgtX25bi.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> Um visual infinito de antes e depois de usar <code>:is()</code> </figcaption></figure>

### Compatibilidade do navegador

O `:is` e `:where` pseudo classes são suportadas no Chromium (&gt;=88), Firefox (&gt;= 78) e Safari (&gt;=14). Consulte a tabela de [compatibilidade do navegador](https://developer.mozilla.org/docs/Web/CSS/:where#Browser_compatibility) do MDN para obter mais informações. Algumas versões mais antigas do navegador suportam o seletor `:is()` como o `:matches()` ou `-webkit-any()`. Para obter mais informações, consulte a página <a href="https://developer.mozilla.org/docs/Web/CSS/:is" data-md-type="link">`:is()`</a> no MDN.

## Conheça `:is()` e `:where()`

Esses são seletores de pseudo-classe funcionais, observe o `()` no final e a maneira como eles começam com `:`. Pense nisso como chamadas de função dinâmica de tempo de execução que correspondem a elementos. Ao escrever CSS, eles oferecem uma maneira de agrupar elementos no meio, no início ou no final de um seletor. Eles também podem alterar a especificidade, dando a você o poder de anular ou aumentar a especificidade.

### Agrupamento de seletores

Qualquer coisa que `:is()` pode fazer em relação ao agrupamento, também pode `:where()`. Isso inclui ser usado em qualquer lugar do seletor, aninhando-os e empilhando-os. Flexibilidade total de CSS que você conhece e adora. Aqui estão alguns exemplos:

```css
/* at the beginning */
:where(h1,h2,h3,h4,h5,h6) > b {
  color: hotpink;
}

/* in the middle */
article :is(header,footer) > p {
  color: gray;
}

/* at the end */
.dark-theme :where(button,a) {
  color: rebeccapurple;
}

/* multiple */
:is(.dark-theme, .dim-theme) :where(button,a) {
  color: rebeccapurple;
}

/* stacked */
:is(h1,h2):where(.hero,.subtitle) {
  text-transform: uppercase;
}

/* nested */
.hero:is(h1,h2,:is(.header,.boldest)) {
  font-weight: 900;
}
```

Cada um dos exemplos de seletores acima demonstra a flexibilidade dessas duas pseudo classes funcionais. Para encontrar áreas de seu código que podem se beneficiar de `:is()` ou `:where()`, procure seletores com várias vírgulas e repetição de seletor.

### Use seletores simples e complexos com `:is()`

Para uma atualização nos seletores, verifique o [módulo de seletores em Aprender CSS](/learn/css/selectors/#complex-selectors). Aqui estão alguns exemplos de seletores simples e complexos para ajudar a ilustrar a capacidade:

```css
article > :is(p,blockquote) {
  color: black;
}

:is(.dark-theme.hero > h1) {
  font-weight: bold;
}

article:is(.dark-theme:not(main .hero)) {
  font-size: 2rem;
}
```

{% Aside 'gotchas' %} Normalmente, ao usar uma `,` para criar uma lista de seletores, se algum dos seletores for inválido, todos os seletores serão invalidados e a lista não conseguirá combinar os elementos. Isso quer dizer que eles não perdoam os erros. O `:is()` e `:where()`[embora sejam perdoares](https://developer.mozilla.org/docs/Web/CSS/:is#forgiving_selector_parsing) e podem [tirar você de um aperto](https://css-tricks.com/almanac/selectors/i/is/#forgiving-selector-lists)! {% endAside %}

Até agora, `:is()` e `:where()` são sintaticamente intercambiáveis. É hora de ver como eles são diferentes.

### A diferença entre `:is()` e `:where()`

Quando se trata de especificidade `:is()` e `:where()` divergem fortemente. Para uma atualização sobre a especificidade, consulte o [módulo de especificidade em Aprender CSS](/learn/css/specificity/).

Resumindo

- `:where()` não tem especificidade.<br> `:where()` elimina toda a especificidade na lista do seletor passada como parâmetros funcionais. Este é o primeiro recurso de seletor de seu tipo.
- `:is()` assume a especificidade de seu seletor mais específico.<br> `:is(a,div,#id)` tem uma pontuação de especificidade de um ID, 100 pontos.

Assumir o seletor de especificidade mais alta da lista só foi um problema para mim quando eu estava ficando muito animado com o agrupamento. Sempre fui capaz de melhorar a legibilidade movendo o seletor de alta especificidade para o seu próprio seletor, onde não teria tanto impacto. Aqui está um exemplo do que quero dizer:

```css
article > :is(header, #nav) {
  background: white;
}

/* better as */
article > header,
article > #nav {
  background: white;
}
```

Com `:where()`, estou esperando para ver as bibliotecas oferecerem versões sem especificidade. A competição de especificidade entre estilos de autor e estilos de biblioteca pode chegar ao fim. Não haveria especificidade para competir ao escrever CSS. O CSS vem trabalhado em um recurso de agrupamento como este por algum tempo, ele está aqui e ainda é um território inexplorado. Divirta-se criando folhas de estilo menores e removendo as vírgulas.

*Foto de [Markus Winkler](https://unsplash.com/@markuswinkler) no [Unsplash](https://unsplash.com/photos/afW1hht0NSs)*
