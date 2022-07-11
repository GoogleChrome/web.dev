---
layout: post
title: "Alguns elementos têm um valor `[tabindex]` maior que `0`"
description: |
  Saiba como melhorar a acessibilidade do teclado da sua página da Web evitando
  uma ordem de navegação de teclado explícita.
date: 2019-05-02
updated: 2022-07-11
web_lighthouse:
  - tabindex
---

Embora tecnicamente válido,
usar um `tabindex` maior que `0` é considerado um antipadrão porque
desloca o elemento afetado para o final da
[ordem de tabulação](/keyboard-access/#focus-and-the-tab-order).
Esse comportamento inesperado pode fazer parecer que alguns elementos não podem ser acessados
via teclado, o que é frustrante para usuários que dependem de tecnologias assistivas.

## Como a auditoria em `tabindex` do Lighthouse falha

O Lighthouse sinaliza elementos que têm um valor `tabindex` maior que `0`:

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fj9urW8nMfivHXbT1TSr.png", alt="Auditoria do Lighthouse mostrando que alguns elementos têm um valor tabindex maior que 0", width="800", height="206" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Como corrigir valores problemáticos de `tabindex`

Se você tiver um `tabindex` maior que `0`,
e estiver usando um link ou elemento de formulário,
remova o `tabindex`.
Elementos HTML como `<button>` ou `<input>`
tem acessibilidade de teclado integrada nativamente.

Se você estiver usando componentes interativos personalizados,
defina o `tabindex` para `0`.
For example:

```html
<div tabindex="0">Pressione a tecla TAB para focar aqui</div>
```

Se você precisar que um elemento chegue mais cedo ou mais tarde na ordem de tabulação,
ele deve ser movido para um local diferente no DOM.
Saiba mais em
[Controle o foco com tabindex](/control-focus-with-tabindex).

## Recursos

- [Código-fonte para a auditoria de **Alguns elementos têm um valor `[tabindex]` maior que 0**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/tabindex.js)
- [Elementos não devem ter tabindex maior que zero (Deque University)](https://dequeuniversity.com/rules/axe/3.3/tabindex)
