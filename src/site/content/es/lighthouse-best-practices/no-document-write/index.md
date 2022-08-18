---
layout: post
title: Usos de document.write()
description: Aprenda a acelerar el tiempo de carga de su página con el fin de evitar document.write().
web_lighthouse:
  - no utilice document.write
date: 2019-05-02
updated: 2020-06-04
---

El uso de [`document.write()`](https://developer.mozilla.org/docs/Web/API/Document/write) puede retrasar la visualización del contenido de la página en decenas de segundos y es especialmente problemático para los usuarios con conexiones lentas. Por lo tanto, Chrome bloquea la ejecución de `document.write()` en muchos casos, lo que significa que no se puede confiar en ella.

En la consola de Chrome DevTools podrá ver el siguiente mensaje cuando utilice `document.write()`:

```text
[Violation] Avoid using document.write().
```

En la consola de Firefox DevTools podrás ver este mensaje:

```text
An unbalanced tree was written using document.write() causing
data from the network to be reparsed.
```

## Cómo falla la auditoría de Lighthouse en `document.write()`

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las llamadas a `document.write()` que no fueron bloqueadas por Chrome:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5YbEaKuzO2kzulClv1qj.png", alt="La auditoría de Lighthouse muestra el uso de document.write", width="800", height="213" %}</figure>

Para los usos más problemáticos, Chrome bloqueará las llamadas a `document.write()` o emitirá una advertencia de la consola sobre ellas, dependiendo de la velocidad de conexión del usuario. En cualquier caso, las llamadas afectadas aparecerán en la consola de DevTools. Consulte el artículo de Google <a href="https://developers.google.com/web/updates/2016/08/removing-document-write" data-md-type="link">Intervención contra `document.write()`</a> para obtener más información.

Lighthouse informa de cualquier llamada pendiente a `document.write()` porque afecta negativamente al rendimiento independientemente de cómo se utilice, además de las mejores alternativas.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Evite `document.write()`

Elimine todos los usos de `document.write()` en su código. En caso de que lo utilice para introducir scripts de terceros, como alternativa intente utilizar una [carga asíncrona](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript).

Si el código de terceros utiliza `document.write()`, solicite al proveedor que admita la carga asíncrona.

## Recursos

- [Código fuente para la auditoría de **Usos de `document.write()`**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/no-document-write.js)
- [Cómo intervenir contra `document.write()`](https://developer.chrome.com/blog/removing-document-write/)
- [Bloqueo del analizador sintáctico frente a JavaScript asíncrono](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript)
- [Análisis especulativo](https://developer.mozilla.org/docs/Glossary/speculative_parsing)
