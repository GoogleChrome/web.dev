---
layout: post
title: Aplicar la carga instantánea con el patrón PRPL
authors:
  - houssein
description: PRPL es un acrónimo que describe un patrón utilizado para hacer que las páginas web se carguen y se vuelvan interactivas más rápido. En esta guía, aprenderá la manera en que cada una de estas técnicas encajan pero aún se pueden usar de forma independiente para lograr resultados de rendimiento alto.
date: 2018-11-05
tags:
  - performance
---

PRPL es un acrónimo que describe un patrón utilizado para hacer que las páginas web se carguen y se vuelvan interactivas, más rápido:

- **Envío automático** (o **precarga**) de los recursos más importantes.
- **Renderizar** la ruta inicial lo antes posible.
- **Guardar en caché** los activos restantes.
- **Carga diferida** de otras rutas y activos no críticos.

En esta guía, aprenderá cómo encajan cada una de estas técnicas, pero aún se pueden usar de forma independiente para lograr resultados de rendimiento.

## Audite su página con Lighthouse

Ejecute Lighthouse para identificar oportunidades de mejora alineadas con las técnicas de PRPL:

{% Instruction 'devtools-lighthouse', 'ol' %}

1. Seleccione las casillas de verificación **Rendimiento** y **Aplicación web progresiva.**
2. Haga clic en **Ejecutar auditorías** para generar un informe.

Para obtener más información, consulte [Descubra oportunidades de rendimiento con Lighthouse](/discover-performance-opportunities-with-lighthouse).

## Precargar los recursos críticos

Lighthouse muestra la siguiente auditoría fallida si un determinado recurso se analiza y se recupera tarde:

{% Img src="image/admin/tgcMfl3HJLmdoERFn7Ji.png", alt="Lighthouse: Auditoría de de precarga de solicitudes clave", width="745", height="97" %}

La [**precarga**](https://developer.mozilla.org/docs/Web/HTML/Preloading_content) es una solicitud de recuperación declarativa que le indica al navegador que solicite un recurso lo antes posible. Puede precargar los recursos críticos si agrega una etiqueta `<link>` con `rel="preload"` al encabezado de su documento HTML:

```html
<link rel="preload" as="style" href="css/style.css">
```

El navegador establece un nivel de prioridad más apropiado para el recurso con el fin de intentar descargarlo antes sin retrasar el evento `window.onload`.

Para obtener más información sobre la precarga de recursos críticos, consulte la guía [Precarga de activos críticos.](/preload-critical-assets)

## Renderizar la ruta inicial lo antes posible

Lighthouse proporciona una advertencia si hay recursos que retrasan el [**First Paint (Primer despliegue)**](/user-centric-performance-metrics/#important-metrics-to-measure), el momento en que su sitio muestra los píxeles en la pantalla:

{% Img src="image/admin/gvj0jlCYbMdpLNtHu0Ji.png", alt="Lighthouse: Auditoría para eliminar los recursos que bloquean el renderizado", width="800", height="111" %}

Para mejorar el Primer despliegue, Lighthouse recomienda insertar JavaScript crítico y diferir el resto mediante el uso de [`async`](/critical-rendering-path-adding-interactivity-with-javascript/), así como también incluir CSS crítico usado en la mitad superior de la página. Esto mejora el rendimiento al eliminar los viajes de ida y vuelta al servidor para buscar activos que bloquean el renderizado. Sin embargo, el código en línea es más difícil de mantener desde una perspectiva de desarrollo y el navegador no puede almacenarlo en caché por separado.

Otro enfoque para mejorar el Primer despliegue es **renderizar en el lado del servidor** el HTML inicial de su página. Esto le muestra el contenido inmediatamente al usuario mientras los scripts aún se están recuperando, analizando y ejecutando. Sin embargo, esto puede aumentar la carga útil del archivo HTML de manera significativa, lo que puede dañar [**Time to Interactive (Tiempo para volverse interactiva)**](/tti/) o el tiempo que le toma a su aplicación volverse interactiva y responder a la entrada del usuario.

No existe una única solución correcta para reducir el Primer despliegue en su aplicación, y solo debe considerar los estilos de alineación y el renderizado del lado del servidor si los beneficios superan los compromisos para su aplicación. Puede obtener más información sobre estos dos conceptos en los siguientes recursos.

- [Optimizar la entrega de CSS](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)
- [¿Qué es el renderizado del lado del servidor?](https://www.youtube.com/watch?v=GQzn7XRdzxY)

<figure data-float="right">{% Img src="image/admin/xv1f7ZLKeBZD83Wcw6pd.png", alt="Solicitudes/respuestas con service worker", width="800", height="1224" %}</figure>

## Activos de caché previa

Al actuar como un proxy, los **service workers** pueden obtener activos directamente del caché en lugar de hacerlo desde el servidor en visitas repetidas. Esto no solo les permite a los usuarios usar su aplicación cuando están desconectados, sino que también resulta en tiempos de carga de página más rápidos en visitas repetidas.

Utilice una biblioteca de terceros para simplificar el proceso de generación de un service worker, a menos que tenga requisitos de almacenamiento en caché más complejos que los que puede proporcionar una biblioteca. Por ejemplo, [Workbox](/workbox) proporciona una colección de herramientas que le permiten crear y mantener un service worker para almacenar en caché los activos. Para obtener más información sobre los service workers y la confiabilidad fuera de línea, consulte la [guía de service workers](/service-workers-cache-storage) en la ruta de aprendizaje de confiabilidad.

## Carga diferida

Lighthouse muestra una auditoría fallida si envía demasiados datos a través de la red.

{% Img src="image/admin/Ml4hOCqfD4kGWfuKYVTN.png", alt="Lighthouse: Tiene una auditoría de cargas útiles de red enormes", width="800", height="99" %}

Esto incluye todos los tipos de activos, pero las cargas útiles grandes de JavaScript son especialmente costosas debido al tiempo que le toma al navegador analizarlas y compilarlas. Lighthouse también proporciona una advertencia para esto cuando sea apropiado.

{% Img src="image/admin/aKDCV8qv3nuTVFt0Txyj.png", alt="Lighthouse: Auditoría de tiempo de arranque de JavaScript", width="797", height="100" %}

Para enviar una carga útil de JavaScript más pequeña que contenga solo el código necesario cuando un usuario carga inicialmente su aplicación, divida todo el paquete y [cargue diferidamente](/reduce-javascript-payloads-with-code-splitting) los fragmentos a pedido.

Una vez que haya logrado dividir su paquete, cargue previamente los fragmentos que son más importantes (consulte la guía [Precarga de activos críticos](/preload-critical-assets)). La precarga garantiza que el navegador obtenga y descargue antes los recursos más importantes.

Además de dividir y cargar diferentes fragmentos de JavaScript a pedido, Lighthouse también proporciona una auditoría para la carga diferida de imágenes no críticas.

{% Img src="image/admin/sEgLhoYadRCtKFCYVM1d.png", alt="Lighthouse: Auditoría de imágenes diferidas fuera de pantalla", width="800", height="90" %}

Si carga muchas imágenes en su página web, posponga todas las que están en la mitad inferior de la página, o fuera de la ventana gráfica del dispositivo, cuando se carga una página (consulte [Uso de lazysizes para cargar imágenes de forma diferida](/use-lazysizes-to-lazyload-images)).

## Próximos pasos

Ahora que comprende algunos de los conceptos básicos detrás del patrón PRPL, continúe con la siguiente guía de esta sección para obtener más información. Es importante recordar que no todas las técnicas deben aplicarse en conjunto. Cualquier esfuerzo realizado con cualquiera de las siguientes proporcionará mejoras notables en el rendimiento.

- **Envío automático** (o **precarga**) de los recursos críticos.
- **Renderizar** la ruta inicial lo antes posible.
- **Guardar en caché** los activos restantes.
- **Carga diferida** de otras rutas y activos no críticos.
