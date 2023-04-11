---
layout: post
title: Haga que su PWA se sienta más como una aplicación
subhead: Haga que su aplicación web progresiva no se sienta como un sitio web, sino como una aplicación "real"
authors:
  - thomassteiner
description: |
  Aprenda a hacer que su aplicación web progresiva se sienta como una aplicación "real" entendiendo
  cómo implementar patrones de aplicaciones específicos de la plataforma con tecnologías web.
date: 2020-06-15
updated: 2020-07-23
tags:
  - capabilities
---

Cuando juegas al bingo de aplicaciones web progresivas (PWA), es una apuesta segura establecer que "las PWA son solo sitios web". La documentación de la PWA de Microsoft está de [acuerdo](https://docs.microsoft.com/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites), lo [decimos](/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites) en este mismo sitio, e incluso los nominadores de la PWA, Frances Berriman y Alex Russell, también [lo escriben.](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites) Sí, las PWA son solo sitios web, pero también son mucho más que eso. Si se hace bien, una PWA no se sentirá como un sitio web, sino como una aplicación "real". Ahora bien, ¿qué significa sentirse como una aplicación real?

Para responder a esta pregunta, usaré la [aplicación Apple Podcasts](https://support.apple.com/HT201859) como ejemplo. Está disponible en macOS para computadoras y en iOS (y iPadOS respectivamente) para dispositivos móviles. Si bien Podcasts es una aplicación multimedia, las ideas centrales que ilustro con su ayuda, también se aplican a otras categorías de aplicaciones.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aNYiT2EkVkjNplAIKbLU.png", alt="Un iPhone y una MacBook uno al lado del otro, ambos ejecutando la aplicación Podcasts.", width ="800", height="617" %}<figcaption> Podcasts de Apple en iPhone y macOS (<a href="https://support.apple.com/HT201859">Fuente</a>).</figcaption></figure>

{% Aside 'caution' %} Cada función de la aplicación en Android,  iOS o computadora que se enumera a continuación, tiene un componente de **Cómo hacer esto en la web** que puede abrir para obtener más detalles. Tenga en cuenta que no todos los navegadores de los distintos sistemas operativos son compatibles con todas las API o funcionalidades enumeradas. Asegúrese de revisar cuidadosamente las notas de compatibilidad en los artículos vinculados. {% endAside %}

## Capaz de funcionar sin conexión

Si da un paso atrás y piensa en algunas de las aplicaciones específicas de la plataforma que puede tener en su teléfono móvil o computadora de escritorio, una cosa se destaca claramente: nunca obtiene nada. En la aplicación Podcasts, incluso si estoy desconectado, siempre hay algo. Cuando no hay conexión de red, la aplicación, naturalmente, todavía se abre. La **sección Gráficos principales** no muestra ningún contenido, sino que recurre a un mensaje de **No se puede conectar en este momento** emparejado con un botón de **Reintentar**. Puede que no sea la experiencia más acogedora, pero obtengo algo.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMbGLQkbLROxmUMdxLET.png", alt="La aplicación Podcasts muestra un mensaje de información 'No se puede conectar en este momento.' cuando no hay conexión de red disponible.", width="800", height="440" %} <figcaption>Aplicación Podcasts sin conexión a la red.</figcaption></figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} La aplicación Podcasts sigue el llamado modelo de shell de la aplicación. Todo el contenido estático que se necesita para mostrar la aplicación principal se almacena en caché localmente, incluidas imágenes decorativas como los íconos del menú de la izquierda y los íconos de la interfaz de usuario del reproductor principal. El contenido dinámico como los datos de <b>Top Charts</b> solo se carga a pedido, con contenido de respaldo almacenado en caché local disponible en caso de que falle la carga. Lea el artículo <a href="https://developers.google.com/web/fundamentals/architecture/app-shell">Modelo shell de aplicaciones</a> para aprender cómo aplicar este modelo arquitectónico a su aplicación web. {% endDetails %}

## Reproducción multimedia y contenido disponible sin conexión

Mientras estoy sin conexión, a través del panel de la izquierda, todavía puedo navegar a la sección de **Descargas** y disfrutar de los episodios de podcast descargados que están listos para reproducirse, y se muestran con todos los metadatos, como ilustraciones y descripciones.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/onUIDiaFNNHOmnwXzRh1.png", alt="Aplicación Podcasts reproduciendo un episodio descargado de un podcast.", width="800", height="440" %}
 <figcaption>Los episodios de podcasts descargados se pueden reproducir incluso sin conexión a una red.</figcaption>
</figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} El contenido multimedia descargado previamente se puede servir desde la caché, por ejemplo, utilizando la receta de <a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">Servir audio y video almacenado en caché</a> de la biblioteca de <a href="https://developer.chrome.com/docs/workbox/">Workbox</a>. Otro contenido siempre se puede almacenar en la caché o en IndexedDB. Lea el artículo <a href="/storage-for-the-web/">Almacenamiento para la web</a> para obtener todos los detalles y saber cuándo y cuál tecnología de almacenamiento usar. Si tiene datos que deben almacenarse de forma persistente sin el riesgo de que se eliminen cuando la cantidad de memoria disponible sea baja, puede utilizar la <a href="/persistent-storage/">API de almacenamiento persistente</a>. {% endDetails %}

## Descarga proactiva en segundo plano

Cuando vuelva a estar en línea, por supuesto, puedo buscar contenido con una consulta como `http 203`, y cuando decido suscribirme al resultado de la búsqueda, el [podcast HTTP 203](/podcasts/), el último episodio de la serie se descarga inmediatamente sin hacer preguntas.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WbCk4nPpBS3zwkPVRGuo.png", alt="La aplicación Podcasts descarga el último episodio de un podcast inmediatamente después de la suscripción.", width="800", height="658" %} <figcaption>Después de suscribirse a un podcast, el último episodio se descarga inmediatamente.</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  Descargar un episodio de podcast es una operación que potencialmente puede llevar más tiempo. La <a href="https://developers.google.com/web/updates/2018/12/background-fetch">API Background Fetch</a> permite delegar descargas al navegador, que se encarga de ellas en segundo plano. En Android, el navegador, a su vez, puede incluso delegar estas descargas en el sistema operativo, por lo que no es necesario que el navegador se esté ejecutando continuamente. Una vez que se ha completado la descarga, el trabajador de servicio de su aplicación se despierta y usted puede decidir qué hacer con la respuesta.
{% endDetails %}

## Compartir e interactuar con otras aplicaciones

La aplicación Podcasts se integra naturalmente con otras aplicaciones. Por ejemplo, cuando doy clic derecho en un episodio que me gusta, puedo compartirlo con otras aplicaciones de mi dispositivo, como la aplicación Mensajes. También se integra naturalmente con el portapapeles del sistema. Puedo hacer clic derecho en cualquier episodio y copiar un enlace.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gKeFGOAZ2muuYeDNFbBW.png", alt="El menú contextual de la aplicación Podcasts se invoca en un episodio de podcast con la opción seleccionada 'Compartir episodio&gt; Mensajes'.", width="800", height="392" %} <figcaption>Compartir un episodio de podcast en la aplicación Mensajes.</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  La <a href="/web-share/">API Web Share</a> y la <a href="/web-share-target/">API de destino compartido web</a> permiten que su aplicación comparta y reciba textos, archivos y enlaces hacia y desde otras aplicaciones en el dispositivo. Aunque todavía no es posible que una aplicación web agregue elementos de menú al menú contextual integrado del sistema operativo, hay muchas otras formas de vincular hacia y desde otras aplicaciones en el dispositivo. Con la <a href="/image-support-for-async-clipboard/">API de portapales asincrónico</a>  puede leer y escribir datos de texto e imágenes (imágenes PNG) en el portapapeles del sistema mediante programación. En Android, puede usar la <a href="/contact-picker/">API de selector de contactos</a> para seleccionar entradas desde el administrador de contactos del dispositivo. Si ofrece una aplicación específica de la plataforma y una PWA, puede utilizar la <a href="/get-installed-related-apps/">API de instalr aplicaciones relacionadas</a> para comprobar si la aplicación específica de la plataforma está instalada, en cuyo caso no es necesario que anime al usuario a instalar la PWA o aceptar notificaciones web emergentes.
{% endDetails %}

## Actualización de la aplicación en segundo plano

En la configuración de la aplicación Podcasts, puedo configurar la aplicación para descargar nuevos episodios automáticamente. Así, ni siquiera tengo que pensar en ello, el contenido actualizado siempre estará ahí. Magia.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iTKgVVjX0EM0RQS3ap4X.png", alt="El menú de configuración de la aplicación Podcasts en la sección 'General' donde la opción 'Actualizar podcasts' está configurada en 'Cada hora",width="800", height="465" %} <figcaption>Podcasts configurada para buscar nuevos episodios del podcast cada hora.</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  La <a href="/periodic-background-sync/">API de sincronización periódica en segundo plano</a> permite que su aplicación actualice su contenido regularmente en segundo plano, sin la necesidad de que esté ejecutándose. Esto significa que el nuevo contenido está disponible de manera proactiva, por lo que sus usuarios pueden comenzar a profundizar en él de inmediato cuando lo deseen.
{% endDetails %}

## Estado sincronizado en la nube

Al mismo tiempo, mis suscripciones se sincronizan en todos los dispositivos que poseo. En un mundo perfecto, no tengo que preocuparme por mantener sincronizadas manualmente mis suscripciones a podcasts. De la misma manera, no tengo por qué temer que la memoria de mi dispositivo móvil sea consumida por episodios que ya he escuchado en mi escritorio y viceversa. El estado de reproducción se mantiene sincronizado y los episodios escuchados se eliminan automáticamente.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uVJJ40Zxi5jx1AP1jd9U.png", alt="El menú de configuración de la aplicación Podcasts en la sección 'Avanzado' donde está activada la opción 'Sincronizar suscripciones entre dispositivos'.", width="800", height="525" %} <figcaption>El estado se sincroniza a través de la nube.</figcaption></figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  La sincronización de los datos de estado de la aplicación es una tarea que puede delegar a la <a href="https://developers.google.com/web/updates/2015/12/background-sync">API de sincronización en segundo plano</a>. La operación de sincronización en sí no tiene que ocurrir de inmediato, solo <em>eventualmente</em>, y tal vez incluso cuando el usuario ya haya cerrado la aplicación nuevamente.
{% endDetails %}

## Controles de teclas multimedia del hardware

Cuando estoy ocupado con otra aplicación, digamos, leyendo una página de noticias en el navegador Chrome, todavía puedo controlar la aplicación Podcasts con las teclas multimedia de mi computadora portátil. No es necesario cambiar a la aplicación solo para avanzar o retroceder.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TqRtzNtfhahjX93hI1P6.png", alt="Teclado mágico de Apple MacBook Pro con teclas multimedia anotadas.", width="800", height="406" %}
 <figcaption> Las teclas multimedia permiten controlar la aplicación Podcasts (<a href="https://support.apple.com/guide/macbook-pro/magic-keyboard-apdd0116a6a2/mac">Fuente</a>).</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  Las teclas multimedia son compatibles con la <a href="/media-session/">API de sesión multimedia</a>. Así, los usuarios pueden hacer uso de las teclas multimedias del hardware en sus teclados físicos, auriculares o incluso controlar la aplicación web desde las teclas multimedia de software en sus relojes inteligentes. Una idea adicional para suavizar las operaciones de búsqueda es enviar un <a href="https://developer.mozilla.org/docs/Web/API/Vibration_API">patrón de vibración</a> cuando el usuario busca una parte significativa del contenido, por ejemplo, pasando los créditos de apertura o el límite de un capítulo.
{% endDetails %}

## Acceso directo a aplicaciones y multitareas

Por supuesto, siempre puedo volver a realizar múltiples tareas a la aplicación Podcasts desde cualquier lugar. La aplicación tiene un icono claramente distinguible que también puedo colocar en mi escritorio o en la barra de aplicaciones para que los podcasts se puedan iniciar inmediatamente cuando me apetezca.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l5EzElV5BGweYXLAqF4u.png", alt="El conmutador de tareas de macOS con varios iconos de aplicaciones para elegir, uno de ellos es la aplicación Podcasts.", width="800", height="630" %} <figcaption>Volviendo a la aplicación Podcasts mientras se realizan tareas múltiples.</figcaption></figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} Las aplicaciones web progresivas tanto en computadoras como en dispositivos móviles, se pueden instalar en la pantalla de inicio, el menú de inicio o en la base de aplicaciones. La instalación puede realizarse en base a un aviso proactivo o totalmente controlada por el desarrollador de la aplicación. El artículo <a href="/install-criteria/">¿Qué se necesita para ser instalable?</a> cubre todo lo que necesita saber. Al realizar múltiples tareas, las PWA aparecen independientes del navegador. {% endDetails %}

## Acciones rápidas en el menú contextual

Las acciones de aplicaciones más comunes, **Buscar** contenido nuevo y **Buscar episodios nuevos**, están disponibles directamente desde el menú contextual de la aplicación en la barra de accesos directos. A través del menú de **Opciones**, también puedo decidir abrir la aplicación en el momento de iniciar sesión.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SnA6Thz5xaopuTWRzWgQ.png", alt="Menú contextual del icono de la aplicación Podcasts que muestra las opciones 'Buscar' y 'Buscar nuevos episodios'.", width="534", height="736" %} <figcaption>Las acciones rápidas están disponibles inmediatamente desde el icono de la aplicación.</figcaption></figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} Al especificar los <a href="/app-shortcuts/">accesos directos del ícono de la aplicación</a> en el manifiesto de la aplicación web de la PWA, puede registrar rutas rápidas a tareas comunes a las que los usuarios pueden acceder directamente desde el icono de la aplicación. En sistemas operativos como macOS, los usuarios también pueden hacer clic derecho en el icono de la aplicación y configurar la aplicación para que se inicie en el momento del inicio de sesión. Se está trabajando en una propuesta para <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/RunOnLogin/Explainer.md">ejecutar al iniciar sesión</a>. {% endDetails %}

## Actuar como aplicación predeterminada

Otras aplicaciones de iOS e incluso sitios web o correos electrónicos, pueden integrarse con la aplicación Podcasts aprovechando el esquema de URL `podcasts://` Si sigo un enlace como [`podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903`](podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903) mientras estoy en el navegador, me lleva directamente a la aplicación Podcasts y puedo decidir suscribirme o escuchar el podcast.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/x8mjOWiMO4CVigvtV8Kg.png", alt="El navegador Chrome muestra un cuadro de diálogo de confirmación que pregunta al usuario si desea abrir la aplicación Podcasts.", width="800", height="492" %} <figcaption>La aplicación Podcasts se puede abrir directamente desde el navegador.</figcaption></figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} Aún no es posible manejar esquemas de URL totalmente personalizados, pero se está trabajando en una propuesta para el <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">manejo de protocolos de URL</a> para PWA. Actualmente, <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a> con un prefijo de esquema <code>web+</code> es la mejor alternativa. {% endDetails %}

## Integración del sistema de archivos local

Es posible que no lo piense de inmediato, pero la aplicación Podcasts se integra naturalmente con el sistema de archivos local. Cuando descargo un episodio de podcast, en mi computadora portátil se almacena en `~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Library/Cache`. A diferencia de, digamos `~/Documents`, este directorio, por supuesto, no está destinado a ser accedido directamente por usuarios normales, pero está ahí. En la sección de [contenido sin conexión](#offline-content-available-and-media-playable) se hace referencia a otros mecanismos de almacenamiento distintos a los archivos.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Og60tp5kB9lVZsi3Prdt.png", alt="El Finder de macOS navegó al directorio del sistema de la aplicación Podcasts.", width="800", height="337" %} <figcaption>Los episodios de podcasts se almacenan en una carpeta especial de aplicaciones del sistema.</figcaption></figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} La <a href="/file-system-access/">API de acceso al sistema de archivos</a> permite a los desarrolladores obtener acceso al sistema de archivos local del dispositivo. Puede usarlo directamente o a través de la biblioteca de soporte <a href="https://github.com/GoogleChromeLabs/browser-fs-access">browser-fs-access</a> que proporciona de manera transparente un respaldo para los navegadores que no son compatibles con la API. Por razones de seguridad, los directorios del sistema no son accesibles desde la web. {% endDetails %}

## Aspecto y sensación de plataforma

Hay algo más sutil que es evidente por sí mismo para una aplicación de iOS como Podcasts: ninguna de las etiquetas de texto es seleccionable y todo el texto se mezcla con la fuente del sistema de la máquina. También se respeta mi elección del tema de color del sistema (modo oscuro).

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OApP9uGUje6CkS7cKcZh.png", alt="La aplicación Podcasts en modo oscuro", width="800", height="463" %} <figcaption>La aplicación Podcasts admite el modo claro y oscuro.</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cnVihfFR2anSBlIVfCSW.png", alt = "La aplicación Podcasts en modo claro", width="800", height="463" %} <figcaption>La aplicación usa la fuente predeterminada del sistema.</figcaption></figure>
</div>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} Al aprovechar la propiedad CSS <a href="https://developer.mozilla.org/docs/Web/CSS/user-select"><code>user-select</code></a> con el valor <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>none</code></a>, puede proteger los elementos de la interfaz de usuario para que no se seleccionen accidentalmente. Sin embargo, asegúrese de no abusar de esta propiedad para hacer que el <em>contenido de la aplicación</em> no se pueda seleccionar. Sólo se debe utilizar para elementos de la interfaz como texto de los botones, etc. El valor <a href="https://developer.mozilla.org/docs/Web/CSS/font-family#&lt;generic-name&gt;:~:text=system%2Dui,-Glyphs"><code>system-ui</code></a> para la propiedad CSS <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family</code></a> le permite especificar la fuente de interfaz de usuario por defecto del sistema que se utilizará para su aplicación. Finalmente, su aplicación puede obedecer la preferencia de esquema de color del usuario respetando su preferencia <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>, con una opción <a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">alternancia de modo oscuro</a> para anularlo. Otra cosa sobre la que decidir, podría ser qué debería hacer el navegador al llegar al límite de un área de desplazamiento, por ejemplo, para implementar la opción personalizada <em>desliza hacia abajo para actualizar</em>. Esto es posible con la propiedad CSS de <a href="https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"><code>overscroll-behavior</code></a> {% endDetails %}

## Barra de título personalizada

Cuando se ve la ventana de la aplicación Podcasts, se nota que no tiene una barra de título y una barra de herramientas clásicas integradas, como, por ejemplo, la ventana del navegador Safari, sino una experiencia personalizada que parece una barra lateral acoplada a la ventana principal del reproductor.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cB7G2e31JXU71EfvhG3i.png", alt="Barra de título y barra de herramientas integradas en el navegador Safari.", width="800", height="40" %} <figcaption> </figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mFvLbyQ90wsDPQ9l86s3.png", alt="Barra de título personalizada dividida de la aplicación Podcasts.", width="800", height="43" %} <figcaption>Barras de título personalizadas de Safari y Podcasts.</figcaption></figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} Si bien no es posible actualmente, se está trabajando en la <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">personalización de la barra de título</a> en este momento. Sin embargo, puede (y debe) especificar las propiedades <a href="/add-manifest/#display"><code>display</code></a> y <a href="/add-manifest/#theme-color"><code>theme-color</code></a> del manifiesto de la aplicación web para determinar la apariencia de la ventana de su aplicación y decidir qué controles de navegador predeterminados (potencialmente ninguno de ellos) deben mostrarse. {% endDetails %}

## Animaciones enérgicas

Las animaciones en la aplicación son rápidas y fluidas en los podcasts. Por ejemplo, cuando abro el panel de **Notas del episodio** a la derecha, se desliza elegantemente. Cuando elimino un episodio de mis descargas, los episodios restantes flotan y consumen el espacio de la pantalla que fue liberado por el episodio eliminado.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ucob9t4Ga3jMK20RVvSD.png", alt="La aplicación Podcasts con el panel 'Notas del episodio' ampliado.", width="800", height="463" %} <figcaption>Las animaciones en la aplicación, como cuando se abre un panel, son rápidas.</figcaption></figure>

{% Details %} {% DetailsSummary %} Cómo hacer esto en la web {% endDetailsSummary %} Las animaciones de alto rendimiento en la web son ciertamente posibles si tiene en cuenta una serie de prácticas recomendadas descritas en el artículo <a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">Animaciones y rendimiento</a>. Las animaciones de desplazamiento como se ven comúnmente en contenido paginado o carruseles multimedia, se pueden mejorar enormemente utilizando la función <a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a>. Para un control total, puede utilizar la <a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">API de animaciones web</a>. {% endDetails %}

## Contenido mostrado fuera de la aplicación

La aplicación Podcasts en iOS puede mostrar contenido en otras ubicaciones además de la aplicación real, por ejemplo, en la vista de Widgets del sistema o en forma de sugerencia de Siri. Tener llamadas a la acción proactivas y basadas en el uso, que solo requieran un toque para interactuar, puede aumentar en gran medida la tasa de reintegración de una aplicación como Podcasts.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w8zhRHcKzRfgjXZu7y4h.png", alt="Vista del widget de iOS que muestra la aplicación Podcasts sugiriendo un nuevo episodio de un podcast.", width="751", height="1511" %} <figcaption>El contenido de la aplicación aparece fuera de la aplicación principal de Podcasts.</figcaption></figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  La <a href="/content-indexing-api/">API de índice de contenido</a> permite que su aplicación le diga al navegador qué contenido de la PWA está disponible sin conexión. Esto permite que el navegador muestre dicho contenido fuera de la aplicación principal. Al marcar contenido interesante en su aplicación como adecuado para la reproducción de audio <a href="https://developers.google.com/search/docs/data-types/speakable">hablado</a> y al usar un <a href="https://developers.google.com/search/docs/guides/search-gallery">marcado estructurado</a> en general, puede ayudar a los motores de búsqueda y asistentes virtuales como el Asistente de Google a presentar sus ofertas de manera ideal.
{% endDetails %}

## Widget de control multimedia en la pantalla de bloqueo

Cuando se reproduce un episodio de podcast, la aplicación Podcasts muestra un hermoso widget de control en la pantalla de bloqueo que presenta metadatos como la ilustración del episodio, el título del episodio y el nombre del podcast.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Lr9R2zpjDEgHtyJ7hjHf.png", alt="Widget de reproducción multimedia de iOS en la pantalla de bloqueo que muestra un episodio de podcast con metadatos enriquecedores", width="751", height="1511" %}
 <figcaption>La reproducción multimedia en la aplicación se puede controlar desde la pantalla de bloqueo.</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  La <a href="/media-session/">API de sesión multimedia</a> te permite especificar metadatos como ilustraciones, títulos de pistas, etc. que luego se muestran en la pantalla de bloqueo, relojes inteligentes u otros widgets multimedia en el navegador.
{% endDetails %}

## Notificaciones emergentes

Las notificaciones emergentes se han vuelto un poco molestas en la web (aunque los [mensajes de notificación son mucho más silenciosos](https://blog.chromium.org/2020/01/introducing-quieter-permission-ui-for.html) ahora). Sin embargo, si se usan correctamente, pueden agregar mucho valor. Por ejemplo, la aplicación Podcasts para iOS puede, opcionalmente, notificarme sobre nuevos episodios de podcasts a los que estoy suscrito o recomendarme nuevos, así como alertarme sobre nuevas funciones de la aplicación.

<figure>{
  % Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IFnNRo6BnHL6BxDmiqF7.png", alt="Aplicación Podcasts para iOS en la pantalla de configuración de 'Notificaciones' que muestra la opción 'Nuevos episodios' activada.", width="751", height=1511" %}
  <figcaption>Las aplicaciones pueden enviar notificaciones emergentes para informar al usuario sobre el contenido nuevo.</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  La <a href="https://developers.google.com/web/fundamentals/push-notifications">API push</a> permite que su aplicación reciba notificaciones emergentes para que pueda notificar a sus usuarios sobre eventos importantes relacionados con su PWA. Para las notificaciones que deberían activarse en un futuro determinado y que no requieren una conexión de red, puede utilizar la <a href="/notification-triggers/">API de activadores de notificaciones</a>.
{% endDetails %}

## Insignia de icono de la aplicación

Cada vez que hay nuevos episodios disponibles para uno de los podcasts a los que estoy suscrito, aparece una insignia con el ícono de la aplicación en el ícono de la pantalla de inicio de Podcasts, lo que nuevamente me anima a volver a interactuar con la aplicación de una manera que no sea intrusiva.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3smO2sJz5oMwy4RYpQoF.png", alt="Pantalla de configuración de iOS que muestra la opción 'Insignias' activada.", width="751", height="1511" %} <figcaption>Las insignias son una forma sutil para que las aplicaciones informen a los usuarios sobre contenido nuevo.</figcaption>
 </figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la Web
  {% endDetailsSummary %}
  Puede configurar insignias de íconos de aplicaciones con la <a href="/badging-api/">API de insignias</a>. Esto es especialmente útil cuando su PWA tiene alguna noción de elementos "no leídos", o cuando necesita un medio para llamar la atención del usuario de forma discreta hacia la aplicación.
{% endDetails %}

## La reproducción multimedia tiene prioridad sobre la configuración de ahorro de energía

Cuando se reproduce un podcast, es posible que la pantalla se apague, pero el sistema no entrará en el modo de espera. Las aplicaciones también pueden mantener la pantalla activa, por ejemplo, para mostrar letras o subtítulos.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CRkipfmdkLJrND83qvQw.png", alt="Preferencias de macOS en la sección 'Ahorro de energía'.", width="800", height="573" %}
 <figcaption>Las aplicaciones pueden mantener la pantalla activa.</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  La <a href="/wakelock/">API de Screen Wake Lock</a> permite evitar que la pantalla se apague. La reproducción multimedia en la web evita automáticamente que el sistema entre en modo de espera.
{% endDetails %}

## Descubrimiento de la aplicación a través de una tienda de aplicaciones

Si bien la aplicación Podcasts es parte de la experiencia de macOS de escritorio, en iOS debe instalarse desde la App Store. Una búsqueda rápida de `podcast`, `podcasts` o `apple podcasts` muestra inmediatamente la aplicación en la App Store.

<figure>
 {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZLr5quaQWA9VJGAHNrLd.png", alt="La búsqueda de 'podcasts' en la App Store de iOS muestra la aplicación Podcasts.", width="751", height="1511" %}
 <figcaption>Los usuarios han aprendido a descubrir aplicaciones en las tiendas de aplicaciones.</figcaption>
</figure>

{% Details %}
 {% DetailsSummary %}
  Cómo hacer esto en la web
 {% endDetailsSummary %}
  Si bien Apple no permite las PWA en la App Store, en Android, puede enviar su PWA
  <a href="/using-a-pwa-in-your-android-app/">envuelta en una actividad web confiable</a>.
  El script <a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code></a> hace que esta operación sea más sencilla. Este script también impulsa internamente la función de exportación de aplicaciones de Android de <a href="https://www.pwabuilder.com/">PWABuilder</a>, que puede usar sin tocar la línea de comandos.
{% endDetails %}

## Resumen de funciones

La siguiente tabla muestra una descripción general compacta de todas las funciones, y proporciona una lista de recursos útiles para realizarlas en la web.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Característica</th>
        <th>Recursos útiles para hacer esto en la web</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#capable-of-running-offline">Capaz de funcionar sin conexión</a></td>
        <td>
          <ul>
            <li>
              <a href="https://developers.google.com/web/fundamentals/architecture/app-shell">Modelo shell de aplicaciones</a>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Reproducción multimedia y contenido disponible sin conexión</td>
        <td>
          <ul>
            <li><a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">Servir audio y video almacenado en caché</a></li>
            <li><a href="https://developer.chrome.com/docs/workbox/">Biblioteca de Workbox</a></li>
            <li><a href="/storage-for-the-web/">API de almacenamiento</a></li>
            <li><a href="/persistent-storage/">API de almacenamiento persistente</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#proactive-background-downloading">Descarga proactiva en segundo plano</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2018/12/background-fetch">API Background Fetch</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#sharing-to-and-interacting-with-other-applications">Compartir e interactuar con otras aplicaciones</a></td>
        <td>
          <ul>
            <li><a href="/web-share/">API Web Share</a></li>
            <li><a href="/web-share-target/">API de destino de recurso compartido web</a></li>
            <li><a href="/image-support-for-async-clipboard/">API de portapapeles asíncrono</a></li>
            <li><a href="/contact-picker/">API de selector de contactos</a></li>
            <li><a href="/get-installed-related-apps/">API de instalar aplicaciones relacionadas</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#background-app-refreshing">Actualización de la aplicación en segundo plano</a></td>
        <td>
          <ul>
            <li><a href="/periodic-background-sync/">API de sincronización periódica en segundo plano</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#state-synchronized-over-the-cloud">Estado sincronizado en la nube</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2015/12/background-sync">API de sincronización en segundo plano</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#hardware-media-key-controls">Controles de teclas de medios de hardware</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">API de sesión multimedia</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#multitasking-and-app-shortcut">Acceso directo a aplicaciones y multitarea</a></td>
        <td>
          <ul>
            <li><a href="/install-criteria/">Criterios de instalabilidad</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#quick-actions-in-context-menu">Acciones rápidas en el menú contextual</a></td>
        <td>
          <ul>
            <li><a href="/app-shortcuts/">Accesos directos al icono de la aplicación</a></li>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/master/RunOnLogin">Ejecutar al iniciar sesión</a> (etapa inicial)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#act-as-default-app">Actuar como aplicación predeterminada</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">Manejo del protocolo URL</a> (etapa inicial)</li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#local-file-system-integration">Integración del sistema de archivos local</a></td>
        <td>
          <ul>
            <li><a href="/file-system-access/">API de acceso al sistema de archivos</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/browser-fs-access">Biblioteca browser-fs-access</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#platform-look-and-feel">Aspecto y sensación de plataforma</a></td>
        <td>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>user-select: none</code></a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family: system-ui</code></a>
            </li>
            <li>
              <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>
            </li>
            <li><a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">Alternar modo oscuro</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#customized-title-bar">Barra de título personalizada</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">Personalización de la barra de título</a> (etapa inicial)</li>
            <li><a href="/add-manifest/#display">Modo de visualización</a></li>
            <li><a href="/add-manifest/#theme-color">Color del tema</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#snappy-animations">Animaciones enérgicas</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">Animaciones y sugerencias de rendimiento</a></li>
            <li><a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a></li>
            <li><a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">API de animaciones web</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#content-surfaced-outside-of-app">Contenido mostrado fuera de la aplicación</a></td>
        <td>
          <ul>
            <li><a href="/content-indexing-api/">API de índice de contenido</a></li>
            <li><a href="https://developers.google.com/search/docs/data-types/speakable">Contenido hablado</a></li>
            <li><a href="https://developers.google.com/search/docs/guides/search-gallery">Marcado estructurado</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#lock-screen-media-control-widget">Widget de control multimedia en la pantalla de bloqueo</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">API de sesión multimedia</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#push-notifications">Notificaciones emergentes</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/push-notifications">API push</a></li>
            <li><a href="/notification-triggers/">API de activadores de notificaciones</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-icon-badging">Insignia de icono de la aplicación</a></td>
        <td>
          <ul>
            <li><a href="/badging-api/">API de insignias</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#media-playback-takes-precedence-over-energy-saver-settings">La reproducción multimedia triunfa sobre la configuración de ahorro de energía</a></td>
        <td>
          <ul>
            <li><a href="/wakelock/">API de Screen Wake Lock</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-discovery-through-an-app-store">Descubrimiento de la aplicación a través de una tienda de aplicaciones</a></td>
        <td>
          <ul>
            <li><a href="/using-a-pwa-in-your-android-app/">Actividad web confiable</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/bubblewrap">biblioteca de <code>bubblewrap</code></a></li>
            <li><a href="https://www.pwabuilder.com/">Herramienta PWABuilder</a></li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## Conclusión

Las PWA han recorrido un largo camino desde su introducción en 2015. En el contexto del [Proyecto Fugu 🐡](https://developer.chrome.com/blog/fugu-status), el equipo de Chromium entre empresas está trabajando para cerrar las brechas restantes. Si sigue solo algunos de los consejos de este artículo, puede acercarse poco a poco a esa sensación similar a la de una aplicación y hacer que sus usuarios olviden que están tratando con "solo un sitio web", porque, sinceramente, a la mayoría de ellos no le importa cómo se construye su aplicación (y por qué debería hacerlo), siempre que se sienta como una aplicación *real*.

## Agradecimientos

Este artículo fue revisado por
[Kayce Basques](/authors/kaycebasques/),
[Joe Medley](/authors/joemedley/),
[Joshua Bell](https://github.com/inexorabletash),
[Dion Almaer](https://blog.almaer.com/),
[Ade Oshineye](https://blog.oshineye.com/),
[Pete LePage](/authors/petelepage/),
[Sam Thorogood](/authors/samthor/),
[Reilly Grant](https://github.com/reillyeon) y [Jeffrey Yasskin](https://github.com/jyasskin).
