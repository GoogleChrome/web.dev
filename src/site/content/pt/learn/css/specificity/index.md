---
title: Especificidade
description: Este módulo traz mais detalhes de uma parte fundamental da cascata.
audio:
  title: 'O CSS Podcast   - 003: Especificidade'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_003_v2.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-02
---

Suponha que você esteja trabalhando com o seguinte HTML e CSS:

```html
<button class="branding">Hello, Specificity!</button>
```

```css
button {
  color: red;
}

.branding {
  color: blue;
}
```

Existem duas regras concorrentes aqui. Uma colorirá o botão de vermelho e a outra de azul. Qual regra é aplicada ao elemento? Compreender o algoritmo da especificação CSS sobre a especificidade é fundamental para entender como o CSS decide entre regras concorrentes.

A especificidade é um dos quatro estágios distintos da cascata, que foi abordada no último módulo, na [cascata](/learn/css/the-cascade/).

<figure>{% Codepen { user: 'web-dot-dev', id: 'YzNKMXm', height: 200 } %}</figure>

## Pontuação de especificidade

Cada regra do seletor obtém uma pontuação. Você pode pensar sobre a especificidade como uma pontuação total e cada tipo de seletor ganha pontos para essa pontuação. O seletor com a maior pontuação vence.

Com a especificidade em um projeto real, o ato de equilíbrio é garantir que as regras CSS que você espera aplicar realmente se *apliquem,* enquanto geralmente mantém as pontuações baixas para evitar a complexidade. A pontuação deve ser tão alta quanto precisamos, ao invés de almejar a pontuação mais alta possível. No futuro, alguns CSS genuinamente mais importantes podem precisar ser aplicados. Se você tentar a pontuação mais alta, dificultará esse trabalho.

## Pontuação de cada tipo de seletor

Cada tipo de seletor ganha pontos. Você adiciona todos esses pontos para calcular a especificidade geral de um seletor.

### Seletor universal

Um [seletor universal](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors) ( `*` ) **não** tem especificidade e recebe **0 pontos** . Isso significa que qualquer regra com 1 ou mais pontos irá substituí-la

```css
* {
  color: red;
}
```

### Seletor de elemento ou pseudoelemento

Um [elemento](https://developer.mozilla.org/docs/Web/CSS/Type_selectors) (tipo) ou [pseudo-elemento](https://developer.mozilla.org/docs/Web/CSS/Pseudo-elements) selector recebe **um ponto de especificidade.**

#### Seletor de tipo

```css
div {
  color: red;
}
```

#### Seletor de pseudoelemento

```css
::selection {
  color: red;
}
```

### Classe, pseudoclasse ou seletor de atributo

Uma [classe](https://developer.mozilla.org/docs/Web/CSS/Class_selectors), [pseudoclasse](https://developer.mozilla.org/docs/Web/CSS/Pseudo-classes) ou seletor de [atributo](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors) **obtém 10 pontos de especificidade**.

#### Seletor de classe

```css
.my-class {
  color: red;
}
```

#### Seletor de pseudoclasse

```css
:hover {
  color: red;
}
```

#### Seletor de atributo

```css
[href='#'] {
  color: red;
}
```

A pseudoclasse [`:not()`](https://developer.mozilla.org/docs/Web/CSS/:not) em si não adiciona nada ao cálculo de especificidade. No entanto, os seletores passados como argumentos são incluídos no cálculo da especificidade.

```css
div:not(.my-class) {
  color: red;
}
```

Esta amostra teria **11 pontos** de especificidade porque tem um seletor de tipo ( `div` ) e uma classe *dentro de* `:not()`.

### Seletor de ID

Um seletor de [ID](https://developer.mozilla.org/docs/Web/CSS/ID_selectors) **obtém 100 pontos de especificidade**, contanto que você use um seletor de ID ( `#myID` ) e não um seletor de atributo ( `[id="myID"]` ).

```css
#myID {
  color: red;
}
```

### Atributo de estilo inline

CSS aplicado diretamente ao `style` do elemento HTML, obtém uma **pontuação de especificidade de 1.000 pontos**. Isso significa que, para substituí-lo no CSS, você deve escrever um seletor extremamente específico.

```html
<div style="color: red"></div>
```

### Regra `!important`

Por último, um `!important` no final de um valor CSS obtém uma pontuação de especificidade de **10.000 pontos**. Esta é a especificidade mais alta que um item individual pode obter.

Uma `!important` é aplicada a uma propriedade CSS, de forma que tudo na regra geral (seletor e propriedades) não obtenha a mesma pontuação de especificidade.

```css
.my-class {
  color: red !important; /* 10,000 pontos */
  background: white; /* 10 pontos */
}
```

{% Assessment 'scoring-beginner' %}

## Especificidade no contexto

A especificidade de cada seletor que corresponde a um elemento é adicionada. Considere este exemplo de HTML:

```html
<a class="my-class another-class" href="#">A link</a>
```

Este link contém duas classes. Adicione o seguinte CSS e ele obtém **1 ponto de especificidade** :

```css
a {
  color: red;
}
```

Faça referência a uma das classes nesta regra, agora ela tem **11 pontos de especificidade** :

```css
a.my-class {
  color: green;
}
```

Adicione a outra classe ao seletor, agora ela tem **21 pontos de especificidade** :

```css
a.my-class.another-class {
  color: rebeccapurple;
}
```

Adicione o atributo `href` ao seletor, agora ele tem **31 pontos de especificidade** :

```css
a.my-class.another-class[href] {
  color: goldenrod;
}
```

Finalmente, adicione uma `:hover` a tudo isso, o seletor termina com **41 pontos de especificidade** :

```css
a.my-class.another-class[href]:hover {
  color: lightgrey;
}
```

{% Assessment 'scoring-advanced' %}

## Visualizando a especificidade

Em diagramas e calculadoras de especificidade, a especificidade é frequentemente assim visualizada:

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/McrFhjqHXMznUzXbRuJ6.svg", alt="Um diagrama que demonstra dos seletores mais específicos aos menos específicos", width="800", height="474" %}

O grupo esquerdo são os seletores de `id`. O segundo grupo é composto por seletores de classe, atributo e pseudoclasse. O grupo final são os seletores de elemento e pseudoelemento.

Para referência, o seguinte seletor é `0-4-1` :

```css
a.my-class.another-class[href]:hover {
  color: lightgrey;
}
```

{% Assessment 'visualizing' %}

## Aumentando a especificidade pragmaticamente

Digamos que temos algum CSS parecido com este:

```css
.my-button {
  background: blue;
}

button[onclick] {
  background: grey;
}
```

Com um HTML semelhante a este:

```html
<button class="my-button" onclick="alert('hello')">Click me</button>
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'abpoxdR', tab: 'css,result' } %}</figure>

O botão tem fundo cinza, pois o segundo seletor ganha **11 pontos de especificidade** (`0-1-1`). Isso porque ele possui um seletor de tipo (`button`), que é de **1 ponto** e um seletor de atributo (`[onclick]`), que é de **10 pontos** .

A regra anterior `.my-button` ganha **10 pontos** (`0-1-0`), porque tem um seletor de classe.

Se você quiser dar um impulso a esta regra, repita o seletor de classe desta forma:

```css
.my-button.my-button {
  background: blue;
}

button[onclick] {
  background: grey;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'zYNOXBJ', tab: 'css,result' } %}</figure>

Agora, o botão terá um fundo azul, pois o novo seletor obtém uma pontuação de especificidade de **20 pontos** (`0-2-0`).

{% Aside 'caution' %} Se você achar que precisa aumentar a especificidade com frequência, isso pode indicar que você está escrevendo seletores excessivamente específicos. Considere se você pode refatorar seu CSS para reduzir a especificidade de outros seletores para evitar esse problema. {% endAside %}

## Uma pontuação de especificidade correspondente faz com que a instância mais recente ganhe

Vamos ficar com o exemplo de botão por enquanto e mudar o CSS para este:

```css
.my-button {
  background: blue;
}

[onclick] {
  background: grey;
}
```

O botão tem um fundo cinza, porque os **dois seletores têm pontuação de especificidade idêntica** (`0-1-0`).

<figure>{% Codepen { user: 'web-dot-dev', id: 'zYNOXKJ', tab: 'css,result' } %}</figure>

Se você mudar as regras na ordem de origem, o botão ficará azul.

```css
[onclick] {
  background: grey;
}

.my-button {
  background: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'WNReWRO', tab: 'css,result' } %}</figure>

Esta é a única instância em que o CSS mais recente vence. Para fazer isso, ele deve corresponder à especificidade de outro seletor que visa o mesmo elemento.

## Recursos

- [Especificidade CSS](http://specifishity.com)
- [Calculadora de Especificidade](https://specificity.keegan.st)
- [Especificidade MDN](https://developer.mozilla.org/docs/Web/CSS/Specificity)
- [Especificidades sobre a especificidade CSS](https://css-tricks.com/specifics-on-css-specificity/)
- [Outra Calculadora de Especificidade](https://polypane.app/css-specificity-calculator)
