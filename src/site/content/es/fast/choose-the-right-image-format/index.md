---
layout: post
title: Escoja el formato de imagen correcto
authors:
  - ilyagrigorik
description: |2-

  Seleccionar el formato de imagen correcto es el primer paso para ofrecer imágenes optimizadas en su sitio web. Esta publicación te ayuda a escoger de forma correcta.
date: 2018-08-30
updated: 2020-06-18
tags:
  - performance
  - images
---

La primera pregunta que debe hacerse es si, de hecho, se requiere una imagen para lograr el efecto que busca. Un buen diseño es simple y también producirá siempre el mejor rendimiento. Si puede eliminar un recurso de imagen, que a menudo requiere una gran cantidad de bytes en relación con HTML, CSS, JavaScript y otros activos en la página, entonces esa es siempre la mejor estrategia de optimización. Dicho esto, una imagen bien colocada también puede comunicar más información que mil palabras, por lo que depende de usted encontrar ese equilibrio.

A continuación, debe considerar si existe una tecnología alternativa que podría brindar los resultados deseados, pero de una manera más eficiente:

- **Los efectos CSS** (como sombras o degradados) y las animaciones CSS se pueden utilizar para producir activos independientes de la resolución que siempre se ven nítidos en cada resolución y nivel de zoom, a menudo en una fracción de los bytes requeridos por un archivo de imagen.
- **Las fuentes web** permiten el uso de tipos de letra elegantes que al mismo tiempo conservan la capacidad de seleccionar, buscar y cambiar el tamaño del texto, una mejora significativa en la usabilidad.

Si alguna vez se encuentra codificando texto en un recurso de imagen, deténgase y reconsidere. Una tipografía excelente es fundamental para un buen diseño, marca y legibilidad, pero el texto en imágenes ofrece una mala experiencia de usuario: el texto no se puede seleccionar, no se puede buscar, no se puede ampliar, no se puede acceder a él y no es compatible con dispositivos de alta resolución. El uso de fuentes web requiere su [propio conjunto de optimizaciones](https://www.igvita.com/2014/01/31/optimizing-web-font-rendering-performance/), pero aborda todas estas cuestiones y es siempre la mejor opción para mostrar texto.

## Escoja el formato de imagen correcto

Si está seguro de que una imagen es la opción correcta, debe seleccionar cuidadosamente el tipo de imagen adecuado para el trabajo.

<figure>{% Img src="image/admin/dJuB2DQcbhtwD5VdPVlR.png", alt="Imágenes de trama e imágenes vectoriales ampliadas", width="585", height="313" %}<figcaption> Imagen vectorial (L) e Imagen de trama (R) ampliadas</figcaption></figure>

- [Los gráficos vectoriales](https://en.wikipedia.org/wiki/Vector_graphics) utilizan líneas, puntos y polígonos para representar una imagen.
- [Los gráficos de trama](https://en.wikipedia.org/wiki/Raster_graphics) (raster images) representan una imagen codificando los valores individuales de cada píxel dentro de una cuadrícula rectangular.

Cada formato tiene su propio conjunto de pros y contras. Los formatos vectoriales son ideales para imágenes que constan de formas geométricas simples como logotipos, texto o iconos. Ofrecen resultados nítidos en cada resolución y configuración de zoom, lo que los convierte en un formato ideal para pantallas y activos de alta resolución que deben mostrarse en diferentes tamaños.

Sin embargo, los formatos vectoriales se quedan cortos cuando la escena es complicada (por ejemplo, una foto): la cantidad de marcado SVG para describir todas las formas puede ser prohibitivamente alta y la salida aún puede carecer del aspecto "fotorrealista". Cuando ese es el caso, debería usar un formato de imagen de trama como PNG, JPEG o WebP.

Las imágenes de trama no tienen las mismas propiedades agradables de ser independientes a la resolución o el zoom; cuando amplía una imagen de trama, verá gráficos irregulares y borrosos. Como resultado, es posible que deba guardar varias versiones de una imagen de trama en varias resoluciones para ofrecer la mejor experiencia a sus usuarios.

## Implicaciones de las pantallas de alta resolución

Hay dos tipos diferentes de píxeles: píxeles CSS y píxeles del dispositivo. Un solo píxel de CSS puede corresponder directamente a un solo píxel de dispositivo, o puede estar respaldado por múltiples píxeles de dispositivo. ¿Cuál es la finalidad? En resumen, cuantos más píxeles del dispositivo, más refinados serán los detalles del contenido que se muestra en la pantalla.

<figure>{% Img src="image/admin/oQV7qJ9fUMkYsKlUMrL4.png", alt="Tres imágenes que muestran la diferencia entre los píxeles CSS y los píxeles del dispositivo", width="470", height="205" %}<figcaption> La diferencia entre píxeles CSS y píxeles del dispositivo.</figcaption></figure>

Las pantallas de alto DPI (HiDPI) producen hermosos resultados, pero hay una compensación obvia: las imágenes requieren más detalles para aprovechar el mayor número de píxeles del dispositivo. La buena noticia es que las imágenes vectoriales son ideales para esta tarea, ya que se pueden renderizar en cualquier resolución con resultados nítidos; es posible que incurra en un mayor costo de procesamiento para renderizar los detalles más finos, pero el activo subyacente es el mismo y es independiente de la resolución.

Por otro lado, las imágenes de trama plantean un desafío mucho mayor porque codifican datos de imagen por píxel. Por lo tanto, cuanto mayor sea el número de píxeles, mayor será la imagen de trama. Como ejemplo, consideremos la diferencia entre un recurso fotográfico que se muestra a 100x100 píxeles (CSS):

<div class="table-wrapper scrollbar"><table>
<thead>
  <tr>
    <th>Resolución de la pantalla</th>
    <th>Píxeles totales</th>
    <th>Sin comprimir (4 bytes por píxel)</th>
  </tr>
</thead>
<tbody>
<tr>
  <td data-th="resolution">1x</td>
  <td data-th="total pixels">100 x 100 = 10,000</td>
  <td data-th="filesize">40,000 bytes</td>
</tr>
<tr>
  <td data-th="resolution">2x</td>
  <td data-th="total pixels">100 x 100 x 4 = 40 000</td>
  <td data-th="filesize">160,000 bytes</td>
</tr>
<tr>
  <td data-th="resolution">3 veces</td>
  <td data-th="total pixels">100 x 100 x 9 = 90 000</td>
  <td data-th="filesize">360,000 bytes</td>
</tr>
</tbody>
</table></div>

Cuando duplicamos la resolución de la pantalla física, el número total de píxeles aumenta en un factor de cuatro: el doble del número de píxeles horizontales, multiplicado por el doble del número de píxeles verticales. Por lo tanto, una pantalla "2x" no solo duplica, sino que cuadriplica la cantidad de píxeles requeridos.

Entonces, ¿qué significa esto en la práctica? Las pantallas de alta resolución le permiten ofrecer imágenes hermosas, lo que puede ser una gran característica del producto. Sin embargo, las pantallas de alta resolución también requieren imágenes de alta resolución, por lo tanto:

- Prefiera imágenes vectoriales siempre que sea posible, ya que son independientes de la resolución y siempre brindan resultados nítidos.
- Si se requiere una imagen de trama, proporcione [imágenes responsivas](/serve-responsive-images/).

## Características de diferentes formatos de imágenes de trama

Además de los diferentes algoritmos de compresión con y sin pérdida de datos, los diferentes formatos de imagen admiten diferentes características, como canales de animación y transparencia (alfa). Como resultado, la elección del "formato correcto" para una imagen específica es una combinación de los resultados visuales deseados y los requisitos funcionales.

<div class="table-wrapper scrollbar"><table>
<thead>
  <tr>
    <th>Formato</th>
    <th>Transparencia</th>
    <th>Animación</th>
    <th>Navegador</th>
  </tr>
</thead>
<tbody>
<tr>
  <td data-th="format"><a href="http://en.wikipedia.org/wiki/Portable_Network_Graphics">PNG</a></td>
  <td data-th="transparency">Sí</td>
  <td data-th="animation">No</td>
  <td data-th="browser">Todos</td>
</tr>
<tr>
  <td data-th="format"><a href="http://en.wikipedia.org/wiki/JPEG">JPEG</a></td>
  <td data-th="transparency">No</td>
  <td data-th="animation">No</td>
  <td data-th="browser">Todos</td>
</tr>
<tr>
  <td data-th="format"><a href="http://en.wikipedia.org/wiki/WebP">WebP</a></td>
  <td data-th="transparency">Sí</td>
  <td data-th="animation">Sí</td>
  <td data-th="browser">Todos los navegadores modernos. Consulte <a href="https://caniuse.com/#feat=webp">¿Puedo usarlo?</a>
</td>
</tr>
</tbody>
</table></div>

Existen dos formatos de imagen de trama admitidos universalmente: PNG y JPEG. Además de estos formatos, los navegadores modernos admiten el nuevo formato WebP, que ofrece una mejor compresión general y más funciones. Entonces, ¿qué formato deberías usar?

El formato WebP generalmente proporcionará una mejor compresión que los formatos más antiguos y debe usarse siempre que sea posible. Puede usar WebP junto con otro formato de imagen como respaldo. Consulte [Usar imágenes WebP](/serve-images-webp/) para obtener más detalles.

En términos de formatos de imagen más antiguos, considere lo siguiente:

1. **¿Necesitas animaciones? Utilice elementos `<video>`**
    - ¿Y el formato GIF? GIF limita la paleta de colores a un máximo de 256 colores y crea tamaños de archivo significativamente más grandes que los elementos `<video>`. Consulte [Reemplazar los GIF animados por video](/replace-gifs-with-videos/).
2. **¿Necesita conservar los detalles finos con la resolución más alta? Utilice PNG.**
    - PNG no aplica ningún algoritmo de compresión con pérdida de datos más allá de la elección del tamaño de la paleta de colores. Como resultado, producirá una imagen de la más alta calidad, pero a un costo significativamente mayor que otros formatos. Úselo con prudencia.
    - Si el recurso de imagen contiene imágenes compuestas por formas geométricas, ¡considere convertirlo a un formato vectorial (SVG)!
    - Si el recurso de imagen contiene texto, deténgase y reconsidere. El texto de las imágenes no se puede seleccionar, buscar ni ampliar. Si necesita transmitir un aspecto personalizado (por motivos de marca u otras razones), considere utilizar una fuente web.
3. **¿Está optimizando una foto, una captura de pantalla o un recurso de imagen similar? Utilice JPEG.**
    - JPEG utiliza una combinación de optimización con y sin pérdida de datos para reducir el contenido de la imagen. Pruebe varios niveles de calidad JPEG para encontrar la mejor calidad frente en relación con el tamaño para su contenido.

Finalmente, tenga en cuenta que si está utilizando WebView para representar contenido en la aplicación específica de su plataforma, entonces tiene el control total del cliente y puede usar WebP exclusivamente. Facebook y muchos otros usan WebP para todas las imágenes dentro de sus aplicaciones; el ahorro definitivamente vale la pena.
