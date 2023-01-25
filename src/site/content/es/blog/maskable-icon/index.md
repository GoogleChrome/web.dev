---
title: Soporte de íconos adaptables en PWAs con íconos enmascarables
subhead: Un nuevo formato de ícono para utilizar íconos adaptables en plataformas de soporte.
description: Los íconos enmascarables son un nuevo formato de ícono que te dan más control y permiten que tu Aplicación Web Progresiva (PWA por sus siglas en inglés ) utilice íconos adaptables. Al suministrar un ícono enmascarable, tu ícono puede verse fantástico en todos los dispositivos Android.
authors:
  - tigeroakes
  - thomassteiner
date: 2019-12-19
updated: 2021-05-19
hero: image/admin/lzLo9JCh6bcehH2nSH0n.png
alt: Íconos contenidos dentro de círculos blancos en comparación con íconos que cubren todo su círculo
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

## ¿Qué son los iconos enmascarables? {: #qué }

Si has instalado una Aplicación Web Progresiva en un teléfono Android reciente, es posible que observes que el ícono aparece con un fondo blanco. Android Oreo introdujo íconos adaptables, que muestran una variedad de formas de íconos de aplicaciones en diferentes modelos de dispositivos. Los íconos que no siguen este nuevo formato tienen un fondo blanco.

<figure>{% Img src="image/admin/jzjx6dGkXN9EdqnUzAeg.png", alt="PWA icons in white circles on Android", width="400", height="100" %} <figcaption> Los íconos transparentes de PWA aparecen dentro de círculos blancos en Android</figcaption></figure>

Los íconos enmascarables son un nuevo formato de íconos que te brindan más control y permiten que tu Aplicación Web Progresiva utilice íconos adaptables. Si proporcionas un ícono enmascarable, tu ícono puede llenar toda la forma y verse bien en todos los dispositivos Android. Firefox y Chrome han agregado recientemente soporte para este nuevo formato, y puede adoptarlo en sus aplicaciones.

<figure>{% Img src="image/admin/J7gkg9ylP2ANlFawblze.png", alt="PWA icons covering the entire circle on Android", width="400", height="100" %} <figcaption> En su lugar, los iconos enmascarables cubren todo el círculo</figcaption></figure>

## ¿Están listos mis íconos actuales?

Dado que los íconos enmascarables necesitan admitir una variedad de formas, se suministra una imagen opaca con algo de relleno que el navegador puede recortar posteriormente en la forma y tamaño deseados. Es mejor no depender de ninguna forma en particular, ya que la forma finalmente elegida puede variar según el navegador y la plataforma.

<figure data-float="right">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/mx1PEstODUy6b5TXjo4S.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tw7QbXq9SBjGL3UYW0Fq.mp4"], autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> Diferentes formas específicas de la plataforma </figcaption></figure>

Afortunadamente, existe una ["zona mínima segura" bien definida y estandarizada](https://w3c.github.io/manifest/#icon-masks) que todas las plataformas respetan. Las partes importantes de su ícono, como el logotipo, deben estar dentro de un área circular en el centro del ícono con un radio igual al 40% del ancho del ícono. El 10% del borde exterior puede recortarse.

Puedes verificar qué partes de tus íconos aterrizan dentro de la zona segura con Chrome DevTools. Con tu Aplicación Web Progresiva abierta, inicia DevTools y navega hasta el panel de **aplicaciones.** En la **sección Iconos**, puedes elegir **Mostrar solo el área segura mínima para íconos enmascarables**. Tus íconos se recortarán para que solo el área segura sea visible. Si tu logotipo es visible dentro de esta área segura, estás listo para comenzar.

<figure>{% Img src="image/admin/UeKTJM2SE0SQhgnnyaQG.png", alt="Applications panel in DevTools displaying PWA icons with edges cropped", width="762", height="423" %} <figcaption>Panel de aplicaciones</figcaption></figure>

Para probar tu ícono enmascarable con la variedad de formas de Android, usa la [herramienta Maskable.app](https://maskable.app/) que he creado. Abre un ícono, luego Maskable.app te permitirá probar varias formas y tamaños, y podrás compartir la vista previa con otros miembros de tu equipo.

## ¿Cómo adopto íconos enmascarables?

Si deseas crear un ícono enmascarable basado en un ícono existente, puedes usar el [Editor de Maskable.app](https://maskable.app/editor). Sube tu ícono, ajusta el color y el tamaño, luego exporta la imagen.

<figure>{% Img src="image/admin/MDXDwH3RWyj4po6daeXw.png", alt="Maskable.app Editor screenshot", width="670", height="569" %}<br>Creación de íconos en Maskable.app Editor</figure>

Una vez que hayas creado una imagen de ícono enmascarable y la hayas probado en DevTools, deberás actualizar el [manifiesto de tu aplicación web](/add-manifest/) para que apunte a los nuevos recursos. El manifiesto de la aplicación web proporciona información sobre tu aplicación web en un archivo JSON e incluye una[matriz de `icons`](/add-manifest/#icons).

Con la inclusión de íconos enmascarables, se ha agregado un nuevo valor de propiedad para los recursos de imagen enumerados en un manifiesto de aplicación web. El campo `purpose` le dice al navegador cómo debe usarse tu ícono. De forma predeterminada, los íconos tendrán el propósito de `"any"`. Estos íconos cambiarán de tamaño sobre un fondo blanco en Android.

Los íconos enmascarables deben tener un propósito diferente: `"maskable"`. Esto indica que una imagen está destinada a ser utilizada con máscaras de íconos, dándole más control sobre el resultado. De esta forma, tus íconos no tendrán un fondo blanco. También puedes especificar varios propósitos separados por espacios (por ejemplo, `"any maskable"`), si deseas que tu ícono enmascarable se use sin máscara en otros dispositivos.

{% Aside %} Si bien *puedes* especificar varios propósitos separados por espacios como `"any maskable"`, en la práctica no *deberías hacerlo*. Utilizar los íconos `"maskable"` como íconos `"any"` no es óptimo, ya que el ícono se va a utilizar tal cual, lo que provoca un exceso de relleno y hace que el contenido del ícono principal sea más pequeño. Idealmente, los íconos para el propósito `"any"` deberían tener regiones transparentes y sin relleno adicional, como los favicons de su sitio, ya que el navegador no los agregará. {% endAside %}

```json
{
  …
  "icons": [
    …
    {
      "src": "path/to/regular_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "path/to/maskable_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "maskable" // <-- New property value `"maskable"`
    },
    …
  ],
  …
}
```

Con esto, puedes continuar y crear tus propios íconos enmascarables, asegurándote de que tu aplicación se vea bien de borde a borde (y por si acaso, de círculo a círculo, de óvalo a óvalo 😄).

## Agradecimientos

Este artículo fue revisado por [Joe Medley](https://github.com/jpmedley) .
