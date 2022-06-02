---
layout: post
title: Identifique JavaScript lento de terceros
subhead: Potencie sus habilidades de detective de desempeño con Lighthouse y Chrome DevTools.
authors:
  - mihajlija
date: 2019-08-14
hero: image/admin/8ZJRM6xxTNs8wBPph7ZO.jpg
alt: Inspección de una computadora portátil con una lupa.
description: |2

  Aprenda a utilizar Lighthouse y Chrome DevTools para identificar recursos lentos de terceros.
tags:
  - performance
---

Como desarrollador, a menudo no tiene control sobre [qué scripts de terceros](/third-party-javascript/#network) carga su sitio. Antes de que pueda optimizar el contenido de terceros, debe hacer un trabajo de detective para averiguar qué hace que su sitio sea lento. 🕵️

En este post, aprenderá a usar [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) y [Chrome DevTools](https://developer.chrome.com/docs/devtools/) para identificar recursos lentos de terceros. El post le irá mostrando técnicas cada vez más sólidas que se utilizan mejor combinadas.

## Si solo tiene 5 minutos

La [auditoría de rendimiento](/lighthouse-performance) de Lighthouse le ayuda a descubrir oportunidades para acelerar la carga de páginas. Es probable que aparezcan scripts lentos de terceros en la sección **Diagnósticos** en las auditorías **Reducir el tiempo de ejecución de JavaScript** y **Evitar enormes cargas útiles de red**.

Para ejecutar una auditoría:

{% Instruction 'devtools-lighthouse', 'ol' %}

1. Haga clic en **Móvil**.
2. Seleccione la casilla de verificación **Rendimiento**. (Puede deseleccionar el resto de las casillas de verificación en la sección Auditorías).
3. Haga clic en **3G rápida simulada, Alentamiento del CPU 4x**.
4. Seleccione la casilla de verificación **Borrar almacenamiento**.
5. Haga clic en **Ejecutar auditorías**.

{% Img src="image/admin/XLNFxdEOc7739bcIwERq.png", alt="Captura de pantalla del panel Auditorías de DevTools de Chrome", width="800", height="1068" %}

### Uso de terceros

La auditoría de **uso de de terceros** de Lighthouse muestra una lista de los proveedores de terceros que utiliza una página. Esta descripción general puede ayudarle a comprender mejor el panorama general e identificar el código de terceros redundante. La auditoría está disponible en la [extensión Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en) y pronto se agregará a DevTools en Chrome 77.

<figure>{% Img src="image/admin/4JXHK0FkgJIfKED16BnF.png", alt="Captura de pantalla que muestra que se encontraron 51 usos de terceros y una lista de startups imaginarias.", width="728", height="646" %}<figcaption> Nombres de proveedores de terceros generados con el <a href="http://tiffzhang.com/startup/?s=641553836036">generador de startups</a>. Cualquier similitud con startups reales, vivas o muertas, es pura coincidencia.</figcaption></figure>

### Reducir el tiempo de ejecución de JavaScript

La auditoría [Reducir el tiempo de ejecución de JavaScript](/bootup-time) de Lighthouse destaca los scripts que tardan mucho en analizarse, compilarse o evaluarse. Seleccione la casilla de verificación **Mostrar recursos de terceros** para descubrir scripts de terceros que usen intensivamente la CPU.

{% Img src="image/admin/O7vN1En6dtbL3Q8TbufC.png", alt="Captura de pantalla que muestra que la casilla de verificación 'Mostrar recursos de terceros' está marcada.", width="800", height="981" %}

### Evite cargas útiles de red enormes

La auditoría [Evitar enormes cargas útiles de red](/total-byte-weight) de Lighthouse identifica las solicitudes de red, incluidas las de terceros, que pueden ralentizar el tiempo de carga de la página. La auditoría falla cuando su carga útil de red supera los 4,000 KB.

{% Img src="image/admin/9Pnoz73MLeNzooUQLuam.png", alt="Captura de pantalla de la auditoría de Chrome DevTools 'Evitar enormes cargas útiles de red'", width="799", height="631" %}

## Bloquear solicitudes de red en Chrome DevTools

El [bloqueo de solicitudes de red](https://developer.chrome.com/docs/devtools/network/#block) de Chrome DevTools le permite ver cómo se comporta su página cuando un script, hoja de estilo u otro recurso en particular no está disponible. Después de identificar los scripts de terceros que sospecha que afectan el rendimiento, mida cómo cambia el tiempo de carga bloqueando las solicitudes a esos scripts.

Para habilitar el bloqueo de solicitudes: {% Instruction 'devtools-network', 'ol' %}

1. Haga clic con el botón derecho en cualquier solicitud en el panel **Red**.
2. Seleccione **Bloquear URL de solicitud**.

{% Img src="image/admin/UbedvjrtP9si1l0X2QVA.png", alt="Una captura de pantalla del menú contextual en el panel de rendimiento de Chrome DevTools. La opción 'Bloquear URL de solicitud' está resaltada.", width="800", height="529" %}

Aparecerá una **pestaña de bloqueo de solicitudes** en el cajón de DevTools. Puede administrar qué solicitudes se han bloqueado allí.

Para medir el impacto de los scripts de terceros:

1. Mida cuánto tiempo tarda su página en cargarse utilizando el panel **Red**. Para emular las condiciones del mundo real, active la [limitación de red](https://developer.chrome.com/docs/devtools/network/#throttle) y la [limitación de CPU](https://developers.google.com/web/updates/2017/07/devtools-release-notes#throttling). (En conexiones más rápidas y hardware de escritorio, el impacto de scripts tardados puede no ser tan representativo como lo sería en un teléfono móvil).
2. Bloquee las URL o los dominios responsables de los scripts de terceros que crea que son un problema.
3. Vuelva a cargar la página y mida de nuevo el tiempo que tarda en cargarse sin los scripts de terceros bloqueados.

Con suerte, debería ver una mejora en la velocidad, pero el bloqueo ocasional de scripts de terceros podría no tener el efecto esperado. Si ese es el caso, reduzca la lista de URL bloqueadas hasta que aísle la que está causando la lentitud.

Tenga en cuenta que realizar tres o más corridas de medición y observar los valores promedio probablemente producirá resultados más estables. Dado que el contenido de terceros ocasionalmente puede atraer diferentes recursos por carga de página, este enfoque puede brindarle una estimación más realista. [DevTools ahora admite múltiples registros](https://twitter.com/ChromeDevTools/status/963820146388221952) en el panel  **Rendimiento**, lo que facilita las cosas.
