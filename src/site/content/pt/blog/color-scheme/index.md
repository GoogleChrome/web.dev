---
title: Estilo padrão de modo escuro aprimorado com a propriedade CSS `color-scheme` e a metatag correspondente
subhead: |2

  A propriedade CSS `color-scheme` e a metatag correspondente

  permitem que os desenvolvedores optem por suas páginas nos padrões específicos do tema da folha de estilo do agente do usuário.
authors:
  - thomassteiner
date: 2020-08-04
updated: 2021-10-19
hero: image/admin/rOe3wxcy28m5DCKcHv7E.jpg
alt: Pombos na parede com um nítido contraste de preto e branco no fundo.
description: |-
  A propriedade color-scheme do CSS e a metatag correspondente permitem que os desenvolvedores optem por suas páginas nos padrões específicos do tema da folha de estilo do agente do usuário,
  como, por exemplo, controles de formulário, barras de rolagem, bem como sistema de cores do CSS.
  Ao mesmo tempo, esse recurso impede que os navegadores apliquem quaisquer transformações por conta própria.
tags:
  - blog
  - css
feedback:
  - api
---

## Fundamentos

### O recurso de preferência de mídia do usuário com `prefers-color-scheme`

O [`prefers-color-scheme`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) preferenciais oferece aos desenvolvedores controle total sobre a aparência de suas páginas. Se você não estiver familiarizado com ele, leia meu artigo [`prefers-color-scheme` : Olá escuridão, minha velha amiga](/prefers-color-scheme/) , onde documentei tudo o que sei sobre a criação de incríveis experiências no modo escuro.

Uma peça do quebra-cabeça que foi mencionada apenas brevemente no artigo é a `color-scheme` e a metatag correspondente com o mesmo nome. Ambos tornam a sua vida como desenvolvedor mais fácil, permitindo que você opte pela sua página em padrões específicos do tema da folha de estilo do agente do usuário, como, por exemplo, controles de formulário, barras de rolagem, bem como sistema de cores do CSS. Ao mesmo tempo, esse recurso impede que os navegadores apliquem quaisquer transformações por conta própria.

### A folha de estilo do agente do usuário

Antes de continuar, deixe-me descrever brevemente o que é uma folha de estilo do agente do usuário. Na maioria das vezes, você pode pensar na palavra *agente do usuário* (UA) como uma forma sofisticada de dizer *navegador* . A folha de estilo UA determina a aparência padrão de uma página. Como o nome sugere, uma folha de estilo do UA é algo que depende do UA em questão. Você pode dar uma olhada na [folha de estilo UA do Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css) (e do Chromium) e compará-la com a do [Firefox](https://dxr.mozilla.org/mozilla-central/source/layout/style/res/html.css) ou [Safari](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) (e do WebKit). Normalmente, as folhas de estilo UA concordam com a maioria das coisas. Por exemplo, todos eles tornam os links em azul, o texto geral em preto e a cor de fundo em branco, mas também existem diferenças importantes (e às vezes irritantes), por exemplo, como eles estilizam os controles de formulário.

Dê uma olhada mais de perto na [folha de estilo UA do WebKit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) e o que ela faz em relação ao modo escuro. (Faça uma pesquisa de texto completo por "escuro" na folha de estilo.) O padrão fornecido pela folha de estilo muda com base no modo escuro estar ativado ou desativado. Para ilustrar isso, aqui está uma regra CSS usando a pseudo classe [`:matches`](https://css-tricks.com/almanac/selectors/m/matches/) e as variáveis internas do WebKit como `-apple-system-control-background` , bem como a diretiva do pré-processador interno do WebKit `#if defined`:

```css
input,
input:matches([type="password"], [type="search"]) {
  -webkit-appearance: textfield;
  #if defined(HAVE_OS_DARK_MODE_SUPPORT) &&
      HAVE_OS_DARK_MODE_SUPPORT
    color: text;
    background-color: -apple-system-control-background;
  #else
    background-color: white;
  #endif
  /* corte */
}
```

Você notará alguns valores fora do padrão para as propriedades `color` e `background-color` acima. Nem `text` nem `-apple-system-control-background` são cores CSS válidas. São cores *semânticas* internas do WebKit.

Acontece que o CSS padronizou as cores do sistema semântico. Eles são especificados no [módulo de cores CSS nível 4](https://drafts.csswg.org/css-color/#css-system-colors) . Por exemplo, [`Canvas`](https://drafts.csswg.org/css-color/#valdef-system-color-canvas) (não deve ser confundido com a tag `<canvas>` ) é para o fundo do conteúdo do aplicativo ou documentos, enquanto [`CanvasText`](https://drafts.csswg.org/css-color/#valdef-system-color-canvastext) é para texto no conteúdo do aplicativo ou documentos. Os dois andam juntos e não devem ser usados isoladamente.

As folhas de estilo do UA podem usar suas próprias cores proprietárias ou as cores do sistema semântico padronizado para determinar como os elementos HTML devem ser renderizados por padrão. Se o sistema operacional estiver definido para o modo escuro ou usar um tema escuro, `CanvasText` (ou `text` ) seria condicionalmente definido como branco e `Canvas` (ou `-apple-system-control-background` ) seria definido como preto. A folha de estilo UA atribui o seguinte CSS apenas uma vez e cobre os modos claro e escuro.

```css
/**
  Não é o código da folha de estilo UA real.
  Apenas para fins ilustrativos.
*/
body {
  color: CanvasText;
  background-color: Canvas
}
```

## A propriedade `color-scheme` do CSS

A especificação [CSS Módulo do Ajuste de Cores Nível 1](https://drafts.csswg.org/css-color-adjust/) apresenta um modelo e controla o ajuste automático de cores pelo agente do usuário com o objetivo de lidar com as preferências do usuário, como modo escuro, ajuste de contraste ou esquemas específicos de cores desejados.

A [`color-scheme`](https://drafts.csswg.org/css-color-adjust/#color-scheme-prop) definida nele permite que um elemento indique com quais esquemas de cores ele se sente confortável para ser renderizado. Esses valores são negociados com as preferências do usuário, resultando em um esquema de cores escolhido que afeta coisas da interface do usuário (IU), como as cores padrão dos controles de formulário e barras de rolagem, bem como os valores usados das cores do sistema CSS. Os seguintes valores são atualmente suportados:

- *`normal`* Indica que o elemento não tem conhecimento dos esquemas de cores e, portanto, o elemento deve ser renderizado com o esquema de cores padrão do navegador.

- *`[ light | dark ]+`* Indica que o elemento está ciente e pode lidar com os esquemas de cores listados e expressa uma preferência ordenada entre eles.

{% Aside 'note' %} O fornecimento de ambas as palavras-chave indica que o primeiro esquema é o preferido (pelo autor), mas o segundo também é aceitável se o usuário preferir. {% endAside %}

Nesta lista, `light` representa um esquema de cores claras, com cores de fundo claras e cores de primeiro plano escuras, enquanto que `dark` representa o oposto, com cores de fundo escuras e cores de primeiro plano claras.

Para todos os elementos, a renderização com um esquema de cores deve fazer com que as cores usadas em todas as IUs fornecidas pelo navegador para o elemento correspondam à intenção do esquema de cores. Os exemplos são barras de rolagem, sublinhados de verificação ortográfica, controles de formulário, etc.

{% Aside 'note' %} A `color-scheme` pode ser usada no nível `:root` , bem como em um nível individual por elemento. {% endAside %}

No `:root` , a renderização com um esquema de cores deve afetar adicionalmente a cor da superfície da tela (ou seja, a cor de fundo global), o valor inicial da propriedade `color` e os valores usados das cores do sistema, e também deve afetar as barras de rolagem da janela de visualização.

```css
/*
  A página suporta tanto esquemas de cores claras como escuras,
  e o autor da página prefere o escuro.
*/
:root {
  color-scheme: dark light;
}
```

## A metatag `color-scheme`

Honrar a `color-scheme` requer que o CSS seja primeiro baixado (se for referenciado por meio de `<link rel="stylesheet">` ) e analisado. Para ajudar os agentes do usuário a renderizar o plano de fundo da página com o esquema de cores desejado *imediatamente*, um valor para `color-scheme` também pode ser fornecido em um elemento [`<meta name="color-scheme">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme) .

```html
<!--
  A página suporta tanto esquemas de cores claras como escuras,
  e o autor da página prefere o escuro.
-->
<meta name="color-scheme" content="dark light">
```

## Combinando `color-scheme` e `prefers-color-scheme`

Como a metatag e a propriedade CSS (se aplicada ao `:root` ) eventualmente resultam no mesmo comportamento, sempre recomendo especificar o esquema de cores por meio da metatag, para que o navegador possa adotar o esquema preferido mais rapidamente.

Embora para páginas de linha de base absolutas nenhuma regra CSS adicional seja necessária, no caso geral você deve sempre combinar o `color-scheme` com `prefers-color-scheme`. Por exemplo, o WebKit CSS color `-webkit-link` proprietário, usado pelo WebKit e Chrome para o link clássico azul `rgb(0,0,238)`, tem uma relação de contraste insuficiente de 2,23:1 em um fundo preto e [falha](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000) tanto no WCAG AA quanto bem como os [requisitos](https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels) WCAG AAA.

Eu abri bugs para [Chrome](https://crbug.com/1066811) , [WebKit](https://bugs.webkit.org/show_bug.cgi?id=209851) e [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1626560) , bem como um [meta issue no padrão HTML](https://github.com/whatwg/html/issues/5426) para consertar isso.

## Interação com `prefers-color-scheme`

A interação da `color-scheme` e da metatag correspondente com o recurso de preferência de mídia do usuário `prefers-color-scheme` pode parecer confuso a primeira vista. Na verdade, eles jogam muito bem juntos. A coisa mais importante a entender é que o `color-scheme` determina exclusivamente a aparência padrão, ao passo que o `prefers-color-scheme` determina a aparência estilizável. Para tornar isso mais claro, assuma a seguinte página:

```html
<head>
  <meta name="color-scheme" content="dark light">
  <style>
    fieldset {
      background-color: gainsboro;
    }
    @media (prefers-color-scheme: dark) {
      fieldset {
        background-color: darkslategray;
      }
    }
  </style>
</head>
<body>
  <p>
    Lorem ipsum dolor sit amet, legere ancillae ne vis.
  </p>
  <form>
    <fieldset>
      <legend>Lorem ipsum</legend>
      <button type="button">Lorem ipsum</button>
    </fieldset>
  </form>
</body>
```

O código CSS embutido na página define o elemento `<fieldset>` de `background-color` para `gainsboro` no caso geral, e `darkslategray` se o usuário prefere um esquema de cores `dark` de acordo com as `prefers-color-scheme` preferências de mídia do usuário.

Por meio do elemento `<meta name="color-scheme" content="dark light">` , a página informa ao navegador que oferece suporte para um tema escuro e um claro, com preferência por um tema escuro.

Dependendo se o sistema operacional está definido para o modo escuro ou claro, a página inteira aparece claro no escuro, ou vice-versa, com base na folha de estilo do agente do usuário. Não *há* CSS adicional fornecido pelo desenvolvedor envolvido para alterar o texto do parágrafo ou a cor de fundo da página.

Observe como a `background-color` de fundo do elemento `<fieldset>` muda com base na habilitação do modo escuro, seguindo as regras da folha de estilo embutida fornecida pelo desenvolvedor na página. Ou é `gainsboro` ou `darkslategray`.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kSgOIiGRqjw2PvRlVCaV.png", alt = "Uma página em modo claro.", width = "800", height = "322" %}<figcaption> <strong>Modo claro:</strong> estilos especificados pelo desenvolvedor e pelo agente do usuário. O texto é preto e o fundo é branco de acordo com a folha de estilo do agente do usuário. A <code>background-color</code> de fundo do elemento <code>&lt;fieldset&gt;</code> é <code>gainsboro</code> de acordo com a folha de estilo do desenvolvedor embutida.</figcaption></figure>

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qqkHz83kerktbDIGCJeG.png", alt = "Uma página no modo escuro.", width = "800", height = "322" %}<figcaption> <strong>Modo escuro:</strong> estilos especificados pelo desenvolvedor e pelo agente do usuário. O texto é branco e o fundo é preto de acordo com a folha de estilo do agente do usuário. A <code>background-color</code> de fundo do elemento <code>&lt;fieldset&gt;</code> é <code>darkslategray</code> de acordo com a folha de estilo do desenvolvedor embutida.</figcaption></figure>

A aparência do elemento `<button>` é controlada pela folha de estilo do agente do usuário. Sua `color` é definida para a cor do sistema [`ButtonText`](https://drafts.csswg.org/css-color/#valdef-system-color-buttontext) `background-color` e as quatro `border-color` são definidas para a cor do sistema [`ButtonFace`](https://drafts.csswg.org/css-color/#valdef-system-color-buttonface).

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lSNFROIe1P94DlhoVtoV.png", alt = "Uma página de modo leve que usa a propriedade ButtonFace.", width = "800", height = "322" %}<figcaption> <strong>Modo de luz:</strong> A <code>background-color</code> e as várias <code>border-color</code> são definidas para a cor do sistema <a href="https://drafts.csswg.org/css-color/#valdef-system-color-buttonface">ButtonFace.</a></figcaption></figure>

Agora observe como a `border-color` do elemento `<button>` muda. O *valor calculado* para as `border-top-color` e `border-bottom-color` muda de `rgba(0, 0, 0, 0.847)` (enegrecido) para `rgba(255, 255, 255, 0.847)` (esbranquiçado), desde que o usuário do agente atualiza o `ButtonFace` dinamicamente com base no esquema de cores. O mesmo se aplica à `color` do elemento `<button>` que é definido para a cor do sistema correspondente `ButtonText` .

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IogmyIzUhokJgnnxUkPi.png", alt = "Mostrando que os valores de cor computados correspondem a ButtonFace.", width = "800", height = "322" %}<figcaption> <strong>Modo claro:</strong> Os valores calculados de <code>border-top-color</code> e <code>border-bottom-color</code> que são definidos como <code>ButtonFace</code> na folha de estilo do agente do usuário agora são <code>rgba(0, 0, 0, 0.847)</code>.</figcaption></figure>

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3sU1uZyt3zNhEgw3gpZJ.png", alt = "Mostrando que os valores de cor computados ainda correspondem a ButtonFace enquanto no modo escuro.", width = "800", height = "322" %}<figcaption> <strong>Modo escuro:</strong> Os valores calculados de <code>border-top-color</code> e <code>border-bottom-color</code> que são definidos como <code>ButtonFace</code> na folha de estilo do agente do usuário agora são <code>rgba(255, 255, 255, 0.847)</code>.</figcaption></figure>

## Demo

Você pode ver os efeitos do `color-scheme` de cores aplicado a um grande número de elementos HTML em uma [demonstração no Glitch](https://color-scheme-demo.glitch.me/) . A demonstração *mostra deliberadamente* [a violação](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000) WCAG AA e WCAG AAA com as cores de link mencionadas no [aviso acima](#using-color-scheme-in-practice) .

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bqXapQKcNbyE3uwEOELO.png", alt = "A demonstração no modo claro.", width = "800", height = "982" %}<figcaption> A <a href="https://color-scheme-demo.glitch.me/">demonstração</a> mudou para <code>color-scheme: light</code>.</figcaption></figure>

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9G4hFdtSSwPLOm57zedD.png", alt = "A demonstração no modo escuro.", width = "800", height = "982" %}<figcaption> A <a href="https://color-scheme-demo.glitch.me/">demonstração</a> mudou para o <code>color-scheme: dark</code>. <a href="https://webaim.org/resources/contrastchecker/?fcolor=0000EE&amp;bcolor=000000">Observe a violação</a> WCAG AA e WCAG AAA com as cores do link.</figcaption></figure>

## Reconhecimentos

A `color-scheme` e a metatag correspondente foram implementadas por [Rune Lillesveen](https://github.com/lilles) . Rune também é um co-editor da especificação CSS Color Adjustment Module Nível 1. Imagem do herói por [Philippe Leone](https://unsplash.com/@philinit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) no [Unsplash](https://unsplash.com/photos/dbFfEBOCrkU) .
