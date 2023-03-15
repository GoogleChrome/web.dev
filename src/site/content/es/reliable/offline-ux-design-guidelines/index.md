---
layout: post
title: Pautas de diseño UX sin conexión
subhead: Una guía para diseñar experiencias web para redes lentas y sin conexión.
authors:
  - mustafakurtuldu
  - thomassteiner
date: 2016-11-10
updated: 2021-05-25
tags:
  - progressive-web-apps
  - ux
  - network
  - offline
---

Este artículo proporciona pautas de diseño sobre cómo crear una gran experiencia tanto en redes lentas y sin conexión.

La calidad de una conexión de red puede verse afectada por varios factores, como:

- Pésima cobertura de un proveedor.
- Condiciones climáticas extremas.
- Cortes de energía.
- Entrar en "zonas muertas" permanentes, como edificios con paredes que bloquean las conexiones de red.
- Entrar en "zonas muertas" temporales, como cuando viajas en un tren y se atraviesa un túnel.
- Conexiones a internet dependientes del tiempo, como las de los aeropuertos u hoteles.
- Prácticas culturales que requieren acceso limitado o nulo a internet en momentos o días específicos.

Tu objetivo es brindar una buena experiencia que reduzca el impacto de los cambios en la conectividad.

## Decide qué mostrar a tus usuarios cuando tengan una mala conexión de red

La primera pregunta que debes hacerte es: ¿cómo se ve el éxito y el fracaso de una conexión de red? Una conexión exitosa es la experiencia en línea normal de tu aplicación. Sin embargo, la falla de una conexión puede ser tanto el estado sin conexión de línea de tu aplicación como el comportamiento de la aplicación cuando hay una red con retraso (lag).

Cuando piensas en el éxito o el fracaso de una conexión de red, debes hacerte estas importantes preguntas de UX:

- ¿Cuánto tiempo esperas para determinar el éxito o el fracaso de una conexión?
- ¿Qué puedes hacer mientras se determina el éxito o el fracaso?
- ¿Qué debes hacer en caso de una falla?
- ¿Cómo le informas al usuario de lo anterior?

### Infórmale a los usuarios de su estado actual y el cambio de estado

Informa al usuario tanto de las acciones que aún puede hacer cuando tiene una falla en la red y del estado actual de la aplicación. Por ejemplo, una notificación podría decir:

> Parece que tienes una mala conexión a la red. ¡No es para preocuparse! Los mensajes se enviarán cuando la red se restaure.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/roxoXuJ9x7qUHFVWMgXZ.png", alt="La aplicación de mensajería emoji de Emojoy que informa al usuario cuando se produce un cambio de estado.", width="335", height="601" %}<figcaption> Informarle al usuario lo antes posible y de la manera más clara cuando se produzca un cambio de estado.</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GvE07BeSsnTyxnRbkZhz.png", alt="La aplicación I/O del 2016 le informa al usuario cuando se produce un cambio de estado.", width="335", height="601" %}<figcaption> La aplicación I/O de Google utilizó un "toast" de material design para que el usuario supiera cuándo estaba desconectado.</figcaption></figure>

### Infórmale a los usuarios cuando la conexión de red mejore o se restablezca

La forma en que le informas al usuario que su conexión de red ha mejorado depende de tu aplicación. Las aplicaciones como una del mercado de valores que priorizan la información actual, deben actualizarse automáticamente y notificar al usuario lo antes posible.

Se recomienda que le informes al usuario que tu aplicación web se ha actualizado "en segundo plano" mediante el uso de una señal visual como, por ejemplo, un elemento de toast de material design. Esto implica detectar tanto la presencia de un service worker como una actualización de tu contenido administrado. Puedes ver un ejemplo de código de esta <a href="https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js#L29">función en acción aquí</a>.

Un ejemplo de esto sería el [Chrome Platform Status](https://chromestatus.com), que publica una nota para el usuario cuando se actualiza la aplicación.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ikam7evJEVSicAnVxvWA.png", alt="Una aplicación meteorológica de ejemplo", width="324", height="598" %}<figcaption> Algunas aplicaciones, como la aplicación del tiempo, deben actualizarse automáticamente, ya que los datos antiguos no son útiles.</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5TtIkRCPsuxAOajX8LPF.png", alt="El Chrome Status usa un toast", width="336", height="598" %}<figcaption> Las aplicaciones como Chrome Status le permiten al usuario saber cuándo se ha actualizado el contenido a través de una notificación del tipo toast.</figcaption></figure>

También puedes mostrar, en todo momento, la última vez que se actualizó la aplicación en un espacio prominente. Por ejemplo, esto sería útil para una aplicación de conversión de moneda.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nK4V7aUvmLvaNJgF1S2I.png", alt="La aplicación Material Money está desactualizada", width="324", height="598" %}<figcaption> Tasas de caché de Material Money ...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wqaFuHzeAC2wR0D3pt7R.png", alt="Material Money se ha actualizado", width="324", height="598" %} <figcaption> …y notifica al usuario cuando la aplicación se ha actualizado.</figcaption></figure>

Las aplicaciones, como las de noticias, pueden mostrar una simple notificación de "toque aquí para actualizar" que informa al usuario sobre el nuevo contenido. La actualización automática haría que los usuarios perdieran su posición.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rRLScscdU9BE9Wt4RYAx.png", alt="Una aplicación de noticias como ejemplo, Tailpiece en su estado normal", width="360", height="665" %}}<figcaption> Tailpiece, un periódico en línea, descargará automáticamente las últimas noticias...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WNIMNF14cSF29fntl1Lc.png", alt="Ejemplo de aplicación de noticias, Tailpiece cuando esté listo para actualizarse", width="360", height="665" %} {figcaption0 …pero permite a los usuarios actualizar manualmente para que no pierdan su posición en un artículo.</figure>

### Actualizar la interfaz de usuario para reflejar el estado contextual actual

Cada bit de la interfaz de usuario puede tener su propio contexto y funcionalidad que cambiarán dependiendo de si requiere una conexión exitosa. Un ejemplo sería un sitio de comercio electrónico que se puede navegar sin conexión. El botón de comprar y el precio estarán desactivados hasta que se restablezca la conexión.

Otras formas de estados contextuales podrían incluir datos. Por ejemplo, la aplicación financiera Robinhood permite a los usuarios comprar acciones y utiliza colores y gráficos para notificar al usuario cuando el mercado está abierto. Toda la interfaz se vuelve blanca para luego volverse gris cuando el mercado cierra. Cuando el valor de las acciones aumenta o disminuye, cada widget de acciones individual se vuelve verde o rojo según su estado.

### Educa al usuario para que comprenda qué es el modelo sin conexión

Offline es un nuevo modelo mental para todos. Debes de educar a tus usuarios sobre los cambios que ocurrirán cuando no tengan una conexión. Informa a tus usuarios en dónde se guardan los datos grandes y bríndales la configuración para cambiar el comportamiento predeterminado. Asegúrate de utilizar varios componentes de diseño de la interfaz de usuario, como lenguaje informativo, iconos, notificaciones, color e imágenes para transmitir estas ideas de forma colectiva, en lugar de depender de una única opción de diseño, como un icono por sí solo para que se encargue de todo.

## Proporciona una experiencia sin conexión de forma predeterminada

Si tu aplicación no requiere de muchos datos, entonces almacena esos datos en caché de forma predeterminada. Los usuarios pueden sentirse cada vez más frustrados si solo pueden acceder a sus datos con una conexión de red. Intenta que la experiencia sea lo más estable posible. Una conexión inestable hará que tu aplicación se sienta poco confiable, mientras que una aplicación que reduce el impacto de una falla en la red se sentirá mágica para el usuario.

Los sitios de noticias podrían beneficiarse de la descarga automática y el guardado automático de las últimas noticias para que un usuario pueda leer las noticias de hoy sin una conexión, tal vez descargando el texto sin las imágenes del artículo. Además, adáptate al comportamiento del usuario. Por ejemplo, si la sección de deportes es lo que ven normalmente, conviértelo en la descarga prioritaria.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/M39yiHQYpXacVII6d7zX.png", alt="Tailpiece le informa al usuario que está desconectado mediante varios widgets de diseño", width="360", height="665" %} <figcaption> Si el dispositivo se encuentra sin conexión, Tailpiece notificará al usuario con un mensaje de estado...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KpkzjYNoCWquWKXTvM28.png", alt="Tailpiece tiene un indicador visual que muestra qué secciones están listas para ser usadas sin conexión.", width="360", height="665" %} <figcaption> …haciéndoles saber que, al menos parcialmente, todavía pueden usar la aplicación.</figcaption></figure>

{% Aside %} Cuando se trata de comunicar el estado de una aplicación, decir que "La red está inactiva" envía el mensaje de que la red de la aplicación está experimentando problemas, mientras que "Estás desconectado" le aclara al usuario que el problema se encuentra de su lado. {% endAside %}

## Infórmale al usuario cuando la aplicación esté lista para su uso sin conexión

Cuando una aplicación web se carga por primera vez, debe de indicarle al usuario si está lista para su uso sin conexión. Haz esto con un [widget que proporcione información breve](https://material.io/components/snackbars) sobre una operación a través de un mensaje en la parte inferior de la pantalla, como, por ejemplo, cuando se sincronizó una sección o se descargó un archivo de datos.

De nuevo, piensa en el lenguaje que estás utilizando para asegurarte de que sea adecuado para tu audiencia. Asegúrate de que el mensaje sea el mismo en todos los casos en los que se utilice. El término sin conexión generalmente es mal entendido por una audiencia no técnica, por lo tanto, usa un lenguaje basado en acciones con el que tu audiencia pueda relacionarse.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fNOute6xBzFcDUNMeXDe.png", alt="Aplicación I/O sin conexión", width="360", height="664" %}<figcaption> La aplicación  I/O 2016 de Google notifica al usuario cuando la aplicación está lista para su uso sin conexión...</figcaption></figure>

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Od6jUnazP8n7CMe18G2C.png", alt="El sitio de Chrome Status está sin conexión", width="360", height="664" %} …y también lo hace el sitio de Chrome Platform Status, que incluye información sobre el almacenamiento ocupado.</figure>

### Haz que 'guardar para usar sin conexión' una parte obvia de la interfaz para aplicaciones con gran cantidad de datos

Si una aplicación usa grandes cantidades de datos, asegúrate de que haya un interruptor o pin para agregar un elemento para uso sin conexión en lugar de descargarlo automáticamente, a menos que un usuario haya solicitado específicamente este comportamiento a través de un menú de configuración. Asegúrate de que el pin o la interfaz de usuario de descarga no esté oculta por otros elementos de la interfaz de usuario y que la función sea obvia para el usuario.

Un ejemplo sería un reproductor de música que requiere grandes archivos de datos. El usuario conoce el costo de los datos asociados, pero también puede querer usar el reproductor sin conexión. La descarga de música para su uso posterior requiere que el usuario planifique con anticipación, por lo que es posible que se requiera educación al respecto durante la incorporación.

### Se claro con lo que está disponible sin conexión

Debes de ser claro en cuanto a la opción que ofreces. Es posible que debas de mostrar una pestaña o configuración que muestre una "biblioteca sin conexión" o un [índice de contenido](/content-indexing-api/), para que el usuario pueda ver fácilmente lo que ha almacenado en su teléfono y lo que debe guardarse. Asegúrate de que la configuración sea concisa y ten claro dónde se almacenarán los datos y quién tiene acceso a ellos.

### Muestra el costo real de una acción

Muchos usuarios hacen una equivalencia de la capacidad sin conexión con la "descarga". Los usuarios de países donde las conexiones de red fallan o no están disponibles a menudo comparten contenido con otros usuarios o guardan contenido para usarlo sin conexión cuando tienen conectividad.

Los usuarios de planes de datos pueden evitar descargar archivos grandes por temor al costo, por lo que es posible que también desees mostrar un costo asociado para que los usuarios puedan realizar una comparación activa para un archivo o tarea específica. Por ejemplo, si la aplicación de música anterior pudiera detectar si el usuario está en un plan de datos y mostrar el tamaño del archivo para que los usuarios puedan ver el costo de un archivo.

### Ayuda a prevenir experiencias hackeadas

A menudo, los usuarios hackean una experiencia sin darse cuenta de que lo están haciendo. Por ejemplo, antes de las aplicaciones web que compartían archivos basados en la nube, era común que los usuarios guardaran archivos grandes y los adjuntaran a los correos electrónicos para poder continuar con la edición desde un dispositivo diferente. Es importante no dejarse llevar por su experiencia hackeada, sino más bien mirar lo que están tratando de lograr. En otras palabras, en lugar de pensar en cómo hacer que sea más fácil adjuntar un archivo grande, resuelve el problema de compartir grandes archivos entre diferentes dispositivos.

## Haz que las experiencias sean transferibles de un dispositivo a otro

Cuando creas para redes inestables, intenta sincronizar tan pronto como mejore la conexión para que la experiencia sea transferible. Por ejemplo, imagina que una aplicación de viajes que pierde una conexión de red a mitad de una reserva. Cuando se restablece la conexión, la aplicación se sincroniza con la cuenta del usuario, lo que le permite continuar con la reserva en su dispositivo de escritorio. No poder transferir experiencias puede resultar increíblemente irritante para los usuarios.

Infórmale al usuario del estado actual de sus datos. Por ejemplo, puedes mostrar si la aplicación se ha sincronizado. Edúcalos siempre que sea posible, pero trata de no sobrecargarlos con mensajes.

## Crea experiencias de diseño inclusivas

Al diseñar, busca ser inclusivo al proporcionar dispositivos de diseño significativos, lenguaje simple, iconografía estándar e imágenes significativas que guiarán al usuario para completar la acción o tarea en lugar de obstaculizar su progreso.

### Utiliza un lenguaje simple y conciso

Una buena experiencia de usuario no se trata solo de una interfaz bien diseñada. Incluye la ruta que toma un usuario, así como las palabras utilizadas en la aplicación. Evita la jerga tecnológica al explicar el estado de la aplicación o los componentes individuales de la interfaz de usuario. Ten en cuenta que es posible que la frase "aplicación sin conexión" no transmita al usuario el estado actual de la aplicación.

<div class="switcher">{% Compare 'worse' %}<figure style="display: inline-block; max-width: 45%;"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MaYiuInHsZ2mbPQcbD4l.png", alt="Un icono de service worker es un mal ejemplo", width="350", height="149" %}<figcaption> Evita usar términos que no sean entendibles para usuarios no técnicos.</figcaption></figure> {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<div data-md-type="block_html">
<figure style="display: inline-block; max-width: 45%;"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZIjYKLFK5DbrDJDJeDqu.png", alt="Un icono de descarga es un buen ejemplo", width="350", height="149" %} <figcaption> Utiliza lenguaje e imágenes que describan la acción.</figcaption></figure> {% endCompare %}</div>

### Utiliza varios dispositivos de diseño para crear experiencias de usuario accesibles

Utiliza lenguaje, color y componentes visuales para demostrar un cambio de estado o estado actual. El uso exclusivo del color para demostrar el estado puede no ser notado por el usuario y puede ser inaccesible para los usuarios que padecen discapacidades visuales. Además, el instinto de los diseñadores es usar la interfaz de usuario en gris para representar el estado sin conexión, pero esto puede tener distintos significados en la web. La interfaz de usuario en gris, como los elementos de entrada en un formulario, también significa que un elemento está deshabilitado. Esto puede causar confusión si *solo* usa color para representar el estado.

Para evitar malentendidos, expresa diferentes estados al usuario de varias formas, por ejemplo, con colores, etiquetas y componentes de la interfaz de usuario.

<div class="switcher">{% Compare 'worse' %}<figure style="display: inline-block; max-width: 45%;">  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uj28SN1ZepiIvya4YTe1.png", alt="Un mal ejemplo usando color.", width="720", height="368" %} <figcaption> Utiliza el color como único medio para describir lo que está sucediendo.</figcaption></figure> {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<div data-md-type="block_html">
<figure style="display: inline-block; max-width: 45%;"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/s78eC2GBEkDQouqhBYMO.png", alt="Un buen ejemplo que usa color y texto para mostrar un error.", width="720", height="368" %} <figcaption> Utiliza una combinación de elementos de diseño para transmitir tu significado.</figcaption></figure> {% endCompare %}</div>

### Usa íconos que transmitan significado

Asegúrate de que la información se transmita correctamente con etiquetas de texto significativas y con iconos. Los iconos por sí solos pueden ser problemáticos dado que el concepto de sin conexión en la web es relativamente nuevo. Los usuarios pueden malinterpretar los iconos utilizados si solo están ellos. Por ejemplo, usar un disquete para guardar tiene sentido para una generación mayor, pero los usuarios jóvenes que nunca han visto un disquete pueden confundirse con la metáfora. Del mismo modo, se sabe que el icono del menú "hamburguesa" confunde a los usuarios cuando se presenta sin una etiqueta.

Al introducir un icono sin conexión, intenta mantener la coherencia con los elementos visuales estándar de la industria (cuando estos existan), además de proporcionar una etiqueta de texto y una descripción. Por ejemplo, guardar sin conexión puede ser un ícono de descarga típico o tal vez, si la acción implica sincronizar, podría ser un ícono de sincronización. Algunas acciones pueden interpretarse como guardar sin conexión en lugar de demostrar el estado de una red. Piensa en la acción que está tratando de transmitir en lugar de presentar al usuario un concepto abstracto. Por ejemplo, guardar o descargar datos se basaría en acciones.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/h2FFD3nLIOdSzWg5H5kO.png", alt="Varios ejemplos de íconos que transmiten el significado de sin conexión", width="700", height="299" %}

Sin conexión puede significar varias cosas según el contexto, como descargar, exportar, anclar, etc. Para más inspiración, consulta el [conjunto de iconos de Material Design](https://material.io/resources/icons/).

### Utiliza diseños de esqueleto con otros mecanismos de retroalimentación

Un diseño de esqueleto (skeleton layout) es esencialmente una versión de un wireframe de tu aplicación que se muestra mientras se carga el contenido. Esto ayuda a demostrarle al usuario que el contenido está a punto de cargarse. Considera también usar una interfaz de usuario de preloader, con una etiqueta de texto que informe al usuario que la aplicación se está cargando. Un ejemplo sería pulsar el contenido del wireframe, dando a la aplicación la sensación de que está viva y cargándose. Esto le asegura al usuario que algo está sucediendo y ayuda a prevenir reenvíos o actualizaciones de tu aplicación.

<figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUIrcbblhHe5YPSrrwRy.png", alt="Un ejemplo de diseño de esqueleto", width="360", height="665" %} <figcaption> El diseño del marcador de posición de esqueleto se muestra durante la descarga del artículo...</figcaption></figure><figure style="display: inline-block; max-width: 45%;">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rRLScscdU9BE9Wt4RYAx.png", alt="Un ejemplo de artículo cargado", width="360", height="665" %} <figcaption> …que se reemplaza con el contenido real una vez que finaliza la descarga.</figcaption></figure>

### No bloquees el contenido

En algunas aplicaciones, un usuario puede desencadenar una acción como la creación de un nuevo documento. Algunas aplicaciones intentarán conectarse a un servidor para sincronizar el nuevo documento y, para demostrarlo, mostrarán un diálogo modal de carga intrusivo que cubre toda la pantalla. Esto puede funcionar bien si el usuario tiene una conexión de red estable, pero si la red es inestable, no podrá escapar de esta acción y la interfaz de usuario le impide hacer cualquier otra cosa. Deben evitarse las solicitudes de red que bloqueen el contenido. Permite que el usuario continúe navegando por tu aplicación y coloca en cola las tareas que se realizarán y sincronizarán una vez que la conexión haya mejorado.

Demuestra el estado de una acción proporcionando comentarios a tus usuarios. Por ejemplo, si un usuario está editando un documento, considera cambiar el diseño de comentarios para que sea visiblemente diferente de cuando esté en línea, pero aún muestra que su archivo fue "guardado" y se sincronizará cuando tenga una conexión de red. Esto educará al usuario sobre los diferentes estados disponibles y le asegurará que su tarea o acción ha sido almacenada. Esto tiene el beneficio adicional de que el usuario se vuelve más seguro al usar su aplicación.

## Diseño para los próximos mil millones

En muchas regiones, los dispositivos de gama baja son comunes, la conectividad no es confiable y, para muchos usuarios, los datos son muy costosos. Deberás ganarte la confianza de los usuarios siendo transparente y honesto con los datos. Piensa en formas de ayudar a los usuarios con pésimas conexiones y simplifica la interfaz para ayudar a acelerar las tareas. Intenta siempre preguntar a los usuarios antes de descargar contenido grande que consuma muchos datos.

Ofrece opciones de bajo ancho de banda para usuarios con conexiones con retraso. Entonces, si la conexión de red es lenta, proporciona pequeños assets. Ofrece una opción para elegir assets de alta o baja calidad.

## Conclusión

La educación es clave para la UX sin conexión ya que los usuarios no están familiarizados con estos conceptos. Intenta crear asociaciones con cosas que te sean familiares, por ejemplo, descargar para un uso posterior es lo mismo que desconectar datos.

Al diseñar para conexiones de redes inestables, recuerda estas directrices:

- Piensa en cómo diseñas para el éxito, el fracaso y la inestabilidad de una conexión de red.
- Los datos pueden ser costosos, así que debes de ser considerado con el usuario.
- Para la mayoría de los usuarios de todo el mundo, el entorno tecnológico es casi exclusivamente móvil.
- Los dispositivos de gama baja son comunes, con almacenamiento, memoria y potencia de procesamiento limitados, pantallas pequeñas y una calidad de pantalla táctil inferior. Asegúrate de que el rendimiento sea parte de tu proceso de diseño.
- Permite que los usuarios naveguen por tu aplicación cuando estén desconectados.
- Informar a los usuarios de su estado actual y de los cambios de estado.
- Intenta proporcionar sin conexión de forma predeterminada si tu aplicación no requiere de muchos datos.
- Si la aplicación tiene muchos datos, instruye a los usuarios sobre cómo pueden descargarla para usarla sin conexión.
- Haz que las experiencias sean transferibles entre dispositivos.
- Utiliza el lenguaje, los iconos, las imágenes, la tipografía y el color para expresarle ideas al usuario de forma colectiva.
- Brinda tranquilidad y retroalimentación para ayudar al usuario.
