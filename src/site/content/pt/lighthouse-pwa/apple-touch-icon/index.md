---
layout: post
title: O apple-touch-icon fornecido não é válido
description: Aprenda a especificar o ícone exibido pelo Progressive Web App na tela inicial do iOS.
web_lighthouse:
  - apple-touch-icon
codelabs: codelab-apple-touch-icon
date: 2019-08-27
updated: 2019-09-19
---

Quando os usuários do Safari do iOS adicionam [Progressive Web Apps (PWAs)](/discover-installable) à tela inicial, o ícone exibido é chamado de *ícone Apple Touch* (Apple touch icon). É possível especificar o ícone usado pelo app com a inclusão de uma tag `<link rel="apple-touch-icon" href="/example.png">` no `<head>` da página. Se a página não apresentar essa tag de link, o iOS faz uma captura de tela do conteúdo para gerar um ícone. Em outras palavras, instruir o iOS a fazer o download de um ícone resulta em uma experiência do usuário mais otimizada.

## Como a auditoria de ícone Apple Touch do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza as páginas sem uma tag `<link rel="apple-touch-icon" href="/example.png">` em `<head>`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mXGs4XSr4DXMxLk536wo.png", alt="O apple-touch-icon fornecido não é válido", width="800", height="95" %}</figure>

{% Aside %} O link `rel="apple-touch-icon-precomposed"` é aprovado pela auditoria, mas está obsoleto desde o iOS 7. Em vez disso, use `rel="apple-touch-icon"`. {% endAside %}

O Lighthouse não verifica se o ícone realmente existe ou se o tamanho dele está correto.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Como adicionar um ícone Apple Touch

1. Adicione `<link rel="apple-touch-icon" href="/example.png">` ao `<head>` da sua página:

    ```html/4
    <!DOCTYPE html>
    <html lang="en">
      <head>
        …
        <link rel="apple-touch-icon" href="/example.png">
        …
      </head>
      …
    ```

2. Substitua `/example.png` pelo caminho real do ícone.

{% Aside 'codelab' %} Confira o codelab [Como adicionar um ícone Apple Touch ao Progressive Web App](/codelab-apple-touch-icon) para ver como o ícone oferece uma experiência do usuário mais otimizada. {% endAside %}

Para fornecer uma boa experiência do usuário, verifique o seguinte:

- O ícone tem 180 x 180 ou 192 x 192 pixels.
- O caminho especificado do ícone é válido.
- O plano de fundo do ícone não é transparente.

## Recursos

- [Código-fonte da auditoria **O `apple-touch-icon` fornecido não é valido**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/apple-touch-icon.js)
- [Veja os critérios para a instalação](/install-criteria)
- <a href="https://webhint.io/docs/user-guide/hints/hint-apple-touch-icons/" rel="noreferrer">Use o ícone Apple Touch</a>
