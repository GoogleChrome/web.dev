---
layout: post
title: Os erros do navegador foram registrados no console
description: |2

  Aprenda como identificar e corrigir erros do navegador.
web_lighthouse:
  - erros no console
date: 2019-05-02
updated: 2019-08-28
---

A maioria dos navegadores vem com ferramentas de desenvolvedor integradas. Essas ferramentas de desenvolvedor geralmente incluem um [console](https://developer.chrome.com/docs/devtools/console/) . O console fornece informações sobre a página em execução no momento.

As mensagens registradas no console vêm dos desenvolvedores da web que criaram a página ou do próprio navegador. Todas as mensagens do console têm um nível de gravidade: `Verbose`, `Info`, `Warning` ou `Error`. Uma `Error` significa que há um problema em sua página que você precisa resolver.

## Como a auditoria do Lighthouse de erro de navegador falha

[O Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza todos os erros do navegador registrados no console:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AjfKRZm8E4ZUi2QvQtL3.png", alt="Auditoria do Lighthouse mostrando erros do navegador no console", width="800", height="247" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Como corrigir erros do navegador

Corrija cada erro do navegador que o Lighthouse relata para garantir que sua página seja executada conforme o esperado para todos os seus usuários.

O Chrome DevTools inclui algumas ferramentas para ajudá-lo a rastrear a causa dos erros:

- Abaixo do texto de cada erro, o Console do DevTools mostra a [pilha de chamadas](https://developer.mozilla.org/docs/Glossary/Call_stack) que causou a execução do código problemático.
- Um link no canto superior direito de cada erro mostra o código que causou o erro.

Por exemplo, esta captura de tela mostra uma página com dois erros:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KBP4iOO12CqHURgmjxaY.png", alt="Um exemplo de erros no Chrome DevTools Console", width="800", height="505" %}</figure>

No exemplo acima, o primeiro erro vem de um desenvolvedor da Web por meio de uma chamada para [`console.error()`](https://developer.chrome.com/docs/devtools/console/api/#error). O segundo erro vem do navegador e indica que não existe uma variável usada em um dos scripts da página.

Abaixo do texto de cada erro, o DevTools Console indica a pilha de chamadas na qual o erro aparece. Por exemplo, para o primeiro erro, o Console indica que uma `(anonymous)` chamou a `init`, que chamou a função `doStuff` Clicar no `pen.js:9` no canto superior direito desse erro mostra o código relevante.

Revisar o código relevante para cada erro dessa forma pode ajudá-lo a identificar e resolver possíveis problemas.

Se você não consegue descobrir a causa de um erro, tente inserir o texto do erro em um mecanismo de pesquisa. Se você não conseguir encontrar soluções para o seu problema, tente fazer uma pergunta no [Stack Overflow](https://stackoverflow.com).

Se você não puder corrigir um erro, considere envolvê-lo em uma [`try…catch`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch) para indicar explicitamente no código que você está ciente do problema. Você também pode usar o `catch` para lidar com o erro de forma mais elegante.

## Recursos

- [O código-fonte dos **erros do navegador foi registrado na** auditoria do console](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/errors-in-console.js)
- [Visão geral do console](https://developer.chrome.com/docs/devtools/console/)
- [Stack Overflow](https://stackoverflow.com/)
- [tente … pegar](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch)
