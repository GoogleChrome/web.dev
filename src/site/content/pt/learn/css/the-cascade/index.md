---
title: A cascata
description: |2

  Às vezes, duas ou mais regras CSS concorrentes podem se aplicar a um elemento.
  Neste módulo, descubra como o navegador escolhe qual usar e como controlar essa seleção.
audio:
  title: 'O CSS Podcast   - 004: The Cascade'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_004_v1.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
tags:
  - css
---

CSS significa Cascading Stylesheets (Folhas de Estilo em Cascata). A cascata é o algoritmo para resolver conflitos em que várias regras CSS se aplicam a um elemento HTML. É por isso que o texto do botão estilizado com o seguinte CSS será azul.

```css
button {
  color: red;
}

button {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'GRrgMOm', height: 200 } %}</figure>

Compreender o algoritmo em cascata ajuda a entender como o navegador resolve conflitos como este. O algoritmo em cascata é dividido em 4 estágios distintos.

1. **Posição e ordem de aparência** : a ordem em que suas regras CSS aparecem
2. **Especificidade** : um algoritmo que determina qual seletor CSS tem a correspondência mais forte
3. **Origem** : a ordem de quando o CSS aparece e de onde vem, seja um estilo de navegador, CSS de uma extensão do navegador ou seu CSS de autoria
4. **Importância** : algumas regras CSS são mais pesadas do que outras, especialmente com o tipo de regra `!important`

## Posição e ordem de aparecimento

A ordem em que suas regras CSS aparecem e como elas aparecem é levada em consideração pela cascata enquanto ela calcula a resolução de conflitos.

A demonstração logo no início desta lição é o exemplo mais direto de posição. Existem duas regras que possuem seletores de especificidade idêntica, portanto, o último a ser declarado venceu.

Os estilos podem vir de várias fontes em uma página HTML, como uma tag `<link>`, uma tag incorporada `<style>` e CSS embutido conforme definido no atributo `style`

Se você tiver um `<link>` que inclui CSS no topo de sua página HTML, então outro `<link>` que inclui CSS na parte inferior de sua página: o `<link>` inferior terá mais especificidade. A mesma coisa acontece com `<style>` incorporados também. Eles ficam mais específicos à medida que avançam na página.

<figure>{% Codepen { user: 'web-dot-dev', id: 'NWdPaWv' } %}<br><figcaption> O botão tem um fundo azul, conforme definido pelo CSS, que é incluído por um elemento <code>&lt;link /&gt;</code> . Uma regra CSS que define como escuro está em uma segunda folha de estilo vinculada e é aplicada por causa de sua posição posterior.</figcaption></figure>

Essa ordem também se aplica a elementos `<style>`. Se forem declarados antes de um `<link>`, o CSS da folha de estilo vinculada terá a maior especificidade.

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbLoB' } %}<figcaption> O <code>&lt;style&gt;</code> é declarado no <code>&lt;head&gt;</code>, enquanto o elemento <code>&lt;link /&gt;</code> é declarado no <code>&lt;body&gt;</code>. Isso significa que ele obtém mais especificidade do que o elemento <code>&lt;style&gt;</code>.</figcaption></figure>

Um `style` inline com CSS declarado nele substituirá todos os outros CSS, independentemente de sua posição, a menos que uma declaração tenha `!important` definido.

A posição também se aplica na ordem de sua regra CSS. Neste exemplo, o elemento terá um fundo roxo porque `background: purple` foi declarado por último. Como o fundo verde foi declarado antes do fundo roxo, agora ele é ignorado pelo navegador.

```css
.my-element {
  background: green;
  background: purple;
}
```

Ser capaz de especificar dois valores para a mesma propriedade pode ser uma maneira simples de criar substitutos para navegadores que não oferecem suporte a um determinado valor. Neste próximo exemplo, `font-size` é declarado duas vezes. Se `clamp()` for compatível com o navegador, a `font-size` será descartada. Se `clamp()` não for compatível com o navegador, a declaração inicial será respeitada e o tamanho da fonte será 1.5rem

```css
.my-element {
  font-size: 1.5rem;
  font-size: clamp(1.5rem, calc(1rem + 3vw), 2rem);
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbPMP' } %}</figure>

{% Aside %} Esta abordagem de declarar a mesma propriedade duas vezes funciona porque os navegadores ignoram valores que não entendem. Ao contrário de algumas outras linguagens de programação, o CSS não gerará um erro ou interromperá seu programa ao detectar uma linha que não pode ser analisada - o valor que não pode ser analisado é inválido e, portanto, ignorado. O navegador continua a processar o resto do CSS sem quebrar o que já entende. {% endAside %}

{% Assessment 'position' %}

## Especificidade

A especificidade é um algoritmo que determina qual seletor CSS é o mais específico, usando um sistema de ponderação ou pontuação para fazer esses cálculos. Ao tornar uma regra mais específica, você pode fazer com que ela seja aplicada mesmo que algum outro CSS que corresponda ao seletor apareça posteriormente no CSS.

Na [próxima lição,](/learn/css/specificity) você pode aprender os detalhes de como a especificidade é calculada; no entanto, manter algumas coisas em mente o ajudará a evitar muitos problemas de especificidade.

O CSS almejando uma classe em um elemento tornará essa regra mais específica e, portanto, vista como mais importante de ser aplicada do que o CSS almejando apenas o elemento. Isso significa que, com o seguinte CSS, o `h1` será colorido em vermelho, embora ambas as regras correspondam e a regra para o `h1` venha posteriormente na folha de estilo.

```html
<h1 class="my-element">Heading</h1>
```

```css
.my-element {
  color: red;
}

h1 {
  color: blue;
}
```

Um `id` torna o CSS ainda mais específico, então os estilos aplicados a um ID substituirão aqueles aplicados de muitas outras maneiras. Esse é um dos motivos pelos quais geralmente não é uma boa ideia anexar estilos a um `id` . Isso pode dificultar a substituição desse estilo por outro.

### A especificidade é cumulativa

Como você pode descobrir na próxima lição, cada tipo de seletor recebe pontos que indicam quão específico ele é, os pontos para todos os seletores que você usou para direcionar um elemento são somados. Isso significa que se você direcionar um elemento com uma lista de seletores, como `a.my-class.another-class[href]:hover` você obterá algo bastante difícil de sobrescrever por outro CSS. Por esse motivo, e para ajudar a tornar seu CSS mais reutilizável, é uma boa ideia manter seus seletores o mais simples possível. Use a especificidade como uma ferramenta para obter os elementos quando precisar, mas sempre considere refatorar listas de seletor longas e específicas, se puder.

## Origem

O CSS que você escreve não é o único CSS aplicado a uma página. A cascata leva em consideração a origem do CSS. Esta origem inclui a folha de estilo interna do navegador, estilos adicionados por extensões do navegador ou sistema operacional e seu CSS de autoria. A **ordem de especificidade dessas origens**, da menos específica para a mais específica, é a seguinte:

1. **Estilos básicos do agente do usuário**. Esses são os estilos que seu navegador aplica aos elementos HTML por padrão.
2. **Estilos de usuário local**. Eles podem vir do nível do sistema operacional, como um tamanho de fonte básico ou uma preferência de movimento reduzido. Eles também podem vir de extensões de navegador, como uma extensão que permite ao usuário escrever seu próprio CSS personalizado para uma página da web.
3. **CSS de autoria**. O CSS de sua autoria.
4. **Autoria `!important`**. Qualquer coisa `!important` que você adicionar às suas declarações de autoria.
5. **Estilos de usuários locais `!important`**. Qualquer coisa `!important` que venha do nível do sistema operacional ou CSS do nível de extensão do navegador.
6. **Agente do usuário `!important`**. Qualquer `!important` que seja definido no CSS padrão, fornecido pelo navegador.

<figure>{% Img src = "image/VbAJIREinuYvovrBzzvEyZOpw5w1/zPdaZ6G11oYrgJ78EfF7.svg", alt = "Uma demonstração visual da ordem das origens, conforme também explicado na lista.", width = "800", height = "347"%}</figure>

Se você tiver um `!important` no CSS de sua autoria e o usuário tiver um `!important` no CSS personalizado, qual CSS vence?

{% Assessment 'origin' %}

## Importância

Nem todas as regras CSS são calculadas da mesma forma ou recebem a mesma especificidade umas das outras.

A **ordem de importância**, do menos importante para o mais importante, é a seguinte:

1. tipo de regra normal, como `font-size` , `background` ou `color`
2. tipo de regra de `animation`
3. `!important` tipo de regra importante (seguindo a mesma ordem da origem)
4. tipo de regra de `transition`

Os tipos de regras de transição e animação ativas têm maior importância do que as regras normais. No caso de transições, a importância é maior do que os tipos de regras `!important`. Isso ocorre porque quando uma animação ou transição se torna ativa, seu comportamento esperado é mudar o estado visual.

## Usando DevTools para descobrir por que alguns CSS não estão sendo aplicados

As ferramentas de desenvolvimento do navegador geralmente mostram todos os CSS que podem corresponder a um elemento, com aqueles que não estão sendo usados riscados.

<figure>{% Img src = "image/VbAJIREinuYvovrBzzvEyZOpw5w1/Z6aLsqcqjGAUsWzq7DZs.png", alt = "Uma imagem do navegador DevTools com CSS substituído riscado", width = "800", height = "446"%}</figure>

Se o CSS que você esperava aplicar não aparecer, então ele não corresponde ao elemento. Nesse caso, você precisa procurar em outro lugar, talvez por um erro de digitação em uma classe ou nome de elemento ou algum CSS inválido.

{% Assessment 'conclusion' %}

## Recursos

- [Uma explicação altamente interativa da cascata](https://wattenberger.com/blog/css-cascade)
- [Referência de cascata MDN](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
