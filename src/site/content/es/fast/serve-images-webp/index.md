---
layout: post
title: Usar imágenes WebP
authors:
  - katiehempenius
description: |-
  Las imágenes WebP son más pequeñas que sus contrapartes JPEG y PNG, por lo general en la
  magnitud de una reducción del 25-35% en el tamaño del archivo. Esto reduce el tamaño de la página y mejora el rendimiento.
date: 2018-11-05
updated: 2020-04-06
codelabs:
  - codelab-serve-images-webp
tags:
  - performance
feedback:
  - api
---

## ¿Por qué es importante?

Las imágenes WebP son más pequeñas que sus contrapartes JPEG y PNG, por lo general en la magnitud de una reducción del 25 al 35% en el tamaño del archivo. Esto reduce el tamaño de las páginas y mejora el rendimiento.

- YouTube descubrió que cambiar a miniaturas de WebP resultó en [cargas de página un 10% más rápidas](https://www.youtube.com/watch?v=rqXMwLbYEE4).
- Facebook [experimentó](https://code.fb.com/android/improving-facebook-on-android/) un ahorro del 25% al 35% para los archivos JPEG y un ahorro del 80% para los archivos PNG cuando pasaron al uso de WebP.

WebP es un excelente reemplazo para imágenes JPEG, PNG y GIF. Además, WebP ofrece compresión sin pérdida y con pérdida de ambas maneras. En la compresión sin pérdidas no se pierden datos. La compresión con pérdida reduce el tamaño del archivo, pero a costa de posiblemente reducir la calidad de la imagen.

## Convertir imágenes a WebP

Las personas generalmente usan uno de los siguientes enfoques para convertir sus imágenes a WebP: la [herramienta de línea de comandos cwebp (CLI)](https://developers.google.com/speed/webp/docs/using) o el [complemento Imagemin WebP](https://github.com/imagemin/imagemin-webp) (paquete npm). El complemento Imagemin WebP es generalmente la mejor opción si su proyecto utiliza scripts o herramientas de compilación (por ejemplo, Webpack o Gulp), mientras que la CLI es una buena opción para proyectos simples o si solo necesita convertir imágenes una vez.

Cuando convierte imágenes a WebP, tiene la opción de establecer una amplia variedad de configuraciones de compresión, pero para la mayoría de las personas, lo único que debe preocuparle es la configuración de calidad. Puede especificar un nivel de calidad de 0 (el peor) a 100 (el mejor). Vale la pena jugar con este nivel para encontrar el equilibrio adecuado entre calidad de imagen y sus necesidades.

### Utilice cwebp

Convierta un solo archivo, usando la configuración de compresión predeterminada de cwebp:

```bash
cwebp images/flower.jpg -o images/flower.webp
```

Convierta un solo archivo, con un nivel de calidad de `50`:

```bash
cwebp -q 50 images/flower.jpg -o images/flower.webp
```

Convierta todos los archivos de un directorio:

```bash
for file in images/*; do cwebp "$file" -o "${file%.*}.webp"; done
```

### Utilice Imagemin

El complemento Imagemin WebP se puede usar solo o con su herramienta de compilación favorita (Webpack/Gulp/Grunt/etc.). Por lo general, esto implica agregar ~10 líneas de código a un script de compilación o al archivo de configuración de su herramienta de compilación. Aquí hay ejemplos de cómo hacer eso para [Webpack](https://glitch.com/~webp-webpack), [Gulp](https://glitch.com/~webp-gulp) y [Grunt](https://glitch.com/~webp-grunt).

Si no está utilizando una de esas herramientas de compilación, puede utilizar Imagemin por sí solo como un script de Node. Este script convertirá los archivos en el directorio `images` y los guardará en el directorio `compressed_images`.

```js
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['images/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 50})]
}).then(() => {
  console.log('Done!');
});
```

## Servir imágenes WebP

Si su sitio solo admite [navegadores](https://caniuse.com/#search=webp) compatibles con WebP, puede dejar de leer. De lo contrario, sirva WebP a los navegadores más nuevos y una imagen de respaldo a los navegadores más antiguos:

**Antes:**

```html
<img src="flower.jpg" alt="">
```

**Después:**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

Las etiquetas [`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture), [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) y `<img>`, incluida la forma en que están ordenadas entre sí, interactúan para lograr este resultado final.

### picture

La etiqueta `<picture>` proporciona un contenedor para cero o más etiquetas `<source>` y una etiqueta `<img>`.

### source

La etiqueta `<source>` especifica un recurso multimedia.

El navegador utiliza la primera fuente de la lista con formato compatible. Si el navegador no admite ninguno de los formatos enumerados en las etiquetas `<source>`, vuelve a cargar la imagen especificada por la etiqueta `<img>`.

{% Aside 'gotchas' %}

- La etiqueta `<source>` para el formato de imagen "preferido" (en este caso es WebP) debe aparecer primero, antes que otras etiquetas `<source>`.

- El valor del atributo `type` debe ser el tipo MIME correspondiente al formato de imagen. El [tipo MIME](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types) de una imagen y su extensión de archivo suelen ser similares, pero no son necesariamente lo mismo (p. Ej., `.jpg` frente a `image/jpeg`).

{% endAside %}

### img

La etiqueta `<img>` es lo que hace que este código funcione en navegadores que no admiten la etiqueta `<picture>` Si un navegador no admite la etiqueta `<picture>`, las ignorará. Por lo tanto, solo "ve" la etiqueta `<img src="flower.jpg" alt="">` y carga esa imagen.

{% Aside 'gotchas' %}

- La etiqueta `<img>` siempre debe incluirse, y siempre debe aparecer en último lugar, después de todas las etiquetas `<source>`.
- El recurso especificado por la etiqueta `<img>` debe estar en un formato compatible universalmente (p. Ej., JPEG), por lo que se puede utilizar como respaldo. {% endAside %}

## Verificar el uso de WebP

Lighthouse se puede utilizar para verificar que todas las imágenes de su sitio se sirvan mediante WebP. Ejecute la auditoría de rendimiento de Lighthouse (**Lighthouse&gt; Opciones&gt; Rendimiento**) y busque los resultados de la auditoría **Servir imágenes en formatos de próxima generación**. Lighthouse enumerará todas las imágenes que no se estén publicando en formato WebP.
