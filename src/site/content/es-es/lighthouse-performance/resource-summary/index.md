---
layout: post
title: Mantenga los recuentos de solicitudes bajos y los tamaños de transferencia pequeños
description: Descubra cómo la gran cantidad de recursos y los grandes tamaños de transferencia afectan el rendimiento de la carga. Obtenga estrategias para reducir el número de solicitudes y el tamaño de las transferencias.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - resumen de recursos
---

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) informa cuántas solicitudes de red se realizaron y cuántos datos se transfirieron mientras se cargaba su página:

<figure class="w-figure"><img class="w-screenshot" src="resource-summary.png" alt="Una captura de pantalla de la solicitud de Lighthouse Keep cuenta con un número bajo y la auditoría de tamaños de transferencia pequeños"></figure>

- Los valores de **Solicitudes** y **Tamaño de transferencia** **para la fila Total** se calculan sumando los valores para las filas **Imagen** , **Script** , **Fuente** , **Hoja de estilo** , **Otro** , **Documento** y **Medios.**
- La **columna Terceros** no tiene en cuenta los valores de la fila **Total.** Su propósito es informarle cuántas solicitudes totales y cuánto del tamaño total de la transferencia provienen de dominios de terceros. Las solicitudes de terceros pueden ser una combinación de cualquiera de los otros tipos de recursos.

{% Aside %} Al igual que todas las **auditorías de diagnóstico** , la auditoría de **mantener un recuento bajo de solicitudes y los tamaños de transferencia pequeños** no afectan directamente su puntuación de **rendimiento.** Sin embargo, reducir el número de solicitudes o el tamaño de las transferencias puede mejorar otras métricas de **rendimiento.** {% endAside %}

## Cómo reducir el número de recursos y el tamaño de las transferencias

El efecto de un alto número de recursos o de un gran tamaño de transferencia sobre el rendimiento de la carga depende del tipo de recurso que se solicita.

### CSS y JavaScript

Las solicitudes de archivos CSS y JavaScript bloquean la representación de forma predeterminada. En otras palabras, los navegadores no pueden mostrar contenido en la pantalla hasta que finalicen todas las solicitudes de CSS y JavaScript. Si alguno de estos archivos está alojado en un servidor lento, ese único servidor lento puede retrasar todo el proceso de renderizado. Consulte [Optimización de JavaScript] , [Optimización de recursos de terceros] y [Optimización de CSS] para aprender cómo enviar solo el código que realmente necesita.

Métricas afectadas: [todas]

### Imagenes

Las solicitudes de imágenes no bloquean el procesamiento como CSS y JavaScript, pero aún pueden afectar negativamente el rendimiento de la carga. Un problema común es cuando un usuario de dispositivo móvil carga una página y ve que las imágenes han comenzado a cargarse, pero que tardarán un poco en terminar. Consulta [Optimiza tus imágenes] para aprender a cargar imágenes más rápido.

Métricas afectadas: [primera pintura con contenido] , [primera pintura con significado] , [índice de velocidad]

### Fuentes

La carga ineficiente de archivos de fuentes puede causar texto invisible durante la carga de la página. Consulta [Optimiza tus fuentes] para aprender cómo establecer de forma predeterminada una fuente que esté disponible en el dispositivo del usuario y luego cambiar a tu fuente personalizada cuando haya terminado de descargarse.

Métricas afectadas: [First Contentful Paint](/first-contentful-paint)

### Documentos

Si su archivo HTML es grande, el navegador tiene que dedicar más tiempo a analizar el HTML y construir el árbol DOM a partir del HTML analizado.

Métricas afectadas: [First Contentful Paint](/first-contentful-paint)

### Medios de comunicación

Los archivos GIF animados suelen ser muy grandes. Consulte [Reemplazar GIF con videos] para aprender a cargar animaciones más rápido.

Métricas afectadas: [First Contentful Paint](/first-contentful-paint)

## Utilice presupuestos de rendimiento para evitar regresiones.

Una vez que haya optimizado su código para reducir los recuentos de solicitudes y los tamaños de transferencia, consulte [Establecer presupuestos de rendimiento](/fast#set-performance-budgets) para obtener información sobre cómo evitar regresiones.

## Recursos

[Código fuente para la auditoría **Keep request count low y transfer pequeños**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/resource-summary.js)


[Optimización de CSS]: /fast#optimize-your-css
[Optimización de JavaScript]: /fast#optimize-your-javascript
[Optimización de recursos de terceros]: /fast#optimize-your-third-party-resources
[todas]: /lighthouse-performance#metrics
[Optimiza tus imágenes]: /fast#optimize-your-images
[primera pintura con contenido]: /first-contentful-paint
[primera pintura con significado]: /first-meaningful-paint
[índice de velocidad]: /speed-index
[Optimiza tus fuentes]: /fast/#optimize-web-fonts
[Reemplazar GIF con videos]: /replace-gifs-with-videos/