---
layout: post
title: Usando una PWA en su aplicación de Android
authors:
  - andreban
date: 2020-03-19
updated: 2021-12-06
description: |2

  Cómo abrir una aplicación web progresiva en una aplicación de Android.
tags:
  - progressive-web-apps
---

## Iniciar una PWA en una aplicación de Android

Las [aplicaciones web progresivas](/progressive-web-apps/) (PWA) son aplicaciones web que utilizan características similares a las de una aplicación para crear experiencias de alta calidad que son rápidas, confiables y atractivas.

La web tiene un alcance increíble y ofrece formas poderosas para que los usuarios descubran nuevas experiencias. Pero los usuarios también están acostumbrados a buscar aplicaciones en la tienda de su sistema operativo. En muchos casos, esos usuarios ya están familiarizados con la marca o el servicio que buscan y tienen un alto nivel de intencionalidad que se traduce en métricas de participación superiores a la media.

Play Store es una tienda para aplicaciones de Android y los desarrolladores a menudo quieren abrir sus aplicaciones web progresivas desde sus aplicaciones de Android.

Trusted Web Activity es un estándar abierto que permite a los navegadores ofrecer un contenedor totalmente compatible con la plataforma web que procesa PWA dentro de una aplicación de Android. La función está disponible en [Chrome](https://play.google.com/store/apps/details?id=com.android.chrome) y en desarrollo en [Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix).

### Las soluciones existentes eran limitadas

Siempre ha sido posible incluir experiencias web en una aplicación de Android, utilizando tecnologías como [Android WebView](https://developer.android.com/reference/android/webkit/WebView) o frameworks como [Cordova](https://cordova.apache.org/).

La limitación de Android WebView es que no está diseñado para reemplazar al navegador. Android WebView es una herramienta de desarrollo para usar la interfaz de usuario web en una aplicación de Android y no da acceso completo a las funciones de la plataforma web moderna, como el [selector de contactos](/contact-picker/) o el [sistema de archivos](/file-system-access/), [entre otras](https://developer.chrome.com/blog/fugu-status/).

Cordova fue diseñado para superar las deficiencias de WebView, pero las API se limitan al entorno de Cordova. Eso significa que necesita mantener una base de código adicional para usar las API de Cordova para su aplicación de Android, separada de su PWA en la web abierta.

Además, la capacidad de detección de funciones a menudo no siempre funciona como se esperaba y los problemas de compatibilidad entre las versiones de Android y los OEM también pueden ser un problema. Cuando se utiliza una de esas soluciones, los desarrolladores necesitan procesos de garantía de calidad agregados e incurren en un costo de desarrollo adicional para detectar y crear soluciones.

### Trusted Web Activity es un nuevo contenedor para aplicaciones web en Android

Los desarrolladores ahora pueden usar un [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/) como un contenedor para incluir una PWA como una actividad de lanzamiento para una aplicación de Android. La tecnología aprovecha el navegador para mostrar la PWA en pantalla completa, lo que garantiza que el Trusted Web Activity tenga la misma compatibilidad con las funciones de la plataforma web y las API que el navegador subyacente. También hay utilerías de código abierto para facilitar aún más la implementación de una aplicación de Android mediante un Trusted Web Activity.

Otra ventaja que no está disponible en otras soluciones es que el contenedor comparte almacenamiento con el navegador. Los estados de inicio de sesión y las preferencias de los usuarios se comparten sin problemas entre las experiencias.

#### Compatibilidad del navegador

La función ha estado disponible en Chrome desde la versión 75, y Firefox la implementó en su versión nocturna.

### Criterios de calidad

Los desarrolladores web deben utilizar un Trusted Web Activity cuando quieran incluir contenido web en una aplicación de Android.

El contenido web en un Trusted Web Activity debe cumplir con los criterios de instalabilidad de PWA.

Además, para que coincida con el comportamiento que los usuarios esperan de las aplicaciones de Android, [Chrome 86 introdujo un cambio](https://blog.chromium.org/2020/06/changes-to-quality-criteria-for-pwas.html) en el que no manejar los siguientes escenarios se considera un fallo fatal:

- No verificar los enlaces de activos digitales al iniciar la aplicación.
- No devolver HTTP 200 para una solicitud de recursos de red sin conexión.
- Una solicitud de navegación que devuelva un error HTTP 404 o 5xx.

Cuando ocurre uno de esos escenarios en el Trusted Web Activity, se provoca un fallo fatal visible para el usuario de la aplicación de Android. Consulte la [guía](https://developer.chrome.com/docs/android/trusted-web-activity/whats-new/#updates-to-the-quality-criteria) sobre cómo manejar esos escenarios en su trabajador de servicio.

La aplicación también debe cumplir con criterios adicionales específicos de Android, como el [cumplimiento de políticas](https://play.google.com/about/developer-content-policy/).

{% Aside 'caution' %} Cuando su aplicación esté diseñada principalmente para niños menores de 13 años, se aplican [políticas adicionales de Play Family](https://play.google.com/about/families/), que pueden ser incompatibles con el uso de Trusted Web Activity. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9Z70W3aCI8ropKpMXHcz.png", alt="Una captura de pantalla que muestra la puntuación de Lighthouse para AirHorn, con la insignia PWA y una puntuación de rendimiento de 100.", width="800", height="141" %}<figcaption> La insignia de PWA en Lighthouse muestra si su PWA pasa los criterios de instalabilidad.</figcaption></figure>

## Herramientas

Los desarrolladores web que quieran aprovechar los Trusted Web Activity no necesitan aprender nuevas tecnologías o APIs para transformar su PWA en una aplicación de Android. Juntos, Bubblewrap y PWABuilder aportan herramientas para los desarrolladores en forma de una biblioteca, interfaz de línea de comandos (CLI) e interfaz gráfica de usuario (GUI).

### Bubblewrap

El [proyecto Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) genera aplicaciones de Android en forma de una biblioteca NodeJS y una interfaz de línea de comandos (CLI).

El arranque de un nuevo proyecto se logra ejecutando la herramienta y pasando la URL del Web Manifest:

```shell
npx @bubblewrap/cli init --manifest=https://pwa-directory.appspot.com/manifest.json
```

La herramienta también puede compilar el proyecto y, al ejecutar el siguiente comando, se generará una aplicación de Android lista para cargarse en Play Store:

```shell
npx @bubblewrap/cli build
```

Después de ejecutar este comando, un archivo llamado `app-release-signed.apk` estará disponible en el directorio raíz del proyecto. Este es el archivo que se [cargará en Play Store](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB).

### PWABuilder

[PWABuilder](https://pwabuilder.com/) ayuda a los desarrolladores a transformar sitios web existentes en aplicaciones web progresivas. También se integra con Bubblewrap para proporcionar una interfaz gráfica de usuario para envolver esas PWA en una aplicación de Android. El equipo de PWABuilder ha elaborado una [excelente publicación en su blog](https://www.davrous.com/2020/02/07/publishing-your-pwa-in-the-play-store-in-a-couple-of-minutes-using-pwa-builder/) sobre cómo generar una aplicación de Android utilizando la herramienta.

## Verificación de la propiedad de la PWA en la aplicación de Android

Un desarrollador que crea una gran aplicación web progresiva no querría que otro desarrollador creara una aplicación de Android con ella sin su permiso. Para asegurarse de que esto no suceda, la aplicación de Android debe emparejarse con la aplicación web progresiva mediante una herramienta llamada [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started).

Bubblewrap y PWABuilder se encargan de la configuración necesaria en la aplicación de Android, pero queda un último paso, que es agregar el `assetlinks.json` a la PWA.

Para generar este archivo, los desarrolladores necesitan la firma SHA-256 de la clave utilizada para firmar el APK que están descargando los usuarios.

La clave se puede generar de varias maneras, y la forma más fácil de encontrar qué clave firmó el APK que se está entregando a los usuarios finales es descargarla de la propia Play Store.

Para evitar mostrar una aplicación inservible a los usuarios, implemente la aplicación en un [canal de prueba cerrado](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB), instálela en un dispositivo de prueba y luego use la herramienta [Peter's Asset Link Tool](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool) para generar el archivo `assetlinks.json` correcto para la aplicación. Haga que el `assetlinks.json` generado esté disponible en `/.well-known/assetlinks.json`, en el dominio que se está validando.

## A donde ir después

Una aplicación web progresiva es una experiencia web de alta calidad. Trusted Web Activity es una nueva forma de abrir esas experiencias de alta calidad desde una aplicación de Android cuando cumplen con los criterios mínimos de calidad.

Si está comenzando con Progressive Web Apps, lea [nuestra guía sobre cómo crear una excelente PWA](/progressive-web-apps/). Para los desarrolladores que ya tienen una PWA, use [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) para verificar si cumple con los criterios de calidad.

Luego, use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) o [PWABuilder](https://pwabuilder.com/) para generar la aplicación de Android, [cargue la aplicación en un canal de prueba cerrado en Play Store](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB) y combínela con la PWA usando la herramienta [Peter's Asset Link Tool](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool).

Finalmente, mueva su aplicación del canal de prueba cerrado a producción.
