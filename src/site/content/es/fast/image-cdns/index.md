---
layout: post
title: Utilice CDN de imágenes para optimizar imágenes
authors:
  - katiehempenius
description: Las CDN de imágenes son excelentes para optimizar imágenes. El cambio a una CDN de imágenes puede generar un ahorro del 40 al 80% en bytes de imagen.
date: 2019-08-14
codelabs:
  - install-thumbor
tags:
  - performance
---

## ¿Por qué utilizar una CDN de imágenes?

Las redes de distribución de contenido de imágenes (CDN) son excelentes para optimizar imágenes. El cambio a una CDN de imágenes puede generar un [ahorro del 40 al 80%](https://www.youtube.com/watch?v=YJGCZCaIZkQ&t=1010s) en el tamaño del archivo de imagen. En teoría, es posible lograr los mismos resultados utilizando solo scripts de compilación, pero es poco común en la práctica.

## ¿Qué es una CDN de imágenes?

Las CDN de imágenes se especializan en la transformación, optimización y entrega de imágenes. También puede pensar en ellas como API para acceder y manipular las imágenes utilizadas en su sitio. Para las imágenes cargadas desde una CDN de imágenes, la URL de una imagen indica no solo qué imagen cargar, sino también los parámetros como el tamaño, el formato y la calidad. Esto facilita la creación de variaciones de una imagen para diferentes casos de uso.

<figure>{% Img src="image/admin/OIF2VcXp8P6O7tQvw53B.jpg", alt="Muestra el flujo de solicitud/respuesta entre la CDN de imágenes y el cliente. Los parámetros como el tamaño y el formato se utilizan para solicitar variaciones de la misma imagen.", width="800", height="408" %} <figcaption> Ejemplos de transformaciones que las CDN de imágenes pueden realizar en función de los parámetros de las URL de imágenes.</figcaption></figure>

Las CDN de imágenes se diferencian de los scripts de optimización de imágenes en tiempo de compilación, en que crean nuevas versiones de imágenes a medida que se necesitan. Como resultado, las CDN generalmente se adaptan mejor que los scripts de compilación a la creación de imágenes muy personalizadas para cada cliente en individual.

## Cómo las CDN de imágenes utilizan las URL para indicar opciones de optimización

Las URL de imagen utilizadas por las CDN de imágenes transmiten información importante sobre una imagen, y las transformaciones y optimizaciones que se le deben aplicar. Los formatos de URL variarán según la CDN de imágenes, pero en un nivel alto, todos tienen características similares. Repasemos algunas de las características más comunes.

<figure>{% Img src="image/admin/GA4udXeYUEjHSY4N0Qew.jpg", alt="Las URL de imagen suelen constar de los siguientes componentes: origen, imagen, clave de seguridad y transformaciones.", width="800", height="127" %}</figure>

### Origen

Una CDN de imágenes puede vivir en su propio dominio o en el dominio de su CDN de imágenes. Las CDN de imágenes de terceros suelen ofrecer la opción de utilizar un dominio personalizado por una tarifa. El uso de su propio dominio facilita cambiar CDN de imágenes en una fecha posterior, porque no será necesario realizar cambios en la URL.

El ejemplo anterior usa el dominio de la CDN de imágenes ("example-cdn.com") con un subdominio personalizado, en lugar de un dominio personalizado.

### Imagen

Las CDN de imágenes generalmente se pueden configurar para recuperar automáticamente imágenes de sus ubicaciones existentes cuando sean necesarias. Esta capacidad a menudo se logra al incluir la URL completa de la *imagen existente* dentro de la URL de la imagen generada por la CDN de imágenes. Por ejemplo, es posible que vea una URL similar a esta: `https://my-site.example-cdn.com/https://flowers.com/daisy.jpg/quality=auto`. Esta URL recuperaría y optimizaría la imagen que existe en `https://flowers.com/daisy.jpg`.

Otra forma ampliamente admitida de subir imágenes a una CDN de imágenes, es enviarlas a través de una solicitud HTTP POST a la API de la CDN de imágenes.

### Clave de seguridad

Una clave de seguridad evita que otras personas creen nuevas versiones de sus imágenes. Si esta función está habilitada, cada nueva versión de una imagen requiere una clave de seguridad única. Si alguien intenta cambiar los parámetros de la URL de la imagen, pero no proporciona una clave de seguridad válida, no podrá crear una nueva versión. El CDN de imágenes se encargará de los detalles de generación y seguimiento de claves de seguridad por usted.

### Transformaciones

Las CDN de imágenes ofrecen decenas, y en algunos casos cientos, de diferentes transformaciones de imágenes. Estas transformaciones se especifican a través de la cadena de URL, y no existen restricciones sobre el uso de múltiples transformaciones al mismo tiempo. En el contexto del rendimiento web, las transformaciones de imagen más importantes son el tamaño, la densidad de píxeles, el formato y la compresión. Estas transformaciones son la razón por la que el cambio a una CDN de imágenes, generalmente da como resultado una reducción significativa en el tamaño de la imagen.

Suele haber una configuración objetivamente mejor para las transformaciones de rendimiento, por lo que algunas CDN de imágenes admiten un modo "automático" para estas transformaciones. Por ejemplo, en lugar de especificar que las imágenes se transformen al formato WebP, puede permitir que la CDN seleccione y proporcione automáticamente el formato óptimo. Las señales que una CDN de imágenes puede usar para determinar la mejor manera de transformar una imagen incluyen:

- [Sugerencias para el cliente](https://developer.chrome.com/blog/automating-resource-selection-with-client-hints/) (por ejemplo, ancho de la ventana gráfica, DPR y ancho de la imagen)
- El encabezado [`Save-Data`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Save-Data)
- El encabezado de la solicitud de [agente de usuario](https://developer.mozilla.org/docs/Web/HTTP/Headers/User-Agent)
- [API de información de red](https://developer.mozilla.org/docs/Web/API/Network_Information_API)

Por ejemplo, la CDN de imágenes puede servir JPEG XR a un navegador Edge, WebP a un navegador Chrome y JPEG a un navegador muy antiguo. Las configuraciones automáticas son populares porque permiten aprovechar la gran experiencia de las CDN de imágenes en la optimización de imágenes, sin la necesidad de cambios de código para adoptar nuevas tecnologías una vez que son compatibles con la CDN de imágenes.

## Tipos de CDN de imágenes

Las CDN de imágenes se pueden dividir en dos categorías: autogestionadas y administradas por terceros.

### CDN de imágenes autogestionadas

Las CDN autogestionadas pueden ser una buena opción para sitios con personal de ingeniería que se siente cómodo manteniendo su propia infraestructura.

[Thumbor](https://github.com/thumbor/thumbor) es la única CDN de imágenes autogestionada disponible en la actualidad. Si bien es de código abierto y de uso gratuito, generalmente tiene menos funciones que la mayoría de las CDN comerciales y su documentación es algo limitada. [Wikipedia](https://wikitech.wikimedia.org/wiki/Thumbor), [Square](https://medium.com/square-corner-blog/dynamic-images-with-thumbor-a430a1cfcd87) y [99designs](https://99designs.com/tech-blog/blog/2013/07/01/thumbnailing-with-thumbor/) son tres sitios que utilizan Thumbor. Consulte [Cómo instalar la CDN de imágenes de Thumbor](/install-thumbor) para obtener instrucciones sobre cómo configurarla.

### CDN de imágenes de terceros

Las CDN de imágenes de terceros proporcionan CDN de imágenes como un servicio. Así como los proveedores de la nube proporcionan servidores y otra infraestructura por una tarifa, las CDN de imágenes proporcionan optimización y entrega de imágenes por una tarifa. Debido a que las CDN de imágenes de terceros mantienen la tecnología subyacente, comenzar es bastante sencillo y, por lo general, se puede lograr en 10-15 minutos, aunque una migración completa para un sitio grande puede llevar mucho más tiempo. Las CDN de imágenes de terceros generalmente tienen un precio basado en niveles de uso, y la mayoría de las CDN de imágenes proporcionan un nivel o prueba gratuita para brindarle la oportunidad de probar su producto.

## Elegir una CDN de imágenes

Existen muchas buenas opciones para CDN de imágenes. Algunas tendrán más funciones que otras, pero todas probablemente le ayudarán a ahorrar bytes en sus imágenes y, por lo tanto, cargarán sus páginas más rápido. Además de los conjuntos de funciones, otros factores a considerar al elegir una CDN de imágenes son el costo, el soporte, la documentación y la facilidad de configuración o migración.

También puede ser útil probarlas usted mismo antes de tomar una decisión. A continuación, puede encontrar codelabs con instrucciones sobre cómo comenzar rápidamente con varias CDN de imágenes.
