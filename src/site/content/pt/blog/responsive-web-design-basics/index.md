---
title: Fundamentos de web design responsivo
subhead: Como criar sites que atendam às necessidades e recursos do dispositivo em que são exibidos.
description: Como criar sites que atendam às necessidades e recursos do dispositivo em que são exibidos.
date: 2019-02-12
updated: 2020-05-14
authors:
  - petelepage
  - rachelandrew
tags:
  - blog
  - css
  - layout
  - mobile
  - ux
---

{# TODO (kayce): Remova este ToC codificado depois que o #1983 chegar. #}

- [Defina a viewport (janela de visualização)](#viewport)
- [Reimensione o conteúdo para a viewport](#size-content)
- [Use media queries (consultas de mídia) CSS para responsividade](#media-queries)
- [Como escolher breakpoints (pontos de interrupção)](#breakpoints)
- [Visualize breakpoints de media queries no Chrome DevTools](#devtools)

O uso de dispositivos móveis para navegar na web continua a crescer num ritmo astronômico. Mas esses dispositivos costumam ser limitados pelo tamanho da tela e exigem uma abordagem diferente de como o conteúdo é organizado na tela.

O web design responsivo, definido originalmente por [Ethan Marcotte em A List Apart](http://alistapart.com/article/responsive-web-design/), atende às necessidades dos usuários e dos dispositivos que eles estão usando. O layout muda com base no tamanho e nas capacidades do dispositivo. Por exemplo, num telefone, os usuários veriam o conteúdo mostrado numa coluna única; um tablet já poderia mostrar o mesmo conteúdo em duas colunas.

<figure>   {% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RKRFvbuoXGkOSuEArb7.mp4", autoplay=true, controls=true, loop=true, muted=true, playsinline=true %}</figure>

Existe uma infinidade de tamanhos de tela diferentes em celulares, "phablets", tablets, desktops, consoles de jogos, TVs e até mesmo wearables. Os tamanhos de tela estão sempre mudando, por isso é importante que seu site possa se adaptar a qualquer tamanho de tela, hoje ou no futuro. Além disso, os dispositivos possuem recursos diferentes com os quais interagimos com eles. Por exemplo, alguns de seus visitantes usarão uma tela sensível ao toque. O design responsivo moderno considera todas essas coisas para otimizar a experiência para todos.

## Defina a viewport {: #viewport }

As páginas otimizadas para uma variedade de dispositivos devem incluir uma meta tag viewport no cabeçalho do documento. Uma meta tag viewport fornece ao navegador instruções sobre como controlar as dimensões e o redimensionamento da página.

Para proporcionar a melhor experiência, os navegadores móveis renderizam a página numa largura de tela de desktop (geralmente cerca de `980px` , embora isso varie entre dispositivos) e, em seguida, tentam fazer o conteúdo parecer melhor aumentando os tamanhos das fontes e redimensionando o conteúdo para caber no tela. Isto significa que os tamanhos das fontes podem parecer inconsistentes para os usuários, que podem ter que dar um duplo-toque ou beliscar para aplicar zoom com a finalidade de ver e interagir com o conteúdo.

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …

```

Usando o valor meta viewport de `width=device-width` instrui a página a corresponder à largura da tela em pixels independentes de dispositivo. Um pixel independente de dispositivo (ou de densidade) é uma representação de um único pixel, que na realizada pode consistir de muitos pixels físicos, numa tela de alta densidade. Isto permite que a página readapte o conteúdo para corresponder a diferentes tamanhos de tela, seja ele renderizado num pequeno telefone celular ou num grande monitor de área de trabalho.

<figure>   {% Img src="image/admin/SrMBH5gokGU06S0GsjLS.png", alt="Captura de tela de uma página com o texto difícil de ler porque está muito pequeno", width="500", height="640" %}   <figcaption> Exemplo de como a página é carregada num dispositivo sem a meta tag viewport. <a href="https://without-vp-meta.glitch.me/">Veja este exemplo no Glitch</a>. </figcaption></figure>

<figure>   {% Img src="image/admin/9NrJxt3aEv37A3E7km65.png", alt="Captura de tela da mesma página com o texto em um tamanho que pode ser lido", width="500", height="888" %}   <figcaption>     Um exemplo de como a página é carregada em dispositivo com a meta tag viewport. <a href="https://with-vp-meta.glitch.me/">Veja este exemplo no Glitch</a>.   </figcaption></figure>

[Alguns navegadores](https://css-tricks.com/probably-use-initial-scale1/) mantêm a largura da página constante ao girar para o modo paisagem e fazem zoom em vez de refluir o conteúdo para preencher a tela. Adicionar o valor `initial-scale=1` instrui os navegadores a estabelecer uma relação 1:1 entre pixels CSS e pixels independentes de dispositivo, independentemente da orientação do dispositivo, e permite que a página aproveite a largura total do modo paisagem.

{% Aside 'caution' %} Para garantir que os navegadores mais antigos possam analisar corretamente os atributos, use uma vírgula para separar os atributos. {% endAside %}

A auditoria do Lighthouse [Não tem uma tag `<meta name="viewport">` com `width` ou `initial-scale`](https://developer.chrome.com/docs/lighthouse/pwa/viewport/) pode ajudá-lo a automatizar o processo de certificar-se de que seus documentos HTML estão usando a meta tag viewport corretamente.

### Garanta uma viewport acessível {: #accessible-viewport}

Além de definir uma `initial-scale`, você também pode definir os seguintes atributos na viewport:

- `minimum-scale`
- `maximum-scale`
- `user-scalable`

Quando estabelecidos, eles podem desativar a capacidade do usuário de ampliar a viewport, trazendo causar problemas de acessibilidade. Portanto, não recomendamos o uso desses atributos.

## Reimensione o conteúdo para a viewport {: #size-content }

Tanto em desktops quanto em dispositivos móveis, os usuários estão acostumados a rolar os sites verticalmente, mas não horizontalmente; forçar o usuário a rolar horizontalmente ou diminuir o zoom para ver a página inteira resulta numa experiência do usuário ruim.

Ao desenvolver um site para celular com uma meta tag viewport (que define as dimensões da janela de visualização), é fácil criar acidentalmente conteúdo de página que não cabe na janela de visualização especificada. Por exemplo, uma imagem exibida com uma largura maior do que a viewport pode fazer com que a janela de visualização role horizontalmente. Você deve ajustar esse conteúdo para caber na largura da janela de visualização, de modo que o usuário não precise rolar horizontalmente.

A auditoria do Lighthouse [O conteúdo não está dimensionado corretamente para a viewport](/content-width/) pode ajudá-lo a automatizar o processo de detecção de conteúdo que extrapola a janela de visualização.

### Imagens {: #images}

Uma imagem tem dimensões fixas e se for maior do que a janela de visualização ela irá forçar o aparecimento de uma barra de rolagem. Uma maneira comum de lidar com esse problema é dar a todas as imagens uma `max-width` de `100%`. Isto fará com que a imagem encolha para caber no espaço que tem, caso o tamanho da janela de visualização seja menor do que a imagem. No entanto, como a `max-width`, em vez da `width` é de `100%`, a imagem não se estenderá além de seu tamanho natural. Geralmente é seguro adicionar o seguinte à sua folha de estilo para que você nunca tenha problemas com imagens forçando o aparecimento de uma barra de rolagem.

```css
img {
  max-width: 100%;
  display: block;
}
```

#### Adicione as dimensões da imagem ao elemento img {: #image-responses}

Ao usar `max-width: 100%` você está redefinindo as dimensões naturais da imagem, no entanto, você ainda deve usar os atributos `width` e `height` na sua tag `<img>` pois os navegadores modernos usarão essas informações para reservar espaço para a imagem antes de carregá-la, o que evitará [deslocamentos no layout](/optimize-cls/) à medida em que o conteúdo é carregado.

### Layout {: #layout }

Como as dimensões e largura da tela em pixels CSS variam amplamente entre dispositivos (por exemplo, entre celulares e tablets, e até mesmo entre celulares diferentes), o conteúdo não deve depender de uma largura de viewport específica para renderizar bem.

No passado, isto exigia elementos de configuração para definir o layout em porcentagens. No exemplo abaixo está mostrado um layout de duas colunas com elementos flutuantes, dimensionados usando pixels. Uma vez que a viewport é menor do que a largura total das colunas, somos obrigados a rolar horizontalmente para ver o conteúdo.

<figure>   {% Img src="image/admin/exFCZNQLUveUnpMFjvcj.jpg", alt="Captura de tela de um layout de duas colunas com a maior parte da segunda coluna fora da viewport", width="800", height="504" %}   <figcaption> Um layout flutuante usando pixels. <a href="https://layout-floats-px.glitch.me/">Veja este exemplo no Glitch</a>  </figcaption></figure>

Usando porcentagens para as larguras, as colunas sempre se mantêm proporcionais ao contêiner. Isso significa que as colunas se tornam mais estreitas, em vez de criar uma barra de rolagem.

{% Glitch { id: 'layout-floats-percent', path: 'README.md' } %}

As técnicas modernas de layout CSS, como Flexbox, Grid Layout e Multicol, tornam a criação dessas grades flexíveis muito mais fácil.

#### Flexbox {: #flexbox }

Este método de layout é ideal quando você tem um conjunto de itens de tamanhos diferentes e deseja que eles se encaixem confortavelmente em uma ou mais fileiras, com itens menores ocupando menos espaço e itens maiores ocupando mais espaço.

```css
.items {
  display: flex;
  justify-content: space-between;
}
```

Num design responsivo, você pode usar o Flexbox para exibir itens como uma única linha ou agrupados em várias linhas conforme o espaço disponível diminui.

{% Glitch { id: 'responsive-flexbox', height: 220 } %}

[Leia mais sobre o Flexbox](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox).

#### CSS Grid Layout {: #grid }

O CSS Grid Layout (layout de grade) permite a criação direta de grades flexíveis. Se considerarmos o exemplo flutuante anterior, em vez de criar nossas colunas com porcentagens, poderíamos usar o layout de grade e a unidade `fr`, que representa uma parte do espaço disponível no contêiner.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
```

{% Glitch 'two-column-grid' %}

O CSS Grid Layout também pode ser usada para criar layouts de grade regulares, com tantos itens quantos couberem. O número de faixas disponíveis será reduzido conforme o tamanho da tela diminui. Na demonstração abaixo, temos tantas cartas quantas cabem em cada linha, com um tamanho mínimo de `200px`.

{% Glitch 'grid-as-many-as-fit' %}

[Leia mais sobre o CSS Grid Layout](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Grids)

#### Layout multicolunas {: #multicol}

Para alguns tipos de layout, você pode usar o Multiple-column Layout (Multicol), que pode criar várias colunas responsivas com a propriedade `column-width` Na demonstração abaixo, você pode ver que colunas são adicionadas se houver espaço para outra coluna de `200px`

{% Glitch { id: 'responsive-multicol', path: 'style.css' } %}

[Leia mais sobre Multicol](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Multiple-column_Layout)

## Use media queries (consultas de mídia) CSS para responsividade {: #media-queries }

Às vezes, você precisará fazer alterações mais abrangentes no seu layout para suportar um determinado tamanho de tela do que as técnicas mostradas acima permitem. É aqui que as media queries se tornam úteis.

Media queries (consultas de mídia) são filtros simples que podem ser aplicados a estilos CSS. Eles facilitam a mudança de estilos com base nos tipos de dispositivo que renderizam o conteúdo ou nos recursos desse dispositivo, por exemplo, largura, altura, orientação, efeito hover e se o dispositivo está sendo usado como uma tela sensível ao toque.

Para fornecer diferentes estilos para impressão, você precisa informar um *tipo* de saída que possa incluir uma folha de estilo com estilos de impressão da seguinte maneira:

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <link rel="stylesheet" href="print.css" media="print">
    …
  </head>
  …
```

Como alternativa, você pode incluir estilos de impressão em sua folha de estilo principal usando uma media query:

```css
@media print {
  /* print styles go here */
}
```

{% Aside 'note' %} Também é possível incluir folhas de estilo separadas no seu arquivo CSS principal usando a sintaxe `@import`, `@import url(print.css) print;`, no entanto, esse uso não é recomendado por motivos de desempenho. Veja [Evite importações de CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations#avoid_css_imports) para mais detalhes. {% endAside %}

Para web design responsivo, estamos basicamente pesquisando os *recursos* do dispositivo a fim de fornecer um layout diferente para telas menores ou quando detectamos que nosso visitante está usando uma tela sensível ao toque.

### Media queries baseadas no tamanho do viewport {: #viewport-media-queries}

As media queries (consultas de mídia) nos permitem criar uma experiência responsiva onde estilos específicos são aplicados a telas pequenas, telas grandes e em qualquer lugar entre os dois. O recurso que estamos detectando aqui é, portanto, o tamanho da tela e podemos testar o seguinte.

- `width` (`min-width`, `max-width`)
- `height` (`min-height`, `max-height`)
- `orientation`
- `aspect-ratio`

{% Glitch { id: 'media-queries-size', path: 'index.html' } %}

Todos esses recursos têm excelente suporte pelo navegador, para obter mais detalhes, incluindo informações de suporte do navegador, veja [width](https://developer.mozilla.org/docs/Web/CSS/@media/width), [height](https://developer.mozilla.org/docs/Web/CSS/@media/height), [orientation](https://developer.mozilla.org/docs/Web/CSS/@media/orientation) e [aspect-ratio](https://developer.mozilla.org/docs/Web/CSS/@media/aspect-ratio) no MDN.

{% Aside 'note' %} A especificação chegou a incluir testes para `device-width` e `device-height`. Mas eles foram descontinuados e devem ser evitados. As propriedades `device-width` e `device-height` testavam o tamanho real da janela do dispositivo, o que não era útil na prática já que pode ser diferente da janela de visualização para a qual o usuário está olhando, por exemplo, se o usuário redimensionou a janela do navegador. {% endAside %}

### Media queries baseadas na capacidade do dispositivo {: #capacity-media-queries}

Dada a variedade de dispositivos disponíveis, não podemos presumir que todo dispositivo grande seja um desktop ou notebook comum, ou que as pessoas só usem uma tela sensível ao toque num dispositivo pequeno. Com algumas adições mais recentes à especificação de media queries, podemos testar recursos como o tipo de ponteiro usado para interagir com o dispositivo e se o usuário pode passar o mouse sobre os elementos (efeito hover).

- `hover`
- `pointer`
- `any-hover`
- `any-pointer`

Experimente visualizar esta demonstração em diferentes dispositivos, como um computador desktop normal e um telefone ou tablet.

{% Glitch 'media-query-pointer' %}

Esses recursos mais recentes têm um bom suporte em todos os navegadores modernos. Descubra mais nas páginas MDN para [hover](https://developer.mozilla.org/docs/Web/CSS/@media/hover), [any-hover](https://developer.mozilla.org/docs/Web/CSS/@media/any-hover), [pointer](https://developer.mozilla.org/docs/Web/CSS/@media/pointer), [any-pointer](https://developer.mozilla.org/docs/Web/CSS/@media/any-pointer).

#### Usando `any-hover` e `any-pointer`

Os recursos `any-hover` e `any-pointer` testam se o usuário tem a capacidade de passar o mouse sobre um alvo (hover) ou usar esse tipo de ponteiro mesmo que não seja a maneira principal de interagir com o dispositivo. Tenha muito cuidado ao usá-los. Forçar um usuário a mudar para um mouse quando ele estiver usando uma tela sensível ao toque não é uma atitude muito amigável! No entanto, `any-hover` e `any-pointer` podem ser úteis se for importante descobrir que tipo de dispositivo o usuário possui. Por exemplo, um notebook com tela sensível ao toque e um trackpad devem corresponder a ponteiros de baixa e alta precisão, além da capacidade de hover.

## Como escolher breakpoints (pontos de interrupção) {: #breakpoints}

Não defina breakpoints (pontos de interrupção) com base em classes de dispositivos. Definir breakpoints com base em dispositivos, produtos, nomes de marcas ou sistemas operacionais específicos que estão em uso hoje pode resultar em um pesadelo de manutenção. Em vez disso, o próprio conteúdo deve determinar como o layout se ajusta ao seu contêiner.

### Escolha os principais breakpoints, inicialmente aos poucos e ampliando depois {: #major-breakpoints }

Projete o conteúdo para caber numa tela pequena primeiro e, em seguida, expanda a tela até que um breakpoint se torne necessário. Isto permite que você otimize os breakpoints com base no conteúdo e tenha que manter o menor número possível deles.

Vamos explorar o exemplo que vimos no início: a previsão do tempo. O primeiro passo é fazer com que a previsão pareça boa numa tela pequena.

<figure>   {% Img src="image/admin/3KPWtKzDFCwImLyHprRP.png", alt="Captura de tela de um aplicativo de previsão do tempo em uma largura móvel", width="400", height="667" %}   <figcaption> O aplicativo tem uma largura estreita.   </figcaption></figure>

Em seguida, redimensione o navegador até que haja excesso de espaço em branco entre os elementos e a previsão simplesmente não pareça tão boa. A decisão é um tanto subjetiva, mas uma dimensão acima de `600px` é sem dúvida larga demais.

<figure>   {% Img src="image/admin/sh1P84rvjvviENlVFED4.png", alt="Captura de tela de um aplicativo de clima com grandes lacunas entre os itens", width="400", height="240" %}   <figcaption>O aplicativo em um ponto em que sentimos que devemos ajustar o design. </figcaption></figure>

Para inserir um breakpoint em `600px`, crie duas media queries no final de seu CSS para o componente, uma para usar quando o navegador tiver `600px` ou menos e outra para quando ele for mais largo que `600px` .

```css
@media (max-width: 600px) {

}

@media (min-width: 601px) {

}
```

Finalmente, refatore o CSS. Dentro da media query para uma `max-width` de `600px`, adicione o CSS destinado a telas pequenas. Dentro da media query para uma `min-width` de `601px` adicione o CSS para telas maiores.

#### Escolha breakpoints menores quando necessário

Além de escolher os principais breakpoints quando o layout muda significativamente, também é útil fazer ajustes para pequenas alterações. Por exemplo, entre os principais breakpoints, pode ser útil ajustar as margens ou padding de um elemento ou aumentar o tamanho da fonte para deixá-la mais natural no layout.

Vamos começar otimizando o layout da tela pequena. Nesse caso, vamos aumentar a fonte quando a largura da viewport for maior que `360px`. Em segundo lugar, quando houver espaço suficiente, podemos separar as temperaturas altas e baixas para que fiquem na mesma linha, em vez de uma em cima da outra. E também vamos aumentar um pouco os ícones de clima.

```css
@media (min-width: 360px) {
  body {
    font-size: 1.0em;
  }
}

@media (min-width: 500px) {
  .seven-day-fc .temp-low,
  .seven-day-fc .temp-high {
    display: inline-block;
    width: 45%;
  }

  .seven-day-fc .seven-day-temp {
    margin-left: 5%;
  }

  .seven-day-fc .icon {
    width: 64px;
    height: 64px;
  }
}
```

Da mesma forma, para telas grandes, é melhor limitar a largura máxima do painel de previsão para que não consuma toda a largura da tela.

```css
@media (min-width: 700px) {
  .weather-forecast {
    width: 700px;
  }
}
```

{% Glitch { id: 'responsive-forecast', path: 'style.css' } %}

### Otimize o texto para leitura

A teoria clássica da legibilidade sugere que uma coluna ideal deve conter de 70 a 80 caracteres por linha (cerca de 8 a 10 palavras em inglês). Portanto, cada vez que a largura de um bloco de texto ultrapassar cerca de 10 palavras, considere adicionar um breakpoint.

<figure>   {% Img src="image/admin/C4IGJw9hbPXKnTSovEXS.jpg", alt="Captura de tela de uma página de texto em um dispositivo móvel", width="400", height="488" %}   <figcaption>    O texto lido em um dispositivo móvel.</figcaption></figure>

<figure>   {% Img src="image/admin/rmsa1EB5FpvWV0vFIpTF.jpg", alt="Captura de tela de uma página de texto em um navegador de desktop", width="800", height="377" %}   <figcaption>     O texto lido em um navegador de desktop com um breakpoint adicionado para restringir o comprimento da linha. </figcaption></figure>

Vamos dar uma olhada mais a fundo no exemplo de postagem do blog acima. Em telas menores, a fonte Roboto com `1em` funciona perfeitamente resultando em 10 palavras por linha, mas telas maiores requerem um breakpoint. Nesse caso, se a largura do navegador for maior que `575px`, a largura ideal do conteúdo é `550px` .

```css
@media (min-width: 575px) {
  article {
    width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

{% Glitch { id: 'rwd-reading', path: 'index.html' } %}

### Evite simplesmente ocultar o conteúdo

Tenha cuidado ao escolher o conteúdo a ocultar ou mostrar, dependendo do tamanho da tela. Não esconda conteúdo simplesmente porque ele não cabe na tela. O tamanho da tela não é uma indicação definitiva do que o usuário pode desejar. Por exemplo, eliminar a contagem de pólen da previsão do tempo pode ser um problema sério para quem sofre de alergia na primavera, que precisa de informações para determinar se pode sair de casa ou não.

## Visualize breakpoints de media query no Chrome DevTools {: #devtools}

Depois de configurar seus breakpoints de media query, você vai querer ver como seu site se apresenta com eles. Você pode redimensionar a janela do navegador para acionar os breakpoints, mas o Chrome DevTools tem um recurso integrado que facilita a visualização da aparência de uma página em diferentes breakpoints.

<figure>{% Img src="image/admin/DhaeCbVo5AmzZ0CyLtVp.png", alt="Captura de tela de DevTools com nosso aplicativo de clima aberto e uma largura de 822 pixels selecionada.", width="800", height="522" %} <figcaption> DevTools mostrando o aplicativo de previsão do tempo enquanto olha para um tamanho de viewport maior. </figcaption></figure>

<figure>   {% Img src="image/admin/35IEQnhGox93PHvbeglM.png", alt="Captura de tela do DevTools com nosso aplicativo de clima aberto e uma largura de 436 pixels selecionada.", width="800", height="521" %}   <figcaption>     DevTools mostrando o aplicativo de clima enquanto olha para um tamanho de viewport mais estreito.   </figcaption></figure>

Para visualizar sua página em diferentes breakpoints:

[Abra DevTools](https://developer.chrome.com/docs/devtools/open/) e ative o [Modo de Dispositivo](https://developer.chrome.com/docs/devtools/device-mode/#toggle). Isto abre no [modo responsivo](https://developer.chrome.com/docs/devtools/device-mode/#responsive) por default.

Para ver suas media queries, abra o menu Modo de Dispositivo e selecione [Mostrar media queries](https://developer.chrome.com/docs/devtools/device-mode/#queries) para exibir seus breakpoints como barras coloridas acima de sua página.

Clique numa das barras para visualizar sua página enquanto a media query está ativa. Clique com o botão direito numa barra para ir para a definição da media query.
