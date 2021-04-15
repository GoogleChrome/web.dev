---
layout: post
title: Minificar CSS
description: Obtenga más información sobre la auditoría de CSS no minimizado.
date: '2019-05-02'
updated: '2020-05-29'
web_lighthouse:
  - unminified-css
---

La sección Oportunidades de su informe Lighthouse enumera todos los archivos CSS no minificados, junto con los ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) cuando estos archivos se minifican:

<figure class="w-figure"><img class="w-screenshot" src="unminified-css.png" alt="Una captura de pantalla de la auditoría de Lighthouse Minify CSS"></figure>

## Cómo la minificación de archivos CSS puede mejorar el rendimiento

La minimización de los archivos CSS puede mejorar el rendimiento de carga de su página. Los archivos CSS suelen ser más grandes de lo necesario. Por ejemplo:

```css
/* Header background should match brand colors. */
h1 {
  background-color: #000000;
}
h2 {
  background-color: #000000;
}
```

Puede reducirse a:

```css
h1, h2 { background-color: #000000; }
```

Desde la perspectiva del navegador, estos 2 ejemplos de código son funcionalmente equivalentes, pero el segundo ejemplo usa menos bytes. Los minificadores pueden mejorar aún más la eficiencia de bytes al eliminar los espacios en blanco:

```css
h1,h2{background-color:#000000;}
```

Algunos minificadores emplean trucos ingeniosos para minimizar los bytes. Por ejemplo, el valor de color `#000000` se puede reducir aún más a `#000` , que es su equivalente abreviado.

Lighthouse proporciona una estimación de los ahorros potenciales en función de los comentarios y los espacios en blanco que encuentra en su CSS. Esta es una estimación conservadora. Como se mencionó anteriormente, los minificadores pueden realizar optimizaciones inteligentes (como reducir `#000000` a `#000` ) para reducir aún más el tamaño de su archivo. Por lo tanto, si usa un minificador, es posible que vea más ahorros de los que informa Lighthouse.

## Use un minificador de CSS para minimizar su código CSS

Para los sitios pequeños que no actualiza con frecuencia, probablemente pueda usar un servicio en línea para minificar manualmente sus archivos. Pega su CSS en la interfaz de usuario del servicio y devuelve una versión reducida del código.

Para los desarrolladores profesionales, probablemente desee configurar un flujo de trabajo automatizado que minimice su CSS automáticamente antes de implementar su código actualizado. Esto generalmente se logra con una herramienta de compilación como Gulp o Webpack.

Aprenda a minimizar su código CSS en [Minify CSS](/minify-css) .

## Recursos

- [Código fuente para la auditoría de **Minify CSS**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-css.js)
- [Minificar CSS](/minify-css)
- [Minimice y comprima las cargas útiles de la red](/reduce-network-payloads-using-text-compression)
