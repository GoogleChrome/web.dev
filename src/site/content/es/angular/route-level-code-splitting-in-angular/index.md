---
layout: post
title: División de código a nivel de ruta en Angular
subhead: Mejora el rendimiento de tu aplicación mediante la división de código a nivel de ruta.
hero: image/admin/WVwZbWEEXUfXzVTtAlha.jpg
date: 2019-06-24
description: Aprende a hacer que tu paquete de aplicaciones inicial sea más pequeño usando la división de código a nivel de ruta.
authors:
  - mgechev
tags:
  - performance
feedback:
  - api
---

Esta publicación explica cómo configurar la [división de código](/reduce-javascript-payloads-with-code-splitting/) a nivel de ruta en una aplicación de Angular, lo que puede reducir el tamaño del paquete de JavaScript y mejorar drásticamente el [Time to Interactive (TTI): Tiempo de interacción](/tti/).

*Puedes encontrar los ejemplos de código de este artículo en [GitHub](https://github.com/mgechev/code-splitting-web-dev). El ejemplo de eager routing está disponible en  [eager branch](https://github.com/mgechev/code-splitting-web-dev/tree/eager). El ejemplo de división de código a nivel de ruta está en [lazy branch](https://github.com/mgechev/code-splitting-web-dev/tree/lazy).*

{% Aside %} Esta publicación asume la comprensión del enrutador de Angular. Para obtener una guía sobre cómo usarlo, visita la [documentación oficial](https://angular.io/guide/router) de Angular. {% endAside %}

## Por qué es importante la división de código

La creciente complejidad de las aplicaciones web ha llevado a un aumento significativo en la cantidad de JavaScript que se envía a los usuarios. Los archivos JavaScript grandes pueden retrasar notablemente la interactividad, por lo que puede ser un recurso costoso, especialmente en dispositivos móviles.

La forma más eficaz de reducir los paquetes de JavaScript sin sacrificar funciones en tus aplicaciones es introducir una división de código agresiva.

**[La división de código](/reduce-javascript-payloads-with-code-splitting/)** te permite dividir el JavaScript de tu aplicación en múltiples partes asociadas con diferentes rutas o características. Este enfoque solo envía a los usuarios el JavaScript que necesitan durante la carga inicial de la aplicación, lo que mantiene bajos los tiempos de carga.

{% Aside 'note' %}

Al usar la división de código, [Twitter y Tinder](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4) observaron mejoras de hasta un 50% en su [Time to Interactive](/tti/).

{% endAside %}

## Técnicas de división de código

La división de código se puede realizar en dos niveles: en el **nivel de componente** y en el **nivel de ruta**.

- En la división de código a nivel de componente, mueve los componentes a sus propios fragmentos de JavaScript y los carga de forma diferida cuando se necesitan.
- En la división de código a nivel de ruta, encapsula la funcionalidad de cada ruta en un fragmento separado. Cuando los usuarios navegan por tu aplicación, obtienen los fragmentos asociados con las rutas individuales y obtienen la funcionalidad asociada cuando la necesitan.

Esta publicación se enfoca en configurar la división a nivel de ruta en Angular.

### Aplicación de muestra

Antes de profundizar en cómo usar la división de código de nivel de ruta en Angular, veamos una aplicación de muestra:

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">{% IFrame { src: 'https://stackblitz.com/github/mgechev/code-splitting-web-dev/tree/eager?embed=1&amp;file=src/app/app.component.ts&amp;view=preview' } %}</div>

Consulta la implementación de los módulos de la aplicación. Dentro de `AppModule` se definen dos rutas: la ruta predeterminada asociada con `HomeComponent` y una `nyan` asociada con `NyanComponent`:

```javascript
@NgModule({
  ...
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'nyan',
        component: NyanComponent
      }
    ])
  ],
  ...
})
export class AppModule {}
```

### División de código a nivel de ruta

Para configurar la división de código, es necesario refactorizar la ruta eager de `nyan`.

La versión 8.1.0 de Angular CLI puede hacer todo por ti con el siguiente comando:

```bash
ng g module nyan --module app --route nyan
```

Esto generará:

- Un nuevo módulo de enrutamiento llamado `NyanModule`
- Una ruta en `AppModule` llamada `nyan` que cargará dinámicamente al `NyanModule`
- Una ruta por default en `NyanModule`
- Un componente llamado `NyanComponent` que se renderizará cuando el usuario llegue a la ruta por default

¡Repasemos estos pasos manualmente para comprender mejor cómo implementar la división de código con Angular!

Cuando el usuario navega a la ruta `nyan`, el enrutador renderizará el `NyanComponent` en la salida del enrutador.

Para usar la división de código a nivel de ruta en Angular, define la propiedad `loadChildren` de la declaración de ruta y combínala con una importación dinámica:

```javascript/2
{
  path: 'nyan',
  loadChildren: () => import('./nyan/nyan.module').then(m => m.NyanModule)
}
```

Hay dos diferencias clave con la ruta eager:

1. Estableces `loadChildren` en lugar de `component`. Al usar la división de código a nivel de ruta, debes de apuntar a los módulos cargados dinámicamente, en lugar de los componentes.
2. En `loadChildren`, una vez que se resuelve la promesa, devuelves el `NyanModule` en lugar de apuntar al `NyanComponent`.

El fragmento anterior especifica que cuando el usuario navega a `nyan`, Angular debe cargar dinámicamente el `nyan.module` desde el directorio de `nyan` y renderizar el componente asociado con la ruta predeterminada declarada en el módulo.

Puedes asociar la ruta predeterminada con un componente usando esta declaración:

```javascript
import { NgModule } from '@angular/core';
import { NyanComponent } from './nyan.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NyanComponent],
  imports: [
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      component: NyanComponent
    }])
  ]
})
export class NyanModule {}
```

Este código renderiza `NyanComponent` cuando el usuario navega a `https://example.com/nyan`.

Para verificar que el enrutador de Angular descarga el `nyan.module` de manera diferida en tu entorno local, haz los siguientes pasos:

{% Instruction 'devtools-network', 'ol' %}

1. Haz clic en **NYAN** en la aplicación de muestra.
2. Ten en cuenta que el archivo de `nyan-nyan-module.js` aparece en la pestaña de red.

{% Img src="image/admin/wT4xLV2OkrZ2b7QaQz8L.png", alt="Carga diferida de paquetes de JavaScript con división de código a nivel de ruta", width="800", height="524" %}

*Encuentra este ejemplo [en GitHub](https://github.com/mgechev/code-splitting-web-dev/tree/lazy/src).*

### Mostrar un spinner

En este momento, cuando el usuario hace clic en el botón  **NYAN**, la aplicación no indica que está cargando JavaScript en segundo plano. Para brindar una retroalimentación al usuario mientras carga el script, probablemente desees agregar un spinner.

Para hacer eso, comienza por agregar un marcado para el indicador dentro del elemento de `router-outlet` en `app.component.html`:

```html
<router-outlet>
  <span class="loader" *ngIf="loading"></span>
</router-outlet>
```

Luego agrega una clase de `AppComponent` para manejar eventos de enrutamiento. Esta clase definirá la bandera de `loading` en `true` cuando escuche el `RouteConfigLoadStart` y establecerá la bandera en `false` cuando escuche el evento de `RouteConfigLoadEnd`.

```javascript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean;
  constructor(router: Router) {
    this.loading = false;
    router.events.subscribe(
      (event: RouterEvent): void => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (event instanceof NavigationEnd) {
          this.loading = false;
        }
      }
    );
  }
}
```

En el siguiente ejemplo, hemos introducido una latencia artificial de 500 ms para que puedas ver el spinner en acción.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">{% IFrame { src: 'https://stackblitz.com/github/mgechev/code-splitting-web-dev/tree/lazy?embed=1&amp;file=src/app/app.component.ts&amp;view=preview' } %}</div>

{% Aside 'warning' %} La división de código puede mejorar significativamente el tiempo de carga inicial de una aplicación, pero tiene el costo de ralentizar la navegación posterior. En la [próxima publicación](/route-preloading-in-angular) sobre la precarga de rutas, verás cómo solucionar este problema. {% endAside %}

## Conclusión

Puedes reducir el tamaño del paquete de tus aplicaciones de Angular aplicando la división de código a nivel de ruta:

1. Utiliza el generador de módulos de carga diferida de Angular CLI para hacer un andamiaje automático a una ruta cargada dinámicamente.
2. Agrega un indicador de carga cuando el usuario navega por una ruta diferida para mostrar que hay una acción en curso.
