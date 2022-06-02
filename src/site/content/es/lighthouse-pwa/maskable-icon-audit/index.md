---
layout: post
title: El manifiesto no tiene un icono enmascarable
description: |2-

  Aprenda cómo agregar compatibilidad con íconos enmascarables a su PWA.
web_lighthouse:
  - icono enmascarable
date: 2020-05-06
---

[Los íconos enmascarables](/maskable-icon/) son un nuevo formato de ícono que garantiza que el ícono de su PWA se vea genial en todos los dispositivos Android. En los dispositivos Android más nuevos, los íconos de PWA que no siguen el formato de ícono enmascarable tienen un fondo blanco. Cuando usted usa un ícono enmascarable, asegura que el ícono ocupe todo el espacio que le proporciona Android.

## Cómo falla la auditoría de los íconos enmascarables de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que no tienen soporte de íconos enmascarables:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0lXCcsZdOeLZuAw3wbY.jpg", alt="La auditoría de ícono enmascarable en la interfaz de usuario de Lighthouse Report.", width="800", height="110" %}</figure>

Para aprobar la auditoría:

- Debe existir un manifiesto de aplicación web.
- El manifiesto de la aplicación web debe tener una matriz `icons`
- La matriz `icons` debe contener un objeto con una propiedad `purpose`, y el valor de esa propiedad `purpose` debe incluir `maskable`.

{% Aside 'caution' %} Lighthouse no inspecciona la imagen que se especifica como el ícono enmascarable. Deberá verificar manualmente que la imagen se muestre bien. {% endAside %}

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Cómo agregar compatibilidad con íconos enmascarables a su PWA

1. Utilice [Maskable.app Editor](https://maskable.app/editor) para convertir un ícono existente en un ícono enmascarable.

2. Agregue la propiedad `purpose` a uno de los objetos de `icons` en el [manifiesto de su aplicación web](/add-manifest/). Establezca el valor de `purpose` en `maskable` o `any maskable`. Consulte la sección [Valores](https://developer.mozilla.org/docs/Web/Manifest/icons#Values).

    ```json/8
    {
      …
      "icons": [
        …
        {
          "src": "path/to/maskable_icon.png",
          "sizes": "196x196",
          "type": "image/png",
          "purpose": "any maskable"
        }
      ]
      …
    }
    ```

3. Utilice Chrome DevTools para verificar que el ícono enmascarable se muestre correctamente. Consulte [¿Están listos mis íconos actuales?](/maskable-icon/#are-my-current-icons-ready)

## Recursos

- [El código fuente de **El manifiesto no tiene una auditoría de ícono enmascarable**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/maskable-icon.js)
- [Soporte de íconos adaptables en PWA con íconos enmascarables](/maskable-icon/)
- [Editor de Maskable.app](https://maskable.app/editor)
- [Agregar un manifiesto de aplicación web](/add-manifest/)
- [La propiedad de los `icons` en MDN](https://developer.mozilla.org/docs/Web/Manifest/icons)
