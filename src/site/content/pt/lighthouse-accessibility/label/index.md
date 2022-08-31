---
layout: post
title: Os elementos do formulário não têm rótulos associados
description: Aprenda como tornar os elementos do formulário acessíveis aos usuários de tecnologia assistiva fornecendo rótulos.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - rótulo
---

Os rótulos garantem que os controles de formulário sejam anunciados adequadamente por tecnologias assistivas, como leitores de tela. Os usuários de tecnologia assistiva contam com esses rótulos para navegar nos formulários. Os usuários de mouse e tela sensível ao toque também podem se beneficiar dos rótulos porque o texto do rótulo cria um ponto de clique maior.

## Como esta auditoria Lighthouse falha

Os sinalizadores do Lighthouse formam elementos que não têm rótulos associados:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMWt5UyiUUskhKHUcYoN.png", alt="Auditoria de farol mostrando que os elementos do formulário não têm rótulos associados", width="800", height="185" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como adicionar rótulos aos elementos do formulário

Existem duas maneiras de associar um rótulo a um elemento de formulário. Coloque o elemento de entrada dentro de um elemento de rótulo:

```html
<label>
  Receber ofertas promocionais?
  <input type="checkbox">
</label>
```

Ou use o rótulo `for` atributo e consulte o ID do elemento:

```html
<input id="promo" type="checkbox">
<label for="promo">Receber ofertas promocionais?</label>
```

Quando a caixa de seleção é marcada corretamente, as tecnologias assistivas relatam que o elemento tem uma função de caixa de seleção está em um estado marcado e é denominado "Receber ofertas promocionais?" Consulte também [Rotular elementos de formulário](/labels-and-text-alternatives#label-form-elements) .

## Recursos

- [O código-fonte para a auditoria **elementos de formulário não tem rótulos associados**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/label.js)
- [Os elementos do formulário `<input>` devem ter rótulos (Deque University)](https://dequeuniversity.com/rules/axe/3.3/label)
