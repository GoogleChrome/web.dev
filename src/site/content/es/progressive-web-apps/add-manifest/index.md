---
layout: post
title: Cómo agregar un manifiesto en la aplicación web
authors:
  - petelepage
  - beaufortfrancois
  - thomassteiner
date: 2018-11-05
updated: 2021-10-21
description: El manifiesto de una aplicación web es un archivo sencillo en formato JSON que informa al navegador sobre su aplicación web y cómo debe proceder cuando se instala en el dispositivo móvil o en el escritorio del usuario.
tags:
  - progressive-web-apps
  - web-app-manifest
feedback:
  - api
---

El manifiesto de una aplicación web es un archivo en formato JSON que informa al navegador sobre la Aplicación Web Progresiva y cómo debe proceder cuando se instala en el escritorio o en el dispositivo móvil del usuario. Un archivo anexo habitual incluye el nombre de la aplicación, los iconos que debe utilizar y la URL que debe abrir cuando se inicie la aplicación.

Los archivos del manifiesto son [compatibles](https://developer.mozilla.org/docs/Web/Manifest#Browser_compatibility) con Chrome, Edge, Firefox, UC Browser, Opera y el navegador de Samsung. Safari tiene compatibilidad parcial.

## Cómo crear el archivo del manifiesto {: #create}

El archivo del manifiesto podría llevar cualquier nombre, pero normalmente se llama `manifest.json` y se ejecuta desde la raíz (el directorio de nivel superior de su sitio web). En las especificaciones se sugiere que la extensión sea `.webmanifest`, pero los navegadores también son compatibles con las extensiones `.json`, las cuales pueden ser más fáciles de entender para los desarrolladores.

```json
{
  "short_name": "Weather",
  "name": "Weather: Do I need an umbrella?",
  "icons": [
    {
      "src": "/images/icons-vector.svg",
      "type": "image/svg+xml",
      "sizes": "512x512"
    },
    {
      "src": "/images/icons-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/images/icons-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/?source=pwa",
  "background_color": "#3367D6",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#3367D6",
  "shortcuts": [
    {
      "name": "How's weather today?",
      "short_name": "Today",
      "description": "View weather information for today",
      "url": "/today?source=pwa",
      "icons": [{ "src": "/images/today.png", "sizes": "192x192" }]
    },
    {
      "name": "How's weather tomorrow?",
      "short_name": "Tomorrow",
      "description": "View weather information for tomorrow",
      "url": "/tomorrow?source=pwa",
      "icons": [{ "src": "/images/tomorrow.png", "sizes": "192x192" }]
    }
  ],
  "description": "Weather forecast information",
  "screenshots": [
    {
      "src": "/images/screenshot1.png",
      "type": "image/png",
      "sizes": "540x720"
    },
    {
      "src": "/images/screenshot2.jpg",
      "type": "image/jpg",
      "sizes": "540x720"
    }
  ]
}
```

### Propiedades clave del manifiesto {: #manifest-properties }

#### `short_name` y/o `name` {: #name }

Deberá proporcionar al menos la propiedad `short_name` o `name`. Si se proporcionan ambas, `short_name` se utilizará en la pantalla de inicio del usuario, en el iniciador o en otros lugares donde el espacio podría ser limitado. `name` se utiliza cuando se instala la aplicación.

{% Aside %} Los sistemas operativos normalmente necesitan tener un título para cada ventana de la aplicación. Este título se visualizará en varias superficies que cambian entre ventanas, como <kbd>alt</kbd>+<kbd>tab</kbd>, el modo de vista general y la lista de ventanas de la plataforma.

Para las PWA que se ejecutan en modo autónomo, Chromium antepondrá el `short_name` (o, si `short_name` no está configurado, alternativamente el `name`) el cual se especificará en el `<title>` del documento HTML para evitar ataques simulados en los que las aplicaciones autónomas podrían intentar confundirse, por ejemplo, con diálogos del sistema operativo.

Por lo tanto, los desarrolladores *no* deberían repetir el nombre de la aplicación en el `<title>` cuando la aplicación se ejecuta en modo autónomo. {% endAside %}

#### `icons` {: #icons}

Desde que un usuario instala su PWA, puede definir un conjunto de iconos para que el navegador los utilice en la pantalla de inicio, el iniciador de aplicaciones, el conmutador de tareas, la pantalla de inicio, etc.

La propiedad `icons` es una matriz de objetos con imágenes. Cada objeto debe incluir `src`, una propiedad `sizes` y el `type` de la imagen. Para utilizar [iconos enmascarados](/maskable-icon/), a veces denominados iconos adaptativos en Android, también tendrá que agregar `"purpose": "any maskable"` a la propiedad `icon`.

Para Chromium, se debe proporcionar al menos un icono de 192x192 pixeles, y un icono de 512x512 pixeles. En caso de que únicamente se proporcionen esos dos tamaños de icono, Chrome escalará automáticamente los iconos para que se ajusten al dispositivo. En caso de que prefiera escalar sus propios iconos y ajustarlos a la precisión de los pixeles, proporcione los iconos en incrementos de 48dp.

{% Aside %} Los navegadores basados en Chromium también son compatibles con los iconos SVG que pueden escalarse arbitrariamente sin que su aspecto se vea pixelado y que son compatibles con características avanzadas como [ser responsivos a `prefers-color-scheme`](https://blog.tomayac.com/2021/07/21/dark-mode-web-app-manifest-app-icons/), con la importante advertencia de que los iconos no se actualizan en tiempo real, sino que permanecen en el estado en que se encontraban al momento de instalarse.

Por seguridad, siempre se debe especificar un icono rasterizado como alternativa para los navegadores que no son compatibles con los iconos SVG. {% endAside %}

#### `start_url` {: #start-url}

Se requiere `start_url` y le indica al navegador dónde debe iniciarse su aplicación cuando se ejecute, y evita que la aplicación se inicie en la página que se encontraba el usuario cuando agregó su aplicación a su pantalla de inicio.

Su `start_url` debe llevar al usuario directamente a su aplicación, en vez de a una página de destino del producto. Considere lo que el usuario desee hacer cuando abra su aplicación y colóquelo allí.

#### `background_color` {: #background-color}

La propiedad `background_color` se utiliza en la pantalla de inicio cuando la aplicación se ejecuta por primera vez en el dispositivo móvil.

#### `display` {: #display}

Puede personalizar la interfaz de usuario del navegador para que se muestre cuando se inicie su aplicación. Por ejemplo, puede ocultar la barra de direcciones y el navegador de Chrome. Incluso, puede hacer que los juegos se inicien en pantalla completa.

<div class="table-wrapper scrollbar">
  <table id="display-params">
    <thead>
      <tr>
        <th><strong>Propiedad</strong></th>
        <th><strong>Cómo utilizarla</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>fullscreen</code></td>
        <td>Abre la aplicación web sin ninguna interfaz de usuario en el navegador y ocupa la totalidad del área de visualización disponible.</td>
      </tr>
      <tr>
        <td><code>standalone</code></td>
        <td>Abre la aplicación web para que parezca una aplicación independiente. La aplicación se ejecuta en su propia ventana, separada del navegador, y oculta los elementos estándar de la interfaz de usuario del navegador, como la barra de las URL. <figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/XdBsDeRZozIyXyiXA59n.png", alt="Un ejemplo de una ventana PWA con visualización independiente.", width="800", height="196" %} </figure>
</td>
      </tr>
      <tr>
        <td><code>minimal-ui</code></td>
        <td>Este modo es similar al <code>standalone</code>, pero le ofrece al usuario un conjunto mínimo de elementos de la interfaz de usuario para controlar la navegación (como atrás y recargar). <figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/trPwjcMio7tBKGBNoT9u.png", alt="Un ejemplo de una ventana PWA con visualización mínima de la interfaz de usuario (UI).", width="800", height="196" %} </figure>
</td>
      </tr>
      <tr>
        <td><code>browser</code></td>
        <td>Una experiencia de navegador estándar.</td>
      </tr>
    </tbody>
  </table>
</div>

#### `display_override` {: #display-override}

Las aplicaciones web pueden elegir cómo se muestran al configurar un `display` en su manifiesto como se [explicó anteriormente](#display) . Los navegadores *no* son necesarios para admitir todos los modos de visualización, pero *se* requieren para admitir la [cadena de respaldo para especificaciones definidas](https://w3c.github.io/manifest/#dfn-fallback-display-mode) ( `"fullscreen"` → `"standalone"` → `"minimal-ui"` → `"browser"` ). Si no admiten un modo determinado, retroceden al siguiente modo de visualización en esa cadena. Este comportamiento poco flexible puede ser problemático en casos raros, por ejemplo, un desarrollador no puede solicitar `"minimal-ui"` sin verse obligado a volver al modo de visualización `"browser"` cuando `"minimal-ui"` no es compatible. Otro problema es que el comportamiento actual hace imposible introducir nuevos modos de visualización de una manera compatible con versiones anteriores, ya que las exploraciones como el modo de las aplicaciones con pestañas no tienen un lugar natural en la cadena de respaldo.

Estos problemas se resuelven con la propiedad `display_override`, que el navegador toma en consideración *antes* que la propiedad `display`. Su valor es una secuencia de cadenas que se contemplan en el orden indicado, y se aplica el primer modo de visualización compatible. Si no se admite ninguno, el navegador volverá a evaluar el campo `display`.

En el siguiente ejemplo, la cadena de respaldo en el modo de visualización sería la siguiente. (Los detalles de `"window-control-overlay"` están fuera del objetivo de este artículo).

1. `"window-control-overlay"` (Primero, observar `display_override` ).
2. `"minimal-ui"`
3. `"standalone"` (Cuando `display_override` está saturado , evaluar `display`).
4. `"minimal-ui"` (Finalmente, utilizar la cadena de respaldo de `display`).
5. `"browser"`

```json
{
  "display_override": ["window-control-overlay", "minimal-ui"],
  "display": "standalone",
}
```

{% Aside %} El navegador no considerará la opción `display_override` a no ser que `display` también esté presente. {% endAside %}

#### `scope` {: #scope}

El `scope` define el conjunto de URL que el navegador considera que se encuentran dentro de su aplicación, y se utiliza para decidir si el usuario ya salió de la aplicación. El `scope` controla la estructura de la URL que engloba todos los puntos de entrada y salida de su aplicación web. Su `start_url` debe residir dentro del `scope`.

{% Aside 'caution' %} Si el usuario hace clic en un enlace en su aplicación que navega fuera del `scope`, el enlace se abrirá y renderizará dentro de la ventana disponible de la PWA. Si quiere que el enlace se abra en una pestaña del navegador, debe agregar `target="_blank"` a la etiqueta `<a>`. En Android, los enlaces con `target="_blank"` se abrirán en una [Pestaña personalizada de Chrome](https://developer.chrome.com/multidevice/android/customtabs). {% endAside %}

Algunas otras notas sobre el `scope` :

- Si no incluye un `scope` en su manifiesto, el `scope` que está implicado de forma predeterminada será el directorio desde el que se publica el manifiesto de su aplicación web.
- El atributo `scope` puede ser una ruta relativa (`../`), o cualquier ruta de nivel superior (`/`) que permita aumentar la cobertura de la navegación en su aplicación web.
- `start_url` debe estar en el alcance.
- `start_url` se relaciona con la ruta definida en el atributo `scope`
- Una `start_url` que comience con `/` siempre será la raíz del origen.

#### `theme_color` {: #theme-color}

El `theme_color` establecerá el color de la barra de herramientas, y puede reflejarse en la vista previa de la aplicación en los alternadores de tareas. El `theme_color` debe coincidir con el color del tema `meta` que se especifica en el encabezado del documento.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8mkBdT3O0FZLo0PUppvv.png", alt="Este es un ejemplo de una ventana PWA con un color de tema personalizado.", width="800", height="196" %}</figure>

A partir de Chromium 93 y Safari 15, puede ajustar este color basándose en una consulta de medios con el atributo `media` del elemento con el color del tema `meta`. Se elegirá el primero que coincida. Por ejemplo, puede tener un color para el modo claro y otro para el modo oscuro. Al momento de escribir esto, no se pueden definir en el manifiesto. Consulte [w3c/manifest#975 GitHub issue](https://github.com/w3c/manifest/issues/975).

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="white">
<meta name="theme-color" media="(prefers-color-scheme: dark)"  content="black">
```

#### `shortcuts` {: #shortcuts}

La propiedad `shortcuts` es una matriz de objetos en una [aplicación de accesos directos](/app-shortcuts) cuyo objetivo es proporcionar un acceso rápido a las tareas clave dentro de su aplicación. Cada miembro es un diccionario que contiene al menos un `nombre` y una `url`.

#### `description` {: #description}

En la propiedad `description` se describe el propósito de su aplicación.

#### `screenshots` {: #screenshots}

La propiedad `screenshots` es una matriz de objetos con imágenes, que representan su aplicación en escenarios de uso común. Cada objeto debe incluir las propiedades `src`, `sizes` y `type` de la imagen.

En Chrome, la imagen debe adaptarse a los siguientes criterios:

- El ancho y el alto deben ser como mínimo de 320px y como máximo de 3,840px.
- Las dimensiones máximas no pueden ser 2. 3 veces mayores que las dimensiones mínimas.
- Las capturas de pantalla deben tener la misma relación de aspecto.
- Solo se admiten los formatos de imágenes JPEG y PNG.

{% Aside 'gotchas' %} Las propiedades `description` y `screenshots` actualmente solo se utilizan en Chrome para Android cuando un usuario desea instalar su aplicación. {% endAside %}

## Agregue el manifiesto de la aplicación web a sus páginas {: #link-manifest }

Después de crear el manifiesto, agregue una etiqueta `<link>` a todas las páginas de su Aplicación Web Progresiva. Por ejemplo:

```html
<link rel="manifest" href="/manifest.json">
```

{% Aside 'gotchas' %} La solicitud del manifiesto se realiza **sin** credenciales (aunque se encuentre en el mismo dominio), por lo que si el manifiesto requiere credenciales, debe incluir `crossorigin="use-credentials"` en la etiqueta del manifiesto. {% endAside %}

## Pruebe su manifiesto {: #test-manifest }

Para verificar que su manifiesto se configuró correctamente, utilice el panel **Manifiesto** que aparece en el panel **Aplicación** de Chrome DevTools.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FpIOY0Ak6FAA5xMuB9IT.png", alt="El panel de aplicaciones en Chrome Devtools con la pestaña Manifiesto seleccionada.", width="800", height="601" %}</figure>

En este panel se ofrece una versión legible para las personas sobre muchas de las propiedades que componen el manifiesto, y hace que sea fácil verificar que todas las imágenes se carguen correctamente.

## Pantallas de inicio en el dispositivo móvil {: #splash-screen }

Cuando su aplicación se ejecuta por primera vez en el dispositivo móvil, el navegador puede tardar unos momentos en arrancar y el contenido inicial puede comenzar a renderizarse. En vez de mostrar una pantalla blanca que permita al usuario pensar que la aplicación está congelada, el navegador mostrará una pantalla de inicio hasta la primera imagen.

Chrome automáticamente creará la pantalla de inicio a partir de las propiedades del manifiesto, específicamente a través de lo siguiente:

- `name`
- `background_color`
- `icons`

El `background_color` debe ser del mismo color que la página que se carga, para proporcionar una transición suave de la pantalla de inicio a su aplicación.

Chrome elegirá el icono que más se aproxime a la resolución que tenga el dispositivo. En la mayoría de los casos es suficiente con proporcionar iconos de 192px y 512px, pero puede proporcionar iconos adicionales para perfeccionar la resolución de los pixeles.

## Lecturas complementarias

Hay varias propiedades adicionales que pueden agregarse al manifiesto de la aplicación web. Consulte la [documentación del manifiesto de aplicaciones web MDN](https://developer.mozilla.org/docs/Web/Manifest) sobre este tema. Puede obtener más información sobre `display_override` en el [explicador](https://github.com/WICG/display-override/blob/master/explainer.md).
