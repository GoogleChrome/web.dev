---
layout: post
title: "¿Qué se necesita para que una Aplicación Web Progresiva sea buena?"
authors:
  - samrichard
  - petelepage
date: 2020-01-06
updated: 2022-07-18
description: "¿Qué se necesita para que una Aplicación Web Progresiva sea buena o excelente?"
tags:
  - progressive-web-apps
---

<!-- Disable heading-increment because it mucks with the Details widget -->

<!--lint disable heading-increment-->

Las Aplicaciones Web Progresivas (PWA) se crean y mejoran con API modernas para ofrecer funciones mejoradas, seguridad y capacidad para su instalación, mientras llegan a *cualquier persona, en cualquier lugar y en cualquier dispositivo* con una sola base de código. Para ayudarle a crear la mejor experiencia posible, utilice las listas de verificación y las recomendaciones [principal](#core) y [óptima](#optimal) para que le orienten.

## Lista de verificación principal de la Aplicación Web Progresiva {: #core}

En la lista de verificación de las Aplicaciones Web Progresivas se describe de qué manera una aplicación puede instalarse y ser utilizada por todos los usuarios, independientemente de su tamaño o tipo de entrada.

{% Details %} {% DetailsSummary 'h3' %}

Iniciar rápido, mantenerse rápido

El rendimiento representa un papel importante en el éxito de cualquier experiencia en línea, ya que los sitios de alto rendimiento atraen y retienen mejor a los usuarios a diferencia de los de bajo rendimiento. Los sitios deben centrarse en optimizar las métricas de rendimiento centradas en el usuario.

{% endDetailsSummary %}

El rendimiento representa un papel importante en el éxito de cualquier experiencia en línea, ya que los sitios de alto rendimiento atraen y retienen mejor a los usuarios a diferencia de los de bajo rendimiento. Los sitios deben centrarse en optimizar las métricas de rendimiento centradas en el usuario.

#### Por qué

La velocidad es fundamental para lograr que los usuarios *utilicen* su aplicación. De hecho, conforme el tiempo de carga de la página aumenta de un segundo a diez segundos, la probabilidad de que un usuario se retire aumenta en un 123%. El rendimiento no termina con el evento `load`. Los usuarios nunca deben preguntarse si su interacción (por ejemplo, hacer clic en un botón) se registró o no. Tanto la navegación como las animaciones deben ser muy fluidas. El rendimiento afecta a toda la experiencia, desde la forma en que los usuarios perciben la aplicación hasta cómo funciona realmente.

Si bien todas las aplicaciones tienen diferentes requisitos, las auditorías de rendimiento en Lighthouse se basan en el [modelo de rendimiento centrado en el usuario de RAIL](/rail/), y si consigue una puntuación alta en esas auditorías, será más probable que sus usuarios tengan una experiencia agradable. También puede utilizar [PageSpeed Insights](https://pagespeed.web.dev/) o el [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) para obtener datos de rendimiento del mundo real para su aplicación web.

#### Cómo

Consulte nuestra [guía sobre tiempos de carga rápidos](/fast/) para aprender a hacer que su PWA inicie rápido y se mantenga rápido.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Funciona en cualquier navegador

Los usuarios pueden utilizar cualquier navegador que elijan para acceder a su aplicación web antes de que se instale.

{% endDetailsSummary%}

Los usuarios pueden utilizar cualquier navegador que elijan para acceder a su aplicación web antes de que se instale.

#### Por qué

Las Aplicaciones Web Progresivas son, en primer lugar, aplicaciones web, y eso significa que tienen que funcionar en todos los navegadores, no solo en uno de ellos.

Una forma eficaz de hacerlo es, en palabras de Jeremy Keith en su libro [Resilient Web Design](https://resilientwebdesign.com/), identificar la funcionalidad principal, hacer que esa funcionalidad esté disponible utilizando la tecnología más sencilla posible, y después mejorar la experiencia cuando sea posible. En muchos casos, esto significa comenzar solo con HTML para crear la funcionalidad principal, y mejorar la experiencia del usuario con CSS y JavaScript para crear una experiencia más atractiva.

Por ejemplo, el envío de formularios. La forma más sencilla de implementarlo es un formulario HTML que envíe una solicitud `POST`. Después de crear eso, puede mejorar la experiencia con JavaScript para hacer la validación del formulario y enviarlo mediante AJAX, lo que mejora la experiencia para los usuarios que pueden admitirlo.

Tenga en cuenta que sus usuarios experimentarán su sitio a través de un amplio conjunto de dispositivos y navegadores. No se puede limitar a dirigirse al extremo superior del espectro. Si utiliza la detección de características, conseguirá ofrecer una experiencia utilizable para el mayor número posible de usuarios potenciales, incluyendo los que utilizan navegadores y dispositivos que posiblemente no existan en la actualidad.

#### Cómo

En el libro [Resilient Web Design](https://resilientwebdesign.com/) de Jeremy Keith hay un excelente recurso que describe cómo pensar en el diseño web con esta metodología progresiva y compatible con todos los navegadores.

#### Lectura adicional

- [Cómo comprender la mejora progresiva](https://alistapart.com/article/understandingprogressiveenhancement/), de A List Apart, es una buena introducción al tema.
- En el artículo de Smashing Magazine [Mejora progresiva (Progressive Enhancement): ¿Qué es y cómo se utiliza?](https://www.smashingmagazine.com/2009/04/progressive-enhancement-what-it-is-and-how-to-use-it/) Se ofrece una introducción práctica y enlaces sobre temas más avanzados.
- MDN tiene un artículo titulado [Implementación de la detección de características (Implementing feature detection)](https://developer.mozilla.org/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection) en el que se explica cómo detectar una característica con una consulta directa.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Se adapta a cualquier tamaño de pantalla

Los usuarios pueden utilizar su PWA con cualquier tamaño de pantalla y todo el contenido está disponible en cualquier tamaño de ventana de visualización.

{% endDetailsSummary %}

Los usuarios pueden utilizar su PWA con cualquier tamaño de pantalla y todo el contenido está disponible en cualquier tamaño de ventana de visualización.

#### Por qué

Los dispositivos presentan una gran variedad de tamaños, y los usuarios pueden utilizar su aplicación en una gran variedad de tamaños, incluso en el mismo dispositivo. Por lo tanto, es fundamental asegurarse de que el contenido no solo se ajusta a la ventana de visualización, sino que todas las funciones y el contenido del sitio se pueden utilizar en todos los tamaños de ventanas de visualización.

Las tareas que los usuarios desean completar y el contenido al que quieren acceder no cambian con el tamaño de la ventana de visualización. El contenido se puede reorganizar en diferentes tamaños de ventanas de visualización, y todo debería permanecer allí, de una forma u otra. De hecho, tal y como afirma Luke Wroblewski en su libro Mobile First, el hecho de comenzar con un tamaño pequeño y ampliarlo en vez de hacerlo a la inversa puede mejorar el diseño de un sitio:

> Los dispositivos móviles requieren que los equipos de desarrollo de software se centren únicamente en los datos y las acciones más importantes de una aplicación. En una pantalla de 320 por 480 pixeles no hay espacio para elementos innecesarios y remanentes. Es necesario jerarquizar.

#### Cómo

Hay muchos recursos sobre el diseño responsivo, incluyendo el [artículo original de Ethan Marcotte](https://alistapart.com/article/responsive-web-design/), una [colección de conceptos importantes](https://snugug.com/musings/principles-responsive-web-design/) sobre el tema, así como libros y conversaciones variadas. Para restringir esta discusión a los aspectos de contenido del diseño responsivo, puede profundizar en el [diseño del primer contenido](https://uxdesign.cc/why-you-should-design-the-content-first-for-better-experiences-374f4ba1fe3c) y los [diseños responsivos del contenido](https://alistapart.com/article/content-out-layout/). Por último, aunque se centra en los dispositivos móviles, las lecciones de [Siete mitos mortales sobre los dispositivos móviles (Seven Deadly Mobile Myths)](https://www.forbes.com/sites/anthonykosner/2012/05/03/seven-deadly-mobile-myths-josh-clark-debunks-the-desktop-paradigm-and-more/#21ecac977bca), de Josh Clark, son igual de relevantes para las visualizaciones de tamaño reducido de los sitios adaptativos que para los dispositivos móviles.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Ofrece una página personalizada sin conexión a Internet

Cuando los usuarios están desconectados, permanecer en su PWA proporciona una experiencia más continua que volver a la página desconectada del navegador predeterminado.

{% endDetailsSummary %}

Cuando los usuarios están desconectados, permanecer en su PWA proporciona una experiencia más continua que volver a la página desconectada del navegador predeterminado.

#### Por qué

Los usuarios esperan que las aplicaciones instaladas funcionen independientemente de su estado de conexión. Una aplicación específica de la plataforma nunca muestra una página en blanco cuando no tiene conexión, y una Aplicación Web Progresiva nunca debería mostrar la página sin conexión predeterminada del navegador. Al proporcionar una experiencia sin conexión personalizada, ya sea cuando un usuario navega hacia una URL que no se almacenó en la caché o cuando un usuario intenta utilizar una función que requiere una conexión, ayuda a que su experiencia web se sienta como si formara parte del dispositivo en el que se está ejecutando.

#### Cómo

Durante el evento `install` de un service worker, puede almacenar previamente en el caché una página personalizada sin conexión para su uso posterior. Si un usuario se desconecta, puede responder con la página personalizada y desconectada que almacenó previamente. Puede seguir nuestro ejemplo de [página sin conexión personalizada de muestra](https://googlechrome.github.io/samples/service-worker/custom-offline-page/) para ver un ejemplo de esto en acción y para que aprenda a implementarlo usted mismo.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Es instalable

Los usuarios que instalan o agregan aplicaciones a su dispositivo tienden a participar más en ellas.

{% endDetailsSummary %}

Los usuarios que instalan o agregan aplicaciones a su dispositivo tienden a participar más en ellas.

#### Por qué

Al instalar una Aplicación Web Progresiva, esta se ve, se siente y se comporta como todas las demás aplicaciones instaladas. Se ejecuta desde el mismo sitio en el que los usuarios inician sus otras aplicaciones. Se ejecuta en su propia ventana de aplicaciones, separada del navegador, y aparece en la lista de tareas, al igual que otras aplicaciones.

¿Por qué desea que un usuario instale su PWA? Por la misma razón por la que desearía que un usuario instalara su aplicación desde una tienda de aplicaciones. Los usuarios que instalan sus aplicaciones son su audiencia más comprometida, y tienen mejores métricas de participación que los visitantes convencionales, con frecuencia a la par de los usuarios de aplicaciones de los dispositivos móviles. Estas métricas incluyen más repeticiones de visitas, más tiempo en su sitio y mayores tasas de conversión.

#### Cómo

Puede seguir nuestra [guía de instalación](/customize-install/) para aprender cómo hacer que su PWA sea instalable, cómo realizar pruebas para ver que es instalable, e intentar hacerlo usted mismo.

{% endDetails %}

## Lista de verificación óptima de la Aplicación Web Progresiva {: #optimal}

Para crear una Aplicación Web Progresiva realmente buena, que parezca la mejor aplicación de su clase, se necesita algo más que la lista de verificación básica. La lista de verificación de la Aplicación Web Progresiva óptima consiste en hacer que su PWA se sienta como parte del dispositivo en el que se ejecuta, a la vez que aprovecha los aspectos relacionados con la potencia de la web.

{% Details %} {% DetailsSummary 'h3' %}

Proporciona una experiencia sin conexión a Internet

Donde la conectividad no sea estrictamente necesaria, su aplicación funciona igual sin conexión que en línea.

{% endDetailsSummary %}

Donde la conectividad no sea estrictamente necesaria, su aplicación funciona igual sin conexión que en línea.

#### Por qué

Además de ofrecer una página personalizada sin conexión, los usuarios esperan que las Aplicaciones Web Progresivas se puedan utilizar sin conexión. Por ejemplo, las aplicaciones relacionadas con los viajes y las aerolíneas deberían tener los detalles de los viajes y los pases de abordaje disponibles fácilmente cuando están desconectadas. Las aplicaciones de música, video y podcasting deben permitir la reproducción sin conexión. Las aplicaciones sociales y de noticias deberían almacenarse en el caché de los contenidos recientes para que los usuarios puedan leerlos cuando no estén conectados. Los usuarios también esperan permanecer autentificados cuando no están conectados, así que diseñe la autentificación sin conexión. Una PWA sin conexión le ofrece a los usuarios una experiencia similar a la de una aplicación.

#### Cómo

Después de determinar las características con las que sus usuarios esperan trabajar sin conexión, tendrá que hacer que su contenido esté disponible y se adapte a los contextos sin conexión. Además, puedes utilizar [IndexedDB](https://developers.google.com/web/ilt/pwa/working-with-indexeddb), un sistema de almacenamiento NoSQL dentro del navegador, para almacenar y recuperar datos, y [sincronización en segundo plano](https://developer.chrome.com/blog/background-sync/) para permitir a los usuarios realizar acciones mientras están desconectados y aplazar las comunicaciones con el servidor hasta que el usuario vuelva a tener una conexión estable. También puede utilizar service workers para almacenar otros tipos de contenido, como imágenes, archivos de video y de audio para su uso sin conexión, así como utilizarlos para implementar [sesiones seguras y de larga duración](https://developer.chrome.com/blog/2-cookie-handoff/) para mantener a los usuarios autenticados. Desde el punto de vista de la experiencia del usuario, se pueden utilizar [pantallas esqueleto](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a) que ofrezcan a los usuarios una percepción de velocidad y contenido mientras se cargan y que luego puedan recurrir al contenido almacenado en el caché o a un indicador sin conexión, cuando sea necesario.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Es totalmente accesible

Todas las interacciones con los usuarios cumplen los requisitos de accesibilidad del [WCAG 2.0](https://www.w3.org/TR/WCAG20/).

{% endDetailsSummary %}

Todas las interacciones con los usuarios cumplen los requisitos de accesibilidad del [WCAG 2.0](https://www.w3.org/TR/WCAG20/).

#### Por qué

La mayoría de las personas, en algún momento de su vida, querrán aprovechar su PWA de una forma que esté cubierta por los requisitos de accesibilidad [WCAG 2.0](https://www.w3.org/TR/WCAG20/). La capacidad de los humanos para interactuar y comprender su PWA se encuentra en un espectro y las necesidades podrían ser temporales o permanentes. Al hacer que su PWA sea accesible, se asegura de que sea utilizable para todos.

#### Cómo

El documento del W3C titulado [Introducción a la accesibilidad web](https://www.w3.org/WAI/fundamentals/accessibility-intro/) es un buen punto de partida. La mayoría de las pruebas de accesibilidad deben realizarse manualmente. Herramientas como las auditorías de [Accesibilidad](/lighthouse-accessibility/) en Lighthouse, [axe](https://github.com/dequelabs/axe-core) y las [Perspectivas de accesibilidad](https://accessibilityinsights.io/) pueden ayudarte a automatizar algunas pruebas de accesibilidad. También es importante utilizar elementos semánticamente correctos en vez de recrear esos elementos por su cuenta, por ejemplo, los elementos `a` y `button`. Esto garantiza que, cuando necesite crear una funcionalidad más avanzada, se cumplan las expectativas de accesibilidad (como, por ejemplo, cuando se deben utilizar flechas o pestañas). [A11Y Nutrition Cards](https://accessibilityinsights.io/) tiene excelentes consejos sobre esto para algunos componentes comunes.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Se puede descubrir mediante la búsqueda

Su PWA se puede [descubrir fácilmente mediante la búsqueda](/discoverable/) .

{% endDetailsSummary %}

Su PWA se puede [descubrir fácilmente mediante la búsqueda](/discoverable/) .

#### Por qué

Una de las mayores ventajas de la web es la posibilidad de encontrar sitios y aplicaciones mediante la búsqueda. De hecho, [más de la mitad](https://www.brightedge.com/resources/research-reports/channel_share) del tráfico de un sitio web procede de la búsqueda orgánica. Es fundamental asegurarse de que existen URL canónicas para el contenido y que los motores de búsqueda pueden indexar su sitio para que los usuarios puedan encontrar su PWA. Esto es especialmente cierto cuando se adopta el renderizado del lado del cliente.

#### Cómo

Comience por asegurarse de que cada URL tiene un título y una meta descripción únicos y descriptivos. A continuación, puede utilizar [Google Search Console](https://search.google.com/search-console/about) y las [auditorías de optimización de motores de búsqueda](/lighthouse-seo/) en Lighthouse para ayudarle a depurar y solucionar los problemas de visibilidad de su PWA. También puede utilizar las herramientas de los webmasters de [Bing](https://www.bing.com/toolbox/webmaster) o [Yandex](https://webmaster.yandex.com/welcome/), y considerar la inclusión de [datos estructurados](https://goo.gle/search-gallery) mediante esquemas de [Schema.org](https://schema.org/) en su PWA.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Funciona con cualquier tipo de entrada

Su PWA se puede utilizar igualmente con un mouse, un teclado, un lápiz óptico o táctil.

{% endDetailsSummary %}

Su PWA se puede utilizar tanto con un mouse como con un teclado, un lápiz óptico o de forma táctil.

#### Por qué

Los dispositivos ofrecen una gran variedad de métodos de entrada, y los usuarios deberían poder cambiar entre ellos sin problemas mientras utilizan su aplicación. También es importante que los métodos de entrada no dependan del tamaño de la pantalla, es decir, que las pantallas grandes deben ser táctiles y las pequeñas deben ser compatibles con teclados y mouse. En la medida de lo posible, asegúrese de que su aplicación y todas sus funciones admitan el uso de cualquier método de entrada que el usuario decida utilizar. Cuando sea apropiado, también deberá mejorar las experiencias para permitir controles específicos de entrada (como pull-to-refresh).

#### Cómo

La [API de eventos de punteros](https://developer.chrome.com/blog/pointer-events/) ofrece una interfaz unificada para trabajar con varias opciones de entrada, y es especialmente buena para agregar soporte para el lápiz óptico. Para soportar tanto el tacto como el teclado, asegúrese de que utiliza los elementos semánticos correctos (anclas, botones, controles para formularios, etc.) y no los reconstruye con HTML no semántico (lo que es bueno para la accesibilidad). Si incorpora interacciones que se activan al pasar el cursor, asegúrese de que también pueden activarse al hacer clic o pulsar.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Ofrece un contexto para las solicitudes de autorización

Cuando solicite permiso para utilizar API potentes, ofrezca un contexto y solicite la autorización solo cuando la API sea necesaria.

{% endDetailsSummary %}

Cuando solicite permiso para utilizar API potentes, ofrezca un contexto y solicite la autorización solo cuando la API sea necesaria.

#### Por qué

Las API que activan una solicitud de autorización, como las notificaciones, la geolocalización y las credenciales, se diseñan intencionalmente para que sean molestas para el usuario, ya que suelen estar relacionadas con una funcionalidad potente que requiere la aceptación. La activación de estos avisos sin un contexto adicional, como durante la carga de la página, hace que los usuarios sean menos propensos a aceptar esos permisos y más propensos a desconfiar de ellos en el futuro. En cambio, solo active estos avisos después de proporcionar una justificación dentro del contexto al usuario de por qué necesita esa autorización.

#### Cómo

Los artículos [Permission UX](https://developers.google.com/web/fundamentals/push-notifications/permission-ux) y [The Right Ways to Ask Users for Permissions](https://uxplanet.org/mobile-ux-design-the-right-ways-to-ask-users-for-permissions-6cdd9ab25c27) de UX Planet son buenos recursos para comprender cómo diseñar solicitudes de autorización que, aunque se centran en los dispositivos móviles, se aplican a todas las PWA.

{% endDetails %}

{% Details %} {% DetailsSummary 'h3' %}

Siga las prácticas recomendadas para obtener un código limpio

Mantener una base de código funcional facilita la obtención de los objetivos y la entrega de nuevas funciones.

{% endDetailsSummary %}

Mantener una base de código funcional facilita la obtención de los objetivos y la entrega de nuevas funciones.

#### Por qué

Hay mucho que hacer para crear una aplicación web moderna. Al mantener su aplicación actualizada y su código base funcionando bien, le resultará más fácil ofrecer nuevas funciones que cumplan los objetivos mencionados en esta lista de verificación.

#### Cómo

Hay una serie de verificaciones de alta prioridad para garantizar un código base que funcione bien: evitar el uso de bibliotecas con vulnerabilidades conocidas, asegurarse de que no se utilizan API obsoletas, eliminar los anti-patrones web de su código base (como el uso de `document.write()` o contar con asistentes de eventos de desplazamiento no pasivos), e incluso codificar de forma defensiva para garantizar que su PWA no se estropee si las bibliotecas de análisis o de otros terceros no se cargan. Considere la posibilidad de exigir un análisis de código estático, como el linting, así como pruebas automatizadas, en varios navegadores y canales de lanzamiento. Estas técnicas pueden ayudar a detectar errores antes de que se produzcan.

{% endDetails %}
