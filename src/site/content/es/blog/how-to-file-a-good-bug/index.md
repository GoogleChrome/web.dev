---
layout: post
title: Cómo reportar un error importante del navegador
subhead: Informar a los proveedores de los navegadores sobre problemas que encuentre en su navegador es una parte integral para mejorar la plataforma web.
authors:
  - robertnyman
  - petelepage
date: 2020-06-15
updated: 2020-06-15
description: Informar a los proveedores de los navegadores sobre problemas que encuentre en su navegador, en un dispositivo o plataforma específicos es una parte integral para mejorar la plataforma web.
tags:
  - blog
---

Reportar un error importante no es difícil, pero requiere algo de trabajo. El objetivo es facilitar la búsqueda de lo que está roto, llegar a la causa raíz y, lo más importante, encontrar una manera de solucionarlo. Los errores que progresan rápidamente tienden a ser fáciles de reproducir con un comportamiento claro esperado.

## Verifique que sea un error

El primer paso es averiguar cuál debería ser el comportamiento "correcto".

### ¿Cuál es el comportamiento correcto?

Consulte los documentos API relevantes en [MDN](https://developer.mozilla.org/) o intente encontrar especificaciones relacionadas. Esta información puede ayudarlo a decidir qué API está realmente dañada, dónde está dañada y cuál es el comportamiento esperado.

### ¿Funciona en un navegador diferente?

El comportamiento que difiere entre los navegadores generalmente se prioriza más como un problema de interoperabilidad, especialmente cuando el navegador que contiene el error es el extraño. Intente probarlo en las últimas versiones de Chrome, Firefox, Safari y Edge, posiblemente mediante una herramienta como [BrowserStack](https://www.browserstack.com/).

Si es posible, verifique que la página no se comporte intencionalmente de manera diferente debido al rastreo del agente de usuario. En Chrome DevTools, intente [configurar la cadena `User-Agent` para otro navegador](https://developer.chrome.com/docs/devtools/device-mode/override-user-agent/).

### ¿Dejó de funcionar en un lanzamiento reciente?

¿Funcionó como se esperaba en el pasado, pero dejó de funcionar en una versión reciente del navegador? Se puede actuar sobre tales "regresiones" mucho más rápido, especialmente si proporciona un número de versión en la que funcionaba y una versión en la que falló. Herramientas como [BrowserStack](https://www.browserstack.com/) pueden facilitar la verificación de versiones antiguas del navegador y la [herramienta bisect-builds](https://www.chromium.org/developers/bisect-builds-py) (para Chromium) permite buscar el cambio de manera muy eficiente.

Si un problema es una regresión y se puede reproducir, la causa raíz generalmente se puede encontrar y solucionar rápidamente.

### ¿Otros están viendo el mismo problema?

Si tiene problemas, es muy probable que otros desarrolladores también los estén teniendo. Primero, intente buscar el error en [Stack Overflow](http://stackoverflow.com/). Esto podría ayudarlo a traducir un problema abstracto en una API dañada específica y podría ayudarlo a encontrar una solución a corto plazo hasta que se solucione el error.

## ¿Se ha informado antes?

Una vez que tenga una idea de cuál es el error, es hora de verificar si el error ya se ha informado al buscar en la base de datos de errores del navegador.

- Navegadores basados en Chromium: [https://crbug.com](https://crbug.com/)
- Firefox: [https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- Navegadores basados en Safari y WebKit: [https://bugs.webkit.org/](https://bugs.webkit.org/)

Si encuentra un error existente que describe el problema, muestre su apoyo al destacar, marcar como favorito o comentar el error. Además, en muchos sitios, puede inscribirse en la lista CC y obtener actualizaciones cuando cambie el error.

Si decide comentar sobre el error, incluya información sobre cómo afecta el error a su sitio web. Evite agregar comentarios de estilo "+1", ya que los rastreadores de errores suelen enviar correos electrónicos por cada comentario.

## Informar el error

Si el error no se ha informado antes, es hora de informarle al proveedor del navegador.

### Cree un caso de prueba minimizado {: #minified-test-case }

Mozilla tiene un excelente artículo sobre [cómo crear un caso de prueba minimizado](https://developer.mozilla.org/docs/Mozilla/QA/Reducing_testcases). Para abreviar la historia, si bien una descripción del problema es un gran comienzo, nada mejor que proporcionar una demostración enlazada sobre el error que muestre el problema. Para maximizar la posibilidad de un progreso rápido, el ejemplo debe contener el código mínimo posible necesario para demostrar el problema. Una muestra de código mínimo es lo primero que puede hacer para aumentar las probabilidades de que su error se solucione.

A continuación, se ofrecen algunos consejos para minimizar un caso de prueba:

- Descargue la página web, agregue [`<base href="https://original.url">`](https://developer.mozilla.org/docs/Web/HTML/Element/base) y verifique que el error exista localmente. Esto puede requerir un servidor HTTPS en vivo si la URL usa HTTPS.
- Pruebe los archivos locales en las últimas versiones de tantos navegadores como pueda.
- Intente condensar todo en un archivo.
- Elimine el código (comenzando con las cosas que sabe que son innecesarias) hasta que desaparezca el error.
- Utilice el control de versiones para que pueda guardar su trabajo y deshacer las cosas que salieron mal.

#### Alojar un caso de prueba minimizado

Si está buscando un buen lugar para alojar su caso de prueba minimizado, existen varios lugares buenos disponibles:

- [Glitch](https://glitch.com)
- [JSBin](https://jsbin.com)
- [JSFiddle](https://jsfiddle.net)
- [CodePen](https://codepen.io)

Tenga en cuenta que varios de esos sitios muestran contenido en un iframe, lo que puede provocar que las funciones o los errores se comporten de manera diferente.

## Presentar su problema

Una vez que tenga su caso de prueba minimizado, estará listo para presentar ese error. Diríjase al sitio de seguimiento de errores correcto y cree un problema nuevo.

- Navegadores basados en Chromium: [https://crbug.com/new](https://crbug.com/new)
- Firefox: [https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- Navegadores basados en Safari y WebKit: [https://bugs.webkit.org/](https://bugs.webkit.org/)

### Proporcione una descripción clara y los pasos necesarios para reproducir el problema

Primero, proporcione una descripción clara para ayudar a que los ingenieros comprendan rápidamente cuál es el problema y ayudar a clasificar el problema.

```text
Cuando se instala una PWA mediante `beforeinstallprompt.prompt()`,
el evento `appinstalled` se activa antes de que se resuelva la invocación a `prompt()`.
```

A continuación, proporcione los pasos detallados necesarios para reproducir el problema. Aquí es donde entra en juego [su caso de prueba minimizado](#minified-test-case).

```text
¿Qué pasos reproducirán el problema?
1. Vaya a https://basic-pwa.glitch.me/, abra DevTools y analice
   la pestaña de consola.
2. Haga clic en el botón Instalar en la página, quizá necesite interactuar con
   la página un poco antes de que se habilite.
3. Haga clic en Instalar en la confirmación modal de instalación en el navegador.
```

Finalmente, describa el resultado *real* y *esperado*.

```text
¿Cuál es el resultado real? En la consola:
0. INSTALL: Disponible (se registra cuando se activa el evento `beforeinstallprompt`)
1. INSTALL: Exitosa (se registra cuando se activa el evento `appinstalled`)
2. INSTALL_PROMPT_RESPONSE: {resultado: "aceptada", platforma: "web"}
   (se registra cuando se resuelve beforeinstallprompt.prompt()`)

¿Cuál es el resultado esperado? En la consola:
0. INSTALL: Disponible (se registra cuando se activa el evento `beforeinstallprompt`)
1. INSTALL_PROMPT_RESPONSE: {resultado: "aceptada", platforma: "web"}
   (se registra cuando se resuelve beforeinstallprompt.prompt()`)
2. INSTALL: Exitosa (se registra cuando se activa el evento `appinstalled`)
```

Para obtener más información, consulte las [pautas de redacción de informes de errores](https://developer.mozilla.org/docs/Mozilla/QA/Bug_writing_guidelines) en MDN.

#### Bonificación: agregue una captura de pantalla o una captura de video del problema

Aunque no es obligatorio, en algunos casos puede ser útil agregar una captura de pantalla o una captura de video del problema. Esto es especialmente útil en los casos en que los errores pueden requerir algunos pasos extraños para reproducirse. Con frecuencia, puede ser útil que se pueda ver lo que sucede en una captura de video o en una captura de pantalla.

### Incluya detalles del entorno

Algunos errores solo se pueden reproducir en ciertos sistemas operativos, o solo en tipos específicos de pantallas (por ejemplo, dpi bajos o dpi altos). Asegúrese de incluir los detalles de los entornos de prueba que utilizó.

### Envíe el error

Finalmente, envíe el error. Luego, recuerde estar atento a su correo electrónico para ver las respuestas al error. Por lo general, durante la investigación y al corregir el error, los ingenieros pueden tener preguntas adicionales o, si tienen dificultades para reproducir el problema, pueden comunicarse.
