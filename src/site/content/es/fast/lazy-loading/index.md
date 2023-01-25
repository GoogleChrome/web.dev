---
layout: post
title: Utilice la carga diferida para mejorar la velocidad de carga
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-09
description: |2-

  Esta publicación explica la carga diferida y por qué es posible que desee cargar elementos en su sitio de forma diferida.
tags:
  - performance
  - images
---

La porción de [imágenes](http://beta.httparchive.org/reports/state-of-images?start=earliest&end=latest) y [video](http://beta.httparchive.org/reports/page-weight#bytesVideo) en la carga útil típica de un sitio web puede ser significativa. Desafortunadamente, las partes interesadas del proyecto pueden no estar dispuestas a eliminar los recursos de medios de sus aplicaciones existentes. Tales impasses son frustrantes, especialmente cuando todas las partes involucradas quieren mejorar el rendimiento del sitio, pero no pueden ponerse de acuerdo sobre cómo hacerlo. Afortunadamente, la carga diferida es una solución que reduce la carga útil inicial de la página *y* el tiempo de carga, pero no escatima en contenido.

## ¿Qué es la carga diferida? {: #what }

La carga diferida es una técnica que pospone la carga de recursos no críticos en el momento de la carga de la página. En vez de cargar de inmediato, estos recursos no críticos se cargan en el momento en que se necesitan. En lo que a imágenes se refiere, "no crítico" es a menudo sinónimo de "fuera de pantalla". Si ha utilizado Lighthouse y visualizó algunas oportunidades de mejora, es posible que haya visto alguna guía en este ámbito en la forma de la [Defer offscreen images audit (auditoría Diferir imágenes fuera de pantalla)](https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/):

<figure>{% Img src="image/admin/63NnMISWUUWD3mvAliwe.png", alt="Una captura de pantalla de la auditoría de diferir imágenes fuera de pantalla en Lighthouse.", width="800", height="102" %}<figcaption> Una de las auditorías de rendimiento de Lighthouse es identificar imágenes fuera de pantalla, que son candidatas para la carga diferida.</figcaption></figure>

Probablemente ya haya visto la carga diferida en acción, y es algo así:

- Llega a una página y comienza a desplazarse a medida que lee el contenido.
- En algún momento, desplaza una imagen de marcador de posición a la ventana gráfica.
- La imagen del marcador de posición es reemplazada repentinamente por la imagen final.

Se puede encontrar un ejemplo de carga diferida de imágenes en la popular plataforma de publicación [Medium](https://medium.com/), que carga imágenes de marcador de posición ligeras al cargar la página y las reemplaza con imágenes cargadas de forma diferida a medida que se desplazan hacia la ventana gráfica.

<figure>{% Img src="image/admin/p5ahQ67QtZ20bgto7Kpy.jpg", alt="Una captura de pantalla del sitio web Medium durante la navegación, que muestra la carga diferida en acción. El marcador de posición borroso está a la izquierda y el recurso cargado está en la derecha.", width="800", height="493" %}<figcaption> Un ejemplo de carga diferida de imágenes en acción. Una imagen de marcador de posición se usa al cargar la página (izquierda) y, cuando se desplaza hacia la ventana gráfica, la imagen final se carga en el momento en que se necesita.</figcaption></figure>

Si no está familiarizado con la carga diferida, es posible que se pregunte qué tan útil es la técnica y cuáles son sus beneficios. ¡Sigue leyendo para descubrirlo!

## ¿Por qué cargar imágenes o videos de forma diferida en lugar de simplemente *cargarlos*? {: #why }

Porque es posible que esté cargando cosas que el usuario nunca verá. Esto es problemático por un par de razones:

- Desperdicia datos. En conexiones ilimitadas, esto no es lo peor que podría suceder (aunque podría estar usando ese precioso ancho de banda para descargar otros recursos que, de hecho, el usuario verá). Sin embargo, en planes de datos limitados, cargar cosas que el usuario nunca ve podría ser efectivamente una pérdida de dinero.
- Desperdicia tiempo de procesamiento, batería y otros recursos del sistema. Una vez descargado un recurso multimedia, el navegador debe decodificarlo y representar su contenido en la ventana gráfica.

La carga diferida de imágenes y videos reduce el tiempo de carga inicial de la página, el peso inicial de la página y el uso de recursos del sistema, todo lo cual tiene un impacto positivo en el rendimiento.

## Implementación de carga diferida {: #implementing }

Hay varias formas de implementar la carga diferida. Su elección de solución debe tener en cuenta los navegadores que admite, y también lo que está tratando de cargar de forma diferida.

Los navegadores modernos implementan la [carga diferida a nivel del navegador](/browser-level-image-lazy-loading/), que se puede habilitar mediante el atributo `loading` en imágenes e iframes. Para proporcionar compatibilidad con navegadores más antiguos o para realizar una carga diferida en elementos sin una carga diferida incorporada, puede implementar una solución con su propio código JavaScript. También hay una serie de bibliotecas que le ayudarán a hacer esto. Consulte las publicaciones en este sitio para obtener detalles completos de todos estos enfoques:

- [Carga diferida de imágenes](/lazy-loading-images/)
- [Carga diferida de video](/lazy-loading-video/)

Además, hemos compilado una lista de [posibles problemas con la carga diferida](/lazy-loading-best-practices) y cosas a tener en cuenta en su implementación.

## Conclusión

Si se usan con cuidado, las imágenes y los videos de carga diferida pueden reducir considerablemente el tiempo de carga inicial y la carga útil de las páginas en su sitio. Los usuarios no incurrirán en actividades de red innecesarias ni en costos de procesamiento de recursos multimedia que tal vez nunca vean, pero aún pueden ver esos recursos si lo desean.

En lo que respecta a las técnicas de mejora del rendimiento, la carga diferida es razonablemente indiscutible. Si tiene muchas imágenes en línea en su sitio, es una manera perfecta de reducir las descargas innecesarias. ¡Los usuarios de su sitio y las partes interesadas del proyecto lo agradecerán!
