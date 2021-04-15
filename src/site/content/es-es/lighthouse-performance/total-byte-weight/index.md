---
layout: post
title: Evite cargas útiles de red enormes
description: Aprenda a mejorar el tiempo de carga de su página web reduciendo el tamaño total del archivo de los recursos que ofrece a sus usuarios.
date: '2019-05-02'
updated: '2020-05-29'
web_lighthouse:
  - peso-total-byte
---

Las cargas útiles de red grandes están altamente correlacionadas con tiempos de carga prolongados. También cuestan dinero a los usuarios; por ejemplo, los usuarios pueden tener que pagar por más datos móviles. Por lo tanto, reducir el tamaño total de las solicitudes de red de su página es bueno para la experiencia de sus usuarios en su sitio *y* sus billeteras.

{% Aside %} Para ver cuánto cuesta el acceso a su sitio en todo el mundo, consulte [¿Cuánto cuesta mi sitio? De WebPageTest.](https://whatdoesmysitecost.com/) Puede ajustar los resultados para tener en cuenta el poder adquisitivo. {% endAside %}

## Cómo falla la auditoría de carga útil de la red Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) muestra el tamaño total en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) de todos los recursos solicitados por su página. Las solicitudes más grandes se presentan primero:

<figure class="w-figure"><img class="w-screenshot" src="total-byte-weight.png" alt="Una captura de pantalla de la auditoría Lighthouse Evite enormes cargas útiles de red"></figure>

Según los [datos de HTTP Archive](https://httparchive.org/reports/state-of-the-web?start=latest#bytesTotal) , la carga útil media de la red está entre 1.700 y 1.900 KiB. Para ayudar a que aparezcan las cargas útiles más altas, Lighthouse marca las páginas cuyas solicitudes de red totales superan los 5.000 KiB.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo reducir el tamaño de la carga útil

Trate de mantener su tamaño total de bytes por debajo de 1.600 KiB. Este objetivo se basa en la cantidad de datos que teóricamente se pueden descargar en una conexión 3G sin dejar de alcanzar un [tiempo de interacción](/interactive) de 10 segundos o menos.

A continuación, se muestran algunas formas de reducir el tamaño de la carga útil:

- Aplazar las solicitudes hasta que sean necesarias. Consulte el [patrón PRPL](/apply-instant-loading-with-prpl) para ver un posible enfoque.
- Optimice las solicitudes para que sean lo más pequeñas posible. Las posibles técnicas incluyen:
    - [Minimice y comprima las cargas útiles de la red](/reduce-network-payloads-using-text-compression) .
    - [Utilice WebP en lugar de JPEG o PNG para sus imágenes](/serve-images-webp) .
    - [Establezca el nivel de compresión de las imágenes JPEG en 85](/use-imagemin-to-compress-images) .
- Almacene las solicitudes en caché para que la página no vuelva a descargar los recursos en visitas repetidas. (Consulte la [página de inicio de confiabilidad de](/reliable) la red para aprender cómo funciona el almacenamiento en caché y cómo implementarlo).

## Recursos

[Código fuente para la auditoría **Evite enormes cargas útiles de red**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/total-byte-weight.js)
