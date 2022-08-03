---
layout: post
title: División de código con importaciones dinámicas en Next.js
authors:
  - mihajlija
subhead: |2

  Cómo acelerar su aplicación Next.js con división de código y estrategias de carga inteligente.
date: 2019-11-08
feedback:
  - api
---

## ¿Que aprenderá?

Esta publicación explica diferentes tipos de [división de código](/reduce-javascript-payloads-with-code-splitting/) y cómo usar importaciones dinámicas para acelerar sus aplicaciones Next.js.

## División de código basada en ruta y basada en componente

De forma predeterminada, Next.js divide su JavaScript en partes separadas para cada ruta. Cuando los usuarios cargan su aplicación, Next.js solo envía el código necesario para la ruta inicial. Cuando los usuarios navegan por la aplicación, obtienen los fragmentos asociados con las otras rutas. La división de código basada en rutas minimiza la cantidad de scripts que deben analizarse y compilarse a la vez, lo que da como resultado tiempos de carga de página más rápidos.

Si bien la división de código basada en rutas es un buen valor predeterminado, puede optimizar aún más el proceso de carga con la división de código a nivel de componente. Si tiene componentes grandes en su aplicación, es una buena idea dividirlos en partes separadas. De esa manera, cualquier componente grande que no sea crítico o que solo se procese en determinadas interacciones del usuario (como hacer clic en un botón) puede cargarse de forma diferida.

Next.js admite [dynamic `import()`](https://v8.dev/features/dynamic-import), que le permite importar módulos de JavaScript (incluidos los componentes de React) de forma dinámica y cargar cada importación como un fragmento separado. Esto le brinda división de código a nivel de componente y le permite controlar la carga de recursos para que los usuarios solo descarguen el código que necesitan para la parte del sitio que están viendo. En Next.js, estos componentes se [procesan en el lado del servidor (SSR)](/rendering-on-the-web/) de forma predeterminada.

## Importaciones dinámicas en acción

Esta publicación incluye varias versiones de una aplicación de muestra que consta de una página simple con un botón. Cuando hace clic en el botón, puede ver un lindo cachorro. A medida que avanza por cada versión de la aplicación, verá en qué se diferencian las importaciones dinámicas de las [importaciones estáticas](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) y cómo trabajar con ellas.

En la primera versión de la aplicación, el cachorro vive en `components/Puppy.js`. Para mostrar el cachorro en la página, la aplicación importa el componente `Puppy` en `index.js` con una declaración de importación estática:

```js
import Puppy from "../components/Puppy";
```

{% Glitch { id: 'static-import', path: 'index.js', previewSize: 0, height: 480 } %}

Para ver cómo Next.js agrupa la aplicación, inspeccione el seguimiento de red en DevTools:

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

{% Instruction 'reload-page', 'ol' %}

Cuando carga la página, todo el código necesario, incluyendo el `Puppy.js`, se agrupa en `index.js`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6KWlTYFhoIEIGqnuMwlh.png", alt="La pestaña DevTools Network muestra seis archivos JavaScript: index.js, app.js, webpack.js, main.js, 0.js y el archivo dll (biblioteca de vínculos dinámicos).", width="800", height="665" %}</figure>

Cuando presiona el botón **Click me**, solo se agrega la solicitud del JPEG del cachorro a la pestaña **Red**:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7MkXVqnqfIbW74VV48kB.png", alt="Pestaña DevTools Network después de hacer clic en el botón, que muestra los mismos seis archivos JavaScript y una imagen.", width="800", height="665" %}</figure>

La desventaja de este enfoque es que incluso si los usuarios no hacen clic en el botón para ver el cachorro, tienen que cargar el `Puppy` porque está incluido en `index.js`. En este pequeño ejemplo, eso no es gran cosa, pero en aplicaciones del mundo real a menudo es una gran mejora cargar componentes grandes solo cuando es necesario.

Ahora, eche un vistazo a una segunda versión de la aplicación, en la que la importación estática se reemplaza con una importación dinámica. Next.js incluye `next/dynamic`, lo que hace posible usar importaciones dinámicas para cualquier componente en Next:

```js/1,5/0
import Puppy from "../components/Puppy";
import dynamic from "next/dynamic";

// ...

const Puppy = dynamic(import("../components/Puppy"));
```

{% Glitch {id: 'dynamic-import-nextjs', path: 'pages/index.js:29:10', altura: 480 } %}

Siga los pasos del primer ejemplo para inspeccionar el rastreo de la red.

Cuando carga la aplicación por primera vez, solo se descarga `index.js`. Esta vez es 0,5 KB más pequeño (pasó de 37,9 KB a 37,4 KB) porque no incluye el código del componente `Puppy`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K7Ii3bxUkb37LrZjjWT1.png", alt="DevTools Network muestra los mismos seis archivos JavaScript, excepto que index.js ahora es 0,5 KB más pequeño.", width="800", height="665" %}</figure>

El componente `Puppy` ahora está en un fragmento separado, `1.js`, que se carga solo cuando presiona el botón:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1DfVDv5poQmwXwOKmnvd.png", alt="Pestaña DevTools Network después de hacer clic en el botón, que muestra el archivo adicional 1.js y la imagen agregada al final de la lista de archivos.", width="800", height="665" %}</figure>

{% Aside %} De forma predeterminada, Next.js nombra estos fragmentos dinámicos *número*.js, donde el *número* comienza desde 1. {% endAside %}

En las aplicaciones del mundo real, los componentes suelen ser [mucho más grandes](https://bundlephobia.com/result?p=moment@2.24.0) y la carga diferida puede reducir la carga útil de JavaScript inicial en cientos de kilobytes.

## Importaciones dinámicas con indicador de carga personalizado

Cuando carga recursos de forma diferida, es una buena práctica proporcionar un indicador de carga en caso de que haya retrasos. En Next.js, puede hacerlo proporcionando un argumento adicional a la función `dynamic()`:

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  loading: () => <p>Loading...</p>
});
```

{% Glitch {id: 'dynamic-import-loading', path: 'pages/index.js:7:27', height: 480 } %}

Para ver el indicador de carga en acción, simule una conexión de red lenta en DevTools:

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

1. En la lista desplegable **Throttling**, seleccione **Fast 3G**.

2. Presione el botón **Click me**.

Ahora, cuando hace clic en el botón, se tarda un poco en cargar el componente y, mientras tanto, la aplicación muestra el mensaje "Cargando…".

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tjlpmwolBVp1jh948Fln.png", alt="Una pantalla oscura con el texto \"Cargando…\".", width="800", height="663" %}</figure>

## Importaciones dinámicas sin SSR

Si necesita procesar un componente solo del lado del cliente (por ejemplo, un widget de chat), puede hacerlo configurando la opción `ssr` en `false`:

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  ssr: false,
});
```

{% Glitch {id: 'dynamic-import-no-ssr', path:'pages/index.js: 5: 0', height: 480}%}

## Conclusión

Next.js le brinda división de código a nivel de componente con soporte para importaciones dinámicas, lo que puede minimizar sus cargas útiles de JavaScript y mejorar el tiempo de carga de la aplicación. Todos los componentes se procesan en el lado del servidor de forma predeterminada y puede deshabilitar esta opción siempre que sea necesario.
