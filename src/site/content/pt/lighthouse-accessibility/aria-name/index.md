---
layout: post
title: Os itens ARIA não têm nomes acessíveis
description: |2

  Aprenda como melhorar a acessibilidade da sua página da web certificando-se de que

  os usuários de tecnologia assistiva podem acessar os nomes dos itens ARIA.
date: 2020-12-08
web_lighthouse:
  - aria-command-name
  - aria-input-field-name
  - aria-meter-name
  - aria-progressbar-name
  - aria-toggle-field-name
  - aria-tooltip-name
  - aria-treeitem-name
tags:
  - accessibility
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

{% include 'content/lighthouse-accessibility/accessible-names.njk' %}

## Como o Lighthouse identifica itens ARIA sem nomes acessíveis

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza itens ARIA personalizados cujos nomes não são acessíveis a tecnologias de assistência:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dnruhkr4IKtq0Pi9Pgny.png", alt="Auditoria do Lighthouse mostrando elementos de alternância personalizados sem nomes acessíveis", width="800", height="259" %}</figure>

Existem 7 auditorias que verificam os nomes acessíveis, cada uma cobre um conjunto diferente de [funções ARIA](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex). Elementos que têm qualquer uma das seguintes funções ARIA, mas não têm nomes acessíveis, farão com que esta auditoria falhe:

Nome da auditoria | Papéis ARIA
--- | ---
`aria-command-name` | `button`, `link`, `menuitem`
`aria-input-field-name` | `combobox`, `listbox`, `searchbox`, `slider`, `spinbutton`, `textbox`
`aria-meter-name` | `meter`
`aria-progressbar-name` | `progressbar`
`aria-toggle-field-name` | `checkbox` , `menu`, `menuitemcheckbox`, `menuitemradio`, `radio`, `radiogroup`, `switch`
`aria-tooltip-name` | `tooltip`
`aria-treeitem-name` | `treeitem`

{% include 'content/lighthouse-accessibility/use-built-in.njk' %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Exemplo 1: como adicionar nomes acessíveis aos seus campos de alternância ARIA personalizados

### Opção 1: adicionar texto interno ao elemento

A maneira mais fácil de fornecer um nome acessível para a maioria dos elementos é incluir conteúdo de texto dentro do elemento.

Por exemplo, esta caixa de seleção personalizada será anunciada como "Jornal" para usuários de tecnologia assistiva:

```html
<div id="checkbox1" role="checkbox">Newspaper</div>
```

Usando o [padrão de clipe,](https://www.a11yproject.com/posts/2013-01-11-how-to-hide-content/) você pode ocultar o texto interno na tela, mas ainda assim fazer com que seja anunciado por tecnologia assistiva. Isso pode ser especialmente útil se você traduzir suas páginas para localização.

```html
<a href="/accessible">Learn more <span class="visually-hidden">about accessibility on web.dev</span></a>
```

### Opção 2: adicione um atributo `aria-label` ao elemento

Se você não puder adicionar texto interno - por exemplo, se não quiser que o nome do elemento fique visível - use o atributo `aria-label`

Essa mudança personalizada será anunciada como "Alternar luz azul" para usuários de tecnologia assistiva:

```html
<div id="switch1"
    role="switch"
    aria-checked="true"
    aria-label="Toggle blue light">
    <span>off</span>
    <span>on</span>
</div>
```

### Opção 3: consulte outro elemento usando `aria-labelledby`

Use o atributo `aria-labelledby` para identificar outro elemento, usando seu ID, para servir como o nome do elemento atual.

Por exemplo, este botão de opção do menu personalizado refere-se ao `menuitem1Label` como seu rótulo e será anunciado como "Sans-serif":

```html
<p id="menuitem1Label">Sans-serif</p>
<ul role="menu">
    <li id="menuitem1"
        role="menuitemradio"
        aria-labelledby="menuitem1Label"
        aria-checked="true"></li>
</ul>
```

## Exemplo 2: como adicionar nomes acessíveis aos seus campos de entrada ARIA personalizados

A maneira mais fácil de fornecer um nome acessível para a maioria dos elementos é incluir conteúdo de texto no elemento. No entanto, os campos de entrada personalizados geralmente não têm texto interno, portanto, você pode usar uma das estratégias a seguir.

### Opção 1: adicione um atributo `aria-label` ao elemento

Use o atributo `aria-label` para definir o nome do elemento atual.

Por exemplo, este combobox personalizado será anunciado como "país" para usuários de tecnologia assistiva:

```html
<div id="combo1" aria-label="country" role="combobox"></div>
```

### Opção 2: consulte outro elemento usando `aria-labelledby`

Use o `aria-labelledby` para identificar outro elemento, usando seu ID, para servir como o nome do elemento atual.

Por exemplo, esta caixa de `searchLabel` personalizada refere-se ao parágrafo searchLabel como seu rótulo e será anunciada como "Pesquisar pares de moedas":

```html
<p id="searchLabel">Search currency pairs:</p>
<div id="search"
    role="searchbox"
    contenteditable="true"
    aria-labelledby="searchLabel"></div>
```

## Recursos

- [Código-fonte para a auditoria **Nem todos os campos de alternância ARIA têm nomes acessíveis**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/aria-toggle-field-name.js)
- [O botão ARIA, link e item de menu devem ter um nome acessível (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-command-name)
- [Os campos de entrada ARIA devem ter um nome acessível (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-input-field-name)
- [O medidor ARIA deve ter um nome acessível (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-meter-name)
- [A barra de progresso ARIA deve ter um nome acessível (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-progressbar-name)
- [Os campos de alternância ARIA têm um nome acessível (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-toggle-field-label)
- [A dica de ferramenta ARIA deve ter um nome acessível (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-tooltip-name)
- [O item da árvore ARIA deve ter um nome acessível (Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-treeitem-name)
- [Rótulos e alternativas de texto](/labels-and-text-alternatives)
- [Use HTML semântico para vitórias fáceis com o teclado](/use-semantic-html)
