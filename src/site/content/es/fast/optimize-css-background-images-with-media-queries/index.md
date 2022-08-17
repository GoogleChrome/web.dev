---
layout: post
title: Optimice las imágenes de fondo CSS con consultas de medios
authors:
  - demianrenzulli
description: Utilice consultas de medios para enviar imágenes que sean únicamente tan grandes como se necesite, una técnica comúnmente conocida como imágenes responsivas.
date: 2020-03-05
updated: 2020-03-05
tags:
  - performance
---

Muchos sitios solicitan recursos pesados, como imágenes, que no están optimizados para ciertas pantallas y envían archivos CSS de gran tamaño con estilos que algunos dispositivos nunca usarán. El uso de consultas de medios es una técnica popular para entregar activos y hojas de estilo personalizados en diferentes pantallas para reducir la cantidad de datos transferidos a los usuarios y mejorar el rendimiento de carga de la página. Esta guía le muestra cómo usar las consultas de medios para enviar imágenes que son tan grandes como se necesiten, una técnica comúnmente conocida como **imágenes responsivas**.

## Prerrequisitos

Esta guía asume que está familiarizado con [Chrome DevTools](https://developer.chrome.com/docs/devtools/). En su lugar, puede utilizar las DevTools de otro navegador si lo prefiere. Sólo tendrá que correlacionar las capturas de pantalla de Chrome DevTools de esta guía con las características pertinentes de su navegador.

## Comprenda las imágenes de fondo responsivas

Primero, analice el tráfico de red de la demostración no optimizada:

1. Abra la [demostración no optimizada](https://use-media-queries-unoptimized.glitch.me/) en una nueva pestaña de Chrome.
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'reload-page', 'ol' %}

{% Aside %} Consulte [Inspeccionar la actividad de la red con Chrome DevTools](https://developer.chrome.com/docs/devtools/network/) si necesita más ayuda con DevTools. {% endAside %}

Verá que la única imagen que se solicita es `background-desktop.jpg`, que tiene un tamaño de **1006 KB**:

<figure>{% Img src="image/admin/K8P4MHp2FSnZYTw3ZVkG.png", alt="Seguimiento de red de DevTools para la imagen de fondo no optimizada", width="800", height="126" %}</figure>

Cambie el tamaño de la ventana del navegador y observe que el registro de red no muestra ninguna solicitud nueva realizada por la página. Esto significa que se utiliza el mismo fondo de imagen para todos los tamaños de pantalla.

Puede ver los estilos que controlan la imagen de fondo en [style.css](https://use-media-queries-unoptimized.glitch.me/style.css):

```css
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

Aquí está el significado de cada una de las propiedades utilizadas:

- `background-position: center center` : centra la imagen vertical y horizontalmente.
- `background-repeat: no-repeat` : muestra la imagen solo una vez.
- `background-attachment: fixed` : evita que la imagen de fondo se desplace con la vista del usuario.
- `background-size: cover` : cambia el tamaño de la imagen para cubrir todo el contenedor.
- `background-image: url(images/background-desktop.jpg)` : la URL de la imagen.

Cuando se combinan, estos estilos le dicen al navegador que adapte la imagen de fondo a diferentes alturas y anchos de pantalla. Este es el primer paso para lograr un entorno responsivo.

El uso de una única imagen de fondo para todos los tamaños de pantalla tiene algunas limitaciones:

- Se envía la misma cantidad de bytes, independientemente del tamaño de la pantalla, incluso cuando, para algunos dispositivos, como los teléfonos, una imagen de fondo más pequeña y liviana se vería igual de bien. En general, se desea enviar la imagen más pequeña posible que aún se vea bien en la pantalla del usuario para mejorar el rendimiento y ahorrarle datos al usuario.
- En dispositivos más pequeños, la imagen se estirará o se recortará para cubrir toda la pantalla, ocultando potencialmente partes relevantes del fondo para los usuarios.

En la siguiente sección, aprenderá cómo aplicar una optimización para cargar diferentes imágenes de fondo, según el dispositivo del usuario.

## Utilizar consultas de medios

El uso de consultas de medios es una técnica común para declarar hojas de estilo que solo se aplicarán a determinados tipos de medios o dispositivos. Se implementan mediante el uso de [reglas de @media](https://developer.mozilla.org/docs/Web/CSS/@media), (medios), que le permiten definir un conjunto de puntos de interrupción, donde se definen estilos específicos. Cuando se cumplen las condiciones definidas por la regla de `@media` (por ejemplo, un cierto ancho de pantalla), se aplicará el grupo de estilos definido dentro del punto de interrupción.

Los siguientes pasos se pueden utilizar para aplicar consultas de medios al [sitio](https://use-media-queries-unoptimized.glitch.me/) para que se usen diferentes imágenes, dependiendo del ancho máximo del dispositivo que solicita la página.

- En `style.css`, elimine la línea que contiene la URL de la imagen de fondo:

```css//4
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

- A continuación, cree un punto de interrupción para cada ancho de pantalla, en función de las dimensiones comunes en píxeles que suelen tener las pantallas de dispositivos móviles, tabletas y computadoras de escritorio:

Para móvil:

```css
@media (max-width: 480px) {
    body {
        background-image: url(images/background-mobile.jpg);
    }
}
```

Para tabletas:

```css
@media (min-width: 481px) and (max-width: 1024px) {
    body {
        background-image: url(images/background-tablet.jpg);
    }
}
```

Para dispositivos de escritorio:

```css
@media (min-width: 1025px) {
    body {
	    background-image: url(images/background-desktop.jpg);
   }
}
```

Abra la versión optimizada de [style.css](https://use-media-queries-optimized.glitch.me/style.css) en su navegador para ver los cambios realizados.

{% Aside %} Las imágenes utilizadas en la demostración optimizada ya han cambiado de tamaño para adaptarse a diferentes tamaños de pantalla. En esta guía no mostraremos cómo cambiar el tamaño de las imágenes, pero si desea saber más, la [guía para entregar imágenes responsivas](/serve-responsive-images/) cubre algunas herramientas útiles, como el [paquete sharp npm](https://www.npmjs.com/package/sharp) y la [CLI de ImageMagick](https://www.imagemagick.org/script/index.php). {% endAside %}

## Mida la pantalla de diferentes dispositivos

A continuación, visualice el sitio resultante en diferentes tamaños de pantalla y en dispositivos móviles simulados:

1. Abra el [sitio optimizado](https://use-media-queries-optimized.glitch.me/) en una nueva pestaña de Chrome.
2. Haga que su ventana gráfica sea más estrecha (menos de `480px`).
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'reload-page', 'ol' %} Observe cómo se solicitó la imagen `background-mobile.jpg`.
3. Amplíe su ventana. Una vez que sea más ancha que `480px`, vea cómo se solicita `background-tablet.jpg`. Una vez que sea más ancha que `1025px`, vea cómo se solicita `background-desktop.jpg`.

Cuando se cambia el ancho de la pantalla del navegador, se solicitan nuevas imágenes.

En particular, cuando el ancho está por debajo del valor definido en el punto de interrupción para móvil (480px), verá el siguiente registro de red:

<figure>{% Img src="image/admin/jd2kHIefYf91udpFEmvx.png", alt="Seguimiento de red de DevTools para la imagen de fondo optimizada", width="800", height="125" %}</figure>

El tamaño del nuevo fondo móvil es un **67% más pequeño** que el del escritorio.

## Resumen

En esta guía, ha aprendido a aplicar consultas de medios para solicitar imágenes de fondo adaptadas a tamaños de pantalla específicos y ahorrar bytes al acceder al sitio en dispositivos más pequeños, como teléfonos móviles. Usó la regla de `@media` para implementar un fondo responsivo. Esta técnica es ampliamente compatible con todos los navegadores. Una nueva característica de CSS: [image-set()](https://www.w3.org/TR/css-images-4/#image-set-notation) se puede usar para el mismo propósito con menos líneas de código. En el momento de escribir este artículo, esta función no era compatible con todos los navegadores, pero es posible que quiera estar atento a cómo evoluciona la adopción, ya que puede representar una alternativa interesante a esta técnica.
