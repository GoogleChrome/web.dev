---
layout: post
title: Controle o foco com tabindex
authors:
  - robdodson
date: 2018-11-18
description: Elementos HTML padrão como <button> ou <input> têm acessibilidade de teclado integrada gratuitamente. Se você estiver construindo componentes interativos personalizados, use tabindex para garantir que eles sejam acessíveis pelo teclado.
---

Os elementos HTML padrão, como `<button>` ou `<input>` possuem acessibilidade de teclado integrada gratuitamente. No entanto, se você estiver construindo *componentes interativos personalizados*, use o `tabindex` para garantir que eles sejam acessíveis pelo teclado.

{% Aside %} Sempre que possível, use um elemento HTML integrado em vez de construir sua própria versão personalizada. `<button>`. Por exemplo, é muito fácil de estilizar e ele já tem suporte completo para teclado. Isso evitará que você precise gerenciar `tabindex` ou adicionar semântica com ARIA. {% endAside %}

## Verifique se seus controles são acessíveis pelo teclado

Uma ferramenta como o Lighthouse é ótima para detectar certos problemas de acessibilidade, mas algumas coisas só podem ser testadas por um ser humano.

Tente pressionar a `Tab` para navegar pelo seu site. Você consegue acessar todos os controles interativos da página? Caso contrário, pode ser necessário usar [`tabindex`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex) para melhorar a focalização desses controles.

{% Aside 'warning' %} Se você não vir um indicador de foco, ele pode estar oculto pelo seu CSS. Verifique se há estilos que mencionam `:focus { outline: none; }`. Você pode aprender como consertar isso em nosso guia sobre o [foco do estilo](/style-focus). {% endAside %}

## Insira um elemento na ordem das guias

Insira um elemento na ordem natural das guias usando `tabindex="0"` . Por exemplo:

```html
<div tabindex="0">Focus me with the TAB key</div>
```

Para focar um elemento, pressione a `Tab` ou chame o método `focus()`

{% Glitch { id: 'tabindex-zero', path: 'index.html', height: 346 } %}

## Remova um elemento da ordem de tabulação

Remova um elemento usando `tabindex="-1"` . Por exemplo:

```html
<button tabindex="-1">Você não consegue me alcançar com a tecla TAB!</button>
```

Isso remove um elemento da ordem natural de tabulação, mas o elemento ainda pode ser focalizado chamando seu método `focus()`

{% Glitch { id: 'tabindex-negative-one', path: 'index.html', height: 346 } %}

Observe que aplicar `tabindex="-1"` a um elemento não afeta os filhos dele; se eles estiverem na ordem das guias naturalmente ou por causa de um `tabindex`, eles permanecerão na ordem das guias. Para remover um elemento e todos os seus filhos da ordem de tabulação, considere o uso o [polyfill `inert` WICG](https://github.com/WICG/inert). O polyfill emula o comportamento de um `inert` proposto, o que evita que os elementos sejam selecionados ou lidos por tecnologias assistivas.

{% Aside 'caution' %} O `inert` é experimental e pode não funcionar como esperado em todos os casos. Teste cuidadosamente antes de usar na produção. {% endAside %}

## Evite `tabindex > 0`

Qualquer `tabindex` maior que 0 salta o elemento para a frente da ordem natural das guias. Se houver vários elementos com um `tabindex` de tabulação maior que 0, a ordem das guias começa a partir do valor mais baixo maior que zero e segue seu caminho para cima.

Usar um `tabindex` maior que 0 é considerado um **antipadrão** porque os leitores de tela navegam na página na ordem do DOM, não na ordem das guias. Se você precisar que um elemento venha antes da ordem de tabulação, ele deve ser movido para um ponto anterior no DOM.

O Lighthouse facilita a identificação de elementos com `tabindex` &gt; 0. Execute a Auditoria de Acessibilidade (Lighthouse &gt; Opções &gt; Acessibilidade) e procure os resultados da auditoria "Nenhum elemento tem um valor [tabindex] maior que 0".

## Crie componentes acessíveis com "roving `tabindex`"

Se você estiver construindo um componente complexo, pode ser necessário adicionar suporte de teclado adicional além do foco. Considere o elemento de `select` É focalizável e você pode usar as teclas de seta para expor funcionalidades adicionais (as opções selecionáveis).

Para implementar uma funcionalidade semelhante em seus próprios componentes, use uma técnica conhecida como "`tabindex`". A movimentação do tabindex funciona definindo `tabindex` como -1 para todos os filhos, exceto o atualmente ativo. O componente então usa um ouvinte de evento de teclado para determinar qual tecla o usuário pressionou.

Quando isso acontece, o componente define o `tabindex` do filho focado anteriormente como -1, define o `tabindex` do filho a ser focado como 0 e chama o `focus()` nele.

**Antes**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Desfazer</div>
  <button tabindex="0">Refazer</div>
  <button tabindex="-1">Cortar</div>
</div>
```

**Depois**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Desfazer</div>
  <button tabindex="-1">Refazer</div>
  <button tabindex="0">Cortar</div>
</div>
```

{% Glitch { id: 'roving-tabindex', path: 'index.html', height: 346 } %}

{% Aside %} Tem a curiosidade de saber para que servem esses atributos `role=""`? Eles permitem que você altere a semântica de um elemento para que seja anunciado corretamente por um leitor de tela. Você pode aprender mais sobre eles em nosso guia [noções básicas do leitor de tela](/semantics-and-screen-readers). {% endAside %}

{% Assessment 'self-assessment' %}

## Receitas de acesso ao teclado

Se você não tiver certeza de qual nível de suporte de teclado seus componentes personalizados podem precisar, consulte [ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/) . Este guia prático lista padrões comuns de IU e identifica para quais teclas seus componentes devem ter suporte.
