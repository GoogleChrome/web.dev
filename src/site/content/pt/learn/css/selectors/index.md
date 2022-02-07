---
title: Seletores
description: |2

  Para aplicar CSS a um elemento, você precisa selecioná-lo.
  CSS oferece várias maneiras diferentes de fazer isso,
  e você pode explorá-los neste módulo.
audio:
  title: 'O CSS Podcast   - 002: Seletores'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_002_v2.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

Se você tem algum texto que só deseja que fique maior e vermelho se for o primeiro parágrafo de um artigo, como fazer isso?

```html
<article>
  <p>I want to be red and larger than the other text.</p>
  <p>I want to be normal sized and the default color.</p>
</article>
```

Você usa um seletor CSS para encontrar aquele elemento específico e aplicar uma regra CSS, como esta.

```css
article p:first-of-type {
  color: red;
  font-size: 1.5em;
}
```

O CSS fornece muitas opções para selecionar elementos e aplicar regras a eles, que variam de muito simples a muito complexas, para ajudar a resolver situações como essa.

{% Codepen {user: 'web-dot-dev', id: 'XWprGYz', height: 250}%}

## As partes de uma regra de CSS

Para entender como os seletores funcionam e sua função no CSS, é importante conhecer as partes de uma regra CSS. Uma regra CSS é um bloco de código, contendo um ou mais seletores e uma ou mais declarações.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/hFR4OOwyH5zWc5XUIcyu.svg", alt="Uma imagem de uma regra de CSS com o seletor .my-css-rule", width="800", height="427" %}</figure>

Nesta regra de CSS, o **seletor** é `.my-css-rule` que encontra todos os elementos com uma classe de `my-css-rule` na página. Existem três declarações dentro das chaves. Uma declaração é um par de propriedade e valor que aplica estilos aos elementos correspondidos pelos seletores. Uma regra de CSS pode ter quantas declarações e seletores você desejar.

## Seletores simples

O grupo mais direto de seletores tem como alvo elementos HTML mais classes, IDs e outros atributos que podem ser adicionados a uma tag HTML.

### Seletor universal

Um [seletor universal](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors) - também conhecido como curinga - corresponde a qualquer elemento.

```css
* {
  color: hotpink;
}
```

Esta regra faz com que cada elemento HTML na página tenha texto hotpink.

### Seletor de tipo

Um [seletor de tipo](https://developer.mozilla.org/docs/Web/CSS/Type_selectors) corresponde diretamente a um elemento HTML.

```css
section {
  padding: 2em;
}
```

Esta regra faz com que cada elemento `<section>` tenha `2em` de `padding` em todos os lados.

### Seletor de classe

Um elemento HTML pode ter um ou mais itens definidos em seu atributo de `class`. O [seletor de classe](https://developer.mozilla.org/docs/Web/CSS/Class_selectors) corresponde a qualquer elemento que tenha essa classe aplicada a ele.

```html
<div class="my-class"></div>
<button class="my-class"></button>
<p class="my-class"></p>
```

Qualquer elemento que tenha a classe aplicada a ele terá a cor vermelha:

```css
.my-class {
  color: red;
}
```

Observe como o `.` só está presente em CSS e **não em** HTML. Isso ocorre porque o `.` caractere instrui a linguagem CSS para corresponder aos membros do atributo de classe. Este é um padrão comum em CSS, onde um caractere especial, ou conjunto de caracteres, é usado para definir os tipos de seletor.

Um elemento HTML que possui uma classe de `.my-class` ainda corresponderá à regra CSS acima, mesmo se eles tiverem várias outras classes, como esta:

```html
<div class="my-class another-class some-other-class"></div>
```

Isso ocorre porque o CSS procura por um atributo de `class` que *contém* a classe definida, em vez de corresponder exatamente a essa classe.

{% Aside %} O valor de um atributo de classe pode ser quase qualquer coisa que você quiser. `.1element` é que você não pode começar uma aula (ou um ID) com um número, como .1elemento. Você pode ler mais [nas especificações](https://www.w3.org/TR/CSS21/syndata.html#characters) . {% endAside %}

### Seletor de ID

Um elemento HTML com um `id` deve ser o único elemento em uma página com esse valor de ID. Você seleciona elementos com um [seletor de ID](https://developer.mozilla.org/docs/Web/CSS/ID_selectors) como este:

```css
#rad {
  border: 1px solid blue;
}
```

Este CSS aplicaria uma borda azul ao elemento HTML que possui um `id` de `rad` , como este:

```html
<div id="rad"></div>
```

Da mesma forma que o seletor de classes `.`, use um `#` para instruir o CSS a procurar um elemento que corresponda ao `id` que o segue.

{% Aside %} Se o navegador encontrar mais de uma instância de um `id` ele ainda aplicará quaisquer regras CSS que correspondam ao seu seletor. No entanto, qualquer elemento que tenha um `id` deve ter um valor único para ele, então, a menos que você esteja escrevendo CSS muito específico para um único elemento, evite aplicar estilos com o `id`, pois isso significa que você não pode reutilizar esses estilos em outros lugares. {% endAside %}

### Seletor de atributo

Você pode procurar por elementos que possuem um determinado atributo HTML, ou um determinado valor para um atributo HTML, usando o [seletor de atributos](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors). Instrua o CSS a procurar atributos envolvendo o seletor com colchetes (`[ ]`).

```css
[data-type='primary'] {
  color: red;
}
```

Este CSS procura todos os elementos que possuem um atributo de `data-type` de dados com um valor `primary`, como este:

```html
<div data-type="primary"></div>
```

Em vez de procurar um valor específico de `data-type` de dados, você também pode procurar elementos com o atributo presente, independentemente de seu valor.

```css
[data-type] {
  color: red;
}
```

```html
<div data-type="primary"></div>
<div data-type="secondary"></div>
```

Ambos os `<div>` terão texto em vermelho.

Você pode usar seletores de atributo com distinção entre maiúsculas e minúsculas adicionando um `s` ao seu seletor de atributo.

```css
[data-type='primary' s] {
  color: red;
}
```

Isso significa que se um elemento HTML tivesse um `data-type` de `Primary`, em vez de `primary` , ele não obteria texto em vermelho. Você pode fazer o oposto - não diferenciação de maiúsculas e minúsculas - usando um operador `i`

Junto com os operadores de caso, você tem acesso a operadores que combinam partes de strings dentro de valores de atributo.

```css
/* A href that contains "example.com" */
[href*='example.com'] {
  color: red;
}

/* A href that starts with https */
[href^='https'] {
  color: green;
}

/* A href that ends with .com */
[href$='.com'] {
  color: blue;
}
```

<figure>{% Codepen {user: 'web-dot-dev', id: 'BapBbOy'}%}<figcaption> Neste demo, o operador `$` em nosso seletor de atributo obtém o tipo de arquivo do atributo `href`. Isso torna possível prefixar o rótulo - com base nesse tipo de arquivo - usando um pseudoelemento.</figcaption></figure>

### Seletores de agrupamento

Um seletor não precisa corresponder a apenas um único elemento. Você pode agrupar vários seletores, separando-os com vírgulas:

```css
strong,
em,
.my-class,
[lang] {
  color: red;
}
```

Este exemplo estende a mudança de cor para os elementos `<strong>` `<em>`. Ele também é estendido para uma classe chamada `.my-class` e um elemento que possui um atributo `lang`

{% Assessment 'simple-selectors' %}

## Pseudo-classes e pseudo-elementos

O CSS fornece tipos de seletores úteis que se concentram no estado específico da plataforma, como quando um elemento é passado, estruturas *dentro de* um elemento ou partes de um elemento.

### Pseudo-classes

Os elementos HTML encontram-se em vários estados, seja porque interagem com eles ou porque um de seus elementos filhos está em um determinado estado.

Por exemplo, um elemento HTML pode ser passado com o ponteiro do mouse por um usuário *ou* um elemento filho também pode ser passado pelo usuário. Para essas situações, use a `:hover`.

```css
/* Our link is hovered */
a:hover {
  outline: 1px dotted green;
}

/* Sets all even paragraphs to have a different background */
p:nth-child(even) {
  background: floralwhite;
}
```

Saiba mais no [módulo de pseudo-classes](/learn/css/pseudo-classes).

### Pseudo-elemento

Os pseudo-elementos diferem das pseudo-classes porque em vez de responder ao estado da plataforma, eles agem como se estivessem inserindo um novo elemento com CSS. Pseudo-elementos também são sintacticamente diferente da pseudo-classes, porque em vez de usar um único sinal dois pontos (`:`), usamos dois pontos duplos (`::`).

{% Aside %} Dois-pontos duplos (`::`) é o que distingue um pseudo-elemento de uma pseudo-classe, mas como essa distinção não estava presente em versões anteriores das especificações CSS, os navegadores suportam um único dois-pontos para os pseudo-elementos originais, como `:before` e `:after` para ajudar na compatibilidade com navegadores mais antigos, como o IE8. {% endAside %}

```css
.my-element::before {
  content: 'Prefix - ';
}
```

Como na demonstração acima, onde você prefixou o rótulo de um link com o tipo de arquivo, você pode usar o pseudo-elemento `::before` **para inserir conteúdo no início de um elemento**, ou o pseudo-elemento `::after` no **final de um elemento**.

Pseudo-elementos não se limitam a inserir conteúdo, no entanto. Você também pode usá-los para direcionar partes específicas de um elemento. Por exemplo, suponha que você tenha uma lista. Use `::marker` para definir o estilo de cada marcador (ou número) na lista

```css
/* Your list will now either have red dots, or red numbers */
li::marker {
  color: red;
}
```

Você também pode usar `::selection` para aplicar estio ao conteúdo que foi destacado por um usuário.

```css
::selection {
  background: black;
  color: white;
}
```

Saiba mais no [módulo sobre pseudoelementos](/learn/css/pseudo-elements).

{% Assessment 'pseudo-selectors' %}

## Seletores complexos

Você já viu uma vasta gama de seletores, mas às vezes, você precisará de um *controle* mais refinado com seu CSS. É aqui que os seletores complexos entram em cena para ajudar.

Vale a pena lembrar que, embora os seletores a seguir nos deem mais poder, podemos apenas **cascatear para baixo**, selecionando os elementos filhos. Não podemos direcionar para cima e selecionar um elemento pai. Abordaremos o que é a cascata e como ela funciona [em uma lição posterior](/learn/css/the-cascade).

### Combinadores

Um combinador é o que fica entre dois seletores. Por exemplo, se o seletor foi `p > strong`, o combinador é o caractere `>`. Os seletores que usam esses combinadores ajudam a selecionar itens com base em suas posições no documento.

#### Combinador descendente

Para entender os combinadores descendentes, você precisa primeiro entender os elementos pai e filho.

```html
<p>A paragraph of text with some <strong>bold text for emphasis</strong>.</p>
```

O elemento pai é o `<p>` que contém o texto. Dentro desse `<p>` está um elemento `<strong>`, tornando seu conteúdo em negrito. Por estar dentro do `<p>`, é um elemento filho.

Um combinador descendente nos permite almejar um elemento filho. Isso usa um espaço (` `) para instruir o navegador a procurar elementos filho:

```css
p strong {
  color: blue;
}
```

Este snippet seleciona todos os `<strong>` elementos que são elementos filho dos elementos `<p>` apenas, tornando-os azuis recursivamente.

<figure>{% Codepen {user: 'web-dot-dev', id: 'BapBbGN'}%}<figcaption> Como o combinador descendente é recursivo, o preenchimento adicionado a cada elemento filho se aplica, resultando em um efeito escalonado.</figcaption></figure>

Este efeito é melhor visualizado no exemplo acima, usando o seletor combinador, `.top div`. Essa regra CSS adiciona preenchimento esquerdo a esses elementos `<div>` Como o combinador é recursivo, todos os `<div>` que estão em `.top` terão o mesmo preenchimento aplicado a eles.

Dê uma olhada no painel HTML nesta demonstração para ver como o `.top` tem vários `<div>` que, eles próprios, têm elementos filhos `<div>`

#### Próximo irmão combinador

Você pode procurar um elemento que segue imediatamente outro elemento usando um `+` em seu seletor.

{% Codepen {user: 'web-dot-dev', id: 'JjEPzwB'}%}

Para adicionar espaço entre os elementos empilhados, use o próximo irmão combinador para adicionar espaço *apenas* se um elemento for o **próximo irmão** de um elemento filho de `.top`.

Você pode adicionar margem a todos os elementos filho de `.top`, usando o seguinte seletor:

```css
.top * {
  margin-top: 1em;
}
```

O problema com isso é que, como você está selecionando cada elemento filho de `.top`, essa regra potencialmente cria espaço extra desnecessário. O **próximo combinador irmão**, misturado com um **seletor universal,** permite não apenas controlar quais elementos recebem espaço, mas também aplicar espaço a **qualquer elemento**. Isso fornece alguma flexibilidade de longo prazo, independentemente de quais elementos HTML aparecem em `.top`.

#### Subsequente - irmão combinador

Um combinador subsequente é muito semelhante a um seletor irmão seguinte. No entanto, em vez de um `+`, use um caractere `~`. A diferença é que um elemento precisa apenas seguir outro elemento com o mesmo pai, em vez de ser o próximo elemento com o mesmo pai.

<figure>{% Codepen {user: 'web-dot-dev', id: 'ZELzPPX', height: 400}%}<figcaption> Use um seletor subsequente junto com uma pseudo classe `: check` para criar um elemento switch CSS puro.</figcaption></figure>

Este combinador subsequente fornece um pouco menos de rigidez, o que é útil em contextos como o exemplo acima, onde alteramos a cor de um switch personalizado quando sua caixa de seleção associada tem o estado `:checked`

#### Combinador filho

Um combinador filho (também conhecido como descendente direto) permite mais controle sobre a recursão que vem com os seletores do combinador. Ao usar o `>`, você limita o seletor de combinador para aplicar **apenas** aos filhos diretos.

Considere o exemplo anterior do seletor irmão seguinte. O espaço é adicionado a cada **irmão seguinte** , mas se um desses elementos também tiver **elementos do próximo irmão** como filhos, isso pode resultar em espaçamento extra indesejável.

{% Codepen {user: 'web-dot-dev', id: 'ExZYMJL'}%}

Para aliviar esse problema, altere o **próximo seletor irmão** para incorporar um combinador filho: `> * + *`. A regra agora **só se** aplica a filhos diretos de `.top` .

{% Codepen {user: 'web-dot-dev', id: 'dyNbrEr'}%}

### Seletores compostos

Você pode combinar seletores para aumentar a especificidade e a legibilidade. Por exemplo, para direcionar `<a>`, que também têm uma classe de `.my-class`, escreva o seguinte:

```css
a.my-class {
  color: red;
}
```

Isso não aplicaria uma cor vermelha a todos os links e também aplicaria apenas a cor vermelha a `.my-class` **se** estivesse em um elemento `<a>`. Para saber mais sobre isso, consulte o [módulo de especificidade](/learn/css/specificity).

{% Assessment 'complex-selectors' %}

## Recursos

- [Referência de seletores CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
- [Jogo de seletores interativo](https://flukeout.github.io/)
- [Referência de pseudoclasse e pseudoelementos](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
- [Uma ferramenta que traduz seletores de CSS em explicadores em inglês simples](https://kittygiraudel.github.io/selectors-explained/)
