---
title: Dez layouts modernos em uma linha de CSS
subhead: Este post destaca algumas linhas poderosas de CSS que fazem muito trabalho pesado e ajudam você a construir layouts modernos e robustos.
authors:
  - una
description: Este post destaca algumas linhas poderosas de CSS que fazem muito trabalho pesado e ajudam você a construir layouts modernos e robustos.
date: 2020-07-07
hero: image/admin/B07IzuMeRRGRLH9UQkwd.png
alt: Layout do Santo Graal.
tags:
  - blog
  - css
  - layout
  - mobile
---

{% YouTube 'qm0IfG1GyZU' %}

Os layouts CSS modernos permitem que os desenvolvedores escrevam regras de estilo realmente significativas e robustas com apenas alguns toques no teclado. A palestra acima e este post subsequente exploram 10 linhas poderosas de CSS que fazem trabalhos pesados e importantes.

{% Glitch { id: '1linelayouts', path: 'README.md', height: 480 } %}

Para acompanhar ou brincar com essas demos por conta própria, veja o embed do Glitch acima ou visite [1linelayouts.glitch.me](https://1linelayouts.glitch.me).

## 01. Supercentrado: `place-items: center`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/01-place-items-center.mp4">
  </source></video></figure>

O primeiro layout de 'linha única' é o que resolve o maior mistério de todo o mundo do CSS: como centralizar as coisas. Quero que você saiba que é mais fácil do que você imagina com [`place-items: center`](https://developer.mozilla.org/docs/Web/CSS/place-items).

Primeiro especifique a `grid` como o `display` e, a seguir, escreva `place-items: center` no mesmo elemento. `place-items` é um atalho para definir `align-items` `justify-items` de uma só vez. Ao defini-lo como `center`, os `align-items` `justify-items` são definidos como `center`.

```css/2
.parent {
  display: grid;
  place-items: center;
}
```

Isto permite que o conteúdo seja perfeitamente centralizado no pai, independente do tamanho intrínseco.

## 02. A panqueca desconstruída: `flex: <grow> <shrink> <baseWidth>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-1.mp4">
  </source></video></figure>

Em seguida, temos a panqueca desconstruída! Este é um layout comum em sites de marketing, por exemplo, que pode ter uma linha de 3 itens, geralmente com uma imagem, título e algum texto, descrevendo algumas características de um produto. No celular, queremos que eles se empilhem bem e se expandam à medida que aumentamos o tamanho da tela.

Ao usar o Flexbox para esse efeito, você não precisará de media queries para ajustar o posicionamento desses elementos quando a tela for redimensionada.

A abreviação [`flex`](https://developer.mozilla.org/docs/Web/CSS/flex) significa `flex: <flex-grow> <flex-shrink> <flex-basis>`.

Por causa disso, se você quiser que suas caixas sejam preenchidas até o `<flex-basis>`, reduzam em tamanhos menores, mas não *estiquem* para preencher nenhum espaço adicional, escreva: `flex: 0 1 <flex-basis>`. Nesse caso, seu `<flex-basis>` tem `150px` e fica assim:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 0 1 150px;
}
```

Mas se você *deseja* que as caixas se alonguem e preencham o espaço à medida em que quebram para a próxima linha, defina o `<flex-grow>` em `1`, da forma abaixo:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 1 1 150px;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-2.mp4">
  </source></video></figure>

Agora, conforme você aumenta ou diminui o tamanho da tela, esses itens flexíveis encolhem e aumentam.

## 03. Sidebar Says: `grid-template-columns: minmax(<min>, <max>) …)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/03-sidebar-says.mp4">
  </source></video></figure>

Esta demonstração aproveita a função [minmax](https://developer.mozilla.org/docs/Web/CSS/minmax) para layouts de grade. O que estamos fazendo aqui é definir o tamanho mínimo da barra lateral em `150px`, mas em telas maiores, permitindo que isto se estenda até `25%`. A barra lateral sempre ocupará `25%` do espaço horizontal de seu elemento-pai até que `25%` se torne menor que `150px`.

Adicione isto como um valor de grid-template-columns com o seguinte valor: `minmax(150px, 25%) 1fr`. O item na primeira coluna (a barra lateral, neste caso) obtém um `minmax` de `150px` a `25%` e o segundo item (a seção `main` aqui) ocupa o resto do espaço como uma única faixa de `1fr`.

```css/2
.parent {
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr;
}
```

## 04. Pilha de panquecas: `grid-template-rows: auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/04-pancake-stack.mp4">
  </source></video></figure>

Ao contrário da Panqueca Desconstruída, este exemplo não envolve seus elementos-filho quando o tamanho da tela muda. Normalmente conhecido como [rodapé fixo](https://developer.mozilla.org/docs/Web/CSS/Layout_cookbook/Sticky_footers), este layout é frequentemente usado para sites e aplicativos, em aplicativos móveis (o rodapé geralmente é uma barra de ferramentas) e sites (aplicativos de página única costumam usar este layout global).

Adicionar `display: grid` ao componente fornecerá uma grade de coluna única, porém a área principal terá a altura do conteúdo com o rodapé abaixo dela.

Para fazer o rodapé colar na parte inferior, acrescente:

```css/2
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

Isto configura o conteúdo do cabeçalho e rodapé para assumir automaticamente o tamanho de seus filhos e aplica o espaço restante (`1fr`) à área principal, enquanto a linha dimensionada com `auto` assumirá o tamanho do conteúdo mínimo de seus filhos, de modo que à medida em que esse conteúdo aumenta de tamanho, a própria linha crescerá para se ajustar.

## 05. Clássico layout do Santo Graal: `grid-template: auto 1fr auto / auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/05-holy-grail.mp4">
  </source></video></figure>

Para este layout clássico do Santo Graal, há um cabeçalho, rodapé, barra lateral esquerda, barra lateral direita e conteúdo principal. É semelhante ao layout anterior, mas agora com barras laterais!

Para escrever toda essa grade usando uma única linha de código, use a propriedade `grid-template`. Ela permite que você defina as linhas e colunas ao mesmo tempo.

A propriedade e valores são: `grid-template: auto 1fr auto / auto 1fr auto`. A barra entre a primeira e a segunda listas separadas por espaço é a quebra entre linhas e colunas.

```css/2
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
```

Como no último exemplo, onde o cabeçalho e o rodapé tinham conteúdo dimensionado automaticamente, aqui as barras laterais esquerda e direita são dimensionadas automaticamente com base no tamanho intrínseco de seus filhos. No entanto, desta vez é o tamanho horizontal (largura) em vez de vertical (altura).

## 06. 12-Span Grid: `grid-template-columns: repeat(12, 1fr)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-1.mp4">
  </source></video></figure>

Em seguida temos outro clássico: a grade de 12 intervalos. Você pode escrever grades em CSS rapidamente com a função `repeat()`. Usando: `repeat(12, 1fr);` para as colunas do modelo da grade, você obtém 12 colunas de `1fr` cada.

```css/2,6
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-span-12 {
  grid-column: 1 / 13;
}
```

Agora que você tem uma grade de 12 colunas podemos colocar nossos elementos-filho na grade. Uma maneira de fazer isso seria posicioná-los usando linhas de grade. Por exemplo, `grid-column: 1 / 13` iria se estender desde a primeira linha até a última (13ª) e ocupar 12 colunas. `grid-column: 1 / 5;` abrangeria as primeiras quatro.

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-2.mp4">
  </source></video></figure>

Outra maneira de escrever isso é usando a palavra-chave `span`. Com `span`, você define a linha de partida e, em seguida, quantas colunas devem ser dispostas a partir desse ponto de partida. Neste caso, `grid-column: 1 / span 12` seria equivalente a `grid-column: 1 / 13` e `grid-column: 2 / span 6` seria equivalente a `grid-column: 2 / 8`.

```css/1
.child-span-12 {
  grid-column: 1 / span 12;
}
```

## 07. RAM (Repeat, Auto, MinMax): `grid-template-columns(auto-fit, minmax(<base>, 1fr))`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-1.mp4">
  </source></video></figure>

Para este sétimo exemplo, combine alguns dos conceitos que você já aprendeu para criar um layout responsivo com elementos-filho flexíveis e posicionados automaticamente. Tudo muito bem arrumado. Os termos-chave a serem lembrados aqui são `repeat`, `auto-(fit|fill)` e `minmax()'`, que você lembra pela sigla RAM.

Tudo junto fica assim:

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

Você está usando repeat de novo, mas desta vez, usando a palavra-chave `auto-fit` vez de um valor numérico explícito. Isto permite a colocação automática desses elementos-filho. Esses elementos-filho também têm um valor mínimo inicial de `150px` `1fr` com um valor máximo de 1fr, ou seja, em telas menores, eles ocuparão toda a largura `1fr` e, à medida que atingirem `150px` px de largura cada, começarão a fluir para a mesma linha.

Com o `auto-fit`, as caixas se esticarão conforme seu tamanho horizontal ultrapassar 150 px para preencher todo o espaço restante. No entanto, se você alterar para `auto-fill`, elas não se estenderão quando seu tamanho de base na função minmax for excedido:

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-2.mp4">
  </source></video></figure>

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
```

## 08. Line Up: `justify-content: space-between`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/08-lineup.mp4">
  </source></video></figure>

Para o próximo layout, o ponto principal a demonstrar aqui é `justify-content: space-between`, que coloca o primeiro e o último elemento filho nas bordas de sua caixa delimitadora, com o espaço restante igualmente distribuído entre os elementos. Para esses cartões, eles são colocados em um modo de exibição Flexbox, com a direção sendo definida por coluna usando `flex-direction: column`.

Isto coloca o título, a descrição e o bloco de imagem numa coluna vertical dentro do cartão pai. Em seguida, a aplicação de `justify-content: space-between` ancora o primeiro (título) e o último (bloco de imagem) elementos às bordas do flexbox, e o texto descritivo entre eles é colocado com espaçamento igual para cada endpoint.

```css/3
.parent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

## 09. Clamping My Style: `clamp(<min>, <actual>, <max>)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/09-clamping.mp4">
  </source></video></figure>

É aqui que entramos em algumas técnicas com [menos suporte dos navegadores](https://caniuse.com/#feat=css-math-functions), mas que têm algumas implicações realmente interessantes para layouts e design de interfaces responsivas. Nesta demonstração, você define a largura usando clamp da seguinte forma: `width: clamp(<min>, <actual>, <max>)`.

Isto determina um tamanho mínimo e máximo absolutos e um tamanho real. Com valores, isso pode ser algo com:

```css/1
.parent {
  width: clamp(23ch, 60%, 46ch);
}
```

O tamanho mínimo aqui é `23ch` ou 23 unidades de caracteres, e o tamanho máximo é `46ch`, 46 caracteres. [As unidades de largura dos caracteres](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/) são baseadas no tamanho da fonte do elemento (especificamente a largura do glifo `0`). O tamanho 'real' é 50%, o que representa 50% da largura do elemento pai deste elemento.

O que a função `clamp()` está fazendo aqui é permitir que este elemento retenha uma largura de 50% *até que* 50% seja maior que `46ch` (em viewports mais largas) ou menor que `23ch` (em viewports menores). Você pode ver que conforme eu estico e encolho o tamanho principal, a largura deste cartão aumenta até o ponto máximo fixado e diminui até o mínimo fixado. Em seguida, ele permanece centralizado no elemento pai, pois aplicamos propriedades adicionais para centralizá-lo. Isto permite layouts mais legíveis, pois o texto nunca será muito largo (acima de `46ch`) nem muito comprimido e estreito (menos de `23ch`).

Esta também é uma ótima maneira de implementar tipografia responsiva. Por exemplo, você pode escrever: `font-size: clamp(1.5rem, 20vw, 3rem)`. Neste caso, o tamanho da fonte de um título sempre ficaria entre `1.5rem` e `3rem` mas aumentaria e diminuiria com base no valor real de `20vw` para se ajustar à largura da viewport.

Esta é uma ótima técnica para garantir a legibilidade com um valor de tamanho mínimo e máximo, mas lembre-se de que não é suportada em todos os navegadores modernos, portanto, certifique-se de ter fallbacks e faça seus testes.

## 10. Respect for Aspect: `aspect-ratio: <width> / <height>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/10-aspectratio.mp4">
  </source></video></figure>

E, finalmente, esta última ferramenta de layout é a mais experimental do grupo. Foi recentemente apresentada ao Chrome Canary no Chromium 84, e há um esforço ativo do Firefox para implementá-la, mas atualmente não está em nenhuma versão estável de navegador.

Eu quero mencioná-la, entretanto, porque tem relação com um problema encontrado com frequência, que é simplesmente manter a proporção de uma imagem.

Com a propriedade `aspect-ratio`, à medida em que eu redimensiono o cartão, o bloco visual verde mantém essa proporção de 16 x 9. Estamos respeitando a relação de aspecto com `aspect-ratio: 16 / 9`.

```css/1
.video {
  aspect-ratio: 16 / 9;
}
```

Para manter uma proporção de aspecto de 16 x 9 sem essa propriedade, você precisaria usar um [hack](https://css-tricks.com/aspect-ratio-boxes/) com `padding-top` e dar a ele um padding de `56.25%` para definir uma proporção entre o topo e a largura. Em breve teremos uma propriedade para isto, evitando a necessidade do hack e de calcular o percentual. Você pode fazer um quadrado com proporção `1 / 1`, uma proporção de 2 para 1 com `2 / 1`, e realmente qualquer coisa que você precisar para esta imagem redimensionar numa proporção definida.

```css/1
.square {
  aspect-ratio: 1 / 1;
}
```

Embora este recurso ainda esteja em desenvolvimento, é bom conhecê-lo, pois resolve muitos conflitos de desenvolvimento que já enfrentei muitas vezes, especialmente quando se trata de vídeo e iframes.

## Conclusão

Obrigado por acompanhar esta jornada através de 10 linhas poderosas de CSS. Para saber mais, assista [ao vídeo completo](https://youtu.be/qm0IfG1GyZU) e experimente [as demos](https://1linelayouts.glitch.me) você mesmo.
