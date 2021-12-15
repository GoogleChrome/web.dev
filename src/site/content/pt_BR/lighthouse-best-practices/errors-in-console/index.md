---
layout: post-old
title: Os erros do navegador foram registrados no console
description: |2

  Aprenda como identificar e corrigir erros do navegador.
web_lighthouse:
  - erros no console
date: '2019-05-02'
updated: '2019-08-28'
---

A maioria dos navegadores vem com ferramentas de desenvolvedor integradas. Essas ferramentas de desenvolvedor geralmente incluem um [console](https://developers.google.com/web/tools/chrome-devtools/console/) . O console fornece informações sobre a página em execução no momento.

Messages logged in the console come from either the web developers who built the page or the browser itself. All console messages have a severity level: `Verbose`, `Info`, `Warning`, or `Error`. An `Error` message means there's a problem on your page that you need to resolve.

## How the Lighthouse browser error audit fails

[O Lighthouse](https://developers.google.com/web/tools/lighthouse/) sinaliza todos os erros do navegador registrados no console:

<figure class="w-figure">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AjfKRZm8E4ZUi2QvQtL3.png", alt="Lighthouse audit showing browser errors in the console", width="800", height="247", class="w-screenshot" %} </figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Como corrigir erros do navegador

Corrija cada erro do navegador que o Lighthouse relata para garantir que sua página seja executada conforme o esperado para todos os seus usuários.

O Chrome DevTools inclui algumas ferramentas para ajudá-lo a rastrear a causa dos erros:

- Abaixo do texto de cada erro, o Console do DevTools mostra a [pilha de chamadas](https://developer.mozilla.org/docs/Glossary/Call_stack) que causou a execução do código problemático.
- Um link no canto superior direito de cada erro mostra o código que causou o erro.

Por exemplo, esta captura de tela mostra uma página com dois erros:

<figure class="w-figure">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KBP4iOO12CqHURgmjxaY.png", alt="An example of errors in the Chrome DevTools Console", width="800", height="505", class="w-screenshot w-screenshot--filled" %} </figure>

In the example above, the first error comes from a web developer via a call to [`console.error()`](https://developer.chrome.com/docs/devtools/console/api/#error). The second error comes from the browser and indicates that a variable used in one of the page's scripts does not exist.

Below the text of each error, the DevTools Console indicates the call stack in which the error appears. For example, for the first error the Console indicates that an `(anonymous)` function called the `init` function, which called the `doStuff` function. Clicking the `pen.js:9` link in the top-right of that error shows you the relevant code.

Revisar o código relevante para cada erro dessa forma pode ajudá-lo a identificar e resolver possíveis problemas.

If you can't figure out the cause of an error, try entering the error text into a search engine. If you can't find solutions to your problem, try asking a question on [Stack Overflow](https://stackoverflow.com).

Se você não puder corrigir um erro, considere envolvê-lo em uma [`try…catch`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch) para indicar explicitamente no código que você está ciente do problema. Você também pode usar o `catch` para lidar com o erro de forma mais elegante.

## Recursos

- [O código-fonte dos **erros do navegador foi registrado na** auditoria do console](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/errors-in-console.js)
- [Visão geral do console](https://developers.google.com/web/tools/chrome-devtools/console/)
- [Stack Overflow](https://stackoverflow.com/)
- [tente ... pegar](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch)
