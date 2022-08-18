---
layout: post
title: Estrategias de precarga de ruta en Angular
subhead: Cargue las rutas con anticipación para acelerar la navegación de los usuarios.
hero: image/admin/q4b86k6REnNHkpjQnsLK.jpg
hero_position: bottom
alt: Bola de cristal
date: 2019-07-09
description:
  Aprenda a usar las estrategias de precarga de Angular para aplicaciones más rápidas.
authors:
  - mgechev
tags:
  - performance
feedback:
  - api
---

La [división de código a nivel de ruta](/route-level-code-splitting-in-angular) puede ayudarlo a reducir el tiempo de carga inicial de una aplicación al retrasar el JavaScript asociado con las rutas que inicialmente no son necesarias. De esta manera, el enrutador Angular espera hasta que un usuario navega a una ruta determinada antes de activar una solicitud de red para descargar el JavaScript asociado.

Si bien esta técnica es excelente para la carga inicial de la página, puede ralentizar la navegación, dependiendo de la latencia de red y el ancho de banda de los usuarios. Una forma de abordar este problema es con la **precarga de ruta**. Con la precarga, cuando el usuario se encuentra en una ruta determinada, puede descargar y almacenar en caché el JavaScript asociado con las rutas que probablemente se necesitarán a continuación. El enrutador Angular brinda esta función desde el primer momento.

En esta publicación, aprenderá cómo acelerar la navegación al usar la división de código a nivel de ruta aprovechando la precarga de JavaScript en Angular.

## Estrategias de precarga de ruta en Angular

El enrutador Angular proporciona una propiedad de configuración llamada `preloadingStrategy`, que define la lógica para precargar y procesar módulos de Angular de carga diferida. Cubriremos dos posibles estrategias:

- `PreloadAllModules`, que carga previamente todas las rutas de carga diferida, como su nombre lo indica
- `QuicklinkStrategy`, que cargapreviamente solo las rutas asociadas con los enlaces en la página actual.

*El resto de esta publicación hace referencia a una aplicación Angular de muestra. Puede encontrar el código fuente [en GitHub](https://github.com/mgechev/route-preloading-web-dev).*

### Usar la estrategia `PreloadAllModules`

La aplicación de muestra tiene varias rutas de carga diferida. Para cargarlas todas previamente usando la estrategia `PreloadAllModules`, integrada en Angular, especifíquelo como el valor de la propiedad `preloadingStrategy` en la configuración del enrutador:

```js
import { RouterModule, PreloadAllModules } from '@angular/router';
// …

RouterModule.forRoot([
  …
], {
  preloadingStrategy: PreloadAllModules
})
// …
```

Ahora entregue la aplicación y mire el panel de **Red** en Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

Debería ver que el enrutador descargó `nyan-nyan-module.js` y `about-about-module.js` en segundo plano cuando abrió la aplicación:

<figure data-size="full">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/TVi6LCasiwZI1hxJrBOL.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/e9h6JBVl8TUGMWOSAWyC.mp4"], controls="true", loop="true", muted="true" %} <figcaption> La estrategia PreloadAllModules en acción. </figcaption></figure>

El enrutador también registró las declaraciones de ruta de los módulos para que cuando navegue a una URL asociada con cualquiera de los módulos precargados, la transición sea instantánea.

### Usar la estrategia de precarga de Quicklink

`PreloadAllModules` es útil en muchos casos. Sin embargo, cuando tiene docenas de módulos, su precarga agresiva puede aumentar el uso de la red. Además, dado que el enrutador necesita registrar las rutas en todos los módulos precargados, puede causar cálculos intensivos en el hilo de la interfaz de usuario y llevar a una experiencia de usuario lenta.

La [biblioteca de enlaces rápidos](https://github.com/GoogleChromeLabs/quicklink) proporciona una mejor estrategia para aplicaciones más grandes. Utilice la [API IntersectionObserver](/intersectionobserver-v2/) para cargar previamente solo los módulos asociados con los enlaces que están actualmente visibles en la página.

Puede agregar un enlace rápido a una aplicación Angular utilizando el paquete [ngx-quicklink](https://www.npmjs.com/package/ngx-quicklink). Comience instalando el paquete desde npm:

```bash
npm install --save ngx-quicklink
```

Una vez que esté disponible en su proyecto, puede usar `QuicklinkStrategy` especificando la estrategia de `preloadingStrategy` del enrutador e importando el `QuicklinkModule`:

```js
import {QuicklinkStrategy, QuicklinkModule} from 'ngx-quicklink';
…

@NgModule({
  …
  imports: [
    …
    QuicklinkModule,
    RouterModule.forRoot([…], {
      preloadingStrategy: QuicklinkStrategy
    })
  ],
  …
})
export class AppModule {}
```

Ahora, cuando vuelva a abrir la aplicación, notará que el enrutador solo carga previamente `nyan-nyan-module.js`, ya que el botón en el centro de la página tiene un enlace de enrutador. Cuando abra la navegación lateral, notará que el enrutador carga previamente la ruta "Acerca de":

<figure data-size="full">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/dfZkoiQyNh4fUj4DJjrc.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/SkNp99W1Bv2tsaRgOwoe.mp4"], controls="true", loop="true", muted="true" %} <figcaption> Una demostración de la estrategia de precarga de enlaces rápidos. </figcaption></figure>

### Usar la estrategia de precarga de Quicklink en varios módulos de carga diferida

El ejemplo anterior funcionará para una aplicación básica, pero si su aplicación contiene varios módulos de carga diferida, deberá importar el `QuicklinkModule` a un módulo compartido, exportarlo y luego importar el módulo compartido a sus módulos de carga diferida.

Primero importe el `QuicklinkModule` de `ngx-quicklink` a su módulo compartido y expórtelo:

```js
import { QuicklinkModule } from 'ngx-quicklink';
…

@NgModule({
  …
  imports: [
    QuicklinkModule
  ],
  exports: [
    QuicklinkModule
  ],
  …
})
export class SharedModule {}
```

Luego importe su `SharedModule` en todos sus módulos de carga diferida:

```js
import { SharedModule } from '@app/shared/shared.module';
…

@NgModule({
  …
  imports: [
      SharedModule
  ],
  …
});
```

Los `Quicklinks` ahora estarán disponibles en sus módulos de carga diferida.

## Más allá de la precarga básica

Si bien la precarga selectiva a través de un enlace rápido puede acelerar significativamente la navegación, puede hacer su estrategia de precarga aún más eficiente en la red mediante el uso de la precarga predictiva, que es implementada por [Guess.js](https://github.com/guess-js/guess). Al analizar un informe de Google Analytics u otro proveedor de analítica, Guess.js puede predecir el viaje de navegación de un usuario y cargar previamente solo los fragmentos de JavaScript que probablemente se necesitarán a continuación.

Puede aprender a usar Guess.js con Angular en [esta página del sitio de Guess.js](https://guess-js.github.io/docs/angular).

## Conclusión

Para acelerar la navegación al utilizar la división de códigos a nivel de ruta:

1. Elija la estrategia de precarga adecuada según el tamaño de su aplicación:
    - Las aplicaciones con pocos módulos pueden utilizar la estrategia `PreloadAllModules`.
    - Las aplicaciones con muchos módulos deben usar una estrategia de precarga personalizada, como el enlace rápido de Angular, o precarga predictiva, como se implementa en Guess.js.
2. Configure la estrategia de precarga estableciendo la propiedad `preloadStrategy` del enrutador Angular.
