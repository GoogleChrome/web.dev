---
layout: post
title: Medir el rendimiento con el modelo RAIL
description: |2-

  El modelo RAIL permite a los diseñadores y desarrolladores definir de manera confiable el trabajo de optimización del rendimiento que tiene el mayor impacto en la experiencia del usuario. Conoce qué objetivos y pautas establece el modelo RAIL y qué herramientas puedes utilizar para lograrlos.
date: 2020-06-10
tags:
  - performance
  - animations
  - devtools
  - lighthouse
  - metrics
  - mobile
  - network
  - rendering
  - ux
---

**RAIL** es un modelo de rendimiento **centrado en el usuario** que proporciona una estructura para pensar en el rendimiento. El modelo divide la experiencia del usuario en acciones clave (por ejemplo, tocar, desplazar, cargar) y te ayudará a definir los objetivos de rendimiento para cada una de ellas.

RAIL representa cuatro aspectos distintos del ciclo de vida de las aplicaciones web: respuesta, animación, inactivo y carga. Los usuarios tienen diferentes expectativas de rendimiento para cada uno de estos contextos, por lo que los objetivos de rendimiento se definen en función del contexto y en la [investigación de UX sobre cómo los usuarios perciben los retrasos](https://www.nngroup.com/articles/response-times-3-important-limits/).

<figure>{% Img src="image/admin/uc1IWVOW2wEhIY6z4KjJ.png", alt="Las 4 partes del modelo de rendimiento de RAIL: respuesta, animación, inactivo y carga", width="800", height="290" %} <figcaption> Las 4 partes del modelo de rendimiento RAIL</figcaption></figure>

## Centrarse en el usuario

Haz que los usuarios sean el punto de enfoque del desempeño de tu esfuerzo. La siguiente tabla describe las métricas clave de cómo los usuarios perciben los retrasos en el rendimiento:

<table class="table-wrapper scrollbar">
  <thead>Percepción del usuario de los retrasos en el rendimiento</thead>
  <tr>
    <td>0 a 16 ms</td>
    <td>Los usuarios son excepcionalmente buenos para rastrear el movimiento y no les gusta cuando las animaciones no son fluidas. Perciben que las animaciones son fluidas siempre que se rendericen 60 nuevos fotogramas por segundo. Eso es 16 ms por cada cuadro, incluido el tiempo que tarda el navegador en pintar el nuevo cuadro en la pantalla, dejando una aplicación de unos 10 ms para producir un cuadro.</td>
  </tr>
  <tr>
    <td>0 a 100 ms</td>
    <td>Responde a las acciones del usuario dentro de esta ventana de tiempo y los usuarios sentirán que el resultado es inmediato. Un poco más y la conexión entre acción y reacción se rompe.</td>
  </tr>
  <tr>
    <td>100 hasta 1000 ms</td>
    <td>Dentro de esta ventana, las cosas se sienten parte de una progresión natural y continua de tareas. Para la mayoría de los usuarios de la web, cargar páginas o cambiar de vista representa una tarea.</td>
  </tr>
  <tr>
    <td>1000 ms o más</td>
    <td>Más allá de 1000 milisegundos (1 segundo), los usuarios pierden el enfoque en la tarea que están realizando.</td>
  </tr>
  <tr>
    <td>10000 ms o más</td>
    <td>Más allá de los 10000 milisegundos (10 segundos), los usuarios se sienten frustrados y es probable que abandonen las tareas. Puede que vuelvan o no más tarde.</td>
  </tr>
</table>

{% Aside %} Los usuarios perciben los retrasos en el rendimiento de manera diferente, según las condiciones de la red y el hardware. Por ejemplo, la carga de sitios en una máquina de escritorio potente a través de una conexión Wi-Fi rápida ocurre comúnmente en menos de 1 segundo y los usuarios se han acostumbrado a eso. La carga de sitios en dispositivos móviles con conexiones 3G lentas lleva más tiempo, por lo que los usuarios de dispositivos móviles son generalmente más pacientes y la carga en 5 segundos en el dispositivo móvil es un objetivo más realista. {% endAside %}

## Objetivos y directrices

En el contexto de RAIL, los términos **objetivos** y **directrices** tienen significados específicos:

- **Objetivos**: Métricas clave de rendimiento relacionadas con la experiencia del usuario. Por ejemplo, un toque para pintar en menos de 100 milisegundos. Dado que la percepción humana es relativamente constante, es poco probable que estos objetivos cambien pronto.

- **Directrices**: Recomendaciones que te ayudan a alcanzar tus metas. Estos pueden ser específicos del hardware actual y las condiciones de conexión de red y, por lo tanto, pueden cambiar con el tiempo.

## Respuesta: procesar eventos en menos de 50 ms

**Objetivo**: Completar una transición iniciada por la entrada del usuario en 100 ms, para que los usuarios sientan que las interacciones son instantáneas.

**Directrices**:

- Para garantizar una respuesta visible en 100 ms, se deben de procesar los eventos de entrada del usuario en 50 ms. Esto se aplica a la mayoría de las entradas, como hacer clic en botones, alternar controles de formulario o iniciar animaciones. Esto no se aplica a los arrastres táctiles o los desplazamientos.

- Aunque puede parecer contradictorio, no siempre es la decisión correcta responder a la entrada del usuario de forma inmediata. Puedes utilizar esta ventana de 100 ms para realizar otros trabajos costosos, pero ten cuidado de no bloquear al usuario. Si es posible, trabaja en segundo plano.

- Para todas las acciones que tarden más de 50 ms en completarse, siempre proporciona comentarios.

### ¿50 ms o 100 ms?

Si el objetivo es responder a la entrada en menos de 100 ms, entonces, ¿por qué nuestro presupuesto es de solo 50 ms? Esto se debe a que generalmente se está realizando otro trabajo además del manejo de entrada y ese trabajo ocupa parte del tiempo disponible para una respuesta de entrada aceptable. Si una aplicación está realizando trabajo en los tiempos recomendados de 50 ms durante el tiempo de inactividad, eso significa que la entrada se puede poner en cola hasta 50 ms si ocurre durante uno de esos tiempos de trabajo. Teniendo en cuenta esto, es seguro asumir que solo los 50 ms restantes están disponibles para el manejo de entrada real. Este efecto se visualiza en el diagrama a continuación que muestra cómo se coloca en cola la entrada recibida durante una tarea inactiva, reduciendo el tiempo de procesamiento disponible:

<figure>{% Img src="image/admin/I7HDZ9qGxe0jAzz6PxNq.png", alt="Diagrama que muestra cómo se pone en cola la entrada recibida durante una tarea inactiva, lo que reduce el tiempo de procesamiento de entrada disponible a 50 ms", width="800", height="400" %} <figcaption> Cómo las tareas inactivas afectan el presupuesto de respuesta de entrada.</figcaption></figure>

## Animación: produce un fotograma en 10 ms

**Objetivos**:

- Produce cada fotograma de una animación en 10 ms o menos. Técnicamente, el presupuesto máximo para cada fotograma es de 16 ms (1000 ms / 60 fotogramas por segundo ≈ 16 ms), pero los navegadores necesitan unos 6 ms para renderizar cada fotograma, de ahí surge la pauta de 10 ms por fotograma.

- Tu meta debe de ser la suavidad visual. Los usuarios notan cuando las velocidades de fotogramas varían.

**Directrices**:

- En puntos de alta presión como las animaciones, la clave es no hacer nada donde se pueda y el mínimo absoluto donde no puedas. Siempre que sea posible, utiliza la respuesta de 100 ms para calcular previamente el trabajo costoso para maximizar sus posibilidades de alcanzar los 60 fps.

- Consulta [Rendimiento del renderizado](/rendering-performance/) para conocer varias estrategias de optimización de animaciones.

{% Aside %} Reconoce todos los tipos de animaciones. Las animaciones no son solo efectos de interfaz de usuario sofisticados. Cada una de estas interacciones se consideran animaciones:

- Animaciones visuales, como entradas y salidas, [interpolaciones](https://www.webopedia.com/TERM/T/tweening.html) e indicadores de carga.
- Desplazamientos. Esto incluye el lanzamiento, que es cuando el usuario comienza a desplazarse, luego lo suelta y la página continúa desplazándose.
- Arrastrar. Las animaciones suelen seguir las interacciones del usuario, como desplazarse por un mapa o pellizcar para hacer zoom. {% endAside %}

## Inactivo: maximiza el tiempo inactivo

**Objetivo**: Maximiza el tiempo de inactividad para aumentar las probabilidades de que la página responda a la entrada del usuario en 50 ms.

**Directrices**:

- Utiliza el tiempo de inactividad para completar el trabajo diferido. Por ejemplo, para la carga inicial de la página, carga la menor cantidad de datos posible y luego usa [el tiempo de inactividad](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback) para cargar lo restante.

- Realiza el trabajo durante el tiempo de inactividad en 50 ms o menos. Si transcurre más tiempo, corres el riesgo de interferir con la capacidad de la aplicación para responder a la entrada del usuario en 50 ms.

- Si un usuario interactúa con una página durante el trabajo de tiempo inactivo, la interacción del usuario siempre debe tener la máxima prioridad e interrumpir el trabajo del tiempo inactivo.

## Carga: entrega contenido y conviértete en interactivo en menos de 5 segundos

Cuando las páginas se cargan lentamente, la atención del usuario se reduce y los usuarios perciben que la tarea no funciona. Los sitios que se cargan rápidamente tienen [sesiones promedio más largas, tasas de rebote más bajas y una mayor visibilidad de los anuncios](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/).

**Objetivos**:

- Optimiza para obtener un rendimiento de carga rápido en relación con las capacidades del dispositivo y la red de tus usuarios. Actualmente, un buen objetivo para las primeras cargas es cargar la página y convertirse en [interactivo](/tti/) en [5 segundos o menos en dispositivos móviles de rango medio con conexiones 3G lentas](/performance-budgets-101/#establish-a-baseline).

- Para cargas posteriores, un buen objetivo es cargar la página en menos de 2 segundos.

{% Aside %}

Ten en cuenta que estos objetivos pueden cambiar con el tiempo.

{% endAside %}

**Directrices**:

- Prueba el rendimiento de tu carga en los dispositivos móviles y las conexiones de red que son comunes entre tus usuarios. Puedes utilizar el [Informe de experiencia del usuario de Chrome](/chrome-ux-report/) para conocer la [distribución de conexiones](/chrome-ux-report-data-studio-dashboard/#using-the-dashboard) de tus usuarios. Si los datos no están disponibles para tu sitio, [The Mobile Economy 2019](https://www.gsma.com/mobileeconomy/) sugiere que una metrica promedio a nivel global es un teléfono Android de rango medio, como un Moto G4, y una red 3G lenta (definida como RTT de 400 ms y velocidad de transferencia de 400 kbps). Esta combinación está disponible en [WebPageTest](https://www.webpagetest.org/easy).

- Ten en cuenta que, aunque el dispositivo de un usuario móvil típico puede afirmar que está en una conexión 2G, 3G o 4G, en realidad la [velocidad de conexión efectiva](/adaptive-serving-based-on-network-quality/#how-it-works) suele ser significativamente más lenta debido a la pérdida de paquetes y la variación de la red.

- [Elimina los recursos que bloquean el procesamiento](/render-blocking-resources/).

- No tienes que cargar todo en menos de 5 segundos para producir la percepción de una carga completa. Considera las  [imágenes de carga diferida](/browser-level-image-lazy-loading/), [dividir el código de Javascript en paquetes](/reduce-javascript-payloads-with-code-splitting/) y otras [optimizaciones sugeridas en web.dev](/fast/).

{% Aside %} Reconoce los factores que afectan el rendimiento de carga de la página:

- Velocidad y latencia de la red
- Hardware (CPU más lentas, por ejemplo)
- Desalojo de caché
- Diferencias en el almacenamiento en caché L2 o L3
- Analizando JavaScript {% endAside %}

## Herramientas para medir RAIL

Hay algunas herramientas que te ayudarán a automatizar tus mediciones RAIL. La herramienta a utilizar dependerá del tipo de información que necesites y del tipo de flujo de trabajo que prefieras.

### Chrome DevTools

[Chrome DevTools](https://developer.chrome.com/docs/devtools/) proporciona un análisis en profundidad de todo lo que sucede mientras tu página se carga o se ejecuta. Consulta [Introducción al análisis del rendimiento en tiempo de ejecución](https://developer.chrome.com/docs/devtools/evaluate-performance/) para familiarizarse con la interfaz de usuario del panel de **Rendimiento**.

Las siguientes funciones de DevTools son especialmente relevantes:

- [Throttle (estrangula) tu CPU](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#cpu-throttle) para simular un dispositivo menos potente.

- [Throttle tu red](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network-throttle) para simular conexiones más lentas.

- [Ver la actividad del hilo principal](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#main) para ver todos los eventos que ocurrieron en el hilo principal mientras estaba grabando.

- [Ver las actividades del hilo principal en una tabla](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#activities) para ordenar las actividades en función de las que consumieron más tiempo.

- [Analizar fotogramas por segundo (FPS)](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#fps) para medir si tus animaciones realmente se ejecutan sin problemas.

- [Supervisa el uso de la CPU, el tamaño del JS, los nodos DOM, los diseños por segundo y más](https://developers.google.com/web/updates/2017/11/devtools-release-notes#perf-monitor) en tiempo real con el **Monitor de rendimiento**.

- [Visualizar las solicitudes de red](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network) en la sección de **Red** que se produjeron mientras grababas.

- [Obtén captura pantallas mientras grabas](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#screenshots) para reproducir exactamente cómo se veía la página mientras se cargaba, o se activaba una animación, etc.

- [Ver las interacciones](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#interactions) para identificar rápidamente lo que sucedió en una página después de que un usuario interactuó con ella.

- [Encuentra problemas de rendimiento de desplazamiento en tiempo real](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#scrolling-performance-issues) resaltando la página cada vez que se dispara un oyente potencialmente problemático.

- [Ver eventos de pintura en tiempo real](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#paint-flashing) para identificar eventos de pintura costosos que pueden perjudicar el rendimiento de tus animaciones.

### Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) está disponible en Chrome DevTools, en [web.dev/measure](/measure/) como una extensión de Chrome, como un módulo Node.js y dentro de WebPageTest. Ingresas una URL, esta simula un dispositivo de rango medio con una conexión 3G lenta, ejecuta una serie de auditorías en la página y luego te brinda un informe sobre el rendimiento de la carga, así como sugerencias sobre cómo mejorar.

Las siguientes auditorías son especialmente relevantes:

**Respuesta**

- [Max Potential First Input Delay (FID): Potencial máximo de la Demora de la primera entrada](/lighthouse-max-potential-fid/). Calcula cuánto tardará su aplicación en responder a la entrada del usuario, según el tiempo de inactividad del hilo principal.

- [No utilizas oyentes pasivos para mejorar el rendimiento del desplazamiento](/uses-passive-event-listeners/).

- [Total Blocking Time (TBT): Tiempo total de bloqueo](/lighthouse-total-blocking-time/). Mide la cantidad total de tiempo que una página está bloqueada para que no responda a la entrada del usuario, como los clics del mouse, los toques de la pantalla o las pulsaciones del teclado.

- [Time To Interact (TTI): Tiempo para interactuar](https://developers.google.com/web/tools/lighthouse/audits/consistently-interactive). Mide cuándo un usuario puede interactuar constantemente con todos los elementos de la página.

**Carga**

- [No registras un service worker que controla la página y start_url](/service-worker/). Un service worker puede almacenar en caché recursos comunes en el dispositivo de un usuario, lo que reduce el tiempo dedicado a buscar recursos en la red.

- [La carga de la página no es lo suficientemente rápida en las redes móviles](/load-fast-enough-for-pwa/).

- [Elimina los recursos que bloquean la renderización](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources).

- [Aplazar las imágenes fuera de la pantalla](/offscreen-images/). Aplaza la carga de imágenes fuera de la pantalla hasta que sean necesarias.

- [Imágenes de tamaño adecuado](/uses-responsive-images/). No publiques imágenes que sean significativamente más grandes que el tamaño que se muestra en la ventana gráfica del dispositivo móvil.

- [Evita encadenar solicitudes críticas](/critical-request-chains/).

- [No usas HTTP/2 para todos tus recursos](/uses-http2/).

- [Codifica imágenes de manera eficiente](/uses-optimized-images/).

- [Habilita la compresión de texto](/uses-text-compression/).

- [Evita enormes cargas útiles de red](/total-byte-weight/).

- [Evita un tamaño de DOM excesivo](/dom-size/). Reduce los bytes de red enviando solo los nodos DOM que se necesitan para renderizar la página.

### WebPageTest

WebPageTest es una herramienta web de rendimiento que utiliza navegadores reales para acceder a páginas web y recopilar métricas de tiempo. Ingresas una URL en [webpagetest.org/easy](https://webpagetest.org/easy) para obtener un informe detallado sobre el rendimiento de carga de la página en un dispositivo Moto G4 real con una conexión 3G lenta. También puedes configurarlo para incluir una auditoría de Lighthouse.

## Resumen

RAIL es una oportunidad para ver la experiencia del usuario de un sitio web como un viaje compuesto por distintas interacciones. Comprendes la forma de cómo los usuarios perciben tu sitio y así establecer objetivos de rendimiento formando un mayor impacto en la experiencia del usuario.

- Centrarse en el usuario.

- Procesar la entrada del usuario en menos de 100 ms.

- Producir un fotograma en menos de 10 ms al animar o desplazarse.

- Maximizar el tiempo de inactividad del hilo principal.

- Cargar contenido interactivo en menos de 5000 ms.
