---
title: Los elementos `<frame>` o `<iframe>` no tienen título
layout: post
description: |2-

  Aprende a asegurarte de que las tecnologías de asistencia puedan anunciar el contenido del frame (marco, en español) en

  tu página web correctamente dando títulos a todos los elementos del frame.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - título-frame
---

Los usuarios de lectores de pantalla y otras tecnologías de asistencia confían en los títulos de los frames para describir su contenido. Navegar a través de frames e iframes (inline frame o marco incorporado en español) puede volverse rápidamente difícil y confuso para los usuarios de tecnología de asistencia si los frames no están marcados con un atributo de título.

## Cómo falla la auditoría del título del frame de Lighthouse

Lighthouse señala los elementos `<frame>` e `<iframe>` que no tienen título:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vlHxWKrB3ESjPfmLbuwL.png", alt="Lighthouse audit showing frame or iframe doesn't have a title element", width="800", height="185" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo agregar títulos a frames e iframes

Proporciona atricutos de `title` únicos y descriptivos para todos los elementos de `frame` e `iframe`

Además, la mejor práctica es darle al documento adjunto un elemento de título con contenido idéntico al atributo de título. Por ejemplo:

```html
<iframe title="My Daily Marathon Tracker" src="https://www.mydailymarathontracker.com/"></iframe>
```

## Consejos para crear títulos de frames descriptivos

- Como se mencionó anteriormente, asigna al documento adjunto un elemento de título con contenido idéntico al atributo de título.
- Reemplaza los títulos de marcadores de posición como "frame sin título" con una frase más apropiada.
- Haz que cada título sea único. No dupliques títulos, incluso si son similares.

Obtenga más información en [Escriba títulos descriptivos, descripciones y texto de enlace para cada página](/write-descriptive-text).

## Recursos

- [El código fuente de **los elementos `<frame>` o `<iframe>` no tiene una auditoría de título**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/frame-title.js)
- [Etiquetar documentos y frames](/labels-and-text-alternatives#label-documents-and-frames)
- [Los frames deben tener el atributo de título (Universidad de Deque)](https://dequeuniversity.com/rules/axe/3.3/frame-title)
