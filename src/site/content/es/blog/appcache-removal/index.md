---
layou: post
title: Preparación para la eliminación de AppCache
subhead: Chrome 85 elimina la compatibilidad con AppCache de forma predeterminada. La mayoría de los desarrolladores deberían migrar de AppCache ahora y no esperar más.
authors:
  - jeffposnick
description: Detalles de los planes de Chrome y otros navegadores para eliminar AppCache.
date: 2020-05-18
updated: 2021-08-23
tags:
  - blog
  - chrome-84
  - origin-trials
  - service-worker
hero: image/admin/YDs2H4gLPhIwPMjPtc8o.jpg
alt: Un contenedor de almacenamiento a la antigua.
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1776670052997660673"
---

Siguiendo [los anuncios anteriores](https://blog.chromium.org/2020/01/appcache-scope-restricted.html), la compatibilidad con [AppCache](https://developer.mozilla.org/docs/Web/API/Window/applicationCache) se eliminará de Chrome y otros navegadores basados en Chromium. Alentamos a los desarrolladores a migrar fuera de AppCache ahora, en lugar de esperar más.

Los [trabajadores de servicio](https://developer.chrome.com/docs/workbox/service-worker-overview/), que son ampliamente compatibles con los navegadores actuales, ofrecen una alternativa para proporcionar la experiencia sin conexión que ofrecía AppCache. Consulte [Estrategias de migración](#migration-strategies).

## Línea de tiempo

Los [cambios recientes](https://blog.chromium.org/2020/03/chrome-and-chrome-os-release-updates.html) en el cronograma de lanzamiento de Chrome significan que el momento de algunos de estos pasos puede variar. Intentaremos mantener actualizada esta línea de tiempo, pero en este punto, migre fuera de AppCache lo antes posible, en lugar de esperar hitos específicos.

Una función "obsoleta"(deprecated) aún existe, pero muestra mensajes de advertencia que desalientan su uso. Una función "eliminada" ya no existe en el navegador.

<div>
  <table>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/UKF8cK0EwMI/m/NLhsIrs-AQAJ">Hecha obsoleta en contextos no seguros</a></td>
    <td>Chrome 50 (abril de 2016)</td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/ANnafFBhReY/m/1Xdr53KxBAAJ?pli=1">Eliminación de contextos no seguros</a></td>
    <td>Chrome 70 (octubre de 2018)</td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/0daqyD8kCQAJ">Hecha obsoleta en contextos seguros</a></td>
    <td>Chrome 79 (diciembre de 2019)</td>
    </tr>
    <tr>
    <td><a href="https://blog.chromium.org/2020/01/appcache-scope-restricted.html">Restricción del alcance de AppCache</a></td>
    <td>Chrome 80 (febrero de 2020)</td>
    </tr>
    <tr>
    <td>Comienza la prueba de origen "inversa"</td>
    <td>Chrome 84 (julio de 2020)</td>
    </tr>
    <tr>
    <td>
<a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/AvxoE6JpBgAJ">Eliminación de contextos seguros</a>, excepto aquellos que participaron en la prueba de origen</td>
    <td>Chrome 85 (agosto de 2020)</td>
    </tr>
    <tr>
    <td>Eliminación completa de contextos seguros para todos, con la finalización de la prueba de origen</td>
    <td>5 de octubre de 2021 (aproximadamente Chrome 95)</td>
    </tr>
  </table>
</div>

{% Aside %} Esta línea de tiempo se aplica a Chrome en **todas las plataformas excepto iOS**. También hay una línea de tiempo ajustada para el uso de AppCache dentro de un [WebView](https://developer.android.com/reference/android/webkit/WebView) de Android. Para obtener más información, consulte [La historia en las plataformas](#the-cross-platform-story) más adelante en esta publicación. {% endAside %}

## Prueba de origen

La línea de tiempo enumera dos próximos hitos para la eliminación. A partir de Chrome 85, AppCache ya no estará disponible en Chrome de forma predeterminada. Los desarrolladores que necesiten tiempo adicional para migrar fuera de AppCache pueden [registrarse](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673) [para una prueba de origen](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md) "inversa" para ampliar la disponibilidad de AppCache para sus aplicaciones web. La prueba de origen comenzará en Chrome 84 (antes de la eliminación predeterminada en Chrome 85) y estará activa hasta el 5 de octubre de 2021 (aproximadamente Chrome 95). En ese momento, AppCache se eliminará por completo para todos, incluso para quienes se registraron para la prueba de origen.

{% Aside %} ¿Por qué llamamos a esto una prueba de origen "inversa"? Normalmente, una prueba de origen permite a los desarrolladores optar por el acceso temprano a la nueva funcionalidad antes de que se provea de forma predeterminada en Chrome. En este caso, permitimos a los desarrolladores optar por el uso de tecnología heredada incluso después de que se haya eliminado de Chrome, pero solo temporalmente. {% endAside %}

Para participar en la prueba de origen "inversa":

<ol>
<li>
<a href="https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673">Solicite un token</a> para su origen.</li>
<li>Agregue el token a sus páginas HTML. Hay <a href="https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin">dos formas</a> de hacerlo:<ul>
<li> Agregue una etiqueta <code>&lt;meta&gt;</code> <code>origin-trial</code> al encabezado de cada página. Por ejemplo: <code>&lt;meta http-equiv="origin-trial" content="AQUI_VA_EL_TOKEN"&gt;</code>
</li>
<li> Alternativamente, configure su servidor para devolver respuestas que contengan el encabezado HTTP <code>Origin-Trial</code>. El encabezado de respuesta resultante debería tener un aspecto similar a: <code>Origin-Trial: AQUI_VA_EL_TOKEN</code>
</li>
</ul>
</li>
<li>Agregue el mismo token a sus manifiestos de AppCache. Haga esto a través de un nuevo campo en su manifiesto, con el formato:</li>
</ol>

```text
ORIGIN-TRIAL:
AQUI_VA_EL_TOKEN
```

(Debe haber una nueva línea entre `ORIGIN-TRIAL` y su token).





{% Aside %} El token de un manifiesto **debe** estar en un `ORIGIN-TRIAL` del propio manifiesto. A diferencia del token de una página HTML, no se puede proporcionar a través de un encabezado HTTP. {% endAside %}

Puede ver un proyecto de muestra incrustado a continuación que demuestra cómo agregar los tokens de prueba de origen correctos en los archivos `index.html` y `manifest.appcache`.

{% Glitch { id: 'appcache-reverse-ot', path: 'manfiest.appcache', height: 480 } %}

### ¿Por qué se necesitan tokens en varios lugares?

El **mismo token de prueba de origen** debe asociarse con:

- **Todas sus páginas HTML** que usan AppCache.
- **Todos sus manifiestos de AppCache a** través del campo de manifiesto `ORIGIN-TRIAL`.

Si ha participado en pruebas de origen en el pasado, es posible que haya agregado el token solo a sus páginas HTML. La prueba de origen "inversa" de AppCache es especial porque también necesita asociar un token con cada uno de sus manifiestos de AppCache.

Agregar el token de prueba de origen a sus páginas HTML habilita la interfaz `window.applicationCache` desde sus aplicaciones web. Las páginas que no están asociadas con un token no podrán usar los métodos y eventos de `window.applicationCache`. Las páginas sin un token tampoco podrán cargar recursos desde AppCache. A partir de Chrome 85, se comportarán como si AppCache no hubiera existido.

Agregar el token de prueba de origen a sus manifiestos de AppCache indica que cada manifiesto sigue siendo válido. A partir de Chrome 85, cualquier manifiesto que no tenga un `ORIGIN-TRIAL` se tratará como mal formado y se ignorarán las reglas dentro del manifiesto.

### Logística y tiempos de implementación de la prueba de origen

Si bien la prueba de origen "inversa" comienza oficialmente con Chrome 84, puede [registrarse](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673) para la prueba de origen hoy y agregar los tokens a sus manifiestos HTML y AppCache. A medida que la audiencia de su aplicación web se actualice gradualmente a Chrome 84, todos los tokens que ya haya agregado entrarán en vigor.

Una vez que haya agregado un token a su manifiesto de AppCache, visite `about://appcache-internals` para confirmar que su instancia local de Chrome (versión 84 o posterior) ha asociado correctamente el token de prueba de origen con las entradas en caché de su manifiesto. Si se reconoce su prueba de origen, debería ver un campo con `Token Expires: Tue Apr 06 2021...` en esa página, asociado con su manifiesto:

<figure>{% Img src="image/admin/Xid94kdPT5yGbQzBL4at.jpg", alt="Interfaz about://appcache-internals mostrando un token reconocido.", width="550", height="203" %}</figure>

## Prueba antes de la eliminación

Le recomendamos encarecidamente que migre fuera de AppCache tan pronto como sea posible. Si desea probar la eliminación de AppCache en sus aplicaciones web, utilice la [bandera](https://www.chromium.org/developers/how-tos/run-chromium-with-flags) `about://flags/#app-cache` para simular su eliminación. Esta bandera está disponible a partir de Chrome 84.

## Estrategias de migración {: #migration-strategies }

Los trabajadores de servicio, que son [ampliamente compatibles con los navegadores actuales](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility), ofrecen una alternativa a la experiencia sin conexión proporcionada por AppCache.

Hemos proporcionado un [polyfill](https://github.com/GoogleChromeLabs/sw-appcache-behavior) que utiliza un trabajador de servicio para replicar algunas de las funciones de AppCache, aunque no replica toda su interfaz. En particular, no reemplaza la interfaz `window.applicationCache` ni los eventos relacionados de AppCache.

Para casos más complejos, bibliotecas como [Workbox](https://developer.chrome.com/docs/workbox/) ofrecen una manera fácil de crear un trabajador de servicio moderno para su aplicación web.

### Los trabajadores de servicio y AppCache son mutuamente excluyentes

Mientras trabaja en su estrategia de migración, tenga en cuenta que Chrome deshabilitará la funcionalidad AppCache en cualquier página que se cargue bajo el [control](/service-worker-lifecycle/#scope-and-control) de un trabajador del servicio. En otras palabras, tan pronto como implemente un trabajador de servicio que controle una página determinada, ya no podrá usar AppCache en ella.

Debido a esto, le recomendamos que no intente migrar a trabajadores de servicio pieza por pieza. Sería un error implementar un trabajador de servicio que solo contiene parte de su lógica de caché. No puede recurrir a AppCache para "llenar los vacíos".

De manera similar, si implementa un trabajador de servicio antes de la eliminación de AppCache y luego descubre que necesita revertir a su implementación anterior de AppCache, debe asegurarse de [anular el registro](https://stackoverflow.com/a/33705250/385997) de ese trabajador de servicio. Siempre que haya un trabajador de servicio registrado en el alcance de una página determinada, no se utilizará AppCache.

## La historia  en las plataformas

Le recomendamos que haga un seguimiento con un proveedor de navegadores específico si desea obtener más información sobre sus planes para la eliminación de AppCache.

### Firefox en todas las plataformas

Firefox declaró [obsoleta](https://www.fxsitecompat.dev/en-CA/docs/2015/application-cache-api-has-been-deprecated/) a AppCache en la versión 44 (septiembre de 2015) y ha [eliminado](https://www.fxsitecompat.dev/en-CA/docs/2019/application-cache-storage-has-been-removed-in-nightly-and-early-beta/) su soporte en sus versiones Beta y Nightly a partir de septiembre de 2019.

### Safari en iOS y macOS

Safari declaró [obsoleta](https://bugs.webkit.org/show_bug.cgi?id=181764) a AppCache a principios de 2018.

### Chrome en iOS

Chrome para iOS es un caso especial, ya que utiliza un motor de navegador diferente al de Chrome en otras plataformas: [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview). Actualmente, los trabajadores de servicio no son compatibles con las aplicaciones de iOS que usan WKWebView, y el anuncio de eliminación de AppCache de Chrome no cubre la [disponibilidad de AppCache en Chrome para iOS](https://webkit.org/status/#specification-application-cache). Tenga esto en cuenta si sabe que su aplicación web tiene una audiencia significativa en Chrome para iOS.

### WebViews de Android

Algunos desarrolladores de aplicaciones de Android usan Chrome [WebView](https://developer.android.com/reference/android/webkit/WebView) para mostrar contenido web y también pueden usar AppCache. Sin embargo, no es posible habilitar una prueba de origen para WebView. Por ello, Chrome WebView admitirá AppCache sin una prueba de origen hasta que se lleve a cabo la eliminación final, esperada en Chrome 90.

## Aprenda más

A continuación, se muestran algunos recursos para los desarrolladores que migran de AppCache a los trabajadores de servicio.

### Artículos

- [Trabajadores de servicio: una introducción](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [El ciclo de vida del trabajador de servicio](/service-worker-lifecycle/)
- [Entrenamiento de aplicaciones web progresivas](https://developers.google.com/web/ilt/pwa)
- [Fiabilidad de la red](/reliable/)

### Herramientas

- [Polyfill de AppCache](https://github.com/GoogleChromeLabs/sw-appcache-behavior)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [PWA Builder](https://www.pwabuilder.com/)

## Obtenga ayuda

Si tiene un problema con una herramienta específica, haga un reporte del problema en su repositorio de GitHub.

Puede hacer una pregunta general sobre la migración fuera de AppCache en [Stack Overflow](https://stackoverflow.com/), usando la etiqueta <code>[html5-appcache](https://stackoverflow.com/questions/tagged/html5-appcache)</code>.

Si encuentra un error relacionado con la eliminación de AppCache de Chrome, por favor [repórtelo](https://crbug.com/new) mediante el seguimiento de incidencias de Chromium.

*Imagen héroe basada en [Archivos de la Institución Smithsonian, Acc. 11-007, Caja 020, Imagen No. MNH-4477](https://www.si.edu/object/usnm-storage-drawer:siris_arc_391797).*
