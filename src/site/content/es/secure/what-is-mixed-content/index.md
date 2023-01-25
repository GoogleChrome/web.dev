---
layout: post
title: "¿Qué es contenido mixto?"
authors:
  - johyphenel
  - rachelandrew
date: 2019-09-07
updated: 2020-09-24
description: El contenido mixto se produce cuando el HTML inicial se carga mediante una conexión HTTPS segura, pero otros recursos se cargan por medio de una conexión HTTP insegura.
tags:
  - security
  - network
  - privacy
  - html
  - css
  - javascript
  - images
  - media
---

El **contenido mixto** se produce cuando el HTML inicial se carga mediante una conexión [HTTPS](/why-https-matters/) segura, pero otros recursos se cargan por medio de una conexión HTTP insegura. Esto se denomina contenido mixto porque tanto el contenido HTTP como el HTTPS se cargan para mostrar la misma página y la solicitud inicial era segura mediante HTTPS.

La solicitud de subrecursos basados en el protocolo HTTP inseguro debilita la seguridad de toda la página, ya que estas solicitudes son vulnerables a [**los ataques en las rutas**](https://www.ietf.org/rfc/rfc7835.html#section-2.1.1), en los que un atacante espía una conexión de red y ve o modifica la comunicación entre dos partes. Al utilizar estos recursos, los atacantes pueden rastrear a los usuarios y reemplazar el contenido de un sitio web y, en el caso del contenido mixto activo, asumir el control completo de la página, no solo de los recursos inseguros.

Aunque muchos navegadores reportan al usuario advertencias sobre el contenido mixto, cuando esto sucede, ya es demasiado tarde: las solicitudes inseguras ya se llevaron a cabo y la seguridad de la página está comprometida.

Por esta razón, los navegadores bloquean con mayor frecuencia los contenidos mixtos. Si tiene contenido mixto en su sitio, corregirlo garantizará que el contenido siga cargándose conforme los navegadores se vuelvan más estrictos.

## Los dos tipos de contenido mixto

Los dos tipos de contenido mixto son: activo y pasivo.

El **contenido mixto pasivo** se refiere al contenido que no interactúa con el resto de la página, y por lo tanto un ataque de hombre en el medio se limita a lo que puede hacer si intercepta o cambia ese contenido. El contenido mixto pasivo se define como contenido de imágenes, video y audio.

El **contenido mixto activo** interactúa con la página como un todo y permite a que un atacante efectúe casi cualquier cosa con la página. El contenido mixto activo incluye scripts, hojas de estilo, iframes y otro tipo de código que el navegador puede descargar y ejecutar.

### Contenido mixto pasivo

El contenido mixto pasivo se considera menos problemático, pero aún así representa una amenaza de seguridad para su sitio y sus usuarios. Por ejemplo, un atacante puede interceptar las solicitudes HTTP de las imágenes de su sitio y modificar o reemplazar estas imágenes. El atacante puede cambiar las imágenes de los botones *guardar* y *eliminar*, lo cual hace que sus usuarios eliminen contenido sin la intención de hacerlo; reemplacen los diagramas de sus productos con contenido lascivo o pornográfico, lo cual perjudica a su sitio; o se reemplacen las imágenes de sus productos con anuncios de un sitio o producto diferente.

Incluso si el atacante no altera el contenido de su sitio, un atacante puede rastrear a los usuarios mediante solicitudes de contenido mixto. El atacante puede saber qué páginas visita un usuario y qué productos ve basándose en las imágenes u otros recursos que carga el navegador.

Si el contenido mixto pasivo está presente, la mayoría de los navegadores indicarán en la barra de direcciones URL que la página no es segura, incluso cuando la propia página se cargó por medio de HTTPS. Puede observar este comportamiento con esta [demostración](https://passive-mixed-content.glitch.me/) que contiene ejemplos de contenido mixto pasivo.

Hasta hace poco tiempo, el contenido mixto pasivo se cargaba en todos los navegadores, ya que su bloqueo hubiera perjudicado a muchos sitios web. Esta situación está comenzando a cambiar, por lo que es vital actualizar cualquier instancia de contenido mixto en su sitio.

[Chrome actualmente implementa](https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html) la actualización automática del contenido mixto pasivo cuando es posible. La actualización automática significa que si el activo está disponible en HTTPS, pero se codificó como HTTP, el navegador cargará la versión HTTPS. Si no se encuentra una versión segura, el activo no se cargará.

Siempre que se detecta contenido mixto o actualizaciones automáticas de contenido mixto pasivo, Chrome registra mensajes detallados en la pestaña **Problemas** de DevTools que le indican cómo solucionar el problema específico.

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HNxoomaHi2ksvYHGuNiE.jpg", alt = "La pestaña Problemas de Chrome DevTools muestra información detallada sobre el problema específico de contenido mixto y cómo solucionarlo", width = "800", height = "310 " %}</figure>

### Contenido mixto activo

El contenido activo mixto representa una amenaza mayor que el contenido pasivo mixto. Un atacante puede interceptar y reescribir el contenido activo, con lo cual puede obtener el control total de su página o incluso de todo su sitio web. Esto permitirá que el atacante modifique cualquier aspecto de la página, como mostrar un contenido totalmente diferente, robar las contraseñas de los usuarios u otras credenciales de inicio de sesión, robar las cookies de sesión de los usuarios o redirigir a los usuarios a un sitio completamente diferente.

Debido a la peligrosidad de esta amenaza, la mayoría de los navegadores ya bloquean este tipo de contenidos de forma predeterminada para proteger a los usuarios, pero la función difiere según los proveedores y las versiones de los navegadores.

Esta otra [demostración](https://active-mixed-content.glitch.me/) contiene ejemplos de contenido mixto activo. [Cargue el ejemplo a través de HTTP](http://active-mixed-content.glitch.me/) para ver el contenido que está bloqueado cuando [carga el ejemplo a través de HTTPS](https://active-mixed-content.glitch.me/) . El contenido bloqueado también se detallará en la pestaña **Problemas.**

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xRG5zpKLr0Z3OwfYpn2H.jpg", alt="La pestaña Problemas de Chrome DevTools muestra información detallada sobre el problema específico de contenido mixto y cómo solucionarlo", width="800", height="361" %}</figure>

{% Aside %} Además, los navegadores destacan el contenido bloqueado en sus DevTools. Los problemas de contenido bloqueado se detallan en la pestaña **Problemas** de los navegadores basados en Chromium. Firefox y Safari registran los mensajes en la consola. {% endAside %}

## La especificación del contenido mixto

Los navegadores siguen los [requisitos del contenido mixto](https://w3c.github.io/webappsec-mixed-content/), que define las categorías [**contenido con opción de bloqueo**](https://w3c.github.io/webappsec-mixed-content/#optionally-blockable-mixed-content) y [**contenido de bloqueo**](https://w3c.github.io/webappsec-mixed-content/#category-blockable).

Según las especificaciones, un recurso se considera como contenido con opción de bloqueo "cuando el riesgo de permitir su uso como contenido mixto es mayor que el riesgo de dañar partes significativas de la web"; esto es un subconjunto de la categoría de contenido mixto pasivo descrito anteriormente.

Todo el contenido que no es **de bloqueo opcional** se considera **bloqueable**, y el navegador debe bloquearlo.

{% Aside %} Hay un [Nivel 2 de la especificación de contenido mixto](https://w3c.github.io/webappsec-mixed-content/level2.html) en proceso, que agregará la actualización automática a los requisitos. {% endAside %}

Durante los últimos años, el [uso de HTTPS aumentó drásticamente](https://transparencyreport.google.com/https/overview), y se convirtió en la opción predeterminada en la web. Esto hace que ahora sea más factible para los navegadores considerar el bloqueo de todo el contenido mixto, incluso aquellos tipos de sub-recursos definidos en la [especificación de contenido mixto](https://w3c.github.io/webappsec/specs/mixedcontent/) como **opciones de bloqueo**. Por este motivo, ahora vemos que Chrome adopta un enfoque más estricto con respecto a estos sub-recursos.

### Navegadores antiguos

Es importante recordar que no todos los visitantes de su sitio web utilizan los navegadores más actualizados. Las diferentes versiones de los distintos proveedores de navegadores consideran el contenido mixto de forma diferente. Por lo general, los navegadores y las versiones más antiguas no bloquean ningún contenido mixto, lo que resulta muy inseguro para el usuario.

Al corregir los problemas de contenido mixto, garantiza que su contenido sea visible en los nuevos navegadores. A la vez, ayudará a proteger a los usuarios de contenidos peligrosos que no se bloquean en los navegadores más antiguos.
