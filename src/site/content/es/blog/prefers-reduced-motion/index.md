---
layout: post
title: 'prefers-reduced-motion: A veces, menos (movimiento) es más'
subhead: La consulta de medios prefers-reduced-motion (preferencia de movimiento reducido) detecta si el usuario ha solicitado al sistema operativo para minimizar la cantidad de animaciones o movimientos que utiliza.
authors:
  - thomassteiner
description: "La consulta de medios prefers-reduced-motion (preferencia de movimiento reducido) detecta si el usuario ha solicitado que el sistema minimice la cantidad de animaciones o movimientos que utiliza. Esto es para usuarios que requieren o prefieren animaciones minimizadas; por ejemplo, las personas con trastornos vestibulares a menudo desean que las animaciones sean reducidas al mínimo."
date: 2019-03-11
updated: 2019-12-10
tags:
  - blog
  - media-queries
  - css
hero: image/admin/LI2vYKZwQ98w3MLtUF8V.jpg
alt: Tiempo transcurrido de una mujer en un tren
feedback:
  - api
---

No todo el mundo disfruta las animaciones decorativas o las transiciones, y algunos usuarios incluso experimentan mareos cuando se encuentran con el desplazamiento de paralaje, los efectos de zoom, etc. Chrome 74 admite la consulta de medios `prefers-reduced-motion` que le permite diseñar una variante de su sitio con movimiento reducido para los usuarios que han optado por esta preferencia.

## Demasiado movimiento en la vida real y en la web

El otro día, estaba patinando sobre hielo con mis hijos. Era un día hermoso, el sol brillaba y la pista de hielo estaba abarrotada de gente ⛸. El único problema con eso: no me doy muy bien con las multitudes. Con tantos objetos en movimiento, no logro concentrarme en nada, y termino perdido y con una sensación de sobrecarga visual total, casi como mirar fijamente un hormiguero 🐜.

<figure>{% Img src= "image/admin/JA5v1s8gSBk70eJBB8xW.jpg", alt="Un mar de pies de gente patinando sobre hielo", width="580", height="320" %}<figcaption> Sobrecarga visual en la vida real.</figcaption></figure>

Ocasionalmente, puede suceder lo mismo en la web: con anuncios parpadeantes, efectos de paralaje sofisticados, animaciones reveladoras sorprendentes, videos de reproducción automática, etc., *la web a veces puede ser bastante abrumadora*… Afortunadamente, a diferencia de la vida real, hay una solución para eso. La consulta de medios CSS, `prefers-reduced-motion` permite a los desarrolladores crear una variante de una página para los usuarios que, básicamente, prefieren que el movimiento sea reducido. Esto puede abarcar cualquier cosa, desde abstenerse de reproducir videos automáticamente hasta deshabilitar ciertos efectos puramente decorativos, hasta rediseñar completamente una página para ciertos usuarios.

Antes de detallar la función a fondo, demos un paso atrás y pensemos para qué se utilizan las animaciones en la web. Si lo desea, también puede omitir la información general y [pasar directamente a los detalles técnicos](#working-with-the-media-query) a continuación.

## Animación en la web

La animación se utiliza a menudo para proporcionar *retroalimentación* al usuario, por ejemplo, para hacerle saber que se recibió una acción y se está procesando. Por ejemplo, en un sitio web de compras, se podría animar un producto para que "vuele" en un carrito de compras virtual, representado como un icono en la esquina superior derecha del sitio.

Otro caso de uso implica el uso del movimiento para [hackear la percepción del usuario](https://medium.com/dev-channel/hacking-user-perception-to-make-your-websites-and-apps-feel-faster-922636b620e3) mediante el uso de una combinación de skeleton screens, metadatos contextuales y vistas previas de imágenes de baja calidad para ocupar una gran parte del tiempo del usuario y hacer que toda la experiencia se *sienta más rápida*. La idea es dar al usuario una noción de lo que se avecina y, mientras tanto, cargar las cosas lo más rápido posible.

Finalmente, existen *efectos decorativos* como degradados animados, desplazamiento de paralaje, videos de fondo y varios otros. Si bien muchos usuarios disfrutan de estas animaciones, a algunos no les gustan porque se sienten distraídos o retrasados por ellas. En el peor de los casos, los usuarios pueden incluso sufrir mareos como si fuera una experiencia de la vida real, por lo que para estos usuarios reducir las animaciones es una *necesidad de salud*.

## Trastorno del espectro vestibular provocado por el movimiento

Algunos usuarios experimentan [distracciones o náuseas debido al contenido animado](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html). Por ejemplo, las animaciones de desplazamiento pueden causar trastornos vestibulares cuando elementos distintos del elemento principal asociado con el desplazamiento se mueven mucho. Por ejemplo, las animaciones de desplazamiento de paralaje pueden causar trastornos vestibulares porque los elementos de fondo se mueven a una velocidad diferente que los elementos de primer plano. Las reacciones del trastorno vestibular (oído interno) incluyen mareos, náuseas y migrañas, y algunas veces requieren reposo en cama para recuperarse.

## Eliminar movimiento en sistemas operativos

Muchos sistemas operativos han tenido configuraciones de accesibilidad para especificar una preferencia por el movimiento reducido durante mucho tiempo. Las capturas de pantalla a continuación muestran la preferencia **Reducir movimiento** de macOS Mojave y la preferencia **Eliminar animaciones** de Android Pie. Cuando están marcadas, estas preferencias hacen que el sistema operativo no use efectos decorativos como las animaciones de inicio de aplicaciones. Las propias aplicaciones pueden y deben respetar esta configuración también y eliminar todas las animaciones innecesarias.

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KwuLNPefeDzUfR17EUtr.png", alt="Una captura de pantalla de la pantalla de configuración de macOS con la casilla de verificación 'Reducir movimiento' marcada.", width="398", height="300" %}</figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qed7yE6FKVQ5YXHn0TbJ.png", alt="Una captura de pantalla de la configuración de Android con la casilla de verificación 'Eliminar animaciones' marcada.", width="287", height="300" %}</figure>
</div>

## Eliminar movimiento en la web

[Media Queries Level 5 también](https://drafts.csswg.org/mediaqueries-5/) lleva la preferencia del usuario de movimiento reducido a la web. Las consultas de medios permiten a los autores probar y consultar valores o características del agente de usuario o dispositivo de visualización independientemente del documento que se está procesando. La consulta de medios [`prefers-reduced-motion`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion) se utiliza para detectar si el usuario ha establecido una preferencia de sistema operativo para minimizar la cantidad de animación o movimiento que utiliza. Puede tomar dos valores posibles:

- `no-preference` : indica que el usuario no ha escogido ninguna preferencia en el sistema operativo subyacente. El valor de esta palabra clave se evalúa como `false` en el contexto booleano.
- `reduce`: indica que el usuario ha establecido una preferencia de sistema operativo que indica que las interfaces deben minimizar el movimiento o la animación, preferiblemente hasta el punto en que se eliminan todos los movimientos no esenciales.

## Trabajando con la consulta de medios

{% Aside %} Consulte [¿Puedo utilizar la consulta de medios de preferencia de movimiento reducido?](https://caniuse.com/#feat=prefers-reduced-motion) para averiguar cuáles navegadores admiten `prefers-reduced-motion`. {% endAside %}

Al igual que con todas las consultas de medios, `prefers-reduced-motion` puede revisarse desde un contexto CSS y desde un contexto JavaScript.

Para ilustrar ambos, digamos que tengo un botón de registro importante en el que quiero que el usuario haga clic. Podría definir una animación de "vibración" que llame la atención, pero como buen ciudadano de internet, solo la reproduciré para aquellos usuarios que estén explícitamente de acuerdo con las animaciones, pero no para los demás, que pueden ser usuarios que hayan optado por no recibir animaciones o usuarios en navegadores que no comprenden la consulta de medios.

```css
/*
  If the user has expressed their preference for
  reduced motion, then don't use animations on buttons.
*/
@media (prefers-reduced-motion: reduce) {
  button {
    animation: none;
  }
}

/*
  If the browser understands the media query and the user
  explicitly hasn't set a preference, then use animations on buttons.
*/
@media (prefers-reduced-motion: no-preference) {
  button {
    /* `vibrate` keyframes are defined elsewhere */
    animation: vibrate 0.3s linear infinite both;
  }
}
```

{% Aside %}
Si tiene una gran cantidad de CSS relacionado con la animación, puede evitar que los usuarios que optaron por no recibir animaciones lo descarguen mediante la transferencia de todo el CSS relacionado con la animación a una hoja de estilo separada que solo carga condicionalmente a través del atributo `media` en el elemento del `link` 😎: `<link rel="stylesheet" href="animations.css" media="(prefers-reduced-motion: no-preference)">`
{% endAside %}

Para ilustrar cómo trabajar con `prefers-reduced-motion` con JavaScript, imaginemos que he definido una animación compleja con la [API de animaciones web](https://developer.mozilla.org/docs/Web/API/Web_Animations_API) (Web Animations API). Si bien el navegador activará dinámicamente las reglas de CSS cuando cambie la preferencia del usuario, para las animaciones de JavaScript tengo que captar los cambios por mi cuenta y luego detener manualmente las animaciones potencialmente en ejecución (o reiniciarlas si el usuario me lo permite):

```js
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', () => {
  console.log(mediaQuery.media, mediaQuery.matches);
  // Stop JavaScript-based animations.
});
```

Tenga en cuenta que los paréntesis alrededor de la consulta de medios real son obligatorios:

{% Compare 'worse' %}

```js
window.matchMedia('prefers-reduced-motion: reduce')
```

{% endCompare %}

{% Compare 'better' %}

```js
window.matchMedia('(prefers-reduced-motion: reduce)')
```

{% endCompare %}

## Demo

He creado una pequeña demostración basada en los increíbles [🐈 gatos de estado HTTP](https://http.cat/) de Rogério Vicente. Primero, tómate un momento para apreciar la broma, es entretenida y esperaré. Ahora que ha vuelto, permítame presentarle la [demostración](https://prefers-reduced-motion.glitch.me). Cuando se desplaza hacia abajo, cada gato de estado HTTP aparece alternativamente desde el lado derecho o desde el izquierdo. Es una animación de 60 FPS suavecita, pero como se describió anteriormente, a algunos usuarios puede no gustarle o incluso marearse, por lo que la demostración está programada para respetar las `prefers-reduced-motion`. Esto incluso funciona de forma dinámica, por lo que los usuarios pueden cambiar sus preferencias sobre la marcha, sin necesidad de recargar. Si un usuario prefiere un movimiento reducido, las animaciones de revelación no necesarias desaparecen y solo queda el movimiento de desplazamiento normal. El siguiente screencast muestra la demostración en acción:

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/zWs45QPPI9C8CjF813Zx.mp4", muted=true, playsinline=true, controls=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CQAw3Ee43Dcv0JOsm9fl.png" %} <figcaption> Video de la aplicación de <a href="https://prefers-reduced-motion.glitch.me">demostración de <code>prefers-reduced-motion</code></a></figcaption></figure>

## Conclusiones

Respetar las preferencias del usuario es clave para los sitios web modernos, y los navegadores exponen cada vez más funciones para permitir que los desarrolladores web lo puedan hacer. Otro ejemplo lanzado es [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme) (preferencia por esquema de colores), que detecta si el usuario prefiere un esquema de color claro u oscuro. Puedes leer todo sobre `prefers-color-scheme` en mi artículo [Hello Darkness, My Old Friend](/prefers-color-scheme) 🌒.

El Grupo de trabajo de CSS está estandarizando actualmente más [consultas de medios de preferencias de usuario](https://drafts.csswg.org/mediaqueries-5/#mf-user-preferences) como[`prefers-reduced-transparency`](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-transparency) (detecta si el usuario prefiere transparencia reducida), [`prefers-contrast`](https://drafts.csswg.org/mediaqueries-5/#prefers-contrast) (detecta si el usuario ha solicitado al sistema que aumente o disminuya la cantidad de contraste entre colores) e [`inverted-colors`](https://drafts.csswg.org/mediaqueries-5/#inverted) (detecta si el usuario prefiere que los colores sean invertidos). 👀 ¡Manténgase atento a este espacio y le informaremos de una vez cuando sean lanzadas en Chrome!

## (Bonificación) Forzar movimiento reducido en todos los sitios web

No todos los sitios recurrirán a `prefers-reduced-motion`, o tal vez no la cantidad suficiente para su gusto. Si, por cualquier motivo, desea detener el movimiento en todos los sitios web, puede hacerlo. Una forma de hacer que esto suceda es inyectar una hoja de estilo con el siguiente CSS en cada página web que visite. Existen varias [extensiones de navegador](https://chrome.google.com/webstore/search/user%20stylesheets?_category=extensions) (¡úselas bajo su propio riesgo!) que permiten hacer esto.

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
}
```

La forma en que esto funciona es que el CSS anterior anula la duración de todas las animaciones y transiciones a un tiempo tan corto que ni se notan. Como algunos sitios web dependen de que se ejecute una animación para que funcione correctamente (tal vez porque un cierto paso depende de la activación del [evento `animationend`](https://developer.mozilla.org/docs/Web/API/HTMLElement/animationend_event)), el enfoque más radical usando `animation: none !important;` no funcionaría. Incluso no se garantiza que el truco anterior tenga éxito en todos los sitios web (por ejemplo, no puede detener el movimiento que se inició a través de la [API de animaciones web](https://developer.mozilla.org/docs/Web/API/Web_Animations_API)), así que asegúrese de desactivarlo cuando note una interrupción.

## Enlaces relacionados

- Último borrador del editor de la especificación de [Consultas de medios de nivel 5.](https://drafts.csswg.org/mediaqueries-5/#prefers-reduced-motion)
- `prefers-reduced-motion` el [estado de la plataforma Chrome](https://www.chromestatus.com/feature/5597964353404928) .
- `prefers-reduced-motion` [error de Chromium](http://crbug.com/722548).
- Blink [Intención de implementar la publicación](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/NZ3c9d4ivA8/BIHFbOj6DAAJ).

## Agradecimientos

Un agradecimiento gigantesco a [Stephen McGruer,](https://github.com/stephenmcgruer) que implementó `prefers-reduced-motion` en Chrome y, junto a [Rob Dodson,](https://twitter.com/rob_dodson) también revisó este artículo. [Imagen principal](https://unsplash.com/photos/im7Tiw1OY7c) de Hannah Cauhepe en Unsplash.
