---
title: Shadow DOM Declarativa
subhead: |2

  Uma nova maneira de implementar e usar Shadow DOM diretamente em HTML.
date: 2020-09-30
updated: 2021-04-14
hero: image/admin/IIPe5m8edvp0XMPpzrz9.jpg
alt: domo de shadow decorativo
authors:
  - developit
  - masonfreed
description: |2-

  Shadow DOM declarativa é uma nova maneira de implementar e usar Shadow DOM diretamente em HTML.
tags:
  - blog
  - dom
  - html
  - javascript
  - layout
  - rendering
feedback:
  - api
---

{% Aside %} A Shadow DOM declarativa é um recurso proposto da plataforma da web sobre o qual a equipe do Chrome está procurando feedback. Teste usando o [sinalizador experimental](#detection-support) ou [polyfill](#polyfill). {% endAside %}

[Shadow DOM](/shadowdom-v1/) é um dos três padrões de componentes da Web, complementado por [modelos HTML](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots) e [elementos personalizados](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements). A Shadow DOM fornece uma maneira de definir o escopo de estilos CSS para uma subárvore DOM específica e isolar essa subárvore do resto do documento. O `<slot>` nos dá uma maneira de controlar onde os filhos de um elemento personalizado devem ser inseridos em sua árvore de sombra. Esses recursos combinados permitem um sistema para a construção de componentes autocontidos e reutilizáveis que se integram perfeitamente aos aplicativos existentes, como um elemento HTML integrado.

Até agora, a única maneira de usar Shadow DOM era criar uma shadow root usando JavaScript:

```js
const host = document.getElementById('host');
const shadowRoot = host.attachShadow({mode: 'open'});
shadowRoot.innerHTML = '<h1>Hello Shadow DOM</h1>';
```

Uma API imperativa como essa funciona bem para renderização do lado do cliente: os mesmos módulos JavaScript que definem nossos Elementos personalizados também criam suas shadow roots e definem seu conteúdo. No entanto, muitos aplicativos da web precisam renderizar o conteúdo do lado do servidor ou HTML estático no momento da construção. Isso pode ser uma parte importante para proporcionar uma experiência razoável aos visitantes que talvez não sejam capazes de executar JavaScript.

As justificativas para [a renderização do lado do servidor](/rendering-on-the-web/) (SSR) variam de projeto para projeto. Alguns sites devem fornecer HTML renderizado por servidor totalmente funcional para atender às diretrizes de acessibilidade, outros optam por fornecer uma experiência básica sem JavaScript como forma de garantir um bom desempenho em conexões ou dispositivos lentos.

Historicamente, tem sido difícil usar a Shadow DOM em combinação com a renderização do lado do servidor porque não havia uma maneira embutida de expressar Shadow Roots no HTML gerado pelo servidor. Existem também implicações de desempenho ao anexar Shadow Roots a elementos DOM que já foram renderizados sem eles. Isso pode causar mudança no layout após o carregamento da página ou mostrar temporariamente um flash de conteúdo não estilizado ("FOUC") ao carregar as folhas de estilo do Shadow Root.

A [Shadow DOM Declarativa](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md) (DSD) remove essa limitação, trazendo a Shadow DOM para o servidor.

## Como criar uma shadow root declarativa {: #building}

Uma shadow root declarativa é um `<template>` com um atributo `shadowroot`

```html
<host-element>
  <template shadowroot="open">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

Um elemento de modelo com o `shadowroot` é detectado pelo analisador HTML e imediatamente aplicado como a shadow root de seu elemento pai. Carregando a marcação HTML pura dos resultados de amostra acima na seguinte árvore DOM:

```html
<host-element>
  #shadow-root (open)
  <slot>
    ↳
    <h2>Light content</h2>
  </slot>
</host-element>
```

{% Aside %} Este exemplo de código está seguindo as convenções do painel Chrome DevTools Elements para exibir conteúdo Shadow DOM. Por exemplo, o `↳` representa o conteúdo Light DOM com slot. {% endAside %}

Isso nos dá os benefícios do encapsulamento de Shadow DOM e projeção de slot em HTML estático. Nenhum JavaScript é necessário para produzir a árvore inteira, incluindo a Shadow Root.

## Serialização {: #serialization}

Além de introduzir a nova `<template>` para criar shadow roots e anexá-las a elementos, Shadow Dom Declarativa também inclui uma nova API para obter o conteúdo HTML de um elemento. O novo `getInnerHTML()` funciona como `.innerHTML`, mas fornece uma opção para controlar se as shadow roots devem ser incluídas no HTML retornado:

```js
const html = element.getInnerHTML({includeShadowRoots: true});
`<host-element>
  <template shadowroot="open"><slot></slot></template>
  <h2>Light content</h2>
</host-element>`;
```

Passar a `includeShadowRoots:true` serializa toda a subárvore de um elemento, **incluindo suas shadow roots**. As shadow roots incluídas são serializadas usando a sintaxe `<template shadowroot>`

A fim de preservar a semântica de encapsulamento, quaisquer [shadow roots fechadas](https://developer.mozilla.org/docs/Web/API/ShadowRoot/mode) em um elemento não serão serializadas por padrão. Para incluir shadow roots fechadas no HTML serializado, uma matriz de referências a essas shadow roots pode ser passada por meio de uma nova opção de `closedRoots`

```js
const html = element.getInnerHTML({
  includeShadowRoots: true,
  closedRoots: [shadowRoot1, shadowRoot2, ...]
});
```

Ao serializar o HTML em um elemento, todas as raízes de sombra fechadas que estão presentes na `closedRoots` serão serializadas usando a mesma sintaxe de modelo das raízes de sombra abertas:

```html
<host-element>
  <template shadowroot="closed">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

As shadow root fechadas serializadas são indicadas por um `shadowroot` com um valor de `closed`.

## Hidratação do componente {: #hydration}

A Shadow DOM Declarativa pode ser usada sozinha como uma forma de encapsular estilos ou personalizar o posicionamento dos filhos, mas é mais poderosa quando usada com elementos personalizados. Componentes construídos usando elementos personalizados são atualizados automaticamente a partir de HTML estático. Com a introdução da Shadow DOM Declarativa, agora é possível que um elemento personalizado tenha uma raiz de sombra antes de ser atualizado.

Um elemento personalizado sendo atualizado do HTML que inclui uma shadow root declarativa já terá essa shadow root anexada. Isso significa que o elemento terá uma `shadowRoot` já disponível quando for instanciado, sem que seu código crie uma explicitamente. É melhor verificar `this.shadowRoot` para qualquer shadow root existente no construtor do seu elemento. Se já houver um valor, o HTML para este componente inclui uma shadow root declarativa. Se o valor for nulo, não havia nenhuma shadow root declarativa presente no HTML ou o navegador não oferece suporte à Shadow DOM Declarativa.

```html
<menu-toggle>
  <template shadowroot="open">
    <button>
      <slot></slot>
    </button>
  </template>
  Open Menu
</menu-toggle>

<script>
  class MenuToggle extends HTMLElement {
    constructor() {
      super();

      // Detect whether we have SSR content already:
      if (this.shadowRoot) {
        // A Declarative Shadow Root exists!
        // wire up event listeners, references, etc.:
        const button = this.shadowRoot.firstElementChild;
        button.addEventListener('click', toggle);
      } else {
        // A Declarative Shadow Root doesn't exist.
        // Create a new shadow root and populate it:
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `<button><slot></slot></button>`;
        shadow.firstChild.addEventListener('click', toggle);
      }
    }
  }

  customElements.define('menu-toggle', MenuToggle);
</script>
```

Elementos personalizados já existem há algum tempo e, até agora, não havia razão para verificar se havia uma shadow root existente antes de criar uma usando `attachShadow()`. A Shadow DOM Declarativa inclui uma pequena mudança que permite que os componentes existentes funcionem apesar disso: chamar o `attachShadow()` em um elemento com uma Shadow Root **declarativa** **existente não** gerará um erro. Em vez disso, a shadow root declarativa é esvaziada e retornada. Isso permite que componentes mais antigos não construídos para Shadow DOM Declarativa continuem trabalhando, uma vez que as shadow roots são preservadas até que uma substituição obrigatória seja criada.

Para elementos personalizados recém-criados, uma nova propriedade [ElementInternals.shadowRoot](https://github.com/w3c/webcomponents/issues/871) fornece uma maneira explícita de obter uma referência à shadow root declarativa existente de um elemento, tanto aberta quanto fechada. Isso pode ser usado para verificar e usar qualquer shadow root declarativa, enquanto ainda `attachShadow()` nos casos em que uma não foi fornecida.

```js
class MenuToggle extends HTMLElement {
  constructor() {
    super();

    const internals = this.attachInternals();

    // check for a Declarative Shadow Root:
    let shadow = internals.shadowRoot;
    if (!shadow) {
      // there wasn't one. create a new Shadow Root:
      shadow = this.attachShadow({mode: 'open'});
      shadow.innerHTML = `<button><slot></slot></button>`;
    }

    // in either case, wire up our event listener:
    shadow.firstChild.addEventListener('click', toggle);
  }
}
customElements.define('menu-toggle', MenuToggle);
```

## Uma sombra por raiz {: #shadow-per-root}

Uma raiz de sombra declarativa está associada apenas ao seu elemento pai. Isso significa que as raízes sombreadas estão sempre localizadas com seu elemento associado. Essa decisão de design garante que as raízes de sombra sejam transmitidas como o resto de um documento HTML. Também é conveniente para autoria e geração, já que adicionar uma raiz de sombra a um elemento não requer a manutenção de um registro das raízes de sombra existentes.

A desvantagem de associar shadow roots com seu elemento pai é que não é possível que vários elementos sejam inicializados a partir do mesmo `<template>` de shadow root declarativa. No entanto, é improvável que isso importe na maioria dos casos em que a Shadow DOM Declarativa é usada, uma vez que o conteúdo de cada shadow root raramente é idêntico. Embora o HTML renderizado pelo servidor frequentemente contenha estruturas de elemento repetidas, seu conteúdo geralmente difere - pequenas variações no texto, atributos etc. Como o conteúdo de uma shadow root declarativa serializada é totalmente estático, atualizar vários elementos de uma única shadow root declarativa só funcionaria se os elementos forem idênticos. Finalmente, o impacto de shadow roots semelhantes repetidas no tamanho de transferência da rede é relativamente pequeno devido aos efeitos da compressão.

No futuro, pode ser possível revisitar shadow roots compartilhadas. Se a DOM ganhar suporte para [modelos integrados](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md), as shadow roots declarativas podem ser tratadas como modelos que são instanciados para construir a shadow root para um determinado elemento. O design atual da Shadow DOM Declarativa permite que essa possibilidade exista no futuro, limitando a associação da shadow root a um único elemento.

## O tempo é tudo {: #timing}

Associar Shadow Roots declarativos diretamente com seu elemento pai simplifica o processo de atualização e anexação a esse elemento. Shadow Roots declarativos são detectados durante a análise de HTML e anexados imediatamente quando sua **tag de fechamento** `</template>` é encontrada.

```html
<div id="el">
  <script>
    el.shadowRoot; // null
  </script>

  <template shadowroot="open">
    <!-- shadow realm -->
  </template>

  <script>
    el.shadowRoot; // ShadowRoot
  </script>
</div>
```

Antes de ser anexado, o conteúdo de um `<template>` com o `shadowroot` é um fragmento de documento inerte e não é acessível por meio da `.content` como um modelo padrão. Essa medida de segurança impede que o JavaScript seja capaz de obter uma referência a shadow roots fechadas. Como resultado, o conteúdo de uma shadow root declarativa não é renderizado até que sua `</template>` fechamento seja analisada.

```html
<div>
  <template id="shadow" shadowroot="open">
    shadow realm
    <script>
      shadow.content; // null
    </script>
  </template>
</div>
```

## Apenas analisar {: #parser-only}

A Shadow DOM Declarativa é um recurso do analisador HTML. Isso significa que uma shadow root declarativa só será analisada e anexada a `<template>` com um `shadowroot` que estão presentes durante a análise de HTML. Em outras palavras, as shadow roots declarativas podem ser construídas durante a análise HTML inicial:

```html
<some-element>
  <template shadowroot="open">
    shadow root content for some-element
  </template>
</some-element>
```

Definir o `shadowroot` de um `<template>` não faz nada, e o template permanece um elemento de template comum:

```js
const div = document.createElement('div');
const template = document.createElement('template');
template.setAttribute('shadowroot', 'open'); // this does nothing
div.appendChild(template);
div.shadowRoot; // null
```

Para evitar algumas considerações de segurança importantes, as shadow roots declarativas também não podem ser criadas usando APIs de análise de fragmentos como `innerHTML` ou `insertAdjacentHTML()`. A única maneira de analisar HTML com shadow roots declarativas aplicadas é passar uma nova opção `includeShadowRoots` `DOMParser`:

```html
<script>
  const html = `
    <div>
      <template shadowroot="open"></template>
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = html; // No shadow root here
  const fragment = new DOMParser().parseFromString(html, 'text/html', {
    includeShadowRoots: true
  }); // Shadow root here
</script>
```

## Renderização de servidor com estilo {: #styling}

Folhas de estilo internas e externas são totalmente suportadas em shadow roots declarativas usando as tags `<style>` e `<link>`

```html
<nineties-button>
  <template shadowroot="open">
    <style>
      button {
        color: seagreen;
      }
    </style>
    <link rel="stylesheet" href="/comicsans.css" />
    <button>
      <slot></slot>
    </button>
  </template>
  I'm Blue
</nineties-button>
```

Os estilos especificados dessa maneira também são altamente otimizados: se a mesma folha de estilo estiver presente em várias shadow roots declarativas, ela será carregada e analisada apenas uma vez. O navegador usa um único suporte `CSSStyleSheet` que é compartilhado por todas as shadow roots, eliminando a sobrecarga de memória duplicada.

[Folhas de estilo construtíveis](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) não são suportadas na Shadow DOM Declarativa. Isso ocorre porque atualmente não há como serializar folhas de estilo construtíveis em HTML, e nenhuma maneira de se referir a elas ao preencher `adoptedStyleSheets`.

## Evitando o flash de conteúdo sem estilo {: #fouc}

Um problema potencial em navegadores que ainda não oferecem suporte à Shadow DOM Declarativa é evitar "flash de conteúdo não estilizado" (FOUC), onde o conteúdo bruto é mostrado para elementos personalizados que ainda não foram atualizados. Antes da Shadow DOM Declarativa, uma técnica comum para evitar FOUC era aplicar uma `display:none` a elementos personalizados que ainda não foram carregados, uma vez que não tinham sua shadow root anexada e preenchida. Desta forma, o conteúdo não é exibido até que esteja "pronto":

```html
<style>
  x-foo:not(:defined) > * {
    display: none;
  }
</style>
```

Com a introdução da Shadow DOM Declarativa, os elementos personalizados podem ser renderizados ou criados em HTML de modo que seu conteúdo de sombra esteja no local e pronto antes que a implementação do componente do lado do cliente seja carregada:

```html
<x-foo>
  <template shadowroot="open">
    <style>h2 { color: blue; }</style>
    <h2>shadow content</h2>
  </template>
</x-foo>
```

Nesse caso, a `display:none` "FOUC" impediria a exibição do conteúdo da shadow root declarativa. No entanto, a remoção dessa regra faria com que os navegadores sem suporte para Shadow DOM Declarativa mostrassem conteúdo incorreto ou sem estilo até que o [polyfill](#polyfill) da DOM Shadow Declarativa carregue e converta o modelo de shadow root em uma shadow root real.

Felizmente, isso pode ser resolvido em CSS, modificando a regra de estilo FOUC. Em navegadores que oferecem suporte à Shadow DOM Declarativa, o elemento `<template shadowroot>` é imediatamente convertido em uma shadow root, não deixando nenhum `<template>` na árvore DOM. Os navegadores que não são compatíveis com a Shadow DOM Declarativa preservam o `<template>`, que podemos usar para prevenir FOUC:

```html
<style>
  x-foo:not(:defined) > template[shadowroot] ~ *  {
    display: none;
  }
</style>
```

Em vez de ocultar o elemento personalizado ainda não definido, a regra "FOUC" revisada oculta seus *filhos* quando eles seguem um elemento `<template shadowroot>`. Depois que o elemento personalizado é definido, a regra não corresponde mais. A regra é ignorada em navegadores que suportam Shadow DOM Declarativa porque o `<template shadowroot>` é removido durante a análise de HTML.

## Detecção de recursos e suporte ao navegador {: #detecção-suporte}

A Shadow DOM Declarativa está disponível no Chrome 90 e Edge 91. Ele também pode ser ativado usando o **sinalizador Experimental Web Platform Features** no Chrome 85. Navegue até `about://flags/#enable-experimental-web-platform-features` para encontrar essa configuração.

Como uma nova API de plataforma da web, o Declarative Shadow DOM ainda não tem suporte generalizado em todos os navegadores. O suporte do navegador pode ser detectado verificando a existência de uma `shadowroot` no protótipo de `HTMLTemplateElement` :

```js
function supportsDeclarativeShadowDOM() {
  return HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot');
}
```

## Polyfill {: #polyfill}

Construir um polyfill simplificado para Declarative Shadow DOM é relativamente direto, uma vez que um polyfill não precisa replicar perfeitamente a semântica de temporização ou características somente de analisador com as quais uma implementação de navegador se preocupa. Para Shadow DOM Declarativa de preenchimento múltiplo, podemos varrer o DOM para encontrar todos os elementos `<template shadowroot>`, em seguida, convertê-los em Shadow Roots anexados em seu elemento pai. Esse processo pode ser feito quando o documento estiver pronto ou acionado por eventos mais específicos, como os ciclos de vida do elemento personalizado.

```js
document.querySelectorAll('template[shadowroot]').forEach(template => {
  const mode = template.getAttribute('shadowroot');
  const shadowRoot = template.parentNode.attachShadow({ mode });
  shadowRoot.appendChild(template.content);
  template.remove();
});
```

## Leitura adicional {: #leitura adicional}

- [Explique com alternativas e análise de desempenho](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md)
- [Chromestatus para Sombra Declarativa DOM](https://www.chromestatus.com/feature/5191745052606464)
- [Intenção de protótipo](https://groups.google.com/a/chromium.org/g/blink-dev/c/nJDc-1s3R9U/m/uCJKsEqpAwAJ)
