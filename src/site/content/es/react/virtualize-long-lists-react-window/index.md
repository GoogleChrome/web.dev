---
layout: post
title: Virtualice listas grandes con react-window
subhead: |2

  Las tablas y listas supergrandes pueden ralentizar significativamente el rendimiento de su sitio. ¡La virtualización puede ayudar!
hero: image/admin/CVkKShuaQw4CfZBg3Eub.jpg
date: 2019-04-29
description: |2

  react-window es una biblioteca que permite renderizar listas grandes de manera eficiente.
authors:
  - houssein
  - developit
feedback:
  - api
---

[`react-window`](https://react-window.now.sh/#/examples/list/fixed-size) es una biblioteca que permite renderizar listas grandes de manera eficiente.

Aquí hay un ejemplo de una lista que contiene 1000 filas que se renderizan con `react-window`. Intente desplazarse sobre ella lo más rápido que pueda.

{% Glitch { id: 'react-window-fixed', path: 'src/App.js', height: 750 } %}

## ¿Por qué es útil esto?

Puede haber ocasiones en las que necesite mostrar una tabla grande o una lista que contenga muchas filas. La carga de cada elemento de una lista de este tipo puede afectar el rendimiento de manera significativa.

**La virtualización de listas**, o "partición de la pantalla en ventanas", es el concepto de renderizar solo lo que es visible para el usuario. El número de elementos que se renderizan al principio es un subconjunto muy pequeño de la lista completa y la "ventana" de contenido visible se *mueve* cuando el usuario continúa desplazándose. Esto mejora tanto el rendimiento de renderizado como el de desplazamiento de la lista.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aWscOPGSFKVAIkgnUplQ.jpg", alt="Ventana de contenido en una lista virtualizada", width="578", height="525" %} <figcaption> "Ventana" móvil de contenido en una lista virtualizada</figcaption></figure>

Los nodos DOM que salen de la "ventana" se reciclan o se reemplazan inmediatamente con elementos más nuevos a medida que el usuario se desplaza hacia abajo en la lista. Esto mantiene el número de todos los elementos renderizados acorde al tamaño de la ventana.

## react-window

`react-window` es una pequeña biblioteca de terceros que facilita la creación de listas virtualizadas en su aplicación. Ofrece una serie de API base que se pueden utilizar para diferentes tipos de listas y tablas.

### Cuándo usar listas de tamaño fijo

Utilice el `FixedSizeList` si tiene una lista larga y unidimensional de elementos del mismo tamaño.

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';

const items = [...] // some list of items

const Row = ({ index, style }) => (
  <div style={style}>
     {/* define the row component using items[index] */}
  </div>
);

const ListComponent = () => (
  <FixedSizeList
    height={500}
    width={500}
    itemSize={120}
    itemCount={items.length}
  >
    {Row}
  </FixedSizeList>
);

export default ListComponent;
```

- El componente `FixedSizeList` acepta un prop `height`, `width` e `itemSize` para controlar el tamaño de los elementos dentro de la lista.
- Una función que renderiza las filas se pasa como un hijo a `FixedSizeList`. Se puede acceder a los detalles sobre el elemento en particular con el argumento `index` en (`items[index]`).
- También se pasa un parámetro `style` al método de renderización de filas que **debe** adjuntarse al elemento de fila. Los elementos de la lista se posicionan absolutamente con sus valores de altura y ancho asignados en línea, y el parámetro `style` es responsable de esto.

{% Aside 'caution' %} No asigne propiedades `height` y `width` a la lista o al elemento de la lista con un archivo CSS externo. Se ignorarían debido al hecho de que estos atributos de estilo se aplican en línea. {% endAside %}

El ejemplo de Glitch mostrado anteriormente en este artículo muestra un ejemplo de un componente `FixedSizeList`.

### Cuándo usar listas de tamaño variable

Utilice el `VariableSizeList` para representar una lista de elementos que tienen diferentes tamaños. Este componente funciona de la misma manera que una lista de tamaño fijo, pero en su lugar espera una función para el prop `itemSize` en vez de un valor específico.

```jsx
import React from 'react';
import { VariableSizeList } from 'react-window';

const items = [...] // some list of items

const Row = ({ index, style }) => (
  <div style={style}>
     {/* define the row component using items[index] */}
  </div>
);

const getItemSize = index => {
  // return a size for items[index]
}

const ListComponent = () => (
  <VariableSizeList
    height={500}
    width={500}
    itemCount={items.length}
    itemSize={getItemSize}
  >
    {Row}
  </VariableSizeList>
);

export default ListComponent;
```

El siguiente ejemplo muestra un uso de este componente.

{% Glitch { id: 'react-window-variable', path: 'src/ListComponent.js', height: 750 } %}

La función de tamaño de elemento pasada al prop `itemSize` aleatoriza las alturas de fila en este ejemplo. Sin embargo, en una aplicación real, debería haber una lógica real que defina los tamaños de cada elemento. Idealmente, estos tamaños deben calcularse en función de los datos o obtenerse de una API.

{% Aside %} Tanto los componentes `FixedSizeList` como los `VariableSizeList` admiten listas horizontales mediante el uso de un prop `layout="horizontal"` prop. Eche un vistazo a la [documentación](https://react-window.now.sh/#/examples/list/fixed-size) para ver un ejemplo. {% endAside %}

### Cuadrículas

`react-window` también ofrece soporte para virtualizar listas multidimensionales o cuadrículas. En este contexto, la "ventana" de contenido visible cambia a medida que el usuario se desplaza horizontal **y** verticalmente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1j2qoGW8bFzBNiOzaJKZ.jpg", alt="La ventana móvil de contenido en una cuadrícula virtualizada es bidimensional", width="739", height="516" %}<figcaption> La "ventana" móvil de contenido en una cuadrícula virtualizada es bidimensional</figcaption></figure>

De manera similar, los componentes `FixedSizeGrid` y `VariableSizeGrid` se pueden usar dependiendo de si el tamaño de elementos de lista específicos puede variar.

- Para `FixedSizeGrid`, la API es aproximadamente la misma, pero con el hecho de que las alturas, anchos y conteos de elementos deben representarse tanto para columnas como para filas.
- Para `VariableSizeGrid`, tanto los anchos de columna como las alturas de fila se pueden cambiar pasando funciones en lugar de valores a sus respectivos props.

Eche un vistazo a la [documentación](https://react-window.now.sh/#/examples/grid/fixed-size) para ver ejemplos de cuadrículas virtualizadas.

{% Aside %} Además de ofrecer los componentes básicos para crear listas y cuadrículas eficientes, `react-window` también proporciona otras capacidades, como desplazarse a un elemento específico o dar un indicador cuando el usuario se desplaza. La [documentación](https://react-window.now.sh/#/examples/list/scrolling-indicators) muestra ejemplos de esto. {% endAside %}

## Carga diferida en el desplazamiento

Muchos sitios web mejoran el rendimiento al esperar a cargar y representar elementos en una lista larga hasta que el usuario se haya desplazado hacia abajo. Esta técnica, comúnmente conocida como "carga infinita", agrega nuevos nodos DOM a la lista a medida que el usuario se desplaza más allá de un cierto umbral cerca del límite. Aunque esto es mejor que cargar todos los elementos de una lista a la vez, todavía termina llenando el DOM con miles de entradas de fila si el usuario se ha desplazado más allá de esa cantidad. Esto puede conducir a un tamaño de DOM excesivamente grande, que comienza a afectar el rendimiento al hacer que los cálculos de estilo y las mutaciones de DOM sean más lentos.

El siguiente diagrama puede ayudar a resumir esto:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dKuKVjP02xWxO9LPoOuc.jpg", alt="Diferencia en el desplazamiento entre una lista normal y una virtualizada", width="800", height="531" %} <figcaption> Diferencia en el desplazamiento entre una lista regular y una virtualizada</figcaption></figure>

El mejor enfoque para resolver este problema es continuar usando una biblioteca como `react-window` para mantener una pequeña "ventana" de elementos en una página, pero también cargar de forma diferida las entradas más nuevas a medida que el usuario se desplaza hacia abajo. Un paquete separado, `react-window-infinite-loader`, lo hace posible con `react-window`.

Considere el siguiente fragmento de código que muestra un ejemplo de estado que se administra en un componente `App` padre

```jsx
import React, { Component } from 'react';

import ListComponent from './ListComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], // instantiate initial list here
      moreItemsLoading: false,
      hasNextPage: true
    };

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
   // method to fetch newer entries for the list
  }

  render() {
    const { items, moreItemsLoading, hasNextPage } = this.state;

    return (
      <ListComponent
        items={items}
        moreItemsLoading={moreItemsLoading}
        loadMore={this.loadMore}
        hasNextPage={hasNextPage}
      />
    );
  }
}

export default App;
```

Un método `loadMore` se pasa a un `ListComponent` hijo que contiene la lista del cargador infinito. Esto es importante porque el cargador infinito necesita disparar un callback (llamada de vuelta) para cargar más elementos una vez que el usuario ha pasado de cierto punto.

Esta es una forma en puede verse el `ListComponent` que renderiza la lista:

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";

const ListComponent = ({ items, moreItemsLoading, loadMore, hasNextPage }) => {
  const Row = ({ index, style }) => (
     {/* define the row component using items[index] */}
  );

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  return (
    <InfiniteLoader
      isItemLoaded={index => index < items.length}
      itemCount={itemCount}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={500}
          width={500}
          itemCount={itemCount}
          itemSize={120}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Row}
        </FixedSizeList>
      )}
  </InfiniteLoader>
  )
};

export default ListComponent;
```

Aquí, el componente `FixedSizeList` está envuelto dentro del `InfiniteLoader`. Los props asignados al cargador son:

- `isItemLoaded`: método que comprueba si se ha cargado un determinado elemento
- `itemCount`: número de elementos en la lista (o esperados)
- `loadMoreItems`: callback que devuelve una promesa que se resuelve en datos adicionales para la lista

Se usa un [prop de renderizado](https://reactjs.org/docs/render-props.html#using-props-other-than-render) para devolver una función que el componente de lista usa para renderizar. Deben pasarse los  atributos `onItemsRendered` y `ref`.

El siguiente es un ejemplo de cómo la carga infinita puede funcionar con una lista virtualizada.

{% Glitch { id: 'react-window-infinite', path: 'src/ListComponent.js', height: 750 } %}

Desplazarse hacia abajo en la lista puede parecer lo mismo, pero ahora se realiza una solicitud para recuperar 10 usuarios de una [API de usuario aleatorio](https://randomuser.me/) cada vez que se desplaza cerca del final de la lista. Todo esto se hace mientras solo se renderiza una única "ventana" de resultados a la vez.

Al verificar el `index` de un elemento determinado, se puede mostrar un estado de carga diferente para un elemento dependiendo de si se ha realizado una solicitud de entradas más nuevas y si el artículo todavía se está cargando.

Por ejemplo:

```js
const Row = ({ index, style }) => {
  const itemLoading = index === items.length;

  if (itemLoading) {
      // return loading state
  } else {
      // return item
  }
};
```

## Sobreexploración

Dado que los elementos de una lista virtualizada solo cambian cuando el usuario se desplaza, el espacio en blanco puede parpadear brevemente cuando las entradas más nuevas están a punto de mostrarse. Puede intentar desplazarse rápidamente por cualquiera de los ejemplos anteriores de esta guía para notarlo.

Para mejorar la experiencia del usuario de listas virtualizadas, `react-window` permite sobreexplorar elementos con la propiedad `overscanCount`. Esto le permite definir cuántos elementos fuera de la "ventana" visible se renderizarán en todo momento.

```jsx
<FixedSizeList
  //...
  overscanCount={4}
>
  {...}
</FixedSizeList>
```

`overscanCount` funciona para los componentes `FixedSizeList` y `VariableSizeList` y tiene un valor predeterminado de 1. Dependiendo del tamaño de la lista y del tamaño de cada elemento, sobreexplorar más de una entrada puede ayudar a prevenir un parpadeo notable de espacio vacío cuando el usuario se desplaza. Sin embargo, sobreexplorar demasiadas entradas puede afectar negativamente al rendimiento. El objetivo de usar una lista virtualizada es minimizar el número de entradas a lo que el usuario puede ver en un momento dado, así que trate de mantener el número de elementos a sobreeexplorar lo más bajo posible.

Para `FixedSizeGrid` y `VariableSizeGrid`, use las propiedades `overscanColumnsCount` y `overscanRowsCount` para controlar el número de columnas y filas a sobreexplorar, respectivamente.

## Conclusión

Si no está seguro de dónde comenzar a virtualizar listas y tablas en su aplicación, siga estos pasos:

1. Mida el rendimiento de renderizado y desplazamiento. Este [artículo](https://addyosmani.com/blog/react-window/) muestra cómo [se puede utilizar el medidor FPS](https://developer.chrome.com/docs/devtools/evaluate-performance/#analyze_frames_per_second) en Chrome DevTools para explorar la eficiencia con la que se renderizan los elementos en una lista.
2. Incluya `react-window` para las listas o cuadrículas largas que estén afectando el rendimiento.
3. Si hay ciertas características que no son compatibles con `react-window`, considere usar [`react-virtualized`](https://github.com/bvaughn/react-virtualized) si no puede agregar esta funcionalidad usted mismo.
4. Envuelva su lista virtualizada con `react-window-infinite-loader` si necesita cargar elementos de forma diferida mientras el usuario se desplaza.
5. Utilice la propiedad `overscanCount` para sus listas y las propiedades `overscanColumnsCount` y `overscanRowsCount` en sus cuadrículas para evitar un parpadeo de contenido vacío. No sobreexplore demasiadas entradas, ya que esto afectará negativamente al rendimiento.
