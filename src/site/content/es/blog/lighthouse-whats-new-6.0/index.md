---
layout: post
title: Novedades de Lighthouse 6.0
subhead: Nuevas métricas, actualización de la puntuación de rendimiento, nuevas auditorías y más.
authors:
  - cjamcl
date: 2020-05-19
hero: image/admin/93kZL2w49CLIc514qojJ.svg
alt: Logotipo del faro.
tags:
  - blog
  - performance
  - lighthouse
---

¡Hoy estamos lanzamos Lighthouse 6.0!

[Lighthouse](https://github.com/GoogleChrome/lighthouse/) es una herramienta automatizada de auditoría de sitios web que ayuda a los desarrolladores con oportunidades y diagnósticos para mejorar la experiencia del usuario de sus sitios. Está disponible en Chrome DevTools, npm (como módulo de nodo y como CLI) o como extensión del navegador (en [Chrome](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) y [Firefox](https://addons.mozilla.org/firefox/addon/google-lighthouse/)). Es la [base](/measure/) de muchos servicios de Google, incluyendo web.dev/measure y [PageSpeed Insights](https://pagespeed.web.dev/).

Lighthouse 6.0 está disponible inmediatamente en npm y en [Chrome Canary](https://www.google.com/chrome/canary/). Otros servicios de Google que aprovechan Lighthouse recibirán la actualización a fin de mes. Llegará a Chrome Stable en Chrome 84 (mediados de julio).

Para probar la CLI de Lighthouse Node, use los siguientes comandos:

```bash
npm install -g lighthouse
lighthouse https://www.example.com --view
```

Esta versión de Lighthouse viene con una gran cantidad de cambios que se [enumeran en el registro de cambios 6.0](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.0.0). Cubriremos los aspectos más destacados en este artículo.

- [Nuevas métricas](#new-metrics)
- [Actualización de la puntuación de rendimiento](#score)
- [Nuevas auditorías](#new-audits)
- [Lighthouse CI](#ci)
- [Panel de DevTools de Chrome renombrado](#devtools)
- [Emulación móvil](#emulation)
- [Extensión del navegador](#extension)
- [Presupuestos](#budgets)
- [Enlaces de ubicación de origen](#source-location)
- [En el horizonte](#horizon)
- [¡Gracias!](#thanks)

## Nuevas métricas {: #new-metrics }

<figure>{% Img src="image/admin/Yo1oNtdfEF4PhD7zHDHQ.png", alt="Métricas de Lighthouse 6.0.", width="600", height="251" %}</figure>

Lighthouse 6.0 introduce tres nuevas métricas para informar. Dos de estas nuevas métricas, Despliegue del contenido más extenso (LCP) y el cambio acumulativo del diseño (CLS), son implementaciones de laboratorio de [Core Web Vitals](/vitals/).

### Despliegue del contenido más extenso (LCP) {: #lcp }

[El Despliegue del contenido más extenso (Largest Contentful Paint - LCP)](https://www.web.dev/lcp/) es una medida de la experiencia de carga percibida. Marca el punto durante la carga de la página cuando el contenido principal o "más extenso" se ha cargado y es visible para el usuario. LCP es un complemento importante de Primer despliegue de contenido (First Contentful Paint - FCP) que solo captura el comienzo de la experiencia de carga. LCP proporciona una señal a los desarrolladores sobre la rapidez con la que un usuario puede ver el contenido de una página. Una puntuación de LCP por debajo de 2.5 segundos se considera "Buena".

Para obtener más información, [vea este análisis profundo de LCP](https://youtu.be/diAc65p15ag) de Paul Irish.

### Cambio acumulativo de diseño (CLS) {: #cls }

[El cambio acumulativo de diseño (Cumulative Layout Shift - CLS)](https://www.web.dev/cls/) es una medida de estabilidad visual. Mide cuánto cambia visualmente el contenido de una página. Una puntuación CLS baja es una señal para los desarrolladores de que sus usuarios no están experimentando cambios de contenido indebidos; una puntuación CLS por debajo de 0.10 se considera "Buena".

CLS en un entorno de laboratorio se mide hasta el final de la carga de la página. Mientras que en el campo, puede medir CLS hasta la primera interacción del usuario o incluyendo todas las entradas del usuario.

Para obtener más información, [vea este análisis profundo de CLS](https://youtu.be/zIJuY-JCjqw) de Annie Sullivan.

### Tiempo total de bloqueo (TBT) {: #tbt}

[El tiempo de bloqueo total (Total Blocking Time - TBT)](https://www.web.dev/tbt/) cuantifica la capacidad de respuesta de la carga, midiendo la cantidad total de tiempo en que el hilo principal estuvo bloqueado el tiempo suficiente para evitar la respuesta de entrada. TBT mide la cantidad total de tiempo entre Primer despliegue de contenido (FCP) y Tiempo para interactuar (Time to Interactive - TTI). Es una métrica complementaria de TTI y aporta más matices a la cuantificación de la actividad del hilo principal que bloquea la capacidad de un usuario para interactuar con su página.

Además, TBT se correlaciona bien con la métrica de campo [Demora de la primera entrada](/fid/) (First Input Delay - FID), que es un Core Web Vital.

## Actualización de la puntuación de rendimiento {: #score }

La [puntuación de rendimiento en Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/) se calcula a partir de una combinación ponderada de varias métricas para resumir la velocidad de una página. A continuación, se muestra la fórmula de puntuación de rendimiento de la versión 6.0.

&lt;style&gt; .lh-table { min-width: unset; } .lh-table td { min-width: unset; } &lt;/style&gt;

<table class="lh-table">
<thead><tr>
<th><strong>Fase</strong></th>
<th><strong>Nombre de métrica</strong></th>
<th><strong>Peso métrico</strong></th>
</tr></thead>
<tbody>
<tr>
<td>Temprana (15 %)</td>
<td>Primer despliegue de contenido (FCP)</td>
<td>15 %</td>
</tr>
<tr>
<td>Media (40 %)</td>
<td>Índice de velocidad (Speed Index - SI)</td>
<td>15 %</td>
</tr>
<tr>
<td></td>
<td>Despliegue del contenido más extenso (LCP)</td>
<td>25 %</td>
</tr>
<tr>
<td>Tarde (15 %)</td>
<td>Tiempo para interactuar (TTI)</td>
<td>15 %</td>
</tr>
<tr>
<td>Hilo principal (25 %)</td>
<td>Tiempo total de bloqueo (Total Blocking Time - TBT)</td>
<td>25 %</td>
</tr>
<tr>
<td>Previsibilidad (5 %)</td>
<td>Cambio cumulativo de diseño acumulativo (CLS)</td>
<td>5 %</td>
</tr>
</tbody>
</table>

Si bien se han agregado tres nuevas métricas, se han eliminado tres antiguas: Primer despliegue significativo (First Meaningful Paint), Primera CPU inactiva (First CPU Idle) y FID de máximo potencial. Los pesos de las métricas restantes se han modificado para enfatizar la interactividad del hilo principal y la previsibilidad del diseño.

A modo de comparación, aquí está la puntuación de la versión 5:

<table class="lh-table">
<thead><tr>
<th><strong>Fase</strong></th>
<th><strong>Nombre de métrica</strong></th>
<th><strong>Peso</strong></th>
</tr></thead>
<tbody>
<tr>
<td>Temprana (23 %)</td>
<td>Primera despliegue de contenido (FCP)</td>
<td>23 %</td>
</tr>
<tr>
<td>Media (34 %)</td>
<td>Índice de velocidad (SI)</td>
<td>27 %</td>
</tr>
<tr>
<td></td>
<td>Primer despliegue significativo (FMP)</td>
<td>7 %</td>
</tr>
<tr>
<td>Finalizado (46 %)</td>
<td>Tiempo para interactuar (TTI)</td>
<td>33 %</td>
</tr>
<tr>
<td></td>
<td>Primera CPU inactiva (FCI)</td>
<td>13 %</td>
</tr>
<tr>
<td>Hilo principal</td>
<td>FID de potencial máximo</td>
<td>0 %</td>
</tr>
</tbody>
</table>

{% Img src="image/admin/gJnkac5fOfjOvmeLXdPO.png", alt="Cambios en la puntuación de Lighthouse entre las versiones 5 y 6", width="800", height="165" %}

Algunos aspectos destacados de los cambios de puntuación entre las versiones 5 y 6 de Lighthouse:

- **El peso de TTI se ha reducido del 33 % al 15 %.** Esto fue en respuesta directa a los comentarios de los usuarios sobre la variabilidad de TTI, así como a las inconsistencias en las optimizaciones de métricas que conducen a mejoras en la experiencia del usuario. TTI sigue siendo una señal útil para cuando una página es completamente interactiva, sin embargo, con TBT como complemento, la [variabilidad se reduce](https://docs.google.com/document/d/1xCERB_X7PiP5RAZDwyIkODnIXoBk-Oo7Mi9266aEdGg/edit#heading=h.vkfjuiyx1s5l). Con este cambio de puntuación, esperamos que los desarrolladores se sientan motivados de manera más eficaz a optimizar la interactividad del usuario.
- **El peso de FCP se ha reducido del 23 % al 15 %.** Medir solo cuando se despliega el primer píxel (FCP) no nos ofrecía un panorama completo. Combinarlo con medir cuándo los usuarios pueden ver qué es lo que más probablemente les importa (LCP) refleja mejor la experiencia de carga.
- **Max Potential FID** **ha quedado obsoleto**. Ya no se muestra en el informe, pero todavía está disponible en JSON. Ahora se recomienda observar TBT para cuantificar su interactividad en lugar de FID de potencial máximo.
- **La primera pintura significativa ha quedado obsoleta.** Esta métrica era demasiado variada y no tenía un camino viable hacia la estandarización, ya que la implementación es específica de los componentes internos de renderizado de Chrome. Si bien algunos equipos consideran que la sincronización de FMP vale la pena en su sitio, la métrica no recibirá mejoras adicionales.
- **Primera CPU inactiva queda obsoleta** porque no es lo suficientemente distinta de TTI. Ahora, TBT y TTI son las métricas de referencia para la interactividad.
- El peso de CLS es relativamente bajo, aunque esperamos aumentarlo en una versión principal futura.

### Cambios en las puntuaciones {: #score-shifts }

¿Cómo afectan estos cambios a las puntuaciones de los sitios reales? Hemos publicado un [análisis](https://docs.google.com/spreadsheets/d/1BZFh7AyyaLHCj5LGAbrn3m72ysu4yv8okyHG-f3MoXI/edit?usp=sharing) de los cambios de puntuación utilizando dos conjuntos de datos: un [conjunto general de sitios](https://gist.github.com/connorjclark/8afe673d4e7c6e17204834a256e7caf1) y un [conjunto de sitios estáticos](https://gist.github.com/connorjclark/0be52464887ae3a6f29ad5a798122e0c#file-readme-md) creados con [Eleventy](https://www.11ty.dev/). En resumen, ~ 20 % de los sitios obtienen puntuaciones notablemente más altas, ~ 30 % apenas tienen cambios y ~ 50 % ven una disminución de al menos cinco puntos.

Los cambios de puntuación se pueden dividir en tres componentes principales:

- cambios en el peso de la puntuación
- corrección de errores en implementaciones de métricas subyacentes
- cambios en la curva de puntuación individual

Los cambios en el peso de la puntuación y la introducción de tres nuevas métricas motivaron la mayoría de los cambios en la puntuación general. Las nuevas métricas que los desarrolladores aún tienen que optimizar tienen un peso significativo en la puntuación de rendimiento de la versión 6. Si bien el puntaje de desempeño promedio del corpus de prueba en la versión 5 fue de alrededor de 50, los puntajes promedio en las nuevas métricas de Tiempo de bloqueo total y Pintura con despliegue más extenso fueron de alrededor de 30. Juntas, esas dos métricas representan el 50 % del peso de la puntuación de rendimiento en la versión 6 de Lighthouse, por lo que, naturalmente, un gran porcentaje de sitios obtuvo puntuaciones menores.

Las correcciones de errores en el cálculo de métricas subyacentes pueden dar como resultado puntuaciones diferentes. Esto afecta a relativamente pocos sitios, pero puede tener un impacto considerable en determinadas situaciones. En general, alrededor del 8 % de los sitios experimentaron una mejora en la puntuación y alrededor del 4 % de los sitios vieron una disminución en la puntuación debido a cambios en la implementación de métricas. Aproximadamente el 88 % de los sitios no se vieron afectados por estas correcciones.

Los cambios de la curva de puntuación individual también afectaron los cambios de puntuación general, aunque de forma bastante leve. Periódicamente nos aseguramos de que la curva de puntuación se ajusta con las métricas observadas en el [conjunto de datos HTTPArchive](http://httparchive.org/). Excluyendo los sitios afectados por cambios importantes en la implementación, los ajustes menores en la curva de puntuación para métricas individuales mejoraron las puntuaciones de aproximadamente el 3 % de los sitios y disminuyeron las puntuaciones de aproximadamente el 4 % de los sitios. Aproximadamente el 93 % de los sitios no se vieron afectados por este cambio.

### Calculadora de puntuación {: #calculator }

Hemos publicado una [calculadora de puntuación](https://googlechrome.github.io/lighthouse/scorecalc/) para ayudarle a explorar la puntuación de rendimiento. La calculadora también le ofrece una comparación entre las puntuaciones de la versión 5 y 6 de Lighthouse. Cuando ejecuta una auditoría con Lighthouse 6.0, el informe viene con un enlace a la calculadora con sus resultados completos.

<figure>{% Img src="image/admin/N8cRFUnM526m3fB4GQVf.png", alt="Calculadora de puntuación de Lighthouse.", width="600", height="319" %}<figcaption> ¡Muchas gracias a <a href="https://twitter.com/anatudor">Ana Tudor</a> por la mejora del indicador!</figcaption></figure>

## Nuevas auditorías {: #new-audits }

### JavaScript no utilizado {: #unused-javascript }

[Aprovechamos la cobertura del código de DevTools](https://developer.chrome.com/docs/devtools/coverage/) en una nueva auditoría: [**JavaScript no utilizado**](/remove-unused-code/).

Esta auditoría no es *completamente* nueva: se [agregó a mediados de 2017](https://github.com/GoogleChrome/lighthouse/issues/1852#issuecomment-306900595), pero debido a la sobrecarga de rendimiento, se deshabilitó de forma predeterminada para mantener Lighthouse lo más rápido posible. La recopilación de estos datos de cobertura es mucho más eficiente ahora, por lo que nos sentimos cómodos habilitándolos de forma predeterminada.

### Auditorías de accesibilidad {: #a11y }

Lighthouse utiliza la maravillosa biblioteca [axe-core](https://github.com/dequelabs/axe-core) para impulsar la categoría de accesibilidad. En Lighthouse 6.0, hemos agregado las siguientes auditorías:

- [aria-hidden-body](/aria-hidden-body/)
- [aria-hidden-focus](/aria-hidden-focus/)
- [aria-input-field-name](/aria-input-field-name/)
- [aria-toggle-field-name](/aria-toggle-field-name/)
- [form-field-multiple-labels](/form-field-multiple-labels/)
- [heading-order](/heading-order/)
- [duplicate-id-active](/duplicate-id-active/)
- [duplicate-id-aria](/duplicate-id-aria/)

### Icono enmascarable {: #maskable-icon }

[Iconos enmascarables](/maskable-icon/) es un nuevo formato de icono que hace que los iconos de su PWA se vean geniales en todo tipo de dispositivos. Para ayudar a que su PWA se vea lo mejor posible, hemos introducido una nueva auditoría para verificar si su manifest.json es compatible con este nuevo formato.

### Declaración de juego de caracteres {: #charset }

El [elemento meta juego de caracteres](https://developer.chrome.com/docs/lighthouse/best-practices/charset/) declara qué codificación de caracteres debe usarse para interpretar un documento HTML. Si falta este elemento, o si se declara de forma tardía en el documento, los navegadores emplean una serie de heurísticas para adivinar qué codificación se debe utilizar. Si un navegador adivina incorrectamente y se encuentra un elemento de metacaracteres de forma tardía, el analizador generalmente descarta todo el trabajo realizado hasta el momento y comienza de nuevo, lo que genera malas experiencias para el usuario. Esta nueva auditoría verifica que la página tenga una codificación de caracteres válida y que esté definida al principio y al principio.

## Lighthouse CI {: #ci }

En [CDS, en noviembre pasado](/lighthouse-evolution-cds-2019/#lighthouse-ci-alpha-release), anunciamos [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci), el servidor y Node CLI de código abierto que rastrea los resultados de Lighthouse en cada confirmación en su proceso de integración continua, y hemos recorrido un largo camino desde el lanzamiento alfa. Lighthouse CI ahora tiene soporte para numerosos proveedores de CI, incluidos Travis, Circle, GitLab y GitHub Actions. [Las imágenes docker](https://github.com/GoogleChrome/lighthouse-ci/tree/master/docs/recipes) listas para implementar facilitan la configuración, y un rediseño integral del panel ahora revela tendencias en todas las categorías y métricas en Lighthouse para un análisis detallado.

Empiece a utilizar Lighthouse CI en su proyecto hoy mismo siguiendo nuestra [guía de introducción](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/getting-started.md).

<figure data-float="left">{% Img src="image/admin/sXnTzewqGuc84MOCzFJe.png", alt="Lighthouse CI.", width="600", height="413", linkTo=true %}</figure>

<figure data-float="left">{% Img src="image/admin/uGT7AUJEQeqK1vlKySLb.png", alt="Lighthouse CI.", width="600", height="412", linkTo=true %}</figure>

<figure>{% Img src="image/admin/ZR48KZebW43eyAvB1RkT.png", alt="Lighthouse CI.", width="600", height="354", linkTo=true %}</figure>

## Panel de DevTools de Chrome renombrado {: #devtools }

Hemos cambiado el nombre del panel **Auditorías** a panel de **Lighthouse**. ¡Eso mismo!

Dependiendo del tamaño de la ventana de DevTools, el panel probablemente esté detrás del botón `»` Puede arrastrar la pestaña para cambiar el orden.

Para exhibir rápidamente el panel con el [menú de Comando](https://developer.chrome.com/docs/devtools/command-menu/):

1. {% Instruction 'devtools', 'none' %}
2. {% Instruction 'devtools-command', 'none' %}
3. Empiece escribiendo "Lighthouse".
4. Presione `Enter`.

## Emulación móvil {: #emulation }

Lighthouse sigue una mentalidad centrada en los dispositivos móviles. Los problemas de rendimiento son más evidentes en condiciones móviles típicas, pero los desarrolladores a menudo no realizan pruebas en estas condiciones. Es por eso que la configuración predeterminada en Lighthouse aplica la emulación móvil. La emulación consta de:

- Condiciones de CPU y red lentas simuladas (a través de un motor de simulación llamado [Lantern](https://github.com/GoogleChrome/lighthouse/blob/master/docs/lantern.md)).
- Emulación de pantalla de dispositivo (la misma que se encuentra en Chrome DevTools).

Desde el principio, Lighthouse ha utilizado Nexus 5X como dispositivo de referencia. En los últimos años, la mayoría de los ingenieros de rendimiento han estado utilizando Moto G4 para realizar pruebas. Ahora Lighthouse está haciendo lo mismo y ha cambiado su dispositivo de referencia a Moto G4. En la práctica, este cambio no es muy notorio, pero aquí están todos los cambios detectables por una página web:

- El tamaño de la pantalla cambia de 412x660 px a 360x640 px.
- La cadena del agente de usuario se cambia ligeramente, la parte del dispositivo que antes era `Nexus 5 Build/MRA58N` ahora será `Moto G (4)`.

A partir de Chrome 81, Moto G4 también está disponible en la lista de emulación de dispositivos Chrome DevTools.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wMyHDbxs49CTJ831UBp7.png", alt="Lista de emulación de dispositivos de Chrome DevTools con Moto G4 incluido.", width="800", height="653" %}</figure>

## Extensión del navegador {: #extension }

La [extensión de Chrome para Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) ha sido una forma conveniente de ejecutar Lighthouse localmente. Desafortunadamente, implementar el soporte fue complicado. Sentimos que debido a que el panel  de **Lighthouse** de Chrome DevTools es una experiencia mejor (el informe se integra con otros paneles), podríamos reducir nuestra sobrecarga de ingeniería simplificando la extensión de Chrome.

En lugar de ejecutar Lighthouse localmente, la extensión ahora usa la [API de PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started). Reconocemos que esto no será un reemplazo adecuado para algunos de nuestros usuarios. Estas son las diferencias clave:

- PageSpeed Insights no puede auditar sitios web no públicos, ya que se ejecuta a través de un servidor remoto y no a través de su instancia local de Chrome. Si necesita auditar un sitio web no público, use el panel DevTools **Lighthouse** o Node CLI.
- No se garantiza que PageSpeed Insights utilice la última versión de Lighthouse. Si desea utilizar la última versión, use Node CLI. La extensión del navegador se actualizará entre 1 y 2 semanas después del lanzamiento.
- PageSpeed Insights es una API de Google, su uso constituye la aceptación de los Términos de servicio de la API de Google. Si no desea o no puede aceptar los términos del servicio, utilice el panel DevTools **Lighthouse** o Node CLI.

La buena noticia es que simplificar la historia del producto nos permitió centrarnos en otros problemas de ingeniería. Como resultado, lanzamos la [extensión Lighthouse para Firefox](https://addons.mozilla.org/firefox/addon/google-lighthouse/).

## Presupuestos {: #budgets }

Lighthouse 5.0 introdujo [presupuestos de rendimiento](/performance-budgets-101/) que admitían la adición de umbrales para [la cantidad de cada tipo de recurso](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md#resource-budgets) (como scripts, imágenes o css) que una página puede servir.

Lighthouse 6.0 agrega [soporte para métricas presupuestarias](https://github.com/GoogleChrome/lighthouse/blob/master/docs/performance-budgets.md#timing-budgets), por lo que ahora puede establecer umbrales para métricas específicas como FCP. Por ahora, los presupuestos solo están disponibles para Node CLI y Lighthouse CI.

## Enlaces de ubicación de origen {: #source-location }

Algunos de los problemas que Lighthouse encuentra sobre una página se pueden rastrear hasta una línea específica de código fuente y el informe indicará el archivo y la línea exactos que son relevantes. Para facilitar la exploración en DevTools, al hacer clic en las ubicaciones especificadas en el informe se abrirán los archivos relevantes en el panel **Fuentes.**

<figure>
  <video autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/lighthouse-whats-new-6.0/lighthouse-source-location.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/lighthouse-whats-new-6.0/lighthouse-source-location.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>DevTools revela la línea exacta de código que causa el problema.</figcaption></figure>

## En el horizonte {: #horizon }

Lighthouse ha comenzado a experimentar con la recopilación de mapas de origen para impulsar nuevas funciones, como:

- Detección de módulos duplicados en paquetes de JavaScript.
- Detección de polyfills excesivos o transformaciones en el código enviado a los navegadores modernos.
- Mejora de la auditoría de JavaScript no utilizado para proporcionar granularidad a nivel modular.
- Visualizaciones de mapas de árbol que destacan los módulos que requieren acción.
- Visualización del código fuente original de los elementos del informe con una "ubicación de origen".

<figure>{% Img src="image/admin/iZPhM3KNQebgwCsgXTuf.png", alt="JavaScript no utilizado que muestra módulos de mapas de origen", width="600", height="566" %}<figcaption>. La auditoría de JavaScript no utilizado emplea mapas de origen para mostrar el código no utilizado en módulos empaquetados específicos.</figcaption></figure>

Estas funciones estarán habilitadas de forma predeterminada en una versión futura de Lighthouse. Por ahora, puede ver las auditorías experimentales de Lighthouse con la siguiente bandera CLI:

```bash
lighthouse https://web.dev --view --preset experimental
```

## ¡Gracias! {: #thanks }

Le agradecemos por usar Lighthouse y brindarnos sus comentarios. Sus comentarios nos ayudan a mejorar Lighthouse y esperamos que Lighthouse 6.0 aumente el rendimiento de sus sitios web.

¿Qué puedes hacer a continuación?

- Abrir Chrome Canary y probar el panel de **Lighthouse**.
- Utilizar Node CLI: `npm install -g lighthouse && lighthouse https://yoursite.com --view`.
- Hacer que [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci#lighthouse-ci) funcione con su proyecto.
- Revisar la [documentación de auditoría de Lighthouse](/learn/#lighthouse).
- ¡Divertirte mejorando la Internet!

Nos apasiona la Internet y nos encanta trabajar con la comunidad de desarrolladores para crear herramientas que ayuden a mejorarla. Lighthouse es un proyecto de código abierto y extendemos un gran agradecimiento a todos los colaboradores que ayudaron con todo, desde correcciones de errores tipográficos hasta la refactorización de la documentación y nuevas auditorías. [Deseas contribuir?](https://github.com/GoogleChrome/lighthouse/blob/master/CONTRIBUTING.md) Pase por el [repositorio de Lighthouse en GitHub](https://github.com/GoogleChrome/lighthouse).
