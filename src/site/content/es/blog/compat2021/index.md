---
layout: post
title: 'Compat 2021: Eliminación de los cinco principales puntos débiles de compatibilidad en la web'
subhead: 'Google está trabajando con otros proveedores de navegadores y socios de la industria para corregir los cinco principales puntos débiles de compatibilidad de los navegadores para los desarrolladores web: CSS flexbox, CSS Grid, `position: sticky`, `aspect-ratio` y las transformaciones CSS.'
description: 'Obtenga más información sobre cómo Google está trabajando con otros proveedores de navegadores y socios de la industria para corregir los cinco principales puntos débiles de compatibilidad de los navegadores para desarrolladores web: CSS flexbox, CSS Grid, `position: sticky`, `aspect-ratio` y transformaciones CSS.'
authors:
  - robertnyman
  - foolip
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/KQ5oNcLGKdBSuUM8pFPx.jpeg
alt: Un rompecabezas al que le falta una pieza.
date: 2021-03-22
updated: 2021-11-16
tags:
  - blog
  - css
---

Google está trabajando con otros proveedores de navegadores y socios de la industria para solucionar los cinco principales puntos débiles de compatibilidad de los navegadores para los desarrolladores web. Las áreas de enfoque son CSS flexbox, CSS Grid, `position: sticky`, `aspect-ratio` y transformaciones CSS. Consulte el documento [Cómo puede contribuir y seguir adelante](#contribute) para aprender cómo participar.

## Antecedentes

La compatibilidad en la web siempre ha sido un gran desafío para los desarrolladores. En los últimos años, Google y otros socios, incluidos Mozilla y Microsoft, se propusieron aprender más sobre los principales puntos débiles para los desarrolladores web, para impulsar nuestro trabajo y priorizar para mejorar la situación. Este proyecto está conectado con el trabajo de [Satisfacción del desarrollador de Google](/developer-satisfaction) (DevSAT) y comenzó a mayor escala con la creación de las [Encuestas MDN DNA (Evaluación de las necesidades del desarrollador)](https://insights.developer.mozilla.org/) en 2019 y 2020, además de un esfuerzo de investigación profundo presentado en el [Informe de compatibilidad de los navegadores con MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html). Se han realizado investigaciones adicionales en varios canales, como las encuestas [Estado de CSS](https://stateofcss.com/) y [Estado de JS](https://stateofjs.com/).

El objetivo en 2021 es eliminar los problemas de compatibilidad del navegador en cinco áreas clave de enfoque para que los desarrolladores puedan construir con confianza sobre ellas como bases confiables. Este esfuerzo se llama [**#Compat 2021**](https://twitter.com/search?q=%23compat2021&src=typed_query&f=live).

## Elegir en qué enfocarse

Si bien existen problemas de compatibilidad de los navegadores básicamente en toda la plataforma web, el enfoque de este proyecto se centra en una pequeña cantidad de las áreas más problemáticas que se pueden mejorar significativamente, para que dejen de ser problemas principales para los desarrolladores.

El proyecto de compatibilidad utiliza varios criterios que influyen en cuáles áreas priorizar, algunos de ellos son:

- Uso de funciones. Por ejemplo, flexbox se usa en el [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) de todas las vistas de página y la adopción está creciendo fuertemente en [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout).

- Número de errores (en [Chromium](https://bugs.chromium.org/p/chromium/issues/list) , [Gecko](https://bugzilla.mozilla.org/describecomponents.cgi) , [WebKit](https://bugs.webkit.org/)) y, para Chromium, cuántas estrellas tienen esos errores.

- Resultados de las encuestas:

    - [Encuestas de ADN MDN](https://insights.developer.mozilla.org/)
    - [Informe de compatibilidad de los navegadores con MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
    - Características más conocidas y utilizadas del [Estado de CSS](https://2020.stateofcss.com/features/)

- Resultados de las [pruebas de plataforma web](https://github.com/web-platform-tests/wpt#the-web-platform-tests-project). Por ejemplo, [flexbox en wpt.fyi](https://wpt.fyi/results/css/css-flexbox).

- ¿[Puedo utilizar](https://caniuse.com/) las funciones más buscadas?

## Las cinco áreas de enfoque principales en 2021

En 2020, Chromium comenzó a trabajar para abordar las áreas principales descritas en [Mejora de la compatibilidad del navegador de Chromium en 2020](https://blog.chromium.org/2020/06/improving-chromiums-browser.html). En 2021, comenzamos un esfuerzo dedicado para ir aún más lejos. Google y [Microsoft están trabajando juntos para abordar los principales problemas en Chromium](https://blogs.windows.com/msedgedev/2021/03/22/better-compatibility-compat2021/) junto con [Igalia](https://www.igalia.com/). Igalia, un colaborador habitual de Chromium y WebKit, que además mantiene el puerto oficial de WebKit para dispositivos integrados, ha brindado un gran apoyo y se ha involucrado en estos esfuerzos de compatibilidad, además ayudará a abordar y rastrear los problemas identificados.

Estas son las áreas programadas para su reparación en 2021.

### CSS flexbox

[CSS flexbox](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout) se [usa ampliamente](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) en la web y todavía existen algunos desafíos importantes para los desarrolladores. Por ejemplo, tanto [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=721123) como [WebKit](https://bugs.webkit.org/show_bug.cgi?id=209983) han tenido problemas con contenedores flex `auto-height` que generan imágenes de tamaño incorrecto.

<div class="switcher">
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/qmKoKHkZga5hgBeiHuBz.png", alt="Foto estirada de un tablero de ajedrez.", width="800", height="400" %} <figcaption style="margin-top: auto"> Imagen de tamaño incorrecto debido a errores. </figcaption></figure>
    <figure style="display: flex; flex-direction: column;">{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/0ruhCiZKRP9jBhnN70Xh.png", alt="Tablero de ajedrez", width="800", height="800" %} <figcaption style="margin-top: auto"> Imagen de tamaño correcto.<br> Foto de <a href="https://unsplash.com/photos/ab5OK9mx8do">Alireza Mahmoudi.</a> </figcaption></figure>
</div>

La publicación de blog [Flexbox Cats de Igalia](https://blogs.igalia.com/svillar/2021/01/20/flexbox-cats-a-k-a-fixing-images-in-flexbox/) profundiza en estos problemas con muchos más ejemplos.

#### Por qué se prioriza

- Encuestas: es un problema principal en el [Informe de compatibilidad de los navegadores con MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html), más conocido y utilizado en el [Estado de CSS](https://2020.stateofcss.com/features/)
- Pruebas: el [85% pasa](https://wpt.fyi/results/css/css-flexbox) en todos los navegadores
- Uso: [75%](https://www.chromestatus.com/metrics/feature/timeline/popularity/1692) de las visitas a la página, con un crecimiento fuerte en [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)

### CSS Grid

[CSS Grid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout) es un componente básico para los diseños web modernos, que reemplaza muchas técnicas y soluciones anteriores. A medida que crece la adopción, debe ser sólido como una roca, de modo que las diferencias entre los navegadores nunca sean una razón para evitarlo. Un área que falta es la capacidad de animar diseños de cuadrícula, compatible con Gecko pero no con [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=759665) o [WebKit](https://bugs.webkit.org/show_bug.cgi?id=204580). Cuando se admiten, efectos como este son posibles:

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/Ovs6wg9o5AJUG4IIoVvj.mp4", height="400", controls=false, autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> Demostración animada de ajedrez de <a href="https://chenhuijing.com/blog/recreating-the-fools-mate-chess-move-with-css-grid/">Chen Hui Jing</a>.</figcaption></figure>

#### Por qué se prioriza

- Encuestas: finalista en [Informe de compatibilidad de los navegadores con MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html), bien conocido pero utilizado con menos frecuencia en [Estado de CSS](https://2020.stateofcss.com/features/)
- Pruebas: el [75% pasa](https://wpt.fyi/results/css/css-grid) en todos los navegadores
- Uso: [8% y crecimiento constante](https://www.chromestatus.com/metrics/feature/timeline/popularity/1693), leve crecimiento en [HTTP Archive](https://almanac.httparchive.org/en/2020/css#layout)

{% Aside %} Si bien una función más nueva como la [subcuadrícula](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid) es importante para los desarrolladores, no forma parte de este esfuerzo específico. Para hacerle seguimiento, consulte [Compatibilidad de la subcuadrícula en MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid#browser_compatibility). {% endAside %}

### CSS position: sticky

[El posicionamiento fijo](https://developer.mozilla.org/docs/Web/CSS/position#sticky_positioning) permite que el contenido se adhiera al borde de la ventana gráfica y se usa comúnmente para encabezados que siempre están visibles en la parte superior de la ventana gráfica. Si bien es compatible con todos los navegadores, existen casos de uso comunes en los que no funciona como se esperaba. Por ejemplo, [los encabezados fijos de tablas](https://bugs.chromium.org/p/chromium/issues/detail?id=702927) no son compatibles con Chromium y, aunque ahora se [admiten detrás de un indicador](https://bugs.chromium.org/p/chromium/issues/detail?id=958381), los resultados son inconsistentes en todos los navegadores:

<div class="switcher">
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/DtNtuWCZUNwi7GGSBPvA.png", alt="", width="250", height="350" %}<figcaption> Chromium con "TablesNG" </figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/hJwLpLeJNfG6kVBUK9Yn.png", alt="", width="250", height="350" %}<figcaption> Geco </figcaption></figure>
    <figure>{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/od1YyD2BoBqfrnkzynUK.png", alt="", width="250", height="350" %} <figcaption> WebKit </figcaption></figure>
</div>

Vea a Rob Flack en su <a href="https://output.jsbin.com/xunosud">demostración de encabezados fijos de tablas</a>.

#### Por qué se prioriza

- Encuestas: es muy conocido/utilizado en [Estado de CSS](https://2020.stateofcss.com/features/) y se mencionó varias veces en el [Informe de compatibilidad de los navegadores con MDN](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html)
- Pruebas: [66% pasa](https://wpt.fyi/results/css/css-position/sticky?label=master&label=experimental&product=chrome&product=firefox&product=safari&aligned&q=%28status%3A%21missing%26status%3A%21pass%26status%3A%21ok%29) en todos los navegadores
- Uso: [8%](https://www.chromestatus.com/metrics/feature/timeline/popularity/3354)

### Propiedad  aspect-ratio de CSS

La nueva propiedad [`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) de CSS facilita el mantenimiento de una relación de ancho a alto constante para los elementos, lo que elimina la necesidad del conocido [truco `padding-top`](/aspect-ratio/#the-old-hack-maintaining-aspect-ratio-with-padding-top):

<div class="switcher">{% Compare 'worse', 'Using padding-top' %} ```css .container { width: 100%; padding-top: 56.25%; } ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'Using aspect-ratio' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

Debido a que es un caso de uso tan común, se espera que se use ampliamente, y queremos asegurar que sea sólido en todos los escenarios comunes y en todos los navegadores.

#### Por qué se prioriza

- Encuestas: ya es bien conocido, pero aún no se utiliza mucho en el [Estado de CSS](https://2020.stateofcss.com/features/)
- Pruebas: el [27% pasa](https://wpt.fyi/results/css/css-sizing/aspect-ratio) en todos los navegadores
- Uso: [3%](https://www.chromestatus.com/metrics/css/timeline/popularity/657) y se espera que crezca

### Transformaciones CSS

Las [transformaciones CSS](https://developer.mozilla.org/docs/Web/CSS/transform) han sido compatibles con todos los navegadores durante muchos años y se utilizan ampliamente en la web. Sin embargo, todavía quedan muchas áreas en las que no funcionan igual en todos los navegadores, especialmente con animaciones y transformaciones 3D. Por ejemplo, un efecto de voltear una carta puede ser muy inconsistente en todos los navegadores:

<figure>{% Video src="video/vgdbNJBYHma2o62ZqYmcnkq3j0o1/RhyPpk7dUooEobKZ3VOC.mp4", controls=false, autoplay=true, loop=true, muted=true, playsinline=true %}<figcaption> Efecto de voltear una carta en Chromium (izquierda), Gecko (centro) y WebKit (derecha). Demostración de David Baron a partir de un <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=1008483#c42">comentario de error</a>.</figcaption></figure>

#### Por qué se prioriza

- Encuestas: se conoce bastante y se utiliza en [Estado de CSS](https://2020.stateofcss.com/features/)
- Pruebas: el [55% pasa](https://wpt.fyi/results/css/css-transforms) en todos los navegadores
- Uso: [80%](https://www.chromestatus.com/metrics/css/timeline/popularity/446)

## Cómo puede contribuir y hacer seguimiento {: #contribute }

Hágale seguimiento y comparta cualquier actualización que publiquemos en [@ChromiumDev](https://twitter.com/ChromiumDev) o en la [lista pública de correo, Compat 2021](https://groups.google.com/g/compat2021). Verifique que existan errores o [preséntenlos](/how-to-file-a-good-bug/) para problemas que haya experimentado y, si falta algo, comuníquese con los canales mencionados anteriormente.

Habrá actualizaciones periódicas sobre el progreso aquí en web.dev y también puede seguir el progreso de cada área de enfoque en el [Panel de control Compat 2021](https://wpt.fyi/compat2021).

<figure><p data-md-type="paragraph"><a href="https://wpt.fyi/compat2021"> {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/BgX0dnesIhLaFAKyILzk.png", alt="Panel de control Compat 2021", width="800", height="942" %} </a></p>
<figcaption>El Panel de control Compat 2021 (captura de pantalla tomada el 16 de noviembre de 2021).</figcaption></figure>

Esperamos que este esfuerzo concertado entre los proveedores de navegadores para mejorar la confiabilidad y la interoperabilidad lo ayude a crear cosas increíbles en la web.
