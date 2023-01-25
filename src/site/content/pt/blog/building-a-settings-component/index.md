---
layout: post
title: Como criar um componente de Configurações
subhead: Uma visão geral básica de como construir um componente de configurações de controles deslizantes e caixas de seleção.
authors:
  - adamargyle
description: Uma visão geral básica de como criar um componente de configurações de controles deslizantes e caixas de seleção.
date: 2021-03-17
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/SUaxDTgOYvv2JXxaErBP.png
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zkv1FlI6dn82rJ104yBV.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

Nesta postagem, quero compartilhar o pensamento sobre a construção de um componente de configurações para a web que seja responsivo, ofereça suporte a várias entradas de dispositivo e funcione em vários navegadores. Experimente a [demonstração](https://gui-challenges.web.app/settings/dist/).

<figure data-size="full">{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/WuIwd9jPb30KmmnjJn75.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> <a href="https://gui-challenges.web.app/settings/dist/">Demonstração</a> </figcaption></figure>

Se você preferir vídeo ou quiser uma prévia da IU/UX do que estamos criaindo, aqui está um passo a passo mais curto no YouTube:

{% YouTube 'dm7gnp6eh3Q' %}

## Visão geral

Eu dividi os aspectos desse componente nas seguintes seções:

1. [Layouts](#layouts)
2. [Cor](#color)
3. [Entrada de faixa personalizada](#custom-range)
4. [Entrada de caixa de seleção personalizada](#custom-checkbox)
5. [Considerações de acessibilidade](#accessibility)
6. [JavaScript](#javascript)

{% Aside 'gotchas' %} Os snippets CSS abaixo pressupõem PostCSS com [PostCSS Preset Env](https://preset-env.cssdb.org/features). A intenção é praticar desde o início e frequentemente com sintaxe nos primeiros rascunhos ou disponível experimentalmente em navegadores. Ou como o plugin gosta de dizer, "Use CSS de amanhã hoje". {% endAside %}

## Layouts

Esta é a primeira demonstração do Desafio de GUI **totalmente CSS Grid** ! Aqui está cada grade destacada com o [Chrome DevTools para grade](https://goo.gle/devtools-grid):

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/h6LZhScslprBcFol4gGp.png", alt="Contornos coloridos e sobreposições de espaçamento de lacunas que ajudam a mostrar todas as caixas que compõem o layout de configurações", width="800", height="563" %}

{% Aside %} Para destacar seus layouts de grade:

1. Abra o Chrome DevTools com `cmd+opt+i` ou `ctrl+alt+i`.
2. Selecione a guia Layout ao lado da guia Estilos.
3. Na seção Layouts de grade, verifique todos os layouts.
4. Altere as cores de todos os layouts. {% endAside %}

### Apenas para lacuna

O layout mais comum:

```css
foo {
  display: grid;
  gap: var(--something);
}
```

Eu chamo esse layout de "apenas para lacunas" porque ele só usa grade para adicionar lacunas entre os blocos.

Cinco layouts usam essa estratégia, aqui estão todos eles exibidos:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zYWSVLzdtrh1K8p8yUuA.png", alt="Layouts de grade vertical destacados com contornos e preenchidos em lacunas", width="800", height="568" %}

O `fieldset`, que contém cada grupo de entrada (`.fieldset-item`), está usando `gap: 1px` para criar as bordas finas entre os elementos. Nenhuma solução de borda complicada!

<div class="switcher">
{% Compare 'better', 'Filled gap' %}

```css
.grid {
  display: grid;
  gap: 1px;
  background: var(--bg-surface-1);

  & > .fieldset-item {
    background: var(--bg-surface-2);
  }
}
```

{% endCompare %}

{% Compare 'worse', 'Border trick' %}

```css
.grid {
  display: grid;

  & > .fieldset-item {
    background: var(--bg-surface-2);

    &:not(:last-child) {
      border-bottom: 1px solid var(--bg-surface-1);
    }
  }
}
```
{% endCompare %}
</div>

### Envolvimento de grade natural

O layout mais complexo acabou sendo o layout de macro, o sistema lógico de layout entre `<main>` e `<form>`.

#### Centrando o conteúdo da embalagem

Flexbox e grade fornecem habilidades para `align-items` ou `align-content` e, ao lidar com elementos de empacotamento, os `content` distribuirão o espaço entre as crianças como um grupo.

```css
main {
  display: grid;
  gap: var(--space-xl);
  place-content: center;
}
```

O elemento principal é usar `place-content: center` [alinhamento atalho](https://developer.mozilla.org/docs/Web/CSS/place-content) para que os filhos sejam centralizados verticalmente e horizontalmente em layouts de uma e duas colunas.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IQI2PofA6gpNFUkDrvKo.mp4", autoplay="true", loop="true", muted="true" %}

Assista no vídeo acima como o "conteúdo" permanece centralizado, mesmo que o empacotamento tenha ocorrido.

#### Repetir ajuste automático mín. Máx

O `<form>` usa um layout de grade adaptável para cada seção. Este layout muda de uma para duas colunas com base no espaço disponível.

```css
form {
  display: grid;
  gap: var(--space-xl) var(--space-xxl);
  grid-template-columns: repeat(auto-fit, minmax(min(10ch, 100%), 35ch));
  align-items: flex-start;
  max-width: 89vw;
}
```

Esta grade tem um valor diferente para `row-gap` (--space-xl) do que `column-gap` de coluna (--space-xxl) para colocar aquele toque personalizado no layout responsivo. Quando as colunas se empilham, queremos uma grande lacuna, mas não tão grande como se estivéssemos em uma tela ampla.

A propriedade `grid-template-columns` usa 3 funções CSS: `repeat()`, `minmax()` e `min()`. [Una Kravets](#) tem um [ótimo post de layout](/one-line-layouts/) sobre isso, chamando-o de [RAM](/one-line-layouts/#07-ram-repeat,-auto,-minmax-grid-template-columnsauto-fit,-minmaxlessbasegreater,-1fr).

Existem 3 adições especiais em nosso layout, se você compará-lo com o de Una:

- Passamos uma função `min()`
- Especificamos `align-items: flex-start`.
- Há uma `max-width: 89vw` estilo 89vw.

A função extra `min()` é bem descrita por Evan Minto em seu blog na postagem [Grade CSS com resposta intrínseca com minmax () e min ()](https://evanminto.com/blog/intrinsically-responsive-css-grid-minmax-min/). Eu recomendo dar uma olhada nisso. A `flex-start` é para remover o efeito de alongamento padrão, de forma que os filhos deste layout não precisem ter alturas iguais, eles podem ter alturas naturais intrínsecas. O vídeo do YouTube apresenta uma análise rápida dessa adição de alinhamento.

`max-width: 89vw` vale uma pequena análise neste post. Deixe-me mostrar o layout com e sem o estilo aplicado:

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/gdldf7hyaBrHWwxQbSaT.mp4", autoplay="true", loop="true", muted="true" %}

O que está acontecendo? Quando `max-width` é especificado, está fornecendo contexto, dimensionamento explícito ou [dimensionamento definitivo](https://drafts.csswg.org/css-sizing-3/#definite) para o [algoritmo de layout `auto-fit`](https://drafts.csswg.org/css-grid/#auto-repeat) para saber quantas repetições ele pode caber no espaço. Embora pareça óbvio que o espaço é "largura total", de acordo com as especificações da grade CSS, um tamanho definido ou tamanho máximo deve ser fornecido. Eu forneci um tamanho máximo.

Então, por que `89vw`? Porque "funcionou" para o meu layout. Eu e algumas outras pessoas do Chrome estamos investigando por que um valor mais razoável, como `100vw` não é suficiente e se isso é de fato um bug.

### Espaçamento

A maior parte da harmonia desse layout vem de uma paleta limitada de espaçamentos, 7 para ser exato.

```css
:root {
  --space-xxs: .25rem;
  --space-xs:  .5rem;
  --space-sm:  1rem;
  --space-md:  1.5rem;
  --space-lg:  2rem;
  --space-xl:  3rem;
  --space-xxl: 6rem;
}
```

O uso desses fluxos realmente bem com grade, [CSS @nest](https://drafts.csswg.org/css-nesting-1/) e [sintaxe de nível 5 de @media](https://drafts.csswg.org/mediaqueries-5/) . Aqui está um exemplo, o conjunto de estilos de layout `<main>`

```css
main {
  display: grid;
  gap: var(--space-xl);
  place-content: center;
  padding: var(--space-sm);

  @media (width >= 540px) {
    & {
      padding: var(--space-lg);
    }
  }

  @media (width >= 800px) {
    & {
      padding: var(--space-xl);
    }
  }
}
```

Uma grade com conteúdo centralizado, moderadamente preenchido por padrão (como no celular). Porém, à medida que mais espaço na janela de visualização se torna disponível, ele se espalha aumentando o preenchimento. 2021 CSS está muito bom!

Lembra-se do layout anterior, "apenas para lacuna"? Esta é uma versão mais completa de como eles se parecem neste componente:

```css
header {
  display: grid;
  gap: var(--space-xxs);
}

section {
  display: grid;
  gap: var(--space-md);
}
```

## Cor

O uso controlado de cores ajudou este design a se destacar como expressivo, mas mínimo. Eu faço assim:

```css
:root {
  --surface1: lch(10 0 0);
  --surface2: lch(15 0 0);
  --surface3: lch(20 0 0);
  --surface4: lch(25 0 0);

  --text1: lch(95 0 0);
  --text2: lch(75 0 0);
}
```

{% Aside 'key-term' %} O [plugin PostCSS `lab()` e `lch()`](https://github.com/csstools/postcss-lab-function) faz parte do [PostCSS Preset Env](https://preset-env.cssdb.org/features#lch-function) e produzirá cores `rgb()` {% endAside %}

Eu nomeio minhas cores de superfície e de texto com números em vez de nomes como `surface-dark` e `surface-darker` porque em uma consulta de mídia, estarei invertendo-as, e claro e escuro não serão significativos.

Eu os lanço em uma consulta de mídia preferencial como esta:

```css
:root {
  ...

  @media (prefers-color-scheme: light) {
    & {
      --surface1: lch(90 0 0);
      --surface2: lch(100 0 0);
      --surface3: lch(98 0 0);
      --surface4: lch(85 0 0);

      --text1: lch(20 0 0);
      --text2: lch(40 0 0);
    }
  }
}
```

{% Aside 'key-term' %} [O plug `@nest`](https://github.com/csstools/postcss-nesting) faz parte do [PostCSS Preset Env](https://preset-env.cssdb.org/features) e irá expandir os seletores para uma sintaxe compatível com os navegadores atualmente. {% endAside %}

É importante ter uma visão rápida do quadro geral e da estratégia antes de mergulhar nos detalhes da sintaxe de cores. Mas, como me adiantei um pouco, deixe-me recuar um pouco.

### LCH?

Sem se aprofundar muito na teoria da cor, o LCH é uma sintaxe orientada para o ser humano, que define como percebemos a cor, não como medimos a cor com matemática (como 255). Isso dá a ele uma vantagem distinta, pois os humanos podem escrever mais facilmente e outros humanos estarão em sintonia com esses ajustes.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/160dWLSrMhFISwWMVd4w.png", alt="Uma captura de tela da página da web pod.link/csspodcast, com cor 2: episódio de percepção aumentado", width="800", height="329" %} <figcaption> Saiba mais sobre cores perceptuais (e muito mais!) No <a href="https://pod.link/thecsspodcast">Podcast CSS</a> </figcaption></figure>

Por hoje, nesta demonstração, vamos nos concentrar na sintaxe e nos valores que estou mudando para tornar claro e escuro. Vejamos 1 superfície e 1 cor de texto:

```css
:root {
  --surface1: lch(10 0 0);
  --text1:    lch(95 0 0);

  @media (prefers-color-scheme: light) {
    & {
      --surface1: lch(90 0 0);
      --text1:    lch(40 0 0);
    }
  }
}
```

`--surface1: lch(10 0 0)` traduz em `10%` luminosidade, 0 croma e 0 matiz: um cinza incolor muito escuro. Então, na consulta de mídia para o modo de luz, a luminosidade é invertida para `90%` com `--surface1: lch(90 0 0);`. E essa é a essência da estratégia. Comece mudando apenas a leveza entre os 2 temas, mantendo as taxas de contraste que o design exige ou o que pode manter a acessibilidade.

O bônus com `lch()` aqui é que a leveza é orientada para o ser humano, e podemos nos sentir bem com uma `%` mudança nela, que será perceptiva e consistentemente essa `%` diferente. `hsl()` por exemplo [não é tão confiável](https://twitter.com/argyleink/status/1201908189257555968) .

Há [mais para aprender](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/) sobre espaços de cores e `lch()` se você estiver interessado. Está chegando!

{% Blockquote 'Lea Verou' %} CSS no momento **não pode acessar essas cores**. Vou repetir: **não temos acesso a um terço das cores na maioria dos monitores modernos.** E não são quaisquer cores, mas as **cores mais vivas que a tela pode exibir**. Nossos sites foram destruídos porque o hardware do monitor evoluiu mais rápido do que as especificações CSS e as implementações de navegador. {% endBlockquote %}

### Controles de forma adaptáveis com esquema de cores

Muitos navegadores fornecem controles de tema escuro, atualmente Safari e Chromium, mas você deve especificar em CSS ou HTML que seu design os utiliza.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/0VVtEAWM6jHeIxahqnFy.mp4", autoplay="true", loop="true", muted="true" %}

O exemplo acima está demonstrando o efeito da propriedade do painel Estilos do DevTools. A demonstração usa a tag HTML, que, em minha opinião, geralmente é um local melhor:

```html
<meta name="color-scheme" content="dark light">
```

Saiba tudo sobre isso neste [artigo sobre `color-scheme`](/color-scheme/) [Thomas Steiner](/authors/thomassteiner/). Há muito mais a ganhar do que entradas de caixa de seleção escura!

### `accent-color` CSS

Tem havido [atividade recente em](https://twitter.com/argyleink/status/1360022120810483715?s=20) torno `accent-color` em elementos de formulário, sendo um único estilo CSS que pode alterar a cor da tonalidade usada no elemento de entrada do navegador. Leia mais sobre isso [aqui no GitHub](https://github.com/w3c/csswg-drafts/issues/5187). Eu o incluí em meus estilos para este componente. Como os navegadores o suportam, minhas caixas de seleção estarão mais focadas no tema com os pop-ups de cor rosa e roxo.

```css
input[type="checkbox"] {
  accent-color: var(--brand);
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/J9pbhB0ImoDzbsXkBGtG.png", alt="Uma captura de tela do Chromium no Linux de caixas de seleção rosa", width="800", height="406" %}

### A cor se destaca com gradientes fixos e foco interno

As cores aparecem mais quando usadas com moderação, e uma das maneiras que gosto de conseguir isso é por meio de interações coloridas da interface do usuário.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pm75QwVToKkiqedqPtmm.mp4", autoplay="true", loop="true", muted="true", width="480px" %}

Existem muitas camadas de feedback e interação da IU no vídeo acima, que ajudam a dar personalidade à interação ao:

- Destacando o contexto.
- Fornecer feedback da IU sobre "quão cheio" o valor está no intervalo.
- Fornecer feedback da IU de que um campo está aceitando entrada.

Para fornecer feedback quando um elemento está sendo interagido, CSS está usando a [`:focus-within`](https://developer.mozilla.org/docs/Web/CSS/:focus-within) para alterar a aparência de vários elementos, vamos detalhar `.fieldset-item`, é muito interessante:

```css
.fieldset-item {
  ...

  &:focus-within {
    background: var(--surface2);

    & svg {
      fill: white;
    }

    & picture {
      clip-path: circle(50%);
      background: var(--brand-bg-gradient) fixed;
    }
  }
}
```

Quando um dos filhos deste elemento tem foco em:

1. O `.fieldset-item` é atribuído a uma cor de superfície de maior contraste.
2. O `svg` aninhado é preenchido com branco para maior contraste.
3. `clip-path` `<picture>` aninhado se expande para um círculo completo e o fundo é preenchido com o gradiente fixo brilhante.

## Intervalo personalizado

Dado o seguinte elemento de entrada HTML, mostrarei como personalize sua aparência:

```html
<input type="range">
```

Existem 3 partes neste elemento que precisamos personalizar:

1. [Elemento / recipiente de intervalo](#range-element-styles)
2. [Acompanhar](#track-styles)
3. [Polegar](#thumb-styles)

### Estilos de elemento de intervalo

```css
input[type="range"] {
  /* style setting variables */
  --track-height: .5ex;
  --track-fill: 0%;
  --thumb-size: 3ex;
  --thumb-offset: -1.25ex;
  --thumb-highlight-size: 0px;

  appearance: none;         /* clear styles, make way for mine */
  display: block;
  inline-size: 100%;        /* fill container */
  margin: 1ex 0;            /* ensure thumb isn't colliding with sibling content */
  background: transparent;  /* bg is in the track */
  outline-offset: 5px;      /* focus styles have space */
}
```

As primeiras linhas do CSS são as partes personalizadas dos estilos e espero que rotulá-las claramente ajude. O restante dos estilos são, em sua maioria, estilos de redefinição, para fornecer uma base consistente para a construção das partes complicadas do componente.

### Estilos de trilha

```css
input[type="range"]::-webkit-slider-runnable-track {
  appearance: none; /* clear styles, make way for mine */
  block-size: var(--track-height);
  border-radius: 5ex;
  background:
    /* hard stop gradient:
        - half transparent (where colorful fill we be)
        - half dark track fill
        - 1st background image is on top
    */
    linear-gradient(
      to right,
      transparent var(--track-fill),
      var(--surface1) 0%
    ),
    /* colorful fill effect, behind track surface fill */
    var(--brand-bg-gradient) fixed;
}
```

O truque para isso é "revelar" a cor de preenchimento vibrante. Isso é feito com o gradiente de parada rígida no topo. O gradiente é transparente até a porcentagem de preenchimento e, depois disso, usa a cor da superfície da trilha não preenchida. Por trás dessa superfície não preenchida, está uma cor de largura total, esperando pela transparência para revelá-la.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/aiAL28AkDRZvaAZNEbW8.mp4", autoplay="true", loop="true", muted="true" %}

#### Estilo de preenchimento de trilha

Meu design **requer JavaScript** para manter o estilo de preenchimento. Existem apenas estratégias de CSS, mas elas exigem que o elemento thumb tenha a mesma altura da trilha, e não consegui encontrar uma harmonia dentro desses limites.

```js
/* grab sliders on page */
const sliders = document.querySelectorAll('input[type="range"]')

/* take a slider element, return a percentage string for use in CSS */
const rangeToPercent = slider => {
  const max = slider.getAttribute('max') || 10;
  const percent = slider.value / max * 100;

  return `${parseInt(percent)}%`;
};

/* on page load, set the fill amount */
sliders.forEach(slider => {
  slider.style.setProperty('--track-fill', rangeToPercent(slider));

  /* when a slider changes, update the fill prop */
  slider.addEventListener('input', e => {
    e.target.style.setProperty('--track-fill', rangeToPercent(e.target));
  })
})
```

Eu acho que isso é uma boa atualização visual. O controle deslizante funciona muito bem sem JavaScript, o `--track-fill` prop não é necessário, ele simplesmente não terá um estilo de preenchimento se não estiver presente. Se o JavaScript estiver disponível, preencha a propriedade customizada enquanto também observa as alterações do usuário, sincronizando a propriedade customizada com o valor.

[Aqui está um ótimo post](https://css-tricks.com/sliding-nightmare-understanding-range-input/) sobre [CSS-Tricks](https://css-tricks.com/) por [Ana Tudor](https://twitter.com/anatudor), que demonstra uma solução única de CSS para preenchimento de faixas. Também achei este [elemento `range`](https://app.native-elements.dev/editor/elements/range) muito inspirador.

### Estilos de polegar

```css
input[type="range"]::-webkit-slider-thumb {
  appearance: none; /* clear styles, make way for mine */
  cursor: ew-resize; /* cursor style to support drag direction */
  border: 3px solid var(--surface3);
  block-size: var(--thumb-size);
  inline-size: var(--thumb-size);
  margin-top: var(--thumb-offset);
  border-radius: 50%;
  background: var(--brand-bg-gradient) fixed;
}
```

A maioria desses estilos são para fazer um bom círculo. Novamente, você vê o gradiente de fundo fixo que unifica as cores dinâmicas dos polegares, trilhas e elementos SVG associados. Separei os estilos para a interação para ajudar a isolar a `box-shadow` que está sendo usada para o destaque flutuante:

```css
@custom-media --motionOK (prefers-reduced-motion: no-preference);

::-webkit-slider-thumb {
  …

  /* shadow spread is initally 0 */
  box-shadow: 0 0 0 var(--thumb-highlight-size) var(--thumb-highlight-color);

  /* if motion is OK, transition the box-shadow change */
  @media (--motionOK) {
    & {
      transition: box-shadow .1s ease;
    }
  }

  /* on hover/active state of parent, increase size prop */
  @nest input[type="range"]:is(:hover,:active) & {
    --thumb-highlight-size: 10px;
  }
}
```

{% Aside 'key-term' %} [@ custom-media](https://drafts.csswg.org/mediaqueries-5/#custom-mq) é uma adição de especificação de nível 5 que [PostCSS Custom Media](https://github.com/postcss/postcss-custom-media), parte do [PostCSS Preset Env](https://preset-env.cssdb.org/features). {% endAside %}

O objetivo era um destaque visual animado e fácil de gerenciar para o feedback do usuário. Ao usar uma sombra de caixa, posso evitar o [disparo de layout](/animations-guide/#triggers) com o efeito. Eu faço isso criando uma sombra que não é desfocada e corresponde à forma circular do elemento polegar. Então eu mudo e transito seu tamanho de propagação ao pairar.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/s835RbH88L5bxjl5bMFl.mp4", autoplay="true", loop="true", muted="true" %}

Se ao menos o efeito de realce fosse tão fácil nas caixas de seleção…

### Seletores de vários navegadores

Descobri que precisava desses `-webkit-` e `-moz-` para obter consistência entre navegadores:

```css
input[type="range"] {
  &::-webkit-slider-runnable-track {}
  &::-moz-range-track {}
  &::-webkit-slider-thumb {}
  &::-moz-range-thumb {}
}
```

{% Aside 'gotchas' %} [Josh Comeau](https://twitter.com/JoshWComeau) descreve por que os exemplos acima não usam simplesmente uma vírgula entre os seletores para o estilo do navegador cruzado, consulte o [tópico](https://twitter.com/JoshWComeau/status/1359213591602335752?s=20) do Twitter para obter mais informações. {% endAside %}

## Caixa de seleção personalizada

Dado o seguinte elemento de entrada HTML, mostrarei como personalize sua aparência:

```html
<input type="checkbox">
```

Existem 3 partes neste elemento que precisamos personalizar:

1. [Elemento de caixa de seleção](#checkbox-element)
2. [Rótulos associados](#checkbox-labels)
3. [Efeito de destaque](#checkbox-highlight)

### Elemento de caixa de seleção

```css
input[type="checkbox"] {
  inline-size: var(--space-sm);   /* increase width */
  block-size: var(--space-sm);    /* increase height */
  outline-offset: 5px;            /* focus style enhancement */
  accent-color: var(--brand);     /* tint the input */
  position: relative;             /* prepare for an absolute pseudo element */
  transform-style: preserve-3d;   /* create a 3d z-space stacking context */
  margin: 0;
  cursor: pointer;
}
```

O `transform-style` e os `position` preparam para o pseudo-elemento que apresentaremos mais tarde para estilizar o destaque. Caso contrário, é principalmente algo de estilo opinativo menor de mim. Gosto que o cursor seja um ponteiro, gosto de deslocamentos de contorno, as caixas de seleção padrão são muito pequenas e, se houver [suporte](https://drafts.csswg.org/css-ui-4/#widget-accent) `accent-color` destaque, traga essas caixas de seleção para o esquema de cores da marca.

### Rótulos de caixa de seleção

É importante fornecer rótulos para as caixas de seleção por dois motivos. A primeira é representar para que o valor da caixa de seleção é usado, para responder "ligado ou desligado para quê?" O segundo é para UX, os usuários da web se acostumaram a interagir com as caixas de seleção por meio de seus rótulos associados.

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/7GYIFNjNCBdj13juFO7S.mp4", autoplay="true", loop="true", muted="true" %}

<div class="switcher">{% Compare 'better', 'input' %}</div>
<pre data-md-type="block_code" data-md-language="html"><code class="language-html">&lt;input
  type="checkbox"
  id="text-notifications"
  name="text-notifications"
&gt;
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better', 'label' %}</p>
<pre data-md-type="block_code" data-md-language="html"><code class="language-html">&lt;label for="text-notifications"&gt;
  &lt;h3&gt;Text Messages&lt;/h3&gt;
  &lt;small&gt;Get notified about all text messages sent to your device&lt;/small&gt;
&lt;/label&gt;
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

Em seu rótulo, coloque um `for` que aponta para uma caixa de seleção por ID: `<label for="text-notifications">`. Em sua caixa de seleção, dobre o nome e a id para garantir que sejam encontrados com várias ferramentas e tecnologias, como um mouse ou leitor de tela: `<input type="checkbox" id="text-notifications" name="text-notifications">`. `:hover` `:active` e mais vêm de graça com a conexão, aumentando as formas de interação com o seu formulário.

### Destaque da caixa de seleção

Eu quero manter minhas interfaces consistentes, e o elemento deslizante tem um bom destaque em miniatura que eu gostaria de usar com a caixa de seleção. A miniatura foi capaz de usar `box-shadow` e sua `spread` para escalar uma sombra para cima e para baixo. No entanto, esse efeito não funciona aqui porque nossas caixas de seleção são, [e deveriam ser](https://twitter.com/argyleink/status/1329230409784291328?s=20), quadradas.

Consegui obter o mesmo efeito visual com um pseudoelemento e uma quantidade infeliz de CSS complicado:

```css
@custom-media --motionOK (prefers-reduced-motion: no-preference);

input[type="checkbox"]::before {
  --thumb-scale: .01;                        /* initial scale of highlight */
  --thumb-highlight-size: var(--space-xl);

  content: "";
  inline-size: var(--thumb-highlight-size);
  block-size: var(--thumb-highlight-size);
  clip-path: circle(50%);                     /* circle shape */
  position: absolute;                         /* this is why position relative on parent */
  top: 50%;                                   /* pop and plop technique (https://web.dev/centering-in-css/#5-pop-and-plop) */
  left: 50%;
  background: var(--thumb-highlight-color);
  transform-origin: center center;            /* goal is a centered scaling circle */
  transform:                                  /* order here matters!! */
    translateX(-50%)                          /* counter balances left: 50% */
    translateY(-50%)                          /* counter balances top: 50% */
    translateZ(-1px)                          /* PUTS IT BEHIND THE CHECKBOX */
    scale(var(--thumb-scale))                 /* value we toggle for animation */
  ;
  will-change: transform;

  @media (--motionOK) {                       /* transition only if motion is OK */
    & {
      transition: transform .2s ease;
    }
  }
}

/* on hover, set scale custom property to "in" state */
input[type="checkbox"]:hover::before {
  --thumb-scale: 1;
}
```

Criar um círculo psuedo-elemento é um trabalho simples, mas **colocá-lo atrás do elemento ao qual está anexado** foi mais difícil. Aqui está o antes e depois de eu consertar:

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Spdpw5P1MD8ceazneRXo.mp4", autoplay="true", loop="true", muted="true" %}

É definitivamente uma micro interação, mas importante para mim manter a consistência visual. A técnica de dimensionamento da animação é a mesma que temos usado em outros lugares. Definimos uma propriedade personalizada com um novo valor e permitimos a transição do CSS com base nas preferências de movimento. O principal recurso aqui é `translateZ(-1px)`. O pai criou um espaço 3D e este filho de pseudoelemento aproveitou-se dele colocando-se ligeiramente para trás no espaço z.

## Acessibilidade

O vídeo do YouTube é uma ótima demonstração das interações do mouse, teclado e leitor de tela para este componente de configurações. Vou citar alguns dos detalhes aqui.

### Opções de elemento HTML

```html
<form>
<header>
<fieldset>
<picture>
<label>
<input>
```

Cada um deles contém dicas e sugestões para a ferramenta de navegação do usuário. Alguns elementos fornecem dicas de interação, alguns conectam a interatividade e alguns ajudam a moldar a árvore de acessibilidade em que um leitor de tela navega.

### Atributos HTML

Podemos ocultar elementos que não são necessários aos leitores de tela, neste caso o ícone ao lado do controle deslizante:

```html
<picture aria-hidden="true">
```

{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/fVjqHRZHQixAaxjeAvDP.mp4", autoplay="true", loop="true", muted="true", width="480px" %}

O vídeo acima demonstra o fluxo do leitor de tela no Mac OS. Observe como o foco de entrada se move direto de um controle deslizante para o próximo. Isso ocorre porque ocultamos o ícone que pode ter sido uma parada no caminho para o próximo controle deslizante. Sem este atributo, um usuário precisaria parar, ouvir e mover-se além da imagem que ele pode não ser capaz de ver.

{% Aside 'gotchas' %} Lembre-se de fazer o teste cruzado das interações do leitor de tela do navegador. A demonstração original incluía `<label>` na lista de elementos com `aria-hidden="true"`, mas foi removido depois que uma [conversa no Twitter](https://twitter.com/rob_dodson/status/1371859386210029568) revelou diferenças entre navegadores. {% endAside %}

O SVG é um monte de matemática, vamos adicionar um `<title>` para um título de mouse flutuante livre e um comentário legível por humanos sobre o que a matemática está criando:

```html
<svg viewBox="0 0 24 24">
  <title>A note icon</title>
  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
</svg>
```

Além disso, usamos HTML claramente marcado o suficiente para que o formulário seja testado muito bem em mouse, teclado, controladores de videogame e leitores de tela.

## JavaScript

Já [cobri](#track-styles) como a cor de preenchimento da trilha estava sendo gerenciada a partir de JavaScript, então vamos dar uma olhada no JavaScript relacionado `<form>`

```js
const form = document.querySelector('form');

form.addEventListener('input', event => {
  const formData = Object.fromEntries(new FormData(form));
  console.table(formData);
})
```

Sempre que o formulário é interagido e alterado, o console registra o formulário como um objeto em uma tabela para fácil revisão antes de enviá-lo a um servidor.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/hFAyIOpOSdiczdf4AtIj.png", alt="Uma captura de tela dos resultados de console.table (), onde os dados do formulário são mostrados em uma tabela", width="800", height="285" %}

## Conclusão

Agora que você sabe como eu fiz, como você faria?! Isso torna a arquitetura de componentes divertida! Quem vai fazer a 1ª versão com slots em seu framework favorito? 🙂

Vamos diversificar nossas abordagens e aprender todas as maneiras de criar na Web. Crie uma demonstração, [envie um tuíte para mim](https://twitter.com/argyleink) e eu irei adicioná-la à seção de [remixes da comunidade](#community-remixes) abaixo!

## Remixes da comunidade

- [@tomayac](https://twitter.com/tomayac) com seu estilo em relação à área de foco para os rótulos das caixas de seleção! Esta versão não tem lacuna entre os elementos: [demonstração](https://tomayac.github.io/gui-challenges/settings/dist/) e [código-fonte](https://github.com/tomayac/gui-challenges).
