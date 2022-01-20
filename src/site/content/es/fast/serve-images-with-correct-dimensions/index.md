---
layout: post
title: Sirve imágenes con las dimensiones correctas
authors:
  - katiehempenius
description: 'Nos ha pasado a todos: se le olvidó reducir la escala de una imagen antes de agregarla a la página. La imagen se ve bien, pero está desperdiciando los datos de los usuarios y perjudicando el rendimiento de la página.'
date: 2018-11-05
wf_blink_components: N / A
codelabs:
  - codelab-serve-images-correct-dimensions
tags:
  - performance
---

Nos ha pasado a todos: se ha olvidado de reducir la escala de una imagen antes de agregarla a la página. La imagen se ve bien, pero está desperdiciando los datos de los usuarios y perjudicando el rendimiento de la página.

## Identificar imágenes de tamaño incorrecto

Lighthouse facilita la identificación de imágenes de tamaño incorrecto. Ejecute la Auditoría de rendimiento en Lighthouse > Opciones > Rendimiento (**Lighthouse > Options > Performance**) y busque los resultados de la auditoría de Imágenes de tamaño adecuado (**Properly size images**). La auditoría enumera todas las imágenes cuyo tamaño debe cambiarse.

## Determinar el tamaño de imagen correcto

El dimensionamiento imágenes puede resultar ilusoriamente complicado. Por esta razón, hemos proporcionado dos enfoques: el "bueno" y el "mejor". Ambos mejorarán el rendimiento, pero puede tardar un poco más en comprender e implementar el enfoque "mejor". Sin embargo, también será recompensado con una mayor mejora del rendimiento. La mejor opción para usted es aquella con que pueda implementar de forma más cómoda.

### Una nota rápida sobre las unidades CSS

Hay dos tipos de unidades CSS para especificar el tamaño de los elementos HTML, incluyendo las imágenes:

- Unidades absolutas: los elementos diseñados con unidades absolutas siempre se mostrarán con el mismo tamaño, independientemente del dispositivo. Ejemplos de unidades CSS absolutas válidas: px, cm, mm, in.
- Unidades relativas: los elementos diseñados con unidades relativas se mostrarán en diferentes tamaños, según la longitud relativa especificada. Ejemplos de unidades CSS relativas válidas:%, vw (1vw = 1% del ancho de la ventana gráfica), em (1.5 em = 1.5 veces el tamaño de fuente).

### El enfoque "bueno"

Para imágenes con tamaño basado en…

- **Unidades relativas** : cambie el tamaño de la imagen a un tamaño que funcione en todos los dispositivos.

Puede que le resulte útil comprobar sus datos analíticos (por ejemplo, Google Analytics) para ver qué tamaños de pantalla utilizan habitualmente sus usuarios. Alternativamente, [screeniz.es](http://screensiz.es/) proporciona información sobre las pantallas de muchos dispositivos comunes.

- **Unidades absolutas** : cambie el tamaño de la imagen para que coincida con el tamaño en el que se muestra.

El panel DevTools Elements se puede utilizar para determinar en qué tamaño se muestra una imagen.

{% Img src="image/admin/pKQa0Huu0KGInOekdz6M.png", alt="Panel del elemento DevTools", width="800", height="364" %}

### El enfoque "mejor"

Para imágenes con tamaño basado en…

- **Unidades absolutas:** Use los atributos [srcset](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-srcset) y [sizes](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-sizes) para servir diferentes imágenes a diferentes densidades de pantalla (Lea la guía sobre imágenes responsivas [aquí](/serve-responsive-images)).

"Densidad de pantalla" se refiere al hecho de que diferentes pantallas tienen diferentes densidades de píxeles. En igualdad de condiciones, una pantalla de alta densidad de píxeles se verá más nítida que una pantalla de baja densidad de píxeles.

Como resultado, se necesitan múltiples versiones de imágenes si desea que los usuarios experimenten las imágenes más nítidas posibles, independientemente de la densidad de píxeles de su dispositivo.

{% Aside %} Para algunos sitios esta diferencia en la calidad de la imagen es importante, para otros no es así. {% endAside %}

Las técnicas de Imágenes receptivas hacen que esto sea posible al dejarle enumerar varias versiones de imágenes y permitir que el dispositivo escoja la imagen que mejor se adapte a sus necesidades.

- **Unidades relativas:** Use imágenes responsivas para mostrar diferentes imágenes para diferentes tamaños de pantalla (Lea la guía [aquí](/serve-responsive-images)).

Una imagen que funciona en todos los dispositivos será demasiado grande para dispositivos más pequeños. Las técnicas de Imágenes responsivas, específicamente [srcset](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-srcset%22) y [sizes](https://developer.mozilla.org/docs/Web/HTML/Element/source#attr-sizes), le permiten especificar varias versiones de una imagen y que el dispositivo elija el tamaño que mejor funcione.

## Cambiar el tamaño de las imágenes

Independientemente del enfoque que elija, puede resultarle útil utilizar ImageMagick para cambiar el tamaño de sus imágenes. [ImageMagick](https://www.imagemagick.org/script/index.php) es la herramienta de línea de comandos más popular para crear y editar imágenes. La mayoría de las personas pueden cambiar el tamaño de las imágenes mucho más rápidamente cuando usan la CLI que un editor de imágenes basado en GUI.

Para cambiar el tamaño de la imagen al 25 % del tamaño del original:

```bash
convert flower.jpg -resize 25% flower_small.jpg
```

Para ajustar la imagen a un tamaño de "200 px de ancho por 100 px de alto":

```bash
# macOS/Linux
convert flower.jpg -resize 200x100 flower_small.jpg

# Windows
magick convert flower.jpg -resize 200x100 flower_small.jpg
```

Si va a cambiar el tamaño de muchas imágenes, puede que le resulte más conveniente utilizar una secuencia de comandos o un servicio para automatizar el proceso. Puede obtener más información sobre esto en la guía de imágenes responsivas.

## Verificar

Una vez que haya cambiado el tamaño de todas sus imágenes, vuelva a ejecutar Lighthouse para verificar que no faltó nada.
