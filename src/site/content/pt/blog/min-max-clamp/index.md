---
title: 'min(), max() e clamp(): três funções CSS lógicas para usar hoje'
subhead: Aprenda como controlar o tamanho do elemento, manter o espaçamento adequado e implementar tipografia fluida usando essas funções CSS com firme suporte.
authors:
  - una
date: 2020-10-14
hero: image/admin/aVL3BEXD3AF9fFzPGKMf.jpg
alt: Conjunto de ferramentas em uma mesa.
description: Min, max e clamp proporcionam alguns recursos CSS poderosos que permitem um estilo mais responsivo com menos linhas de código. Este artigo aborda como controlar o tamanho do elemento, manter o espaçamento adequado e implementar tipografia fluida usando essas funções matemáticas CSS bem suportadas.
tags:
  - blog
  - css
  - layout
feedback:
  - api
---

Com a evolução do design responsivo, com cada vez mais nuances, o próprio CSS está em constante evolução e proporciona maior controle aos autores. As funções [`min()`](https://developer.mozilla.org/docs/Web/CSS/min) , [`max()`](https://developer.mozilla.org/docs/Web/CSS/max) e [`clamp()`](https://developer.mozilla.org/docs/Web/CSS/clamp), agora com suporte em todos os navegadores modernos, estão entre as ferramentas mais recentes para tornar sites e aplicativos de autoria mais dinâmicos e responsivos.

Quando se trata de tipografia flexível e fluida, redimensionamento de elemento controlado e manutenção do espaçamento adequado, `min()` , `max()` e `clamp()` podem ajudar.

## Contexto

<blockquote>
  <p>As funções matemáticas <code>calc()</code> , <code>min()</code> , <code>max()</code> e <code>clamp()</code> permitem que expressões matemáticas com adição (+), subtração (-), multiplicação (*) e divisão (/) sejam usadas como valores de componentes</p>
  <cite><p data-md-type="paragraph"><a href="https://www.w3.org/TR/css-values-4/#calc-notation">Valores e unidades CSS nível 4</a></p></cite>
</blockquote>

O Safari foi o primeiro a [enviar](https://bugs.webkit.org/show_bug.cgi?id=167000) o conjunto completo de funções em abril de 2019, com o Chromium seguindo mais tarde naquele ano na versão 79. Este ano, com o lançamento do Firefox [75](https://bugzilla.mozilla.org/show_bug.cgi?id=1519519), temos agora paridade de navegador para `min()` , `max()` e `clamp()` em todos os navegadores permanentes.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZIgePP41Quh7ubYh54vo.png", alt="", width="800", height="246" %}<figcaption> tabela de apoio <a href="https://caniuse.com/css-math-functions">Caniuse</a>. </figcaption></figure>

## Uso

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-demo.mp4">
  </source></video>
  <figcaption>Demonstração de como a função min() seleciona um valor com base em uma lista de opções e seu superior. <a href="https://codepen.io/una/pen/rNeGNVL">Veja a demonstração no Codepen.</a></figcaption></figure>

Você pode usar `min()` , `max()` e `clamp()` no lado direito de qualquer expressão CSS onde isso fizer sentido. Para `min()` e `max()` , você fornece uma lista de valores de argumentos e o navegador determina qual deles é o menor ou o maior, respectivamente. Por exemplo, no caso de: `min(1rem, 50%, 10vw)`, o navegador calcula qual dessas unidades relativas é a menor e usa esse valor como o valor real.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-demo.mp4">
  </source></video>
  <figcaption>Demonstração de como a função max() seleciona um valor com base em uma lista de opções e seu superior. <a href="https://codepen.io/una/pen/RwaZXqR">Veja a demonstração no Codepen.</a></figcaption></figure>

A função `max()` seleciona o maior valor em uma lista de expressões separadas por vírgulas.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-demo.mp4">
  </source></video>
  <figcaption>Mostrando como a função clamp() seleciona um valor com base em uma lista de opções e seu superior. <a href="https://codepen.io/una/pen/bGpoGdJ">Veja a demonstração no Codepen.</a></figcaption></figure>

Para usar `clamp()` insira três valores: um valor mínimo, um valor ideal (a partir do qual calcular) e um valor máximo.

Qualquer uma dessas funções pode ser usada em qualquer lugar que `<length>` , `<frequency>` , `<angle>` , `<time>` , `<percentage>` , `<number>` ou `<integer>` seja permitido. Você pode usá-los por conta própria (ou seja `font-size: max(0.5vw, 50%, 2rem)` ), em conjunto com `calc()` (ou seja `font-size: max(calc(0.5vw - 1em), 2rem)` ), ou de forma composta (ou seja `font-size: max(min(0.5vw, 1em), 2rem)` ).

{% Aside %} Ao usar um cálculo dentro de uma função `min()` , `max()` ou `clamp()` , você pode remover a chamada para `calc()` . Por exemplo, escrever `font-size: max(calc(0.5vw - 1em), 2rem)` seria o mesmo que `font-size: max(0.5vw - 1em, 2rem)` . {% endAside %}

Para recapitular:

- `min(<value-list>)`: seleciona o menor (mais negativo) valor de uma lista de expressões separadas por vírgulas
- `max(<value-list>)`: seleciona o maior (mais positivo) valor de uma lista de expressões separadas por vírgulas
- `clamp(<min>, <ideal>, <max>)`: fixa um valor entre um limite superior e inferior, com base em um valor ideal definido

Vamos dar uma olhada em alguns exemplos.

## A largura perfeita

De acordo com [The Elements of Typographic Style](http://webtypography.net/2.1.2#:~:text=%E2%80%9CAnything%20from%2045%20to%2075,is%2040%20to%2050%20characters.%E2%80%9D) de Robert Bringhurst, "qualquer coisa entre 45 e 75 caracteres é amplamente considerada como um comprimento de linha satisfatório para uma página de coluna única definida em uma face de texto serifada em um tamanho de texto."

Para garantir que seus blocos de texto não sejam mais estreitos que 45 caracteres ou mais largos que 75 caracteres, use `clamp()` e a unidade `ch` [(avanço de caractere](https://developer.mozilla.org/docs/Web/CSS/length) de largura 0):

```css
p {
  width: clamp(45ch, 50%, 75ch);
}
```

Isso permite que o navegador determine a largura do parágrafo. Ele definirá a largura em 50%, a menos que 50% seja menor que `45ch` , ponto em que `45ch` será selecionado, e vice-versa, se 50% for mais largo que `75ch` . Nesta demonstração, o próprio cartão está sendo preso:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-width.mp4">
  </source></video>
  <figcaption>Usando a função clamp () para limitar uma largura mínima e máxima. <a href="https://codepen.io/una/pen/QWyLxaL">Veja a demonstração no Codepen.</a></figcaption></figure>

Você pode dividir isso apenas com a função `min()` ou `max()` . Se você deseja que o elemento sempre tenha `50%` largura e não exceda `75ch` de largura (ou seja, em telas maiores), escreva: `width: min(75ch, 50%);`. Isso basicamente define um tamanho "máximo" usando a função `min()`

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-width.mp4">
  </source></video>
  <figcaption>Usando a função clamp() para limitar uma largura mínima e máxima.</figcaption></figure>

Da mesma forma, você pode garantir um tamanho mínimo para texto legível usando a função `max()` Esta seria a aparência: `width: max(45ch, 50%);`. Aqui, o navegador seleciona o que for maior, `45ch` ou `50%` , o que significa que o elemento deve ter pelo *menos* `45ch` ou maior.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-width.mp4">
  </source></video>
  <figcaption>Usando a função clamp() para limitar uma largura mínima e máxima.</figcaption></figure>

## Gestão de preenchimento

Usando o mesmo conceito acima, onde a função `min()` pode definir um valor "max" e `max()` define um valor "min", você pode usar `max()` para definir um tamanho de preenchimento mínimo. Este exemplo vem do [CSS Tricks](https://css-tricks.com/using-max-for-an-inner-element-max-width/), onde o leitor Caluã de Lacerda Pataca compartilhou esta ideia: A ideia é permitir que um elemento tenha um preenchimento adicional em telas maiores, mas mantenha um preenchimento mínimo em telas menores, principalmente no preenchimento inline. Para conseguir isso, use `calc()` e subtraia o preenchimento mínimo de ambos os lados: `calc((100vw - var(--contentWidth)) / 2)` , *ou* use max: `max(2rem, 50vw - var(--contentWidth) / 2)`. Juntos, ficam:

```css
footer {
  padding: var(--blockPadding) max(2rem, 50vw - var(--contentWidth) / 2);
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-padding.mp4">
  </source></video>
  <figcaption>Definir um preenchimento mínimo para um componente usando a função max(). <a href="https://codepen.io/chriscoyier/pen/qBZqNKa">Veja a demonstração no Codepen.</a></figcaption></figure>

## Tipografia fluida

Para habilitar a [tipografia fluida](https://www.smashingmagazine.com/2016/05/fluid-typography/), [Mike Riethmeuller](https://twitter.com/mikeriethmuller) popularizou uma técnica que usa a função `calc()` para definir um tamanho mínimo e um tamanho máximo de fonte e permitir o dimensionamento do mínimo ao máximo.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/fliud-type.mp4">
  </source></video>
  <figcaption>Criação de tipografia fluida com clamp(). <a href="https://codepen.io/una/pen/ExyYXaN">Veja a demonstração no Codepen.</a></figcaption></figure>

Com `clamp()` , você pode escrever isso de forma mais clara. Em vez de exigir uma string complexa, o navegador pode fazer o trabalho por você. Defina o tamanho de fonte mínimo aceitável (por exemplo, `1.5rem` para um título, tamanho máximo (ou seja, 3 `3rem` ) e tamanho ideal de `5vw` .

Agora, temos uma tipografia que se dimensiona com a largura da janela de visualização da página até atingir os valores mínimos e máximos de limitação, em uma linha de código muito mais sucinta:

```css
p {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

{% Aside 'warning' %} Limitar o tamanho do texto com `max()` ou `clamp()` pode causar uma falha WCAG em [1.4.4 Redimensionar texto (AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=144#resize-text) , porque um usuário pode não conseguir dimensionar o texto para 200% de seu tamanho original. Certifique-se de [testar os resultados com zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html) . {% endAside %}

## Conclusão

As funções matemáticas CSS, `min()` , `max()` e `clamp()` são muito poderosas, bem suportadas e podem ser exatamente o que você está procurando para ajudá-lo a construir interfaces de usuário responsivas. Para obter mais recursos, verifique:

- [Valores e unidades CSS no MDN](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Values_and_units)
- [Valores CSS e especificações de unidades de nível 4](https://www.w3.org/TR/css-values-4/)
- [Truques CSS no artigo na largura do elemento interno](https://css-tricks.com/using-max-for-an-inner-element-max-width/)
- [min (), max (), clamp () Visão geral de Ahmad Shadeed](https://ishadeed.com/article/css-min-max-clamp/)

Imagem da capa de [@yer_a_wizard](https://unsplash.com/@yer_a_wizard) no Unsplash.
