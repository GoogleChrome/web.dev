---
title: Modelo de caixa
description: |2-

  Tudo o que é exibido pelo CSS é uma caixa.
  Entender como funciona o CSS Box Model é, portanto, a base principal do CSS.
audio:
  title: 'The CSS Podcast   - 001: The Box Model'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_001_v2.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

Digamos que você tenha este trecho de HTML:

```html
<p>I am a paragraph of text that has a few words in it.</p>
```

Então você escreve este CSS para ele:

```css
p {
  width: 100px;
  height: 50px;
  padding: 20px;
  border: 1px solid;
}
```

O conteúdo sairia do seu elemento e teria 142 pixels de largura, em vez de 100 pixels. Por quê? O modelo de caixa é a base central do CSS, e entender como ele funciona, como é afetado por outros aspectos do CSS e, o mais importante, como você pode controlá-lo ajudará a escrever um CSS mais previsível.

<figure>{% Codepen {user: 'web-dot-dev', id: 'WNRemxN', height: 300}%}</figure>

Uma coisa muito importante para lembrar ao escrever o CSS, ou trabalhar na web como um todo, é que tudo que será exibido pelo CSS é uma caixa. Seja uma caixa que usa `border-radius` para se parecer com um círculo, seja apenas um texto: o mais importante a considerar é que tudo são caixas.

## Conteúdo e dimensionamento

As caixas têm comportamentos diferentes com base em seu valor de `display`, suas dimensões definidas e o conteúdo que elas contêm. Esse conteúdo pode ser ainda mais caixas - geradas por elementos filho - ou conteúdo de texto simples. De qualquer forma, afetará o tamanho da caixa por padrão.

Você pode controlar isso usando o **dimensionamento extrínseco** ou continuar a permitir que o navegador tome decisões por você com base no tamanho do conteúdo, usando o **dimensionamento intrínseco**.

Vamos ver rapidamente a diferença, usando uma demonstração para nos ajudar.

<figure>{% Codepen { user: 'web-dot-dev', id: 'abpoMBL' }%}<figcaption> Observe que, quando a caixa está usando dimensionamento extrínseco, há um limite de quanto conteúdo você pode adicionar antes que ultrapasse os limites da caixa. Isso faz com que a palavra "incrível" cause um estouro.</figcaption></figure>

A demonstração traz as palavras, "CSS é incrível" em uma caixa com dimensões fixas e uma borda grossa. A caixa tem uma largura, portanto é extrinsecamente dimensionada. Ela controla o dimensionamento de seu conteúdo filho. Porém, o problema disso é que a palavra "incrível" é muito grande para a caixa, causando estouro na **borda** da caixa pai (mais sobre isso mais tarde na lição). Uma maneira de evitar esse estouro é permitir que a caixa seja intrinsecamente dimensionada ao remover a largura ou, neste caso, definir `width` para `min-content`. `min-content` diz à caixa que seja tão larga quanto a largura mínima intrínseca de seu conteúdo (a palavra "incrível"). Isso permite que a caixa se encaixe perfeitamente na mensagem "CSS é incrível".

Vejamos algo mais complexo para ver o impacto de diferentes tamanhos no conteúdo real:

<figure>{% Codepen { user: 'web-dot-dev', id: 'wvgwOJV', height: 650 } %}</figure>

Ative e desative o dimensionamento intrínseco para ver como você pode obter mais controle com o dimensionamento extrínseco e permitir que o conteúdo tenha mais controle com o dimensionamento intrínseco. Para ver o efeito dos dimensionamentos intrínseco e extrínseco, adicione algumas frases de conteúdo ao cartão. Quando esse elemento está usando dimensionamento extrínseco, há um limite de quanto conteúdo você pode adicionar antes que ultrapasse os limites do elemento, mas esse não é o caso quando o dimensionamento intrínseco é ativado.

Por padrão, este elemento tem `width` e `height` e `400px` definidos. Essas dimensões fornecem limites estritos para tudo dentro do elemento, o que será respeitado, a menos que o conteúdo seja muito grande para a caixa, caso em que ocorrerá uma sobrecarga visível. Você pode ver isso em ação alterando o conteúdo da legenda, sob a imagem da flor, para algo que exceda a altura da caixa, que são algumas linhas de conteúdo.

{% Aside "key-term" %} Quando o conteúdo é muito grande para a caixa em que se encontra, chamamos isso de estouro. Você pode gerenciar como um elemento lida com o conteúdo de estouro, usando a propriedade `overflow` {% endAside %}

Quando você muda para o tamanho intrínseco, permite que o navegador tome decisões por você, com base no tamanho do conteúdo da caixa. É muito mais difícil haver estouro de dimensionamento intrínseco porque nossa caixa será redimensionada com seu conteúdo, em vez de tentar dimensionar o conteúdo. É importante lembrar que esse é o comportamento padrão e flexível de um navegador. Embora o dimensionamento extrínseco forneça mais controle na superfície, o dimensionamento intrínseco fornece a maior flexibilidade, na maioria das vezes.

## As áreas do modelo de caixa

As caixas são compostas por áreas de modelo de caixa distintas que fazem um trabalho específico.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ECuEOJEGnudhXW5JEFih.svg", alt="Um diagrama que mostra as quatro áreas principais do modelo de caixa: caixa de conteúdo, caixa de preenchimento, caixa de borda e caixa de margem", width="800", height="547" %}<figcaption>As quatro áreas principais do modelo de caixa: caixa de conteúdo, caixa de preenchimento, caixa de borda e caixa de margem.</figcaption></figure>

Você começa com a **caixa de conteúdo**, que é a área em que o conteúdo está localizado. Como você já aprendeu, esse conteúdo pode controlar o tamanho de seu pai, então geralmente é a área de tamanho mais variável.

A **caixa de preenchimento** envolve a caixa de conteúdo e é o espaço criado pela propriedade [`padding`](https://developer.mozilla.org/docs/Web/CSS/padding). Como o preenchimento está dentro da caixa, o plano de fundo da caixa ficará visível no espaço que ela cria. Se nossa caixa tiver regras de estouro definidas, como `overflow: auto` ou `overflow: scroll`, as barras de rolagem também ocuparão esse espaço.

<figure>{% Codepen { user: 'web-dot-dev', id: 'BaReoEV' } %}</figure>

A **caixa de borda** envolve a caixa de preenchimento e seu espaço é ocupado pelo valor de `border`. A caixa de borda são os limites de sua caixa e a **borda da borda** é o limite do que você pode ver visualmente. <a href="https://developer.mozilla.org/docs/Web/CSS/border" data-md-type="link">`border`</a> é usada para enquadrar visualmente um elemento.

A área final, a **caixa de margem**, é o espaço ao redor de sua caixa, definido pela regra `margin` em sua caixa. Propriedades como [`outline`](https://developer.mozilla.org/docs/Web/CSS/outline) e [`box-shadow`](https://developer.mozilla.org/docs/Web/CSS/box-shadow) ocupam esse espaço porque são pintadas na parte superior, de modo que não afetam o tamanho da caixa. Você poderia ter uma `outline-width` de `200px` em nossa caixa e tudo dentro dela, incluindo a caixa de borda, teria exatamente o mesmo tamanho.

<figure>{% Codepen { user: 'web-dot-dev', id: 'XWprGea'} %}</figure>

## Uma analogia útil

O modelo de caixa é complexo de entender, então vamos recapitular o que você aprendeu com uma analogia.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/FBaaJXdnuSkvOx1nB0CB.jpg", alt="Três molduras de foto", width = "800", height ="562" %}</figure>

Neste diagrama, você tem três molduras de fotos, montadas em uma parede, uma ao lado da outra. O diagrama possui rótulos que associam elementos da moldura ao modelo da caixa.

Para decompor essa analogia:

- A caixa de conteúdo é a obra de arte.
- A caixa de preenchimento é o fosco branco, entre a moldura e a arte.
- A caixa de borda é a moldura, fornecendo uma borda literal para a obra de arte.
- A caixa de margem é o espaço entre cada quadro.
- A sombra ocupa o mesmo espaço que a caixa de margem.

## Depurando o modelo de caixa

O navegador DevTools fornece uma visualização dos cálculos do modelo de caixa de uma caixa selecionada, o que pode ajudar a entender como o modelo de caixa funciona e, o mais importante, como está afetando o site em que você está trabalhando.

Vá em frente e tente isso em seu próprio navegador:

1. [Abra o DevTools](https://developer.chrome.com/docs/devtools/open/)
2. [Selecione um elemento](https://developer.chrome.com/docs/devtools/css/reference/#select)
3. Exiba o depurador de modelo de caixa

<figure>{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/sKdHrAfqahgWfDVQEBBT.mp4", controls=true %}</figure>

## Controlando o modelo de caixa

Para entender como controlar o modelo de caixa, primeiro você precisa entender o que acontece no seu navegador.

Cada navegador aplica uma folha de estilo de agente do usuário a documentos HTML. O CSS usado varia entre cada navegador, mas eles fornecem padrões razoáveis para tornar o conteúdo mais fácil de ler. Eles definem como os elementos devem se parecer e se comportar se não houver CSS definido. É nos estilos de agente do usuário que a `display` padrão de uma caixa também é definida. Por exemplo, se estivermos em um fluxo normal, o valor de `display` padrão de um elemento `<div>` `block` , a `<li>` tem um valor de `display` `list-item` e um `<span>` tem um valor de `display` `inline`.

Uma `inline` tem margem de bloco, mas outros elementos não o respeitarão. Use o `inline-block` e esses elementos respeitarão a margem do bloco, enquanto o elemento mantém a maioria dos mesmos comportamentos que tinha como um elemento `inline` Um `block` irá, por padrão, preencher o **espaço embutido** disponível, enquanto os elementos `inline-block` e `inline` serão tão grandes quanto seu conteúdo.

Além de compreender como os estilos de agente do usuário afetam cada caixa, você também precisa entender a `box-sizing`, que informa à nossa caixa como calcular o tamanho da caixa. Por padrão, todos os elementos têm o seguinte estilo de agente do usuário: `box-sizing: content-box;`.

Ter `content-box` como o valor de `box-sizing` significa que, quando você definir dimensões, como `width` e `height`, serão aplicadas à **caixa de conteúdo**. Se você definir a `padding` e a `border`, esses valores serão adicionados ao tamanho da caixa de conteúdo.

{% Assessment 'box-model' %}

A largura real desta caixa será 260px. Como o CSS usa a `box-sizing: content-box` padrão, a largura aplicada é a largura do conteúdo, `padding` e `border` em ambos os lados são adicionados. Portanto, 200px para o conteúdo + 40px de preenchimento + 20px de borda perfaz uma largura visível total de 260px.

Contudo, você *pode* controlar isso, fazendo a seguinte modificação para usar o modelo de caixa alternativo, `border-box`:

```css/1
.my-box {
  box-sizing: border-box;
	width: 200px;
	border: 10px solid;
	padding: 20px;
}
```

Este modelo de caixa alternativa diz ao CSS que aplique a `width` na caixa de borda em vez de na caixa de conteúdo. Isso significa que nossa `border` e `padding` são *forçados*. Como resultado, quando você define `.my-box` para ter `200px` de largura: na verdade, ele é renderizado com `200px` de largura.

Veja como isso funciona na demonstração interativa a seguir. Observe que, quando você ativa ou desativa a `box-sizing`, é exibido - por meio de um fundo azul - qual CSS está sendo aplicado *dentro* da nossa caixa.

<figure>{% Codepen { user: 'web-dot-dev', id: 'oNBvVpM', height: 650 } %}</figure>

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Esta regra CSS seleciona todos os elementos no documento e todos os pseudo elementos `::before` e `::after` `box-sizing: border-box` . Isso significa que cada elemento agora terá esse modelo de caixa alternativo.

Como o modelo de caixa alternativo pode ser mais previsível, os desenvolvedores geralmente adicionam essa regra a redefinições e normalizadores, [como neste caso](https://piccalil.li/blog/a-modern-css-reset).

## Recursos

- [Introdução ao modelo de caixa](https://developer.mozilla.org/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [O que são ferramentas de desenvolvedor de navegador?](https://developer.mozilla.org/docs/Learn/Common_questions/What_are_browser_developer_tools)

### Folhas de estilo de agente do usuário

- [Chromium](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
- [Firefox](https://searchfox.org/mozilla-central/source/layout/style/res/html.css)
- [Webkit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
