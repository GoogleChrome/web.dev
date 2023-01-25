---
layout: post
title: 'prefers-color-scheme: hola oscuridad, mi vieja amiga'
subhead: "¿Sobrevalorado o necesario? Aprenda todo sobre el modo oscuro y cómo utilizarlo en beneficio de sus usuarios."
authors:
  - thomassteiner
date: 2019-06-27
updated: 2020-08-02
hero: image/admin/dgDcIJUyuWB5xNn9CODd.jpg
hero_position: bottom
alt: Foto del contorno de una montaña durante la noche, foto de Nathan Anderson en Unsplash.
description: Foto del contorno de una montaña durante la noche, foto de Nathan Anderson en Unsplash.
tags:
  - blog
  - css
feedback:
  - api
---

## Introducción

{% Aside 'note' %} Investigué mucho sobre la historia y la teoría del modo oscuro, si solo le interesa trabajar con el modo oscuro, siéntase libre de [omitir la introducción](#activating-dark-mode-in-the-operating-system). {% endAside %}

### El modo oscuro previo al *Modo oscuro*

<figure data-float="right">{% Img src="image/admin/fmdRPm6K5SXiIRLgyz4y.jpg", alt="Pantalla verde de la computadora", width="233", height="175" %} <figcaption>Pantalla verde (<a href="https://commons.wikimedia.org/wiki/File:Compaq_Portable_and_Wordperfect.JPG">Fuente</a>)</figcaption></figure>

Completamos el círculo con el modo oscuro. En los inicios de la informática doméstica, el modo oscuro no era una cuestión de elección, sino un hecho: los monitores monocromáticos <abbr title="Cathode-Ray Tube">CRT</abbr> para computadoras funcionaban emitiendo haces de electrones sobre una pantalla fosforescente y el fósforo utilizado en los primeros CRT era verde. Debido a que el texto se mostraba en verde y el resto de la pantalla en negro, estos modelos frecuentemente se denominaban [pantallas verdes](https://commons.wikimedia.org/wiki/File:Schneider_CPC6128_with_green_monitor_GT65,_start_screen.jpg).

<figure data-float="left">{% Img src="image/admin/l9oDlIO59oyJiXVegxIV.jpg", alt="Procesamiento de texto oscuro sobre blanco", width="222", height="175" %} <figcaption>Oscuridad sobre blanco (<a href="https://www.youtube.com/watch?v=qKkABzt0Zqg">Fuente</a>)</figcaption></figure>

Los monitores CRT de color que se introdujeron posteriormente mostraron diferentes colores mediante el uso de fósforos rojos, verdes y azules. Para crear el blanco se activaban los tres fósforos simultáneamente. Con la llegada de la [edición por computadora](https://en.wikipedia.org/wiki/Desktop_publishing) más sofisticada de <abbr title="What You See Is What You Get">WYSIWYG</abbr>, se popularizó la idea de hacer que el documento virtual se pareciera a una hoja de papel física.

<figure data-float="right">{% Img src="image/admin/lnuLLcQzIF7r08lt479k.png", alt="Página web oscura en blanco en el navegador WorldWideWeb", width="233", height="175" %}<figcaption> El navegador WorldWideWeb (<a href="https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png">Fuente</a>)</figcaption></figure>

En esta época comenzó la tendencia de diseño *oscuro sobre blanco*, que se trasladó a la [primera web basada en documentos](http://info.cern.ch/hypertext/WWW/TheProject.html). El primer navegador de la historia, [WorldWideWeb](https://en.wikipedia.org/wiki/WorldWideWeb) (recordemos que [el CSS aún no se había inventado](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#History)), [mostraba las páginas web](https://commons.wikimedia.org/wiki/File:WorldWideWeb_FSF_GNU.png) de esta manera. Dato curioso: el segundo navegador de la historia, [Navegador de modo de línea](https://en.wikipedia.org/wiki/Line_Mode_Browser) -un navegador basado en una terminal- era verde sobre oscuro. Hoy en día, las páginas y aplicaciones web se diseñan normalmente con texto oscuro sobre fondo claro, una suposición básica que también está codificada en las hojas de estilo de los agentes de usuario, incluyendo la de [Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css).

<figure data-float="left">{% Img src="image/admin/zCdyRdnAnbrB7aAB0TQi.jpg", alt="El smartphone se utiliza mientras está acostado en la cama", width="262", height="175" %} <figcaption>Smartphone utilizado en la cama (Fuente: Unsplash)</figcaption></figure>

Los días de las pantallas CRT quedaron atrás. El consumo y la creación de contenidos se trasladaron a los dispositivos móviles que utilizan pantallas <abbr title="Pantalla de cristal líquido">LCD</abbr> o <abbr title="Diodo emisor de luz orgánico de matriz activa">AMOLED</abbr> de bajo consumo. Las computadoras, las tabletas y los smartphones, más pequeños y transportables, dieron lugar a nuevos patrones de uso. Las tareas de ocio, como la navegación por Internet, la codificación por diversión y los juegos de alta gama, con frecuencia se llevan a cabo después de las horas de trabajo en entornos poco iluminados. La gente incluso disfruta de sus dispositivos en sus camas durante la noche. Cuanto más utilicen las personas sus dispositivos en la oscuridad, más se popularizará la idea de volver a los orígenes de la *luz en la oscuridad*.

### Por qué el modo oscuro

#### El modo oscuro obedece a razones estéticas

Cuando a la gente se le pregunta [por qué le gusta o quiere el modo oscuro](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d), la respuesta más popular es que *"es más cómodo para los ojos"*, seguido de *"es elegante y hermoso"*. Apple, en su [documentación para desarrolladores sobre el Modo oscuro](https://developer.apple.com/documentation/appkit/supporting_dark_mode_in_your_interface), escribe explícitamente: *"La elección de activar una apariencia clara u oscura es una cuestión estética para la mayoría de los usuarios, y puede no estar relacionada con las condiciones de iluminación ambiental".*

{% Aside 'note' %} Obtenga más información sobre [la investigación de usuarios sobre por qué las personas quieren el modo oscuro y cómo lo usan](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d) . {% endAside %}

<figure data-float="right">{% Img src="image/admin/WZ9I5g1YGG6S1TjygEIq.png", alt="CloseView en Mac OS System 7 con modo 'Blanco sobre Negro'", width="193", height="225" %} <figcaption>Sistema 7 CloseView (<a href="https://archive.org/details/mac_Macintosh_System_7_at_your_Fingertips_1992">Fuente</a>)</figcaption></figure>

#### El modo oscuro como herramienta de accesibilidad

También hay personas que realmente *necesitan* el modo oscuro y lo utilizan como otra herramienta de accesibilidad, por ejemplo, los usuarios con problemas de visión. La primera vez que encontré una herramienta de accesibilidad de este tipo fue la función *CloseView* de [System 7](https://en.wikipedia.org/wiki/System_7), que tenía una opción para *Negro sobre blanco* y *Blanco sobre negro*. Aunque System 7 era compatible con el color, la interfaz de usuario predeterminada aún era en blanco y negro.

Estas implementaciones basadas en la inversión demostraron sus deficiencias una vez que se introdujo el color. La investigación realizada por Szpiro *et al.* sobre [cómo acceden las personas con problemas de visión a los dispositivos de cómputo](https://dl.acm.org/citation.cfm?id=2982168) mostró que a todos los usuarios entrevistados no les gustaban las imágenes invertidas, pero que muchos preferían el texto claro sobre un fondo oscuro. Apple tiene en cuenta esta preferencia de los usuarios con una función llamada [Inversión inteligente](https://www.apple.com//accessibility/iphone/vision/), que invierte los colores de la pantalla, excepto en el caso de las imágenes, las redes sociales y algunas aplicaciones que utilizan estilos de color oscuro.

Una forma especial de visión deficiente es el Síndrome visual por computadora, también conocido como Tensión ocular digital, que se [define](https://onlinelibrary.wiley.com/doi/full/10.1111/j.1475-1313.2011.00834.x) como *"la combinación de problemas oculares y visuales asociados al uso de computadoras (incluyendo computadoras de escritorio, portátiles y tabletas) y otras pantallas electrónicas (por ejemplo, smartphones y dispositivos electrónicos de lectura)"*. Se ha [propuesto](https://bmjopen.bmj.com/content/5/1/e006748) que el uso de dispositivos electrónicos por parte de los adolescentes, especialmente por la noche, incrementa el riesgo de que la duración del sueño sea menor, la latencia de inicio del sueño sea mayor y la deficiencia de sueño sea mayor. Además, se tiene conocimiento de que la exposición a la luz azul está implicada en la regulación del ritmo circadiano y del ciclo del sueño, y que los entornos con luz irregular pueden conducir a la privación del sueño, lo que puede afectar al estado de ánimo y al rendimiento en las tareas, según una investigación de Rosenfield. Para limitar estos efectos negativos, reducir la luz azul ajustando la temperatura de color de la pantalla mediante funciones como [Night Shift](https://support.apple.com/HT207570) de iOS o [Luz nocturna](https://support.google.com/pixelphone/answer/7169926?) de Android puede ayudar, así como evitar las luces brillantes o irregulares en general mediante temas o modos oscuros.

#### Ahorro de energía en el modo oscuro de las pantallas AMOLED

Finalmente, se sabe que el modo oscuro ahorra *mucha* energía en las pantallas <abbr title="Diodo emisor de luz orgánico de matriz activa">AMOLED.</abbr> Los estudios de casos de Android que se centraron en aplicaciones populares de Google como YouTube han demostrado que el ahorro de energía puede ser de hasta un 60%. El video a continuación tiene más detalles sobre estos estudios de caso y el ahorro de energía por aplicación.

<figure data-size="full">{% YouTube id='N_6sPd0Jd3g', startTime='305' %}</figure>

## Activación del modo oscuro en el sistema operativo

Ahora que se han explicado los antecedentes de por qué el modo oscuro es tan importante para muchos usuarios, vamos a repasar cómo se puede hacer uso de él.

<figure data-float="left">{% Img src="image/admin/Yh6SEoWDK1SbqcGjlL6d.png", alt="Configuración del modo oscuro de Android Q", width="218", height="250" %}<figcaption> Configuración del tema oscuro de Android Q</figcaption></figure>

Los sistemas operativos que son compatibles con el modo oscuro o el tema oscuro suelen tener una opción para activarlo en algún lugar de la configuración. En macOS X, está en la sección *General* de las preferencias del sistema y se llama *Apariencia* (<a href="{{ 'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lUAnDhiGiZxigDbCqfn1.png' | imgix }}">captura de pantalla</a>), y en Windows 10, está en la sección *Colores* y se llama *Elige tu color* (<a href="{{ 'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ahr8nkFttRPCe4RH8IEk.png' | imgix }}">captura de pantalla</a>). En el caso de Android Q, se encuentra en *Pantalla* como interruptor de palanca *Tema oscuro* (<a href="{{ 'image/admin/Yh6SEoWDK1SbqcGjlL6d.png' | imgix }}">captura de pantalla</a>), y en iOS 13, se puede cambiar la *Apariencia* en la sección *Pantalla y brillo* de la configuración (<a href="{{ 'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K0QTu4Elw1ETabtoJjZ1.jpg' | imgix }}">captura de pantalla</a>).

## La consulta de medios de `prefers-color-scheme`

Un último fragmento de la teoría antes de continuar. [Las consultas multimedia](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries) permiten a los autores probar y consultar valores o características como el agente de usuario o el dispositivo de visualización, independientemente del documento que se muestra. Se utilizan en la regla CSS `@media` para aplicar de forma condicional estilos a un documento, y en otros contextos y lenguajes, como HTML y JavaScript. [Consultas de medios Nivel 5](https://drafts.csswg.org/mediaqueries-5/) introduce las denominadas características multimedia de preferencia del usuario, es decir, una forma en que los sitios detectan la forma preferida por el usuario para mostrar el contenido.

{% Aside 'note' %} ☝️ Una característica de los medios de preferencia de los usuarios es `prefers-reduced-motion`, lo que le permite detectar el deseo de menos movimiento en una página. <a href="https://developers.google.com/web/updates/2019/03/prefers-reduced-motion" data-md-type="link">Escribí sobre `prefers-reduced-motion`</a> anteriormente. {% endAside %}

La función multimedia [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme) se utiliza para detectar si el usuario solicitó que la página utilice un tema de color claro u oscuro. Funciona con los siguientes valores:

- `light`: Indica que el usuario notificó al sistema que prefiere una página con un tema claro (texto oscuro sobre fondo claro).
- `dark`: Indica que el usuario notificó al sistema que prefiere una página con un tema oscuro (texto claro sobre fondo oscuro).

{% Aside 'note' %} Una versión previa de la especificación incluía un tercer valor, `no-preference`. Su objetivo era indicar que el usuario no había manifestado ninguna preferencia en el sistema. Dado que ningún navegador lo implementó, el valor fue [eliminado](https://github.com/w3c/csswg-drafts/issues/3857#issuecomment-634779976) de la especificación. {% endAside%}

## Compatibilidad con el modo oscuro

### Cómo saber si el navegador es compatible con el modo oscuro

Dado que el modo oscuro se reporta por medio de una consulta de medios, se puede verificar fácilmente si el navegador actual es compatible con el modo oscuro al verificar si la consulta de medios `prefers-color-scheme` coincide en absoluto. Observe que no incluyo ningún valor, sino que simplemente verifico si la consulta de medios coincide.

```js
if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  console.log('🎉 Dark mode is supported');
}
```

Cuando se redactó este documento, `prefers-color-scheme` era compatible, tanto en el escritorio como en el dispositivo móvil (cuando estaba disponible), con Chrome y Edge a partir de la versión 76, con Firefox a partir de la versión 67 y con Safari a partir de la versión 12.1 en macOS y de la versión 13 en iOS. Para el resto de navegadores, puede consultar las [tablas de compatibilidad Puedo usar](https://caniuse.com/#feat=prefers-color-scheme).

{% Aside 'note' %} Hay un elemento personalizado [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) disponible que agrega compatibilidad con el modo oscuro a los navegadores más antiguos. Escribí sobre ello [más abajo en este artículo](#the-lessdark-mode-togglegreater-custom-element). {% endAside%}

### Conocer las preferencias del usuario durante la solicitud

El encabezado del cliente hint [`Sec-CH-Prefers-Color-Scheme`](/user-preference-media-features-headers/) permite que los sitios obtengan las preferencias de combinación de colores del usuario de forma opcional en el momento de la solicitud, lo que permite a los servidores estar en los estilos integrados en el código correctos de CSS y, por lo tanto, evitar un efecto flash sobre un tema de color incorrecto.

### Modo oscuro en la práctica

Finalmente veamos cómo se ve en la práctica la compatibilidad con el modo oscuro. Al igual que con el [Highlander](https://en.wikipedia.org/wiki/Highlander_(film)), en el modo oscuro *solo puede haber uno*: oscuro o claro, ¡pero nunca ambos! ¿Por qué menciono esto? Porque este hecho debe tener un impacto en la estrategia de carga. **No obligue a los usuarios a descargar el CSS en la ruta de renderización crítica que es para un modo que no utilizan actualmente.** Para optimizar la velocidad de carga, dividí mi CSS para la aplicación de ejemplo que muestra las siguientes recomendaciones prácticas en tres partes para [deferir el CSS no crítico](/defer-non-critical-css/):

- `style.css` que contiene reglas genéricas que se utilizan de forma universal en el sitio.
- `dark.css` que contiene solo las reglas necesarias para utilizar el modo oscuro.
- `light.css` que contiene solo las reglas necesarias para utilizar el modo ligero.

### Estrategia de carga

Los dos últimos, `light.css` y `dark.css`, se cargan condicionalmente con una consulta `<link media>`. Inicialmente, [no todos los navegadores son compatibles con `prefers-color-scheme`](https://caniuse.com/#feat=prefers-color-scheme) (que se puede detectar usando el patrón [anterior](#finding-out-if-dark-mode-is-supported-by-the-browser)), lo que resuelvo de forma dinámica al cargar el archivo `light.css` de forma predeterminada mediante un elemento `<link rel="stylesheet">` insertado de forma condicional en un script de estilos integrados en el código minúsculo (light es una elección arbitraria, también podría haber configurado dark como experiencia predeterminada). Para evitar un [flash de contenido sin estilo](https://en.wikipedia.org/wiki/Flash_of_unstyled_content), oculté el contenido de la página hasta que `light.css` se cargó.

```html
<script>
  // If `prefers-color-scheme` is not supported, fall back to light mode.
  // In this case, light.css will be downloaded with `highest` priority.
  if (window.matchMedia('(prefers-color-scheme: dark)').media === 'not all') {
    document.documentElement.style.display = 'none';
    document.head.insertAdjacentHTML(
      'beforeend',
      '<link rel="stylesheet" href="/light.css" onload="document.documentElement.style.display = \'\'">',
    );
  }
</script>
<!--
  Conditionally either load the light or the dark stylesheet. The matching file
  will be downloaded with `highest`, the non-matching file with `lowest`
  priority. If the browser doesn't support `prefers-color-scheme`, the media
  query is unknown and the files are downloaded with `lowest` priority (but
  above I already force `highest` priority for my default light experience).
-->
<link rel="stylesheet" href="/dark.css" media="(prefers-color-scheme: dark)" />
<link
  rel="stylesheet"
  href="/light.css"
  media="(prefers-color-scheme: light)"
/>
<!-- The main stylesheet -->
<link rel="stylesheet" href="/style.css" />
```

### Arquitectura de la hoja de estilo

Utilizo al máximo las [variables de CSS](https://developer.mozilla.org/docs/Web/CSS/var), esto permite que mi `style.css` genérico  sea, bueno, genérico, y que toda la personalización del modo claro u oscuro ocurra en los otros dos archivos `dark.css` y `light.css`. A continuación puede ver un fragmento de los estilos reales, pero debería ser suficiente para transmitir la idea general. Declaro dos variables, `--color` y {`-⁠-⁠background-color` que esencialmente crean un tema de línea de base *oscuro sobre claro* y *claro sobre oscuro*.

```css
/* light.css: 👉 dark-on-light */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
}
```

```css
/* dark.css: 👉 light-on-dark */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
}
```

En mi `style.css`, utilizo estas variables en la regla `body { ... }`. Como están definidas en la pseudoclase [`:root` de CSS](https://developer.mozilla.org/docs/Web/CSS/:root), un selector que en HTML representa el elemento `<html>`, que es idéntico al selector `html`, excepto que su especificidad sea mayor, se convierten en una cascada, lo que me permite declarar variables CSS globales.

```css
/* style.css */
:root {
  color-scheme: light dark;
}

body {
  color: var(--color);
  background-color: var(--background-color);
}
```

En el ejemplo del código anterior, probablemente notó una propiedad [`color-scheme`](https://drafts.csswg.org/css-color-adjust-1/#propdef-color-scheme) con el valor separado por espacios `light dark`.

Esto le indica al navegador cuáles son los temas de color que admite mi aplicación y le permite activar variantes especiales de la hoja de estilos del agente de usuario, lo cual es útil para, por ejemplo, permitir que el navegador represente los campos del formulario con un fondo oscuro y un texto claro, para ajustar las barras de desplazamiento o habilitar un color de resaltado que tenga en cuenta el tema. Los detalles exactos de `color-scheme` se especifican en [Módulo de ajuste cromático de CSS en el nivel 1](https://drafts.csswg.org/css-color-adjust-1/).

{% Aside 'note' %} 🌒 Obtenga más información sobre [lo que realmente hace el `color-scheme`](/color-scheme/) . {% endAside %}

Todo lo demás es solo una cuestión de definir variables CSS para las cosas que importan en mi sitio. La organización semántica de estilos ayuda mucho cuando se trabaja con el modo oscuro. Por ejemplo, en lugar de `-⁠-⁠highlight-yellow` , considere llamar a la variable `-⁠-⁠accent-color` , ya que "amarillo" puede no ser amarillo en el modo oscuro o viceversa. A continuación se muestra un ejemplo de algunas variables más que utilizo en mi ejemplo.

```css
/* dark.css */
:root {
  --color: rgb(250, 250, 250);
  --background-color: rgb(5, 5, 5);
  --link-color: rgb(0, 188, 212);
  --main-headline-color: rgb(233, 30, 99);
  --accent-background-color: rgb(0, 188, 212);
  --accent-color: rgb(5, 5, 5);
}
```

```css
/* light.css */
:root {
  --color: rgb(5, 5, 5);
  --background-color: rgb(250, 250, 250);
  --link-color: rgb(0, 0, 238);
  --main-headline-color: rgb(0, 0, 192);
  --accent-background-color: rgb(0, 0, 238);
  --accent-color: rgb(250, 250, 250);
}
```

### Ejemplo completo

En el siguiente [Glitch](https://dark-mode-baseline.glitch.me/) incrustado, podrá ver el ejemplo completo con el que se ponen en práctica los conceptos anteriores. Pruebe a activar el modo oscuro en la [configuración de su sistema operativo](#activating-dark-mode-in-the-operating-system) y vea cómo reacciona la página.

<div style="height: 900px; width: 100%;">{% IFrame { allow: 'geolocation; microphone; camera; midi; vr; encrypted-media', src: 'https://glitch.com/embed/#!/embed/dark-mode-baseline?path=style.css&amp;previewSize=100&amp;attributionHidden=true' } %}</div>

### Impacto de la carga

Cuando juegue con este ejemplo, podrá ver por qué cargo mi `dark.css` y `light.css` por medio de consultas de medios. Intente activar el modo oscuro y vuelva a cargar la página: las hojas de estilo concretas que no coincidan en ese momento se seguirán cargando, pero con la prioridad más baja, para que nunca compitan con los recursos que necesita el sitio en ese momento.

{% Aside 'note' %} 😲 Obtenga más información sobre [por qué los navegadores descargan hojas de estilo con consultas de medios que no coinciden](https://blog.tomayac.com/2018/11/08/why-browsers-download-stylesheets-with-non-matching-media-queries-180513) . {% endAside %}

<figure>{% Img src="image/admin/flTdLliru6GmqqlOKjNx.png", alt="Diagrama de carga de red que muestra cómo en el modo claro el CSS del modo oscuro se carga con la prioridad más baja", width="800", height="417" %}<figcaption> El sitio en modo claro carga el CSS en modo oscuro con la prioridad más baja.</figcaption></figure>

<figure>{% Img src="image/admin/IDs6Le0VBhHu9QEDdxL6.png", alt="Diagrama de carga de red que muestra cómo en el modo oscuro el CSS del modo claro se carga con la prioridad más baja", width="800", height="417" %}<figcaption> El sitio en modo oscuro carga el CSS en modo claro con la prioridad más baja.</figcaption></figure>

<figure>{% Img src="image/admin/zJqu5k3TIgcZf1OHWWIq.png", alt="Diagrama de carga de red que muestra cómo en el modo claro predeterminado el CSS del modo oscuro se carga con la prioridad más baja", width="800", height="417" %}<figcaption> El sitio con el modo claro predeterminado en un navegador que no admite <code>prefers-color-scheme</code> carga el CSS en modo oscuro con la prioridad más baja.</figcaption></figure>

### Cómo reaccionar ante los cambios en el modo oscuro

Como cualquier otro cambio de consulta de medios, los cambios de modo oscuro se pueden suscribir a través de JavaScript. Puede usar esto para, por ejemplo, cambiar dinámicamente el [favicon](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#provide_great_icons_tiles) de una página o cambiar el [`<meta name="theme-color">`](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/#meta_theme_color_for_chrome_and_opera) que determina el color de la barra de URL en Chrome. El [ejemplo completo de](#full-example) arriba muestra esto en acción, para ver el color del tema y los cambios de favicon, abra la [demostración en una pestaña separada](https://dark-mode-baseline.glitch.me/) .

```js
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addListener((e) => {
    const darkModeOn = e.matches;
    console.log(`Dark mode is ${darkModeOn ? '🌒 on' : '☀️ off'}.`);
  });
```

A partir de Chromium 93 y Safari 15, puede ajustar este color basándose en una consulta de medios con el atributo `media` del elemento con el color del tema `meta`. Se elegirá el primero que coincida. Por ejemplo, puede tener un color para el modo claro y otro para el modo oscuro. Al momento de escribir esto, no se pueden definir en el manifiesto. Consulte [w3c/manifest#975 GitHub issue](https://github.com/w3c/manifest/issues/975).

```html
<meta
  name="theme-color"
  media="(prefers-color-scheme: light)"
  content="white"
/>
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

## Cómo depurar y probar el modo oscuro

### La emulación de `prefers-color-scheme` en DevTools

Cambiar el esquema de colores de todo el sistema operativo puede ser molesto muy rápidamente, por lo que Chrome DevTools ahora le permite emular el esquema de colores preferido por el usuario de una manera que solo afecta a la pestaña que se encuentra visible en ese momento. Abra el [Menú Comandos](https://developer.chrome.com/docs/devtools/command-menu/), comience a escribir `Rendering`, ejecute el comando `Show Rendering` y, a continuación, cambie la opción prefers-color-scheme correspondiente a la función de medios CSS.

<figure>{% Img src="image/admin/RIq2z6Ja1zSzfNTHic5z.png", alt="Una captura de pantalla de la opción 'La función de emulación de medios CSS favorece el esquema de color' que se encuentra en la pestaña Renderización de Chrome DevTools", width="800", height="552" %}</figure>

### Cómo hacer capturas de pantalla mediante `prefers-color-scheme` con Puppeteer

[Puppeteer](https://github.com/GoogleChrome/puppeteer/) es una librería de Node.js que proporciona una API de alto nivel para controlar Chrome o Chromium a través del [Protocolo de DevTools](https://chromedevtools.github.io/devtools-protocol/). Con [`dark-mode-screenshot`](https://www.npmjs.com/package/dark-mode-screenshot), ofrecemos un script de Puppeteer que le permite crear capturas de pantalla de sus páginas tanto en modo oscuro como claro. Puede ejecutar este script de forma aislada, o hacer que forme parte de su suite para pruebas de integración continua (CI).

```bash
npx dark-mode-screenshot --url https://googlechromelabs.github.io/dark-mode-toggle/demo/ --output screenshot --fullPage --pause 750
```

## Prácticas recomendadas del modo oscuro

### Evite el blanco puro

Un pequeño detalle que tal vez haya notado es que yo no utilizo un blanco puro. En vez de eso, para evitar el brillo y la depuración contra el contenido oscuro adyacente, elijo un blanco ligeramente más oscuro. Algo como `rgb(250, 250, 250)` funcionará bien.

### Cómo volver a colorear y oscurecer imágenes fotográficas

Si compara las dos capturas de pantalla que aparecen a continuación, se darán cuenta de que no solo el tema principal cambió del modo *oscuro sobre claro* a *claro sobre oscura*, sino que también la imagen hero tiene un aspecto un poco diferente. Mi <em>investigación de usuarios</em> mostró que la mayoría de los encuestados prefieren imágenes ligeramente menos vibrantes y brillantes cuando el modo oscuro está activo. Me refiero a esto como *recolorización*.

<div class="switcher">
  <figure>{% Img src="image/admin/qzzYCKNSwoJr9BBEQlR7.png", alt="Imagen hero ligeramente oscura en modo oscuro.", width="800", height="618" %} <figcaption> Imagen hero ligeramente oscura en modo oscuro. </figcaption></figure>
  <figure>{% Img src="image/admin/41RbLRZ5wzkoVnIRJkNl.png", alt="Imagen hero normal en modo claro.", width="800", height="618" %} <figcaption> Imagen hero normal en modo claro. </figcaption></figure>
</div>

La recolorización puede lograrse mediante un filtro de CSS en mis imágenes. Utilizo un selector de CSS que coincide con todas las imágenes que no tienen `.svg` en su URL, la idea es que puedo dar a los gráficos vectoriales (iconos) un tratamiento de recolorización diferente al de mis imágenes (fotos), puede obtener más información sobre esto en el [siguiente párrafo](#vector-graphics-and-icons). Observe cómo vuelvo a utilizar una [variable de CSS](https://developer.mozilla.org/docs/Web/CSS/var), para poder cambiar posteriormente mi filtro de forma flexible.

{% Aside 'note' %} 🎨 Obtenga más información sobre [la investigación de los usuarios sobre las preferencias de recolorización con el modo oscuro](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b). {% endAside %}

Dado que la recolorización solo se necesita en modo oscuro, es decir, cuando `dark.css` está activo, no hay reglas equivalentes en `light.css`.

```css
/* dark.css */
--image-filter: grayscale(50%);

img:not([src*=".svg"]) {
  filter: var(--image-filter);
}
```

#### Personalización de las intensidades de recolorización en modo oscuro con JavaScript

No todos somos iguales y la gente tiene diferentes necesidades en el modo oscuro. Al seguir el método de recolorización descrito anteriormente, puedo convertir fácilmente la intensidad de la escala de grises a una preferencia del usuario que puedo [cambiar mediante JavaScript](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties#Values_in_JavaScript), y al establecer un valor de `0%`, también puedo desactivar la recolorización por completo. Tenga en cuenta que [`document.documentElement`](https://developer.mozilla.org/docs/Web/API/Document/documentElement) proporciona una referencia al elemento raíz del documento, es decir, el mismo elemento que puedo hacer referencia con la [pseudoclase de CSS `:root`](https://developer.mozilla.org/docs/Web/CSS/:root).

```js
const filter = 'grayscale(70%)';
document.documentElement.style.setProperty('--image-filter', value);
```

### Invertir iconos y gráficos vectoriales

Para los gráficos vectoriales, que en mi caso se utilizan como iconos a los que hago referencia por medio de elementos `<img>`, utilizo un método de recolorización diferente. Aunque la [investigación](https://dl.acm.org/citation.cfm?id=2982168) demostró que a la gente no le gusta la inversión de las fotos, funciona muy bien para la mayoría de los iconos. De nuevo, utilizo variables de CSS para determinar la cantidad de inversión en el estado normal y en el [`:hover`](https://developer.mozilla.org/docs/Web/CSS/:hover).

<div class="switcher">
  <figure>{% Img src="image/admin/JGYFpAPi4233HrEKTQZp.png", alt="Los iconos se invierten en el modo oscuro.", width="744", height="48" %} <figcaption> Los iconos se invierten en el modo oscuro. </figcaption></figure>
  <figure>{% Img src="image/admin/W8AWbuqWthI6CfFsYunk.png", alt="Iconos normales en modo claro.", width="744", height="48" %} <figcaption> Iconos normales en modo claro. </figcaption></figure>
</div>

Observe cómo, de nuevo, solo invierto los iconos en `dark.css` pero no en `light.css`, y cómo `:hover` adopta una intensidad de inversión diferente en los dos casos para que el icono aparezca ligeramente más oscuro o ligeramente más brillante, dependiendo del modo que el usuario haya seleccionado.

```css
/* dark.css */
--icon-filter: invert(100%);
--icon-filter_hover: invert(40%);

img[src*=".svg"] {
  filter: var(--icon-filter);
}
```

```css
/* light.css */
--icon-filter_hover: invert(60%);
```

```css
/* style.css */
img[src*=".svg"]:hover {
  filter: var(--icon-filter_hover);
}
```

### Utilice `currentColor` para los estilos integrados en el código de SVG

Para los *estilos integrados en el código* de las imágenes SVG, en vez de [utilizar filtros de inversión](#invert-vector-graphics-and-icons), puede aprovechar la palabra clave de CSS [`currentColor`](https://developer.mozilla.org/docs/Web/CSS/color_value#currentColor_keyword) que representa el valor de la propiedad `color` de un elemento. Esto permite utilizar el valor `color` en propiedades que no lo incluyen de forma predeterminada. De forma práctica, si `currentColor` se utiliza como valor de los atributos SVG [`fill` o `stroke`](https://developer.mozilla.org/docs/Web/SVG/Tutorial/Fills_and_Strokes#Fill_and_Stroke_Attributes), toma su valor del valor heredado de la propiedad color. Aún mejor: esto también funciona para [`<svg><use href="..."></svg>`](https://developer.mozilla.org/docs/Web/SVG/Element/use), por lo que puede tener recursos separados y `currentColor` seguirá aplicándose en el contexto. Tenga en cuenta que esto solo funciona para los *estilos integrados en el código* o `<use href="...">` de los SVG, pero no es que los SVG a los que se hace referencia como el `src` de una imagen o de alguna manera por medio de CSS. Usted puede ver que esto se aplica en la demostración de abajo.

```html/2
<!-- Some inline SVG -->
<svg xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
>
  […]
</svg>
```

<div style="height: 950px; width: 100%;">{% IFrame { allow: 'geolocation; microphone; camera; midi; vr; encrypted-media', src: 'https://glitch.com/embed/#!/embed/dark-mode-currentcolor?path=light.css&amp;previewSize=100', title: 'dark-mode-currentcolor on Glitch' } %}</div>

### Transiciones sencillas entre modos

El cambio de modo oscuro a modo claro o viceversa puede facilitarse gracias a que tanto `color` como `background-color` son [propiedades de CSS que se pueden animar](https://www.quackit.com/css/css3/animations/animatable_properties/). Para crear la animación es tan fácil como declarar dos `transition` para las dos propiedades. En el siguiente ejemplo se ilustra la idea general, puede experimentarla en vivo en la [demostración](https://dark-mode-baseline.glitch.me/).

```css
body {
  --duration: 0.5s;
   --timing: ease;

  color: var(--color);
  background-color: var(--background-color);

  transition:
    color var(--duration) var(--timing),
    background-color var(--duration) var(--timing);
}
```

### Dirección de las obras de arte con el modo oscuro

Aunque por razones del rendimiento de la carga en general le recomiendo trabajar exclusivamente con `prefers-color-scheme` en el atributo `media` de los elementos `<link>` (en vez de en los estilos integrados en el código de las hojas de estilo), hay situaciones en las que puede querer trabajar con `prefers-color-scheme` directamente en los estilos integrados en el código HTML. La dirección de arte es una de esas situaciones. En la web, la dirección artística se ocupa de la apariencia visual general de una página y de cómo se comunica visualmente, estimula los estados de ánimo, contrasta las características y atrae psicológicamente a un público objetivo.

Con el modo oscuro, depende del criterio del diseñador decidir cuál es la mejor imagen en un modo concreto y si la [recolorización de las imágenes](#photographic-images) tal vez *no* sea lo suficientemente buena. Si se utiliza con el elemento `<picture>`, el `<source>` de la imagen que se mostrará puede depender del atributo `media`. En el siguiente ejemplo, muestro el hemisferio occidental para el modo oscuro, y el hemisferio oriental para el modo claro o cuando no se indica ninguna preferencia, seleccionando de forma predeterminada el hemisferio oriental en todos los demás casos. Esto es, por supuesto, puramente ilustrativo. Active el modo oscuro en su dispositivo para ver la diferencia.

```html
<picture>
  <source srcset="western.webp" media="(prefers-color-scheme: dark)">
  <source srcset="eastern.webp" media="(prefers-color-scheme: light)">
  <img src="eastern.webp">
</picture>
```

<div style="height: 600px; width: 100%;">{% IFrame { allow: 'geolocation; microphone; camera; midi; vr; encrypted-media', src: 'https://glitch.com/embed/#!/embed/dark-mode-picture?path=index.html&amp;previewSize=100', title: 'dark-mode-picture on Glitch' } %}</div>

### Modo oscuro, pero agregue una opción de exclusión

Como se mencionó en la sección [por qué el modo oscuro](#why-dark-mode), el modo oscuro es una opción estética para la mayoría de los usuarios. Por lo tanto, a algunos usuarios les puede gustar tener la interfaz de usuario de su sistema operativo en modo oscuro, pero aún así prefieren ver sus páginas web como están acostumbrados a verlas. Un buen patrón es adherirse inicialmente a la señal que el navegador envía mediante `prefers-color-scheme`, pero después permitir de forma opcional que los usuarios anulen su configuración a nivel de sistema.

#### El elemento personalizado `<dark-mode-toggle>`

Por supuesto, puede crear el código para hacer esto usted mismo, pero también puede utilizar un elemento personalizado previamente hecho (componente web) que creé justo para este propósito. Se llama [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) y agrega un conmutador (modo oscuro: encendido/apagado) o un conmutador de tema (tema: claro/oscuro) a la página que puede personalizar completamente. La demostración que aparece a continuación muestra el elemento en acción (oh, y también le 🤫 eché un vistazo silenciosamente en todos los [otros](https://dark-mode-baseline.glitch.me/) [ejemplos](https://dark-mode-currentcolor.glitch.me/) [anteriores](https://dark-mode-picture.glitch.me/)).

```html
<dark-mode-toggle
    legend="Theme Switcher"
    appearance="switch"
    dark="Dark"
    light="Light"
    remember="Remember this"
></dark-mode-toggle>
```

<div class="switcher">
  <figure>{% Img src="image/admin/Xy3uus69HnrkRPO4EuRu.png", alt="{dark-mode-toggle0} en modo claro.", width="140", height="76" %} <figcaption> <code>&lt;dark-mode-toggle&gt;</code> en modo claro. </figcaption> {/dark-mode-toggle0}</figure>
  <figure>{% Img src="image/admin/glRVRJpQ9hMip6MbqY9N.png", alt="{dark-mode-toggle0} en modo claro.", width="140", height="76" %} <figcaption> <code>&lt;dark-mode-toggle&gt;</code> en modo oscuro. </figcaption> {/dark-mode-toggle0}</figure>
</div>

Intente hacer clic o pulsar los controles del modo oscuro en la esquina superior derecha que aparece en la demostración que está más abajo. Si selecciona la casilla del tercer y cuarto control, verá cómo su selección de modo quedará registrada incluso cuando recargue la página. Esto permite que sus visitantes mantengan su sistema operativo en modo oscuro, pero disfruten de su sitio en modo claro o viceversa.

<div style="height: 800px; width: 100%;">{% IFrame { allow: 'geolocation; microphone; camera; midi; vr; encrypted-media', src: 'https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html' } %}</div>

## Conclusiones

Trabajar con el modo oscuro y darle soporte es divertido y abre nuevas posibilidades de diseño. Para algunos de sus visitantes puede ser la diferencia entre no poder manejar su sitio y ser un usuario feliz. Hay algunos obstáculos y es necesario hacer pruebas cuidadosas, pero el modo oscuro definitivamente es una gran oportunidad para demostrar que se preocupa por todos sus usuarios. Las prácticas recomendadas que se mencionan en esta publicación y los helpers como el elemento personalizado [`<dark-mode-toggle>`](https://github.com/GoogleChromeLabs/dark-mode-toggle) deberían hacer que confíe en su capacidad para crear una experiencia increíble en modo oscuro. [Cuéntelo en Twitter](https://twitter.com/tomayac) lo que crea y si esta publicación le ha sido útil o si también tiene sugerencias para mejorarla. ¡Gracias por leer! 🌒

## Enlaces relacionados

Recursos para la consulta de medios de `prefers-color-scheme`

- [Página del estado de la plataforma Chrome](https://chromestatus.com/feature/5109758977638400)
- [Error en Chromium](https://crbug.com/889087)
- [Especificaciones del nivel 5 en las Consultas de medios](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme)

Recursos para la `color-scheme` y la propiedad CSS:

- [La propiedad de CSS `color-scheme` y la etiqueta meta](/color-scheme/)
- [Página del estado de la plataforma Chrome](https://chromestatus.com/feature/5330651267989504)
- [Error en Chromium](http://crbug.com/925935)
- [Especificación en el módulo de ajuste sobre el color de CSS de Nivel 1](https://drafts.csswg.org/css-color-adjust-1/)
- [El problema de GitHub de CSS WG para la etiqueta meta y la propiedad de CSS](https://github.com/w3c/csswg-drafts/issues/3299)
- [El problema de GitHub del WHATWG HTML para la etiqueta meta](https://github.com/whatwg/html/issues/4504)

Enlaces generales del modo oscuro:

- [Diseño de materiales: tema oscuro](https://material.io/design/color/dark-theme.html)
- [Modo oscuro en el Inspector web](https://webkit.org/blog/8892/dark-mode-in-web-inspector/)
- [Compatibilidad con el modo oscuro en WebKit](https://webkit.org/blog/8840/dark-mode-support-in-webkit/)
- [Normas de la Interfaz Humana para Apple: Modo oscuro](https://developer.apple.com/design/human-interface-guidelines/macos/visual-design/dark-mode/)

Artículos de investigación de antecedentes para esta publicación:

- [¿Qué hace en realidad el "esquema de colores compatible" con el modo oscuro? 🤔](https://medium.com/dev-channel/what-does-dark-modes-supported-color-schemes-actually-do-69c2eacdfa1d)
- [¡Deja que haya oscuridad! 🌚 Tal vez…](https://medium.com/dev-channel/let-there-be-darkness-maybe-9facd9c3023d)
- [Recolorización para el modo oscuro](https://medium.com/dev-channel/re-colorization-for-dark-mode-19e2e17b584b)

## Agradecimientos

La función multimedia `prefers-color-scheme`, la propiedad de CSS `color-scheme` y la etiqueta meta relacionada son el trabajo de implementación de 👏 [Rune Lillesveen](https://twitter.com/runeli). Rune también es coeditor de la especificación [Módulo de ajuste en el color de CSS de Nivel 1](https://drafts.csswg.org/css-color-adjust-1/). Me gustaría dar las gracias a [Lukasz Zbylut](https://www.linkedin.com/in/lukasz-zbylut/), [Rowan Merewood](https://twitter.com/rowan_m), [Chirag Desai](https://www.linkedin.com/in/chiragd/), y [Rob Dodson](https://twitter.com/rob_dodson) por sus exhaustivas revisiones de este artículo. La [estrategia de carga](#loading-strategy) es obra de [Jake Archibald](https://twitter.com/jaffathecake). [Emilio Cobos Álvarez](https://twitter.com/ecbos_) me orientó hacia el método correcto de detección `prefers-color-scheme`. El consejo con los SVG de referencia y `currentColor` provino de [Timothy Hatcher](https://twitter.com/xeenon). Por último, agradezco a los numerosos participantes anónimos de los diversos estudios de usuarios que han ayudado a dar forma a las recomendaciones de este artículo. Imagen hero hecha por [Nathan Anderson](https://unsplash.com/photos/kujXUuh1X0o).
