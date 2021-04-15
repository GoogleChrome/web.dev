---
layout: post
title: Preconectarse a los orígenes requeridos
description: Obtenga más información sobre la auditoría uses-rel-preconnect.
date: '2019-05-02'
updated: '2020-05-06'
web_lighthouse:
  - usa-rel-preconnect
---

La sección Oportunidades de su informe Lighthouse enumera todas las solicitudes clave que aún no priorizan las solicitudes de recuperación con `<link rel=preconnect>` :

<figure class="w-figure"><img class="w-screenshot" src="uses-rel-preconnect.png" alt="Una captura de pantalla de Lighthouse Preconnect para la auditoría de orígenes requerida"></figure>

## Compatibilidad del navegador

`<link rel=preconnect>` es compatible con la mayoría de los navegadores. Consulte [Compatibilidad del navegador](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility) .

## Mejore la velocidad de carga de la página con preconexión

Considere agregar `preconnect` o `dns-prefetch` para establecer conexiones tempranas con importantes orígenes de terceros.

`<link rel="preconnect">` informa al navegador que su página tiene la intención de establecer una conexión con otro origen y que desea que el proceso comience lo antes posible.

El establecimiento de conexiones a menudo implica un tiempo considerable en redes lentas, especialmente cuando se trata de conexiones seguras, ya que puede implicar búsquedas de DNS, redireccionamientos y varios viajes de ida y vuelta al servidor final que maneja la solicitud del usuario.

Hacer todo esto con anticipación puede hacer que su aplicación se sienta mucho más ágil para el usuario sin afectar negativamente el uso del ancho de banda. La mayor parte del tiempo para establecer una conexión se dedica a esperar, en lugar de intercambiar datos.

Informar al navegador de su intención es tan simple como agregar una etiqueta de enlace a su página:

`<link rel="preconnect" href="https://example.com">`

Esto le permite al navegador saber que la página tiene la intención de conectarse a `example.com` y recuperar contenido desde allí.

Tenga en cuenta que, si bien `<link rel="preconnect">` es bastante barato, aún puede consumir un valioso tiempo de CPU, particularmente en conexiones seguras. Esto es especialmente malo si la conexión no se usa en 10 segundos, ya que el navegador la cierra, desperdiciando todo el trabajo de conexión inicial.

En general, intente usar `<link rel="preload">` , ya que es un ajuste de rendimiento más completo, pero mantenga `<link rel="preconnect">` en su cinturón de herramientas para casos extremos como:

- [Caso de uso: saber de dónde viene, pero no lo que está obteniendo](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)
- [Caso de uso: Streaming de medios](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)

`<link rel="dns-prefetch">` es otro tipo de `<link>` relacionado con las conexiones. Esto solo maneja la búsqueda de DNS, pero tiene un soporte de navegador más amplio, por lo que puede servir como una buena alternativa. Lo usas exactamente de la misma manera:

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## Recursos

- [Código fuente para la auditoría de **preconexión a los orígenes requerida**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/uses-rel-preconnect.js)
- [Priorización de recursos: conseguir que el navegador le ayude](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [Establezca conexiones de red con anticipación para mejorar la velocidad percibida de la página](/preconnect-and-dns-prefetch/)
- [Tipos de enlace: preconectar](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)
