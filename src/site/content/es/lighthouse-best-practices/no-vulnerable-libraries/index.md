---
layout: post
title: Incluye bibliotecas JavaScript de front-end con vulnerabilidades de seguridad conocidas
description: |2-

  Obtenga información sobre cómo hacer que su página sea más segura al reemplazar las bibliotecas de JavaScript que tienen vulnerabilidades conocidas.
web_lighthouse:
  - bibliotecas-no-vulnerables
date: 2019-05-02
updated: 2020-06-04
---

Los intrusos tienen rastreadores web automatizados que pueden escanear su sitio en busca de vulnerabilidades de seguridad conocidas. Cuando el rastreador web detecta una vulnerabilidad, alerta al intruso. A partir de ahí, el intruso solo necesita descubrir cómo explotar la vulnerabilidad en su sitio.

## Cómo falla esta auditoría de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las bibliotecas JavaScript de front-end con vulnerabilidades de seguridad conocidas:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7xN0qVP92s6g1XrNru1f.png", alt="Auditoría Lighthouse que muestra las bibliotecas JavaScript de front-end con vulnerabilidades de seguridad conocidas utilizadas por la página", width="800", height="190" %}</figure>

Para detectar bibliotecas vulnerables, Lighthouse:

- Ejecuta el [detector de bibliotecas para Chrome](https://www.npmjs.com/package/js-library-detector).
- Compara la lista de bibliotecas detectadas con la [base de datos de vulnerabilidades de Snyk](https://snyk.io/vuln?packageManager=all).

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Deje de usar bibliotecas JavaScript inseguras

Deje de usar cada una de las bibliotecas que Lighthouse marca. Si la biblioteca ha lanzado una versión más reciente que corrige la vulnerabilidad, actualice a esa versión. Si la biblioteca no ha lanzado una nueva versión o ya no se mantiene, considere usar una biblioteca diferente.

Haga clic en los enlaces de la columna **Versión de la biblioteca** de su informe para obtener más información sobre las vulnerabilidades de cada biblioteca.

## Recursos

- [Código fuente para la auditoría **Incluye bibliotecas JavaScript de front-end con** con vulnerabilidades de seguridad conocidas](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-vulnerable-libraries.js)
- [Base de datos de vulnerabilidades Snyk](https://snyk.io/vuln?packageManager=all)
