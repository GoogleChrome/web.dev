---
layout: post
title: Cómo Wix mejoró el rendimiento de su sitio web mediante la evolución de su infraestructura
subhead: |2-

  Un caso de estudio de algunos cambios importantes introducidos en Wix para mejorar el rendimiento de la carga del sitio web para millones de sitios, despejando el camino para que reciban buenos PageSpeed Insights y puntuaciones de Core Web Vitals.
authors:
  - alonko
description: Un caso de estudio de algunos cambios importantes introducidos en Wix para mejorar el rendimiento de la carga del sitio web para millones de sitios, despejando el camino para que reciban buenos PageSpeed Insights y puntuaciones de Core Web Vitals.
date: 2021-03-10
updated: 2022-07-18
hero: image/BrQidfK9jaQyIHwdw91aVpkPiib2/HNGPDotyTYOuPE0YxLQ9.jpg
alt: 'Un tren rápido (fuente: https://unsplash.com/photos/60VrGk-bfeA)'
tags:
  - blog
  - performance
  - web-vitals
  - case-study
---

{% Aside %} Alon lidera el equipo central de backend en [Wix](https://www.wix.com). {% endAside %}

Gracias al aprovechamiento de los estándares de la industria, los proveedores de nube y las capacidades de CDN, combinado con una reescritura importante del tiempo de ejecución de nuestro sitio web, el porcentaje de sitios Wix que alcanzaron buenas puntuaciones del percentil 75 en todas las métricas de Core Web Vitals (CWV) se **triplicó** año tras año, según a los datos de [CrUX](https://developer.chrome.com/docs/crux/) y [HTTPArchive](https://httparchive.org/faq#how-do-i-use-bigquery-to-write-custom-queries-over-the-data).

Wix adoptó una cultura orientada al rendimiento y se seguirán implementando nuevas mejoras para los usuarios. A medida que nos centramos en los KPI de rendimiento, esperamos ver crecer el número de sitios que superan los umbrales de CWV.

## Descripción general

El mundo del desempeño es [maravillosamente complejo](https://youtu.be/ctavZT87syI), con muchas variables y cosas muy rebuscadas. Las investigaciones muestran que la [velocidad del sitio tiene un impacto directo en las tasas de conversión y los ingresos](/milliseconds-make-millions) de las empresas. En los últimos años, la industria ha puesto más énfasis en la visibilidad del rendimiento y en [hacer que la web sea más rápida](/fast). A partir de mayo de 2021, las [señales de experiencia de la página](https://developers.google.com/search/blog/2020/11/timing-for-page-experience) se incluirán en el ranking de búsqueda de Google.

El desafío único en Wix es dar su apoyo a **millones** de sitios, algunos de los cuales se crearon hace *muchos años* y no se han actualizado desde entonces. Contamos con varias [herramientas y artículos](https://support.wix.com/en/performance-and-technical-issues/site-performance) para ayudar a nuestros usuarios sobre lo que pueden hacer para analizar y mejorar el rendimiento de sus sitios.

Wix es un entorno gestionado y no todo está en manos del usuario. Compartir infraestructuras comunes presenta muchos desafíos para todos estos sitios, pero también abre oportunidades para mejoras importantes en todos los ámbitos, es decir, aprovechar las economías de escala.

{% Aside%} *En esta publicación, me centraré en las mejoras realizadas en torno al servicio del HTML inicial, que inicia el proceso de carga de la página.* {% endAside %}

### Hablar en un idioma común

Una de las principales dificultades del desempeño es encontrar una terminología común para discutir diferentes aspectos de la experiencia del usuario, considerando tanto el desempeño técnico como el percibido. El uso de un lenguaje común bien definido dentro de la organización nos permitió discutir y categorizar fácilmente las diferentes partes técnicas y sus intercambios, clarificó nuestros informes de desempeño y ayudó enormemente a comprender en qué aspectos deberíamos enfocarnos en mejorar primero.

Ajustamos todo nuestro monitoreo y discusiones internas para incluir métricas estándar de la industria como [Web Vitals](/vitals/), que incluyen:

<figure>{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/PLF62sx8lHkpKbnvYKKR.jpg", alt="Un diagrama de 2020 Core Web Vitals: LCP, FID y CLS.", width="800", height="215" %} <figcaption>Core Web Vitals</figcaption></figure>

### Puntajes de rendimiento y complejidad del sitio

Es bastante fácil crear un sitio que se cargue instantáneamente siempre que lo [hagas muy simple](https://justinjackson.ca/words.html) usando solo HTML y lo sirvas a través de un CDN.

<figure data-float="left">{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/xMUN9CUVvgnHofImPcV5.jpg", alt="Ejemplo de PageSpeed Insights", width="800", height="647" %}</figure>

Sin embargo, la realidad es que los sitios son cada vez más complejos y sofisticados, funcionan más como aplicaciones que como documentos y soportan funcionalidades como blogs, soluciones de comercio electrónico, código personalizado, etc.

Wix ofrece una gran [variedad de plantillas](https://www.wix.com/website/templates), lo que permite a sus usuarios crear fácilmente un sitio con muchas capacidades comerciales. Esas características adicionales a menudo incluyen *algunos* costos de rendimiento.

## El viaje

### Al principio, existía HTML

Cada vez que se carga una página web, siempre comienza con una solicitud inicial a una URL para recuperar el documento HTML. Esta respuesta HTML activa todas las solicitudes de clientes adicionales y la lógica del navegador para ejecutar y renderizar tu sitio. Esta es la parte más importante de la carga de la página, porque no sucede nada hasta que llega el comienzo de la respuesta (conocido como Time to First Byte (TTFB): Tiempo para el primer byte).

<figure>{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/b1KKSlUQQTuNCDj4ndyJ.jpg", alt="Primera vista de WebPageTest", width="800", height="411" %}<figcaption> Primera vista de WebPageTest</figcaption></figure>

#### El pasado: renderización del lado del cliente (CSR)

Cuando se opera sistemas a gran escala, siempre hay compensaciones que debes considerar, como el rendimiento, la confiabilidad y los costos. Hasta hace unos años, Wix utilizaba la renderización del lado del cliente (CSR), en la que el contenido HTML real se generaba a través de JavaScript en el lado del cliente (es decir, en el navegador), lo que nos permite admitir una gran escala de sitios sin tener costos operativos de un backend enorme.

CSR nos permitió usar un documento HTML común, que estaba esencialmente vacío. Todo lo que hizo fue activar la descarga del código y los datos requeridos que luego se utilizaron para generar el HTML completo en el dispositivo cliente.

#### Hoy: renderizado del lado del servidor (SSR)

Hace unos años hicimos la transición a la renderización del lado del servidor (SSR), ya que fue beneficioso tanto para el SEO como para el rendimiento, mejorando los tiempos de visibilidad inicial de la página y asegurando una mejor indexación para los motores de búsqueda que no tienen soporte completo para ejecutar JavaScript.

Este enfoque mejoró la experiencia de visibilidad, especialmente en dispositivos y conexiones más lentos, y abrió la puerta a más optimizaciones de rendimiento. Sin embargo, también significó que para cada solicitud de página web, se generó una respuesta HTML única sobre la marcha, lo que está **lejos** de ser óptima, especialmente para sitios con una gran cantidad de visitas.

### Introducción al almacenamiento en caché en varias ubicaciones

El HTML de cada sitio era en su mayoría estático, pero tenía algunas advertencias:

1. Con frecuencia cambia. Por ejemplo, cada vez que un usuario edita su sitio o realiza cambios en los datos del sitio, como en el inventario de la tienda del sitio web.
2. Tenía ciertos datos y cookies que eran **específicos del visitante**, lo que significa que dos personas que visitan el mismo sitio verían el HTML algo diferente. Por ejemplo, para respaldar las características de los productos, como recordar qué elementos colocó un visitante en el carrito, o el chat que el visitante inició con el negocio antes, y más.
3. No todas las páginas se pueden almacenar en caché. Por ejemplo, una página con un código de usuario personalizado, que muestra la hora actual como parte del documento, no es elegible para el almacenamiento en caché.

Inicialmente, tomamos el enfoque relativamente seguro de almacenar en caché el HTML <span style="text-decoration:underline;">sin</span> datos de visitantes y luego solo modificamos partes específicas de la respuesta HTML sobre la marcha para cada visitante, para cada visita de caché.

#### Solución CDN interna

Hicimos esto mediante la implementación de una solución interna: utilizando [Varnish HTTP Cache](https://varnish-cache.org/) para proxy y almacenamiento en caché, Kafka para mensajes de invalidación y un servicio basado en Scala/Netty que procesa estas respuestas HTML, pero muta el HTML y agrega datos específicos del visitante y cookies a la respuesta en caché.

Esta solución nos permitió implementar estos **componentes delgados** en muchas más ubicaciones geográficas y múltiples regiones de proveedores de nube, que se encuentran repartidas por todo el mundo. En 2019, presentamos **más de 15 regiones nuevas** y, gradualmente, habilitamos el almacenamiento en caché para más del 90% de nuestras páginas vistas que eran elegibles para el almacenamiento en caché. El servicio de sitios desde ubicaciones adicionales redujo la [latencia de la red](https://www.cloudping.co/grid) entre los clientes y los servidores que sirven la respuesta HTML, al acercar el contenido a los visitantes del sitio web.

También comenzamos a almacenar en caché ciertas respuestas de API de solo lectura utilizando la misma solución e invalidando la caché en cualquier cambio en el contenido del sitio. Por ejemplo, la lista de publicaciones de blog en el sitio se almacena en caché y se invalida cuando se publica y/o modifica una publicación.

#### Reducir las complejidades

La implementación del almacenamiento en caché mejoró sustancialmente el rendimiento, principalmente en las [fases TTFB](/ttfb/) y [First Contentful Paint (FCP): Despliegue del primer contenido](/fcp/) y mejoró nuestra confiabilidad al ofrecer el contenido desde una ubicación más cercana al usuario final.

Sin embargo, la necesidad de modificar el HTML para cada respuesta introdujo una complejidad innecesaria que, si se eliminaba, presentaba una oportunidad para mejorar el rendimiento.

### Almacenamiento en caché del navegador (y preparativos para CDN)

<div>
  <div class="stats">
    <div class="stats__item">
     <p class="stats__figure">~ 13 <sub>%</sub></p>
     <p>Las solicitudes HTML se sirven directamente desde la memoria caché del navegador, lo que ahorra mucho ancho de banda y reduce los tiempos de carga para las vistas repetidas.</p>
    </div>
  </div>
</div>

El siguiente paso fue eliminar por <span style="text-decoration:underline;">completo estos</span> datos específicos del visitante del HTML y recuperarlos de un punto final separado, llamado por el cliente para este propósito, después de que haya llegado el HTML.

Migramos cuidadosamente estos datos y cookies a un nuevo punto final, que se llama en cada carga de página, pero devuelve un JSON delgado, que se requiere solo para el [proceso de hidratación](https://reactjs.org/docs/react-dom.html#hydrate), para alcanzar la interactividad completa de la página.

Esto nos permitió habilitar el almacenamiento en caché del HTML del navegador, lo que significa que los navegadores ahora guardan la respuesta HTML para visitas repetidas y solo llaman al servidor para validar que el contenido no haya cambiado. Esto se hace usando [HTTP ETag](https://en.wikipedia.org/wiki/HTTP_ETag), que es básicamente un identificador asignado a una versión específica de un recurso HTML. Si el contenido sigue siendo el mismo, nuestros servidores envían una respuesta [304 Not Modified](https://developer.mozilla.org/docs/Web/HTTP/Status/304) al cliente, sin un cuerpo.

<figure>{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/hr1xnQccJEkHTBGxS5wF.jpg", alt="ALT_TEXT_HERE", width="800", height="410" %} <figcaption> Vista de repetición de WebPageTest</figcaption></figure>

Además, este cambio significa que nuestro HTML ya no es específico del visitante y no contiene cookies. En otras palabras, básicamente se puede almacenar en caché en cualquier lugar, lo que abre la puerta al uso de proveedores de CDN que tienen una presencia geográfica mucho mejor en cientos de ubicaciones en todo el mundo.

### DNS, SSL y HTTP/2

Con el almacenamiento en caché habilitado, los tiempos de espera se redujeron y otras partes importantes de la conexión inicial se volvieron más sustanciales. Mejorar nuestra infraestructura de red y monitoreo nos permitió mejorar nuestros tiempos de DNS, conexión y SSL.

<figure data-float="right">{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/Uuvh9xTItQ8wMA9s13RP.jpg", alt="Un gráfico de tiempo de respuesta", width="800", height="441" %}</figure>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) se habilitó para todos los dominios de usuario, lo que redujo tanto la cantidad de conexiones necesarias como la sobrecarga que conlleva cada nueva conexión. Este fue un cambio relativamente fácil de implementar, mientras se aprovechaban los beneficios de [rendimiento y resistencia](https://developers.google.com/web/fundamentals/performance/http2) que vienen con HTTP/2.

### Compresión Brotli (contra gzip)

<div>
  <div class="stats">
    <div class="stats__item">
     <p class="stats__figure">21 - 25 <sub>%</sub></p>
     <p>Reducción del tamaño de la mediana de transferencia de archivos</p>
    </div>
  </div>
</div>

Tradicionalmente, todos nuestros archivos se comprimían mediante la compresión [gzip](https://en.wikipedia.org/wiki/Gzip), que es la opción de compresión HTML más común en la web. ¡Este protocolo de compresión se implementó inicialmente hace casi 30 años!

<figure data-float="right">{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/h7KzeAfg2THMdDGMYvlR.jpg", alt="Compresión Brotli", width="800", height="805" %}<figcaption> <a href="https://tools.paulcalvano.com/compression.php">Estimador de nivel de compresión Brotli</a></figcaption></figure>

La más reciente [compresión Brotli](https://en.wikipedia.org/wiki/Brotli) introduce mejoras de compresión casi sin concesiones y poco a poco se está volviendo más popular, como se describe en el anual [Compression chapter](https://almanac.httparchive.org/en/2020/compression#what-type-of-content-should-we-compress) de Web Almanac. Ha sido compatible con [todos los principales navegadores](https://caniuse.com/brotli) durante un tiempo.

Habilitamos el soporte de Brotli en nuestros proxies nginx en los bordes, para todos los clientes que sean compatibles.

Al pasar a utilizar la compresión Brotli, redujo nuestro tamaño mediano de transferencia de archivos entre un **21% y un 25%**, lo que resultó en un uso reducido del ancho de banda y tiempos de carga mejorados.

<figure>{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/392RWYamrwkdFozk91LC.jpg", alt="Tamaños de respuesta de la mediana para dispositivos móviles y computadoras de escritorio", width="800", height="173" %}<figcaption> Tamaños de respuesta de la mediana</figcaption></figure>

## Redes de entrega de contenido (CDN)

### Selección de CDN dinámica

En Wix, siempre hemos utilizado [CDN](/content-delivery-networks/) para servir todo el código JavaScript y las imágenes en los sitios web de los usuarios.

Recientemente, nos integramos con una solución de nuestro proveedor de DNS, para seleccionar automáticamente la CDN con mejor desempeño según la red y el origen del cliente. Esto nos permite servir los archivos estáticos desde la mejor ubicación para cada visitante y evitar problemas de disponibilidad en una determinada CDN.

### Próximamente… dominios de usuario servidos por CDN

La última pieza del rompecabezas servira la última y parte más crítica a través de un CDN: el HTML del dominio del usuario.

Como se describió anteriormente, creamos nuestra propia solución interna para almacenar en caché y entregar los resultados de API y HTML específicos del sitio. Mantener esta solución en tantas regiones nuevas también tiene sus costos operativos y agregar nuevas ubicaciones se convierte en un proceso que debemos administrar y optimizar continuamente.

Actualmente nos estamos integrando con varios proveedores de CDN para respaldar el servicio de todo el sitio de Wix directamente desde las ubicaciones de CDN para mejorar la distribución de nuestros servidores en todo el mundo y así mejorar aún más los tiempos de respuesta. Este es un desafío debido a la gran cantidad de dominios que atendemos, que requieren terminación SSL en el borde.

La integración con CDN acerca los sitios web de Wix al cliente más que nunca y viene con más mejoras en la experiencia de carga, incluidas tecnologías más nuevas como HTTP/3 sin un esfuerzo adicional de nuestra parte.

<hr>

### Algunas palabras sobre el monitoreo del desempeño

Si ejecutas un sitio Wix, probablemente te estés preguntando cómo esto se traduce en los resultados de rendimiento de tu sitio Wix y cómo lo comparamos con otras plataformas de sitios web.

La mayor parte del trabajo realizado anteriormente se implementó el año pasado y cierta parte aún se está implementando.

El Web Almanac de HTTPArchive publicó recientemente la [edición 2020](https://almanac.httparchive.org/en/2020) que incluye un excelente capítulo sobre la [experiencia del usuario de CMS](https://almanac.httparchive.org/en/2020/cms). Ten en cuenta que muchos de los números descritos en este artículo son a mediados del 2020.

Esperamos ver el informe actualizado en 2021 y estamos monitoreando activamente los informes de [CrUX](https://developer.chrome.com/docs/crux/) para nuestros sitios, así como nuestras métricas de rendimiento internas.

Estamos comprometidos a mejorar continuamente los tiempos de carga y proporcionar a nuestros usuarios una plataforma en la que puedan crear sitios como ellos lo imaginen, sin comprometer el rendimiento.

<figure>{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/AADz7d1yVOWZlq0iSb6P.jpg", alt="La LCP, Speed Index y FCP para un sitio móvil a lo largo del tiempo", width="800", height="259" %} <figcaption>La LCP, Speed Index y FCP para un sitio móvil a lo largo del tiempo</figcaption></figure>

DebugBear lanzó recientemente una [revisión de rendimiento del Website Builder (creador de sitios web)](https://www.debugbear.com/blog/website-builder-performance-review) muy interesante, que toca algunas de las áreas que mencioné anteriormente y examina el rendimiento de sitios muy simples construidos en cada plataforma. Este [sitio](https://matt05041.wixsite.com/bizsolutions) se construyó hace casi dos años y no se modificó desde entonces, pero la plataforma está mejorando continuamente y el rendimiento del sitio junto con él, lo que se puede observar al [ver sus datos](https://www.debugbear.com/project/175/pageLoad/873/overview?dateRange=2019-03-31T21%3A00Z-to-2021-03-31T21%3A59Z) durante el último año y medio.

## Conclusión

Esperamos que nuestra experiencia te inspire a adoptar una cultura orientada al desempeño en tu organización y que los detalles anteriores sean útiles y aplicables a tu plataforma o sitio.

Para resumir:

- Elije un conjunto de métricas de las que puedas realizar un seguimiento de forma constante mediante el uso de herramientas respaldadas por la industria. Recomendamos Core Web Vitals.
- Aprovecha el almacenamiento en caché del navegador y las CDN.
- Migra a HTTP/2 (o HTTP/3 si es posible).
- Utiliza la compresión Brotli.

Gracias por conocer nuestra historia y te invitamos a hacer preguntas, compartir ideas en [Twitter](https://twitter.com/alonkochba) y [GitHub](https://github.com/alonkochba) y unirte a la conversación sobre rendimiento web en tus canales favoritos.

## Entonces, ¿cómo se ve **el** rendimiento de tu sitio Wix reciente?
