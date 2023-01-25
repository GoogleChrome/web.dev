---
layout: post
title: Cómo definir tu estrategia de instalación
authors:
  - demianrenzulli
  - petelepage
date: 2020-05-12
updated: 2020-08-20
description: |2-

  Mejores prácticas para combinar diferentes ofertas de instalación para aumentar la tasa de instalación y evitar la competencia de plataformas y la canibalización.
tags:
  - progressive-web-apps
---

{% YouTube '6R9pupbDXYw' %}

En el pasado, la instalación de aplicaciones solo era posible en el contexto de aplicaciones específicas de plataforma. Hoy en día, las aplicaciones web modernas ofrecen experiencias instalables que brindan el mismo nivel de integración y confiabilidad que las aplicaciones específicas de plataforma.

Puedes conseguirlo de diferentes formas:

- Instalación de la PWA [desde el navegador](/customize-install/).
- Instalación de la PWA [desde la app store](https://developer.chrome.com/docs/android/trusted-web-activity/).

Tener diferentes canales de distribución es una poderosa forma de llegar a un grande número de usuarios, pero elegir la estrategia adecuada para promoverlos puede ser un desafío.

Esta guía explorará las mejores prácticas para combinar diferentes ofertas de instalación con la finalidad de aumentar la tasa de instalación y evitar la competencia de plataformas y la canibalización. Las ofertas de instalación que se cubrirán incluyen las aplicaciones web progresivas (PWA) instaladas tanto desde el navegador como desde la App Store (Tienda de aplicaciones), así como aplicaciones específicas de plataforma.

## ¿Por qué hacer que tu aplicación web sea instalable?

Las aplicaciones web progresivas instaladas se ejecutan en una ventana independiente en lugar de una pestaña del navegador. Se pueden iniciar desde la pantalla de inicio, el dock, la barra de tareas o la estantería del usuario. Es posible buscarlos en un dispositivo y saltar entre ellos con el conmutador de aplicaciones, haciéndolos sentir como parte del dispositivo en el que están instalados.

Pero tener una aplicación web instalable y una aplicación específica de plataforma puede resultar confuso para los usuarios. Para algunos usuarios, las aplicaciones específicas de plataforma pueden ser la mejor opción, pero para otros pueden presentar algunos inconvenientes:

- **Restricciones de almacenamiento:** Instalar una nueva aplicación puede significar eliminar otras o limpiar espacio al eliminar contenido valioso. Esto es especialmente desventajoso para los usuarios de dispositivos de gama baja.
- **Ancho de banda disponible:** Descargar una aplicación puede ser un proceso lento y costoso, incluso más para los usuarios con conexiones lentas y planes de datos costosos.
- **Fricción:** Abandonar un sitio web y trasladarse a una tienda para descargar una aplicación crea fricciones adicionales y retrasa una acción del usuario que podría realizarse directamente en la web.
- **Ciclo de actualización:**  Para realizar cambios en aplicaciones específicas de plataforma, es posible que sea necesario pasar por un proceso de revisión de la aplicación, lo que puede ralentizar los cambios y los experimentos (por ejemplo, las pruebas A/B).

En algunos casos, el porcentaje de usuarios que no descargarán la aplicación específica de tu plataforma puede ser grande, por ejemplo: aquellos que piensan que no usarán la aplicación con mucha frecuencia o que no pueden justificar gastar varios megabytes de almacenamiento o de datos. Puedes determinar el tamaño de este segmento de varias formas, por ejemplo, mediante el uso de una configuración de análisis para realizar un seguimiento del porcentaje de usuarios de "solo web móvil".

Si el tamaño de este segmento es considerable, es una buena indicación de que necesitas proporcionar formas alternativas para instalar tus experiencias.

## Promoviendo la instalación de tu PWA a través del navegador

Si tienes una PWA de alta calidad, puede ser mejor promover su instalación sobre la aplicación específica de tu plataforma. Por ejemplo, si la aplicación específica de la plataforma le falta la funcionalidad que ofrece tu PWA o si es que no se ha actualizado por un tiempo. También puede ser útil promover la instalación de tu PWA si la aplicación específica de la plataforma no está optimizada para pantallas más grandes, como lo puede ser en ChromeOS.

Para algunas aplicaciones, impulsar la instalación de aplicaciones específicas de la plataforma es una parte clave del modelo comercial; en ese caso, tiene sentido comercial mostrar una promoción de instalación de aplicaciones específica de plataforma. Sin embargo, es posible que algunos usuarios se sientan más cómodos permaneciendo en la web. Si ese segmento se puede identificar, el indicador de la PWA se puede mostrar solo a ellos (lo que llamamos "PWA como respaldo").

En esta sección, exploraremos diferentes formas de maximizar la velocidad de instalación de las PWA instaladas a través del navegador.

### PWA como principal experiencia instalable

Una vez que una PWA cumpla con los [criterios de instalación](/install-criteria/), la mayoría de los navegadores mostrarán una indicación de que la PWA es instalable. Por ejemplo, Chrome en Desktop mostrará un icono instalable en la barra de direcciones, y en el móvil, mostrará una mini barra de información:

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1VOvbQjeenZOBAmzjVN5.png", alt="Mensaje de instalación estándar de Chrome llamado mini-barra de información", width="800", height="417" %}<figcaption> La mini-barra de información</figcaption></figure>

Si bien eso puede ser suficiente para algunas experiencias, si tu objetivo es impulsar las instalaciones de tu PWA, fuertemente te recomendamos que escuches a [`BeforeInstallPromptEvent`](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent) y sigas los [patrones para promover la instalación](/promote-install/) de tu PWA.

## Evite que tu PWA canibalice la tasa de instalación de la aplicación específica de plataforma

En algunos casos, puedes optar por promover la instalación de la aplicación específica de plataforma sobre tu PWA, pero en este caso te recomendamos que proporciones un mecanismo para permitir que los usuarios instalen tu PWA. Esta opción alternativa hace posible que los usuarios que no puedan o no quieran instalar la aplicación específica de tu plataforma obtengan una experiencia de instalación similar.

El primer paso para implementar esta estrategia es definir una heurística para cuando se le muestre al usuario una promoción de instalación tu PWA, por ejemplo:

**"Un usuario de PWA es un usuario que ha visto el mensaje de instalación de la aplicación específica de la plataforma y no ha instalado la aplicación específica de la plataforma. Ha regresado al sitio al menos cinco veces, o ha hecho clic en el banner de la aplicación, pero ha continuado usando el sitio web en su lugar."**

Entonces, la heurística se puede implementar de la siguiente manera:

1. Muestra el banner de instalación de la aplicación específica de la plataforma.
2. Si un usuario descarta el banner, configura una cookie con esa información (por ejemplo, `document.cookie = "app-install-banner=dismissed"`).
3. Utiliza otra cookie para rastrear el número de visitas de los usuarios al sitio (por ejemplo, `document.cookie = "user-visits=1"`).
4. Escribe una función, como la de `isPWAUser()`, para que utilice la información almacenada previamente en las cookies junto con la de la API de [`getInstalledRelatedApps()`](/get-installed-related-apps/) para determinar si un usuario se considera un "usuario de PWA".
5. En el momento en que el usuario realiza una acción significativa, llama a `isPWAUser()`. Si la función devuelve un valor de true (verdadero) y el indicador de instalación de PWA se guardó anteriormente, puedes mostrar el botón de instalación de PWA.

## Promoción de la instalación de tu PWA a través de una app store

Las aplicaciones que están disponibles en las app store se pueden crear con diferentes tecnologías, incluyendo las técnicas de PWA. En el siguiente artículo de [Combinación de PWA en entornos nativos](https://youtu.be/V7YX4cZ_Cto), puedes encontrar un resumen de las tecnologías que se pueden utilizar para ese fin.

En esta sección clasificaremos las aplicaciones de la tienda en dos grupos:

- **Aplicaciones específicas de plataforma:** Estas aplicaciones se crean principalmente con código específico de la plataforma. Su tamaño depende de la plataforma, pero suelen superar los 10 MB en Android y los 30 MB en iOS. Es posible que desees promocionar la aplicación específica de tu plataforma si no tienes una PWA o si la aplicación específica de la plataforma presenta un conjunto de funciones más completo.
- **Aplicaciones livianas (Lightweight apps):** Estas aplicaciones también se pueden crear con código específico de la plataforma, pero normalmente se crean con tecnología web, empaquetadas en un contenedor específico de la plataforma. También se pueden cargar PWA completos en las tiendas. Algunas empresas optan por ofrecer estas experiencias como "livianas" y otras también han utilizado este enfoque para sus aplicaciones emblemáticas (centrales).

### Promoción de aplicaciones livianas

Según un [estudio de Google Play](https://medium.com/googleplaydev/shrinking-apks-growing-installs-5d3fcba23ce2), por cada aumento de 6 MB al tamaño de un APK, la tasa de conversión de instalación disminuye en un 1%. ¡Esto significa que la tasa de finalización de descarga de una aplicación de 10 MB podría ser aproximadamente un **30% más alta que una aplicación de 100 MB!**

Para solucionar este problema, algunas empresas están aprovechando de su PWA para ofrecer una versión liviana de su aplicación en la Play Store utilizando Trusted Web Activities (Actividades web de confianza). Las [Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/) permiten entregar tu PWA en la Play Store y, debido a que se creó a través de la web, el tamaño de la aplicación suele ser de solo unos pocos megabytes.

Oyo, una de las empresas hoteleras más grandes de la India, creó una [versión Lite de su aplicación](/oyo-lite-twa/) y la publicó en la Play Store mediante TWA. Pesa 850 KB, eso es el 7% del tamaño de su aplicación de Android. Y una vez instalado, es indistinguible de su aplicación de Android:

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>OYO Lite en acción.</figcaption></figure>

Oyo mantuvo tanto la versión insignia como la versión "lite" de la aplicación en la tienda, dejando la decisión final a los usuarios.

#### Proporcionar una experiencia web liviana

Intuitivamente, los usuarios de dispositivos de gama baja pueden estar más inclinados a descargar versiones ligeras de aplicaciones que los usuarios de teléfonos de gama alta. Por lo tanto, si es posible identificar el dispositivo de un usuario, se podría priorizar el banner de instalación de la aplicación liviana sobre la versión de la aplicación específica de la plataforma que suele ser más pesada.

En la web, es posible obtener señales de dispositivos y asignarlas aproximadamente a categorías de dispositivos (por ejemplo, "alta", "media" o "baja"). Puedes obtener esta información de diferentes formas, utilizando API de JavaScript o por sugerencias del cliente.

#### Usando la API de JavaScript

Usando API de JavaScript mediante [navigator.hardwareConcurrency](https://developer.mozilla.org/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency), [navigator.deviceMemory](https://developer.mozilla.org/docs/Web/API/Navigator/deviceMemory) y [navigator.connection](https://developer.mozilla.org/docs/Web/API/Navigator/connection), puedes obtener información sobre la CPU del dispositivo, la memoria y el estado de la red, respectivamente. Por ejemplo:

```javascript
const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';`
```

#### Usar sugerencias del cliente

Las señales del dispositivo también se pueden inferir en los encabezados de solicitud HTTP, a través de [sugerencias del cliente](https://developer.mozilla.org/docs/Glossary/Client_hints). A continuación, te mostramos cómo puedes implementar el código anterior para la memoria del dispositivo con sugerencias del cliente:

Primero, dile al navegador que estás interesado en recibir sugerencias de memoria del dispositivo mediante la cabecera de respuesta HTTP para cualquier solicitud de origen:

```html
HTTP/1.1 200 OK
Content-Type: text/html
Accept-CH: Device-Memory
```

Luego, comenzarás a recibir información de la memoria del dispositivo en la cabecera de solicitud de las consultas HTTP:

```html
GET /main.js HTTP/1.1
Device-Memory: 0.5
```

Puedes utilizar esta información en tus backends para almacenar una cookie con la categoría del dispositivo del usuario:

```javascript
app.get('/route', (req, res) => {
  // Determinar la categoría del dispositivo

 const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';

  // Definir cookie
  res.setCookie('Device-Category', deviceCategory);
  …
});
```

Finalmente, crea tu propia lógica para asignar esta información a las categorías de dispositivos y mostrar el aviso de instalación de la aplicación correspondiente en cada caso:

```javascript
if (isDeviceMidOrLowEnd()) {
   // Mostrar el banner de instalación para "Lite app" o el mensaje PWA A2HS
} else {
  // Mostrar el banner de instalación la "app de insignia"
}
```

{% Aside %} Al cubrir en profundidad las técnicas sobre cómo asignar señales de dispositivos a categorías de dispositivos está fuera del alcance de esta guía, pero puedes consultar la [adaptive loading guide (guía de carga adaptable)](https://dev.to/addyosmani/adaptive-loading-improving-web-performance-on-low-end-devices-1m69) de Addy Osmani, [The Device Memory API (La API de la Memoria del dispisitivo)](https://developer.chrome.com/blog/device-memory/) de Philip Walton y [Adapting to Users with Client Hints (Adaptando a los usuarios mediante las sugerencias del cliente)](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints/) de Jeremy Wagner para obtener más información sobre las mejores prácticas en torno a lo anterior. {% endAside %}

## Conclusión

La capacidad de tener un icono en la pantalla de inicio del usuario es una de las características más atractivas de las aplicaciones. Dado que históricamente esto solo era posible para las aplicaciones instaladas desde las app store, las empresas podrían pensar que al mostrar un banner de instalación de la tienda de aplicaciones sería suficiente para convencer a los usuarios de que instalen sus experiencias. Actualmente, hay más opciones para que el usuario instale una aplicación, incluida la oferta de experiencias de aplicaciones livianas en las tiendas y permitir que los usuarios agreguen tu PWA a sus pantallas de inicio, solicitándoles que lo hagan directamente desde el sitio web.
