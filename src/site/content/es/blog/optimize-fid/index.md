---
title: Cómo optimizar First Input Delay
subhead: Cómo responder más rápido a las interacciones de los usuarios.
authors:
  - houssein
  - addyosmani
date: 2020-05-05
updated: 2022-07-18
hero: image/admin/WH0KlcJXJlxvsxU9ow2i.jpg
alt: Una mano tocando la pantalla de un teléfono inteligente
description: First Input Delay (FID) mide el tiempo que transcurre desde que un usuario interactúa por primera vez con su sitio hasta el momento en que el navegador es capaz de responder a esa interacción. Descubra cómo optimizar la FID al minimizar los procesos de JavaScript que no se utilicen dividiendo las tareas largas y mejorando la preparación para la interacción.
tags:
  - blog
  - performance
  - web-vitals
---

<blockquote>
  <p>¡Hice clic en ella pero no pasó nada! ¿Por qué no puedo interactuar con esta página? 😢</p>
</blockquote>

[First Contentful Paint: Primer despliegue del contenido](/fcp/) (FCP) y [Largest Contentful Paint: Despliegue del contenido más extenso](/lcp/) (LCP) son métricas que miden el tiempo que tarda el contenido en renderizarse (desplegarse) visualmente en una página. Aunque es importante, el tiempo que toma el despliegue no captura la *capacidad de respuesta de la carga* ni la rapidez en que una página responde a la interacción con el usuario.

[First Input Delay: Demora de la primera entrada](/fid/) (FID) es una [métrica de Core Web Vitals](/vitals/) que captura la primera impresión del usuario sobre la interactividad y la capacidad de respuesta de un sitio. Mide el tiempo que transcurre desde que el usuario interactúa por primera vez con una página hasta el momento en que el navegador es capaz de responder a esa interacción. El FID es una [métrica de campo](/user-centric-performance-metrics/#in-the-field) y no se puede simular en un entorno de laboratorio. Es necesario tener **una interacción real con el usuario** para medir la demora en la respuesta.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="Los valores de fid correctos son 2,5 segundos, los valores deficientes son superiores a 4,0 segundos y cualquier valor intermedio debe mejorarse", width="384", height="96" %}
</picture>

Para predecir la FID en el [laboratorio](/how-to-measure-speed/#lab-data-vs-field-data), recomendamos que se utilice el [Total Blocking Time: Tiempo de bloqueo total (TBT)](/tbt/). Ambas métricas miden cosas diferentes, pero las mejoras en el TBT generalmente coinciden con mejoras en la FID.

La principal causa de una FID deficiente es que **JavaScript se ejecute intensamente**. Optimizar la forma en que JavaScript efectúa análisis, compilaciones y se ejecuta en su página web reducirá directamente la FID.

## Ejecución intensa de JavaScript

El navegador no puede responder a la mayoría de las entradas de los usuarios mientras ejecuta JavaScript en el subproceso principal. En otras palabras, el navegador no puede responder a las interacciones del usuario mientras el subproceso principal esté ocupado. Para mejorar esta situación, haga lo siguiente:

- [Divida las tareas largas](#long-tasks)
- [Optimice su página de modo que esté lista para la interacción](#optimize-interaction-readiness)
- [Utilice un trabajador web](#use-a-web-worker)
- [Reduzca el tiempo de ejecución de JavaScript](#reduce-javascript-execution)

## Divida las tareas largas {: #long-tasks}

Si ya intentó reducir la cantidad de procesos en JavaScript que se cargan en una sola página, quizás resulte útil dividir el código de ejecución prolongada en **tareas asincrónicas más pequeñas**.

Las [**tareas largas**](/custom-metrics/#long-tasks-api) son periodos de ejecución en JavaScript donde los usuarios pueden descubrir que su interfaz de usuario no responde. Cualquier fragmento de código que bloquee el subproceso principal durante 50 ms o más se puede caracterizar como una tarea larga. Las tareas largas son una señal de que posiblemente JavaScript se esté utilizando en exceso (cargar y ejecutar más de lo que un usuario necesite en ese momento). Dividir las tareas largas podría reducir el retraso al entrar en su sitio.

<figure>{% Img src="image/admin/THLKu0sOPhSghNr0XkP1.png", alt="Tareas largas en Chrome DevTools", width="800", height="132" %} <figcaption>Chrome DevTools <a href="https://developers.google.com/web/updates/2020/03/devtools#long-tasks">permite visualizar las tareas largas</a> en el panel de rendimiento</figcaption></figure>

La FID debería mejorar notablemente a medida que implemente las mejores prácticas, como separar el código y dividir sus tareas largas. Si bien el TBT no es una métrica de campo, es útil para verificar el progreso hacia las mejoras finales tanto del Time To Interactive: Tiempo para interactuar (TTI) como de la FID.

{% Aside %} Para obtener más información, consulte [¿Las largas tareas de JavaScript retrasan su tiempo para interactuar?](/long-tasks-devtools/) . {% endAside %}

## Optimice su página de modo que esté lista para la interacción

Hay una gran cantidad de causas frecuentes para que la FID y el TBT tengan puntajes bajos en las aplicaciones web que dependen en gran medida de JavaScript:

### La ejecución de scripts en el origen puede retrasar la preparación para la interacción

- El exceso de tamaño en JavaScript, los tiempos de ejecución intensos y la fragmentación poco eficiente pueden reducir la velocidad con que una página responde a la entrada del usuario y afectar a las métricas FID, TBT y TTI. Cargar de forma progresiva el código y las funciones ayudaría a distribuir todo el trabajo y mejorar la preparación para la interacción.
- Podría parecer como si las aplicaciones renderizadas en el lado del servidor estuvieran dibujando píxeles en la pantalla rápidamente, pero tenga cuidado con las interacciones del usuario que fueron bloqueadas por la ejecución de scripts grandes (por ejemplo, rehidratación para conectar a los oyentes de eventos). Esto puede tardar varios cientos de milisegundos, a veces incluso segundos, si se utiliza la división del código según las rutas. Considere cambiar un porcentaje mayor de la lógica en el lado del servidor o generar más contenido estático durante el tiempo de compilación.

A continuación, se muestran las puntuaciones del TBT antes y después de optimizar la carga de scripts en el origen para una aplicación. Al mover la costosa carga de scripts (y su ejecución) para un componente no esencial fuera de la ruta crítica, los usuarios pudieron interactuar con la página mucho tiempo antes.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEIbBnIAyfzIoQtvXvMk.png", alt="Mejoras en la puntuación del TBT en Lighthouse después de optimizar el script en el origen", width="800", height="148" %}

### La búsqueda de datos puede afectar muchos aspectos de la preparación para la interacción

- Esperar a que se realice una serie de búsquedas en cascada (por ejemplo, JavaScript junto con búsquedas de datos para los componentes) puede afectar la latencia de la interacción. Trate de reducir al mínimo la dependencia a las búsquedas de datos en cascada.
- Los grandes almacenes de datos en línea pueden aumentar el tiempo de análisis en HTML y afectar tanto en el despliegue como en las métricas de la interacción. Trate de reducir al mínimo la cantidad de datos que deben procesarse posteriormente en el lado del cliente.

### La ejecución de un script de terceros también puede retrasar la latencia de la interacción

- Muchos sitios incluyen etiquetas y análisis de terceros que pueden mantener la red ocupada y hacer que el subproceso principal deje de responder periódicamente, afectando la latencia de la interacción. Analice la carga bajo demanda del código de terceros (por ejemplo, tal vez no deba cargar la parte inferior de esos anuncios hasta que se hayan desplazado un poco más cerca de la ventana de visualización).
- En algunos casos, los scripts de terceros pueden adelantarse a los de origen en términos de la prioridad y el ancho de banda en el subproceso principal, lo cual también retrasa la velocidad con que una página está lista para la interacción. Intente priorizar la carga de aquello que crea proporciona primero el valor más grande a los usuarios.

## Utilice un trabajador web

Un subproceso principal bloqueado es una de las principales causas de que haya retrasos en la entrada. Los [trabajadores web](https://developer.mozilla.org/docs/Web/API/Worker) hacen posible ejecutar JavaScript en subprocesos en segundo plano. Mover las operaciones que no se efectúan en la interfaz del usuario hacia un subproceso del trabajo independiente, puede reducir el tiempo de bloqueo del subproceso principal y, en consecuencia, mejorar la FID.

Considere usar las siguientes bibliotecas para facilitar el uso de los trabajadores web en su sitio:

- [Comlink](https://github.com/GoogleChromeLabs/comlink) : una biblioteca de apoyo que abstrae `postMessage` y hace más sencillo su uso
- [Workway](https://github.com/WebReflection/workway) : un exportador de trabajadores web de uso general
- [Workerize](https://github.com/developit/workerize) : mueve un módulo hacia un trabajador web

{% Aside %} Para obtener más información sobre cómo los trabajadores web pueden ejecutar el código desde el subproceso principal, consulte [Cómo utilizar trabajadores web para ejecutar JavaScript desde el subproceso principal del navegador](/off-main-thread/). {% endAside %}

### Reduzca el tiempo de ejecución de JavaScript {: #reduce-javascript-execution}

Limitar la cantidad de JavaScript que hay en su página reduce la cantidad de tiempo que el navegador necesita para ejecutar el código en JavaScript. Esto aumenta la velocidad con que el navegador comienza a responder a las interacciones del usuario.

Para reducir la cantidad de JavaScript que se ejecuta en su página:

- Suspenda el porcentaje de JavaScript que no esté en uso
- Reduzca al mínimo los polyfills que no se utilicen

#### Suspenda el porcentaje de JavaScript que no esté en uso

De forma predeterminada, todo JavaScript bloquea el renderizado. Cuando el navegador encuentra una etiqueta del script que está vinculada con un archivo JavaScript externo, debe pausar lo que está haciendo mientras descarga, analiza, compila y ejecuta ese JavaScript. Por lo tanto, solo debe cargar el código que sea necesario para la página o responder a la entrada del usuario.

La pestaña [Coverage](https://developer.chrome.com/docs/devtools/coverage/) en Chrome DevTools puede indicarle el porcentaje de JavaScript que no está en uso en su página web.

{% Img src="image/admin/UNEigFiwsGu48rtXMZM4.png", alt="La pestaña Coverage", width="800", height="559" %}

Para reducir el porcentaje de JavaScript que no está en uso:

- Divida el código de su paquete en varios fragmentos
- Suspenda cualquier proceso en JavaScript que no sea crítico, incluidos los scripts de terceros, mediante `async` o `defer`

La **división del código** es el concepto de dividir un solo paquete grande de JavaScript en fragmentos más pequeños que se pueden cargar condicionalmente (también conocidos como carga diferida). [La mayoría de los navegadores más recientes admiten la sintaxis de importación dinámica](https://caniuse.com/#feat=es6-module-dynamic-import), en la cual se permite la búsqueda de módulos previa solicitud:

```js
import('module.js').then((module) => {
  // Do something with the module.
});
```

Cuando existen ciertas interacciones con el usuario (como cambiar una ruta o mostrar una modalidad), la importación dinámica de JavaScript garantizará que el código que no se utiliza para la carga inicial de la página inicial solo efectúe búsquedas si es necesario.

Aparte de la compatibilidad general con el navegador, la sintaxis de la importación dinámica se puede utilizar en muchos sistemas de compilación diferentes.

- Si usa [webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://medium.com/rollup/rollup-now-has-code-splitting-and-we-need-your-help-46defd901c82) o [Parcel](https://parceljs.org/code_splitting.html)  como un paquete de módulos, aproveche su compatibilidad para la importación dinámica.
- Las estructuras del lado del cliente, como [React](https://reactjs.org/docs/code-splitting.html#reactlazy), [Angular](https://angular.io/guide/lazy-loading-ngmodules) y [Vue,](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) proporcionan abstracciones para facilitar la carga diferida a nivel del componente.

{% Aside %} Consulte el documento [Cómo reducir las cargas útiles de JavaScript con la división del código](/reduce-javascript-payloads-with-code-splitting/) para obtener más información sobre la división del código. {% endAside %}

Además de la división del código, siempre use [async o defer](https://javascript.info/script-async-defer) en los scripts que no sean necesarios para la ruta crítica o el contenido en la mitad superior de la página.

```html
<script defer src="…"></script>
<script async src="…"></script>
```

A menos que haya una razón específica para no hacerlo, todos los scripts de terceros deben cargarse con `defer` o `async` de forma predeterminada.

#### Reduzca al mínimo los polyfills que no se utilicen

Si crea su código utilizando la sintaxis de JavaScript más reciente y usa como referencia a las API de los navegadores modernos, deberá transpilarlo e incluir polyfills para que funcione en los navegadores más antiguos.

Una de las principales preocupaciones sobre el rendimiento al incluir polyfills y código transpilado en su sitio es que los navegadores más recientes no deberían tener que descargarlos si no es necesario hacerlo. Para reducir el tamaño de JavaScript en su aplicación, minimice tanto como sea posible los polyfills que no se utilicen y restrinja su uso a los entornos donde realmente se necesiten.

Para optimizar el uso de polyfill en su sitio:

- Si usa [Babel](https://babeljs.io/docs/en/index.html) como transpilador, utilice [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) para incluir únicamente los polyfills que se necesiten para los navegadores a los que se dirige. En el caso de Babel 7.9, habilite la opción [`bugfixes`](https://babeljs.io/docs/en/babel-preset-env#bugfixes) a fin de reducir aún más los polyfills que no sean necesarios.

- Utilice el patrón module/nomodule para entregar dos paquetes separados (`@babel/preset-env` también es compatible con el patrón a través de [`target.esmodules`](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules))

    ```html
    <script type="module" src="modern.js"></script>
    <script nomodule src="legacy.js" defer></script>
    ```

    Muchas de las funciones más recientes de ECMAScript que se compilaron con Babel ya son compatibles en entornos que admiten los módulos de JavaScript. Entonces, al hacer esto, simplifica el proceso de garantizar que únicamente se utilice el código transpilado para los navegadores que realmente lo necesiten.

{% Aside %} En la guía [Publicar código actualizado en navegadores modernos para que las páginas carguen más rápidamente](/serve-modern-code-to-modern-browsers/) se proporciona más información sobre este tema. {% endAside %}

## Herramientas para desarrolladores

Hay una gran variedad de herramientas disponibles para medir y depurar FID:

- [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/) no incluye soporte para FID ya que es una métrica de campo. Sin embargo, el [Total Blocking Time](/tbt/) (TBT) se puede utilizar como un proxy. Las optimizaciones que mejoran el TBT también deberían mejorar la FID en el campo.

{% Img src="image/admin/FRM9kHWmsDv9dddGMgwu.jpg", alt="Lighthouse 6.0.", width="800", height="309" %}

- El [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) proporciona los valores FID del mundo real agrupados a nivel del origen.

*Agradecemos a Philip Walton, Kayce Basques, Ilya Grigorik y Annie Sullivan por sus valiosos comentarios.*
