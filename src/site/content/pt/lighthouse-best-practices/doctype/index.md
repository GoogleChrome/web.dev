---
layout: post
title: A página não tem o doctype HTML, acionando assim o modo quirks
description: |2-

  Saiba como se certificar de que sua página não acione o modo quirks em navegadores mais antigos.
web_lighthouse:
  - doctype
date: 2019-05-02
updated: 2019-08-28
---

Especificar um doctype evita que o navegador mude para o [modo quirks](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode), o que poderia fazer sua página ser [renderizada de maneiras inesperadas](https://quirks.spec.whatwg.org/#css).

## Como a auditoria de doctype do Lighthouse falha

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sinaliza as páginas sem a declaração `<!DOCTYPE html>`

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l6IEjHdtgCa45QimENjb.png", alt="Auditoria do Lighthouse mostrando ausência do doctype", width="800", height="76" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Como adicionar uma declaração de doctype

Adicione a marcação `<!DOCTYPE html>` ao início do documento HTML:

```html
<!DOCTYPE html>
<html lang="en">
…
```

Consulte  mais informações na página [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype) do MDN.

## Recursos

- [Código-fonte da auditoria **A página não tem o doctype HTML, acionando assim o modo quirks**](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)
- [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype)
- [Modo quirks e modo standards](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
