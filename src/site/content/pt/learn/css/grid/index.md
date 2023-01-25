---
title: Grade
description: A grade CSS fornece um sistema de layout bidimensional, com controle de linhas e colunas. Neste módulo, descubra tudo o que ela tem a oferecer.
audio:
  title: 'The CSS Podcast   - 011: Grid'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_011_v1.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - rachelandrew
  - andybell
date: 2021-04-29
---

Um layout bastante comum no design da Web tem cabeçalho, barra lateral, corpo e rodapé.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/tj7KmP72RKkffGQRswpA.svg", alt="Um cabeçalho com logotipo e navegação, uma barra lateral e uma área de conteúdo com um artigo", width="800", height="531" %}

Ao longo dos anos, foram criados vários métodos para resolver esse layout. No entanto, com a grade CSS (grid), ele é relativamente simples e oferece muitas opções. A grade é incrivelmente útil ao combinar o controle do dimensionamento extrínseco com a flexibilidade do dimensionamento intrínseco, o que a torna ideal para esse tipo de layout. Isso ocorre porque a grade é um método de layout projetado para conteúdo bidimensional, ou seja, organizado em linhas e colunas ao mesmo tempo.

Ao criar um layout de grade, escolha a opção com linhas e colunas. Em seguida, adicione itens à grade ou permita que o navegador preencha automaticamente as células criadas. É bastante coisa, mas uma visão geral dos recursos disponíveis ajudará você a criar layouts de grade.

## Visão geral

Então, o que é possível fazer com a grade? Veja abaixo os recursos dos layouts de grade. Você aprenderá sobre todos eles neste guia.

1. Uma grade pode ter linhas e colunas. Você pode escolher a dimensão das trilhas de linhas e de colunas ou ativar o dimensionamento com base no tamanho do conteúdo.
2. Os filhos diretos do contêiner da grade serão adicionados a ela automaticamente.
3. Como alternativa, você pode posicionar os itens de acordo com sua preferência.
4. As linhas e áreas na grade podem ser nomeadas para facilitar o posicionamento.
5. O espaço livre no contêiner da grade pode ser distribuído entre as trilhas.
6. Os itens da grade podem ser alinhados dentro da área.

## Terminologia relacionada à grade

Como é o primeiro sistema de layout real do CSS, vários novos termos foram acrescentados com a grade.

### Linhas da grade

Uma grade é composta de linhas, que correm na horizontal e vertical. Se sua grade tiver quatro colunas, ela terá cinco linhas de coluna, incluindo a que sucede a última.

A numeração das linhas começa em 1 e segue o modo de escrita e a direção do script do componente. Isso significa que a linha da coluna 1 estará à esquerda em um idioma da esquerda para a direita, como o inglês, e à direita, em um idioma da direita para a esquerda, como o árabe.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Sf8WXYmbhZkbhhPeqTrY.svg", alt="Uma representação de diagrama das linhas da grade", width="800", height="434" %}

### Trilhas da grade

Uma trilha é o espaço entre duas linhas de grade. Uma trilha de linha está entre duas linhas horizontais e uma trilha de coluna está entre duas linhas verticais. Ao criar a grade, essas trilhas são criadas ao atribuir um tamanho a elas.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/7YkhnpgOQLrcaxjlKmlU.svg", alt="Uma representação de diagrama da trilha de grade", width="800", height="434" %}

### Célula da grade

Uma célula da grade é o menor espaço definido pela intersecção de trilhas de linha e coluna. É como a célula de uma tabela ou em uma planilha. Se você definir uma grade e não adicionar os itens, cada um será disposto automaticamente em cada célula.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/lpiPCpW6fy4BjFOL6j77.svg", alt="Uma representação de diagrama da célula de uma grade", width="800", height="434" %}

### Área da grade

A área, uma junção de várias células da grade, é criada ao fazer com que um item ocupe diversas trilhas.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/pGmMokRfoVbLNxf1VXrF.svg", alt="Uma representação de diagrama da área de grade", width="800", height="434" %}

### Lacunas

São os espaçamentos ou separadores entre as trilhas. Para fins de dimensionamento, eles atuam como uma trilha normal. Você não pode colocar conteúdo em uma lacuna, mas pode estender os itens da grade através dela.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/JNXSRH4j77loSB099E04.svg", alt="Uma representação de diagrama de uma grade com lacunas", width="800", height="434" %}

### Contêiner da grade

É o elemento HTML com `display: grid` aplicado e, portanto, cria um novo contexto de formatação de grade para os filhos diretos.

```css
.container {
  display: grid;
}
```

### Item da grade

Um item de grade é um filho direto do contêiner de grade.

```html/1-3
<div class="container">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
```

## Linhas e colunas

Para criar uma grade básica, é possível definir uma grade com três trilhas de coluna, duas trilhas de linha e uma lacuna de 10 pixels entre as trilhas, conforme a seguir.

```css
.container {
    display: grid;
    grid-template-columns: 5em 100px 30%;
    grid-template-rows: 200px auto;
    gap: 10px;
}
```

Essa grade demonstra vários dos aspectos descritos na seção de terminologia. Ela possui três trilhas de coluna, cada uma com uma unidade de comprimento diferente. Ela possui duas trilhas de linha, uma que usa uma unidade de comprimento e outra automática. Quando usado para o dimensionamento da trilha, o modo automático é do tamanho conteúdo. As trilhas são dimensionadas automaticamente por padrão.

Se o elemento com uma classe `.container` tiver itens filhos, eles serão imediatamente dispostos nessa grade. Você pode ver isso em ação na demonstração abaixo.

{% Codepen { user: 'web-dot-dev', id: 'NWdbrzr' } %}

As ferramentas do desenvolvedor do Chrome para a grade podem ajudá-lo a entender as diversas partes dela.

Abra a [demonstração](https://codepen.io/web-dot-dev/full/NWdbrzr) no Chrome. Inspecione o elemento com o plano de fundo cinza, que possui um ID de `container`. Destaque a grade selecionando o selo dela no DOM, ao lado do elemento `.container`. Na guia "Layout", selecione **Display Line Numbers** (Exibir números das linhas) na lista suspensa para ver os números na grade.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/YxpjWBUDsqQB2fr6rzU3.jpg", alt="Conforme descrito nas legendas e instruções", width="800", height="449" %}<br>Uma grade destacada no Chrome DevTools mostrando números de linha, células e trilhas.</figure>

### Palavras-chave de dimensionamento intrínseco

Além das dimensões de comprimento e porcentagem descritas na seção sobre [unidades de dimensionamento](/learn/css/sizing), as trilhas de grade podem usar palavras-chave de dimensionamento intrínseco. Essas palavras-chave são definidas na especificação do Dimensionamento de caixa e adicionam outros métodos de dimensionamento de caixas ao CSS, e não apenas trilhas de grade.

- `min-content`
- `max-content`
- `fit-content()`

A palavra-chave [`min-content`](https://developer.mozilla.org/docs/Web/CSS/min-content) fará com que o tamanho da trilha seja o menor possível, sem que o conteúdo transborde. Ao alterar o layout da grade de exemplo para três trilhas de coluna, todas com o tamanho `min-content`, significa que elas se tornarão tão estreitas quanto a palavra mais longa da trilha.

A palavra-chave [`max-content`](https://developer.mozilla.org/docs/Web/CSS/max-content) tem o efeito oposto. A trilha se tornará larga o suficiente para que todo o conteúdo seja exibido em uma longa sequência ininterrupta. Isso pode causar transbordamentos, pois a string não será quebrada.

A função [`fit-content()`](https://developer.mozilla.org/docs/Web/CSS/fit-content()) atua inicialmente como `max-content`. No entanto, uma vez que a trilha atinge o tamanho transmitido na função, o conteúdo começa a ser quebrado. Portanto, `fit-content(10em)` criará uma trilha menor que 10em, se o tamanho `max-content` for menor que 10em, mas não maior que 10em.

Na próxima demonstração, teste as diferentes palavras-chave de dimensionamento intrínseco, alterando o dimensionamento das trilhas da grade.

{% Codepen { user: 'web-dot-dev', id: 'qBRqNgL', height: 600 } %}

{% Aside %} Talvez você observe que, nessa demonstração, quando a opção automática é usada, as colunas da grade se esticam para preencher o contêiner. As trilhas dimensionadas automaticamente serão esticadas por padrão se houver espaço adicional no contêiner da grade. {% endAside %}

### A unidade `fr`

Além das dimensões de comprimento, porcentagens e palavras-chave, há um método de dimensionamento especial que só funciona no layout de grade. Esse método é a unidade `fr`, um comprimento flexível que descreve uma parte do espaço disponível no contêiner da grade.

A unidade `fr` funciona de maneira semelhante ao uso do `flex: auto` no flexbox. Ela distribui o espaço depois que os itens foram dispostos. Portanto, para ter três colunas com a mesma divisão do espaço disponível, faça desta forma:

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

Como a unidade fr divide o espaço disponível, ela pode ser combinada com uma lacuna ou trilha de tamanho fixo. Para ter um componente com um elemento de tamanho fixo e a segunda trilha ocupar todo o espaço restante, use como uma lista de trilhas de `grid-template-columns: 200px 1fr`.

Ao usar valores diferentes para a unidade fr, o espaço será dividido proporcionalmente. Os valores maiores ocuparão uma parte maior do espaço livre. Na demonstração abaixo, altere o valor da terceira trilha.

{% Codepen { user: 'web-dot-dev', id: 'vYgyXNE', height: 600 } %}

### A função `minmax()`

Com essa função, é possível definir um tamanho mínimo e máximo para uma trilha. Isso pode ser bastante útil. Por exemplo, a unidade `fr` acima, que distribui o espaço restante, poderia ser escrita usando [`minmax()`](https://developer.mozilla.org/docs/Web/CSS/minmax()) como `minmax(auto, 1fr)`. A grade analisa o tamanho intrínseco do conteúdo e distribui o espaço disponível depois de fornecer espaço suficiente ao conteúdo. Isso significa que talvez as trilhas não tenham uma parcela igual do espaço disponível no contêiner da grade.

Para forçar uma trilha a ocupar uma parcela igual do espaço no contêiner da grade, excluindo as lacunas, use minmax. Substitua `1fr` como um tamanho de trilha por `minmax(0, 1fr)`. Isso define o tamanho mínimo da trilha como 0, e não o tamanho mínimo do conteúdo. A partir do tamanho total disponível no contêiner da grade, o tamanho necessário para as lacunas é subtraído e o resto é dividido conforme as unidades fr.

### Notação `repeat()`

Se você quiser criar uma grade com 12 trilhas de colunas iguais, use o seguinte CSS.

```css
.container {
    display: grid;
    grid-template-columns:
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr);
}
```

Como alternativa, é possível usar [`repeat()`](https://developer.mozilla.org/docs/Web/CSS/repeat()):

```css
.container {
    display: grid;
    grid-template-columns: repeat(12, minmax(0,1fr));
}
```

A função `repeat()` pode ser usada para repetir qualquer seção da lista de trilhas. Por exemplo, é possível repetir um padrão de trilhas. Você também pode ter algumas trilhas regulares e uma seção de repetição.

```css
.container {
    display: grid;
    grid-template-columns: 200px repeat(2, 1fr 2fr) 200px; /*cria seis trilhas*/
}
```

### `auto-fill` e `auto-fit`

É possível combinar tudo o que você aprendeu sobre o dimensionamento de trilhas, a função `minmax()` e a repetição para criar um padrão útil com layout de grade. Talvez você não queira especificar o número de trilhas de coluna, mas, em vez disso, deseje criar o máximo de trilhas possível no contêiner.

Você pode fazer isso com `repeat()` e a palavra-chave `auto-fill` ou `auto-fit`. Na demonstração abaixo, a grade criará o máximo de trilhas de 200 pixels possível no contêiner. Abra a demonstração em uma nova janela e veja como a grade muda conforme você altera o tamanho da janela de visualização (viewport).

{% Codepen { user: 'web-dot-dev', id: 'XWpNjgO' } %}

Na demonstração, obtemos o número máximo de trilhas possível. No entanto, as trilhas não são flexíveis. Haverá uma lacuna no final até que haja espaço suficiente para outra trilha de 200 pixels. Se você adicionar a função `minmax()`, poderá solicitar o máximo de trilhas que couber em um tamanho mínimo de 200 pixels e máximo de 1fr. A grade dispõe as trilhas de 200 pixels e qualquer espaço restante é distribuído igualmente entre elas.

Isso cria um layout responsivo bidimensional sem a necessidade de consultas de mídia.

{% Codepen { user: 'web-dot-dev', id: 'OJWbRax' } %}

Há uma diferença sutil entre `auto-fill` e `auto-fit`. Na próxima demonstração, teste a sintaxe explicada acima em um layout de grade, mas com apenas dois itens no contêiner. Usando a palavra-chave `auto-fill`, é possível ver que trilhas vazias foram criadas. Altere a palavra-chave para `auto-fit` e o tamanho das trilhas diminui para zero. Isso significa que as trilhas flexíveis agora se expandem para consumir o espaço.

{% Codepen { user: 'web-dot-dev', id: 'MWJbbNe' } %}

Fora essa exceção, as palavras-chave `auto-fill` e `auto-fit` agem exatamente da mesma maneira. Não há diferença entre elas uma vez que a primeira trilha é preenchida.

## Posicionamento automático

Você já viu como o posicionamento automático da grade funciona nas demonstrações até agora. Os itens são colocados na grade, um em cada célula, na ordem em que aparecem na origem. Para vários layouts, isso talvez seja tudo o que você precise. Se você precisar de mais controle, há algumas coisas que pode fazer. A primeira é ajustar o layout de posicionamento automático.

### Colocar itens nas colunas

O comportamento padrão do layout de grade é colocar os itens ao longo das linhas. Em vez disso, você pode fazer com que os itens sejam colocados nas colunas usando `grid-auto-flow: column`. É necessário definir as trilhas de linha, caso contrário, os itens criarão trilhas de coluna intrínsecas e tudo será disposto em uma longa linha.

Esses valores estão relacionados ao modo de escrita do documento. Uma linha sempre segue na direção de uma frase no modo de escrita do documento ou do componente. Na próxima demonstração, você poderá alterar o modo, o valor de `grid-auto-flow` e a propriedade `writing-mode`.

{% Codepen { user: 'web-dot-dev', id: 'PoWbWbr', height: 600 } %}

### Estender trilhas

Você pode fazer com que alguns ou todos os itens em um layout de posicionamento automático ocupem mais de uma trilha. Use a palavra-chave `span` e mais o número de linhas a serem ocupadas como o valor de `grid-column-end` ou `grid-row-end`.

```css
.item {
    grid-column-end: span 2; /* ocupará duas linhas, cobrindo duas trilhas */
}
```

Como você não especificou `grid-column-start`, ele usa o valor inicial de `auto` e é colocado de acordo com as regras de posicionamento automático. Você também pode especificar usando a abreviação `grid-column`:

```css
.item {
    grid-column: auto / span 2;
}
```

### Preencher lacunas

Um layout de posicionamento automático com alguns itens ocupando várias trilhas pode resultar em uma grade com algumas células não preenchidas. O comportamento padrão do layout de grade com um posicionamento totalmente automático é sempre avançar para frente. Os itens serão colocados de acordo com a ordem em que estão na origem ou qualquer alteração com a propriedade `order`. Se não houver espaço suficiente para um item, a grade deixará uma lacuna e avançará para a próxima trilha.

A próxima demonstração mostra esse comportamento. A caixa de seleção aplicará o modo de empacotamento "dense" (denso). Ele é habilitado ao definir `grid-auto-flow` com um valor `dense`. Com esse valor definido, a grade usará os itens para preencher as lacunas depois. Talvez o display fique desconectado da ordem lógica.

{% Codepen { user: 'web-dot-dev', id: 'ZELBLrJ', height: 600 } %}

## Colocar itens

Você já conhece várias funcionalidades da grade CSS. Vamos agora dar uma olhada em como posicionamos os itens na grade criada.

A primeira coisa de que você precisa lembrar é que o layout de grade CSS é baseado em uma grade de linhas numeradas. A maneira mais simples de colocar os itens na grade é movê-los de uma linha para outra. Você descobrirá outras maneiras de colocar os itens neste guia, mas sempre terá acesso a essas linhas numeradas.

As propriedades que você pode usar para posicionar os itens pelo número de linha são estas:

- [`grid-column-start`](https://developer.mozilla.org/docs/Web/CSS/grid-column-start)
- [`grid-column-end`](https://developer.mozilla.org/docs/Web/CSS/grid-column-end)
- [`grid-row-start`](https://developer.mozilla.org/docs/Web/CSS/grid-row-start)
- [`grid-row-end`](https://developer.mozilla.org/docs/Web/CSS/grid-row-end)

Elas têm abreviações que permitem definir as linhas inicial e final ao mesmo tempo:

- [`grid-column`](https://developer.mozilla.org/docs/Web/CSS/grid-column)
- [`grid-row`](https://developer.mozilla.org/docs/Web/CSS/grid-row)

Para colocar o item, defina as linhas inicial e final da área da grade em que ele deve ser posicionado.

```css
.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 200px 100px);
}

.item {
    grid-column-start: 1; /* start at column line 1 */
    grid-column-end: 4; /* end at column line 4 */
    grid-row-start: 2; /*start at row line 2 */
    grid-row-end: 4; /* end at row line 4 */
}
```

Para verificar onde o item é colocado, o Chrome DevTools pode fornecer um guia visual para as linhas.

A numeração das linhas segue o modo de escrita e a direção do componente. Na próxima demonstração, altere o modo ou a direção de escrita para ver como o posicionamento dos itens permanece consistente com a forma como o texto flui.

{% Codepen { user: 'web-dot-dev', id: 'QWdGdzd', height: 600 } %}

### Empilhar itens

Usando o posicionamento baseado em linhas, é possível colocar itens na mesma célula de grade. Isso significa que você pode empilhar itens ou fazer com que um item se sobreponha parcialmente a outro. Os itens que vêm depois na origem serão exibidos em cima dos itens que vêm antes. Você pode alterar essa ordem de empilhamento usando `z-index`, assim como com os itens posicionados.

{% Codepen { user: 'web-dot-dev', id: 'BapQWQW', height: 600 } %}

### Números de linha negativos

Ao usar `grid-template-rows` e `grid-template-columns`, você cria uma **grade explícita**. É uma grade que você definiu e forneceu o tamanho das trilhas.

Às vezes, você verá itens exibidos fora dessa grade explícita. Por exemplo, talvez você defina trilhas de coluna e, em seguida, adicione várias linhas de itens sem definir as trilhas de linha. As trilhas seriam dimensionadas automaticamente por padrão. Você também pode colocar um item usando `grid-column-end`, que está fora da grade explícita definida. Em ambos os casos, a grade criará trilhas para fazer com que o layout funcione, e essas trilhas são chamadas de **grade implícita**.

Na maioria das vezes, não fará diferença se você estiver trabalhando com uma grade implícita ou explícita. No entanto, com o posicionamento baseado em linhas, talvez você descubra a principal diferença entre os dois.

Usando números de linha negativos, você pode posicionar itens da linha final da grade explícita. Isso pode ser útil se quiser que um item ocupe da primeira à última linha de coluna. Nesse caso, use `grid-column: 1 / -1`. O item se estenderá ao longo da grade explícita.

No entanto, isso só funciona para a grade explícita. Tome como exemplo um layout de três linhas de itens posicionados automaticamente em que gostaria de estender o primeiro item até a linha final da grade.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Dt8yG376MqSyWJJ8KqPr.svg", alt="Uma barra lateral com oito itens de grade irmãos", width="800", height="359" %}

Talvez você ache que consegue usar `grid-row: 1 / -1` para esse item. Na demonstração abaixo, é possível ver que isso não funciona. As trilhas são criadas na grade implícita e não há como chegar ao final da grade usando `-1`.

{% Codepen {user: 'web-dot-dev', id: 'YzNpZeq'}%}

#### Dimensionamento de trilhas implícitas

As trilhas criadas na grade implícita serão dimensionadas automaticamente por padrão. No entanto, se você quiser controlar o tamanho das linhas, use a propriedade [`grid-auto-rows`](https://developer.mozilla.org/docs/Web/CSS/grid-auto-rows). Para as colunas, use [`grid-auto-columns`](https://developer.mozilla.org/docs/Web/CSS/grid-auto-columns).

Para criar todas as linhas implícitas com um tamanho mínimo de `10em` e um tamanho máximo de `auto`:

```css
.container {
    display: grid;
    grid-auto-rows: minmax(10em, auto);
}
```

Para criar colunas implícitas com um padrão de trilhas largas de 100 px e 200 px (nesse caso, a primeira coluna implícita terá 100 px, a segunda 200 px, a terceira 100 px e assim por diante):

```css
.container {
    display: grid;
    grid-auto-columns: 100px 200px;
}
```

## Linhas de grade nomeadas

Pode ser mais fácil colocar itens em um layout se as linhas tiverem um nome em vez de um número. É possível nomear qualquer linha da grade ao adicionar um nome de sua escolha entre colchetes. Vários nomes podem ser adicionados, separados por um espaço dentro dos colchetes. Depois de nomear as linhas, elas podem ser usadas no lugar dos números.

```css
.container {
    display: grid;
    grid-template-columns:
      [main-start aside-start] 1fr
      [aside-end content-start] 2fr
      [content-end main-end]; /* layout de duas colunas */
}

.sidebar {
    grid-column: aside-start / aside-end;
    /* posicionado entre a linha 1 e 2*/
}

footer {
    grid-column: main-start / main-end;
    /* através do layout da linha 1 a 3*/
}
```

## Áreas de modelo da grade

Também é possível nomear áreas da grade e colocar itens nelas. Essa é uma ótima técnica, pois permite ver a aparência do componente ali mesmo no CSS.

Para começar, nomeie os filhos diretos do contêiner da grade usando a propriedade [`grid-area`](https://developer.mozilla.org/docs/Web/CSS/grid-area):

```css
header {
    grid-area: header;
}

.sidebar {
    grid-area: sidebar;
}

.content {
    grid-area: content;
}

footer {
    grid-area: footer;
}
```

Escolha o nome que quiser, exceto as palavras-chave `auto` e `span`. Depois que todos os itens forem nomeados, use a propriedade [`grid-template-areas`](https://developer.mozilla.org/docs/Web/CSS/grid-template-areas) para definir quais células da grade cada item ocupará. Cada linha é definida entre aspas.

```css
.container {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-areas:
        "header header header header"
        "sidebar content content content"
        "sidebar footer footer footer";
}
```

Há algumas regras ao usar `grid-template-areas`.

- O valor precisa ser uma grade completa sem células vazias.
- Para estender as trilhas, repita o nome.
- As áreas criadas pela repetição do nome precisam ser retangulares e não podem ser desconectadas.

Se você violar qualquer uma das regras acima, o valor será considerado inválido e descartado.

Para deixar um espaço em branco na grade, use um `.` ou uma série sem espaços entre os caracteres. Por exemplo, para deixar a primeira célula da grade vazia, é possível adicionar uma série de caracteres `.`:

```css
.container {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-areas:
        "....... header header header"
        "sidebar content content content"
        "sidebar footer footer footer";
}
```

Como o layout inteiro é definido em um só lugar, é fácil fazer a redefinição dele usando consultas de mídia. No próximo exemplo, veja um layout de duas colunas que muda para três com a redefinição do valor de `grid-template-columns` e `grid-template-areas`. Abra o exemplo em uma nova janela para testar o tamanho da janela de visualização e ver a mudança de layout.

Você também pode ver como a propriedade `grid-template-areas` se relaciona ao `writing-mode` e à direção, bem como com os outros métodos de grade.

{% Codepen { user: 'web-dot-dev', id: 'oNBYepg', height: 600 } %}

## Propriedades abreviadas

Há duas propriedades abreviadas que permitem definir muitas das propriedades da grade de uma só vez. Elas podem parecer um pouco confusas até você entender exatamente como elas funcionam. Você decide se prefere usar a forma abreviada ou não.

### `grid-template`

A propriedade [`grid-template`](https://developer.mozilla.org/docs/Web/CSS/grid-template) é uma abreviação de `grid-template-rows`, `grid-template-columns` e `grid-template-areas`. As linhas são definidas primeiro, junto com o valor de `grid-template-areas`. O dimensionamento da coluna é adicionado após uma `/`.

```css
.container {
    display: grid;
    grid-template:
      "head head head" minmax(150px, auto)
      "sidebar content content" auto
      "sidebar footer footer" auto / 1fr 1fr 1fr;
}
```

### Propriedade `grid`

A abreviação [`grid`](https://developer.mozilla.org/docs/Web/CSS/grid) pode ser usada exatamente da mesma maneira que a `grid-template`. Quando usada dessa forma, ela redefinirá as outras propriedades da grade que aceita para os valores iniciais. O conjunto completo é este:

- `grid-template-rows`
- `grid-template-columns`
- `grid-template-areas`
- `grid-auto-rows`
- `grid-auto-columns`
- `grid-auto-flow`

Como alternativa, você pode usar esta abreviação para definir o comportamento da grade implícita, por exemplo:

```css
.container {
    display: grid;
    grid: repeat(2, 80px) / auto-flow  120px;
}
```

## Alinhamento

O layout de grade usa as mesmas propriedades de alinhamento aprendidas no guia do [flexbox](/learn/css/flexbox). Na grade, as propriedades que começam com `justify-` são sempre usadas no eixo inline, que é a direção em que as frases são executadas no modo de escrita.

As propriedades que começam com `align-` são usadas no eixo block, que é a direção em que os blocos são dispostos no modo de escrita.

- [`justify-content`](https://developer.mozilla.org/docs/Web/CSS/justify-content) e [`align-content`](https://developer.mozilla.org/docs/Web/CSS/align-content): distribuem espaço adicional no contêiner da grade ao redor ou entre as trilhas.
- [`justify-self`](https://developer.mozilla.org/docs/Web/CSS/justify-self) e [`align-self`](https://developer.mozilla.org/docs/Web/CSS/align-self): são aplicados a um item da grade para movê-lo dentro da área em que está posicionado.
- [`justify-items`](https://developer.mozilla.org/docs/Web/CSS/justify-items) e [`align-items`](https://developer.mozilla.org/docs/Web/CSS/align-items): são aplicados ao contêiner da grade para definir todas as propriedades `justify-self` nos itens.

### Distribuir espaço extra

Nesta demonstração, a grade é maior do que o espaço necessário para dispor as trilhas de largura fixa. Isso significa que temos espaço nas dimensões inline e block da grade. Experimente valores diferentes de `align-content` e `justify-content` para ver como as trilhas se comportam.

{% Codepen { user: 'web-dot-dev', id: 'rNjjMVd', height: 650 } %}

Observe como as lacunas aumentam ao usar valores como `space-between`, e qualquer item de grade que ocupa duas trilhas também se expande para absorver o espaço extra adicionado à lacuna.

{% Aside %} Como ocorre com o flexbox, essas propriedades só funcionarão se houver espaço adicional para distribuição. Se as trilhas da grade preencherem perfeitamente o contêiner, não haverá espaço para repartir. {% endAside %}

### Mover conteúdo

Os itens com uma cor de fundo parecem preencher completamente a área da grade em que são colocados, porque o valor inicial para `justify-self` e `align-self` é `stretch`.

{% Aside %} Se o item for uma imagem ou algo com proporção intrínseca, o valor inicial será `start`, em vez de `stretch`, para evitar esticar até ficar deformado. {% endAside %}

Na demonstração, altere os valores de `justify-items` e `align-items` para ver como isso muda o layout. A área da grade não muda de tamanho, em vez disso, os itens são movimentados dentro da área definida.

{% Codepen { user: 'web-dot-dev', id: 'YzZOOXB', height: 650 } %}

{% Assessment 'grid' %}

## Recursos

Este guia ofereceu uma visão geral das diferentes partes da especificação do layout da grade. Para saber mais, dê uma olhada nos seguintes recursos.

- [Layout de grade CSS do MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout)
- [Um guia completo sobre a grade](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Como criar um contêiner de grade](https://www.smashingmagazine.com/2020/01/understanding-css-grid-container/)
- [Uma coleção abrangente de material de aprendizagem sobre a grade](https://gridbyexample.com/)
