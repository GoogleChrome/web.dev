---
layout: post
title: Como construir um componente de abas
subhead: Uma visão geral básica de como construir um componente de abas semelhante aos encontrados em aplicativos iOS e Android.
authors:
  - adamargyle
description: Uma visão geral básica de como construir um componente de abas semelhante aos encontrados em aplicativos iOS e Android.
date: 2021-02-17
hero: image/admin/sq79nDAthaQGcdQkqazJ.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

Nesta postagem, quero compartilhar ideias sobre a construção de um componente de abas para a web que seja responsivo, ofereça suporte a variadas entradas de dispositivo e funcione em múltiplos navegadores. Experimente a [demonstração](https://gui-challenges.web.app/tabs/dist/).

<figure data-size="full">   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IBDNCMVCysfM9fYC9bnP.mp4",     autoplay="true",     loop="true",     muted="true"   %}   <figcaption>     <a href="https://gui-challenges.web.app/tabs/dist/">Demo</a>   </figcaption></figure>

Se você preferir vídeo, aqui está uma versão desta postagem no YouTube:

{% YouTube 'mMBcHcvxuuA' %}

## Visão geral

As abas são um componente comum dos sistemas de design, mas podem assumir muitas formas e formatos. Primeiro, havia abas de desktop construídas no elemento `<frame>` e agora temos componentes móveis que animam o conteúdo com base em propriedades físicas. Todos estão tentando fazer a mesma coisa: economizar espaço.

Hoje, o essencial da experiência do usuário com abas é uma área de navegação de botão que alterna a visibilidade do conteúdo em um frame de exibição. Muitas áreas de conteúdo diferentes compartilham o mesmo espaço, mas são apresentadas condicionalmente com base no botão selecionado na navegação.

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/eAaQ44VAmzVOO9Cy5Wc8.png",     alt="a colagem é bastante caótica devido à grande variedade de estilos que passaram a ser chamados componente pela web",     width="800", height="500"   %}   <figcaption>     Uma colagem de estilos de web design de componentes de aba, dos últimos 10 anos  </figcaption></figure>

## Táticas da Web

Resumindo, achei esse componente muito simples de construir, graças a alguns recursos essenciais da plataforma web:

- `scroll-snap-points` para interações elegantes de deslizamento e teclado com posições de parada de rolagem apropriadas
- [Links profundos](https://en.wikipedia.org/wiki/Deep_linking) por meio de hashes de URL para suporte de ancoragem e compartilhamento de rolagem in-page manipulada por navegador
- Suporte para leitor de tela com marcação de elemento `<a>` e `id="#hash"`
- `prefers-reduced-motion` para permitir transições crossfade e rolagem instantânea na página
- O recurso da web in-draft `@scroll-timeline` para sublinhar dinamicamente e alterar a cor da aba selecionada

### O HTML {: #markup }

Basicamente, a UX aqui consiste em: clique em um link, faça com que a URL represente o estado da página aninhada e, em seguida, veja a atualização da área de conteúdo conforme o navegador rola para o elemento correspondente.

Lá dentro existem alguns membros de conteúdo estrutural: links e `:target`s. Precisamos de uma lista de links, para os quais um `<nav>` é perfeito, e uma lista de elementos `<article>`, para os quais uma `<section>` é excelente. Cada hash de link corresponderá a uma seção, permitindo que o navegador role as coisas por meio da ancoragem.

<figure>   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pr8BrPDjq8ga9NyoHLJk.mp4",     autoplay="true",     loop="true",     muted="true"   %}   <figcaption>     Um botão de link é clicado, fazendo o conteúdo em foco ocupar a viewport   </figcaption></figure>

Por exemplo, clicar em um link direciona automaticamente o artigo destino `:target` no Chrome 89, sem necessidade de usar JS. O usuário pode então rolar o conteúdo do artigo com seu dispositivo de entrada como sempre. É um conteúdo complementar, conforme indicado na marcação.

Usei a marcação abaixo para organizar as abas:

```html
<snap-tabs>
  <header>
    <nav>
      <a></a>
      <a></a>
      <a></a>
      <a></a>
    </nav>
  </header>
  <section>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
  </section>
</snap-tabs>
```

Posso estabelecer conexões entre os elementos `<a>` e `<article>` com as `href` e `id` assim:

```html/3,10
<snap-tabs>
  <header>
    <nav>
      <a href="#responsive"></a>
      <a href="#accessible"></a>
      <a href="#overscroll"></a>
      <a href="#more"></a>
    </nav>
  </header>
  <section>
    <article id="responsive"></article>
    <article id="accessible"></article>
    <article id="overscroll"></article>
    <article id="more"></article>
  </section>
</snap-tabs>
```

Em seguida, preenchi os artigos com quantidades variadas de lorem e os links com um comprimento variado um conjunto de títulos de imagem. Com conteúdo para trabalhar, podemos começar o layout.

### Layouts de rolagem {: #overscroll}

Existem 3 tipos diferentes de áreas de rolagem neste componente:

- A navegação <b style="color: #FF00E2;">(rosa)</b> é rolável horizontalmente
- A área de conteúdo <b style="color: #008CFF;">(azul)</b> é rolável horizontalmente
- Cada item de artigo <b style="color: #2FD800;">(verde)</b> pode ser rolado verticalmente.

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qVmUKMwbeoCBffP0aY55.png",     alt="3 caixas coloridas com setas direcionais, correspondentes a cores, que contornam as áreas de rolagem e mostram a direção em que irão rolar.",     width="800", height="450"   %}</figure>

Existem 2 diferentes tipos de elementos envolvidos na rolagem:

1. **Uma janela**<br> Uma caixa com dimensões definidas que possui a propriedade de estilo `overflow`.
2. **Uma superfície superdimensionada**<br> Neste layout, são os containers da lista: links nav, artigos (article) de seção (section) e conteúdo do artigo.

#### Layout `<snap-tabs>` {: #tabs-layout }

O layout de nível superior que escolhi foi flex (Flexbox). Eu defino a direction como `column`, de forma que o cabeçalho e a seção são ordenados verticalmente. Esta é a nossa primeira janela de rolagem, e ela esconde tudo com overflow hidden. O cabeçalho (header) e a seção (section) usarão overscroll em breve, como zonas individuais.

{% Compare 'better', 'HTML' %}

```html
<snap-tabs>
  <header></header>
  <section></section>
</snap-tabs>
```

{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
snap-tabs {
  display: flex;
  flex-direction: column;

  /* establish primary containing box */
  overflow: hidden;
  position: relative;

  & > section {
    /* be pushy about consuming all space */
    block-size: 100%;
  }

  & > header {
    /* defend against <section> needing 100% */
    flex-shrink: 0;
    /* fixes cross browser quarks */
    min-block-size: fit-content;
  }
}
```

{% endCompare %}

Apontando de volta ao diagrama colorido de 3 rolagens:

- O `<header>` agora está preparado para ser o container de rolagem <b style="color: #FF00E2;">(rosa).</b>
- O `<section>` está preparado para ser o container de rolagem <b style="color: #008CFF;">(azul).</b>

Os frames que destaquei abaixo com [VisBug](https://a.nerdy.dev/gimme-visbug) nos ajudam a ver as **janelas** que foram criadas pelos containers de rolagem.

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Fyl0rTuETjORBigkIBx5.png",     alt="os elementos header e section têm sobreposições de hotpink, delineando o espaço que ocupam no componente",     width="800", height="620"   %}</figure>

#### Layout de cabeçalho de abas `<header>` {: #tabs-header}

O próximo layout é quase o mesmo: eu uso flex para criar ordenação vertical.

<div class="switcher"> {% Compare 'better', 'HTML' %} ```html/1-4 &lt;snap-tabs&gt;   &lt;header&gt;     &lt;nav&gt;&lt;/nav&gt;     &lt;span class="snap-indicator"&gt;&lt;/span&gt;   &lt;/header&gt;   &lt;section&gt;&lt;/section&gt; &lt;/snap-tabs&gt; ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'CSS' %}</p>
<pre data-md-type="block_code" data-md-language="css/1-2"><code class="language-css/1-2">header {
  display: flex;
  flex-direction: column;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

O `.snap-indicator` deve viajar horizontalmente junto com o grupo de links, e esse layout de cabeçalho ajuda a definir esse estágio. Nenhum elemento é posicionado de forma absoluta aqui!

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/EGNIrpw4gEzIZEcsAt5R.png",     alt="os elementos nav e span.indicator têm overlays hotpink, contornando o espaço que ocupam no componente",     width="800", height="368"   %}</figure>

Em seguida, os estilos de rolagem. Acontece que podemos compartilhar os estilos de rolagem entre nossas 2 áreas de rolagem horizontal (header e section), então eu criei uma classe utilitária `.scroll-snap-x`.

```css
.scroll-snap-x {
  /* browser decide if x is ok to scroll and show bars on, y hidden */
  overflow: auto hidden;
  /* prevent scroll chaining on x scroll */
  overscroll-behavior-x: contain;
  /* scrolling should snap children on x */
  scroll-snap-type: x mandatory;

  @media (hover: none) {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
```

Cada um precisa de overflow no eixo x, contenção de rolagem para travar o overscroll, barras de rolagem ocultas para dispositivos de toque e, por último, scroll-snap para bloquear áreas de apresentação de conteúdo. Nossa ordem de tabulação do teclado é acessível e qualquer aba de interação foca naturalmente. Os containers de snap de rolagem também recebem uma bela interação, no estilo carrossel, de seu teclado.

#### Layout de cabeçalho de abas `<nav>` {: #tabs-header-nav }

Os links nav precisam ser dispostos em uma linha, sem quebras de linha, centralizados verticalmente, e cada item de link deve se encaixar no container scroll-snap. É um trabalho rápido usando o CSS de 2021!

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<nav>
  <a></a>
  <a></a>
  <a></a>
  <a></a>
</nav>
```
{% endCompare %}

Cada link define seu tamanho e estilo, portanto, o layout nav só precisa especificar direção e fluxo. Larguras exclusivas em itens nav deixam a transição entre as abas divertida, já que o indicador ajusta sua largura para o novo destino. Dependendo de quantos elementos estiverem lá, o navegador irá renderizar uma barra de rolagem ou não.

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/P7Vm3EvhO1wrTK1boU6y.png",     alt="os elementos a do nav têm overlays de hotpink, destacando o espaço que ocupam no componente, bem como onde eles transbordam",     width="800", height="327"   %}</figure>

#### Layout de seção de abas `<section>` {: #tabs-section }

Esta seção é um item flexível e precisa ser o consumidor dominante de espaço. Ele também precisa criar colunas para os artigos serem posicionados. Mais uma vez, um trabalho rápido para CSS de 2021! O `block-size: 100%` estica este elemento para preencher o pai tanto quanto for possível, então para seu próprio layout, ele cria uma série de colunas que são `100%` da largura do pai. As porcentagens funcionam muito bem aqui porque definimos fortes restrições para o pai.

<div class="switcher"> {% Compare 'better', 'HTML' %} ```html/1-4 &lt;section&gt;   &lt;article&gt;&lt;/article&gt;   &lt;article&gt;&lt;/article&gt;   &lt;article&gt;&lt;/article&gt;   &lt;article&gt;&lt;/article&gt; &lt;/section&gt; ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'CSS' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">section {
  block-size: 100%;

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

É como se estivéssemos dizendo "expanda verticalmente o máximo possível, de forma agressiva" (lembre-se do cabeçalho que definimos para `flex-shrink: 0` : é uma defesa contra esse impulso de expansão), que define a altura da linha para um conjunto de colunas de altura total. O estilo `auto-flow` diz à grade para sempre posicionar os filhos numa linha horizontal, sem quebra automática, exatamente o que queremos; para transbordar a janela pai.

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/FYroCMocutCGg1X8kfdG.png",     alt="os elementos article têm overlays hotpink neles, delineando o espaço que ocupam no componente e onde transbordam",     width="800", height="512"   %}</figure>

Eu acho isso difícil de entender às vezes! Este elemento de seção cabe em uma caixa, mas também criou um conjunto de caixas. Espero que os recursos visuais e as explicações estejam ajudando.

#### Layout de abas `<article>` {: #tabs-article }

O usuário deve ser capaz de rolar o conteúdo do artigo, e as barras de rolagem só devem aparecer se houver overflow. Esses elementos do artigo estão numa posição organizada. Eles são simultaneamente um pai de rolagem e um filho de rolagem. O navegador está lidando aqui com algumas interações bem complicadas de toque, mouse e teclado.

<div class="switcher"> {% Compare 'better', 'HTML' %} ```html &lt;article&gt;   &lt;h2&gt;&lt;/h2&gt;   &lt;p&gt;&lt;/p&gt;   &lt;p&gt;&lt;/p&gt;   &lt;h2&gt;&lt;/h2&gt;   &lt;p&gt;&lt;/p&gt;   &lt;p&gt;&lt;/p&gt;   ... &lt;/article&gt; ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'CSS' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">article {
  scroll-snap-align: start;

  overflow-y: auto;
  overscroll-behavior-y: contain;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

Eu escolhi fazer com que os artigos se encaixassem no rolador pai. Eu realmente gosto de como os itens do link de navegação e os elementos do artigo se encaixam no início inline de seus respectivos containers de rolagem. Parece um relacionamento harmonioso.

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/O8gJp7AxBty8yND4fFGr.png",     alt="o elemento article e seus elementos filho têm overlays hotpink neles, delineando o espaço que ocupam no componente e a direção em que transbordam",     width="800", height="808"   %}</figure>

O artigo é um filho da grade e seu tamanho é predeterminado para ser a área da janela de visualização para a qual desejamos fornecer a UX de rolagem. Isto significa que não preciso ter estilos de altura ou largura aqui, só preciso definir como ele transborda. Eu defino overflow-y como auto e, em seguida, também intercepto as interações de rolagem com a propriedade overscroll-behaviour.

#### Recapitulação de 3 áreas de rolagem {: #scroll-areas-recap}

Abaixo, escolhi nas configurações do meu sistema como "sempre mostrar as barras de rolagem". Acho que é duplamente importante para o layout funcionar com essa configuração ativada, assim como é para mim revisar o layout e a orquestração da rolagem.

<figure>  {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/6I6TI9PI4rvrJ9lr8T99.png",     alt="as 3 barras de rolagem estão configuradas para aparecer, agora consumindo espaço de layout, e nosso componente ainda parece ótimo",     width="500", height="607"   %}</figure>

Acho que ver a medianiz da barra de rolagem neste componente ajuda a mostrar claramente onde estão as áreas de rolagem, a direção que suportam e como elas interagem umas com as outras. Considere como cada uma desses frames de janela de rolagem também são pais flex ou de grid para um layout.

O DevTools pode nos ajudar a visualizar isso:

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/GFJwc3IggHY4G5fBMiu9.png",     alt="as áreas de rolamento têm overlays de ferramentas grid e flexbox overlays, delineando o espaço que ocupam no componente e a direção em que transbordam",     width="800", height="455"   %}   <figcaption>     Chromium Devtools, mostrando o elemento nav flexbox cheio de elementos âncora, o layout da grade criado pelo elemento section cheio de elementos article e os elementos article cheios de parágrafos e um elemento de cabeçalho.   </figcaption></figure>

Os layouts de rolagem são completos, com snapping, links profundos e acessibilidade por teclado. Uma base sólida para aprimoramentos de UX, estilo e prazer.

#### Destaque de recursos

Elementos-filho ajustados com snap de rolagem mantêm sua posição travada durante o redimensionamento. Isto significa que o JavaScript não precisará trazer nada para a viewport ao girar o dispositivo ou redimensionar o navegador. Experimente o [Device Mode](https://developer.chrome.com/docs/devtools/device-mode/) no Chromium DevTools selecionando qualquer modo diferente de **Responsive** e redimensione o frame do dispositivo. Observe que o elemento permanece visível e bloqueado com seu conteúdo. Isto está disponível desde que o Chromium atualizou sua implementação para corresponder às especificações. Aqui está uma [postagem no blog](/snap-after-layout/) sobre isto.

### Animação {: #animation}

O objetivo do trabalho de animação aqui é vincular claramente as interações com o feedback da IU. Isto ajuda a orientar ou auxiliar o usuário em sua (esperada) descoberta perfeita de todo o conteúdo. Estarei adicionando movimento com propósito e de forma condicional. Os usuários agora podem especificar [suas preferências de movimento](/prefers-reduced-motion/) em seus sistemas operacionais, e eu irei ter o prazer de responder às suas preferências em minhas interfaces.

Estarei vinculando um sublinhado de aba com a posição de rolagem do artigo. Snapping não é apenas bom alinhamento, mas também serve para ancorar o início e o fim de uma animação. Isto mantém o `<nav>`, que atua como um [minimapa](https://en.wikipedia.org/wiki/Mini-map), conectado ao conteúdo. Verificaremos a preferência de movimento do usuário em CSS e JS.

<figure>   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/D4zfhetqvhqlcPdTRtLZ.mp4",     autoplay="true",     loop="true",     muted="true"   %}</figure>

#### Comportamento de rolagem {: #scroll-behavior }

Há uma oportunidade de aprimorar o comportamento de movimento de ambos `:target` e `element.scrollIntoView()`. Por default, é instantâneo. O navegador apenas define a posição da rolagem. Bem, e se quisermos fazer a transição para essa posição de rolagem?

```css
@media (prefers-reduced-motion: no-preference) {
  .scroll-snap-x {
    scroll-behavior: smooth;
  }
}
```

<figure>   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Q4JDplhM9gEd4PoiXqs6.mp4",     autoplay="true",     loop="true",     muted="true"   %}</figure>

Como estamos introduzindo movimento aqui, e movimento que o usuário não controla (como a rolagem), só aplicamos esse estilo se o usuário não tiver preferência em seu sistema operacional em relação a movimento reduzido. Dessa forma, apresentamos o movimento de rolagem apenas para as pessoas que concordarem com ele.

#### Indicador de abas {: #tabs-indicator}

O objetivo desta animação é ajudar a associar o indicador ao estado do conteúdo. Decidi fazer um crossfade colorido em estilos `border-bottom` para usuários que preferem movimento reduzido e um deslizamento vinculado à rolagem + animação de desbotamento de cor para usuários que gostam de movimento.

No Chromium Devtools, posso alternar a preferência e demonstrar os 2 estilos de transição diferentes. Eu me diverti muito construindo isso.

<figure>   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/NVoLHgjGjf7fZw5HFpF6.mp4",     autoplay="true",     loop="true",     muted="true"   %}</figure>

```css
@media (prefers-reduced-motion: reduce) {
  snap-tabs > header a {
    border-block-end: var(--indicator-size) solid hsl(var(--accent) / 0%);
    transition: color .7s ease, border-color .5s ease;

    &:is(:target,:active,[active]) {
      color: var(--text-active-color);
      border-block-end-color: hsl(var(--accent));
    }
  }

  snap-tabs .snap-indicator {
    visibility: hidden;
  }
}
```

Eu escondo o `.snap-indicator` quando o usuário prefere movimento reduzido, já que não preciso mais dele. Então eu o substituo por estilos `border-block-end` e uma `transition`. Observe também na interação das abas que o nav ativo não tem apenas um destaque de sublinhado da marca, mas a cor do texto também é mais escura. O elemento ativo tem um contraste de cor de texto mais alto e um realce de sublinhado brilhante.

Apenas algumas linhas extras de CSS farão alguém se sentir visto (no sentido de que estamos respeitando cuidadosamente suas preferências de movimento). Eu adoro.

#### `@scroll-timeline` {: #scroll-timeline }

Na seção acima, mostrei como lido com os estilos de crossfade de movimento reduzido e, nesta seção, mostrarei como vinculei o indicador e uma área de rolagem. Este é um material experimental divertido que mostrarei a seguir. Espero que você esteja tão animado quanto eu.

```js
const { matches:motionOK } = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
);
```

Primeiro verifico a preferência de movimento do usuário no JavaScript. Se o resultado for `false`, o que significa que o usuário prefere movimento reduzido, não executaremos nenhum dos efeitos de movimento do link de rolagem.

```js
if (motionOK) {
  // motion based animation code
}
```

No momento em que este artigo foi escrito, o [suporte de navegadores para `@scroll-timeline`](https://caniuse.com/css-scroll-timeline) era zero. É uma [especificação draft](https://drafts.csswg.org/scroll-animations-1/) apenas com implementações experimentais, mas tem um polyfill que uso nesta demonstração.

##### ` ScrollTimeline`

Embora CSS e JavaScript possam criar timelines de rolagem, optei pelo JavaScript para poder usar medições de elementos ao vivo durante a animação.

```js
const sectionScrollTimeline = new ScrollTimeline({
  scrollSource: tabsection,  // snap-tabs > section
  orientation: 'inline',     // scroll in the direction letters flow
  fill: 'both',              // bi-directional linking
});
```

Quero que uma coisa siga a posição de rolagem de outra e, ao criar um `ScrollTimeline`, eu defino o condutor do link de rolagem, que é o `scrollSource`. Normalmente, uma animação na web é executada num intervalo de tempo global, mas com uma `sectionScrollTimeline` personalizada na memória. Eu posso mudar tudo isso.

```js
tabindicator.animate({
    transform: ...,
    width: ...,
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

Antes de entrar nos keyframes da animação, acho importante destacar que o seguidor da rolagem, o `tabindicator`, será animado com base numa timeline personalizada, a rolagem da nossa seção. Isto completa a ligação, mas está faltando o ingrediente final: pontos com estado fixo para criar a animação entre eles, também conhecidos como keyframes.

#### Keyframes dinâmicos

Existe uma maneira CSS declarativa e pura bem poderosa para animar com `@scroll-timeline`, mas a animação que escolhi era dinâmica demais. Não há como fazer a transição entre `auto` width e não há como criar dinamicamente uma série de keyframes com base no comprimento dos elementos-filho.

Mas JavaScript sabe como obter essas informações, portanto vamos iterar sobre os elementos filho nós mesmos e obter os valores calculados em tempo de execução:

```js
tabindicator.animate({
    transform: [...tabnavitems].map(({offsetLeft}) =>
      `translateX(${offsetLeft}px)`),
    width: [...tabnavitems].map(({offsetWidth}) =>
      `${offsetWidth}px`)
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

Para cada `tabnavitem`, desestruture a posição `offsetLeft` e retorne uma string que a utilize como um valor `translateX`. Isto cria 4 keyframes transform para a animação. O mesmo é feito para width. É perguntado a cada um qual sua largura dinâmica e então o valor recebido é usado como o valor do keyframe.

Aqui está um exemplo de saída, com base nas minhas fontes e preferências do navegador:

Keyframes translateX:

```js
[...tabnavitems].map(({offsetLeft}) =>
  `translateX(${offsetLeft}px)`)

// results in 4 array items, which represent 4 keyframe states
// ["translateX(0px)", "translateX(121px)", "translateX(238px)", "translateX(464px)"]
```

Keyframes de width:

```js
[...tabnavitems].map(({offsetWidth}) =>
  `${offsetWidth}px`)

// results in 4 array items, which represent 4 keyframe states
// ["121px", "117px", "226px", "67px"]
```

Para resumir a estratégia, o indicador da aba agora será animado em 4 keyframes, dependendo da posição do snap de rolagem do scroller da seção. Os pontos de ajuste criam um delineamento definido entre nossos keyframes e aumentam a sensação de sincronização da animação.

<figure>   {% Img     src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jV5X2JMkgUQSIpcivvTJ.png",     alt="aba ativa e aba inativa são mostradas com sobreposições VisBug que exibem as pontuações de contraste para ambos que passam na auditoria",     width="540", height="400"   %}</figure>

O usuário conduz a animação com sua interação, vendo a largura e a posição do indicador mudar de uma seção para a seguinte, acompanhando perfeitamente com a rolagem.

Você pode não ter notado, mas estou muito orgulhoso da transição de cores quando o item de navegação destacado é selecionado.

<figure>   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/qoxGO8SR2t6GPuCWhwvu.mp4",     autoplay="true",     loop="true",     muted="true"   %}</figure>

O cinza mais claro não selecionado aparece ainda mais empurrado para trás quando o item destacado tem mais contraste. É comum fazer a transição de cor para o texto, como ao passar o mouse e quando selecionado, mas o próximo nível faz a transição dessa cor na rolagem, sincronizada com o indicador de sublinhado.

Veja como eu fiz:

```js
tabnavitems.forEach(navitem => {
  navitem.animate({
      color: [...tabnavitems].map(item =>
        item === navitem
          ? `var(--text-active-color)`
          : `var(--text-color)`)
    }, {
      duration: 1000,
      fill: 'both',
      timeline: sectionScrollTimeline,
    }
  );
});
```

Cada link nav de aba precisa dessa nova animação colorida, rastreando a mesma timeline de rolagem que o indicador sublinhado. Eu uso a mesma timeline de antes: já que sua função é emitir um tique na rolagem, podemos usar esse tique em qualquer tipo de animação que quisermos. Como fiz antes, crio 4 keyframes no loop e retorno cores.

```js
[...tabnavitems].map(item =>
  item === navitem
    ? `var(--text-active-color)`
    : `var(--text-color)`)

// results in 4 array items, which represent 4 keyframe states
// [
  "var(--text-active-color)",
  "var(--text-color)",
  "var(--text-color)",
  "var(--text-color)",
]
```

O keyframe com a cor `var(--text-active-color)` destaca o link e, caso contrário, é uma cor de texto padrão. O loop aninhado ali o torna relativamente simples, pois o loop externo é cada item de nav e o loop interno são os keyframes pessoais de cada item nav. Eu verifico se o elemento de loop externo é o mesmo que o de loop interno e uso essa informação para saber quando ele está selecionado.

Eu me diverti muito escrevendo isso. Muito.

### Ainda mais melhorias de JavaScript {: #js}

Vale lembrar que a essência do que estou mostrando aqui funciona sem JavaScript. Dito isso, vamos ver como podemos melhorá-lo quando JS estiver disponível.

#### Links profundos

Links profundos (deep links) são mais um termo relacionado a dispositivos móveis, mas acho que a intenção do link profundo é encontrada aqui com as abas no sentido de que você pode compartilhar uma URL diretamente no conteúdo de uma aba. O navegador navegará internamente na página até o ID que corresponde ao hash da URL. Descobri que este handler de `onload` que obtém esse efeito em qualquer plataforma.

```js
window.onload = () => {
  if (location.hash) {
    tabsection.scrollLeft = document
      .querySelector(location.hash)
      .offsetLeft;
  }
}
```

#### Sincronização do final da rolagem

Nossos usuários nem sempre estão clicando ou usando um teclado, às vezes eles estão apenas rolando livremente, como deveriam ser capazes de fazer. Quando o scroller de seção para de rolar, o local onde ele para precisa ser correspondido na barra de navegação superior.

<figure>   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/syltOES9Gxc0ihOsgTIV.mp4",     autoplay="true",     loop="true",     muted="true"   %}</figure>

É assim que espero o final da rolagem:

```js
tabsection.addEventListener('scroll', () => {
  clearTimeout(tabsection.scrollEndTimer);
  tabsection.scrollEndTimer = setTimeout(determineActiveTabSection, 100);
});
```

Sempre que seções estiverem sendo roladas, limpe o timeout da seção, se houver um, e inicie um novo. Quando as seções param de ser roladas, não limpe o timeout e dispare 100 ms após depois de parar. Ao disparar, chame a função que busca descobrir onde o usuário parou.

```js
const determineActiveTabSection = () => {
  const i = tabsection.scrollLeft / tabsection.clientWidth;
  const matchingNavItem = tabnavitems[i];

  matchingNavItem && setActiveTab(matchingNavItem);
};
```

Assumindo que a rolagem parou em posição ajustada (snapped), dividir a posição atual da rolagem pela largura da área de rolagem deve resultar num número inteiro e não em uma fração. Então, tento pegar um item nav do nosso cache através desse índice calculado e, se encontrar algo, envio a aba correspondente para que seja marcada como ativa.

```js
const setActiveTab = tabbtn => {
  tabnav
    .querySelector(':scope a[active]')
    .removeAttribute('active');

  tabbtn.setAttribute('active', '');
  tabbtn.scrollIntoView();
};
```

A definição da aba ativa começa ao limpar qualquer aba que esteja atualmente ativa e, em seguida, dando ao novo item nav atributo de estado "active". A chamada para `scrollIntoView()` tem uma interação divertida com CSS que vale a pena observar.

<figure>   {% Video     src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/nsiyMgZ2QGF2fx9gVRgu.mp4",     autoplay="true",     loop="true",     muted="true"   %}</figure>

```css
.scroll-snap-x {
  overflow: auto hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
}
```

No CSS do utilitário de snap de rolagem horizontal, nós [aninhamos](https://drafts.csswg.org/css-nesting-1/) uma consulta de mídia (media query) que aplica rolagem suave (`smooth`) se o usuário for tolerante a movimentos. O JavaScript pode fazer chamadas livremente para rolar os elementos para dentro da janela de visualização e o CSS pode gerenciar a UX de forma declarativa.

### Conclusão

Agora que você sabe como eu fiz, como você faria?! Isto deixa a arquitetura de componentes bem divertida! Quem vai fazer a 1ª versão com slots no seu framework favorito? 🙂

Vamos diversificar nossas abordagens e aprender todas as maneiras de desenvolver na Web. Crie um [Glitch](https://glitch.com) e [envie um tweet](https://twitter.com/argyleink) com sua versão para que ela seja adicionada à seção de [Remixes da comunidade](#community-remixes) abaixo.

## Remixes da comunidade

- [@devnook](https://twitter.com/devnook), [@rob_dodson](https://twitter.com/rob_dodson) e [@DasSurma](https://twitter.com/DasSurma) com componentes Web: [artigo](https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs).
- [@jhvanderschee](https://twitter.com/jhvanderschee) com botões: [Codepen](https://codepen.io/joosts/pen/PoKdZYP).
