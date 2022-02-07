---
title: Cómo aplicar efectos a las imágenes con la propiedad mask-image de CSS
subhead: El enmascaramiento de CSS le da la opción de utilizar una imagen como una capa de la máscara. Esto significa que puedes utilizar una imagen, un SVG o un gradiente como máscara, para crear efectos interesantes sin la necesidad de un editor de imágenes.
description: El enmascaramiento de CSS le da la opción de utilizar una imagen como una capa de la máscara. Esto significa que puedes utilizar una imagen, un SVG o un gradiente como máscara, para crear efectos interesantes sin la necesidad de un editor de imágenes.
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/uNWkHLVFNcTDk09OplrA.jpg
alt: Un oso de peluche que lleva una máscara.
tags:
  - blog
  - css
feedback:
  - api
---

Cuando [recorta un elemento](/css-clipping) utilizando la propiedad `clip-path`, el área recortada se vuelve invisible. Si, en cambio, desea hacer opaca una parte de la imagen o aplicarle algún otro efecto, debe utilizar una máscara. En este artículo se explica cómo utilizar la propiedad [`mask-image`](https://developer.mozilla.org/docs/Web/CSS/mask-image) en CSS, que permite especificar una imagen para utilizarla como una capa de máscara. Esto le da tres opciones. Puede utilizar un archivo de imagen como su máscara, un SVG, o un gradiente.

## Compatibilidad con navegadores

La mayoría de los navegadores solo admiten parcialmente la propiedad estándar de enmascaramiento de CSS. Deberá utilizar el prefijo `-webkit-` además de la propiedad estándar para obtener la mejor compatibilidad con los navegadores. Consulte: [¿Puedo utilizar máscaras de CSS?](https://caniuse.com/#feat=css-masks) para obtener información acerca de toda la compatibilidad con los navegadores.

Aunque la compatibilidad con los navegadores mediante la propiedad con el prefijo es buena, cuando se utiliza el enmascaramiento para hacer visible el texto sobre una imagen debe tener en cuenta lo que ocurrirá si el enmascaramiento no está disponible. Puede valer la pena utilizar consultas de características para detectar el soporte para `mask-image` o `-webkit-mask-image` y proporcionar una alternativa legible antes de incorporar su versión enmascarada.

```css
@supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
  /* code that requires mask-image here. */
}
```

## Enmascaramiento con una imagen

La propiedad `mask-image` funciona de forma similar a la propiedad `background-image`. Utilice un valor `url()` para transferir una imagen. La imagen de la máscara debe tener un área transparente o semitransparente.

Un área totalmente transparente hará que la parte de la imagen que está debajo de esa área sea invisible. Sin embargo, si se utiliza un área semitransparente, se mostrará parte de la imagen original. Puede ver la diferencia en el Glitch que aparece a continuación. La primera imagen es la imagen original de los globos sin máscara. En la segunda imagen se aplicó una máscara con una estrella blanca sobre un fondo totalmente transparente. La tercera imagen tiene una estrella blanca sobre un fondo con un gradiente de transparencia.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image?path=index.html&amp;previewSize=100" title="mask-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

En este ejemplo también utilizo la propiedad `mask-size` con un valor de `cover`. Esta propiedad funciona de la misma manera que [`background-size`](https://developer.mozilla.org/docs/Web/CSS/background-size). Puede utilizar las palabras clave `cover` y `contain` o puede asignar al fondo un tamaño por medio de cualquier unidad de longitud válida, o un porcentaje.

También puede repetir su máscara de la misma manera que podría repetir una imagen de fondo, con el fin de utilizar una pequeña imagen como un patrón repetitivo.

## Enmascaramiento con SVG

En vez de utilizar un archivo de imagen como máscara, puede utilizar un SVG. Hay un par de maneras de conseguir esto. La primera es tener un elemento `<mask>` dentro del SVG y consultar el ID de ese elemento en la propiedad `mask-image`.

```html
<svg width="0" height="0" viewBox="0 0 400 300">
  <defs>
    <mask id="mask">
      <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
      <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
      <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
    </mask>
  </defs>
</svg>

<div class="container">
    <img src="balloons.jpg" alt="Balloons">
</div>
```

```css
.container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  -webkit-mask-image: url(#mask);
  mask-image: url(#mask);
}
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3HnPhISiVazDTwezxfcy.jpg", alt="Un ejemplo de uso de una máscara SVG", width="699", height="490" %}</figure>

La ventaja de este enfoque es que la máscara puede aplicarse a cualquier elemento HTML, no solo a una imagen. Lamentablemente, Firefox es el único navegador compatible con este enfoque.

Sin embargo, no todo está perdido, ya que para el escenario más común de enmascarar una imagen, podemos incluir la imagen en el SVG.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image-svg-image?path=README.md&amp;previewSize=100" title="mask-image-svg-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Enmascaramiento con un gradiente

El uso de un gradiente en CSS como máscara es una forma elegante de conseguir un área enmascarada sin necesidad de crear una imagen o un SVG.

Un gradiente lineal simple utilizado como máscara podría garantizar que la parte inferior de una imagen no sea demasiado oscura, por ejemplo, debajo de un pie de foto.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-linear-gradient?path=README.md&amp;previewSize=100" title="mask-linear-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Puede utilizar cualquiera de los tipos de gradientes compatibles, y ser tan creativo como desee. En el siguiente ejemplo se utiliza un gradiente radial para crear una máscara circular que ilumine detrás del pie de foto.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-radial-gradient?path=README.md&amp;previewSize=100" title="mask-radial-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## Cómo utilizar varias máscaras

Al igual que con las imágenes de fondo, puede especificar varias fuentes de máscaras, combinándolas para obtener el efecto que desee. Esto es particularmente útil si desea utilizar un patrón generado con gradientes CSS como su máscara. Estos normalmente utilizarán varias imágenes de fondo, por lo que pueden traducirse fácilmente en una máscara.

Como ejemplo, encontré un bonito patrón en forma de tablero de ajedrez en [este artículo](https://cssgradient.io/blog/gradient-patterns/). El código, con imágenes de fondo, se ve de la siguiente manera:

```css
background-image:
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size:20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Para convertir este, o cualquier otro patrón diseñado para imágenes de fondo, en una máscara, deberá sustituir las propiedades `background-*` por las propiedades `mask` correspondientes, incluyendo las que tienen el prefijo `-webkit`.

```css
-webkit-mask-image:
  linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
  linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
-webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

Hay algunos efectos verdaderamente bonitos que se pueden conseguir al aplicar patrones de gradiente a las imágenes. Intente volver a mezclar el Glitch y probar otras versiones.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-checkers?path=README.md&amp;previewSize=100" title="mask-checkers on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

Junto con el recorte, las máscaras de CSS son una forma de agregar interés a las imágenes y otros elementos HTML sin necesidad de utilizar una aplicación para gráficos.

*<span>Foto de <a href="https://unsplash.com/@juliorionaldo">Julio Rionaldo</a> en Unsplash</span> .*
