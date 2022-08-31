---
layout: post
title: Minificar CSS
description: |2-

  Obtenga más información sobre la auditoría de CSS sin minificar.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - unminified-css
---

La sección Oportunidades de su informe Lighthouse enumera todos los archivos CSS sin minificar, junto con los ahorros potenciales en [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte) cuando estos archivos se minifican:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/C1ah0bnY6JQsffdO446S.png", alt="Una captura de pantalla de la auditoría de Lighthouse Minify CSS", width="800", height="212" %}</figure>

## Cómo la minificación de archivos CSS puede mejorar el rendimiento

La minificación de los archivos CSS puede mejorar el rendimiento de carga de su página. Los archivos CSS suelen ser más grandes de lo necesario. Por ejemplo:

```css
/* El fondo del encabezado debe concordar con los colores de la marca. */
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

Algunos minificadores emplean trucos ingeniosos para minimizar los bytes. Por ejemplo, el valor de color `#000000` se puede reducir aún más a `#000`, que es su equivalente abreviado.

Lighthouse proporciona una estimación de los ahorros potenciales en función de los comentarios y los espacios en blanco que encuentra en su CSS. Esta es una estimación conservadora. Como se mencionó anteriormente, los minificadores pueden realizar optimizaciones inteligentes (como reducir `#000000` a `#000`) para reducir aún más el tamaño de su archivo. Por lo tanto, si usa un minificador, es posible que vea más ahorros de los que informa Lighthouse.

## Use un minificador de CSS para minificar su código CSS

Para sitios pequeños que no usted actualiza con frecuencia, probablemente pueda usar un servicio en línea para minificar manualmente sus archivos. Debe pegar su CSS en la interfaz de usuario del servicio para que le devuelva una versión reducida del código.

Para los desarrolladores profesionales, probablemente desee configurar un flujo de trabajo automatizado que minifique su CSS automáticamente antes de implementar su código actualizado. Esto generalmente se logra con una herramienta de compilación como Gulp o Webpack.

Aprenda a minificar su código CSS en [Minificar CSS](/minify-css).

## Orientación específica de la pila

### Drupal

Habilite los **archivos CSS agregados** en **Administración** &gt; **Configuración** &gt; **Desarrollo**. También puede configurar opciones de agregación más avanzadas a través de los [módulos adicionales](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=css+aggregation&solrsort=iss_project_release_usage+desc&op=Search) para acelerar su sitio al concatenar, minificar y comprimir sus estilos CSS.

### Joomla

Varias [extensiones](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance) de Joomla pueden acelerar su sitio al concatenar, minificar y comprimir sus estilos CSS. También existen plantillas que brindan esta funcionalidad.

### Magento

Habilite la [opción **Minificar archivos CSS**](https://devdocs.magento.com/guides/v2.3/performance-best-practices/configuration.html?itm_source=devdocs&itm_medium=search_page&itm_campaign=federated_search&itm_term=minify%20css%20files) en la configuración de desarrollador de su tienda.

### React

Si su sistema de compilación minifica los archivos CSS automáticamente, asegúrese de estar implementando la [compilación](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) de producción de su aplicación. Puede verificar esto con la extensión de Herramientas del desarrollador de React.

### WordPress

Varios [complementos](https://wordpress.org/plugins/search/minify+css/) de WordPress pueden acelerar su sitio al concatenar, minificar y comprimir sus estilos. También es posible que desee utilizar un proceso de construcción para hacer esta minificación por adelantado si es posible.

## Recursos

- [Código fuente para la auditoría **Minificar CSS**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/unminified-css.js)
- [Minificar CSS](/minify-css)
- [Minifique y comprima las cargas útiles de la red](/reduce-network-payloads-using-text-compression)
