---
layout: post
title: Pre-renderizar rutas con react-snap
subhead: "¿No desea renderizar en el lado del servidor pero sí acelerar el rendimiento de su sitio React? ¡Pruebe el pre-renderizado!"
hero: image/admin/LTvlmRgA6MLec9QT4Tsv.jpg
date: 2019-04-29
description: 'react-snap es una biblioteca de terceros que pre-renderiza las páginas de su sitio en archivos HTML estáticos. Esto puede mejorar los tiempos de First Paint: Primer Trazado en su aplicación.'
authors:
  - houssein
feedback:
  - api
---

[`react-snap`](https://github.com/stereobooster/react-snap) es una biblioteca de terceros que pre-renderiza las páginas de su sitio en archivos HTML estáticos. Esto puede mejorar los tiempos de [First Paint](/user-centric-performance-metrics/#important-metrics-to-measure) en su aplicación.

A continuación, se muestra una comparación de la misma aplicación con y sin pre-renderizado cargada en una conexión 3G simulada y un dispositivo móvil:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t5OiDw1VGxrbqbcxMh3J.gif", alt="Una comparación de carga de lado a lado. La versión que usa el renderizado previo se carga 4.2 segundos más rápido.", width="600", height="435" %}</figure>

{% Aside %} `react-snap` no es la única biblioteca que puede pre-renderizar contenido HTML estático para su aplicación React. [`react-snapshot`](https://github.com/geelen/react-snapshot) es otra alternativa. {% endAside %}

## ¿Por qué es útil esto?

El principal problema de rendimiento con las aplicaciones grandes de una sola página es que el usuario debe esperar a que los paquetes de JavaScript que componen el sitio terminen de descargarse antes de poder ver contenido real. Cuanto más grandes sean los paquetes, más tiempo tendrá que esperar el usuario.

Para resolverlo, muchos desarrolladores adoptan el enfoque de renderizar la aplicación en el servidor en lugar de solo iniciarla en el navegador. Con cada transición de página/ruta, el HTML completo se genera en el servidor y se envía al navegador, lo que reduce los tiempos de First Paint pero tiene el costo de un Time to First Byte: Tiempo hasta el primer byte más lento.

**La pre renderización** es una técnica independiente que es menos compleja que la renderización en servidor, pero también da una forma de mejorar los tiempos de First Paint en su aplicación. Se utiliza un navegador sin encabezado o sin interfaz de usuario para generar archivos HTML estáticos de cada ruta durante el *tiempo de compilación*. Estos archivos se pueden enviar junto con los paquetes de JavaScript necesarios para la aplicación.

## react-snap

`react-snap` usa [Puppeteer](https://github.com/GoogleChrome/puppeteer) para crear archivos HTML pre-renderizados de diferentes rutas en su aplicación. Para comenzar, instálelo como una dependencia de desarrollo:

```bash
npm install --save-dev react-snap
```

Luego agregue un script `postbuild` en su  `package.json`:

```json
"scripts": {
  //...
  "postbuild": "react-snap"
}
```

Esto ejecutará automáticamente el comando `react-snap` cada vez que se realice una nueva compilación de la aplicación (`npm build`).

{% Aside %} `npm` admite comandos *pre* y *post* para scripts principales y arbitrarios que siempre se ejecutarán directamente antes o después del script original, respectivamente. Puede obtener más información en la [documentación de npm](https://docs.npmjs.com/misc/scripts). {% endAside %}

Lo último que se necesita es cambiar la forma en que se inicia la aplicación. Cambie el archivo `src/index.js` a lo siguiente:

```js/6,8-12/5
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}
```

En lugar de solo usar `ReactDOM.render` para renderizar el elemento React raíz directamente en el DOM, esto verifica si ya hay nodos secundarios presentes para determinar si el contenido HTML fue pre-renderizado (o renderizado en el servidor). Si ese es el caso, se usa en su lugar `ReactDOM.hydrate` para adjuntar escuchas de eventos al HTML ya creado en lugar de crearlo de nuevo.

La creación de la aplicación generará ahora archivos HTML estáticos como cargas útiles para cada ruta rastreada. Puede ver cómo se ve la carga útil HTML haciendo clic en la URL de la solicitud HTML y luego en la pestaña **Vistas previas** dentro de Chrome DevTools.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l5U36PBU7H7Boswn5Gfq.png", alt="Una comparación antes y después. La toma de después muestra que el contenido se ha renderizado.", width="800", height="450" %}

{% Aside %} ¡`react-snap` se puede usar para otros frameworks además de React! Esto incluye Vue y Preact. Se pueden encontrar más instrucciones sobre esto en el <a href="https://github.com/stereobooster/react-snap" data-md-type="link">README de `react-snap`</a>. {% endAside %}

## Destello de contenido sin estilo

Aunque el HTML estático ahora se renderiza casi de inmediato, todavía permanece sin estilo de forma predeterminada, lo que puede causar el problema de mostrar un "destello de contenido sin estilo" (FOUC). Esto puede ser especialmente notable si está utilizando una biblioteca CSS-in-JS para generar selectores, ya que el paquete de JavaScript tendrá que terminar de ejecutarse antes de que se pueda aplicar cualquier estilo.

Para ayudar a prevenir esto, el CSS **crítico**, o la cantidad mínima de CSS que se necesita para que se procese la página inicial, se puede incluir directamente en el `<head>` del documento HTML. `react-snap` usa otra biblioteca de terceros internamente, [`minimalcss`](https://github.com/peterbe/minimalcss), para extraer cualquier CSS crítico para diferentes rutas. Puede habilitarlo especificando lo siguiente en su archivo `package.json`:

```json
"reactSnap": {
  "inlineCss": true
}
```

Al observar la vista previa de respuesta en Chrome DevTools, ahora se mostrará la página con estilo con CSS crítico en línea.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sgxwVZfvpYchXnn1mQrY.png", alt="Una comparación de antes y después. La foto de después muestra que el contenido se ha renderizado y tiene un estilo debido al CSS crítico en línea.", width="800", height="450" %}

{% Aside 'caution' %} La opción `inlineCSS` aún es experimental. Vale la pena revisar bien para asegurarse de que los estilos se estén aplicando correctamente a sus rutas. {% endAside %}

### Conclusión

Si está renderizado rutas del lado del servidor en su aplicación, use `react-snap` para pre-renderizar HTML estático para sus usuarios.

1. Instálelo como una dependencia de desarrollo y comience solo con la configuración predeterminada.
2. Utilice la opción experimental `inlineCss` para insertar CSS crítico si es lo que su sitio necesita.
3. Si está utilizando la división de código a nivel de componente dentro de cualquier ruta, tenga cuidado de no pre-renderizarles un estado de carga a sus usuarios. El [README de `react-snap`](https://github.com/stereobooster/react-snap#async-components) cubre esto con más detalle.
