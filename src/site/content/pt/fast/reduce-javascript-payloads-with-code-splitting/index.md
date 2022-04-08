---
layout: post
title: Reduza os payloads do JavaScript com divisão de código
authors:
  - houssein
description: |2-

  O envio de grandes cargas úteis de JavaScript afeta a velocidade do seu site significativamente. Em vez de enviar todo o JavaScript para o seu usuário assim que a primeira página do seu aplicativo for carregada, divida o pacote em vários pedaços e envie apenas o necessário no início.
date: 2018-11-05
codelabs:
  - codelab-code-splitting
tags:
  - performance
---

Ninguém gosta de esperar. **[Mais de 50% dos usuários abandonam um site se ele demorar mais de 3 segundos para carregar](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)**.

O envio de grandes cargas úteis de JavaScript afeta significativamente a velocidade do seu site. Em vez de enviar todo o JavaScript para o seu usuário assim que a primeira página do seu aplicativo for carregada, divida o pacote em várias partes e envie apenas o necessário no início.

## Medir

O Lighthouse exibe uma auditoria com falha quando uma quantidade significativa de tempo é levada para executar todo o JavaScript em uma página.

{% Img src="image/admin/p0Ahh3pzXog3jPdDp6La.png", alt="Uma auditoria do Lighthouse com falha mostrando os scripts que demoram muito para serem executados.", width="797", height="100" %}

Divida o pacote JavaScript para enviar apenas o código necessário para a rota inicial quando o usuário carregar um aplicativo. Isso minimiza a quantidade de script que precisa ser analisado e compilado, o que resulta em tempos de carregamento de página mais rápidos.

Empacotadores de módulos populares como [webpack](https://webpack.js.org/guides/code-splitting/), [Parcel](https://parceljs.org/code_splitting.html) e [Rollup](https://rollupjs.org/guide/en#dynamic-import) permitem que você divida seus pacotes usando [importações dinâmicas](https://v8.dev/features/dynamic-import). Por exemplo, considere o seguinte fragmento de código que mostra um exemplo de um `someFunction` que é acionado quando um formulário é enviado.

```js
import moduleA from "library";

form.addEventListener("submit", e => {
  e.preventDefault();
  someFunction();
});

const someFunction = () => {
  // usa moduleA
}
```

Aqui, `someFunction` usa um módulo importado de uma biblioteca particular. Se este módulo não estiver sendo usado em outro lugar, o bloco de código pode ser modificado para usar uma importação dinâmica para buscá-lo apenas quando o formulário for enviado pelo usuário.

```js/2-5
form.addEventListener("submit", e => {
  e.preventDefault();
  import('library.moduleA')
    .then(module => module.default) // usando a exportação padrão
    .then(someFunction())
    .catch(handleError());
});

const someFunction = () => {
    // usa o moduleA
}
```

O código que compõe o módulo não é incluído no pacote inicial e agora é **carregado lentamente** ou fornecido ao usuário apenas quando necessário após o envio do formulário. Para melhorar ainda mais o desempenho da página, [pré-carregue os blocos críticos para priorizá-los e buscá-los mais cedo](/preload-critical-assets) .

Embora o fragmento de código anterior seja um exemplo simples, o carregamento lento de dependências de terceiros não é um padrão comum em aplicativos maiores. Normalmente, as dependências de terceiros são divididas em um pacote de fornecedor separado que pode ser armazenado em cache, uma vez que não são atualizados com tanta frequência. Você pode ler mais sobre como o [**SplitChunksPlugin**](https://webpack.js.org/plugins/split-chunks-plugin/) pode ajudar você a fazer isso.

A divisão na rota ou no nível do componente ao usar uma estrutura do lado do cliente é uma abordagem mais simples para o carregamento lento de diferentes partes de seu aplicativo. Muitos frameworks populares que usam webpack fornecem abstrações para tornar o carregamento lento mais fácil do que você mesmo mergulhar nas configurações.
