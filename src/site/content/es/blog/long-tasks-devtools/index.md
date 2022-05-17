---
title: "¿Las tareas largas de JavaScript están retrasando su Time to Interactive?"
subhead: Aprenda a diagnosticar trabajos costosos que impiden la interacción del usuario.
authors:
  - addyosmani
date: 2019-05-29
hero: image/admin/QvWXvBSXsRKtpGOcakb5.jpg
alt: Un reloj en el que se vierte arena en su interior
description: Las tareas largas pueden mantener el hilo principal ocupado, retrasando la interacción del usuario. Chrome DevTools ahora puede visualizar las tareas largas, lo que facilita la visualización de las tareas que deben optimizarse.
tags:
  - blog
  - performance
---

**tl; dr: Las tareas largas pueden mantener el hilo principal ocupado, retrasando la interacción del usuario. Chrome DevTools ahora puede visualizar las tareas largas, lo que facilita la visualización de las tareas que deben optimizarse.**

Si utiliza Lighthouse para auditar sus páginas, es posible que esté familiarizado con el [Time to Interactive](/tti/), una métrica que representa el momento en que los usuarios pueden interactuar con su página y obtener una respuesta. Pero, ¿sabía que las tareas largas (JavaScript) pueden contribuir en gran medida a un TTI deficiente?

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4XCzYI9gaUJDTTJu9JxH.png", alt="Time to Interactive mostrado en el informe de Lighthouse", width="800", height="169" %}

## ¿Qué son las tareas largas?

Una [Tarea larga](https://developer.mozilla.org/docs/Web/API/Long_Tasks_API) es un código de JavaScript que monopoliza el hilo principal durante largos periodos de tiempo, lo que causa que la interfaz de usuario se "congele".

Mientras se carga una página web, las tareas largas pueden ocupar el hilo principal y hacer que la página no responda a la entrada del usuario, incluso si parece estar lista. Los clics y los toques con frecuencia no funcionan porque los asistentes de eventos, los controladores de clics, etc., aún no se han adjuntado.

Las tareas largas que consumen muchos recursos del CPU ocurren debido a un trabajo complejo que toma más de 50ms. ¿Por qué 50ms? [El modelo RAIL](/rail/) sugiere que procese los eventos de entrada del usuario en [50ms](/rail/#response:-process-events-in-under-50ms) para asegurar una respuesta visible en 100ms. Si no lo hace, la conexión entre la acción y la reacción se interrumpe.

## ¿Hay tareas largas en mi página que podrían retrasar la interactividad?

Hasta ahora, era necesario buscar manualmente los "bloques amarillos largos" del script de más de 50ms de duración en [Chrome DevTools](https://developer.chrome.com/docs/devtools/) o utilizar la [API de tareas largas](https://calendar.perfplanet.com/2017/tracking-cpu-with-long-tasks-api/) para averiguar qué tareas estaban retrasando la interactividad. Esto podría ser un poco engorroso.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mSKnMWBcEBHWkXzTGCAH.png", alt="Una captura de pantalla del panel de rendimiento de  DevTools muestra las diferencias entre las tareas cortas y las largas", width="800", height="450" %}

Para facilitar el flujo de trabajo en la auditoría de rendimiento, [DevTools ahora visualiza las tareas largas](https://developers.google.com/web/updates/2019/03/devtools#longtasks). Las tareas (que se muestran en gris) tienen banderas rojas si son tareas largas.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fyDPyO4XbSINMVpSSY9E.png", alt="DevTools visualiza las tareas largas como barras grises en el panel de rendimiento con una bandera roja para las tareas largas", width="800", height="450" %}

- Registre un seguimiento en el [panel de rendimiento](https://developer.chrome.com/docs/devtools/evaluate-performance/) al cargar una página web.
- Busque una bandera roja en la visualización del hilo principal. Debería ver que las tareas ahora son grises ("Tarea").
- Si desliza el cursor sobre una barra, sabrá la duración de la tarea y si se considera como "larga".

## ¿Cuál es la causa de que mis tareas sean largas?

Para descubrir qué está provocando una tarea larga, seleccione la barra de **tareas gris.** En el cajón de abajo, seleccione De **abajo hacia arriba** y **Agrupar por actividad** . Esto le permite ver qué actividades contribuyeron más (en total) a la tarea que tardó tanto en completarse. A continuación, parece ser un conjunto costoso de consultas DOM.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7irBiePkFJRmzKMlcJUV.png", alt="Seleccionar una tarea larga (etiquetada como 'Tarea') en DevTools nos permitirá analizar detalladamente las actividades relacionadas con ella.", width="800", height="450" %}

## ¿Cuáles son las formas más comunes de optimizar las tareas largas?

Los scripts grandes normalmente son la causa principal de las tareas largas, así que considere [dividirlos](/reduce-javascript-payloads-with-code-splitting). Asimismo, eche un vistazo a los scripts de terceros, ya que sus tareas largas pueden retrasar el contenido principal para que sea interactivo.

Divida todo su trabajo en pequeños fragmentos (que se ejecuten en &lt; 50ms) y ejecute estos fragmentos en el lugar y momento adecuados, el lugar adecuado puede estar incluso fuera del hilo principal, en un worker. [Idle Until Urgent](https://philipwalton.com/articles/idle-until-urgent/) de Phil Walton es una buena lectura sobre este tema.

Mantenga sus páginas adaptables. Si minimiza las tareas largas, se asegurará de que sus usuarios tengan una experiencia agradable cuando visiten su sitio. Para obtener más información sobre las tareas largas, consulte [Métricas de rendimiento centradas en el usuario](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_long_tasks).
