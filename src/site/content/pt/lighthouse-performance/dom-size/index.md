---
layout: post
title: Evite um tamanho excessivo de DOM
description: |2-

  Aprenda como um DOM grande pode reduzir o desempenho de sua página da web e como você pode reduzir o tamanho dele no momento do carregamento.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - dom-size
tags:
  - memory
---

Uma grande árvore DOM pode diminuir o desempenho de sua página de várias maneiras:

- **Eficiência da rede e desempenho de carga**

    Geralmente, uma grande árvore DOM inclui muitos nós que não são visíveis quando o usuário carrega a página pela primeira vez, o que aumenta desnecessariamente o consumo de dados para os usuários e diminui o tempo de carregamento.

- **Desempenho de tempo de execução**

    À medida que os usuários e scripts interagem com sua página, o navegador precisa [recalcular a posição e estilo de nós](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?utm_source=lighthouse&utm_medium=cli) constantemente. Uma grande árvore DOM em conjunto com regras de estilo complicadas pode deixar a renderização drasticamente mais lenta.

- **Desempenho de memória**

    Se o seu JavaScript usa seletores de consulta gerais, como `document.querySelectorAll('li')`, você pode estar armazenando inadvertidamente referências a um grande número de nós, o que pode sobrecarregar os recursos de memória dos dispositivos dos usuários.

## Como a auditoria de tamanho do DOM do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) relata o total de elementos DOM de uma página, a profundidade máxima do DOM da página e o máximo de elementos filho:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SUCUejhAE77m6k2WyI6D.png", alt="Captura de tela da auditoria do Lighthouse 'Evitar um tamanho excessivo do DOM'", width="800", height="363" %}</figure>

O Lighthouse sinaliza páginas com árvores DOM:

- Ele gera avisos quando o elemento body tem mais de 800 nós.
- Ele gera erros quando o elemento body tem mais de 1.400 nós.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Como otimizar o tamanho do DOM

Em geral, procure maneiras de criar nós DOM apenas quando necessário e destrua os nós quando não forem mais necessários.

Se você estiver enviando atualmente uma grande árvore DOM, tente carregar a página e observar manualmente quais nós são exibidos. Talvez você possa remover os nós não exibidos do documento carregado inicialmente e apenas criá-los depois de uma interação relevante do usuário, como rolagem ou clique de botão.

Se você criar nós DOM em tempo de execução, os [pontos de interrupção de alteração de DOM para modificação de subárvore](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#dom) podem ajudar a identificar quando os nós são criados.

Se você não puder evitar uma grande árvore DOM, outra abordagem para melhorar o desempenho de renderização é simplificar os seletores de CSS. Consulte mais informações no artigo [Reduza o escopo e a complexidade dos cálculos de estilo](/reduce-the-scope-and-complexity-of-style-calculations/) do Google.

## Orientação específica para pilha

### Angular

Se você estiver renderizando listas grandes, use a [rolagem virtual](/virtualize-lists-with-angular-cdk/) com o Component Dev Kit (CDK).

### React

- Use uma biblioteca de "janelas", como [`react-window`](/virtualize-long-lists-react-window/), para minimizar o número de nós DOM criados se você estiver renderizando muitos elementos repetidos na página.
- Minimize a renderização desnecessária usando [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action), [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) ou [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo).
- [Ignore os efeitos](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects) apenas até que certas dependências tenham mudado se você estiver usando `Effect` para melhorar o desempenho em tempo de execução.

## Recursos

- [Código-fonte da auditoria **Evitar tamanho excessivo do DOM**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/dom-size.js)
- [Reduza o escopo e a complexidade dos cálculos de estilo](/reduce-the-scope-and-complexity-of-style-calculations/)
