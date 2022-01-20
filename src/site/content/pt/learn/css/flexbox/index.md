---
title: Flexbox
description: |2

  Flexbox é um mecanismo de layout projetado para organizar grupos de itens em uma dimensão.
  Aprenda como usá-lo neste módulo.
audio:
  title: 'O CSS Podcast   - 010: Flexbox'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_010_v1.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - rachelandrew
  - andybell
date: 2021-04-21
---

Um padrão de design que pode ser complicado em design responsivo é uma barra lateral que fica alinhada com algum conteúdo. Onde há espaço de janela de visualização, esse padrão funciona muito bem, mas onde o espaço é condensado, esse layout rígido pode se tornar problemático.

{% Codepen { user: 'web-dot-dev', id: 'poRENWv', height: 420 } %}

O modelo de layout de caixa flexível (flexbox) é um modelo de layout projetado para conteúdo unidimensional. Ele se destaca em pegar vários itens de tamanhos diferentes e retornar o melhor layout para esses itens.

Este é o modelo de layout ideal para este padrão de barra lateral. O Flexbox não apenas ajuda a colocar a barra lateral e o conteúdo em linha, mas onde não há espaço suficiente restante, a barra lateral se quebra em uma nova linha. Em vez de definir dimensões rígidas para o navegador seguir, com o flexbox, você pode fornecer limites flexíveis para sugerir como o conteúdo pode ser exibido.

{% Codepen {user: 'web-dot-dev', id: 'xxgERMp', height: 400}%}

## O que você pode fazer com um layout flexível?

Os layouts flexíveis possuem os seguintes recursos, que você poderá explorar neste guia.

- Eles podem ser exibidos como uma linha ou coluna.
- Eles respeitam o modo de escrita do documento.
- Eles são uma linha por padrão, mas podem ser solicitados a quebrar em várias linhas.
- Os itens no layout podem ser reordenados visualmente, longe de sua ordem no DOM.
- O espaço pode ser distribuído dentro dos itens, de forma que eles fiquem maiores e menores de acordo com o espaço disponível em seus pais.
- O espaço pode ser distribuído ao redor dos itens e linhas flexíveis em um layout encapsulado, usando as propriedades do Alinhamento de caixa.
- Os próprios itens podem ser alinhados no eixo transversal.

## O eixo principal e o eixo transversal

A chave para entender o flexbox é entender o conceito de eixo principal e eixo transversal. O eixo principal é aquele definido por sua propriedade `flex-direction` Se for `row` seu eixo principal está ao longo da linha, se for `column` seu eixo principal está ao longo da coluna.

<figure>{% Img src = "image/VbAJIREinuYvovrBzzvEyZOpw5w1/xKtf0cHRw0xQyiyYuuyz.svg", alt = "Três caixas próximas umas das outras com uma seta apontando da esquerda para a direita. A seta é rotulada como Eixo principal", width = "800", height = " 320 "%}</figure>

Os itens flexíveis se movem como um grupo no eixo principal. Lembre-se: temos um monte de coisas e estamos tentando obter o melhor layout para eles como um grupo.

O eixo cruzado corre na direção oposta ao eixo principal, portanto, se `flex-direction` for `row` o eixo cruzado corre ao longo da coluna.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/5wCsZcBmK5L33LS7nOmP.svg", alt="Três caixas de alturas diferentes, uma ao lado da outra com uma seta apontando da esquerda para a direita. A seta está rotulada como Eixo principal. inferior. Este é rotulado como eixo cruzado", width="800", height="320" %}</figure>

Você pode fazer duas coisas no eixo transversal. Você pode mover os itens individualmente ou como um grupo para que eles se alinhem uns com os outros e com o contêiner flexível. Além disso, se você encapsulou as linhas flexíveis, pode tratar essas linhas como um grupo para controlar como o espaço é atribuído a essas linhas. Você verá como tudo isso funciona na prática ao longo deste guia, por enquanto, apenas tenha em mente que o eixo principal segue sua `flex-direction`.

## Criação de um contêiner flexível

Vamos ver como o flexbox se comporta pegando um grupo de itens de diferentes tamanhos e usando o flexbox para distribuí-los.

```html
<div class="container" id="container">
  <div>One</div>
  <div>Item two</div>
  <div>The item we will refer to as three</div>
</div>
```

Para usar o flexbox, você precisa declarar que deseja usar um contexto de formatação flexível e não bloco regular e layout embutido. Faça isso alterando o valor da propriedade `display` `flex` .

```css
.container {
  display: flex;
}
```

Como você aprendeu no [guia de layout,](/learn/css/layout) isso lhe dará uma caixa em nível de bloco, com filhos de itens flexíveis. Os itens flex imediatamente começam a exibir algum comportamento do flexbox, usando seus **valores iniciais**.

{% Aside %} Todas as propriedades CSS têm valores iniciais que controlam como se comportam "fora da caixa" quando você não aplicou nenhum CSS para alterar esse comportamento inicial. Os filhos de nosso contêiner flexível tornam-se itens flex assim que seu pai recebe `display: flex`, então esses valores iniciais significam que começamos a ver algum comportamento do flexbox. {% endAside %}

Os valores iniciais significam que:

- Os itens são exibidos como uma linha.
- Eles não se enrolam.
- Eles não crescem para encher o recipiente.
- Eles se alinham no início do contêiner.

## Controlando a direção dos itens

Mesmo que você não tenha adicionado uma `flex-direction` ainda, os itens são exibidos como uma linha porque o valor inicial de `flex-direction` é `row`. Se você quiser uma linha, não precisa adicionar a propriedade. Para alterar a direção, adicione a propriedade e um dos quatro valores:

- `row` : os itens são dispostos como uma fileira.
- `row-reverse:` os itens são dispostos como uma linha a partir do final do contêiner flexível.
- `column` : os itens são dispostos como uma coluna.
- `column-reverse` : os itens são dispostos como uma coluna a partir do final do contêiner flexível.

Você pode experimentar todos os valores usando nosso grupo de itens na demonstração abaixo.

{% Codepen { user: 'web-dot-dev', id: 'bGgKNXq' } %}

### Reverter o fluxo de itens e acessibilidade

Você deve ter cuidado ao usar quaisquer propriedades que reordenem a exibição visual de como as coisas estão ordenadas no documento HTML, pois isso pode afetar negativamente a acessibilidade. Os `column-reverse` `row-reverse` coluna são um bom exemplo disso. O reordenamento só acontece para a ordem visual, não para a ordem lógica. É importante entender isso porque a ordem lógica é a ordem em que um leitor de tela lerá o conteúdo e qualquer pessoa que navegue usando o teclado a seguirá.

Você pode ver no vídeo a seguir como, em um layout de coluna invertido, a tabulação entre os links se desconecta, pois a navegação do teclado segue o DOM e não a exibição visual.

{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/IgpaIRZd7kOq8sd46eaR.mp4", autoplay=true, controls=true %}

Qualquer coisa que possa alterar a ordem dos itens no flexbox ou na grade pode causar esse problema. Portanto, qualquer reordenamento deve incluir testes completos para verificar se isso não tornará o seu site difícil de usar para algumas pessoas.

Para mais informações, veja:

- [Reordenação de conteúdo](/content-reordering/)
- [O Flexbox e a navegação do teclado se desconectam](https://tink.uk/flexbox-the-keyboard-navigation-disconnect/)

### Modos e direção de escrita

Os itens flexíveis são dispostos como uma linha por padrão. Uma linha segue na direção em que as frases fluem em seu modo de escrita e na direção do script. Isso significa que se você estiver trabalhando em árabe, que tem uma direção de script da direita para a esquerda (rtl), os itens serão alinhados à direita. A ordem das tabulações também começa à direita, pois é assim que as frases são lidas em árabe.

{% Codepen {user: 'web-dot-dev', id: 'ExZgwWN'}%}

Se você estiver trabalhando com um modo de escrita vertical, como algumas fontes japonesas, uma linha será exibida verticalmente, de cima para baixo. Tente mudar a `flex-direction` neste demo que está usando um modo de escrita vertical.

{% Codepen {user: 'web-dot-dev', id: 'qBRaPXX', height: 600}%}

Portanto, a maneira como os flex items se comportam por padrão está vinculada ao modo de escrita do documento. A maioria dos tutoriais é escrita em inglês ou outro modo de escrita horizontal, da esquerda para a direita. Isso tornaria mais fácil presumir que os itens flexíveis se alinham **à esquerda** e rodam **horizontalmente**.

Com o eixo principal e cruzado mais o modo de escrita a ser considerado, o fato de falarmos sobre **início** e **fim em** vez de topo, base, esquerda e direita no flexbox pode ser mais fácil de entender. Cada eixo tem um início e um fim. O início do eixo principal é conhecido como **início principal**. Portanto, nossos itens flexíveis inicialmente se alinham do main-start. O fim desse eixo é o **fim principal**. O início do eixo cruzado é um **início cruzado** e o final um **final cruzado**.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/uSH4TxRv8KNQDTK7Vn8h.svg", alt="Um diagrama rotulado dos termos acima", width="800", height="382" %}

## Envolvendo itens flexíveis

O valor inicial da propriedade `flex-wrap` `nowrap`. Isso significa que, se não houver espaço suficiente no contêiner, os itens transbordarão.

<figure>{% Img src = "image/VbAJIREinuYvovrBzzvEyZOpw5w1/VTUdLS9PeBziBvbOSc4q.jpg", alt = "Um contêiner flexível com nove itens dentro, os itens diminuíram de modo que uma palavra está em uma linha, mas não há espaço suficiente para mostrá-los lado a lado para que os itens flexíveis tenham se estendido para fora da caixa do contêiner. ", width =" 800 ", height =" 282 "%}<figcaption> Assim que atingirem o tamanho mínimo do conteúdo, os itens flexíveis começarão a estourar seu contêiner</figcaption></figure>

Os itens exibidos com os valores iniciais serão reduzidos o máximo possível, até o `min-content` antes que ocorra o estouro.

Para fazer com que os itens embrulhem, adicione `flex-wrap: wrap` ao contêiner flexível.

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
```

{% Codepen {user: 'web-dot-dev', id: 'WNRGdNZ', height: 601}%}

Quando um contêiner flexível é enrolado, ele cria várias **linhas flexíveis**. Em termos de distribuição de espaço, cada linha atua como um novo contêiner flexível. Portanto, se você estiver agrupando linhas, não é possível fazer com que algo na linha 2 se alinhe com algo acima dela na linha 1. Isso é o que significa que o flexbox é unidimensional. Você pode controlar o alinhamento em um eixo, uma linha ou uma coluna, não os dois juntos como podemos fazer na grade.

### A abreviação do flex-flow

Você pode definir as propriedades `flex-direction` e `flex-wrap` usando a abreviação `flex-flow`. Por exemplo, para definir `flex-direction` para `column` e permitir que os itens sejam agrupados:

```css
.container {
  display: flex;
  flex-flow: column wrap;
}
```

## Controlando o espaço dentro dos itens flexíveis

Supondo que nosso contêiner tenha mais espaço do que o necessário para exibir os itens, os itens se alinham no início e não crescem para preencher o espaço. Eles param de crescer em seu tamanho máximo de conteúdo. Isso ocorre porque o valor inicial das `flex-` é:

- `flex-grow: 0` : os itens não crescem.
- `flex-shrink: 1` : os itens podem encolher até menos do que sua `flex-basis`.
- `flex-basis: auto` : os itens têm um tamanho base de `auto`.

Isso pode ser representado por um valor de palavra-chave `flex:initial`. A `flex` shorthand, ou as longhands de `flex-grow`, `flex-shrink` e `flex-basis` são aplicadas aos filhos do contêiner flexível.

{% Codepen {user: 'web-dot-dev', id: 'LYxRebE'}%}

Para fazer com que os itens cresçam, enquanto permite que itens grandes tenham mais espaço do que os pequenos, use `flex:auto`. Você pode tentar fazer isso usando a demonstração acima. Isso define as propriedades para:

- `flex-grow: 1` : os itens podem crescer mais do que sua `flex-basis`.
- `flex-shrink: 1` : os itens podem encolher até menos do que sua `flex-basis`.
- `flex-basis: auto` : os itens têm um tamanho base de `auto`.

Usar `flex: auto` significará que os itens terão tamanhos diferentes, já que o espaço que é compartilhado entre os itens é compartilhado *depois que* cada item é disposto como tamanho máximo do conteúdo. Portanto, um item grande ganhará mais espaço. Para forçar todos os itens a terem um tamanho consistente e ignorar o tamanho do conteúdo, altere `flex:auto` para `flex: 1` na demonstração.

Isso descompacta para:

- `flex-grow: 1` : os itens podem crescer mais do que sua `flex-basis`.
- `flex-shrink: 1` : os itens podem encolher até menos do que sua `flex-basis`.
- `flex-basis: 0` : os itens têm um tamanho base de `0`.

Usando `flex: 1` diz que todos os itens têm tamanho zero, portanto, todo o espaço no contêiner flexível está disponível para ser distribuído. Como todos os itens têm um fator de `flex-grow` `1`, todos eles crescem igualmente e o espaço é compartilhado igualmente.

{% Aside %} Também existe um valor de `flex: none`, o que lhe dará itens flex inflexíveis que não aumentam ou diminuem. Isso pode ser útil se você estiver usando apenas o flexbox para acessar as propriedades de alinhamento, mas não quiser nenhum comportamento flexível. {% endAside %}

### Permitindo que os itens cresçam em taxas diferentes

Você não precisa dar a todos os itens um fator de `flex-grow` `1`. Você pode dar aos seus itens flexíveis diferentes fatores de `flex-grow`. Na demonstração abaixo, o primeiro item tem `flex: 1`, o segundo `flex: 2` e o terceiro `flex: 3`. Conforme esses itens crescem de `0` o espaço disponível no contêiner flexível é dividido em seis. Uma parte é dada ao primeiro item, duas partes ao segundo, três partes ao terceiro.

{% Codepen {user: 'web-dot-dev', id: 'OJWRzEz'}%}

Você pode fazer a mesma coisa em uma `flex-basis` de `auto`, embora seja necessário especificar os três valores. O primeiro valor sendo `flex-grow`, o segundo `flex-shrink` e o terceiro `flex-basis`.

```css
.item1 {
  flex: 1 1 auto;
}

.item2 {
  flex: 2 1 auto;
}
```

Este é um caso de uso menos comum, pois a razão para usar uma `flex-basis` do `auto` é permitir que o navegador descubra a distribuição do espaço. Se você quiser que um item cresça um pouco mais do que o algoritmo decide, pode ser útil.

## Reordenando itens flexíveis

Os itens em seu contêiner flexível podem ser reordenados usando a propriedade `order` Esta propriedade permite a ordenação de itens em **grupos ordinais**. Os itens são dispostos na direção ditada pela `flex-direction`, os valores mais baixos primeiro. Se mais de um item tiver o mesmo valor, ele será exibido com os outros itens com esse valor.

O exemplo abaixo demonstra essa ordem.

{% Codepen {user: 'web-dot-dev', id: 'NWdRXoL'}%}

{% Aside 'warning' %} Usar a `order` tem os mesmos problemas que os valores `column-reverse` `row-reverse` `flex-direction`. Seria muito fácil criar uma experiência desconectada para alguns usuários. Não use a `order` porque você está consertando coisas que estão fora de ordem no documento. Se os itens logicamente deveriam estar em uma ordem diferente, altere seu HTML! {% endAside %}

{% Assessment 'flex' %}

## Visão geral do alinhamento Flexbox

O Flexbox trouxe consigo um conjunto de propriedades para alinhar itens e distribuir espaço entre os itens. Essas propriedades foram tão úteis que, desde então, foram movidas para suas próprias especificações, você também as encontrará no Layout de grade. Aqui você pode descobrir como eles funcionam quando você está usando o flexbox.

O conjunto de propriedades pode ser colocado em dois grupos. Propriedades para distribuição espacial e propriedades para alinhamento. As propriedades que distribuem o espaço são:

- `justify-content`: distribuição do espaço no eixo principal.
- `align-content`: distribuição de espaço no eixo transversal.
- `place-content`: uma abreviação para definir as duas propriedades acima.

As propriedades usadas para alinhamento no flexbox:

- `align-self`: alinha um único item no eixo cruzado
- `align-items`: alinha todos os itens como um grupo no eixo cruzado

Se você estiver trabalhando no eixo principal, as propriedades começam com `justify-`. No eixo transversal, eles começam com `align-`.

## Distribuindo espaço no eixo principal

Com o HTML usado anteriormente, os itens flexíveis dispostos como uma linha, há espaço no eixo principal. Os itens não são grandes o suficiente para encher completamente o recipiente flexível. Os itens se alinham no início do contêiner flexível porque o valor inicial de `justify-content` é `flex-start`. Os itens se alinham no início e qualquer espaço extra fica no final.

Adicione a `justify-content` ao contêiner flexível, atribua a ele um valor `flex-end` e os itens se alinham no final do container e o espaço livre é colocado no início.

```css
.container {
  display: flex;
  justify-content: flex-end;
}
```

Você também pode distribuir o espaço entre os itens com `justify-content: space-between`.

Experimente alguns dos valores da demonstração e [consulte o MDN](https://developer.mozilla.org/docs/Web/CSS/justify-content) para obter o conjunto completo de valores possíveis.

{% Codepen { user: 'web-dot-dev', id: 'JjERpGb'}%}

{% Aside %} Para que a `justify-content` faça qualquer coisa, você precisa ter espaço livre em seu contêiner no eixo principal. Se seus itens preencherem o eixo, não haverá espaço para compartilhar, então a propriedade não fará nada. {% endAside %}

### Com `flex-direction: column`

Se você alterou sua `flex-direction` para `column`, `justify-content` funcionará na coluna. Para ter espaço livre em seu contêiner ao trabalhar como uma coluna, você precisa dar a ele uma `height` ou `block-size`. Caso contrário, você não terá espaço livre para distribuir.

Experimente os diferentes valores, desta vez com um layout de coluna flexbox.

{% Codepen {user: 'web-dot-dev', id: 'bGgwLgz', height: 600}%}

## Distribuindo espaço entre as linhas flexíveis

Com um contêiner flexível encapsulado, você pode ter espaço para distribuir no eixo transversal. Nesse caso, você pode usar a `align-content` com os mesmos valores que `justify-content`. Ao contrário de `justify-content` que alinha itens para `flex-start` por padrão, o valor inicial de `align-content` é `stretch`. Adicione a propriedade `align-content` ao contêiner flexível para alterar esse comportamento padrão.

```css
.container {
  align-content: center;
}
```

Experimente na demonstração. O exemplo tem linhas quebradas de itens flexíveis e o contêiner tem um `block-size` para que tenhamos algum espaço livre.

{% Codepen {user: 'web-dot-dev', id: 'poREawo'}%}

### A abreviatura de `place-content`

Para definir `justify-content` e `align-content` você pode usar `place-content` com um ou dois valores. Um único valor será usado para ambos os eixos, se você especificar que o primeiro é usado para `align-content` e o segundo para `justify-content`.

```css
.container {
  place-content: space-between;
  /* sets both to space-between */
}

.container {
  place-content: center flex-end;
  /* wrapped lines on the cross axis are centered,
  on the main axis items are aligned to the end of the flex container */
}
```

## Alinhando itens no eixo cruzado

No eixo cruzado, você também pode alinhar seus itens dentro da linha flexível usando `align-items` e `align-self`. O espaço disponível para este alinhamento dependerá da altura do contêiner flexível, ou linha flexível no caso de um conjunto de itens envolvidos.

O valor inicial de `align-self` é `stretch`, que é o motivo pelo qual os itens flexíveis em uma linha se estendem até a altura do item mais alto por padrão. Para mudar isso, adicione a `align-self` a qualquer um dos seus itens flex.

```css
.container {
  display: flex;
}

.item1 {
  align-self: flex-start;
}
```

Use qualquer um dos seguintes valores para alinhar o item:

- `flex-start`
- `flex-end`
- `center`
- `stretch`
- `baseline`

Veja [a lista completa de valores no MDN](https://developer.mozilla.org/docs/Web/CSS/align-self).

A próxima demonstração tem uma única linha de flex items com `flex-direction: row`. O último item define a altura do contêiner flexível. O primeiro item possui a `align-self` com um valor de `flex-start`. Tente alterar o valor dessa propriedade para ver como ela se move dentro do seu espaço no eixo cruzado.

{% Codepen {user: 'web-dot-dev', id: 'RwKGQee', height: 600}%}

A `align-self` é aplicada a itens individuais. A `align-items` pode ser aplicada ao contêiner flexível para definir todas as propriedades individuais do `align-self` como um grupo.

```css
.container {
  display: flex;
  align-items: flex-start;
}
```

Na próxima demonstração, tente alterar o valor de `align-items` para alinhar todos os itens no eixo cruzado como um grupo.

{% Codepen {user: 'web-dot-dev', id: 'QWdKmby', height: 600}%}

## Por que não há justify-self no flexbox?

Os itens flexíveis atuam como um grupo no eixo principal. Portanto, não existe o conceito de separar um item individual desse grupo.

No layout de grade, as propriedades `justify-self` e `justify-items` funcionam no eixo em linha para fazer o alinhamento dos itens naquele eixo dentro de sua área de grade. Devido à maneira como os layouts flexíveis tratam os itens como um grupo, essas propriedades não são implementadas em um contexto flexível.

Vale a pena saber que o flexbox funciona muito bem com margens automáticas. Se você encontrar a necessidade de separar um item de um grupo, ou separar o grupo em dois grupos, pode aplicar uma margem para fazer isso. No exemplo abaixo, o último item tem uma margem esquerda `auto`. A margem automática absorve todo o espaço na direção em que é aplicada. Isso significa que ele empurra o item para a direita, dividindo os grupos.

{% Codepen {user: 'web-dot-dev', id: 'poRELbR'}%}

## Como centralizar um item vertical e horizontalmente

As propriedades de alinhamento podem ser usadas para centralizar um item dentro de outra caixa. A `justify-content` alinha o item no eixo principal, que é a linha. A `align-items` no eixo cruzado.

```css
.container {
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

{% Aside %} No futuro, poderemos fazer esse alinhamento sem precisar tornar o pai um contêiner flexível. As propriedades de alinhamento são especificadas para blocos e layout embutido. No momento, nenhum navegador os implementou. No entanto, mudar para um contexto de formatação flexível fornece acesso às propriedades. Se você precisa alinhar algo, é uma ótima maneira de fazer isso. {% endAside %}

{% Assessment 'conclusion' %}

## Recursos

- [Layout de caixa flexível CSS do MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout) inclui uma série de guias detalhados com exemplos.
- [Guia de dicas de CSS para Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [O que acontece quando você cria um contêiner Flexbox Flex](https://www.smashingmagazine.com/2018/08/flexbox-display-flex-container/)
- [Tudo o que você precisa saber sobre alinhamento no Flexbox](https://www.smashingmagazine.com/2018/08/flexbox-alignment/)
- [Qual é o tamanho dessa caixa flexível?](https://www.smashingmagazine.com/2018/09/flexbox-sizing-flexible-box/)
- [Casos de uso para Flexbox](https://www.smashingmagazine.com/2018/10/flexbox-use-cases/)
