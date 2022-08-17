---
layout: post
title: Aplicaciones web progresivas en sitios multiorigen
subhead: Desafíos y soluciones para la creación de aplicaciones web progresivas en sitios multiorigen.
authors:
  - demianrenzulli
date: 2019-08-19
hero: image/admin/4bvbhJ3F0uGKvw5DLTMy.jpg
alt: Múltiples marchas de cambio.
description: Las arquitecturas multiorigen presentan muchos desafíos al crear PWA. Explore lo bueno y lo malo del uso de múltiples orígenes y algunas soluciones para crear PWA en sitios de multiorigen.
tags:
  - blog
  - progressive-web-apps
  - service-worker
---

## Antecedentes

En el pasado, el uso de arquitecturas de origen múltiple presentaba algunas ventajas, pero para las aplicaciones web progresivas, ese enfoque presenta muchos desafíos. En particular, la [política del mismo origen](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) (same-origin) impone restricciones para compartir cosas como service workers y cachés, permisos y para obtener una experiencia independiente en múltiples orígenes. Este artículo describirá buenos y malos usos de múltiples orígenes y explicará los desafíos y soluciones para crear aplicaciones web progresivas en sitios multiorigen.

## Usos buenos y malos de múltiples orígenes

Hay algunas razones legítimas para que los sitios empleen una arquitectura de origen múltiple, principalmente relacionadas con el suministro de un conjunto independiente de aplicaciones web o con la creación de experiencias completamente aisladas entre sí. También hay usos que deben evitarse.

### Lo bueno

Veamos primero las razones útiles:

- **Localización/Idioma:** usar un [dominio de nivel superior con código de país](https://developer.mozilla.org/docs/Glossary/TLD) para separar los sitios que se servirán en diferentes países (por ejemplo, `https://www.google.com.ar`), o usar subdominios para dividir los sitios orientados a diferentes ubicaciones (por ejemplo: `https://newyork.craigslist.org`) o para ofrecer contenido para un idioma específico (por ejemplo, `https://en.wikipedia.org`).

- **Webapps independientes:** Uso de diferentes subdominios para brindar experiencias cuyo propósito difiere considerablemente del sitio en el origen principal. Por ejemplo, en un sitio de noticias, la aplicación web de crucigramas podría servirse intencionalmente desde `https://crosswords.example.com`, e instalarse y usarse como una PWA independiente, sin tener que compartir ningún recurso o funcionalidad con el sitio web principal.

### El malo

Si no está haciendo ninguna de estas cosas, es probable que el uso de una arquitectura de origen múltiple sea una desventaja al crear aplicaciones web progresivas.

A pesar de esto, muchos sitios continúan siendo estructurados de esta manera sin ninguna razón en particular, o por razones 'heredadas'. Un ejemplo es el uso de subdominios para separar arbitrariamente partes de un sitio que deberían ser parte de una experiencia unificada.

Los siguientes patrones, por ejemplo, no se recomiendan en absoluto:

- **Secciones de un sitio:** separar diferentes secciones de un sitio en subdominios. En los sitios de noticias, no es raro ver la página de inicio en: `https://www.example.com`, mientras que la sección de deportes se encuentra en `https://sports.example.com`, la política en `https://politics.example.com`, etc. En el caso de un sitio de comercio electrónico, se usa algo como `https://category.example.com` para categorías de productos, `https://product.example.com` para páginas de productos, etc.

- **Flujo de usuarios:** otro enfoque que no se recomienda es separar diferentes partes más pequeñas del sitio, como páginas para el inicio de sesión o flujos de compra en subdominios. Por ejemplo, usando `https://login.example.com` y `https://checkout.example.com`.

{% Aside %} Al crear un sitio desde cero, se recomienda encarecidamente evitar dividirlo en subdominios. Para los sitios existentes, migrar a un solo origen es el mejor enfoque. {% endAside %}

Para aquellos casos en los que no es posible migrar a un solo origen, lo que sigue es una lista de desafíos y (cuando sea posible), soluciones que se pueden considerar al crear aplicaciones web progresivas.

## Desafíos y soluciones para las PWA de diferentes orígenes

Cuando se crea un sitio web multiorigen, proporcionar una experiencia de PWA unificada es un desafío, principalmente debido a la [política del mismo origen](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy), que impone una serie de restricciones. Veámoslas una a la vez.

### Service workers

El origen de la URL del script del service worker debe ser el mismo que el origen de la página que llama a [register ()](https://w3c.github.io/ServiceWorker/#navigator-service-worker-register). Esto significa que, por ejemplo, una página en `https://www.example.com` no puede llamar a `register()` con una URL de service worker en `https://section.example.com`.

Otra consideración es que un service worker solo puede controlar las páginas alojadas en el origen y la ruta a la que pertenece. Esto significa que, si el service worker está alojado en `https://www.example.com`, solamente puede controlar las URL de ese origen (de acuerdo con la ruta definida en el [parámetro de alcance](https://developer.mozilla.org/docs/Web/API/ServiceWorkerContainer/register#Parameters) -scope parameter), pero no controlará ninguna página en otros subdominios, como por ejemplo, las de `https://section.example.com`.

En este caso, la única solución es utilizar varios service workers (uno por origen).

{% Aside 'caution' %} Registrarse y tener varios service workers activos consume recursos adicionales (memoria, CPU, etc.), así que use su mejor criterio en cuanto a la cantidad de service workers activos que necesitará un usuario para navegar por el sitio. {% endAside %}

### Almacenamiento en caché

El objeto Cache, así como indexedDB y localStorage también están restringidos a un solo origen. Esto significa que no es posible acceder a los cachés que pertenecen a `https://www.example.com`, desde, por ejemplo: `https://www.section.example.com`.

Aquí hay algunas cosas que puede hacer para administrar los cachés correctamente en escenarios como este:

- **Aproveche el almacenamiento en caché del navegador:** siempre se recomienda el uso de [las mejores prácticas tradicionales de almacenamiento en caché del navegador.](https://webkit.org/blog/8090/workers-at-your-service/) Esta técnica proporciona el beneficio adicional de reutilizar los recursos almacenados en caché en todos los orígenes, lo que no se puede hacer con la caché del service worker. Para obtener más información relacionada a las prácticas recomendadas para usar HTTP Cache con service workers, puede echar un vistazo a [esta publicación](https://jakearchibald.com/2016/caching-best-practices/#the-service-worker-the-http-cache-play-well-together-dont-make-them-fight).

- **Mantenga la instalación del service worker ligera:** si está usando varios service workers, evite que los usuarios paguen caro por la instalación cada vez que navegan hacia un nuevo origen. En otras palabras: solo coloque en cache de forma anticipada los recursos que son absolutamente necesarios.

{% Aside 'gotchas' %} Una vez que el service worker está activo y en ejecución, la política del mismo origen también restringe las solicitudes de origen cruzado realizadas ***dentro de*** los service workers. Afortunadamente, esto tiene una solución alternativa recomendada, que es usar [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) (como se explica [aquí](https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api#cross-origin_requests)). No se recomienda usar el modo [no-cors](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) cuando se obtienen recursos dentro del service worker. {% endAside %}

### Permisos

Los permisos también se limitan a los orígenes. Esto significa que si un usuario otorgó un permiso dado al origen `https://section.example.com`, no se transferirá a otros orígenes, como `https://www.example.com`.

Dado que no hay forma de compartir permisos entre orígenes, la única solución aquí es pedir permiso en cada subdominio donde se requiere una característica determinada (por ejemplo, ubicación). Para cosas como web push, puede mantener una cookie para rastrear si el usuario ha aceptado el permiso en otro subdominio, para evitar volver a solicitarlo.

### Instalación

Para instalar una PWA, cada origen debe tener su propio manifiesto con un `start_url` [relativo a sí mismo](https://w3c.github.io/manifest/#start_url-member). Esto significa que un usuario que recibe la solicitud de instalación en un origen determinado (es decir: `https://section.example.com`) no será capaz de instalar el PWA con una `start_url` en uno diferente (es decir: `https://www.example.com`). En otras palabras, los usuarios que reciban el mensaje de instalación en un subdominio solo podrán instalar PWA para las subpáginas, no para la URL principal de la aplicación.

También existe el problema de que el mismo usuario podría recibir varias solicitudes de instalación al navegar por el sitio, si cada subdominio cumple con los [criterios de instalación](https://developers.google.com/web/fundamentals/app-install-banners/#criteria), y solicita al usuario que instale la PWA.

Para mitigar este problema, puede asegurarse de que el mensaje se muestre solo en el origen principal. Cuando un usuario visita un subdominio que pasa los criterios de instalación:

1. [Escuche el evento `beforeinstallprompt`](https://developers.google.com/web/fundamentals/app-install-banners/#listen_for_beforeinstallprompt).
2. [Evite que aparezca el mensaje](https://developers.google.com/web/fundamentals/app-install-banners/#preventing_the_mini-infobar_from_appearing) , llamando a `event.preventDefault()`.

De esa manera, se asegura de que el mensaje no se muestre en partes no deseadas del sitio, mientras que puede continuar mostrándolo, por ejemplo, en el origen principal (por ejemplo, en la página de inicio).

### Modo independiente

Mientras navega en una ventana independiente, el navegador se comportará de manera diferente cuando el usuario se mueva fuera del alcance establecido por el manifiesto de la PWA. El comportamiento depende de la versión y el proveedor de cada navegador. Por ejemplo, las últimas versiones de Chrome abren una [pestaña personalizada de Chrome](https://developer.chrome.com/multidevice/android/customtabs) cuando un usuario sale del alcance en modo independiente.

En la mayoría de los casos, no hay una solución para esto, pero se puede aplicar una solución para pequeñas partes de la experiencia que están alojadas en subdominios (por ejemplo: flujos de trabajo de inicio de sesión):

1. La nueva URL, `https://login.example.com`, podría abrirse dentro de un iframe de pantalla completa.
2. Una vez que la tarea se completa dentro del iframe (por ejemplo, el proceso de inicio de sesión), [se puede usar postMessage ()](https://developer.mozilla.org/docs/Web/API/Window/postMessage) para pasar cualquier información resultante del iframe a la página principal.
3. Como paso final, una vez que la página principal recibe el mensaje, se puede anular el registro de los oyentes y, finalmente, eliminar el iframe del DOM.

{% Aside 'caution' %} La técnica anterior puede ayudar a mitigar el posible cambio en la IU en una pequeña parte del sitio, donde el usuario puede realizar una acción en un subdominio y regresar al origen principal (como en un flujo de inicio de sesión), pero no será una técnica eficaz para implementar en rutas completas, incluidas muchas páginas alojadas en subdominios (como secciones completas del sitio). {% endAside %}

{% Aside %} En el contexto de [Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/), existe una forma recomendada de evitar este problema, [validando todos los orígenes mediante enlaces de activos digitales](https://developers.google.com/web/updates/2020/01/twa-multi-origin). {% endAside %}

### Conclusión

La política del mismo origen impone muchas restricciones para los sitios creados sobre múltiples orígenes que desean brindar una experiencia de PWA coherente. Por esa razón, para ofrecer la mejor experiencia a los usuarios, recomendamos encarecidamente no dividir los sitios en diferentes orígenes.

Para los sitios existentes que ya están construidos de esta manera, puede ser un desafío hacer que las PWA de múltiples orígenes funcionen correctamente, pero hemos explorado algunas posibles soluciones. Cada una puede tener ventajas y desventajas, así que use su criterio al decidir qué enfoque adoptar en su sitio web.

Al evaluar una estrategia a largo plazo o el rediseño de un sitio, considere migrar a un solo origen, a menos que haya una razón importante para mantener la arquitectura de múltiples orígenes.

*Muchas gracias a: Penny Mclachlan, Paul Covell, Dominick Ng, Alberto Medina, Pete LePage, Joe Medley, Cheney Tsai, Martin Schierle y Andre Bandarra por sus revisiones técnicas y sugerencias.*
