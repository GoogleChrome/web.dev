---
layout: post
title: Mostrar las imágenes con una relación de aspecto incorrecta
description: |2

  Aprenda a mostrar imágenes receptivas con la relación de aspecto correcta.
web_lighthouse:
  - image-aspect-ratio
date: 2019-05-02
updated: 2020-04-29
---

Si una imagen renderizada tiene una [relación de aspecto](https://en.wikipedia.org/wiki/Aspect_ratio_(image)) que es significativamente diferente de la relación de aspecto en su archivo de origen (la relación de aspecto *natural*), la imagen renderizada puede verse distorsionada, lo que posiblemente cree una experiencia de usuario desagradable.

## Cómo falla la auditoría Lighthouse para la relación de aspecto de imágenes

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca cualquier imagen con una dimensión renderizada más de unos pocos píxeles diferente de la dimensión esperada cuando se renderiza en su proporción natural:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OSV0HmZeoy84Tf0Vrt9o.png", alt="Auditoría Lighthouse que muestra imágenes con una relación de aspecto incorrecta", width="800", height="198" %}</figure>

Existen dos causas comunes para una relación de aspecto incorrecta de las imágenes:

- Para una imagen se establecen valores explícitos de ancho y altura que difieren de las dimensiones de la imagen original.
- Para una imagen se establecen valores de ancho y altura expresados como un porcentaje de un contenedor de tamaño variable.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Compruebe que las imágenes se muestren con la relación de aspecto correcta

### Utilice un CDN de imagen

Un CDN de imagen puede facilitar la automatización del proceso de creación de versiones de diferentes tamaños de sus imágenes. Consulte el documento [Uso de los CDN de imagen para optimizar imágenes](/image-cdns/) para obtener una descripción general, además consulte [Cómo instalar el CDN de imágenes Thumbor](/install-thumbor/) para un laboratorio de código práctico.

### Verifique el CSS que afecta la relación de aspecto de la imagen

Si tiene problemas para encontrar el CSS que está causando la relación de aspecto incorrecta, Chrome DevTools puede mostrarle las declaraciones de CSS que afectan a una imagen determinada. Consulte la página de Google [Ver solo el CSS  que se aplica realmente a un elemento](https://developer.chrome.com/docs/devtools/css/reference/#computed) para obtener más información.

### Verifique los atributos `width` y `height` de la imagen en el HTML

Cuando sea posible, una práctica recomendable es especificar los atributos `width` y `height` de cada imagen en su HTML para que el navegador pueda asignar espacio para la imagen. Este enfoque ayuda a garantizar que el contenido debajo de la imagen no cambie una vez que se cargue la imagen.

Sin embargo, especificar las dimensiones de la imagen en HTML puede ser difícil si se trabaja con imágenes receptivas, porque no hay forma de saber el ancho y la altura hasta que se conozcan las dimensiones de la ventana gráfica. Considere la posibilidad de utilizar la biblioteca [Relación de aspecto CSS](https://www.npmjs.com/package/css-aspect-ratio) o los [cuadros de relación de aspecto](https://css-tricks.com/aspect-ratio-boxes/) para ayudar a conservar las proporciones de las imágenes receptivas.

Por último, consulte la publicación [Suministrar imágenes con las dimensiones correctas](/serve-images-with-correct-dimensions) para saber cómo suministrar imágenes del tamaño adecuado para el dispositivo de cada usuario.

## Recursos

- [Código fuente para la auditoría **Mostrar las imágenes con una relación de aspecto incorrecta**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/image-aspect-ratio.js)
- [Relación de aspecto CSS](https://www.npmjs.com/package/css-aspect-ratio)
- [Cajas de relación de aspecto](https://css-tricks.com/aspect-ratio-boxes/)
- [Suministrar imágenes con las dimensiones correctas](/serve-images-with-correct-dimensions)
