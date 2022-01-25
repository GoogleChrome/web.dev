---
layout: codelab
title: Carga diferida de imágenes fuera de pantalla con lazysizes
authors:
  - katiehempenius
description: En este codelab, aprenda a usar lazysizes para cargar solo imágenes que están en la ventana gráfica actual.
date: 2018-11-05
glitch: lazysizes
related_post: use-lazysizes-to-lazyload-images
tags:
  - performance
---

Se llama carga diferida al enfoque de esperar para cargar los recursos hasta que se necesiten, en lugar de cargarlos por adelantado. Esto puede mejorar el rendimiento al reducir la cantidad de recursos que deben cargarse y analizarse en la carga inicial de la página.

Las imágenes que están fuera de pantalla durante la carga inicial de la página son candidatas ideales para esta técnica. Lo mejor de todo es que [lazysizes](https://github.com/aFarkas/lazysizes) hace que sea una estrategia muy simple de implementar.

## Agregue el script lazysizes a la página

{% Instruction 'remix' %}

`lazysizes.min.js` ya ha sido descargado y agregado a este Glitch. Para incluirlo en la página:

- Agregue la siguiente etiqueta `<script>` a  `index.html` :

```html/0
  <script src="lazysizes.min.js" async></script>
  <!-- Images End -->
</body>
```

{% Aside %} El archivo [lazysizes.min.js](https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js) ya se agregó a este proyecto, por lo que no es necesario agregarlo por separado. El script que acaba de agregar puede utilizar este script. {% endAside %}

lazysizes cargará imágenes de forma inteligente a medida que el usuario se desplaza por la página y priorizará las imágenes que el usuario encontrará pronto.

## Indique qué imágenes cargar de forma diferida

- Agregue la clase `lazyload` a las imágenes que deberían cargarse de forma diferida. Además, cambie el atributo `src` por `data-src` .

Por ejemplo, los cambios para `flower3.png` se verían así:

```html/1/0
<img src="images/flower3.png" alt="">
<img data-src="images/flower3.png" class="lazyload" alt="">
```

Para este ejemplo, pruebe cargar de forma diferida `flower3.png`, `flower4.jpg` y `flower5.jpg`.

{% Aside %} Quizás se pregunte por qué es necesario cambiar el atributo `src` por `data-src` . Si no se cambia este atributo, todas las imágenes se cargarán inmediatamente en lugar de cargarse de forma diferida. `data-src` no es un atributo que el navegador reconoce, así que, cuando encuentra una etiqueta de imagen con este atributo, no carga la imagen. En este caso, eso es algo bueno, porque permite que el script lazysizes decida cuándo se debe cargar la imagen, en lugar del navegador. {% endAside %}

## Véalo en acción

¡Eso es todo! Para ver estos cambios en acción, siga estos pasos:

{% Instruction 'preview' %}

- Abra la consola y busque las imágenes que se acaban de agregar. Sus clases deberían cambiar de `lazyload` a `lazyloaded` a medida que se desplaza hacia abajo en la página.

{% Img src="image/admin/yXej5KAOMzoqoQAB2paq.png", alt="Imágenes que se cargan de forma diferida", width="428", height="252" %}

- Observe el panel de red para ver que los archivos de imagen se cargan individualmente a medida que se desplaza hacia abajo en la página.

{% Img src="image/admin/tcQpLeAubOW1l42eyXiW.png", alt="Imágenes que se cargan de forma diferida", width="418", height="233" %}

## Verifique usando Lighthouse

Por último, es una buena idea utilizar Lighthouse para verificar estos cambios. La auditoría de rendimiento "Aplazar imágenes fuera de pantalla" de Lighthouse indicará si ha olvidado agregar la carga diferida a las imágenes fuera de la pantalla.

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. Verifique que se haya aprobado la auditoría de **aplazar imágenes fuera de pantalla.**

{% Img src="image/admin/AWMJnCEi3IAgANHhTgiC.png", alt="Pasar la auditoría 'Codificar imágenes de manera eficiente' en Lighthouse", width="800", height="774" %}

¡Perfecto! Ha utilizado lazysizes para cargar de forma diferida las imágenes en su página.
