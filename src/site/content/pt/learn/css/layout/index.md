---
title: Layout
description: |2

  Uma visão geral dos vários métodos de layout que você deve escolher ao construir um componente ou layout de página.
audio:
  title: 'O CSS Podcast   - 009: Layout'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_009_v1.1.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-20
tags:
  - css
---

Imagine que você está trabalhando como desenvolvedor e um colega designer lhe entrega um design para um novo site. O design tem todos os tipos de layouts e composições interessantes: layouts bidimensionais que levam em consideração a largura e altura da janela de visualização, bem como layouts que precisam ser fluidos e flexíveis. Como você decide a melhor maneira de estilizá-los com CSS?

O CSS nos oferece várias maneiras de resolver problemas de layout, em um eixo horizontal, eixo vertical ou até mesmo ambos. Escolher o método de layout correto para um contexto pode ser difícil e, frequentemente, você pode precisar de mais de um método de layout para resolver seu problema. Para ajudar com isso, nos módulos a seguir, você aprenderá sobre os recursos exclusivos de cada mecanismo de layout CSS para informar essas decisões.

## Layout: uma breve história

Nos primórdios da web, designs mais complexos do que um simples documento eram dispostos com elementos `<table>`. Separar o HTML dos estilos visuais ficou mais fácil quando o CSS foi amplamente adotado pelos navegadores no final dos anos 90. O CSS abriu a porta para os desenvolvedores poderem mudar completamente a aparência de um site sem jamais tocar no HTML. Esse novo recurso inspirou projetos como [The CSS Zen Garden](http://www.csszengarden.com), criado para demonstrar o poder do CSS e encorajar mais desenvolvedores a aprendê-lo. O CSS  também evoluiu conforme nossas necessidades de web design e tecnologia dos navegadores. Você pode ler como o layout CSS e nossa abordagem ao layout evoluíram ao longo do tempo[neste artigo de Rachel Andrew](https://24ways.org/2019/a-history-of-css-through-15-years-of-24-ways/) . {% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/vDDoFFoPVgJEuEaqcP4H.svg", alt="Uma linha do tempo mostrando como o CSS evoluiu ao longo dos anos, do começo em 1996 até 2021", width="760", height="270" %}

## Layout: o presente e o futuro

O CSS moderno tem ferramentas de layout excepcionalmente poderosas. Temos sistemas dedicados para layout e vamos dar uma olhada de alto nível no que temos à nossa disposição antes de nos aprofundarmos em mais detalhes nos próximos módulos sobre o Flexbox e o Grid.

## Compreendendo a propriedade `display`

A propriedade `display` faz duas coisas. A primeira coisa que ela faz é determinar se a caixa à qual se aplica atua como embutida ou em bloco.

```css
.my-element {
  display: inline;
}
```

Os elementos embutidos se comportam como palavras em uma frase. Eles ficam lado a lado na direção inline. Elementos como `<span>` e `<strong>`, que normalmente são usados para estilizar pedaços de texto dentro de elementos como `<p>` (parágrafo), são embutidos por padrão. Eles também preservam os espaços em branco circundantes. {% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/GezxDZXkJgkMevkKg39M.png", alt="Um diagrama mostrando todos os diferentes tamanhos de uma caixa e onde cada seção de dimensionamento começa e termina", width="800", height="559" %} Você não pode definir uma largura e altura explícitas em elementos embutidos. Qualquer margem de nível de bloco e preenchimento serão ignorados pelos elementos circundantes.

```css
.my-element {
	display: block;
}
```

Os elementos de bloco não ficam lado a lado. Eles criam uma nova linha para si próprios. A menos que seja alterado por outro código CSS, um elemento de bloco se expandirá para o tamanho da dimensão embutida, portanto, abrangendo toda a largura em um modo de escrita horizontal. A margem em todos os lados de um elemento de bloco é respeitada.

```css
.my-element {
	display: flex;
}
```

A propriedade `display` também determina como os filhos de um elemento devem se comportar. Por exemplo, definir a propriedade `display` para `display: flex` torna a caixa uma caixa em nível de bloco e também converte seus filhos em itens flexíveis. Isso habilita as propriedades flex que controlam o alinhamento, a ordem e o fluxo.

## Flexbox e Grid

Existem dois mecanismos principais de layout que criam regras de layout para vários elementos, *[flexbox](/learn/css/flexbox)* e *[grid](/learn/css/grid)*. Eles compartilham semelhanças, mas são projetados para resolver diferentes problemas de layout. {% Aside %} Entraremos em muito mais detalhes sobre ambos em módulos futuros, mas aqui está uma visão geral de alto nível do que são e para que servem. {% endAside %}

### Flexbox

```css
.my-element {
	display: flex;
}
```

O Flexbox é um mecanismo de layout para layouts unidimensionais. Layout em um único eixo, horizontal ou verticalmente. Por padrão, o Flexbox irá alinhar os filhos do elemento um ao lado do outro, na direção inline, e esticá-los na direção do bloco, de forma que todos tenham a mesma altura. {% Codepen { user: 'web-dot-dev', id: 'rNjxmor', tab: 'css,result', height: 300 } %} Os itens permanecerão no mesmo eixo e não serão quebrados quando ficarem sem espaço . Em vez disso, eles tentarão se espremer na mesma linha que os outros. Esse comportamento pode ser alterado usando as propriedades `align-items`, `justify-content` e `flex-wrap`. {% Codepen {user: 'web-dot-dev', id: 'jOyWLmg'}%} O Flexbox também converte os elementos filhos em **flex items**, o que significa que você pode escrever regras sobre como eles se comportam dentro de um flex container. Você pode alterar o alinhamento, a ordem e a justificação de um item individual. Você também pode alterar como ele diminui ou aumenta usando a propriedade `flex`

```css
.my-element div {
 	flex: 1 0 auto;
}
```

A propriedade `flex` é uma abreviação de `flex-grow`, `flex-shrink` e `flex-basis`. Você pode expandir o exemplo acima assim:

```css
.my-element div {
 flex-grow: 1;
 flex-shrink: 0;
 flex-basis: auto;
}
```

Os desenvolvedores fornecem essas regras de baixo nível para sugerir ao navegador como o layout deve se comportar quando for desafiado pelo conteúdo e pelas dimensões da janela de visualização. Isso o torna um mecanismo muito útil para o web design responsivo.

### Grid

```css
.my-element {
	display: grid;
}
```

Grid é semelhante em muitas maneiras ao **flexbox**, mas é projetado para controlar layouts de múltiplos eixos em vez de layouts de eixo único (espaço vertical ou horizontal). O Grid permite que você escreva regras de layout em um elemento que tenha `display: grid` e apresente alguns novos primitivos para estilo de layout, como as funções `repeat()` e `minmax()`. Uma unidade de grade útil é a `fr` - que é uma fração do espaço restante - você pode construir grades tradicionais de 12 colunas, com uma lacuna entre cada item, com 3 propriedades CSS:

```css
.my-element {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
```

{% Codepen {user: 'web-dot-dev', id: 'rNjxGVz'}%} Este exemplo acima mostra um layout de eixo único. Enquanto o flexbox trata principalmente os itens como um grupo, a grade oferece controle preciso sobre sua colocação em duas dimensões. Podemos definir que o primeiro item nesta grade ocupa 2 linhas e 3 colunas:

```css
.my-element :first-child {
  grid-row: 1/3;
  grid-column: 1/4;
}
```

As propriedades `grid-row` `grid-column` instruem o primeiro elemento na grade a se estender até o início da quarta coluna, a partir da primeira coluna e, em seguida, se estender até a terceira linha, a partir da primeira linha. {% Codepen { user: 'web-dot-dev', id: 'YzNwrwB', height: 650 } %}

## Layout de fluxo

Se não estiver usando grade ou flexbox, seus elementos serão exibidos em fluxo normal. Existem vários métodos de layout que você pode usar para ajustar o comportamento e a posição dos itens quando em fluxo normal.

### Bloco inline

Lembra-se de como os elementos ao redor não respeitam a margem do bloco e o preenchimento em um elemento inline? Com o `inline-block`, você *pode* fazer com que isso aconteça.

```css
p span {
	display: inline-block;
}
```

Usar `inline-block` fornece a você uma caixa que possui algumas das características de um elemento de nível de bloco, mas ainda flui embutido com o texto.

```css
p span {
	margin-top: 0.5rem;
}
```

{% Codepen { user: 'web-dot-dev', id: 'PoWZJKw', height: 300, tab: 'css,result' } %}

### Flutuadores

Se você tem uma imagem dentro de um parágrafo de texto, não seria útil que o texto envolvesse a imagem como você vê nos jornais? Você pode fazer isso com flutuadores.

```css
img {
	float: left;
	margin-right: 1em;
}
```

A propriedade `float` instrui um elemento a "flutuar" na direção especificada. A imagem neste exemplo é instruída a flutuar para a esquerda, o que permite que os elementos irmãos se "embrulhem" em torno dela. Você pode instruir um elemento a flutuar para a `left`, `right` ou `inherit`. {% Codepen {user: 'web-dot-dev', id: 'VwPaLMg', height: 300}%} {% Aside 'warning' %} Ao usar `float`, lembre-se de que qualquer elemento após o elemento flutuado pode ter seu layout ajustado. Para evitar isso, você pode limpar o float, usando `clear: both` em um elemento que segue seu elemento flutuado *ou* com `display: flow-root` no pai de seus elementos flutuantes. Saiba mais no artigo [O fim do hack do clearfix](https://rachelandrew.co.uk/archives/2017/01/24/the-end-of-the-clearfix-hack/). {% endAside %}

### Layout de várias colunas

Se você tem uma lista muito longa de elementos, como uma lista de todos os países do mundo, isso pode resultar em *muita* rolagem e perda de tempo para o usuário. Ele também pode criar espaços em branco excessivos na página. Com o CSS multicolunas, você pode dividir essa lista em várias colunas para ajudar com esses dois problemas.

```html
<h1>Todos os países</h1>
<ul class="countries">
  <li>Argentina</li>
  <li>Ilhas Aland</li>
  <li>Albânia</li>
  <li>Argélia</li>
  <li>Samoa Americana</li>
  <li>Andorra</li>
  …
</ul>
```

```css
.countries {
	column-count: 2;
	column-gap: 1em;
}
```

Isso divide automaticamente essa longa lista em duas colunas e adiciona uma lacuna entre as duas colunas. {% Codepen { user: 'web-dot-dev', id: 'gOgrpzO' } %}

```css
.countries {
	width: 100%;
	column-width: 260px;
	column-gap: 1em;
}
```

{% Codepen {user: 'web-dot-dev', id: 'jOyqPvB'}%} Em vez de definir o número de colunas em que o conteúdo é dividido, você também pode definir uma largura mínima desejada, usando `column-width`. À medida que mais espaço é disponibilizado na janela de visualização, mais colunas serão criadas automaticamente e, à medida que o espaço é reduzido, as colunas também reduzem. Isso é muito útil em contextos de web design responsivo.

### Posicionamento

Por último nesta visão geral dos mecanismos de layout está o posicionamento. A propriedade `position` muda como um elemento se comporta no fluxo normal do documento e como ele se relaciona com outros elementos. As opções disponíveis são `relative`, `absolute`, `fixed` e `sticky` com o valor padrão sendo `static` .

```css
.my-element {
  position: relative;
  top: 10px;
}
```

Este elemento é deslocado 10 px para baixo com base em sua posição atual no documento, visto que está posicionado em relação a si mesmo. Adicionar `position: relative` a um elemento também o torna o bloco que contém qualquer elemento filho com `position: absolute`. Isso significa que seu filho agora será reposicionado para este elemento específico, em vez do pai relativo superior, quando ele tiver uma posição absoluta aplicada a ele.

```css
.my-element {
  position: relative;
  width: 100px;
  height: 100px;
}

.another-element {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 50px;
	height: 50px;
}
```

Quando você define a `position` como `absolute` , ele quebra o elemento do fluxo de documento atual. Isso significa duas coisas:

1. Você pode posicionar este elemento onde quiser, usando `top`, `right`, `bottom` e `left` em seu pai relativo mais próximo.
2. Todo o conteúdo em torno de um elemento absoluto reflui para preencher o espaço restante deixado por esse elemento. Um elemento com um valor de `position` `fixed` se comporta de maneira semelhante ao `absolute` , com seu pai sendo o elemento raiz `<html>` . Os elementos de posição fixa permanecem ancorados no canto superior esquerdo com base nos valores `top` , `right` , `bottom` e `left` que você definir. Você pode obter os aspectos `fixed` e ancorados de aspectos fixos e os aspectos mais previsíveis de homenagem ao fluxo de documentos `relative` usando `sticky` . Com esse valor, conforme a janela de visualização rola além do elemento, ela permanece ancorada nos valores `top` , `right` , `bottom` e `left` que você definiu. {% Codepen {user: 'web-dot-dev', id: 'NWdNGZB', height: 600}%}

## Para finalizar

Há muitas opções e flexibilidade no layout CSS. Para se aprofundar ainda mais no poder do CSS [Flexbox](/learn/css/flexbox) e [Grid](/learn/css/grid), continue nos próximos módulos. {% Assessment 'layout' %}
