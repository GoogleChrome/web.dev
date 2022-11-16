---
layout: post
title: Usa document.write ()
description: |2

  Aprenda como acelerar o tempo de carregamento de sua página evitando document.write ().
web_lighthouse:
  - no-document-write
date: 2019-05-02
updated: 2020-06-04
---

O uso de [`document.write()`](https://developer.mozilla.org/docs/Web/API/Document/write) pode atrasar a exibição do conteúdo da página em dezenas de segundos e é particularmente problemático para usuários em conexões lentas. O Chrome, portanto, bloqueia a execução de `document.write()` em muitos casos, o que significa que você não pode confiar nele.

No Chrome DevTools Console, você verá a seguinte mensagem ao usar `document.write()` :

```text
[Violation] Avoid using document.write().
```

No Firefox DevTools Console, você verá esta mensagem:

```text
An unbalanced tree was written using document.write() causing
data from the network to be reparsed.
```

## Como a auditoria Lighthouse sobre `document.write()` falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza solicitações para `document.write()` que não foram bloqueadas pelo Chrome:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5YbEaKuzO2kzulClv1qj.png", alt = "Auditoria do Lighthouse mostrando o uso de document.write", width = "800", height = "213"%}</figure>

Para os usos mais problemáticos, o Chrome bloqueará solicitações para `document.write()` ou emitirá um aviso de console sobre elas, dependendo da velocidade de conexão do usuário. De qualquer forma, as solicitações afetadas aparecem no console do DevTools. Consulte o artigo <a href="https://developers.google.com/web/updates/2016/08/removing-document-write" data-md-type="link">Intervenção contra `document.write()`</a> para obter mais informações.

O Lighthouse relata todas as solicitações restantes para `document.write()` porque ele afeta negativamente o desempenho independentemente de como é usado, e há alternativas melhores.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Evite `document.write()`

Remova todos os usos de `document.write()` em seu código. Se estiver sendo usado para injetar scripts de terceiros, tente usar o [carregamento assíncrono](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript) .

Se o código de terceiros estiver usando `document.write()` , peça ao fornecedor para oferecer suporte ao carregamento assíncrono.

## Recursos

- [Código-fonte para auditoria de **Usos de `document.write()`**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/no-document-write.js)
- [Intervenção contra `document.write()`](https://developer.chrome.com/blog/removing-document-write/)
- [Bloqueio do analisador versus JavaScript assíncrono](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript)
- [Análise especulativa](https://developer.mozilla.org/docs/Glossary/speculative_parsing)
