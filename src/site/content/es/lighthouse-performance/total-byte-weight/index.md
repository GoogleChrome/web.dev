---
layout: post
title: Evita enormes cargas útiles de red
description: |2-

  Aprende a mejorar el tiempo de carga de tu página web reduciendo el tamaño total de los archivos de recursos que ofreces a tus usuarios.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - total-byte-weight
---

Las grandes cargas útiles de red están altamente correlacionadas con tiempos de carga prolongados. También cuestan dinero a los usuarios; por ejemplo, los usuarios posiblemente tengan que pagar por más datos móviles. Por lo tanto, reducir el tamaño total de las solicitudes de red de tu página es bueno para la experiencia de tus usuarios en tu sitio *y* sus billeteras.

{% Aside %} Para ver cuánto cuesta el acceso a tu sitio en todo el mundo, consulta [What Does My Site Cost? (¿Cuánto cuesta mi sitio?)](https://whatdoesmysitecost.com/) De WebPageTest. Puedes ajustar los resultados para considerar el poder adquisitivo. {% endAside %}

## Cómo falla la auditoría Lighthouse de carga útil de la red

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) muestra el tamaño total en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) de todos los recursos solicitados por tu página. Las solicitudes más grandes se presentan primero:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cCFb8MJkwnYquq3K9UmX.png", alt="Una captura de pantalla de la auditoría Lighthouse Evita enormes cargas útiles de red", width="800", height="518" %}</figure>

Según los datos de [HTTP Archive](https://httparchive.org/reports/state-of-the-web?start=latest#bytesTotal), la carga útil media de la red está entre 1,700 y 1,900 KiB. Para ayudar a que aparezcan las cargas útiles más altas, Lighthouse marca las páginas cuyas solicitudes de red totales superan los 5.000 KiB.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo reducir el tamaño de la carga útil

Trata de mantener tu tamaño total de bytes por debajo de los 1,600 KiB. Este objetivo se basa en la cantidad de datos que teóricamente se pueden descargar en una conexión 3G sin dejar de alcanzar un [Time to Interactive (TTI): Tiempo para interactuar](/tti/) de 10 segundos o menos.

A continuación, se muestran algunas formas de reducir el tamaño de la carga útil:

- Aplazar las solicitudes hasta que sean necesarias. Consulta el [patrón PRPL](/apply-instant-loading-with-prpl) para ver una posible aproximación.
- Optimiza las consultas para que sean lo más pequeñas posible. Las posibles técnicas incluyen:
    - [Minimiza y comprime las cargas útiles de la red](/reduce-network-payloads-using-text-compression).
    - [Utiliza WebP en lugar de JPEG o PNG para tus imágenes](/serve-images-webp).
    - [Establece el nivel de compresión de las imágenes JPEG en 85](/use-imagemin-to-compress-images).
- Almacena las solicitudes en caché para que la página no vuelva a descargar los recursos en visitas repetidas. (Consulta la [confiabilidad de la página de inicio de la red](/reliable) para aprender cómo funciona el almacenamiento en caché y cómo implementarlo).

## Orientación de recursos tecnológicos específicos

### Angular

Aplica la [división de código a nivel de ruta](/route-level-code-splitting-in-angular/) para minimizar el tamaño de tus paquetes de JavaScript. Además, considera almacenar en caché los archivos con los [service workers de Angular](/precaching-with-the-angular-service-worker/).

### Drupal

Considera la posibilidad de utilizar [Estilos de imagen adaptables](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) para reducir el tamaño de las imágenes cargadas en tu página. Si usa Vistas para mostrar varios elementos de contenido en una página, considera implementar la paginación para limitar la cantidad de elementos de contenido que se muestran en una página determinada.

### Joomla

Considera mostrar extractos en las categorías de sus artículos (por ejemplo, a través de un enlace de "leer más"), reducir la cantidad de artículos que se muestran en una página determinada, dividir tus publicaciones largas en varias páginas o usar un complemento para cargar comentarios de forma diferida.

### WordPress

Considera mostrar extractos en tus listas de publicaciones (por ejemplo, a través de la etiqueta "más"), reducir la cantidad de publicaciones que se muestran en una página determinada, dividir tus publicaciones largas en varias páginas o usar un complemento para cargar comentarios de forma diferida.

## Recursos

[Código fuente para la auditoría **Evita enormes cargas útiles de red**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/total-byte-weight.js)
