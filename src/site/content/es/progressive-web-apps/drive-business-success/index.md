---
layout: post
title: Cómo las aplicaciones web progresivas pueden impulsar el éxito empresarial
authors:
  - sfourault
date: 2020-05-20
updated: 2020-05-20
description: Crea un caso de negocio sólido para tu PWA. Aprende cuándo debes de invertir y cómo puedes medir tu éxito.
tags:
  - progressive-web-apps
---

Las aplicaciones web progresivas se encuentran en los planes de muchas empresas para modernizar su sitio web y adaptarse a las nuevas expectativas de los usuarios. Como todos los nuevos conceptos y capacidades técnicas, estos se plantean las siguientes preguntas: ¿es lo que quieren mis clientes? ¿cuánto crecerá mi negocio? ¿qué es lo técnicamente factible?

{% Img src="image/admin/o70RxMcAQVPrjxH34a8r.jpg", alt="Identifica a tus stakeholders", width="800", height="254" %}

Para dar forma a tu estrategia digital, a menudo se involucran varias partes interesadas: el gerente de producto y el CMO son los co-propietarios del impacto comercial de cada característica, el CTO evalúa la viabilidad y confiabilidad de una tecnología, los investigadores de UX validan que una característica responde a un problema real del cliente.

Este artículo tiene como objetivo ayudarte a responder las tres preguntas anteriores y dar forma a tu proyecto de PWA. Comenzarás con las necesidades de tus clientes, traducirás esto en características de la PWA y te concentrarás en medir el impacto comercial que cada característica trae a la mesa.

## Los PWA resuelven las necesidades de los clientes {: #solve-customer-needs }

Una regla que nos encanta seguir en Google al crear productos es "[centrarse en el usuario y todo lo demás seguirá](https://www.google.com/about/philosophy.html)". Piensa *primero en el usuario*: ¿Cuáles son las necesidades de mis clientes y cómo las soluciona una PWA?

{% Img src="image/admin/TcmXmWb5mSUqal98NIAH.jpg", alt="Identificar las necesidades del cliente", width="800", height="262" %}

Al hacer una investigación de usuarios, encontramos algunos patrones interesantes:

- Los usuarios odian los retrasos y la falta de fiabilidad en los dispositivos móviles: el nivel de estrés causado por los retrasos móviles es [comparable al de ver una película de terror](https://blog.hubspot.com/marketing/mobile-website-load-faster).
- El cincuenta por ciento de los usuarios de teléfonos inteligentes tienen más probabilidades de utilizar el sitio móvil de una empresa cuando navegan o compran porque [no quieren descargar una aplicación](https://www.thinkwithgoogle.com/data/smartphone-user-mobile-shopping-preferences/).
- Una de las principales razones para desinstalar una aplicación es el [almacenamiento limitado](https://www.thinkwithgoogle.com/data/why-users-uninstall-travel-apps/) (mientras que una PWA instalada suele ocupar menos de 1 MB).
- Es más probable que los usuarios de teléfonos inteligentes compren en sitios móviles que [ofrecen recomendaciones relevantes](https://www.thinkwithgoogle.com/data/smartphone-mobile-app-and-site-purchase-data/) sobre productos y el 85% de los usuarios de teléfonos inteligentes dice que [las notificaciones móviles son útiles](https://www.thinkwithgoogle.com/data/smartphone-user-notification-preferences/).

De acuerdo con esas observaciones, ¡descubrimos que los clientes prefieren experiencias que sean rápidas, instalables, confiables y atractivas (FIRE)!

## Las PWA aprovechan las capacidades web modernas {: #modern-capacity }

Las PWA brindan un conjunto de mejores prácticas y API web modernas que tienen como objetivo satisfacer las necesidades de sus clientes al hacer que tu sitio sea rápido, instalable, confiable y atractivo.

Por ejemplo, usar un service worker para [almacenar en caché tus recursos](/service-workers-cache-storage/) y realizar una [búsqueda previa predictiva](/precache-with-workbox/) hace que tu sitio sea más rápido y más confiable. Hacer que tu sitio sea instalable proporciona una manera fácil para que tus clientes accedan a él directamente desde su pantalla de inicio o desde el lanzador de aplicaciones. Y las nuevas API, como lo es [Web Push Notifications](https://developer.mozilla.org/docs/Web/API/Push_API/Best_Practices), facilitan la participación de los usuarios con contenido personalizado para generar lealtad.

{% Img src="image/admin/rP0eNCflNYOhzjPi1Lq5.jpg", alt="Mejorando la experiencia del usuario con nuevas capacidades", width="800", height="393" %}

## Comprende el impacto empresarial {: #business-impact }

La definición de éxito empresarial pueden ser muchas cosas dependiendo de tu actividad:

- Los usuarios pasan más tiempo en tu servicio
- Tasas de rebote reducidas para tus clientes potenciales
- Tasas de conversión mejoradas
- Más visitantes que regresan

La mayoría de los proyectos de PWA dan como resultado una tasa de conversión móvil más alta y puedes obtener más información de los numerosos [estudios de casos de PWA](https://www.pwastats.com/). Dependiendo de tus objetivos, es posible que desees priorizar algunos aspectos de PWA que tengan más sentido para tu negocio y esto está completamente bien. Las funciones de PWA se pueden seleccionar y lanzar por separado.

Midamos el impacto empresarial de cada una de estas fantásticas funciones de FIRE.

### El impacto empresarial de un sitio web rápido {: #impact-fast }

Un reciente [estudio de Deloitte Digital](https://www2.deloitte.com/ie/en/pages/consulting/articles/milliseconds-make-millions.html) muestra que la velocidad de la página tiene un impacto significativo en las métricas comerciales.

Hay muchas cosas que puedes hacer para optimizar la velocidad de tu sitio a fin de optimizar los recorridos críticos del usuario para todos tus usuarios. Si no sabes por dónde empezar, da un vistazo a nuestra sección de [Fast](/fast/) y usa [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) para priorizar las cosas más importantes a solucionar.

Cuando trabajes en las optimizaciones de velocidad, comienza a medir la velocidad de tu sitio con frecuencia con las herramientas y métricas adecuadas para monitorear tu progreso. Por ejemplo, mide tus métricas con [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/), fija objetivos claros como tener [puntuaciones "Buenas" en Core Web Vitals](/vitals/#core-web-vitals) e incorpora un [presupuesto de rendimiento en tu proceso de creación](/incorporate-performance-budgets-into-your-build-tools/). Gracias a las mediciones diarias y [la metodología del "valor de la velocidad"](/value-of-speed/), puedes aislar el impacto de tus cambios de velocidad incrementales y calcular cuántos ingresos adicionales que ha generado tu trabajo.

{% Img src="image/admin/yyRfQaDL3NcGhB0f79RN.jpg", alt="Mide el valor de la velocidad y haz una correlación con las conversiones", width="800", height="306" %}

Ebay convirtió la [velocidad en un objetivo de la empresa](/shopping-for-speed-on-ebay/) en el 2019. Utilizaron técnicas como el presupuesto de rendimiento, la optimización de la ruta crítica y la captación previa predictiva. Llegaron a la conclusión de que por cada 100 milisegundos de mejora en el tiempo de carga de la página de búsqueda, el recuento de adiciones al carrito aumentaba en un 0,5%.

{% Img src="image/admin/Qq3wo5UOqzC1ugnTzdqT.jpg", alt="Una mejora de 100 ms en el tiempo de carga resultó en un aumento del 0.5% en el uso de la función de agregar al carrito para eBay", width="800", height="184" %}

### El impacto comercial de un sitio web instalable {: #impact-installable }

¿Por qué querrías que un usuario instale tu PWA? Para que sea más fácil volver a tu sitio. Cuando la instalación de una aplicación de Android agregaría al menos tres pasos (redirección a Play Store, descarga, reinicio de la aplicación de Android), la instalación de tu PWA se realiza sin problemas con un solo clic y no aleja al usuario del tramo de conversión actual.

{% Img src="image/admin/u1jcKrBBOHEzSz3SqhEB.jpg", alt="La experiencia de instalación debe ser perfecta", width="800", height="239" %}

Una vez instalado, los usuarios pueden iniciarlo con un clic desde el ícono en su pantalla de inicio, verlo en su bandeja de aplicaciones cuando están cambiando entre aplicaciones o encontrarlo a través de un resultado de búsqueda de aplicaciones. Nosotros le llamamos a esta aplicación dinámica "Discover-Launch-Switch" y hacer que tu PWA sea instalable es la clave para desbloquear el acceso.

Además de ser accesible desde superficies conocidas de descubrimiento y lanzamiento en tu dispositivo, una PWA se inicia exactamente como una aplicación específica de la plataforma: en una experiencia independiente, separada del navegador. Además, se beneficia de los servicios de dispositivos a nivel del sistema operativo, como el conmutador de aplicaciones y la configuración.

Los usuarios que instalen tu PWA son probablemente tus usuarios más comprometidos, con mejores métricas de participación que los visitantes ocasionales, incluidas más visitas repetidas, más tiempo en el sitio y tasas de conversión más altas, a menudo a la par con los usuarios de aplicaciones específicas de la plataforma en dispositivos móviles.

Para que tu PWA sea instalable, debes de cumplir con los [criterios básicos](/install-criteria/). Una vez que cumplas con esos criterios, puedes [promover la instalación](/promote-install/) dentro de tu experiencia de usuario en computadoras de escritorio y dispositivos móviles, incluido iOS.

{% Img src="image/admin/5sH5YX7kFrwv4f6duqVf.jpg", alt="Las PWA se pueden instalar en todas partes", width="800", height="227" %}

Una vez que hayas comenzado a promover la instalación de tu PWA, debes de medir cuántos usuarios están instalando tu PWA y cómo usan tu PWA.

Para maximizar la cantidad de usuarios que instalan tu sitio, es posible que desees [probar diferentes](https://pwa-book.awwwards.com/chapter-4) mensajes de promoción (por ejemplo: "instalación en un segundo" o "agregar nuestro acceso directo para seguir su pedido"), diferentes ubicaciones (banner de encabezado, en el feed) e intentar proponerlo en diferentes pasos de la visita (en la segunda página visitada o después de una reserva).

Para comprender dónde se van los usuarios y cómo mejorar la retención, el proceso de instalación se puede [medir](https://pwa-book.awwwards.com/chapter-8) de cuatro maneras:

- Número de usuarios aptos para instalar
- Número de usuarios que hicieron clic en el mensaje de instalación de la interfaz de usuario
- Número de usuarios que aceptaron y rechazaron la instalación
- Número de usuarios que se han instalado de manera correcta

Puedes comenzar a promocionar tu instalación de PWA a todos tus usuarios o utilizar un enfoque más cauteloso experimentando solo con un pequeño grupo de usuarios.

Después de unos días o semanas, ya deberías de tener algunos datos para medir el impacto en tu negocio. ¿Cuál es el comportamiento de las personas que vienen del acceso directo instalado? ¿Se involucran más?  ¿Se convierten más?

Para segmentar a los usuarios que instalaron tu PWA, rastrea al evento de [`appinstalled`](/customize-install/#detect-install) y usa JavaScript para [verificar si los usuarios están en modo independiente](/customize-install/#detect-launch-type) (lo que indica el uso de la PWA instalada). Luego, utilízalos como variables o dimensiones para tu seguimiento analítico.

{% Img src="image/admin/H2U4jKTmATNzVJQ3WNCO.jpg", alt="Medir el valor de la instalación", width="800", height="253" %}

El [caso de estudio de Weekendesk](https://www.thinkwithgoogle.com/_qs/documents/8971/Weekendesk_PWA_-_EXTERNAL_CASE_STUDY.pdf) es interesante: propusieron que la instalación esté en la segunda página visitada para maximizar la tasa de instalación y observaron que los clientes que regresaban a través del ícono en la pantalla de inicio tenían más del doble de probabilidades de reservar una estadía con ellos.

{% Img src="image/admin/eR23C2o1adHq5tATNw34.jpg", alt="Los usuarios instalados tuvieron una tasa de conversión 2.5 veces mayor", width="800", height="201" %}

La instalación es una excelente manera de hacer que las personas regresen a tu sitio y para mejorar la lealtad de tus clientes. También puedes pensar en personalizar la experiencia para esos usuarios premium.

Incluso si ya tienes una aplicación específica de la plataforma, puedes probar para proponer tu aplicación primero y luego enviar la PWA más tarde para aquellos que rechazaron o no interactuaron con el banner de instalación de la aplicación. Es posible que algunos de tus usuarios que estén "semi-comprometidos" no alcancen el umbral para una instalación basada en la tienda de aplicaciones. Esta cohorte se puede abordar con la instalabilidad del PWA, que a menudo se percibe como más liviana y con menos fricción.

{% Img src="image/admin/iNQalNPhjdBueuqPHiad.jpg", alt="Las PWA pueden llegar a usuarios semi-comprometidos", width="800", height="229" %}

### El impacto comercial de un sitio web confiable {: #impact-confiable }

El juego Chrome Dino, que se ofrece cuando un usuario está desconectado, se juega más de [270 millones de veces](https://www.blog.google/products/chrome/chrome-dino/) al mes. Este impresionante número muestra que la confiabilidad de la red es una oportunidad considerable, especialmente en mercados con datos móviles caros o poco confiables como India, Brasil, México o Indonesia.

Cuando se inicia una aplicación instalada desde una tienda de aplicaciones, los usuarios esperan que se abra, independientemente de si están conectados a internet o no. Las aplicaciones web progresivas no deberían ser diferentes.

Como mínimo, se debe proporcionar una página sin conexión simple que le indique al usuario que la aplicación no está disponible sin una conexión de red. Luego, considera llevar la experiencia un paso más allá al proporcionar algunas [funciones que tengan sentido sin conexión](https://pwa-book.awwwards.com/chapter-6). Por ejemplo, puedes proporcionar acceso a boletos o pases de abordaje, listas de deseos fuera de línea, información de contacto del centro de llamadas, artículos o recetas que el usuario haya visto recientemente, etc.

{% Img src="image/admin/ubglZLCoddAfB5cl8JSz.jpg", alt="Debe de ser útil, incluso sin conexión", width="800", height="243" %}

Una vez que hayas implementado una [experiencia de usuario confiable](https://pwa-book.awwwards.com/chapter-6), es posible que desees medirla; ¿cuántos usuarios se desconectan? ¿en qué zona geográfica? y ¿permanecen en el sitio web cuando la red está de vuelta?

El uso sin conexión se puede medir registrando pings analíticos cuando el usuario se [desconecta o se conecta](https://pwa-book.awwwards.com/chapter-8). Te indica cuántos usuarios continúan navegando en tu sitio web después de que la red haya regresado.

{% Img src="image/admin/UfjYsWQWJjVIk2sp5bnE.jpg", alt="Trivago vio que un 67% de los usuarios que volvieron a conectarse continuaron navegando", width="800", height="272" %}

El [estudio de caso de Trivago](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/case-studies/trivago-embrace-progressive-web-apps-as-the-future-of-mobile/) ilustra cómo esto puede afectar tus objetivos comerciales: para los usuarios cuyas sesiones fueron interrumpidas por un período fuera de línea (alrededor del tres por ciento de los usuarios), el 67% de los que vuelven a conectarse continuaron navegando por el sitio.

### El impacto comercial de un sitio web atractivo {: #impact-engaging }

Las notificaciones de web push permiten a los usuarios optar por recibir actualizaciones oportunas de los sitios que aman y les permiten volver a involucrarlos de manera efectiva con contenido personalizado y relevante.

Pero ten cuidado. Pedirle a los usuarios que se registren para recibir notificaciones web cuando llegan por primera vez y sin exponer los beneficios puede percibirse como spam y afectar negativamente su experiencia. Asegúrate de seguir las [mejores prácticas](https://developers.google.com/web/fundamentals/push-notifications/permission-ux) cuando envíes notificaciones e inspira la aceptación a través de utilidades e información relevante como puede ser retrasos en los trenes, seguimiento de precios, productos agotados, etc.

Técnicamente, [las notificaciones push](https://developers.google.com/web/fundamentals/push-notifications/) en la web se ejecutan en segundo plano gracias a un service worker y, a menudo, las envía un sistema creado para administrar campañas (por ejemplo, Firebase). Esta función brinda un gran valor comercial para los usuarios de dispositivos móviles (Android) y computadoras de escritorio: aumenta las visitas repetidas y, en consecuencia, las ventas y las conversiones.

Para medir la efectividad de tus campañas push, necesitas medir todo el proceso:

- Número de usuarios elegibles para notificaciones push
- Número de usuarios que hacen clic en un mensaje de la IU de notificación personalizada
- Número de usuarios que otorgan permiso de notificación push
- Número de usuarios que reciben notificaciones push
- Número de usuarios que interactúan con las notificaciones
- Conversión e interacción de los usuarios a partir de una notificación.

{% Img src="image/admin/UpzfxBDi3e66cZ9gzkkS.jpg", alt="Medir el valor de las notificaciones de web push", width="800", height="255" %}

Hay muchos estudios de casos excelentes sobre notificaciones de web push, como [Carrefour, que multiplicó su tasa de conversión por 4.5](https://useinsider.com/case-studies/carrefour/) volviendo a involucrar a los usuarios con carritos abandonados.

## La P en PWA: un lanzamiento progresivo, función por función {: #feature-by-feature }

Las PWA son sitios web modernos que se benefician del alcance masivo de la web, combinados con todas las funciones fáciles de usar que los usuarios adoran en las aplicaciones de Android, iOS y de escritorio. Aprovechan un conjunto de las mejores prácticas y de API web modernas, las cuales se pueden implementar de forma independiente según las especificaciones y prioridades de tu negocio.

{% Img src="image/admin/7g1j2z7h5m9QSHQhHceM.jpg", alt="Lanzamiento progresivo de tu PWA", width="800", height="253" %}

Para acelerar la modernización de tu sitio web y convertirlo en una PWA real, te recomendamos que sea ágil: lanzar función por función. Primero, investiga con tus usuarios qué características les aportarían el mayor valor, luego envía los resultados a tus diseñadores y desarrolladores y, finalmente, no olvides medir con precisión cuánto dinero extra generó tu PWA.
