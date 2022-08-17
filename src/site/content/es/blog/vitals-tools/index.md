---
title: Herramientas para medir Core Web Vitals
subhead: Sus herramientas de desarrollo favoritas ahora pueden medir los Core Web Vitals.
authors:
  - addyosmani
  - egsweeny
date: 2020-05-28
description: Lea sobre la recién anunciada compatibilidad de las medidas de Core Web Vitals con herramientas populares para desarrolladores web como Lighthouse, PageSpeed Insights, Chrome UX Report y muchas otras.
hero: image/admin/wNtXgv1OE2OETdiSzi8l.png
thumbnail: image/admin/KxBRBQe5CRZpCxNYyW2H.png
alt: Logotipo de Chrome User Experience, logotipo de PageSpeed Insights, logotipo de Lighthouse, logotipo de Search Console, logotipo de Chrome DevTools, logotipo de la extensión Web Vitals.
tags:
  - blog
  - web-vitals
  - performance
---

La iniciativa [Web Vitals](/vitals/) recientemente anunciada proporciona una orientación unificada sobre las señales de calidad que son esenciales para que todos los sitios brinden una excelente experiencia de usuario en la web. Nos complace anunciar que **todas las herramientas populares de Google para desarrolladores web ahora son compatibles con las medidas de Core Web Vitals**, lo que le ayudará a diagnosticar y solucionar más fácilmente los problemas de la experiencia del usuario. Esto incluye [Lighthouse](https://github.com/GoogleChrome/lighthouse), [PageSpeed Insights](https://pagespeed.web.dev/), [Chrome DevTools](https://developer.chrome.com/docs/devtools/), [Search Console](https://search.google.com/search-console/about), [la herramienta de medición de web.dev](/measure/), la [extensión de Chrome Web Vitals](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)  y una nueva (!)[API de Chrome UX Report](https://developer.chrome.com/docs/crux/).

Ahora que la Búsqueda de Google incluye Core Web Vitals como base para evaluar la [experiencia de la página](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html), es importante que estas métricas estén disponibles y sean tan procesables como sea posible.

<figure>{% Img src="image/admin/V00vjrHmwzljYo04f3d3.png", alt="Resumen de Chrome y herramientas de búsqueda compatibles con las métricas de Core Web Vitals", width="800", height="509" %}</figure>

{% Aside 'key-term' %} Las **herramientas de laboratorio** brindan una visión sobre cómo un *usuario potencial* probablemente experimentará su sitio web y ofrecen resultados reproducibles para la depuración. Las herramientas de **campo** brindan una visión sobre cómo sus *usuarios reales* experimentan su sitio web. Este tipo de medición a menudo se denomina Monitoreo de Usuarios Reales (RUM). Cada [herramienta de laboratorio o de campo](/how-to-measure-speed/#lab-data-vs-field-data) ofrece un valor distinto para optimizar su experiencia de usuario. {% endAside %}

Para empezar a optimizar la experiencia del usuario con Core Web Vitals, pruebe el siguiente flujo de trabajo:

- Utilice el nuevo Core Web Vitals Report de Search Console para identificar los grupos de páginas que requieren atención (según los datos de campo).
- Una vez que haya identificado las páginas que necesitan trabajo, utiliza PageSpeed Insights •	Una vez que haya identificado las páginas que necesitan atención, utilice PageSpeed Insights (impulsado por Lighthouse y Chrome UX Report) para diagnosticar problemas de laboratorio y de campo en una página. PageSpeed Insights (PSI) está disponible por medio de Search Console o puede introducir una URL directamente en PSI.
- ¿Está listo para optimizar su sitio localmente en el laboratorio? Utilice Lighthouse y Chrome DevTools para medir Core Web Vitals y obtenga una orientación práctica sobre qué corregir exactamente. La extensión de Chrome Web Vitals puede brindarle una visión en tiempo real de las métricas en el escritorio.
- ¿Necesita un panel de control personalizado de Core Web Vitals? Utilice el panel de control actualizado de CrUX o la nueva API de Chrome UX Report para los datos de campo o la API de PageSpeed Insights para los datos de laboratorio.
- ¿Busca orientación? web.dev/measure puede medir su página y mostrarle un conjunto priorizado de normas y laboratorios de código para la optimización, utilizando datos de PSI.
- Por último, utilice Lighthouse CI en las solicitudes de extracción para asegurarse de que no haya regresiones en Core Web Vitals antes de implementar un cambio en la producción.

Con esa introducción, ¡profundicemos en las actualizaciones específicas para cada herramienta!

### Lighthouse

Lighthouse es una herramienta automatizada de auditoría de sitios web que ayuda a que los desarrolladores diagnostiquen problemas e identifiquen oportunidades para mejorar la experiencia del usuario de sus sitios. Mide varias dimensiones de la calidad de la experiencia del usuario en un entorno de laboratorio, incluyendo el rendimiento y la accesibilidad. La última versión de Lighthouse ([6.0](/lighthouse-whats-new-6.0/), lanzada a mediados de mayo del 2020) incluye auditorías adicionales, nuevas métricas y una puntuación de rendimiento integrada recientemente.

<figure>{% Img src="image/admin/4j72CWywp2D88Xti8zBf.png", alt="Lighthouse 6.0 muestra las métricas más recientes de Core Web Vitals", width="800", height="527" %}</figure>

Lighthouse 6.0 introduce tres nuevas métricas en el informe. Dos de estas nuevas métricas, [Largest Contentful Paint : Despliegue del contenido más extenso](/lcp/) (LCP) y el [Cumulative Layout Shift: Cambio Acumulativo del diseño](/cls/) (CLS), son implementaciones del laboratorio Core Web Vitals y brindan información de diagnóstico importante para optimizar la experiencia del usuario. Dada su importancia para evaluar la experiencia del usuario, las nuevas métricas no solo se miden e incluyen en el reporte, sino que también se tienen en cuenta para calcular la puntuación de rendimiento.

La tercera nueva métrica incluida en Lighthouse, el [Total Blocking Time: Tiempo total de bloqueo](/tbt/) (TBT), se correlaciona bien con la métrica de campo [First Input Delay: Demora de la primera entrada](/fid/) (FID), otra métrica de Core Web Vitals. Si sigue las recomendaciones proporcionadas en el informe Lighthouse y optimiza sus resultados, podrá ofrecer la mejor experiencia posible a sus usuarios.

Todos los productos que potencian Lighthouse se actualizan para reflejar la última versión, incluyendo [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci), que le permitirán medir fácilmente sus Core Web Vitals en solicitudes de extracción antes de que se fusionen e implementen.

<figure>{% Img src="image/admin/aOm5ZAIUbspjcyRMIXbn.png", alt="Lighthouse CI muestra una visualización de diferencias con Largest Contentful Paint", width="800", height="498" %}</figure>

Para obtener más información sobre las últimas actualizaciones de Lighthouse, consulte nuestra publicación del blog [Novedades de Lighthouse 6.0.](/lighthouse-whats-new-6.0/)

### PageSpeed Insights

[PageSpeed Insights](https://pagespeed.web.dev/) (PSI) reporta sobre el rendimiento de laboratorio y de campo de una página en dispositivos móviles y equipos de escritorio. La herramienta proporciona una visión general de cómo los usuarios del mundo real experimentan la página (impulsada por Chrome UX Report) y un conjunto de recomendaciones prácticas sobre cómo el propietario de un sitio puede mejorar la experiencia de la página (proporcionada por Lighthouse).

PageSpeed Insights y la [API de PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started) también se actualizaron para usar Lighthouse 6.0 y ahora son compatibles con las medidas de Core Web Vitals en las secciones del reporte de laboratorio y de campo. Las Core Web Vitals se anotan con una cinta azul como se muestra a continuación.

<figure>{% Img src="image/admin/l1posckVsR7JeVGnk6Jv.png", alt="PageSpeed Insights con los datos de Core Web Vitals mostrados en el campo y en el laboratorio", width="800", height="873" %}</figure>

Si bien [Search Console](https://search.google.com/search-console/) ofrece a los propietarios de sitios una gran visión general de los grupos de páginas que necesitan atención, PSI ayuda a identificar oportunidades por página para mejorar la experiencia de la página. En PSI, podrá ver claramente si su página cumple o no con los umbrales para una buena experiencia en todos los Core Web Vitals en la parte superior del reporte, se indica si **acredita la evaluación Core Web Vitals** o **no acredita la evaluación Core Web Vitals**.

### CrUX

[Chrome UX Report](https://developer.chrome.com/docs/crux/) (CrUX) es un conjunto de datos públicos sobre la experiencia real del usuario en millones de sitios web. Mide las versiones de campo de todas las Core Web Vitals. A diferencia de los datos de laboratorio, los datos de CrUX provienen de [usuarios que han optado por participar](https://developer.chrome.com/docs/crux/methodology/#user-eligibility) en el campo. Con estos datos, los desarrolladores pueden comprender la distribución de las experiencias de los usuarios del mundo real en sus propios sitios web o incluso en los de la competencia. Incluso si no tiene RUM en su sitio, CrUX puede proporcionar una manera rápida y fácil de evaluar sus Core Web Vitals. El [conjunto de datos de CrUX en BigQuery](https://developer.chrome.com/docs/crux/bigquery/) incluye datos de rendimiento detallados para todos los Core Web Vitals y está disponible en instantáneas mensuales a nivel de origen.

La única manera de saber realmente cómo funciona su sitio para los usuarios es medir su rendimiento en el campo mientras esos usuarios lo cargan e interactúan con él. Este tipo de medición se conoce comúnmente como Monitoreo de usuarios reales, o RUM por sus siglas en inglés. Incluso si no tiene RUM en su sitio, CrUX puede proporcionar una manera rápida y fácil de evaluar sus Core Web Vitals.

**Introducción a la API de CrUX**

Hoy nos complace anunciar la [API de CrUX](http://developers.google.com/web/tools/chrome-user-experience-report/api/reference/), una forma rápida y gratuita de integrar fácilmente sus flujos de trabajo de desarrollo con la medida de calidad a nivel de origen y de URL para las siguientes métricas de campo:

- Largest Contentful Paint
- Cumulative Layout Shift
- First Input Delay
- First Contentful Paint

Los desarrolladores pueden consultar un origen o una URL y segmentar los resultados por diferentes factores de forma. La API se actualiza diariamente y resume los datos de los 28 días anteriores (a diferencia del conjunto de datos de BigQuery, que se agrega mensualmente). La API también tiene las mismas cuotas públicas reducidas que ponemos en nuestra otra API, la API de PageSpeed Insights (25,000 solicitudes al día).

A continuación se muestra una [demostración](/chrome-ux-report-api/) que utiliza la API de CrUX para visualizar las métricas de Core Web Vitals con distribuciones **buenas**, **que necesitan mejoras** y **deficientes**:

<figure>{% Img src="image/admin/ye3CMKfacSItYA2lqItP.png", alt="Demostración de la API Informe de experiencia del usuario de Chrome que muestra las métricas de Core Web Vitals", width="800", height="523" %}</figure>

En versiones futuras, planeamos expandir la API para permitir el acceso a dimensiones y métricas adicionales del conjunto de datos de CrUX.

**Panel de control de CrUX renovado**

El [panel de control de CrUX](http://g.co/chromeuxdash) recientemente rediseñado le permite rastrear fácilmente el rendimiento de un origen a lo largo del tiempo, y ahora puede utilizarlo para monitorear las distribuciones de todas las métricas de Core Web Vitals. Para comenzar con el panel, consulte nuestro [tutorial](/chrome-ux-report-data-studio-dashboard/) en web.dev.

<figure>{% Img src="image/admin/OjbICyhI21RNfGXrFP1x.png", alt="Panel de Informes de experiencia del usuario de Chrome que muestra las métricas de Core Web Vitals en una nueva página de destino", width="800", height="497" %}</figure>

Introducimos una nueva página de inicio de Core Web Vitals para que sea aún más fácil ver el rendimiento de su sitio de un vistazo. Agradecemos sus comentarios sobre todas las herramientas de CrUX, para compartir sus opiniones y preguntas, póngase en contacto con nosotros en la cuenta de Twitter [@ChromeUXReport](https://groups.google.com/a/chromium.org/g/chrome-ux-report) o en el [Grupo de Google](https://groups.google.com/a/chromium.org/g/chrome-ux-report).

### Panel de rendimiento de Chrome DevTools

**Depurar eventos de cambio de diseño en la sección Experiencia**

El **rendimiento** del panel Chrome DevTools tiene una nueva **[sección de Experiencia](https://developers.google.com/web/updates/2020/05/devtools#cls)** que puede ayudarle a detectar cambios de diseño inesperados. Esto es útil para encontrar y solucionar problemas de inestabilidad visual en su página que contribuyen al Cumulative Layout Shift.

<figure>{% Img src="image/admin/VMbZAgKCi5V6FiQyu631.png", alt="Cumulative Layout Shift mostrado con registros rojos en el panel Rendimiento", width="800", height="517" %}</figure>

Seleccione un cambio de diseño para ver sus detalles en la pestaña **Resumen**. Para visualizar dónde se produjo el cambio per se, coloque el cursor sobre los campos  **Moved from** y **Moved to**.

**Depuración para la disponibilidad de la interacción con Total Blocking Time en el pie de página**

La métrica Total Blocking Time (TBT) se puede medir en herramientas de laboratorio y es un excelente proxy para  First Input Delay. TBT mide la cantidad total de tiempo entre [First Contentful Paint (FCP)](/fcp/) y [Time to Interactive (TTI)](/tti/) donde el subproceso principal estuvo bloqueado durante el tiempo suficiente para evitar la respuesta de entrada. Las optimizaciones de rendimiento que mejoran el TBT en el laboratorio deberían mejorar el FID en el campo.

<figure>{% Img src="image/admin/WufuLpvrZfgbRn70C74V.png", alt="Total Blocking Time displayed se muestra en el pie de página del panel de rendimiento de DevTools", width="800", height="517" %}</figure>

TBT se muestra ahora en el pie de página del panel de **rendimiento** de Chrome DevTools cuando se mide el rendimiento de la página:

{% Instruction 'devtools-performance', 'ol' %}

1. Haga clic en **Grabar** .
2. Vuelva a cargar la página manualmente.
3. Espere a que se cargue la página y luego detenga la grabación.

Para obtener más información, consulte [Novedades de DevTools (Chrome 84)](https://developers.google.com/web/updates/2020/05/devtools#cls) .

### Search Console

El nuevo [Core Web Vitals Report](https://support.google.com/webmasters/answer/9205520) en Search Console le ayuda a identificar grupos de páginas de su sitio que requieren atención, según los datos del mundo real (de campo) de CrUX. El rendimiento de las URL se agrupa por estado, tipo de métrica y grupo de URL (grupos de páginas web similares).

<figure>{% Img src="image/admin/BjTUt0xdWXD9hrLsbhLK.png", alt="Nuevo Core Web Vitals Report de Search Console", width="800", height="1000" %}</figure>

El reporte se basa en las tres métricas de Core Web Vitals: LCP, FID y CLS.  Si una URL no tiene una cantidad mínima de datos para reportar estas métricas, se omite del reporte. Pruebe el nuevo reporte para obtener una visión global del rendimiento de su origen.

Una vez que identifique un tipo de página que tenga problemas relacionados con Core Web Vitals, puede utilizar PageSpeed Insights para conocer sugerencias de optimización específicas para páginas representativas.

#### web.dev

[web.dev/measure](/measure/) le permite medir el rendimiento de su página a lo largo del tiempo, al brindar una lista priorizada de normas y codelabs sobre cómo mejorar. Su medición es impulsada por PageSpeed Insights. La herramienta de medición ahora también es compatible con las métricas de Core Web Vitals, como se muestra a continuación:

<figure>{% Img src="image/admin/ryoV1T1PhxUmo9zdCsDe.png", alt="Mida las métricas de Core Web Vitals a lo largo del tiempo y obtenga orientación priorizada con la herramienta de medición de web.dev", width="800", height="459" %}</figure>

### Extensión Web Vitals

La extensión Web Vitals mide las tres métricas de Core Web Vitals en tiempo real para Google Chrome (de escritorio). Esto es útil para detectar problemas en una fase temprana del flujo de trabajo de desarrollo y como herramienta de diagnóstico para evaluar el rendimiento de Core Web Vitals mientras se navega por la web.

¡La extensión ya está disponible para su instalación desde [Chrome Web Store](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)! Esperamos que le sea de utilidad. Agradecemos cualquier contribución para mejorarlo, así como los comentarios sobre el repositorio de [GitHub](https://github.com/GoogleChrome/web-vitals-extension/) del proyecto.

<figure>{% Img src="image/admin/woROdEmNV4jlHDPryjBQ.png", alt="Core Web Vitals se muestra en tiempo real con la extensión de Chrome Web Vitals", width="800", height="459" %}</figure>

#### Aspectos más destacados

¡Eso es un envoltorio! ¿Qué puede hacer a continuación?:

- Utilice **Lighthouse** en DevTools para optimizar su experiencia de usuario y asegurarse de que se está preparando para el éxito con Core Web Vitals en el campo.
- Utilice **PageSpeed Insights** para comparar el rendimiento de Core Web Vitals en el laboratorio y en el campo.
- Pruebe la nueva **API de Chrome User Experience Report** para acceder fácilmente a los resultados de su origen y su URL con respecto a Core Web Vitals durante los últimos 28 días.
- Utilice la sección y el pie de página de **Experiencia** en el panel de **Rendimiento** de DevTools para profundizar y depurar contra Core Web Vitals específicos.
- Utilice **el Core Web Vitals Report de Search Console** para obtener un resumen del rendimiento de sus orígenes en el campo.
- Utilice la **extensión Web Vitals** para realizar un seguimiento del rendimiento de una página con respecto a Core Web Vitals en tiempo real.

Hablaremos más sobre nuestras herramientas Core Web Vitals en [web.dev Live](/live/) en junio. ¡Regístrese para recibir información sobre el evento!

~ por Elizabeth y Addy, Conserjería de WebPerf
