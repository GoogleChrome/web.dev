---
layout: post
title: CSS `accent-color`
subhead: Traga a cor da sua marca para as entradas de formulário HTML integradas com uma linha de código.
authors:
  - adamargyle
  - jarhar
description: Traga a cor da sua marca para as entradas de formulário HTML integradas com uma linha de código.
date: 2021-08-11
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/WOcuCLCwMr0M2lF17bmm.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/huEpiCoJQ6dAo8rHGsZT.png
tags:
  - blog
  - css
---

Os elementos de formulário HTML de hoje são [difíceis de personalizar](https://codepen.io/GeoffreyCrofte/pen/BiHzp). Parece que é uma escolha entre poucos ou nenhum estilo personalizado, ou redefinir estilos de entrada e construí-los do zero. Construir do zero acaba sendo muito mais trabalhoso do que o previsto. Também pode levar a estilos esquecidos de estados de elemento ( [indeterminado](https://developer.mozilla.org/docs/Web/CSS/:indeterminate), estou olhando para você) e à perda de recursos de acessibilidade integrados. Recriar totalmente o que o navegador oferece pode ser mais trabalhoso do que você está procurando.

```css
accent-color: hotpink;
```

A `accent-color` de [destaque CSS da especificação da interface do usuário CSS](https://www.w3.org/TR/css-ui-4/#widget-accent) está aqui para tingir os elementos com uma linha de CSS, poupando você dos esforços de personalização ao fornecer uma maneira de trazer sua marca para os elementos.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/CfSS3F1XUsfCHIB86xeE.png", alt="Uma captura de tela de tema leve de uma demonstração de cores de destaque em que caixa de seleção, botões de opção, um controle deslizante de intervalo e elemento de progresso são todos na cor rosa choque.", width="800", height="548" %} <figcaption> <a href="https://codepen.io/web-dot-dev/pen/PomBZdy">Demo</a> </figcaption></figure>

O `accent-color` também funciona com o [`color-scheme`](/color-scheme/), permitindo aos autores colorir os elementos claros e escuros. No exemplo a seguir, o usuário tem um tema escuro ativo, a página usa `color-scheme:light dark` e usa a mesma `accent-color:hotpink` para controles rosa choque com tema escuro.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/3gxeeZoSLY34tsMxkyt9.png", alt="Uma captura de tela de tema escuro de uma demo accent-color onde caixa de seleção, botões de seleção, um controle deslizante de intervalo e um elemento de progresso estão na cor rosa choque.", width="800", height="548" %} <figcaption> <a href="https://codepen.io/web-dot-dev/pen/PomBZdy">Demo</a> </figcaption></figure>

### Suporte para navegador

No momento da elaboração deste artigo, o Chromium (a partir da versão 93) e o Firefox (a partir da versão 92) suportavam o recurso `accent-color`.

## Elementos suportados

Atualmente, apenas quatro elementos serão tingidos por meio da propriedade `accent-color`: [caixa de seleção](#checkbox), [botão de seleção](#radio), [intervalo](#range) e [progresso](#progress). Cada um pode ser visualizado aqui [https://accent-color.glitch.me](https://accent-color.glitch.me) em esquemas de cores claras e escuras.

{% Aside "warning" %} Se os seguintes elementos de demonstração forem todos da mesma cor, então seu navegador ainda não oferece suporte para `accent-color`. {% endAside %}

### Caixa de seleção

{% Codepen { user: 'web-dot-dev', id: 'dyWjGqZ' } %}

### Botão de seleção

{% Codepen { user: 'web-dot-dev', id: 'dyWjGqZ' } %}

### Intervalo

{% Codepen { user: 'web-dot-dev', id: 'yLbqeRy'}%}

### Progresso

{% Codepen { user: 'web-dot-dev', id: 'dyWjGqZ' } %}

## Garantindo contraste

Para evitar a existência de elementos inacessíveis, os navegadores com `accent-color` precisam determinar uma [cor de contraste compatível](https://webaim.org/articles/contrast/) a ser usada junto com o destaque personalizado. Abaixo está uma captura de tela que demonstra como o Chrome 94 (esquerda) e o Firefox 92 Noturno (direita) diferem em seus algoritmos:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/DJhB56n10Eh8O29RsRdE.png", alt="Uma captura de tela do Firefox e Chromium lado a lado, renderizando um espectro completo de caixas de seleção em vários tons e sombras.", width="800", height="832" %}

O mais importante a tirar disso é **confiar no navegador**. Forneça a cor da marca e confie que ela tomará decisões inteligentes para você.

{% Aside %} O navegador não mudará sua cor em um tema escuro. {% endAside %}

## Extra: Mais cores

Você pode estar se perguntando como tingir mais do que esses quatro elementos do formulário? Aqui está uma sandbox mínimo que tinge:

- o anel de foco
- destaques da seleção de texto
- [marcadores](/css-marker-pseudo-element/) de lista
- indicadores de seta (apenas Webkit)
- miniatura da barra de rolagem (apenas Firefox)

```css
html {
  --brand: hotpink;
  scrollbar-color: hotpink Canvas;
}

:root { accent-color: var(--brand); }
:focus-visible { outline-color: var(--brand); }
::selection { background-color: var(--brand); }
::marker { color: var(--brand); }

:is(
  ::-webkit-calendar-picker-indicator,
  ::-webkit-clear-button,
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button
) {
  color: var(--brand);
}
```

{% Codepen {user: 'web-dot-dev', id: 'RwVBreJ'}%}

### Futuro potencial

A especificação não limita a aplicação da propriedade `accent-color` aos quatro elementos mostrados neste artigo; mais suporte pode ser adicionado posteriormente. Elementos como a `<option>` selecionada em uma `<select>` podem ser destacados com a `accent-color` destaque.

O que mais você gostaria de colorir na Web? Tuíte marcando [@argyleink](https://twitter.com/argyleink) com seu seletor e ele pode ser adicionado a este artigo!
