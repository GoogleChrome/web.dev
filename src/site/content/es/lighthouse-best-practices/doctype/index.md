---
layout: post
title: La página carece del doctype HTML, por lo que se activa el modo quirks
description: Aprenda a asegurarse de que su página no activa el modo "quirks" en los navegadores más antiguos.
web_lighthouse:
  - doctype
date: 2019-05-02
updated: 2019-08-28
---

Especificar un doctype evita que el navegador cambie al [modo quirks](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode), lo que puede ocasionar que su página se [renderice de forma inesperada](https://quirks.spec.whatwg.org/#css).

## Cómo puede fallar la auditoría del doctype de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) etiqueta las páginas sin la declaración `<!DOCTYPE html>`:

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l6IEjHdtgCa45QimENjb.png", alt="En la auditoría de Lighthouse se muestra que falta el doctype", width="800", height="76" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Cómo agregar una declaración doctype

Agregue la declaración `<!DOCTYPE html>` al inicio de su documento HTML:

```html
<!DOCTYPE html>
<html lang="en">
…
```

Para obtener más información, consulte la página [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype) de MDN.

## Recursos

- [El código fuente de la **página carece del doctype HTML, por lo que se activó el modo quirks** de la auditoría](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)
- [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype)
- [Modo Quirks y modo Standards](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
