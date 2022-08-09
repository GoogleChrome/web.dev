---
layout: post
title: Preconectarse a los orígenes requeridos
description: |2-

  Obtén más información sobre la auditoría uses-rel-preconnect.
date: 2019-05-02
updated: 2020-05-06
web_lighthouse:
  - uses-rel-preconnect
---

La sección Oportunidades de tu informe Lighthouse enumera todas las solicitudes clave que aún no priorizan las solicitudes de recuperación con `<link rel=preconnect>`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K5TLz5LOyRjffxJ6J9zl.png", alt="Una captura de pantalla de la auditoría Lighthouse de Preconectarse a los orígenes requeridos", width="800", height="226" %}</figure>

## Compatibilidad del navegador

`<link rel=preconnect>` es compatible con la mayoría de los navegadores. Consulta [Compatibilidad del navegador](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility).

## Mejora la velocidad de carga de la página con preconnect

Considera agregar `preconnect` o `dns-prefetch` para establecer conexiones tempranas con orígenes de terceros importantes.

El `<link rel="preconnect">` informa al navegador que tu página tiene la intención de establecer una conexión con otro origen y que deseas que el proceso comience lo antes posible.

Establecer conexiones usualmente implica un tiempo considerable en redes lentas, especialmente cuando se trata de conexiones seguras, ya que puede implicar búsquedas de DNS, redireccionamientos y varios viajes de ida y vuelta al servidor final que maneja la consulta del usuario.

Hacer todo esto con anticipación puede hacer que tu aplicación se sienta mucho más ágil para el usuario sin afectar negativamente el uso del ancho de banda. La mayor parte del tiempo para establecer una conexión se dedica a esperar, en lugar de intercambiar datos.

Informar al navegador de tu intención es tan simple como agregar una etiqueta de enlace a tu página:

`<link rel="preconnect" href="https://example.com">`

Esto le permite al navegador saber que la página tiene la intención de conectarse a `example.com` y recuperar contenido desde allí.

Ten en cuenta que, si bien `<link rel="preconnect">` es bastante barato, aún puede consumir un valioso tiempo de CPU, particularmente en conexiones seguras. Esto es especialmente negativo ya que si la conexión no se usa en 10 segundos, el navegador la cerrará, desperdiciando todo el trabajo de la conexión inicial.

En general, intenta usar `<link rel="preload">`, ya que es un ajuste de rendimiento más completo, pero mantén `<link rel="preconnect">` en tu cinturón de herramientas para casos específicos como:

- [Caso de uso: Saber de dónde viene, pero no qué estás obteniendo](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)
- [Caso de uso: Streaming de medios](https://developers.google.com/web/fundamentals/performance/resource-prioritization#use-case_knowing_where_from_but_not_what_youre_fetching)

`<link rel="dns-prefetch">` es otro tipo de `<link>` relacionado con las conexiones. Esto solo maneja la búsqueda de DNS, pero tiene un soporte de navegador más amplio, por lo que puede servir como una buena alternativa. Se usa exactamente de la misma manera:

```html
<link rel="dns-prefetch" href="https://example.com">.
```

## Orientación de recursos tecnológicos específicos

### Drupal

Utiliza [un módulo que admite sugerencias de recursos de agentes de usuario](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=dns-prefetch&solrsort=iss_project_release_usage+desc&op=Search) para que puedas instalar y configurar sugerencias de recursos de preconexión o de captación previa de DNS.

### Magento

[Modifica el diseño de tus temas](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html) y agrega sugerencias de recursos de preconexión o de captación previa de DNS.

## Recursos

- [Código fuente para la auditoría de **preconexión a los orígenes requeridos**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preconnect.js)
- [Priorización de recursos: Conseguir que el navegador te ayude](https://developers.google.com/web/fundamentals/performance/resource-prioritization#preconnect)
- [Establece conexiones de red con anticipación para mejorar la velocidad percibida de la página](/preconnect-and-dns-prefetch/)
- [Tipos de enlace: preconnect](https://developer.mozilla.org/docs/Web/HTML/Link_types/preconnect#Browser_compatibility)
