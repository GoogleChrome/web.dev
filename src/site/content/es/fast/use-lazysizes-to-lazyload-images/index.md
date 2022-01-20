---
layout: post
title: Utilice lazysizes para cargar imágenes de forma diferida
authors:
  - katiehempenius
description: La carga diferida es la estrategia de cargar recursos a medida que se necesitan, en vez de hacerlo por adelantado. Este enfoque libera recursos durante la carga inicial de la página y evita cargar contenido que nunca se utiliza.
date: 2018-11-05
updated: 2019-04-10
codelabs:
  - codelab-use-lazysizes-to-lazyload-images
tags:
  - performance
  - images
feedback:
  - api
---

{% Aside 'note' %} ¡La carga diferida a nivel del navegador ya está disponible! Consulte el artículo [Carga diferida incorporada para la web](/browser-level-image-lazy-loading/) para aprender cómo usar el atributo `loading` y aprovechar los lazysizes como alternativa para los navegadores que aún no lo admiten. {% endAside %}

La **carga diferida** es la estrategia de cargar recursos a medida que se necesitan, en vez de hacerlo por adelantado. Este enfoque libera recursos durante la carga inicial de la página y evita cargar contenido que nunca se utiliza.

Las imágenes que están fuera de la pantalla durante la carga de la página inicial son candidatas ideales para esta técnica. Lo mejor de todo es que [lazysizes](https://github.com/aFarkas/lazysizes) hace que esta sea una estrategia muy simple de implementar.

## ¿Qué es lazysizes?

[lazysizes](https://github.com/aFarkas/lazysizes) es la biblioteca más popular para imágenes de carga diferida. Es un script que carga imágenes de manera inteligente a medida que el usuario se mueve por la página y prioriza las imágenes que el usuario encontrará en breve.

## Agregar lazysizes

Agregar lazysizes es simple:

- Agregue el script lazysizes a sus páginas.
- Escoja las imágenes que desea cargar de forma diferida.
- Actualice las etiquetas `<img>` o `<picture>` para esas imágenes.

### Agregue el script lazysizes

Agregue el [script](https://github.com/aFarkas/lazysizes/blob/gh-pages/lazysizes.min.js) lazysizes a sus páginas:

```html
<script src="lazysizes.min.js" async></script>
```

### Actualice las etiquetas `<img>` o `<picture>`

**`<img>` instrucciones de la etiqueta**

**Antes:**

```html
<img src="flower.jpg" alt="">
```

**Después:**

```html
<img data-src="flower.jpg" class="lazyload" alt="">
```

Al actualizar la etiqueta `<img>`, usted realizará dos cambios:

- **Agregará la clase `lazyload`**: esto indica a lazysizes que la imagen debe cargarse de forma diferida.
- **Cambiará el atributo `src` a `data-src`**: cuando llegue el momento de cargar la imagen, el código lazysizes establece el atributo `src` de la imagen utilizando el valor del atributo `data-src`.

**`<picture>` instrucciones de la etiqueta**

**Antes:**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

**Después:**

```html
<picture>
  <source type="image/webp" data-srcset="flower.webp">
  <source type="image/jpeg" data-srcset="flower.jpg">
  <img data-src="flower.jpg" class="lazyload" alt="">
</picture>
```

Al actualizar la etiqueta `<picture>`, usted realizará dos cambios:

- Agregará la clase de `lazyload` a la etiqueta `<img>`
- Cambiará el atributo `srcset` de la etiqueta `<source>` para `data-srcset`.

{% Aside 'codelab' %} [Utilice lazysizes para cargar solo las imágenes que se encuentran en la ventana gráfica actual](/codelab-use-lazysizes-to-lazyload-images) . {% endAside %}

## Verificar

Abra DevTools y desplácese hacia abajo en la página para ver estos cambios en acción. A medida que se desplaza, debería ver que se producen nuevas solicitudes de red y que las clases de las etiquetas `<img>` cambian de `lazyload` a `lazyloaded`.

Adicionalmente, puede usar Lighthouse para verificar que no se ha olvidado de cargar las imágenes fuera de la pantalla de forma diferida. Ejecute la Auditoría de rendimiento de Lighthouse en Lighthouse&gt; Opciones&gt; Rendimiento (**Lighthouse&gt; Options&gt; Performance**) y busque los resultados de la auditoría Aplazar imágenes fuera de pantalla (**Defer offscreen images**).
