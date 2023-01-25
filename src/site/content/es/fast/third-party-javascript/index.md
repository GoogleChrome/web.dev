---
layout: post
title: Rendimiento de JavaScript de terceros
subhead: Descubra cómo JavaScript de terceros puede afectar el rendimiento y lo que puede hacer para evitar que se ralenticen sus sitios.
authors:
  - mihajlija
date: 2019-08-13
description: |2

  Esta publicación describe los tipos comunes de JavaScript de terceros y los problemas de rendimiento que pueden causar. También proporciona una guía general sobre cómo optimizar los scripts de terceros.
alt: Un diagrama de una página web con texto, un video, un mapa, un widget de chat y botones para compartir en las redes sociales.
tags:
  - blog
  - performance
---

JavaScript de terceros generalmente se refiere a scripts incrustados en su sitio web que:

- No los escribió usted
- Operan desde servidores de terceros

Los sitios usan estos scripts para varios propósitos, que incluyen:

- Botones para compartir en redes sociales
- Reproductor de video incrustado
- Servicios de chat
- Iframes publicitarios
- Scripts de análisis y estadísticas
- Scripts de prueba A/B para experimentos
- Bibliotecas auxiliares (como formato de fecha, animación y bibliotecas funcionales)

<figure data-size="full">{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/uLXJ72jZAlzK56ctPwXd.mp4", autoplay=true, loop=true, muted=true, playsinline=true %}</figure>

Los scripts de terceros pueden proporcionar una funcionalidad poderosa, pero esa no es toda la historia. También afectan la privacidad, la seguridad y el comportamiento de la página⁠, además pueden ser particularmente problemáticos para el rendimiento.

## Rendimiento

Cualquier cantidad significativa de [JavaScript puede ralentizar el rendimiento](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/). Pero debido a que JavaScript de terceros generalmente está fuera de su control, puede implicar problemas adicionales.

### La red

La configuración de conexiones lleva tiempo y el envío de demasiadas solicitudes a varios servidores provoca ralentizaciones. Ese tiempo es incluso más largo para las conexiones seguras, que pueden implicar búsquedas de DNS, redireccionamientos y varios recorridos de ida y vuelta al servidor final que maneja la solicitud del usuario.

Los scripts de terceros a menudo se suman a la sobrecarga de la red con cosas como:

- Disparar solicitudes adicionales de red
- Extraer imágenes y videos no optimizados
- Almacenamiento en [caché HTTP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching) insuficiente, lo que obliga a la obtención frecuente de recursos de red
- [Compresión](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer) insuficiente de los recursos del servidor
- Varias instancias de marcos y bibliotecas extraídas por diferentes incrustaciones de terceros

### Representación

La forma en que se carga JavaScript de terceros es muy importante. Si se realiza de forma sincrónica en la ruta crítica de renderizado, retrasa el análisis del resto del documento.

{% Aside 'key-term' %} La **ruta crítica de renderizado** incluye todos los recursos que el navegador necesita para mostrar el contenido de la primera pantalla. {% endAside %}

Si un tercero tiene problemas con el servidor y no puede entregar un recurso, la renderización se bloquea hasta que se agota el tiempo de espera de la solicitud, que puede ser de 10 a 80 segundos. Puede probar y simular este problema con las [pruebas de punto único de falla de WebPageTest](https://css-tricks.com/use-webpagetest-api/#single-point-of-failure).

{% Aside %} [Las secuencias de comandos de prueba A/B](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/#ab_test_smaller_samples_of_users) también pueden retrasar el procesamiento. La mayoría de ellos bloquean la visualización del contenido hasta que completan el procesamiento, lo que puede ser cierto incluso para los scripts de prueba A/B asíncronos. {% endAside %}

## Qué hacer al respecto

El uso de JavaScript de terceros a menudo es inevitable, pero hay cosas que puede hacer para minimizar los efectos adversos:

- Al elegir recursos de terceros, favorezca aquellos que envíen la menor cantidad de código y, al mismo tiempo, le brinden la funcionalidad que necesita.
- Utilice [presupuestos de rendimiento](/use-lighthouse-for-performance-budgets/) para el contenido de terceros para mantener su costo bajo control.
- No use la misma funcionalidad de dos proveedores diferentes. Probablemente no necesite dos administradores de etiquetas o dos plataformas de análisis.
- Audite y limpie rutinariamente los scripts de terceros redundantes.

Para aprender a auditar el contenido de terceros y cargarlo de manera eficiente para un mejor rendimiento y experiencia del usuario, consulte las otras publicaciones en la sección [Optimice sus recursos de terceros.](/fast/#optimize-your-third-party-resources)
