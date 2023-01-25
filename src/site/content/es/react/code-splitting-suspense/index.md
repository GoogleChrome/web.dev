---
layout: post
title: División de código con React.lazy y Suspense
subhead: |2

  Nunca necesita enviar más código del necesario a sus usuarios, ¡así que divida sus paquetes para asegurarse de que esto nunca suceda!
hero: image/admin/Lk8KvDZcWntc7rtQzvv9.jpg
date: 2019-04-29
description: |2

  El método React.lazy facilita la división de código de una aplicación React en un

  nivel de componente utilizando importaciones dinámicas. Úselo junto con Suspense para mostrar

  estados de carga apropiados para sus usuarios.
authors:
  - houssein
  - jeffposnick
feedback:
  - api
---

{% Aside %} Si aún no comprende la idea básica detrás de la división de código, consulte primero la guía [Reducir las cargas útiles de JavaScript con la división de código.](/reduce-javascript-payloads-with-code-splitting) {% endAside %}

El **`React.lazy`** facilita la división de código de una aplicación React a nivel de componente mediante importaciones dinámicas.

```jsx
import React, { lazy } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const DetailsComponent = () => (
  <div>
    <AvatarComponent />
  </div>
)
```

## ¿Por qué es útil esto?

Una aplicación React grande generalmente constará de muchos componentes, métodos de utilidad y bibliotecas de terceros. Si no se hace un esfuerzo para intentar cargar diferentes partes de una aplicación solo cuando son necesarias, se enviará un paquete grande de JavaScript a sus usuarios tan pronto como carguen la primera página. Esto puede afectar significativamente el rendimiento de la página.

La `React.lazy` proporciona una forma integrada de separar los componentes de una aplicación en fragmentos separados de JavaScript con muy poco trabajo preliminar. Luego puede encargarse de los estados de carga cuando lo acopla con el componente `Suspense`

## Suspenso

El problema de enviar una gran carga útil de JavaScript a los usuarios es el tiempo que tardaría la página en terminar de cargarse, especialmente en dispositivos y conexiones de red más débiles. Es por eso que la división de código y la carga diferida son extremadamente útiles.

Sin embargo, siempre habrá un ligero retraso que los usuarios tendrán que experimentar cuando se recupere un componente de código dividido a través de la red, por lo que es importante mostrar un estado de carga útil. El uso de `React.lazy` con el **`Suspense`** ayuda a resolver este problema.

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
  </Suspense>
)
```

`Suspense` acepta un `fallback` que le permite mostrar cualquier componente de React como un estado de carga. El siguiente ejemplo muestra cómo funciona esto. El avatar solo se procesa cuando se hace clic en el botón, donde se realiza una solicitud para recuperar el código necesario para el `AvatarComponent` suspendido. Mientras tanto, se muestra el componente de carga de reserva.

{% Glitch {
  id: 'react-lazy-suspense',
  path: 'src/index.css',
  height: 480
} %}

 Aquí, el código que compone `AvatarComponent` es pequeño, por lo que la ruleta de carga solo se muestra durante un corto período de tiempo. Los componentes más grandes pueden tardar mucho más en cargarse, especialmente en conexiones de red débiles.

Para demostrar mejor cómo funciona esto:

{% Instruction 'preview' %}
{% Instruction 'devtools-network' %}
- Haga clic en el **menú desplegable Throttling** , que está configurado en **Sin estrangulamiento** de forma predeterminada. Seleccione **3G rápido** .
- Haga **clic en el botón Haga clic en mí** en la aplicación.

El indicador de carga se mostrará durante más tiempo. Observe cómo todo el código que forma `AvatarComponent` se obtiene como un fragmento separado.

<figure>
 {% Img src ="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ga9IsnuJoJdnUfE6sGee.png", alt = "Panel de red de DevTools que muestra un archivo chunk.js que se está descargando", width = "800", height = "478" %}
</figure>

{% Aside %}
 Actualmente, React no admite Suspense cuando los componentes se procesan en el lado del servidor. Si está renderizando en el servidor, considere usar otra biblioteca, como [`loadable-components`](https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/) que se recomienda en los documentos de React.
{% endAside %}

## Suspender varios componentes

Otra característica de `Suspense` es que le permite suspender la carga de varios componentes, **incluso si todos tienen carga diferida** .

Por ejemplo:

```jsx
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

const DetailsComponent = () => (
  <Suspense fallback={renderLoader()}>
    <AvatarComponent />
    <InfoComponent />
    <MoreInfoComponent />
  </Suspense>
)
```

Esta es una forma extremadamente útil de retrasar la representación de varios componentes mientras solo muestra un único estado de carga. Una vez que todos los componentes han terminado de recuperarse, el usuario puede verlos todos mostrados al mismo tiempo.

Puede ver esto con la siguiente inserción:

{% Glitch {id: 'react-lazy-suspense-multiple', ruta: 'src / index.css', altura: 480}%}

{% Aside %} ¿El indicador de carga se muestra demasiado rápido? Intente simular una conexión acelerada en DevTools nuevamente. {% endAside %}

Sin esto, es fácil encontrarse con el problema de la *carga escalonada* , o diferentes partes de una interfaz de usuario que se cargan una tras otra y cada una tiene su propio indicador de carga. Esto puede hacer que la experiencia del usuario se sienta más discordante.

{% Aside %} Aunque el uso de Suspense para dividir componentes ya es posible y facilita la reducción del tamaño de los paquetes, el equipo de React continúa trabajando en más funciones que extenderían esto aún más. La [hoja de ruta de React 16.x](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html) explica esto con más detalle. {% endAside %}

## Manejar fallas de carga

`Suspense` permite mostrar un estado de carga temporal mientras las solicitudes de red se realizan bajo el capó. Pero, ¿qué pasa si esas solicitudes de red fallan por alguna razón? Es posible que esté desconectado o que su aplicación web esté intentando cargar de forma diferida una [URL versionada](/http-cache/#long-lived-caching-for-versioned-urls) que está desactualizada y ya no está disponible después de una redistribución del servidor.

React tiene un patrón estándar para manejar con elegancia estos tipos de fallas de carga: usar un límite de error. Como se describe [en la documentación](https://reactjs.org/docs/error-boundaries.html) , cualquier componente de React puede servir como un límite de error si implementa uno (o ambos) de los métodos del ciclo de vida `static getDerivedStateFromError()` o `componentDidCatch()` .

Para detectar y manejar fallas de carga diferida, puede envolver su `Suspense` con un componente principal que sirva como límite de error. `render()` del límite de error, puede representar los elementos secundarios como están si no hay ningún error, o generar un mensaje de error personalizado si algo sale mal:

```js
import React, { lazy, Suspense } from 'react';

const AvatarComponent = lazy(() => import('./AvatarComponent'));
const InfoComponent = lazy(() => import('./InfoComponent'));
const MoreInfoComponent = lazy(() => import('./MoreInfoComponent'));

const renderLoader = () => <p>Loading</p>;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true};
  }

  render() {
    if (this.state.hasError) {
      return <p>Loading failed! Please reload.</p>;
    }

    return this.props.children;
  }
}

const DetailsComponent = () => (
  <ErrorBoundary>
    <Suspense fallback={renderLoader()}>
      <AvatarComponent />
      <InfoComponent />
      <MoreInfoComponent />
    </Suspense>
  </ErrorBoundary>
)
```

## Conclusión

Si no está seguro de dónde comenzar a aplicar la división de código a su aplicación React, siga estos pasos:

1. Comience en el nivel de la ruta. Las rutas son la forma más sencilla de identificar puntos de su aplicación que se pueden dividir. Los [documentos de React](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting) muestran cómo se puede usar `Suspense` [`react-router`](https://github.com/ReactTraining/react-router) .
2. Identifique cualquier componente grande en una página de su sitio que solo se muestre en determinadas interacciones del usuario (como hacer clic en un botón). Dividir estos componentes minimizará sus cargas útiles de JavaScript.
3. Considere dividir cualquier otra cosa que esté fuera de la pantalla y no sea crítica para el usuario.
