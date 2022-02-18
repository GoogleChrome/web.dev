---
layout: post
title: Servir imágenes receptivas
authors:
  - katiehempenius
description: Servir imágenes con tamaño para computadora de escritorio en dispositivos móviles puede usar de 2 a 4 veces más datos de lo necesario. En lugar de un enfoque de "talla única", utilice diferentes tamaños de imagen para diferentes dispositivos.
date: 2018-11-05
updated: 2021-06-04
codelabs:
  - codelab-specifying-multiple-slot-widths
  - codelab-art-direction
  - codelab-density-descriptors
tags:
  - performance
---

Servir imágenes con tamaño para computadora de escritorio en dispositivos móviles puede usar de 2 a 4 veces más datos de lo necesario. En lugar de un enfoque de "talla única", utilice diferentes tamaños de imagen para diferentes dispositivos.

## Cambiar el tamaño de las imágenes

Dos de las herramientas para redimensionar imágenes más populares son el [paquete sharp npm](https://www.npmjs.com/package/sharp) y la [herramienta ImageMagick CLI](https://www.imagemagick.org/script/index.php).

El paquete sharp es una buena opción para automatizar el cambio de tamaño de la imagen (por ejemplo, generar múltiples tamaños de miniaturas para todos los videos de su sitio web). Se integra rápida y fácilmente con scripts y herramientas de compilación. Por otro lado, ImageMagick resulta conveniente para un único cambio de tamaño de imagen porque se usa completamente desde la línea de comandos.

### sharp

Para usar sharp como un script de Node, guarde este código como una secuencia de comandos separada en su proyecto y luego ejecútelo para convertir sus imágenes:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const directory = './images';

fs.readdirSync(directory).forEach(file => {
  sharp(`${directory}/${file}`)
    .resize(200, 100) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
  });
```

### ImageMagick

Para cambiar el tamaño de una imagen al 33% de su tamaño original, ejecute el siguiente comando en su terminal:

```bash
convert -resize 33% flower.jpg flower-small.jpg
```

Para redimensionar una imagen de manera que se ajuste a 300px de ancho por 200px de alto, ejecute el siguiente comando:

```bash
# macOS/Linux
convert flower.jpg -resize 300x200 flower-small.jpg

# Windows
magick convert flower.jpg -resize 300x200 flower-small.jpg
```

### ¿Cuántas versiones de imagen debería crear?

No existe una respuesta "correcta" a esta pregunta. Sin embargo, es común servir entre 3 y 5 tamaños diferentes. Ofrecer más tamaños de imagen es mejor para el rendimiento, pero ocupará más espacio en sus servidores y requerirá escribir un poco más de HTML.

### Otras opciones

También vale la pena echarle un vistazo a servicios de imágenes como [Thumbor](https://github.com/thumbor/thumbor) (código abierto) y [Cloudinary.](https://cloudinary.com/) Los servicios de imágenes proporcionan imágenes receptivas (y manipulación de imágenes) bajo pedido. Thumbor se configura instalándolo en un servidor; Cloudinary se encarga de estos detalles por usted y no requiere configuración de servidor. Ambos son formas sencillas de crear imágenes receptivas.

## Servir múltiples versiones de imágenes

Especifique varias versiones de imagen y el navegador elegirá la mejor opción para usar:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>Antes</strong></th>
        <th><strong>Después</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          &lt;img src="flower-large.jpg"&gt;
        </td>
        <td>
          &lt;img src="flower-large.jpg" srcset="flower-small.jpg 480w,
          flower-large.jpg 1080w" sizes="50vw"&gt;
        </td>
      </tr>
    </tbody>
  </table>
</div>

Los atributos [`src`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-src), [`srcset`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-srcset) y [`sizes`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes) de la etiqueta `<img>` interactúan para lograr este resultado.

### El atributo "src"

El atributo src hace que este código funcione para navegadores que no [admiten](https://caniuse.com/#search=srcset) los atributos `srcset` y `sizes`. Si un navegador no admite estos atributos, volverá a cargar el recurso especificado por el atributo `src`.

{% Aside 'gotchas' %} El recurso especificado por el atributo `src` debe ser lo suficientemente grande para funcionar bien en todos los tamaños de dispositivos. {% endAside %}

### El atributo "srcset"

El `srcset` es una lista separada por comas de nombres de archivos de imágenes y sus descriptores de ancho o densidad.

Este ejemplo usa [descriptores de ancho](https://www.w3.org/TR/html5/semantics-embedded-content.html#width-descriptor). `480w` es un descriptor de ancho que le dice al navegador que `flower-small.jpg` tiene 480px de ancho; `1080w` es un descriptor de ancho que le dice al navegador que `flower-large.jpg` tiene 1080px de ancho.

El "descriptor de ancho" suena sofisticado, pero es solo una forma de indicarle al navegador el ancho de una imagen. Esto evita que el navegador tenga que descargar la imagen para determinar su tamaño.

{% Aside 'gotchas' %} Usa la unidad `w` (en lugar de `px`) para escribir descriptores de ancho. Por ejemplo, una imagen de 1024px de ancho se escribiría como `1024w`. {% endAside %}

**Crédito extra:** no necesita saber acerca de los descriptores de densidad para servir diferentes tamaños de imagen. Sin embargo, si tiene curiosidad sobre cómo funcionan los descriptores de densidad, consulte el [laboratorio de código de Cambio de resolución](/codelab-density-descriptors). Los descriptores de densidad se utilizan para mostrar diferentes imágenes según la [densidad de píxeles](https://en.wikipedia.org/wiki/Pixel_density) del dispositivo.

### El atributo "sizes"

El atributo sizes le dice al navegador qué tan ancha será la imagen cuando se muestre. Sin embargo, este atributo no tiene ningún efecto sobre el tamaño de la pantalla; todavía necesitas CSS para eso.

El navegador utiliza esta información, junto con lo que sabe sobre el dispositivo del usuario (es decir, sus dimensiones y densidad de píxeles), para determinar qué imagen cargar.

Si un navegador no reconoce el atributo "`sizes`", recurrirá a la carga de la imagen especificada por el atributo "`src`". (Los navegadores admitieron los atributos "code2}srcset" y "`sizes`" al mismo tiempo, por lo que un navegador admitirá ambos atributos o ninguno).

{% Aside 'gotchas' %} El ancho de un slot se puede especificar usando una variedad de unidades. Los siguientes son todos tamaños válidos:

- `100px`
- `33vw`
- `20em`
- `calc(50vw-10px)`

El siguiente es un tamaño inválido:

- `25%` (no se pueden utilizar porcentajes con el atributo sizes) {% endAside %}

**Crédito extra:** si desea algo sofisticado, también puede usar el atributo de tamaños para especificar varios tamaños de slot. Esto se adapta a los sitios web que usan diferentes diseños para diferentes tamaños de ventanas gráficas. Consulte este [ejemplo de código de múltiples slot](/codelab-specifying-multiple-slot-widths) para aprender cómo hacer esto.

### (Aún más) Crédito extra

Además de todo el crédito extra ya mencionado (¡las imágenes son complejas!), también puede usar estos mismos conceptos para [la dirección de arte](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction). La dirección de arte es la práctica de servir imágenes de aspecto completamente diferente (en lugar de versiones diferentes de la misma imagen) a diferentes ventanas gráficas. Puede obtener más información en el [laboratorio de código de Dirección de arte](/codelab-art-direction).

## Verificar

Una vez que haya implementado imágenes receptivas, puede usar Lighthouse para asegurarse de que no le faltó ninguna imagen. Ejecute la auditoría de Rendimiento de Lighthouse (**Lighthouse&gt; Opciones&gt; Rendimiento**) y busque los resultados de la auditoría de **imágenes de tamaño adecuado.** Estos resultados enlistarán las imágenes que deben cambiarse de tamaño.
